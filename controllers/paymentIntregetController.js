const bKashService = require("../service/paymentIntregetService");

const bKashController = {
  async authenticate(req, res) {
    try {
      const data = await bKashService.authenticate();
      res.status(200).json({ message: "Authenticated successfully", data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createPayment(req, res) {
    const { amount, invoiceNumber } = req.body;
    try {
      const data = await bKashService.createPaymentIntreget(amount, invoiceNumber);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async executePayment(req, res) {
    const { paymentID } = req.body;
    try {
      const data = await bKashService.executePayment(paymentID);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async refundTransaction(req, res) {
    const { paymentID, amount } = req.body;
    try {
      const data = await bKashService.refundTransaction(paymentID, amount);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = bKashController;