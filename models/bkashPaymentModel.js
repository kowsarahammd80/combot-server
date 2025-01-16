const mongoose = require('mongoose');

const PaymentBkashSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    trxID: {
        type: String,
    },
    paymentID: {
        type: String,
    },
    date: {
        type: String,
    },
    // name: {type:String},         
    // email: {type:String},        
    // businessName: {type:String}, 
    // contactNumber: {type:String},
    // packageName: {type:String},  
    amount: {type: Number},       
    // currency: {type:String},
}, {timestamps: true});

module.exports = mongoose.model('PaymentBkash', PaymentBkashSchema);