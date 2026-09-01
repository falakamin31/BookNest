// GET /books
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
    const title = req.body.title;
    const imageUrl = req.body.image;
    const authorName = req.body.authorName;
    const id = new Date().toISOString();
    let book = { id, title, imageUrl, authorName };

    res.status(200).json({
        message: "Book created successfully",
        book: book,
    });
};
