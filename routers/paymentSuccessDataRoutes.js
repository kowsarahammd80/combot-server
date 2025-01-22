const express = require('express');
const paymentSuccessDataController= require('../controllers/paymentSuccessDataController.js')

const router = express.Router();

// router.route('/getPaymentSuccessData')
// .get(paymentSuccessDataController.getRefundEmpty)

router.route('/getPaymentSuccessData')
.get(paymentSuccessDataController.getPaymentsController)

router.route('/getAbandonedPayments')
.get(paymentSuccessDataController.getAbandonedPaymentsController)

module.exports = router;