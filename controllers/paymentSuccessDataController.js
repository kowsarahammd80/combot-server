const paymentSuccessDataService = require('../service/payemtSuccessDataService')


exports.byDefaultAbandonedController = async (req, res) => {
    try {
        const byDefaultAbandoned = req.body;
        const createdPayment = await paymentSuccessDataService.byDefaultAbandonedService(byDefaultAbandoned);
        res.status(201).json({ success: true, message: "Payment created successfully", data: createdPayment });
      } catch (error) {
        res.status(500).json({ success: false, message: "Error creating payment", error: error.message });
      }
}

exports.getPaymentsController = async (req, res) => {
    const { packageName } = req.query;

    try {
        // Fetch data using the service
        const payments = (await paymentSuccessDataService.getPayments(packageName));

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "No payment records found." });
        }

        res.status(200).json({ payments });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving payments: " + error.message });
    }
};

exports.getAbandonedPaymentsController = async (req, res) => {
    try {
        const abandonedPayments = await paymentSuccessDataService.getAbandonedPayments();

        if (!abandonedPayments || abandonedPayments.length === 0) {
            return res.status(404).json({ message: "No abandoned payment records found." });
        }

        res.status(200).json({ payments: abandonedPayments });
    } catch (error) {
        console.error("Error fetching abandoned payments:", error);
        res.status(500).json({ error: "Error retrieving abandoned payments: " + error.message });
    }
};