// GET /books
const { validationResult } = require("express-validator");
exports.getBooks = (req, res, next) => {
    const dummyBooks = [
        {
            id: 1,
            title: "The Midnight Library",
            authorName: "Matt Haig",
            price: 14.99,
            imageUrl: "https://covers.openlibrary.org/b/id/10389359-L.jpg",
        },
        {
            id: 2,
            title: "Atomic Habits",
            authorName: "James Clear",
            price: 18.5,
            imageUrl: "https://covers.openlibrary.org/b/id/8383052-L.jpg",
        },
    ];
    res.status(200).json({
        books: dummyBooks,
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

    const book = { title, imageUrl, authorName, price, description };

    res.status(200).json({
        message: "Book created successfully",
        book: book,
    });
};
