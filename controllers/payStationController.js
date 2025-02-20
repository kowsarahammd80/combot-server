const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // Generate unique IDs
// const globals = require("node-global-storage");
const BkashPayment = require("../models/rePaymentModel");

// old
// class PayStationController {
//   // Method to generate headers for PayStation
//   paystation_headers = async () => {
//     return {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     };
//   };

//   // Method to create a payment
//   create_payment = async (req, res) => {
//     const {
//       amount,
//       orderId,
//       name,
//       email,
//       number,
//       packageName,
//       currency,
//       businessName,
//     } = req.body;

//     console.log("Creating payment with PayStation:", req.body);

//     // callback_url: `http://localhost:5000/api/payment/callback?orderId=${orderId}&name=${name}&email=${email}&number=${number}&packageName=${packageName}&currency=${currency}&businessName=${businessName}&invoiceNumber=${invoicesNumber}&amount=${amount}`,

//     try {

//       // Step 1: Create Payment
//       const invoicesNumber = "Inv" + uuidv4().substring(0, 5);
//       console.log("Creating Payment...");
//       const paymentResponse = await axios.post(
//         "https://api.paystation.com.bd/initiate-payment",
//         {
//           merchantId: "7871737986504",
//           password: "@D&65#0",
//           invoice_number: invoicesNumber,
//           currency,
//           payment_amount: amount,
//           reference: orderId,
//           cust_name: name,
//           cust_phone: number,
//           cust_email: email,
//           cust_address: businessName,
//           callback_url: `http://localhost:5000/api/payment/callback`,
//           checkout_items: packageName,
//         }
//       );
//       // console.log("Payment Created:", paymentResponse.data);
//       const paymentData = paymentResponse.data;
//       console.log("befor payment", paymentData);

//       // Step 3: Handle Payment URL
//       if (paymentData.payment_url) {
//         console.log("Payment URL received:", paymentData.payment_url);

//         // Return response to frontend
//         return res.status(200).json({
//           message: "Payment created successfully",
//           payment_url: paymentData.payment_url,
//         });
//       } else {
//         console.error("Payment URL missing in API response:", paymentData);
//         throw new Error("Payment URL not received from PayStation.");
//       }
//     } catch (error) {
//       console.error(
//         "Error in Payment Creation:",
//         error.response?.data || error.message
//       );

//       return res.status(500).json({
//         error: "Failed to create payment: " + error.message,
//       });
//     }
//   };

//   // Callback Method for Payment
//   payment_callback = async (req, res) => {
//     const {
//       status,
//       orderId,
//       name,
//       email,
//       number,
//       packageName,
//       currency,
//       businessName,
//       trx_id,
//       payment_amount,
//       invoiceNumber,
//       amount,
//       payer_mobile_no,
//     } = req.query;
//     console.log("Payment Callback Datas:", req.query);

//     try {

//       if (req.query.status === "Canceled" || !req.query.trx_id) {
//         const paymentData = {
//           userId: Math.random() * 10 + 1,
//           paymentID: req.query.invoice_number,
//           trxID: "N/A",
//           date: new Date().toISOString(),
//           amount: isNaN(parseInt(req.query.amount))
//             ? 0
//             : parseInt(req.query.amount),
//           paymentStatus: "abandoned",
//           name: req.query.name,
//           email: req.query.email,
//           number: req.query.number,
//           packageName: req.query.packageName,
//           businessName: req.query.businessName,
//           refund: "",
//           paymentType: "paystation",
//           invoiceNumber: req.query.invoice_number,
//           paymentNumber: req.query.payer_mobile_no || req.query.number || "N/A",
//         };

//         // Log the data to console before saving it
//         console.log("Payment Data Before Storing:", paymentData);

//         // Store in the database
//         // await BkashPayment.create(paymentData);
//         try {
//           const savedPayment = await BkashPayment.create(paymentData);
//           console.log("Cancele Payment Data Saved:", savedPayment);
//         } catch (dbError) {
//           console.error("Database Insert Error:", dbError);
//         }

