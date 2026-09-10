import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
            <p className="font-heading text-6xl font-bold text-primary">404</p>
            <h1 className="font-heading text-2xl font-bold text-white mt-4">
                Page not found
            </h1>
            <p className="text-gray-400 mt-2">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-8 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
                Back to books
            </Link>
        </div>
    );
};

export default NotFound;
