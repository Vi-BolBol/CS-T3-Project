import React from 'react';

export default function FormButton({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none';
  
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-[#070B19] shadow-lg shadow-emerald-500/5',
    secondary: 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white',
    danger: 'border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}