//         return res.redirect(`http://localhost:3000/error?message=${status}`);
//       }

//       if (
//         req.query.status === "Successful" ||
//         req.query.status_code === "200"
//       ) {

//         const paymentData = {
//           userId: Math.random() * 10 + 1,
//           paymentID: req.query.invoice_number,
//           trxID: req.query.trx_id,
//           date: new Date().toISOString(),
//           amount: parseInt(req.query.amount),
//           paymentStatus: "success",
//           name: req.query.name,
//           email: req.query.email,
//           number: req.query.number,
//           packageName: req.query.packageName,
//           businessName: req.query.businessName,
//           refund: "",
//           paymentType: "paystation",
//           invoiceNumber: req.query.invoice_number,
//           paymentNumber: req.query.payer_mobile_no || req.query.number || "N/A",
//         };

//         // Log the data to console before saving it
//         console.log("Payment successfull Data  Storing:", paymentData);

//         // Store in the database
//         // await BkashPayment.create(paymentData);

//         try {
//           const savedPayment = await BkashPayment.create(paymentData);
//           console.log("Successfully Payment Data Saved :", savedPayment);
//         } catch (dbError) {
//           console.error("Database Insert Error:", dbError);
//         }

//         return res.redirect(`http://localhost:3000/success?message=${status}`);
//       }
//     } catch (error) {
//       console.error("Error in Payment Callback:", error.message);
//       return res.redirect(
//         `http://localhost:3000/error?message=${error.message}`
//       );
//     }
//   };

//   // payment_callback = async (req, res) => {
//   //   const { status, trx_id } = req.query;
//   //   console.log("Payment Callback Received:", req.query);

//   //   try {
//   //     if (status === "Successful" && trx_id) {
//   //       console.log("Fetching Payment Details for Transaction ID:", trx_id);

//   //       // Fetch latest transaction details
//   //       const transactionResponse = await axios.post(
//   //         "https://api.paystation.com.bd/transaction-status",
//   //         { trx_id, invoice_number: req.query.invoiceNumber },
//   //         {
//   //           headers: await this.paystation_headers(),
//   //         }
//   //       );

//   //       const paymentDetails = transactionResponse.data;
//   //       console.log("Fetched Payment Details:", paymentDetails);

//   //       // Extract all relevant data
//   //       const paymentData = {
//   //         userId: Math.random() * 10 + 1,
//   //         paymentID: paymentDetails.invoice_number || "N/A",
//   //         trxID: trx_id,
//   //         date: new Date().toISOString(),
//   //         amount: parseInt(paymentDetails.payment_amount || 0),
//   //         paymentStatus: paymentDetails.status || "unknown",
//   //         name: paymentDetails.cust_name || "N/A",
//   //         email: paymentDetails.cust_email || "N/A",
//   //         number: paymentDetails.cust_phone || "N/A",
//   //         packageName: paymentDetails.checkout_items || "N/A",
//   //         businessName: paymentDetails.cust_address || "N/A",
//   //         paymentNumber: paymentDetails.payer_mobile_no || "N/A",
//   //         paymentType: "paystation",
//   //         invoiceNumber: paymentDetails.invoice_number || "N/A",
//   //       };

//   //       // Save to database
//   //       const savedPayment = await BkashPayment.create(paymentData);
//   //       console.log("Successfully Stored Payment Data:", savedPayment);

//   //       // Redirect user to success page
//   //       return res.redirect(`http://localhost:3000/success?message=Payment Successful`);
//   //     }

//   //     // Handle Canceled Payments
//   //     if (status === "Canceled" || !trx_id) {
//   //       console.log("Payment Canceled:", req.query);

