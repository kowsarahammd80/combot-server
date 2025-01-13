const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const app = require ('./app.js')

mongoose.connect(process.env.DataBase).then(() => {
    console.log(`Database connected is successful`)
})

const port = process.env.Port || 8080;

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})