// const axios = require('axios')
// const globals = require('node-global-storage')


// class middleware {
//     bkash_auth = async (req, res, next) => {

//         // globals.unset('id_token')

//         try {
//             const { data } = await axios.post('https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
//                 app_key: '4f6o0cjiki2rfm34kfdadl1eqq',
//                 app_secret: '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b',
//             }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//                     username: 'sandboxTokenizedUser02',
//                     password: 'sandboxTokenizedUser02@12345',
//                 }
//             })

//             console.log(data)

//             globals.set('id_token', data.id_token, { protected: true })

//             next()
//         } catch (error) {
//             // console.log(error.message)
//             return res.status(401).json({ error: error.message })
//         }
//     }
// }

// module.exports = new middleware()

const axios = require('axios');
const globals = require('node-global-storage');

class middleware {
    bkash_auth = async (req, res, next) => {
        try {
            const { data } = await axios.post(
                'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant',
                {
                    app_key: '4f6o0cjiki2rfm34kfdadl1eqq',
                    app_secret: '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b',
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        username: 'sandboxTokenizedUser02',
                        password: 'sandboxTokenizedUser02@12345',
                    },
                }
            );

            // console.log(data);

            // Correct way to set a global variable
            globals.id_token = data.id_token; // Directly assign the property

            next();
        } catch (error) {
            console.error(error.message);
            return res.status(401).json({ error: error.message });
        }
    };
}

module.exports = new middleware();