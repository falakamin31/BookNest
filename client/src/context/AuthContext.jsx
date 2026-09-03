import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        const stored = localStorage.getItem("token");
        return stored && stored !== "undefined" ? stored : null;
    });

    
      useEffect(() => {
          const storedUser = localStorage.getItem("user");
          if (!storedUser) return;

          try {
              setUser(JSON.parse(storedUser));
          } catch {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              setToken(null);
          }
      }, []);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
