const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// TODO: Add authMiddleware
router.post('/', bookingController.createBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/all', bookingController.getAllBookings);


module.exports = router;
