const globals = require('node-global-storage');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // Ensure this package is installed
const BkashPayment = require('../models/rePaymentModel');

class rePaymentController {
    // Method to generate bkash headers
    bkash_headers = async () => {
        return {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: globals.id_token, // Direct property access
            'x-app-key': process.env.bkash_api_key, // Ensure this is set in your .env file
        };
    };

    // Method to create a payment
    payment_create = async (req, res) => {
        const { amount, userId, name, email, number, packageName, currency } = req.body;

        // Store userId in the global object
        globals.userId = userId;

        try {
            const { data } = await axios.post(
                process.env.bkash_create_payment_url,
                {
                    mode: '0011',
                    payerReference: " ",
                    callbackURL: `http://localhost:5000/api/test/payment/callback?name=${name}&email=${email}&number=${number}&packageName=${packageName}&currency=${currency}`,
                    amount: amount,
                    currency: "BDT",
                    intent: 'sale',
                    merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 5),
                },
                {
                    headers: await this.bkash_headers(),
                }
            );

            // console.log(data)

            return res.status(200).json({ bkashURL: data.bkashURL });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    };

    call_back = async (req, res) => {
        const { paymentID, status } = req.query
        console.log(req.query)

        if (status === 'cancel' || status === 'failure') {
            return res.redirect(`http://localhost:3001/error?message=${status}`)
        }
        if (status === 'success') {
            try {
                const { data } = await axios.post(process.env.bkash_execute_payment_url, { paymentID }, {
                    headers: await this.bkash_headers()
                })
                if (data && data.statusCode === '0000') {
                    //const userId = globals.get('userId')
                    await BkashPayment.create({
                        userId: Math.random() * 10 + 1 ,
                        paymentID,
                        trxID: data.trxID,
                        date: data.paymentExecuteTime,
                        amount: parseInt(data.amount),
                        name: req.query.name,
                        email: req.query.email,
                        number: req.query.number,
                        packageName: req.query.packageName,
                        invoiceNumber: data.merchantInvoiceNumber
                    })
                    // console.log(data)
                         
                    return res.redirect(`http://localhost:3001/success?message=${data.statusMessage}`)
                }else{
                    return res.redirect(`http://localhost:3001/error?message=${data.statusMessage}`)
                }
            } catch (error) {
                // console.log(error)
                return res.redirect(`http://localhost:3001/error?message=${error.message}`)
            }
        }
    }

    get_all_payments = async (req, res) => {
        try {
            const payments = await BkashPayment.find(); // Retrieve all records

            if (!payments || payments.length === 0) {
                return res.status(404).json({ message: "No payment records found." });
            }

            return res.status(200).json({ payments });
        } catch (error) {
            return res.status(500).json({ error: "Error retrieving payment records: " + error.message });
        }
    };

    refundPayment = async(req,res)=>{
        const {trxID} = req.params;
        // console.log("trx", req.params)
        try {
            const payment = await BkashPayment.findOne({trxID})
            console.log("paymentInfo",payment)
            const {data} = await axios.post(process.env.bkash_refund_transaction_url,{
                paymentID : payment.paymentID,
                amount : payment.amount,
                trxID,
                sku : 'payment',
                reason : 'cashback'
            },{
                headers: await this.bkash_headers()
            })
            // console.log(payment.paymentID)
            if (data && data.statusCode === '0000') {
                return res.status(200).json({message : 'refund success'})
            }else{
                return res.status(404).json({error : 'refund failed'})
            }
        } catch (error) {
            return res.status(404).json({error : 'refund failed'})
        }
    }
    
}

module.exports = new rePaymentController();