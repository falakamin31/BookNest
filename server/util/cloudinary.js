const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Upload an in-memory image buffer. Resolves with { secure_url, public_id }. */
const uploadImage = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "booknest", resource_type: "image" },
            (err, result) => (err ? reject(err) : resolve(result)),
        );
        stream.end(buffer);
    });

/** Best-effort delete. Never rejects — a stale file must not fail the request. */
const deleteImage = (publicId) => {
    if (!publicId) return Promise.resolve();
    return cloudinary.uploader.destroy(publicId).catch((err) => {
        console.log("Failed to delete Cloudinary image:", err.message);
    });
};

module.exports = { uploadImage, deleteImage };
