import React from 'react';

export default function AffiliationItem({ title, year, description }) {
  return (
    <div className="p-4 rounded-xl border border-white/5 bg-[#070B19]/40 hover:border-white/10 hover:bg-[#070B19]/60 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors duration-150">
            {title}
          </h4>
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>
        
        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded shrink-0">
          {year}
        </span>
      </div>
    </div>
  );
}