import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./auth-context";
import { setUnauthorizedHandler } from "../services/api";

const readStoredAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || storedToken === "undefined" || !storedUser) {
        return { user: null, token: null };
    }

    try {
        return { user: JSON.parse(storedUser), token: storedToken };
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return { user: null, token: null };
    }
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(readStoredAuth);
    const { user, token } = auth;

    const login = useCallback((userData, userToken) => {
        setAuth({ user: userData, token: userToken });
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setAuth({ user: null, token: null });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }, []);

    // Any 401 from the API clears the session; ProtectedRoutes then
    // redirects on the next render.
    useEffect(() => {
        setUnauthorizedHandler(logout);
        return () => setUnauthorizedHandler(null);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
