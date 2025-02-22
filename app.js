const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session"); // 🔹 Import express-session
const MongoStore = require("connect-mongo");
const body_parser = require('body-parser')

//meddle ware 

app.use(express.json());
const allowedOrigins = [
    'https://reviewqr.xyz',
    'https://payapi.watheta.com',
    'https://payment.watheta.com',
    'https://payadmin.watheta.com',
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

app.use(session({
    secret: process.env.SECRET_KEY, // Change this to a secure key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DataBase, // Change to your DB
        collectionName: "sessions",
    }),
    cookie: {
        secure: false, // Change to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day expiry
    },
}));

const paymentRoute = require ('./routers/paymentRoutes.js')
const rePaymentRoutes = require('./routers/rePaymentRoutes.js')
const paymentSuccessDataRoutes = require('./routers/paymentSuccessDataRoutes.js')
const payStationRouter = require('./routers/payStationRouter.js')
const packageRouters = require ('./routers/packageRouters.js')
const userRouter = require ('./routers/userRouter.js')


app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});


app.use('/api', rePaymentRoutes)
app.use('/api/paymentInfo', paymentRoute);
app.use('/api', paymentSuccessDataRoutes)
app.use('/api', payStationRouter)
app.use('/api', packageRouters)
app.use('/api', userRouter);


module.exports = app;