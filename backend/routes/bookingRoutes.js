const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, bookingController.createBooking);
router.get('/vendor', protect, authorize('vendor'), bookingController.getVendorBookings);
router.get('/user/:userId', protect, bookingController.getUserBookings);
router.get('/all', protect, authorize('admin'), bookingController.getAllBookings);


module.exports = router;
