const globals = require("node-global-storage");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // Ensure this package is installed
const BkashPayment = require("../models/rePaymentModel");

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

    try {
      const { data } = await axios.post(
        process.env.bkash_create_payment_url,
        {
          mode: "0011",
          payerReference: " ",
          callbackURL: `https://combot-server-1.onrender.com/api/test/payment/callback?name=${encodeURIComponent(
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
    const { paymentID, status, name, email, number, packageName, businessName } = req.query;
    console.log("callback query", req.query);

    // if (status === 'cancel' || status === 'failure') {
    //     return res.redirect(`https://unrivaled-bombolone-c1a555.netlify.app/error?message=${status}`);
    // }
    if (status === 'cancel' || status === 'failure') {
        try {
            // Log abandoned data to the database
            await BkashPayment.create({
                userId: globals.userId || Math.random() * 10 + 1,
                paymentID: paymentID || "N/A",
                trxID: "N/A",
                date: new Date().toISOString(),
                amount: 0, // Payment amount is 0 since it failed
                name,
                email,
                number,
                packageName,
                businessName,
                refund: '',
                paymentType: 'bkash',
                invoiceNumber: 'N/A',
                paymentStatus: "abandoned", // Custom status for failed/canceled payments
            });

            // Redirect to the error page with the status
            return res.redirect(`https://unrivaled-bombolone-c1a555.netlify.app/error?message=${status}`);
        } catch (error) {
            console.error("Error logging abandoned payment:", error.message);
            return res.redirect(`https://unrivaled-bombolone-c1a555.netlify.app/error?message=Error logging abandoned payment`);
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
            invoiceNumber: data.merchantInvoiceNumber,
          });

          // console.log(data);

          return res.redirect(
            `https://unrivaled-bombolone-c1a555.netlify.app/success?message=${data.statusMessage}`
          );
        } else {
          return res.redirect(
            `https://unrivaled-bombolone-c1a555.netlify.app/error?message=${data.statusMessage}`
          );
        }
      } catch (error) {
        return res.redirect(
          `https://unrivaled-bombolone-c1a555.netlify.app/error?message=${error.message}`
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
}

module.exports = new rePaymentController();
