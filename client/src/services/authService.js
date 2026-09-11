import { apiFetch } from "./api";

export const login = (credentials) =>
    apiFetch("/auth/login", { method: "POST", body: credentials });

export const signup = (details) =>
    apiFetch("/auth/signup", { method: "POST", body: details });
