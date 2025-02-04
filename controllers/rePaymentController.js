const globals = require("node-global-storage");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // Ensure this package is installed
const BkashPayment = require("../models/rePaymentModel");


// class BkashTokenManager {
//   constructor() {
//     this.token = null;
//     this.token_expiry = null;
//   }

//   getBkashToken = async () => {
//     try {
//       const { data } = await axios.post(
//         process.env.bkash_grant_token_url,
//         {
//           app_key: process.env.bkash_api_key,
//           app_secret: process.env.bkash_api_secret,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );
//       this.token = data.id_token;
//       this.token_expiry = Date.now() + 3600000;
//       return this.token;
//     } catch (error) {
//       console.error("Error getting bKash token:", error.message);
//       throw new Error("Failed to retrieve bKash token");
//     }
//   };

//   getValidToken = async () => {
//     if (!this.token || Date.now() >= this.token_expiry) {
//       return await this.getBkashToken();
//     }
//     return this.token;
//   };

//   getTokenAPI = async (req, res) => {
//     try {
//       const token = await this.getValidToken();
//       return res.status(200).json({ token });
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   };

// }

// const tokenManager = new BkashTokenManager();


class rePaymentController {
  // Method to generate bkash headers
  bkash_headers = async () => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: globals.id_token, // Direct property access
      "x-app-key": process.env.bkash_api_key, // Ensure this is set in your .env file
    };
  };



  // Method to create a payment
  payment_create = async (req, res) => {
    const {
      amount,
      userId,
      name,
      email,
      number,
      packageName,
      currency,
      refund,
      paymentType,
      businessName,
    } = req.body;
    console.log("payment function", req.body);

    // Store userId in the global object
    globals.userId = userId;
    // console.log(globals)

    try {
      const { data } = await axios.post(
        process.env.bkash_create_payment_url,
        {
          mode: "0011",
          payerReference: " ",
          callbackURL: `https://payapi.watheta.com/api/test/payment/callback?name=${encodeURIComponent(
            name || "Default Name"
          )}&email=${encodeURIComponent(
            email || "example@example.com"
          )}&number=${encodeURIComponent(
            number || "0000000000"
          )}&packageName=${encodeURIComponent(
            packageName || "Default Package"
          )}&currency=${encodeURIComponent(
            currency || "BDT"
          )}&refund=${encodeURIComponent(
            refund || ""
          )}&paymentType=${encodeURIComponent(
            paymentType || "bkash"
          )}&businessName=${encodeURIComponent(businessName || "Default")}`,
          amount: amount,
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
        },
        {
          headers: await this.bkash_headers(),
        }
      );

      return res.status(200).json({ bkashURL: data.bkashURL });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };

  // call back for data post
  call_back = async (req, res) => {
    const {
      paymentID,
      status,
      name,
      email,
      number,
      packageName,
      businessName,
    } = req.query;
    console.log("callback query", req.query);

    const existingPayment = await BkashPayment.findOne({ paymentID });
    if (existingPayment) {
      return res.redirect(
        `https://payment.watheta.com/success?message=Payment already processed`
      );
    }

    // if (status === 'cancel' || status === 'failure') {
    //     return res.redirect(`https://unrivaled-bombolone-c1a555.netlify.app/error?message=${status}`);
    // }

    if (status === "cancel" || status === "failure") {
      try {
        
        await BkashPayment.create({
          userId: globals.userId || Math.random() * 10 + 1,
          paymentID: paymentID || "N/A",
          trxID: "N/A",
          date: new Date().toISOString(),
          amount: 0, 
          name,
          email,
          number,
          packageName,
          businessName,
          refund: "",
          paymentType: "bkash",
          paymentNumber: 'N/A',
          invoiceNumber: 'N/A',
          paymentStatus: "abandoned",
        });
              
        return res.redirect(`https://payment.watheta.com/error?message=${status}`);
      } catch (error) {
        console.error("Abandoned:", error.message);
        return res.redirect(
          `https://payment.watheta.com/error?message=${error.message}`
        );
      }
    }
    if (status === "success") {
      try {
        const { data } = await axios.post(
          process.env.bkash_execute_payment_url,
          { paymentID },
          {
            headers: await this.bkash_headers(),
          }
        );

        if (data && data.statusCode === "0000") {
          await BkashPayment.create({
            userId: globals.userId || Math.random() * 10 + 1,
            paymentID,
            trxID: data.trxID,
            date: data.paymentExecuteTime,
            amount: parseInt(data.amount),
            name: req.query.name,
            email: req.query.email,
            number: req.query.number,
            packageName: req.query.packageName,
            businessName: req.query.businessName,
            refund: "",
            paymentType: "bkash",
            paymentStatus: "success",
            paymentNumber: data.payerAccount,
            invoiceNumber: data.merchantInvoiceNumber,
          });

          console.log(data);

          return res.redirect(
            `https://payment.watheta.com/success?message=${data.statusMessage}`
          );
        } else {
          return res.redirect(
            `https://payment.watheta.com/error?message=${data.statusMessage}`
          );
        }
      } catch (error) {
        return res.redirect(
          `https://payment.watheta.com/error?message=${error.message}`
        );
      }
    }
  };

  // gett all payment success data
  get_all_payments = async (req, res) => {
    try {
      const payments = await BkashPayment.find(); // Retrieve all records

      if (!payments || payments.length === 0) {
        return res.status(404).json({ message: "No payment records found." });
      }

      return res.status(200).json({ payments });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error retrieving payment records: " + error.message });
    }
  };

  // refund money
  refundPayment = async (req, res) => {
    const { trxID } = req.params;
    // console.log("trx", req.params)
    try {
      const payment = await BkashPayment.findOne({ trxID });
      console.log("paymentInfo", payment);
      const { data } = await axios.post(
        process.env.bkash_refund_transaction_url,
        {
          paymentID: payment.paymentID,
          amount: payment.amount,
          trxID,
          sku: "payment",
          reason: "cashback",
        },
        {
          headers: await this.bkash_headers(),
        }
      );
      // console.log(payment.paymentID)
      if (data && data.statusCode === "0000") {
        return res.status(200).json({ message: "refund success" });
      } else {
        return res.status(404).json({ error: "refund failed" });
      }
    } catch (error) {
      return res.status(404).json({ error: "refund failed" });
    }
  };

  getTokenAPI = async (req, res) => {
    try {
      // You could just send the token here (for testing)
      res.json({ id_token: globals.id_token });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve token: " + error.message });
    }
  }
}

module.exports = new rePaymentController();