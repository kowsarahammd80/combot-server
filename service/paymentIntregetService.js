const axios = require("axios");
const PaymentIntreget = require("../models/paymentIntregetModal");

const credentials = {
  username: "sandboxTokenizedUser02",
  password: "sandboxTokenizedUser02@12345",
  app_key: "4f6o0cjiki2rfm34kfdadl1eqq",
  app_secret: "2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b",
};

const endpoints = {
  grantToken: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant",
  createPayment: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create",
  executePayment: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute",
  refundTransaction: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/payment/refund",
};

let token = "";

const bKashService = {
  async authenticate() {
    try {
      const response = await axios.post(
        endpoints.grantToken,
        {
          app_key: credentials.app_key,
          app_secret: credentials.app_secret,
        },
        {
          auth: {
            username: credentials.username,
            password: credentials.password,
          },
        }
      );
      token = response.data.id_token;
      return response.data;
    } catch (error) {
      throw new Error("Authentication with bKash API failed.");
    }
  },

  async createPaymentIntreget(amount, invoiceNumber) {
    try {
      const payment = await PaymentIntreget.create({ amount, invoiceNumber });
      const response = await axios.post(
        endpoints.createPayment,
        {
          amount,
          merchantInvoiceNumber: invoiceNumber,
        },
        {
          headers: { Authorization: token },
        }
      );
      payment.paymentID = response.data.paymentID;
      payment.status = "Pending";
      await payment.save();
      return response.data;
    } catch (error) {
      throw new Error("Payment creation failed.");
    }
  },

  async executePayment(paymentID) {
    try {
      const response = await axios.post(
        `${endpoints.executePayment}/${paymentID}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      if (response.data.statusCode === "0000") {
        await PaymentIntreget.findOneAndUpdate(
          { paymentID },
          { status: "Completed" },
          { new: true }
        );
      }
      return response.data;
    } catch (error) {
      throw new Error("Payment execution failed.");
    }
  },

  async refundTransaction(paymentID, amount) {
    try {
      const response = await axios.post(
        endpoints.refundTransaction,
        {
          paymentID,
          amount,
        },
        {
          headers: { Authorization: token },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Refund transaction failed.");
    }
  },
};

module.exports = bKashService;
