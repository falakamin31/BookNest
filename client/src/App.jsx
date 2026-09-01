import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components";
import { Home, Login, Signup, AddBook, BookDetail, MyBooks } from "./pages";

const App = () => {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/add-book" element={<AddBook />} />
                <Route path="/book/:id" element={<BookDetail />} />
                <Route path="/my-books" element={<MyBooks />} />
            </Routes>
        </>
    );
};

export default App;
