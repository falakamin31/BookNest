const BookCard = ({ book }) => {
    return (
        <div className="bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-colors group">
            <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4">
                <h3 className="font-heading text-lg font-semibold text-white truncate">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{book.authorName}</p>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-primary font-semibold">
                        ${book.price}
                    </span>
                    <button className="text-xs font-medium text-gray-300 hover:text-white transition-colors">
                        View →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
