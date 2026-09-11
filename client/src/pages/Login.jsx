import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        authService
            .login(formData)
            .then((data) => {
                login({ id: data.userId }, data.token);
                setLoading(false);
                navigate("/");
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    const inputClass =
        "w-full rounded-lg border border-line bg-paper/50 px-3 py-2 text-sm text-ink placeholder-muted transition-all duration-200 focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15 focus:outline-none";

    return (
        <div className="flex items-start justify-center px-6 pt-4 pb-8 sm:pt-6">
            <div className="flex min-h-[27.5rem] w-full max-w-md flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_12px_40px_-24px_rgba(27,23,20,0.25)]">
                <h1 className="font-display text-xl font-semibold tracking-tight text-ink">
                    Welcome back
                </h1>

                <div className="mt-4 min-h-10">
                    {error && (
                        <p role="alert" className="rounded-lg border border-danger/25 bg-danger-soft px-3.5 py-2 text-[13px] text-danger">
                            {error}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-[13px] font-medium text-ink"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-[13px] font-medium text-ink"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 cursor-pointer rounded-lg bg-accent py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-dark active:scale-[0.99] disabled:opacity-50"
                    >
                        {loading ? "Logging in…" : "Log in"}
                    </button>
                </form>

                <p className="mt-auto pt-5 text-center text-[13px] text-muted">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-medium text-accent hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
