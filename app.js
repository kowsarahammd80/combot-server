const express = require("express");
const app = express();
const cors = require("cors");
const body_parser = require('body-parser')

//meddle ware 

app.use(express.json());
const allowedOrigins = [
    'beamish-dodol-d1568a.netlify.app',
    'unrivaled-bombolone-c1a555.netlify.app',
    'polite-cactus-675786.netlify.app',
    'https://combot-server-1.onrender.com'
];

app.use(cors({
    origin: (origin, callback) => {
        console.log('Incoming origin:', origin); // Debugging
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error('CORS error for origin:', origin); // Debugging
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(body_parser.json())

const paymentRoute = require ('./routers/paymentRoutes.js')
// const bkashRoute = require ('./routers/bkashPaymentRoutes.js')
const rePaymentRoutes = require('./routers/rePaymentRoutes.js')
const paymentSuccessDataRoutes = require('./routers/paymentSuccessDataRoutes.js')
// const paymentInreget = require ('./routers/paymentIntregetRoutes.js')

app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});

app.use('/api', rePaymentRoutes)
app.use('/api/paymentInfo', paymentRoute);
app.use('/api', paymentSuccessDataRoutes)
// app.use('/api', bkashRoute)
// app.use('/api/bkash', paymentInreget)

module.exports = app;