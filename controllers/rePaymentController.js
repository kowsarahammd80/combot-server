// const globals = require('node-global-storage')

// class rePaymentController {
//     bkash_headers = async () => {
//         return {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             authorization: globals.get('id_token'),
//             'x-app-key': process.env.bkash_api_key,
//         }
//     }
//     payment_create = async (req, res) => {

//         const { amount, userId } = req.body
//         globals.set('userId', userId)
//         try {
//             const { data } = await axios.post(process.env.bkash_create_payment_url, {
//                 mode: '0011',
//                 payerReference: " ",
//                 callbackURL: 'http://localhost:5000/api/rebkash/payment/callback',
//                 amount: amount,
//                 currency: "BDT",
//                 intent: 'sale',
//                 merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 5)
//             }, {
//                 headers: await this.bkash_headers()
//             })
//             return res.status(200).json({ bkashURL: data.bkashURL })
//         } catch (error) {
//             return res.status(401).json({ error: error.message })
//         }

//     }
// } 

// module.exports = new rePaymentController()

const globals = require('node-global-storage');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // Ensure this package is installed

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
        const { amount, userId } = req.body;

        // Store userId in the global object
        globals.userId = userId;

        try {
            const { data } = await axios.post(
                process.env.bkash_create_payment_url,
                {
                    mode: '0011',
                    payerReference: " ",
                    callbackURL: 'http://localhost:5000/api/test/payment/callback',
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

        if (status === 'cancel' || status === 'failure') {
            return res.redirect(`http://localhost:3000/error?message=${status}`)
        }
        if (status === 'success') {
            try {
                const { data } = await axios.post(process.env.bkash_execute_payment_url, { paymentID }, {
                    headers: await this.bkash_headers()
                })
                if (data && data.statusCode === '0000') {
                    //const userId = globals.get('userId')
                    await paymentModel.create({
                        userId: Math.random() * 10 + 1 ,
                        paymentID,
                        trxID: data.trxID,
                        date: data.paymentExecuteTime,
                        amount: parseInt(data.amount)
                    })

                    return res.redirect(`http://localhost:3000/success`)
                }else{
                    return res.redirect(`http://localhost:3000/error?message=${data.statusMessage}`)
                }
            } catch (error) {
                console.log(error)
                return res.redirect(`http://localhost:5173/error?message=${error.message}`)
            }
        }
    }
}

module.exports = new rePaymentController();