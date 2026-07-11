import React from 'react';
import { useNavigate } from 'react-router-dom';

function timeAgo(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 24) return `Applied ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `Applied ${days} day${days === 1 ? '' : 's'} ago`;
}

export default function ApplicantRowCard({ applicant }) {
  const navigate = useNavigate();

  return (
    <div className="group rounded-xl border border-white/5 bg-surface/40 p-4 transition-all duration-200 hover:border-white/10 hover:bg-surface/80 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-teal-500/20 border border-accent/20 flex items-center justify-center font-black text-xs text-accent shadow-inner">
              {applicant.avatar}
            </div>
            <div>
              <h4 className="text-sm font-bold text-content group-hover:text-accent transition duration-150">
                {applicant.name}
              </h4>
              <p className="text-[11px] text-subtle mt-0.5">{applicant.role}</p>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded whitespace-nowrap">
            {applicant.matchScore}% Match
          </span>
        </div>

        <p className="text-xs text-subtle mt-3">School: {applicant.university}</p>
        <p className="text-[11px] text-faint mt-0.5">{timeAgo(applicant.appliedAt)}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
        <button className="flex-1 py-1.5 rounded-lg bg-accent hover:bg-accent text-[#070B19] text-xs font-bold transition duration-150">
          Shortlist
        </button>
        <button
          type="button"
          onClick={() => navigate(`/company/applicant/${applicant.id}/cv`)}
          className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-raised/5 text-xs text-subtle hover:text-content hover:bg-raised/10 transition"
        >
          Review CV
        </button>
      </div>
    </div>
  );
}
