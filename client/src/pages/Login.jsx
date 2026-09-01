import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-surface rounded-2xl border border-white/5 p-8">
                <h1 className="font-heading text-2xl font-bold !text-white mb-1">
                    Welcome back
                </h1>
                <p className="text-gray-400 text-sm mb-6">
                    Log in to manage your books
                </p>

                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors"
                    >
                        Log In
                    </button>
                </form>

                <p className="text-sm text-gray-400 text-center mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
