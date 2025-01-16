const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentID: { type: String, required: true, unique: true },
  amount: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  status: { type: String, default: "Pending" }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PaymentIntreGet", paymentSchema);