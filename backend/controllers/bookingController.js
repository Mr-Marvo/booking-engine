const Booking = require('../models/Booking');
const { Listing } = require('../models/Listing');
const Notification = require('../models/Notification');

exports.createBooking = async (req, res) => {
    try {
        const { userId, listingId, details, totalPrice } = req.body;
        // In production: const userId = req.user.id; // Extract from JWT middleware

        // Verify listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Create new booking
        const newBooking = new Booking({
            userId,
            listingId,
            details,
            status: 'confirmed',
            totalPrice
        });

        await newBooking.save();

        // Populate listing and user details
        await newBooking.populate('listingId', 'title type price');
        await newBooking.populate('userId', 'name email');

        // --- Notification Logic ---

        console.log('[Booking] Listing details:', {
            listingId: listing._id,
            listingTitle: listing.title,
            vendorId: listing.vendorId,
            vendorIdType: typeof listing.vendorId
        });

        // 1. For Admin
        const adminNotif = new Notification({
            recipient: 'admin',
            type: 'new_booking',
            message: `New booking for ${listing.title}`,
            data: { bookingId: newBooking._id, listingId: listing._id }
        });
        await adminNotif.save();

        req.io.to('admin').emit('notification', {
            ...adminNotif.toObject(),
            data: newBooking // Send full booking data for immediate UI update if needed
        });

        // 2. For Vendor
        const vendorNotif = new Notification({
            recipient: listing.vendorId.toString(), // Convert ObjectId to String
            type: 'new_booking',
            message: `New booking received for ${listing.title}`,
            data: { bookingId: newBooking._id, listingId: listing._id }
        });
        await vendorNotif.save();

        const vendorRoom = `vendor_${listing.vendorId}`;
        console.log('[Booking] Emitting notification to vendor room:', vendorRoom, 'Vendor ID:', listing.vendorId);
        req.io.to(vendorRoom).emit('notification', {
            ...vendorNotif.toObject(),
            data: newBooking
        });

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from URL params
        // In production: const userId = req.user.id; // Extract from JWT middleware

        const userBookings = await Booking.find({ userId })
            .populate('listingId', 'title type price location')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 }); // Most recent first

        res.status(200).json(userBookings);
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('listingId', 'title type price vendorId')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getVendorBookings = async (req, res) => {
    try {
        const vendorId = req.user._id;

        // Find listings belonging to this vendor
        // We need to look up bookings where the listingId -> vendorId matches current user.
        // Option 1: Find all listings for vendor, then find bookings for those listings.
        // Option 2: Populate and filter (less efficient but okay for now). 
        // Better: Use aggregate or two queries.

        // Step 1: Get all listing IDs for this vendor
        const listings = await Listing.find({ vendorId }).select('_id');
        const listingIds = listings.map(l => l._id);

        // Step 2: Find bookings for these listings
        const bookings = await Booking.find({ listingId: { $in: listingIds } })
            .populate('listingId', 'title type price location')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get vendor bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
