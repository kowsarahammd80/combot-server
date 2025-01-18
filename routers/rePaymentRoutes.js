const router = require('express').Router()
const rePaymentController = require('../controllers/rePaymentController')
const bkashMiddleware = require('../middleware/bkashMiddleware')

router.post('/test/payment/creates', bkashMiddleware.bkash_auth,rePaymentController.payment_create)
router.get('/test/payment/callback', bkashMiddleware.bkash_auth,rePaymentController.call_back)
router.get('/test/payment/all', bkashMiddleware.bkash_auth,rePaymentController.get_all_payments);
router.get('/test/payment/refund/:trxID', bkashMiddleware.bkash_auth, rePaymentController.refundPayment)

module.exports = router;