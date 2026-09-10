import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ConfirmDialog = ({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    busyLabel = "Working…",
    cancelLabel = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}) => {
    const cancelRef = useRef(null);
    const restoreFocusRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        // remember what was focused so we can hand focus back on close
        restoreFocusRef.current = document.activeElement;

        const handleKeyDown = (e) => {
            if (e.key === "Escape" && !loading) {
                onCancel();
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        cancelRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            restoreFocusRef.current?.focus?.();
        };
    }, [open, loading, onCancel]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="animate-fade-in absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
                onClick={loading ? undefined : onCancel}
                aria-hidden="true"
            />

            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
                className="animate-dialog-in relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-[0_28px_64px_-24px_rgba(27,23,20,0.5)]"
            >
                <h2
                    id="confirm-dialog-title"
                    className="font-display text-lg font-semibold text-ink"
                >
                    {title}
                </h2>
                <p
                    id="confirm-dialog-message"
                    className="mt-2 text-sm leading-relaxed text-body"
                >
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-2.5">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm font-medium text-body transition-colors duration-200 hover:border-line-strong hover:text-ink disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="cursor-pointer rounded-full bg-danger px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                    >
                        {loading ? busyLabel : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default ConfirmDialog;
