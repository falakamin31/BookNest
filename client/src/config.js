// Base URL of the BookNest API.
// Set VITE_API_URL in client/.env when deploying.
export const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Covers are stored on Cloudinary as absolute URLs. Older books may still
// hold a relative path, so those get resolved against the API origin.
export const imageSrc = (imageUrl) =>
    imageUrl?.startsWith("http") ? imageUrl : `${API}/${imageUrl}`;
