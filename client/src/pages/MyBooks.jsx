import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookCard, Loader } from "../components";

const MyBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/feed/my-books",
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    },
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch your books",
                    );
                }
                setBooks(data.books);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchMyBooks();
    }, []);

    const handleDelete = (deletedId) => {
        setBooks((prev) => prev.filter((b) => b._id !== deletedId));
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-6">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                        My books
                    </h1>
                    <p className="mt-2 text-body">
                        Everything you've added to BookNest.
                    </p>
                </div>
                <Link
                    to="/add-book"
                    className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
                >
                    Add a book
                </Link>
            </header>

            <div className="my-5 h-px bg-line" />

            {error && (
                <p role="alert" className="mb-8 rounded-lg border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
                    {error}
                </p>
            )}

            {loading ? (
                <Loader label="Loading your books" />
            ) : books.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {books.map((book, i) => (
                        <BookCard
                            key={book._id}
                            book={book}
                            index={i}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                !error && (
                    <div className="rounded-xl border border-dashed border-line-strong py-20 text-center">
                        <p className="font-display text-xl text-ink">
                            You haven't added any books yet
                        </p>
                        <p className="mt-2 text-sm text-muted">
                            Your shelf is waiting.
                        </p>
                        <Link
                            to="/add-book"
                            className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
                        >
                            Add your first book
                        </Link>
                    </div>
                )
            )}
        </div>
    );
};

export default MyBooks;
