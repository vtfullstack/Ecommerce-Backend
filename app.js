const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const path = require("path");
const errorMiddleware = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
require('dotenv').config();

app.use(express.json())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const product = require("./routes/productRoute.js");
const user = require("./routes/userRoute.js");
const order = require("./routes/orderRoute.js");
// const payment = require("./routes/paymentRoute.js");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
// app.use("/api/v1", payment);

app.get("/home",(req,res)=>{
    return res.json({
        data:"Hello AKash ANand"
    }).status(200)
})

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
