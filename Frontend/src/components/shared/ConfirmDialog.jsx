function ConfirmDialog({ open, title, message, confirmLabel = 'Yes, continue', onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      style={{ zIndex: 9998 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-raised border border-line rounded-2xl shadow-2xl shadow-black/40 max-w-sm w-full p-6"
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-subtle mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-muted hover:bg-muted text-content text-sm font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-accent hover:bg-accent text-accent-ink text-sm font-bold rounded-lg transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;