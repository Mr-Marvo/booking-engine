const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// TODO: Add adminAuthMiddleware
router.get('/vendors', adminController.getAllVendors);
router.post('/vendors/approve', adminController.approveVendor);
router.get('/reports', adminController.getReports);
router.get('/export-report', adminController.exportReport);

module.exports = router;
