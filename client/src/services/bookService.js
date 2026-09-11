import { apiFetch } from "./api";

export const getBooks = (params = {}) => {
    const query = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v),
    ).toString();
    return apiFetch(`/feed/books${query ? `?${query}` : ""}`);
};

export const getMyBooks = () => apiFetch("/feed/my-books", { auth: true });

export const getBook = (id) => apiFetch(`/feed/book/${id}`);

export const createBook = (formData) =>
    apiFetch("/feed/book", {
        method: "POST",
        body: formData,
        isForm: true,
        auth: true,
    });

export const updateBook = (id, formData) =>
    apiFetch(`/feed/book/${id}`, {
        method: "PUT",
        body: formData,
        isForm: true,
        auth: true,
    });

export const deleteBook = (id) =>
    apiFetch(`/feed/book/${id}`, { method: "DELETE", auth: true });
