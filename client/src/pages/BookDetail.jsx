import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    console.log(book, "book details for id:", id);
    const [loading, setLoading] = useState(true);

    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const isOwner = user && book && book.createdBy === user.id;
    console.log("isOwner:", isOwner, "user:", user, "book:", book);

    useEffect(() => {
        
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/feed/book/${id}`,
                );
                if (!response.ok) {
                    throw new Error("failed to fetched the book");
                }
                const data = await response.json();
                setBook(data.book);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [id]);

    const handleEdit = () => {
        navigate(`/edit-book/${id}`);
    };

    const handleDelete = () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?",
        );
        if (!confirmed) return;

        setDeleting(true);
        console.log("Deleting book with id:", id);
        setDeleting(false);
    };
    if (loading) {
        return (
            <p
                className="text-center text-gray-400 py-20"
            >
                Loading...
            </p>
        );
    }
    if (!book) {
        return (
            <p
                className="text-center text-red-400 py-20"
            >
                {error || "Book not found"}
            </p>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                ← Back to books
            </Link>

            {error && (
                <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5 mt-4">
                    {error}
                </p>
            )}

            <div className="grid md:grid-cols-3 gap-10 mt-6 items-start">
                <div className="md:col-span-1">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-white/10">
                        <img
                            src={`http://localhost:8080/${book.imageUrl}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-white">
                            {book.title}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            by {book.authorName}
                        </p>
                    </div>

                    <span className="text-primary text-2xl font-semibold">
                        ${book.price}
                    </span>

                    <p className="text-gray-300 leading-relaxed">
                        {book.description}
                    </p>

                    {isOwner && (
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleEdit}
                                className="bg-surface border border-white/10 hover:border-primary text-white px-6 py-2.5 rounded-lg transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
