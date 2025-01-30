const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // Generate unique IDs
const globals = require("node-global-storage");
const BkashPayment = require("../models/rePaymentModel");

class PayStationController {
  // Method to generate headers for PayStation
  paystation_headers = async () => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      merchantId: '104-1653730183',
      password: 'gamecoderstorepass',
    };
  };

  // Method to create a payment
  create_payment = async (req, res) => {
    const {
      amount,
      orderId,
      name,
      email,
      number,
      packageName,
      currency,
      businessName,
    } = req.body;

    console.log("Creating payment with PayStation:", req.body);

    try {
      // Step 1: Request Token
      console.log("Requesting Token...");
      const tokenResponse = await axios.post(
        "https://api.paystation.com.bd/grant-token",
        {},
        {
          headers: await this.paystation_headers(),
        }
      );

      const token = tokenResponse.data.token;
      if (!token) throw new Error("Failed to retrieve token from PayStation.");
      console.log("Token Retrieved:", token);

      // Step 2: Create Payment
      console.log("Creating Payment...");
      const paymentResponse = await axios.post(
        "https://api.paystation.com.bd/create-payment",
        {
          invoice_number: "Inv" + uuidv4().substring(0, 5),
          currency,
          payment_amount: amount,
          reference: orderId,
          cust_name: name,
          cust_phone: number,
          cust_email: email,
          cust_address: businessName,
          callback_url: `http://localhost:5000/api/payment/callback`,
          checkout_items: packageName,
        },
        {
          headers: { token },
        }
      );
      // console.log("Payment Created:", paymentResponse.data);
      const paymentData = paymentResponse.data;
      console.log(paymentData);

      // Step 3: Handle Payment URL
      if (paymentData.payment_url) {
        console.log("Payment URL received:", paymentData.payment_url);

        // Return response to frontend
        return res.status(200).json({
          message: "Payment created successfully",
          payment_url: paymentData.payment_url,
        });
      } else {
        console.error("Payment URL missing in API response:", paymentData);
        throw new Error("Payment URL not received from PayStation.");
      }
    } catch (error) {
      console.error("Error in Payment Creation:", error.response?.data || error.message);

      return res.status(500).json({
        error: "Failed to create payment: " + error.message,
      });
    }
  };

  // Callback Method for Payment
  payment_callback = async (req, res) => {
    const { status } = req.query;

    console.log("Payment Callback:", req.query);

    try {
      // const existingPayment = await BkashPayment.findOne({ paymentID });
      // if (existingPayment) {
      //   return res.redirect(
      //     `http://localhost:3001/error?message= Your Trxid is invalid`
      //   );
      // }

      if (status === "Canceled" || data.trx_id === "") {
        console.log("Payment was cancelled or failed.", status);
        await BkashPayment.create({
            userId: globals.userId || "N/A",
            // paymentID,
            trxID: "N/A", // Replace with actual trxID from payment gateway
            date: new Date().toISOString(),
            amount: parseInt(data.payment_amount) || "N/A", // Replace with actual amount
            paymentStatus: "abandoned",
            name: req.query.name,
            email: req.query.email,
            number: req.query.number,
            packegeName: req.query.packageName,
            businessName: req.query.businessName,
            refund: "",
            paymentType: "paystation",
            invoiceNumber: "N/A",
        });

        return res.redirect(
          `http://localhost:3001/error?message=${status}`
        );
      }

      if (status === "success" || status_code === "200") {
        // Example Success Logic
        await BkashPayment.create({
          userId: globals.userId || "N/A",
          paymentID,
          trxID: data.trx_id, // Replace with actual trxID from payment gateway
          date: new Date().toISOString(),
          amount: parseInt(data.payment_amount), // Replace with actual amount
          paymentStatus: "success",
          name: req.query.name,
          email: req.query.email,
          number: req.query.number,
          packegeName: req.query.packageName,
          businessName: req.query.businessName,
          refund: "",
          paymentType: "paystation",
          invoiceNumber: data.invoice_number,
        });

        return res.redirect(
          `http://localhost:3001/success?message=Payment Successful`
        );
      }
    } catch (error) {
      console.error("Error in Payment Callback:", error.message);
      return res.redirect(
        `http://localhost:3001/error?message=${error.message}`
      );
    }
  };
}

module.exports = new PayStationController();
