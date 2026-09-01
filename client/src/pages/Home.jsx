import { BookCard } from "../components";

const dummyBooks = [
    {
        id: 1,
        title: "The Midnight Library",
        authorName: "Matt Haig",
        price: 14.99,
        imageUrl: "https://covers.openlibrary.org/b/id/10389359-L.jpg",
    },
    {
        id: 2,
        title: "Atomic Habits",
        authorName: "James Clear",
        price: 18.5,
        imageUrl: "https://covers.openlibrary.org/b/id/8383052-L.jpg",
    },
    {
        id: 3,
        title: "Project Hail Mary",
        authorName: "Andy Weir",
        price: 16.0,
        imageUrl: "https://covers.openlibrary.org/b/id/10909258-L.jpg",
    },
    {
        id: 4,
        title: "Educated",
        authorName: "Tara Westover",
        price: 13.25,
        imageUrl: "https://covers.openlibrary.org/b/id/8235116-L.jpg",
    },
];

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold text-white">
                    Browse Books
                </h1>
                <p className="text-gray-400 mt-1">
                    Discover what the community is reading
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {dummyBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
};

export default Home;
