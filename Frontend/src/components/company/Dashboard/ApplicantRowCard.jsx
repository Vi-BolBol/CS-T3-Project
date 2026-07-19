import React from 'react';
import { useNavigate } from 'react-router-dom';

/*
  One applicant, on the company dashboard.

  Two things were removed deliberately:

  - **"% Match"** implied the platform scores how well a candidate fits the role.
    Nothing computes that. The number came from a stored CV score, which measures
    CV quality in isolation and has nothing to do with the listing. Showing it as
    a match invited a question we could not answer honestly.
  - **"Shortlist"** was a button that did nothing at all — no state, no request.

  What remains is the one action that works: open the CV. A decision can only be
  made after the CV has actually been reviewed, which is enforced on the review
  page rather than here.
*/

const STATUS_STYLE = {
  pending:  'bg-muted text-subtle',
  reviewed: 'bg-accent-soft text-accent',
  accepted: 'bg-accent-soft text-accent',
  rejected: 'bg-danger/10 text-danger',
};

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
    <div className="group flex flex-col justify-between rounded-xl border border-line bg-surface/40 p-4 transition-all duration-200 hover:border-accent/40 hover:bg-surface/80">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-gradient-to-br from-accent/20 to-teal-500/20 text-xs font-black text-accent shadow-inner">
              {applicant.avatar}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-bold text-content transition duration-150 group-hover:text-accent">
                {applicant.name}
              </h4>
              <p className="mt-0.5 truncate text-[11px] text-subtle">{applicant.role}</p>
            </div>
          </div>

          <span className={`whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-bold capitalize ${
            STATUS_STYLE[applicant.status] || STATUS_STYLE.pending
          }`}>
            {applicant.status}
          </span>
        </div>

        <p className="mt-3 text-xs text-subtle">School: {applicant.university}</p>
        <p className="mt-0.5 text-[11px] text-faint">{timeAgo(applicant.appliedAt)}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
        <button
          type="button"
          onClick={() => navigate(`/company/applicant/${applicant.id}/cv`)}
          className="flex-1 rounded-lg bg-accent py-1.5 text-xs font-bold text-accent-ink transition duration-150 hover:opacity-90"
        >
          <i className="bi bi-file-earmark-person mr-1" /> View CV
        </button>
      </div>
    </div>
  );
}