//   //       const paymentData = {
//   //         userId: Math.random() * 10 + 1,
//   //         paymentID: req.query.invoice_number,
//   //         trxID: "N/A",
//   //         date: new Date().toISOString(),
//   //         amount: isNaN(parseInt(req.query.amount)) ? 0 : parseInt(req.query.amount),
//   //         paymentStatus: "abandoned",
//   //         name: req.query.name,
//   //         email: req.query.email,
//   //         number: req.query.number,
//   //         packageName: req.query.packageName,
//   //         businessName: req.query.businessName,
//   //         refund: "",
//   //         paymentType: "paystation",
//   //         invoiceNumber: req.query.invoice_number,
//   //         paymentNumber: req.query.payer_mobile_no || req.query.number || "N/A",
//   //       };

//   //       const savedPayment = await BkashPayment.create(paymentData);
//   //       console.log("Canceled Payment Stored:", savedPayment);

//   //       return res.redirect(`http://localhost:3000/error?message=Payment Canceled`);
//   //     }
//   //   } catch (error) {
//   //     console.error(" Error Fetching Payment Details:", error.message);
//   //     return res.redirect(`http://localhost:3000/error?message=${error.message}`);
//   //   }
//   // };

//   // payment_callback = async (req, res) => {
//   //   const { status, trx_id, invoiceNumber } = req.query;
//   //   console.log("Payment Callback Received:", req.query);

//   //   try {
//   //     if (
//   //       req.query.status === "Successful" ||
//   //       req.query.status_code === "200"
//   //     ) {
//   //       console.log("Fetching Payment Details for Transaction ID:", trx_id);

//   //       // Fetch latest transaction details
//   //       const transactionResponse = await axios.post(
//   //         "https://api.paystation.com.bd/transaction-status",
//   //         { invoice_number: invoiceNumber,  },
//   //         {
//   //           headers: await this.paystation_headers(),
//   //           merchantId: "7871737986504"
//   //         }
//   //       );

//   //       const paymentDetails = transactionResponse.data;
//   //       console.log("Fetched Payment Details:", paymentDetails);

//   //       if (paymentDetails.status_code === "2001" || !paymentDetails.trx_id) {
//   //         // Transaction not found
//   //         throw new Error(
//   //           "Transaction not found in system",
//   //           transactionResponse.data
//   //         );
//   //       }

//   //       const paymentData = {
//   //         userId: Math.random() * 10 + 1,
//   //         paymentID: paymentDetails.invoice_number || "N/A",
//   //         trxID: trx_id,
//   //         date: new Date().toISOString(),
//   //         amount: parseInt(paymentDetails.payment_amount || 0),
//   //         paymentStatus: paymentDetails.status || "unknown",
//   //         name: paymentDetails.cust_name || "N/A",
//   //         email: paymentDetails.cust_email || "N/A",
//   //         number: paymentDetails.cust_phone || "N/A",
//   //         packageName: paymentDetails.checkout_items || "N/A",
//   //         businessName: paymentDetails.cust_address || "N/A",
//   //         paymentNumber: paymentDetails.payer_mobile_no || "N/A",
//   //         paymentType: "paystation",
//   //         invoiceNumber: paymentDetails.invoice_number || "N/A",
//   //       };

//   //       // Check if paymentID already exists
//   //       const existingPayment = await BkashPayment.findOne({
//   //         paymentID: paymentData.paymentID,
//   //       });
//   //       if (existingPayment) {
//   //         throw new Error(
//   //           `Payment with ID ${paymentData.paymentID} already exists.`
//   //         );
//   //       }

//   //       // Save to database
//   //       const savedPayment = await BkashPayment.create(paymentData);
//   //       console.log("Successfully Stored Payment Data:", savedPayment);

//   //       return res.redirect(
//   //         `http://localhost:5000/api/payment/callback`
//   //       );
//   //     }

//   //     // Handle Canceled Payments
//   //     if (req.query.status === "Canceled" || !req.query.trx_id) {
//   //       console.log("Payment Canceled:", req.query);

