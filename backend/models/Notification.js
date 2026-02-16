const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: String, // 'admin' or userId
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['new_booking', 'new_vendor', 'new_listing']
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
