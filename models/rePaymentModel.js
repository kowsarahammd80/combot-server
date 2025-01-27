const mongoose = require("mongoose");

// const rePaymentSchema = new mongoose.Schema({
//   userId:{
//     type: Number,
//   },
//   paymentID:{
//     type: String,
//   },
//   trxID:{
//     type: String,
//   },
//   number:{
//     type: String,
//   },
//   email:{
//     type: String,
//   },
//   packageName: {
//     type: String
//   },
//   name:{
//     type: String
//   },
//   date: {
//     type: String,
//     default: Date.now,
//   },
//   amount: {
//     type: Number,
//   },
//   invoiceNumber:{
//     type: String
//   }
// });

const rePaymentSchema = new mongoose.Schema({
  userId: {
    type: Number,
  },
  paymentID: {
    type: String,
  },
  trxID: {
    type: String,
  },
  number: {
    type: String,
  },
  email: {
    type: String,
  },
  packageName: {
    type: String,
  },
  businessName: { // Add this field
    type: String,
  },
  paymentStatus:{
    type: String,
  },
  name: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
  amount: {
    type: Number,
  },
  refund: {
    type: String
  },
  paymentType: {
    type: String  
  },
  paymentNumber: {
    type: String  
  },
  invoiceNumber: {
    type: String,
  },
});


const BkashPayment = mongoose.model("BkashPayment", rePaymentSchema);

module.exports = BkashPayment;
