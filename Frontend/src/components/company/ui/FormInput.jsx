import React from 'react';

export default function FormInput({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <input 
        className={`w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all ${
          error ? 'border-rose-500/40 focus:border-rose-500/40' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 mt-1 font-medium">{error}</p>}
    </div>
  );
}