//   //       const paymentData = {
//   //         userId: Math.random() * 10 + 1,
//   //         paymentID: req.query.invoice_number,
//   //         trxID: "N/A",
//   //         date: new Date().toISOString(),
//   //         amount: isNaN(parseInt(req.query.amount))
//   //           ? 0
//   //           : parseInt(req.query.amount),
//   //         paymentStatus: "abandoned",
//   //         name: req.query.name,
//   //         email: req.query.email,
//   //         number: req.query.number,
//   //         packageName: req.query.packageName,
//   //         businessName: req.query.businessName,
//   //         refund: "",
//   //         paymentType: "paystation",
//   //         invoiceNumber: req.query.invoice_number,
//   //         paymentNumber: req.query.payer_mobile_no || req.query.number || "N/A",
//   //       };

//   //       const savedPayment = await BkashPayment.create(paymentData);
//   //       console.log("Canceled Payment Stored:", savedPayment);

//   //       return res.redirect(
//   //         `http://localhost:3000/error?message=Payment Canceled`
//   //       );
//   //     }
//   //   } catch (error) {
//   //     console.error("Error Fetching Payment Details:", error.message);
//   //     return res.redirect(
//   //       `http://localhost:3000/error?message=${error.message}`
//   //     );
//   //   }
//   // };
// }

// new
class PayStationController {
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
      // Generate a unique invoice number
      const invoicesNumber = "Inv" + uuidv4().substring(0, 5);
      console.log("Creating Payment...");

      // Payment request payload
      const paymentPayload = {
        merchantId: "104-1653730183",
        password: "gamecoderstorepass",
        invoice_number: invoicesNumber,
        currency,
        payment_amount: amount,
        reference: orderId,
        cust_name: name,
        cust_phone: number,
        cust_email: email,
        cust_address: businessName,
        callback_url: `http://localhost:5000/api/payment/callback?orderId=${orderId}&name=${name}&email=${email}&number=${number}&packageName=${packageName}&currency=${currency}&businessName=${businessName}&invoiceNumber=${invoicesNumber}&amount=${amount}`,
        checkout_items: packageName,
      };

      // Send JSON request to PayStation
      const paymentResponse = await axios.post(
        "https://sandbox.paystation.com.bd/initiate-payment",
        paymentPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            merchantId: "104-1653730183",
            // password: "gamecoderstorepass"
          },
        }
      );

      const paymentData = paymentResponse.data;
      console.log("Payment Response:", paymentData);

      // Handle Payment URL
      if (paymentData.payment_url) {
        console.log("Payment URL received:", paymentData.payment_url);
        return res.status(200).json({
          message: "Payment created successfully",
          payment_url: paymentData.payment_url,
        });
      } else {
        console.error("Payment URL missing in API response:", paymentData);
        throw new Error("Payment URL not received from PayStation.");
      }
    } catch (error) {
      console.error(
        "Error in Payment Creation:",
        error.response?.data || error.message
      );

      return res.status(500).json({
        error: "Failed to create payment: " + error.message,
      });
    }
  };

  // Payment callback method

  // payment_callback = async (req, res) => {
  //   const {
  //     status,
  //     invoice_number,
  //     trx_id,
  //     amount,
  //     payer_mobile_no,
  //     name,
  //     email,
  //     number,
  //     packageName,
  //     businessName,
  //   } = req.query;

  //   console.log("Payment Callback Data:", req.query);

  //   try {
  //     // If the payment is canceled
  //     if (status === "Canceled" || !trx_id) {
  //       const paymentData = {
  //         userId: Math.floor(Math.random() * 100000) + 1,
  //         paymentID: invoice_number,
  //         trxID: "N/A",
  //         date: new Date().toISOString(),
  //         amount: isNaN(parseInt(amount)) ? 0 : parseInt(amount),
  //         paymentStatus: "abandoned",
  //         name,
  //         email,
  //         number,
  //         packageName,
  //         businessName,
  //         refund: "",
  //         paymentType: "paystation",
  //         invoiceNumber: invoice_number,
  //         paymentNumber: payer_mobile_no || number || "N/A",
  //       };

  //       console.log("Canceled Payment Data Before Storing:", paymentData);

  //       try {
  //         const savedPayment = await BkashPayment.create(paymentData);
  //         console.log("Canceled Payment Data Saved:", savedPayment);
  //       } catch (dbError) {
  //         console.error("Database Insert Error:", dbError);
  //       }

  //       return res.redirect(`http://localhost:3000/error?message=${status}`);
  //     }

  //     // If the payment is successful
  //     if (status === "Successful" || trx_id) {
  //       const paymentData = {
  //         userId: Math.floor(Math.random() * 100000) + 1,
  //         paymentID: invoice_number,
  //         trxID: trx_id,
  //         date: new Date().toISOString(),
  //         amount: parseInt(amount),
  //         paymentStatus: "success",
  //         name,
  //         email,
  //         number,
  //         packageName,
  //         businessName,
  //         refund: "",
  //         paymentType: "paystation",
  //         invoiceNumber: invoice_number,
  //         paymentNumber: payer_mobile_no || number || "N/A",
  //       };

  //       console.log("Successful Payment Data Before Storing:", paymentData);

  //       try {
  //         const savedPayment = await BkashPayment.create(paymentData);
  //         console.log("Successfully Payment Data Saved:", savedPayment);
  //       } catch (dbError) {
  //         console.error("Database Insert Error:", dbError);
  //       }

  //       return res.redirect(`http://localhost:3000/success?message=${status}`);
  //     }
  //   } catch (error) {
  //     console.error("Error in Payment Callback:", error.message);
  //     return res.redirect(
  //       `http://localhost:3000/error?message=${error.message}`
  //     );
  //   }
  // };

