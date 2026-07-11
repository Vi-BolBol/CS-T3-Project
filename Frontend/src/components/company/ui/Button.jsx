import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none';
  
  const variants = {
    primary: 'bg-accent hover:bg-accent text-[#070B19] shadow-lg shadow-accent/5',
    secondary: 'border border-white/10 bg-raised/5 text-subtle hover:bg-raised/10 hover:text-content',
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