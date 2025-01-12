const paymentService = require('../service/paymentService.js')

exports.postPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const createdPayment = await paymentService.createPayment(paymentData);
    res.status(201).json({ success: true, data: createdPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// exports.createPaymentInfo = async (req, res) => {
//     try {
//       const { name, email, businessName, contactNumber, packegPrice, currencySymbol } = req.body;
//       const paymentData = {
//         name,
//         email,
//         businessName,
//         contactNumber,
//         packegPrice,
//         currencySymbol
//       };
  
//       const paymentInfo = await paymentService.createPaymentInfo(paymentData);
//       res.status(201).json(paymentInfo); // Return the created data
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };
  