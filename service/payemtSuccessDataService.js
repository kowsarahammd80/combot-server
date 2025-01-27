const BkashPayment = require("../models/rePaymentModel");

exports.byDefaultAbandonedService =async (data) => {
    try {
        const newPayment = new BkashPayment(data);
        return await newPayment.save();
      } catch (error) {
        throw error;
      }
}

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
    const query = { paymentStatus: "abandoned" };

    // Log query and results for debugging
    // console.log("Query:", query);
    const results = await BkashPayment.find(query).sort({ date: -1 });
    // console.log("Results:", results);

    return results;
};