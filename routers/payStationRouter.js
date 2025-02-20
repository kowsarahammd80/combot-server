const express = require('express');
const router = express.Router();
const payStationController = require('../controllers/payStationController');

router.post('/payStation/create', payStationController.create_payment);
router.get('/payment/callback', payStationController.payment_callback);
// router.post("/payment/refund", payStationController.refund_payment);


// Add other routes if needed
// Example: router.get('/all-payments', PayStationController.get_all_payments);

module.exports = router;