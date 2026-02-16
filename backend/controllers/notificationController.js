const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
    try {
        const user = req.user;
        let recipient;

        if (user.role === 'admin') {
            // Admins see 'admin' notifications AND notifications addressed to them specifically (if any)
            // But for simplicity based on our current logic:
            recipient = 'admin';
            // NOTE: If we want admins to also receive personal notifications, we'd use $or: [{recipient: 'admin'}, {recipient: user._id}]
            // For now, our system sends to 'admin' string.
        } else {
            recipient = user._id; // Vendors receive by ID
        }

        // We need to handle the case where admin might want to see both 'admin' scope and personal.
        // Let's stick to the emitter logic: 
        // Admin events send recipient: 'admin'
        // Vendor events send recipient: vendorId

        let query = { recipient: user.role === 'admin' ? 'admin' : user._id.toString() };

        console.log('[NotificationController] Fetching notifications:', {
            userRole: user.role,
            userId: user._id,
            query: query,
            recipientType: typeof query.recipient
        });

        const notifications = await Notification.find(query).sort({ createdAt: -1 });

        console.log('[NotificationController] Found notifications:', {
            count: notifications.length,
            notifications: notifications.map(n => ({
                id: n._id,
                recipient: n.recipient,
                recipientType: typeof n.recipient,
                message: n.message
            }))
        });

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { read: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const user = req.user;
        const recipient = user.role === 'admin' ? 'admin' : user._id.toString();

        await Notification.updateMany({ recipient, read: false }, { read: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clearAllNotifications = async (req, res) => {
    try {
        const user = req.user;
        const recipient = user.role === 'admin' ? 'admin' : user._id.toString();

        await Notification.deleteMany({ recipient });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Clear all error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
