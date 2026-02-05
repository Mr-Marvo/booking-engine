const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Flexible field for different booking types
        default: {}
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ listingId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
