import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuh";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Add Book", path: "/add-book" },
        { name: "My Books", path: "/my-books" },
    ];
    const { user } = useAuth();
    console.log("Current user:", user);

    return (
        <nav className="bg-background text-white shadow-md relative">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-heading font-bold tracking-tight text-primary"
                >
                    BookNest
                </Link>

                {/* Desktop links */}
                <ul className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className="hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            to="/login"
                            className="hover:text-primary transition-colors"
                        >
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/signup"
                            className="bg-primary hover:opacity-90 px-4 py-1.5 rounded-md transition-opacity"
                        >
                            Signup
                        </Link>
                    </li>
                </ul>

                {/* Mobile hamburger button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-2xl focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <ul className="md:hidden flex flex-col gap-1 bg-background px-4 pb-4">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="block py-2 hover:text-primary transition-colors"
                        >
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/signup"
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-primary font-medium"
                        >
                            Signup
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default NavBar;
