const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookModel = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Book", BookModel);
