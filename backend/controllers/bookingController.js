const Booking = require('../models/Booking');
const { Listing } = require('../models/Listing');

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
