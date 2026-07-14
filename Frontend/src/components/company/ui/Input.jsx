import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-semibold text-subtle uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <input 
        className={`w-full px-4 py-2.5 rounded-xl border border-line bg-surface/60 text-xs text-content placeholder:text-faint focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all ${
          error ? 'border-rose-500/40 focus:border-rose-500/40' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 mt-1 font-medium">{error}</p>}
    </div>
  );
}