const router = require('express').Router()
const bkashPaymentController = require('../controllers/bkashPaymentController')
// const bkashPaymentController = require('../controllers/bkashPaymentController.js')
const bkashMiddleware = require ('../middleware/bkashMiddleware.js')

router.post('/bkash/payment/create',bkashMiddleware.bkash_auth, bkashPaymentController.payment_create)

router.get('/bkash/payment/callback',bkashMiddleware.bkash_auth, bkashPaymentController.call_back)

router.get('/bkash/payment/callback',bkashMiddleware.bkash_auth, bkashPaymentController.call_back)

router.get('/bkash/payment/refund/:trxID',bkashMiddleware.bkash_auth, bkashPaymentController.refund)

module.exports = router