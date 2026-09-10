import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components";
import { Home, Login, Signup, AddBook, BookDetail, MyBooks } from "./pages";
import ProtectedRoutes from "./routes/ProtectedRoutes";

const App = () => {
    return (
        <>
            <NavBar />
            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/book/:id" element={<BookDetail />} />

                {/* Logged in only */}
                <Route element={<ProtectedRoutes />}>
                    <Route path="/add-book" element={<AddBook />} />
                    <Route path="/edit-book/:id" element={<AddBook />} />
                    <Route path="/my-books" element={<MyBooks />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
