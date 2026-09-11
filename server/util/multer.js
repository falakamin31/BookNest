const multer = require("multer");

// Files are held in memory and streamed straight to Cloudinary,
// so nothing is ever written to the server's disk.
const fileStorage = multer.memoryStorage();

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
