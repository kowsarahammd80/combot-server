const router = require('express').Router()
const rePaymentController = require('../controllers/rePaymentController')
const bkashMiddleware = require('../middleware/bkashMiddleware')

router.post('/test/payment/creates', bkashMiddleware.bkash_auth,rePaymentController.payment_create)
router.get('/test/payment/callback', bkashMiddleware.bkash_auth,rePaymentController.call_back)

module.exports = router;