const express = require('express');
const router = express.Router();
const payStationController = require('../controllers/payStationController');

router.post('/payStation/create', payStationController.create_payment);

// Route for payment callback
router.get('/payment/callback', payStationController.payment_callback);

// Add other routes if needed
// Example: router.get('/all-payments', PayStationController.get_all_payments);

module.exports = router;