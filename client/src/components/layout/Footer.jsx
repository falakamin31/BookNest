const Footer = () => {
    return (
        <footer className="border-t border-line bg-surface">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-6 sm:flex-row sm:justify-between">
                <p className="font-display text-lg font-semibold text-ink">
                    BookNest
                </p>
                <p className="text-sm text-muted">
                    A quiet corner for books worth sharing.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
