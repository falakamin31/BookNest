import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <p className="font-display text-6xl font-semibold text-accent">
                404
            </p>
            <h1 className="mt-4 font-display text-xl font-semibold text-ink">
                Page not found
            </h1>
            <p className="mt-2 max-w-sm text-sm text-body">
                The page you're looking for doesn't exist, or it's been moved.
            </p>
            <Link
                to="/"
                className="mt-7 rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-dark active:scale-[0.99]"
            >
                Back to books
            </Link>
        </div>
    );
};

export default NotFound;
