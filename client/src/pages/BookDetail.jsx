import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const dummyBook = {
    id: 1,
    title: "The Midnight Library",
    authorName: "Matt Haig",
    price: 14.99,
    imageUrl: "https://covers.openlibrary.org/b/id/10389359-L.jpg",
    description:
        "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    createdBy: "someUserId123",
};

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const isOwner = user && dummyBook.createdBy === user.id;

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
                            src={dummyBook.imageUrl}
                            alt={dummyBook.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-white">
                            {dummyBook.title}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            by {dummyBook.authorName}
                        </p>
                    </div>

                    <span className="text-primary text-2xl font-semibold">
                        ${dummyBook.price}
                    </span>

                    <p className="text-gray-300 leading-relaxed">
                        {dummyBook.description}
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
