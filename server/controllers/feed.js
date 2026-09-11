// GET /books
const { validationResult } = require("express-validator");
const { uploadImage, deleteImage } = require("../util/cloudinary");
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


exports.getMyBooks = (req, res, next) => {
    Book.find({ createdBy: req.userId })
        .sort({ createdAt: -1 })
        .then((books) => {
            res.status(200).json({
                message: "Books fetched successfully",
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

    uploadImage(req.file.buffer)
        .then((uploaded) => {
            const book = new Book({
                title: title,
                authorName: authorName,
                price: price,
                description: description,
                imageUrl: uploaded.secure_url,
                imagePublicId: uploaded.public_id,
                createdBy: req.userId,
            });
            return book.save();
        })
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

            book.title = title;
            book.description = description;
            book.authorName = authorName;
            book.price = price;

            if (!req.file) {
                return book.save();
            }

            // Upload the new cover first, save, then bin the old one —
            // so a failed upload never destroys the existing image.
            const previousPublicId = book.imagePublicId;
            return uploadImage(req.file.buffer)
                .then((uploaded) => {
                    book.imageUrl = uploaded.secure_url;
                    book.imagePublicId = uploaded.public_id;
                    return book.save();
                })
                .then((saved) => {
                    deleteImage(previousPublicId);
                    return saved;
                });
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

            const publicId = book.imagePublicId;
            return book.deleteOne().then(() => deleteImage(publicId));
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
