const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Registered by AuthProvider so a 401 anywhere can clear the session.
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler;
};

/**
 * Single entry point for every request to the API.
 * Attaches the base URL, the auth header and JSON encoding,
 * unwraps errors into a thrown Error, and reacts to 401s.
 */
export const apiFetch = async (
    path,
    { method = "GET", body, auth = false, isForm = false } = {},
) => {
    const headers = {};

    if (auth) {
        headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    // FormData sets its own multipart Content-Type (with the boundary).
    if (body && !isForm) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401 && onUnauthorized) {
        onUnauthorized();
    }

    if (!response.ok) {
        throw new Error(
            data.errors?.[0]?.msg || data.message || "Something went wrong",
        );
    }

    return data;
};

/** Resolve a stored relative image path against the API origin. */
export const assetUrl = (imagePath) => `${BASE_URL}/${imagePath}`;
