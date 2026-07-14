import React from 'react';

export default function TechStackBadge({ name, proficiencyLevel }) {
  // Determine contextual styling parameters depending on framework deployment depth
  const levelStyles = {
    Core: 'bg-accent/10 text-accent border-accent/20',
    'High Performance': 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    Infrastructure: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    'Frontend Stack': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    Default: 'bg-raised/5 text-subtle border-line'
  };

  const selectedStyle = levelStyles[proficiencyLevel] || levelStyles.Default;

  return (
    <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-surface/50 border border-line hover:border-accent/40 transition-colors duration-150">
      <span className="text-xs font-semibold text-content tracking-tight">
        {name}
      </span>
      
      <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded border ${selectedStyle}`}>
        {proficiencyLevel || 'General'}
      </span>
    </div>
  );
}