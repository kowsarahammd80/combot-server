const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  businessName: { type: String},
  contactNumber: { type: Number},
  packegPrice: { type: Number},
  currencySymbol: { type: String},
}, );

module.exports = mongoose.model("Payment", paymentSchema);
