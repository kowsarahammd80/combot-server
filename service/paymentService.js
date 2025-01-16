const Payment = require ('../models/paymnetModel.js')

// Create a new payment
exports.createPayment = async (data) => {
    try {
        return await Payment.create(data); // Creates a new payment record in the database
        
      } catch (error) {
        throw new Error(`Error creating payment: ${error.message}`);
      }
};


// exports.createPaymentInfo = async (data) => {
//     try {
//       const paymentInfo = new Payment(data);
//       await paymentInfo.save();
//       return paymentInfo;
//     } catch (error) {
//       throw new Error('Error saving payment information: ' + error.message);
//     }
//   };  
