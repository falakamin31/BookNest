import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    const [loading, setLoading] = useState(isEditMode); // Set loading to true if in edit mode
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

        // Fetch the existing book data for editing
        const fetchBook = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/feed/book/${id}`,
                );
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
                setPreviewUrl(`http://localhost:8080/${data.book.imageUrl}`);
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
            ? `http://localhost:8080/feed/book/${id}`
            : `http://localhost:8080/feed/book`;

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
        return <p className="text-center text-gray-400 py-20">Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold text-white">
                    {isEditMode ? "Edit Book" : "Add a Book"}
                </h1>
                <p className="text-gray-400 mt-1">
                    {isEditMode
                        ? "Update the details of your book"
                        : "Share a book with the BookNest community"}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-surface rounded-2xl border border-white/10 shadow-xl shadow-black/20 p-8 md:p-10"
            >
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* Left: cover upload */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Cover Image
                        </label>

                        <label
                            htmlFor="coverImage"
                            className="relative w-full flex flex-col items-center justify-center gap-3 bg-background border border-dashed border-white/20 rounded-xl aspect-[3/4] cursor-pointer hover:border-primary transition-colors overflow-hidden"
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <>
                                    <span className="text-3xl">📷</span>
                                    <span className="text-sm text-gray-500 px-4 text-center">
                                        Click to upload cover
                                    </span>
                                </>
                            )}
                        </label>

                        <input
                            id="coverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {/* Right: form fields */}
                    <div className="md:col-span-2 flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. The Midnight Library"
                                required
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Author Name
                            </label>
                            <input
                                type="text"
                                name="authorName"
                                value={formData.authorName}
                                onChange={handleChange}
                                placeholder="e.g. Matt Haig"
                                required
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="14.99"
                                required
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="A short description of the book..."
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 w-full md:w-auto md:self-start bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {submitting
                        ? "Saving..."
                        : isEditMode
                          ? "Save Changes"
                          : "Add Book"}
                </button>
            </form>
        </div>
    );
};

export default AddBook;
