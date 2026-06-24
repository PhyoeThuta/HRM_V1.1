export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e2235] border border-rose-500/30 rounded-2xl w-full max-w-sm m-4 p-6 shadow-2xl shadow-rose-900/20 text-center animate-slide-in">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-full mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Are you sure to delete?</h2>
        <p className="text-sm text-slate-400 mb-6">
          You are about to delete <strong className="text-white">{itemName || 'this item'}</strong>. This action cannot be undone.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/20">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
