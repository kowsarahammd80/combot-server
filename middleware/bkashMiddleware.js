const axios = require('axios');
const globals = require('node-global-storage');

class middleware {
    bkash_auth = async (req, res, next) => {
        try {
            // Unset (delete) the old id_token
            if (globals.id_token) {
                delete globals.id_token;
                console.log("Old id_token removed");
            }

            // Generate a new token by calling the bKash API
            const { data } = await axios.post(
                'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant',
                {
                    app_key: '4f6o0cjiki2rfm34kfdadl1eqq',
                    app_secret: '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b',
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        username: 'sandboxTokenizedUser02',
                        password: 'sandboxTokenizedUser02@12345',
                    },
                }
            );

            // Set the new id_token
            globals.id_token = data.id_token;
            console.log("New id_token generated:", globals.id_token);

            // Proceed to the next middleware or request handler
            next();
        } catch (error) {
            console.error("Error generating new id_token:", error.message);

            // Send a 401 Unauthorized response with an error message
            return res.status(401).json({ error: "Failed to generate a new id_token: " + error.message });
        }
    };
}

module.exports = new middleware();