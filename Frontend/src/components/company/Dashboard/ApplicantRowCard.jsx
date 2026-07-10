import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function timeAgo(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 24) return `Applied ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `Applied ${days} day${days === 1 ? '' : 's'} ago`;
}

const STATUS_BADGE = {
  accepted: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-rose-500/10 text-rose-400',
  reviewed: 'bg-sky-500/10 text-sky-400',
  pending: 'bg-white/5 text-gray-400',
};

export default function ApplicantRowCard({ applicant, onStatusChange }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const isDecided = applicant.status === 'accepted' || applicant.status === 'rejected';

  const handleDecision = async (status) => {
    if (!onStatusChange || busy) return;
    setBusy(true);
    try {
      await onStatusChange(applicant.id, status);
    } finally {
      setBusy(false);
    }
  };

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

          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap capitalize ${STATUS_BADGE[applicant.status] || STATUS_BADGE.pending}`}>
            {applicant.status}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-3">School: {applicant.university}</p>
        <p className="text-[11px] text-gray-600 mt-0.5">
          {applicant.matchScore != null ? `${applicant.matchScore}% match \u2022 ` : ''}
          {timeAgo(applicant.appliedAt)}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
        {isDecided ? (
          <button
            type="button"
            onClick={() => navigate(`/company/applicant/${applicant.id}/cv`)}
            className="flex-1 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-300 hover:bg-white/10 transition"
          >
            View Details
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => handleDecision('accepted')}
              className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070B19] text-xs font-bold transition duration-150 disabled:opacity-40"
            >
              Accept
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => handleDecision('rejected')}
              className="px-3 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 text-xs transition disabled:opacity-40"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => navigate(`/company/applicant/${applicant.id}/cv`)}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              Review CV
            </button>
          </>
        )}
      </div>
    </div>
  );
}
