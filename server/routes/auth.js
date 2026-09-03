const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post(
    "/signup",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email")
            .isEmail()
            .notEmpty()
            .withMessage("Please enter valid email")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject("Email address already exists");
                    }
                });
            }),
        body("password").notEmpty(),
    ],
    authController.signUp,
);

router.post("/login", authController.login);

module.exports = router;
