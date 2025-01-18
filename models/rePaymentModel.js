const mongoose = require("mongoose");

const rePaymentSchema = new mongoose.Schema({
  userId:{
    type: Number,
  },
  paymentID:{
    type: String,
  },
  trxID:{
    type: String,
  },
  number:{
    type: String,
  },
  email:{
    type: String,
  },
  packageName: {
    type: String
  },
  name:{
    type: String
  },
  date: {
    type: String,
    default: Date.now,
  },
  amount: {
    type: Number,
  },
  invoiceNumber:{
    type: String
  }
});

const BkashPayment = mongoose.model("BkashPayment", rePaymentSchema);

module.exports = BkashPayment;
