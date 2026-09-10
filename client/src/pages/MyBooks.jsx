import { useState, useEffect } from "react";
import { BookCard } from "../components";

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

    if (loading) {
        return <p className="text-center text-gray-400 py-20">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-white">
                        My Books
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Books you've added to BookNest
                    </p>
                </div>
            </div>

            {error && (
                <p className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5">
                    {error}
                </p>
            )}

            {books.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard
                            key={book._id}
                            book={book}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                !error && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">
                            You haven't added any books yet.
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default MyBooks;