// payment_callback = async (req, res) => {
//     const {
//       status,
//       invoice_number,
//       trx_id,
//       amount,
//       name,
//       email,
//       number,
//       packageName,
//       businessName,
//     } = req.query;
  
//     console.log("Payment Callback Data:", req.query);
  
//     try {
//             if (status === "Canceled" || !trx_id) {
//         const paymentData = {
//           userId: Math.floor(Math.random() * 100000) + 1,
//           paymentID: invoice_number,
//           trxID: "N/A",
//           date: new Date().toISOString(),
//           amount: isNaN(parseInt(amount)) ? 0 : parseInt(amount),
//           paymentStatus: "abandoned",
//           name,
//           email,
//           number,
//           packageName,
//           businessName,
//           refund: "",
//           paymentType: "paystation",
//           invoiceNumber: invoice_number,
//           paymentNumber: payer_mobile_no || number || "N/A",
//         };

//         console.log("Canceled Payment Data Before Storing:", paymentData);

//         try {
//           const savedPayment = await BkashPayment.create(paymentData);
//           console.log("Canceled Payment Data Saved:", savedPayment);
//         } catch (dbError) {
//           console.error("Database Insert Error:", dbError);
//         }

//         return res.redirect(`http://localhost:3000/error?message=${status}`);
//       }
//       let payer_mobile_no = number || "N/A"; // Initialize payer_mobile_no
  
//       if (status === "Successful" || trx_id) {
//         try {
//           const transactionResponse = await axios.post(
//             "https://sandbox.paystation.com.bd/transaction-status",
//             { invoice_number },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//                 merchantId: "104-1653730183",
//               },
//             }
//           );
  
//           const transactionData = transactionResponse.data.data;
//           console.log("Transaction Status Response:", transactionData);
  
//           if (transactionData && transactionData.payer_mobile_no) {
//             payer_mobile_no = transactionData.payer_mobile_no; // Assign received value
//             console.log("pay by number:", payer_mobile_no);
//           }
//         } catch (error) {
//           console.error("Error fetching transaction status:", error.message);
//         }
//       }
  
