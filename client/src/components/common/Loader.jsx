const Loader = ({ label = "Loading" }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
            <span
                className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-accent"
                role="status"
                aria-label={label}
            />
            <p className="text-sm text-muted">{label}…</p>
        </div>
    );
};

export default Loader;
