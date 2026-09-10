import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const BookCard = ({ book, onDelete }) => {
    const { user } = useAuth();
    const [deleting, setDeleting] = useState(false);
    const isOwner = user && book.createdBy === user.id;

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Delete "${book.title}"? This cannot be undone.`,
        );
        if (!confirmed) return;

        setDeleting(true);

        try {
            const response = await fetch(
                `http://localhost:8080/feed/book/${book._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                },
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to delete the book");
            }
            if (onDelete) {
                onDelete(book._id);
            }
        } catch (err) {
            window.alert(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-colors group">
            <Link to={`/book/${book._id}`}>
                <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                    <img
                        src={`http://localhost:8080/${book.imageUrl}`}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </Link>

            <div className="p-4">
                <h3 className="font-heading text-lg font-semibold text-white truncate">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{book.authorName}</p>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-primary font-semibold">
                        ${book.price}
                    </span>
                    <Link
                        to={`/book/${book._id}`}
                        className="text-xs font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        View →
                    </Link>
                </div>

                {isOwner && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                        <Link
                            to={`/edit-book/${book._id}`}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            Edit
                        </Link>
                        <span className="text-xs text-gray-600">·</span>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;
