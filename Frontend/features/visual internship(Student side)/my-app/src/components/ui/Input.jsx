export default function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name,
  className = '' 
}) {
  return (
    <div className={`space-y-2 w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0b1224] border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 transition-all focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/20"
      />
    </div>
  );
}