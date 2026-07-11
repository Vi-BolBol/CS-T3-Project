import React from 'react';

export default function CompanyAboutBlock({ biography, tagline, website, location }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#111B34]/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.02),transparent)] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
          <h3 className="text-xs font-bold text-subtle uppercase tracking-widest flex items-center gap-2">
            About Corporate Infrastructure
          </h3>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              Visit Website
            </a>
          )}
        </div>

        {tagline && (
          <p className="text-xs font-bold text-content mb-2 italic">
            &quot;{tagline}&quot;
          </p>
        )}

        <p className="text-xs sm:text-sm leading-relaxed text-subtle whitespace-pre-line">
          {biography || 'No organizational briefing provided yet.'}
        </p>

        {location && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-subtle">
            <span>Base Operations:</span>
            <span className="text-content font-medium">{location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
