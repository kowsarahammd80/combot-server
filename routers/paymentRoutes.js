const express = require('express');
const paymentController= require('../controllers/paymentController.js')

const router = express.Router();

router.route('/')
.post(paymentController.postPayment)

module.exports = router;