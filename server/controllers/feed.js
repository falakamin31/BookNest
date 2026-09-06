// GET /books
const { validationResult } = require("express-validator");
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
            console.log(err);
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
            console.log(err);
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
