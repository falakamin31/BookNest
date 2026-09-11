const multer = require("multer");
const fs = require("fs");
const path = require("path");

// multer fails with ENOENT if the folder is missing, so make sure it exists.
const uploadDir = path.join(__dirname, "..", "images");
fs.mkdirSync(uploadDir, { recursive: true });

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

module.exports = upload;
