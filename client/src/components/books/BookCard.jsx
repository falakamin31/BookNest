import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ConfirmDialog } from "../common";
import { API } from "../../config";

const BookCard = ({ book, onDelete, index = 0 }) => {
    const { user } = useAuth();
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [imgFailed, setImgFailed] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const isOwner = user && book.createdBy === user.id;

    const handleDelete = async () => {
        setDeleteError("");
        setDeleting(true);

        try {
            const response = await fetch(`${API}/feed/book/${book._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to delete the book");
            }
            setConfirmOpen(false);
            if (onDelete) {
                onDelete(book._id);
            }
        } catch (err) {
            setDeleteError(err.message || "Could not delete");
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    return (
        <article
            className="animate-card-in group flex flex-col"
            style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}
        >
            <Link
                to={`/book/${book._id}`}
                aria-label={book.title}
                className="relative block transform-gpu rounded-lg shadow-[0_2px_6px_-2px_rgba(27,23,20,0.14)] ring-1 ring-ink/5 transition-[transform,box-shadow] duration-300 ease-out will-change-transform group-hover:-translate-y-1 group-hover:shadow-[0_14px_28px_-12px_rgba(27,23,20,0.28)]"
            >
                <div className="aspect-4/5 overflow-hidden rounded-lg bg-soft">
                    {imgFailed ? (
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="font-display text-3xl font-semibold text-line-strong">
                                {book.title?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    ) : (
                        <img
                            src={`${API}/${book.imageUrl}`}
                            alt={book.title}
                            loading="lazy"
                            onError={() => setImgFailed(true)}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
            </Link>

            <div className="mt-3.5 flex flex-1 flex-col">
                <h3 className="min-h-[2.6rem] font-display text-[15px] leading-snug font-semibold text-ink">
                    <Link
                        to={`/book/${book._id}`}
                        className="line-clamp-2 transition-colors duration-200 hover:text-accent"
                    >
                        {book.title}
                    </Link>
                </h3>
                <p className="truncate text-[13px] text-muted">
                    {book.authorName}
                </p>

                <p className="mt-2 font-display text-[15px] font-semibold text-accent">
                    ${book.price}
                </p>

                {isOwner &&
                    (deleteError ? (
                        <p
                            role="alert"
                            className="mt-2.5 text-xs leading-snug text-danger"
                        >
                            {deleteError}
                        </p>
                    ) : (
                        <div className="mt-2.5 flex items-center gap-2.5 text-xs">
                            <Link
                                to={`/edit-book/${book._id}`}
                                className="text-muted transition-colors hover:text-ink"
                            >
                                Edit
                            </Link>
                            <span className="text-line-strong">·</span>
                            <button
                                onClick={() => setConfirmOpen(true)}
                                disabled={deleting}
                                className="cursor-pointer text-muted transition-colors hover:text-danger disabled:opacity-50"
                            >
                                {deleting ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    ))}
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title="Delete this book?"
                message={`"${book.title}" will be permanently removed, along with its cover image. This cannot be undone.`}
                confirmLabel="Delete book"
                busyLabel="Deleting…"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </article>
    );
};

export default BookCard;
