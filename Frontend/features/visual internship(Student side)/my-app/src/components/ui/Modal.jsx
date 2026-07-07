export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      {/* Backdrop overlay layer fade */}
      <div className="fixed inset-0 bg-[#0b1224]/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Frame structure window sheet wrapper */}
      <div className="relative w-full max-w-lg bg-[#131c35] border border-slate-800 rounded-3xl p-6 shadow-2xl text-left transform transition-all animate-scale-up">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
          <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors text-lg p-1">
            ✕
          </button>
        </div>
        <div className="text-sm text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}