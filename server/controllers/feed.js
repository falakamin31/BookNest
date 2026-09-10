// GET /books
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const Book = require("../models/book");

exports.getBooks = (req, res, next) => {
    Book.find()
        .then((books) => {
            res.status(200).json({
                message: "Book fetched successfully",
                books: books,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createBook = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    if (!req.file) {
        return res.status(422).json({ message: "No image provided" });
    }

    const title = req.body.title;
    const authorName = req.body.authorName;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.file.path;

    const book = new Book({
        title: title,
        authorName: authorName,
        price: price,
        description: description,
        imageUrl: imageUrl,
        createdBy: req.userId,
    });
    return book
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Book created successfully",
                book: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
exports.singleBook = (req, res, next) => {
    const id = req.params.id;

    Book.findById(id)
        .then((book) => {
            if (!book) {
                const error = new Error("Book not found");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "Fetched single book",
                book: book,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.editBook = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(
            "Validation failed, entered data is not correct",
        );
        error.statusCode = 422;
        throw error;
    }
    const bookId = req.params.id;
    const title = req.body.title;
    const authorName = req.body.authorName;
    const price = req.body.price;
    const description = req.body.description;

    Book.findById(bookId)
        .then((book) => {
            if (!book) {
                const error = new Error("No book found");
                error.statusCode = 404;
                throw error;
            }

            if (book.createdBy.toString() !== req.userId) {
                const error = new Error("Not authorized");
                error.statusCode = 403;
                throw error;
            }

            if (req.file) {
                clearImage(book.imageUrl);
                book.imageUrl = req.file.path;
            }
            book.title = title;
            book.description = description;
            book.authorName = authorName;
            book.price = price;

            return book.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Book saved successfully",
                book: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteBook = (req, res, next) => {
    const id = req.params.id;

    Book.findById(id)
        .then((book) => {
            if (!book) {
                const error = new Error("Book not found");
                error.statusCode = 404;
                throw error;
            }
            if (book.createdBy.toString() !== req.userId) {
                const error = new Error("Not authorized");
                error.statusCode = 403;
                throw error;
            }

            clearImage(book.imageUrl);
            return book.deleteOne();
        })
        .then(() => {
            res.status(200).json({
                message: "Book deleted successfully",
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log("Failed to delete old image:", err);
        }
    });
};
