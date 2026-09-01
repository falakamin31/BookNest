import BookCard from "../components/books/BookCard";

const dummyMyBooks = [
    {
        id: 1,
        title: "The Midnight Library",
        authorName: "Matt Haig",
        price: 14.99,
        imageUrl: "https://covers.openlibrary.org/b/id/10389359-L.jpg",
    },
    
];

const MyBooks = () => {
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

            {dummyMyBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {dummyMyBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">You haven't added any books yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyBooks;
