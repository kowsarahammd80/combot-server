const express = require("express");
const app = express();
const cors = require("cors");
const body_parser = require('body-parser')

//meddle ware 

app.use(express.json());
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'
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
const rePaymentRoutes = require('./routers/rePaymentRoutes.js')
const paymentSuccessDataRoutes = require('./routers/paymentSuccessDataRoutes.js')
const payStationRouter = require('./routers/payStationRouter.js')
const packageRouters = require ('./routers/packageRouters.js')


app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});

app.use('/api', rePaymentRoutes)
app.use('/api/paymentInfo', paymentRoute);
app.use('/api', paymentSuccessDataRoutes)
app.use('/api', payStationRouter)
app.use('/api', packageRouters)


module.exports = app;