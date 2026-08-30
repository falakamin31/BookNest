// GET /books
exports.getBooks = (req, res, next) => {
    res.status(200).json({
        book: {
            id: 1,
            title: "Node js",
            imageUrl: "images/book.png",
            authorName: "Mario",
        },
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
