const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();
const mongoose = require("mongoose");

const booksRoutes = require("./routes/feed");
const upload = require("./util/multer");

// for parsing json
app.use(express.json());

// parses form-urlencoded bodies (optional, add if you ever submit HTML forms)
app.use(express.urlencoded({ extended: true }));

//  static folder taake images browser se access ho sakein
app.use("images/", express.static(path.join(__dirname, "images")));

// CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use("/feed", booksRoutes);

mongoose.connect(process.env.MONGODB_URI).then((result) => {
    console.log("Connected to mongodb");

    app.listen(process.env.PORT || 8080);
});
