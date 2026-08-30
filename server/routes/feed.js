const express = require("express");
const router = express.Router();

const booksController = require("../controllers/feed");

router.get("/books", booksController.getBooks);

router.post("/book", booksController.createBook);

module.exports = router;
