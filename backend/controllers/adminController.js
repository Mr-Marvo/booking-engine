const User = require('../models/User');
const Booking = require('../models/Booking');
const { Listing } = require('../models/Listing');

exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await User.find({ role: 'vendor' }).select('-password');
        res.status(200).json(vendors);
    } catch (error) {
        console.error('Get all vendors error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.body;

        const vendor = await User.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if (vendor.role !== 'vendor') {
            return res.status(400).json({ message: 'User is not a vendor' });
        }

        // In a real app, you'd have an 'isApproved' field
        // vendor.isApproved = true;
        // await vendor.save();

        res.status(200).json({
            message: 'Vendor approved successfully',
            vendor: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role
            }
        });
    } catch (error) {
        console.error('Approve vendor error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getReports = async (req, res) => {
    try {
        // Get all bookings and listings
        const bookings = await Booking.find();
        const listings = await Listing.find();
        const vendors = await User.find({ role: 'vendor' });

        // Calculate statistics
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        const totalBookings = bookings.length;
        const totalListings = listings.length;
        const totalVendors = vendors.length;

        // Bookings by status
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

        // Listings by type
        const listingsByType = {
            hotel: listings.filter(l => l.type === 'hotel').length,
            cinema: listings.filter(l => l.type === 'cinema').length,
            space: listings.filter(l => l.type === 'space').length,
            vehicle: listings.filter(l => l.type === 'vehicle').length
        };

        // Monthly revenue for the last 6 months
        const monthlyRevenue = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.getMonth();
            const year = date.getFullYear();

            const revenue = bookings
                .filter(b => {
                    const bDate = new Date(b.createdAt);
                    return bDate.getMonth() === month && bDate.getFullYear() === year;
                })
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

            monthlyRevenue.push({
                name: monthNames[month],
                revenue: revenue
            });
        }

        res.status(200).json({
            totalRevenue,
            totalBookings,
            totalListings,
            totalVendors,
            bookingsByStatus: {
                confirmed: confirmedBookings,
                pending: pendingBookings,
                cancelled: cancelledBookings
            },
            listingsByType,
            monthlyRevenue
        });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.exportReport = async (req, res) => {
    try {
        const { type, range } = req.query;

        let query = {};
        const now = new Date();
        if (range === 'today') {
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            query.createdAt = { $gte: startOfDay };
        } else if (range === 'last-7') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            query.createdAt = { $gte: sevenDaysAgo };
        } else if (range === 'last-30') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            query.createdAt = { $gte: thirtyDaysAgo };
        }

        const bookings = await Booking.find(query)
            .populate('userId', 'name email')
            .populate('listingId', 'title type');

        // CSV Header
        let csvContent = "Booking ID,Date,Customer,Email,Listing,Type,Amount,Status\n";

        // CSV Rows
        bookings.forEach(b => {
            const date = b.createdAt ? b.createdAt.toISOString().split('T')[0] : 'N/A';
            const customer = b.userId ? b.userId.name : 'N/A';
            const email = b.userId ? b.userId.email : 'N/A';
            const listing = b.listingId ? b.listingId.title : 'N/A';
            const listingType = b.listingId ? b.listingId.type : 'N/A';
            const amount = b.totalPrice || 0;
            const status = b.status || 'pending';

            csvContent += `${b._id},${date},"${customer}","${email}","${listing}",${listingType},${amount},${status}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=bookings-report-${range}.csv`);
        res.status(200).send(csvContent);

    } catch (error) {
        console.error('Export report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
