import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../components";
import { API } from "../config";

const AddBook = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        title: "",
        authorName: "",
        price: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (!isEditMode) return;

        const fetchBook = async () => {
            try {
                const response = await fetch(`${API}/feed/book/${id}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch book data",
                    );
                }
                setFormData({
                    title: data.book.title,
                    authorName: data.book.authorName,
                    price: data.book.price,
                    description: data.book.description,
                });
                setPreviewUrl(`${API}/${data.book.imageUrl}`);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        const formPayload = new FormData();
        formPayload.append("title", formData.title);
        formPayload.append("authorName", formData.authorName);
        formPayload.append("price", formData.price);
        formPayload.append("description", formData.description);
        if (imageFile) {
            formPayload.append("image", imageFile);
        }

        const url = isEditMode
            ? `${API}/feed/book/${id}`
            : `${API}/feed/book`;

        fetch(url, {
            method: isEditMode ? "PUT" : "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: formPayload,
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.errors?.[0]?.msg ||
                            data.message ||
                            "Failed to save the book",
                    );
                }
                return data;
            })
            .then(() => {
                setSubmitting(false);
                navigate(isEditMode ? `/book/${id}` : "/");
            })
            .catch((err) => {
                setSubmitting(false);
                setError(err.message || "Something went wrong");
            });
    };

    if (loading) {
        return <Loader label="Loading book" />;
    }

    const field =
        "w-full rounded-lg border border-line bg-paper/50 px-3 py-2 text-sm text-ink placeholder-muted transition-all duration-200 focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15 focus:outline-none";
    const label = "mb-1.5 block text-[13px] font-medium text-ink";

    return (
        <div className="mx-auto max-w-3xl px-6 py-6">
            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_16px_44px_-32px_rgba(27,23,20,0.4)]"
            >
                {/* Header */}
                <div className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-4">
                    <h1 className="font-display text-xl font-semibold text-ink">
                        {isEditMode ? "Edit book" : "Add a book"}
                    </h1>
                    <p className="text-xs text-muted">
                        {isEditMode ? "Update the details" : "All fields required"}
                    </p>
                </div>

                {/* Body */}
                <div className="grid gap-6 px-6 py-5 sm:grid-cols-[150px_1fr]">
                    {/* Cover */}
                    <div>
                        <span className={label}>Cover</span>

                        <label
                            htmlFor="coverImage"
                            className="group relative flex aspect-4/5 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-line-strong bg-paper/60 transition-colors duration-200 hover:border-accent hover:bg-accent-soft/40"
                        >
                            {previewUrl ? (
                                <>
                                    <img
                                        src={previewUrl}
                                        alt="Cover preview"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        Change
                                    </span>
                                </>
                            ) : (
                                <span className="flex flex-col items-center gap-1 text-muted">
                                    <span className="text-2xl leading-none">
                                        ＋
                                    </span>
                                    <span className="text-xs">Upload</span>
                                </span>
                            )}
                        </label>

                        <input
                            id="coverImage"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col gap-3.5">
                        <div>
                            <label htmlFor="title" className={label}>
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="The Midnight Library"
                                required
                                className={field}
                            />
                        </div>

                        <div className="grid gap-3.5 sm:grid-cols-[1fr_120px]">
                            <div>
                                <label htmlFor="authorName" className={label}>
                                    Author
                                </label>
                                <input
                                    id="authorName"
                                    type="text"
                                    name="authorName"
                                    value={formData.authorName}
                                    onChange={handleChange}
                                    placeholder="Matt Haig"
                                    required
                                    className={field}
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className={label}>
                                    Price
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted">
                                        $
                                    </span>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        min="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="14.99"
                                        required
                                        className={`${field} pl-6`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className={label}>
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="2"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What is this book about?"
                                required
                                className={`${field} resize-none`}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 border-t border-line bg-paper/40 px-6 py-3.5">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="cursor-pointer rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-dark active:scale-[0.98] disabled:opacity-50"
                    >
                        {submitting
                            ? "Saving…"
                            : isEditMode
                              ? "Save changes"
                              : "Add book"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
                    >
                        Cancel
                    </button>
                    {error ? (
                        <p
                            role="alert"
                            title={error}
                            className="ml-auto truncate text-xs font-medium text-danger"
                        >
                            {error}
                        </p>
                    ) : (
                        isEditMode && (
                            <span className="ml-auto truncate text-xs text-muted">
                                Cover unchanged unless you upload a new one
                            </span>
                        )
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddBook;
