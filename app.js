const express = require("express");
const app = express();
const cors = require("cors");
const { mongoose } = require("mongoose");

//meddle ware 
app.use(express.json());
app.use(cors());

const paymentRoute = require ('./routers/paymentRoutes.js')

app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});

app.use('/api/paymentInfo', paymentRoute);

module.exports = app;