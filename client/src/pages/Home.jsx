import { useEffect, useState } from "react";
import { BookCard } from "../components";


const Home = () => {
    const [books, setBooks] = useState([]);
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                let response = await fetch(
                    "http://localhost:8080/feed/books",
                    {
                        headers : {
                            'Authorization' : 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                );
                let data = await response.json();
                console.log("Fetched books:", data);
                setBooks(data.books);
            } catch (err) {
                console.error("Error fetching books:", err);
            }
        };
        fetchBooks();
    }, []);
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
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
};

export default Home;
