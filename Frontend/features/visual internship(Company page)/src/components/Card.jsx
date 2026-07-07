import React from 'react';

export default function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div 
      className={`rounded-2xl border border-white/5 bg-[#111B34]/40 p-5 shadow-xl backdrop-blur-md relative overflow-hidden ${
        glow ? 'after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent)] after:pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}