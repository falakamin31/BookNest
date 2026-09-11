const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();
const mongoose = require("mongoose");

const booksRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

// for parsing json
app.use(express.json());

// parses form-urlencoded bodies (optional, add if you ever submit HTML forms)
app.use(express.urlencoded({ extended: true }));

//  static folder taake images browser se access ho sakein
app.use("/images", express.static(path.join(__dirname, "images")));

// CORS — CLIENT_URL may hold a comma-separated list of allowed origins.
// If it is unset (local dev) any origin is allowed.
const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use((req, res, next) => {
    const origin = req.get("Origin");

    if (allowedOrigins.length === 0) {
        res.setHeader("Access-Control-Allow-Origin", "*");
    } else if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    }

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

// Health check — Render pings "/" to decide if the service is up
app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", service: "BookNest API" });
});

app.use("/feed", booksRoutes);
app.use("/auth", authRoutes);

// Unknown route -> JSON 404 (Express would otherwise send an HTML page,
// which breaks the client's response.json())
app.use((req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// Error middleware
app.use((error, req, res, next) => {
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "Image must be 2 MB or smaller" });
    }

    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message });
});

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set — check your .env file");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            console.log(`BookNest API listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Could not connect to MongoDB:", err.message);
        process.exit(1);
    });
