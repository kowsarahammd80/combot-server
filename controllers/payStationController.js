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
      const invoicesNumber = "Inv" + uuidv4().substring(0, 5);
      console.log("Creating Payment...");
      const paymentResponse = await axios.post(
        "https://api.paystation.com.bd/create-payment",
        {
          invoice_number: invoicesNumber,
          currency,
          payment_amount: amount,
          reference: orderId,
          cust_name: name,
          cust_phone: number,
          cust_email: email,
          cust_address: businessName,
          callback_url: `http://localhost:5000/api/payment/callback?orderId=${orderId}&name=${name}&email=${email}&number=${number}&packageName=${packageName}&currency=${currency}&businessName=${businessName}&invoiceNumber=${invoicesNumber}`,
          checkout_items: packageName,
        },
        {
          headers: { token },
        }
      );
      // console.log("Payment Created:", paymentResponse.data);
      const paymentData = paymentResponse.data;
      console.log("after payment",paymentData);

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
    const { status, orderId, name, email, number, packageName, currency, businessName, trx_id, payment_amount, invoiceNumber } = req.query;
    console.log("Payment Callback Data:", req.query);
  
    try {
      // if (req.query.status === "Canceled" || req.query.trx_id === "") {
      //   await BkashPayment.create({
      //     userId: 469,
      //     paymentID: req.query.invoice_number,
      //     trxID: "N/A",
      //     date: new Date().toISOString(),
      //     amount: isNaN(parseInt(payment_amount)) ? 0 : parseInt(payment_amount),
      //     paymentStatus: "abandoned",
      //     name,
      //     email,
      //     number,
      //     packegeName: packageName,
      //     businessName,
      //     refund: "",
      //     paymentType: "paystation",
      //     invoiceNumber: invoiceNumber,
      //     paymentNumber: req.query.payer_mobile_no
      //   });

      if (req.query.status === "Canceled" || !req.query.trx_id) {
        const paymentData = {
          userId: Math.random() * 10 + 1,
          paymentID: req.query.invoice_number,
          trxID: "N/A",
          date: new Date().toISOString(),
          amount: isNaN(parseInt(req.query.payment_amount)) ? 0 : parseInt(req.query.payment_amount),
          paymentStatus: "abandoned",
          name: req.query.name,
          email: req.query.email,
          number: req.query.number,
          packageName: req.query.packageName,
          businessName: req.query.businessName,
          refund: "",
          paymentType: "paystation",
          invoiceNumber: req.query.invoice_number,
          paymentNumber: req.query.payer_mobile_no || req.query.number || "N/A"
        };
    
        // Log the data to console before saving it
        console.log("Payment Data Before Storing:", paymentData);
    
        // Store in the database
        // await BkashPayment.create(paymentData);
        try {
          const savedPayment = await BkashPayment.create(paymentData);
          console.log("Payment Data Saved Successfully:", savedPayment);
        } catch (dbError) {
          console.error("Database Insert Error:", dbError);
        }
  
        return res.redirect(`http://localhost:3000/error?message=${status}`);
      }
  
      if (req.query.status === "success" || req.query.status_code === "200") {
        await BkashPayment.create({
          userId: "N/A",
          paymentID: req.query.invoice_number,
          trxID: trx_id,
          date: new Date().toISOString(),
          amount: parseInt(payment_amount),
          paymentStatus: "success",
          name,
          email,
          number,
          packegeName: packageName,
          businessName,
          refund: "",
          paymentType: "paystation",
          invoiceNumber: req.query.invoice_number,
        });
  
        return res.redirect(`http://localhost:3000/success?message=Payment Successful`);
      }
    } catch (error) {
      console.error("Error in Payment Callback:", error.message);
      return res.redirect(`http://localhost:3000/error?message=${error.message}`);
    }
  };
  
}

module.exports = new PayStationController();