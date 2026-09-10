import { useEffect, useState } from "react";
import { BookCard, Loader } from "../components";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/feed/books",
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to load books");
                }
                setBooks(data.books);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleDelete = (deletedId) => {
        setBooks((prev) => prev.filter((b) => b._id !== deletedId));
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-6">
            <header className="max-w-xl">
                <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
                    Browse books
                </h1>
                <p className="mt-2 text-body">
                    Discover what the community is reading, and share the ones
                    you love.
                </p>
            </header>

            <div className="my-5 h-px bg-line" />

            {error && (
                <p role="alert" className="mb-8 rounded-lg border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
                    {error}
                </p>
            )}

            {loading ? (
                <Loader label="Loading books" />
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
                            No books yet
                        </p>
                        <p className="mt-2 text-sm text-muted">
                            Be the first to add one.
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default Home;
