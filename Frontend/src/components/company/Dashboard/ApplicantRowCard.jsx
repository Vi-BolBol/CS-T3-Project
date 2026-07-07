import React from 'react';

export default function ApplicantRowCard({ applicant }) {
  return (
    <div className="group rounded-xl border border-white/5 bg-[#070B19]/40 p-4 transition-all duration-200 hover:border-white/10 hover:bg-[#070B19]/80 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center font-black text-xs text-emerald-400 shadow-inner">
              {applicant.avatar}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition duration-150">
                {applicant.name}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{applicant.role}</p>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
            {applicant.matchScore}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-3">School: {applicant.university}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
        <button className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070B19] text-xs font-bold transition duration-150">
          Shortlist
        </button>
        <button className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition">
          Review
        </button>
      </div>
    </div>
  );
}
