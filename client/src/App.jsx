import { Routes, Route } from "react-router-dom";
import { NavBar, Footer } from "./components";
import {
    Home,
    Login,
    Signup,
    AddBook,
    BookDetail,
    MyBooks,
    NotFound,
} from "./pages";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";

const App = () => {
    return (
        <>
            <NavBar />

            <main className="flex-1">
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/book/:id" element={<BookDetail />} />

                    {/* Logged out only */}
                    <Route element={<PublicRoutes />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>

                    {/* Logged in only */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/add-book" element={<AddBook />} />
                        <Route path="/edit-book/:id" element={<AddBook />} />
                        <Route path="/my-books" element={<MyBooks />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            <Footer />
        </>
    );
};

export default App;
