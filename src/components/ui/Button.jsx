export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  className = '' 
}) {
  const baseStyle = 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none tracking-wide';
  
  const variants = {
    primary: 'bg-[#10b981] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-950/20',
    secondary: 'bg-[#131c35] border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white',
    danger: 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}