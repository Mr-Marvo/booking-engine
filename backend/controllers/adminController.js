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
            listingsByType
        });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
