const express = require("express");
const bKashController = require("../controllers/paymentIntregetController");

const router = express.Router();

router.post("/authenticate", bKashController.authenticate);
router.post("/create-payment", bKashController.createPayment);
router.post("/execute-payment", bKashController.executePayment);
router.post("/refund", bKashController.refundTransaction);

module.exports = router;