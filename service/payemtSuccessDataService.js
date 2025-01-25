const BkashPayment = require("../models/rePaymentModel");


exports.getPayments = async (packageName) => {
    // Filter by package name if provided, else return all payments
    const query = {
        refund: "",
        paymentStatus: "success", // Ensure only successful payments are retrieved
    };
    if (packageName) {
        query.packageName = packageName;
    }
    return await BkashPayment.find(query).sort({ date: -1 });;
};

exports.getAbandonedPayments = async () => {
    // Query to filter payments with paymentStatus: "abonded"
    const query = { paymentStatus: "abandoned" };
    return await BkashPayment.find(query).sort({ date: -1 });;
};