//       // Store payment data
//       const paymentData = {
//         userId: Math.floor(Math.random() * 100000) + 1,
//         paymentID: invoice_number,
//         trxID: trx_id,
//         date: new Date().toISOString(),
//         amount: parseInt(amount),
//         paymentStatus: "success",
//         name,
//         email,
//         number,
//         packageName,
//         businessName,
//         refund: "",
//         paymentType: "paystation",
//         invoiceNumber: invoice_number,
//         paymentNumber: payer_mobile_no, // Store fetched payer_mobile_no
//       };
  
//       console.log("Successful Payment Data Before Storing:", paymentData);
  
//       try {
//         const savedPayment = await BkashPayment.create(paymentData);
//         console.log("Successfully Payment Data Saved:", savedPayment);
//       } catch (dbError) {
//         console.error("Database Insert Error:", dbError);
//       }
  
//       return res.redirect(`http://localhost:3000/success?message=${status}`);
//     } catch (error) {
//       console.error("Error in Payment Callback:", error.message);
//       return res.redirect(`http://localhost:3000/error?message=${error.message}`);
//     }
// };
 
payment_callback = async (req, res) => {
  const {
    status,
    invoice_number,
    trx_id,
    amount,
    name,
    email,
    number,
    packageName,
    businessName,
  } = req.query;

  console.log("Payment Callback Data:", req.query);

  try {
    let payer_mobile_no = number || "N/A"; // ✅ Declare here before first use

    if (status === "Canceled" || !trx_id) {
      const paymentData = {
        userId: Math.floor(Math.random() * 100000) + 1,
        paymentID: invoice_number,
        trxID: "N/A",
        date: new Date().toISOString(),
        amount: isNaN(parseInt(amount)) ? 0 : parseInt(amount),
        paymentStatus: "abandoned",
        name,
        email,
        number,
        packageName,
        businessName,
        refund: "",
        paymentType: "paystation",
        invoiceNumber: invoice_number,
        paymentNumber: payer_mobile_no, // ✅ No error now
      };

      console.log("Canceled Payment Data Before Storing:", paymentData);

      try {
        const savedPayment = await BkashPayment.create(paymentData);
        console.log("Canceled Payment Data Saved:", savedPayment);
      } catch (dbError) {
        console.error("Database Insert Error:", dbError);
      }

      return res.redirect(`http://localhost:3000/error?message=${status}`);
    }

    if (status === "Successful" || trx_id) {
      try {
        const transactionResponse = await axios.post(
          "https://sandbox.paystation.com.bd/transaction-status",
          { invoice_number },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              merchantId: "104-1653730183",
            },
          }
        );

        const transactionData = transactionResponse.data.data;
        console.log("Transaction Status Response:", transactionData);

        if (transactionData && transactionData.payer_mobile_no) {
          payer_mobile_no = transactionData.payer_mobile_no; // ✅ Assign value safely
          console.log("pay by number:", payer_mobile_no);
        }
      } catch (error) {
        console.error("Error fetching transaction status:", error.message);
      }
    }

    // Store payment data
    const paymentData = {
      userId: Math.floor(Math.random() * 100000) + 1,
      paymentID: invoice_number,
      trxID: trx_id,
      date: new Date().toISOString(),
      amount: parseInt(amount),
      paymentStatus: "success",
      name,
      email,
      number,
      packageName,
      businessName,
      refund: "",
      paymentType: "paystation",
      invoiceNumber: invoice_number,
      paymentNumber: payer_mobile_no,
    };

    console.log("Successful Payment Data Before Storing:", paymentData);

    try {
      const savedPayment = await BkashPayment.create(paymentData);
      console.log("Successfully Payment Data Saved:", savedPayment);
    } catch (dbError) {
      console.error("Database Insert Error:", dbError);
    }

    return res.redirect(`http://localhost:3000/success?message=${status}`);
  } catch (error) {
    console.error("Error in Payment Callback:", error.message);
    return res.redirect(`http://localhost:3000/error?message=${error.message}`);
  }
};

  
}

module.exports = new PayStationController();