const express = require('express');
const paymentSuccessDataController= require('../controllers/paymentSuccessDataController.js')

const router = express.Router();

router.route('/postByDefaultAbandoned')
.post(paymentSuccessDataController.byDefaultAbandonedController)

router.route('/getPaymentSuccessData')
.get(paymentSuccessDataController.getPaymentsController)

router.route('/getAbandonedPaymentsAll')
.get(paymentSuccessDataController.getAbandonedPaymentsController)


module.exports = router;