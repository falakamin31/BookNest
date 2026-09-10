import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader, ConfirmDialog } from "../components";

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [error, setError] = useState("");

    const isOwner = user && book && book.createdBy === user.id;

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/feed/book/${id}`,
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch the book",
                    );
                }
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

    const handleDelete = async () => {
        setError("");
        setDeleting(true);

        try {
            const response = await fetch(
                `http://localhost:8080/feed/book/${id}`,
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
            navigate("/");
        } catch (err) {
            setError(err.message);
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    if (loading) {
        return <Loader label="Loading book" />;
    }

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <Link
                to="/"
                className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-ink"
            >
                <span aria-hidden="true">←</span> Back to books
            </Link>

            {error && (
                <p
                    role="alert"
                    className="mt-5 rounded-lg border border-danger/25 bg-danger-soft px-4 py-2.5 text-sm text-danger"
                >
                    {error}
                </p>
            )}

            {!book ? (
                !error && (
                    <p className="py-24 text-center text-muted">
                        This book could not be found.
                    </p>
                )
            ) : (
                <div className="mt-6 grid items-start gap-8 md:grid-cols-5 lg:gap-12">
                    <div className="md:col-span-2">
                        <div className="aspect-4/5 overflow-hidden rounded-lg bg-soft shadow-[0_8px_24px_-12px_rgba(27,23,20,0.28)] ring-1 ring-ink/5">
                            {imgFailed ? (
                                <div className="flex h-full w-full items-center justify-center">
                                    <span className="font-display text-5xl font-semibold text-line-strong">
                                        {book.title?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            ) : (
                                <img
                                    src={`http://localhost:8080/${book.imageUrl}`}
                                    alt={book.title}
                                    onError={() => setImgFailed(true)}
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-ink">
                            {book.title}
                        </h1>
                        <p className="mt-1.5 text-sm text-body">
                            by{" "}
                            <span className="font-medium text-ink">
                                {book.authorName}
                            </span>
                        </p>

                        <p className="mt-5 font-display text-2xl font-semibold text-accent">
                            ${book.price}
                        </p>

                        <div className="my-6 h-px bg-line" />

                        <p className="text-[15px] leading-relaxed text-body">
                            {book.description}
                        </p>

                        {book.createdAt && (
                            <p className="mt-6 text-xs text-muted">
                                Added{" "}
                                {new Date(book.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    },
                                )}
                            </p>
                        )}

                        {isOwner && (
                            <div className="mt-7 flex flex-wrap gap-2.5 border-t border-line pt-5">
                                <button
                                    onClick={handleEdit}
                                    className="cursor-pointer rounded-full border border-line px-5 py-2 text-sm font-medium text-ink transition-colors duration-200 hover:border-line-strong hover:bg-soft active:scale-[0.99]"
                                >
                                    Edit book
                                </button>
                                <button
                                    onClick={() => setConfirmOpen(true)}
                                    disabled={deleting}
                                    className="cursor-pointer rounded-full border border-danger/25 bg-danger-soft px-5 py-2 text-sm font-medium text-danger transition-colors duration-200 hover:border-danger/45 active:scale-[0.99] disabled:opacity-50"
                                >
                                    {deleting ? "Deleting…" : "Delete"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={confirmOpen}
                title="Delete this book?"
                message={`"${book?.title}" will be permanently removed, along with its cover image. This cannot be undone.`}
                confirmLabel="Delete book"
                busyLabel="Deleting…"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
};

export default BookDetail;
