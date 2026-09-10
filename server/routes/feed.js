const express = require("express");
const upload = require("../util/multer");
const { body } = require("express-validator");

const router = express.Router();

const booksController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");

router.get("/books", booksController.getBooks);
router.get("/my-books", isAuth, booksController.getMyBooks);

router.post(
    "/book",
    isAuth,
    upload.single("image"),
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("authorName")
            .trim()
            .notEmpty()
            .withMessage("Author name is required"),
        body("price")
            .notEmpty()
            .withMessage("Price is required")
            .isFloat({ gt: 0 })
            .withMessage("Price must be a positive number"),
    ],
    booksController.createBook,
);

router.get("/book/:id", booksController.singleBook);
router.put(
    "/book/:id",
    isAuth,
    upload.single("image"),
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("authorName")
            .trim()
            .notEmpty()
            .withMessage("Author name is required"),
        body("price")
            .notEmpty()
            .withMessage("Price is required")
            .isFloat({ gt: 0 })
            .withMessage("Price must be a positive number"),
    ],
    booksController.editBook,
);
router.delete("/book/:id", isAuth, booksController.deleteBook);

router.get("/my-books", isAuth, booksController.getMyBooks);

module.exports = router;
