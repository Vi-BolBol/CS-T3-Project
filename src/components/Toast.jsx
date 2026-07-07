import { useEffect, useState } from 'react';

function Toast({ message, onClose, duration = 4000 }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
    const timer = setTimeout(() => {
      setHidden(true);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (hidden || !message) return null;

  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed bottom-5 right-5 flex items-start gap-3 bg-[#111B34] text-white px-4 py-3 rounded-xl shadow-2xl max-w-sm border border-rose-500/50"
    >
      <span className="text-lg leading-none mt-0.5 text-rose-400">⚠</span>
      <p className="text-sm font-medium leading-snug flex-1">{message}</p>
      <button
        onClick={() => { setHidden(true); onClose?.(); }}
        className="text-white/50 hover:text-white text-lg leading-none ml-1 mt-0.5"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;