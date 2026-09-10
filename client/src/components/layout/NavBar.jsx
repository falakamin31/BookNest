import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const isLoggedIn = Boolean(user && token);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate("/");
    };

    const navLinks = [
        { name: "Browse", path: "/" },
        ...(isLoggedIn
            ? [
                  { name: "Add Book", path: "/add-book" },
                  { name: "My Books", path: "/my-books" },
              ]
            : []),
    ];

    const linkClass = ({ isActive }) =>
        `text-sm transition-colors ${
            isActive ? "text-ink" : "text-body hover:text-ink"
        }`;

    return (
        <nav className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="font-display text-2xl font-semibold tracking-tight text-ink"
                >
                    Book<span className="text-accent">Nest</span>
                </Link>

                {/* Desktop */}
                <ul className="hidden items-center gap-7 md:flex">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink to={link.path} className={linkClass} end>
                                {link.name}
                            </NavLink>
                        </li>
                    ))}

                    {isLoggedIn ? (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer rounded-full border border-line px-4 py-1.5 text-sm text-body transition-colors hover:border-line-strong hover:text-ink"
                            >
                                Log out
                            </button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/login" className={linkClass}>
                                    Log in
                                </NavLink>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
                                >
                                    Sign up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Mobile toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer text-xl text-ink md:hidden"
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    {isOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <ul className="flex flex-col gap-1 border-t border-line bg-surface px-6 py-3 md:hidden">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block py-2 text-sm ${
                                        isActive ? "text-ink" : "text-body"
                                    }`
                                }
                                end
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}

                    {isLoggedIn ? (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="block cursor-pointer py-2 text-sm text-body"
                            >
                                Log out
                            </button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 text-sm text-body"
                                >
                                    Log in
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 text-sm font-medium text-accent"
                                >
                                    Sign up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default NavBar;
