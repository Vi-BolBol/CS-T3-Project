import { Link } from 'react-router-dom';

const ENV_LABEL = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' };

function money(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? `$${n.toLocaleString()}` : null;
}

export function payRange(job) {
  const min = money(job.salaryMin);
  const max = money(job.salaryMax);
  if (min && max) return `${min} – ${max}`;
  return min || max || money(job.salary) || 'Not disclosed';
}

/** Themed internship card used across Home and the Internships page. */
export default function InternshipCard({
  job,
  saved = false,
  applied = false,
  onToggleSave,
  onApply,
  compact = false,
}) {
  const skills = (job.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <article className="group flex flex-col rounded-xl border border-line bg-raised p-4 transition-all hover:border-accent/60 hover:shadow-sm">
      <div className="flex items-start gap-3">
        {job.company?.logoUrl ? (
          <img
            src={job.company.logoUrl}
            alt=""
            className="h-11 w-11 flex-shrink-0 rounded-lg border border-line object-cover"
          />
        ) : (
          <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-sm font-bold text-accent">
            {(job.company?.companyName || '?').charAt(0).toUpperCase()}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-content">{job.title}</h3>
          <Link
            to={job.company?.id ? `/company/${job.company.id}` : '#'}
            className="truncate text-xs text-subtle transition-colors hover:text-accent"
          >
            {job.company?.companyName || 'Unknown company'}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => onToggleSave?.(job.id)}
          aria-label={saved ? 'Remove from saved' : 'Save internship'}
          title={saved ? 'Saved' : 'Save'}
          className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg border transition-colors ${
            saved
              ? 'border-accent bg-accent-soft text-accent'
              : 'border-line text-faint hover:text-content'
          }`}
        >
          <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'} text-sm`} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-subtle">
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
          <i className="bi bi-geo-alt" /> {job.location || 'Not specified'}
        </span>
        {job.workEnvironment && (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
            <i className="bi bi-laptop" /> {ENV_LABEL[job.workEnvironment] || job.workEnvironment}
          </span>
        )}
        {job.internshipCategory && (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
            <i className="bi bi-tag" /> {job.internshipCategory}
          </span>
        )}
      </div>

      {!compact && skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-md border border-line px-2 py-0.5 text-[11px] text-subtle"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
        <span className="text-xs font-semibold text-accent">{payRange(job)}</span>

        <div className="flex items-center gap-2">
          <Link
            to={`/view-detail?id=${job.id}`}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition-colors hover:bg-muted hover:text-content"
          >
            Details
          </Link>
          <button
            type="button"
            onClick={() => onApply?.(job)}
            disabled={applied}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              applied
                ? 'cursor-default bg-muted text-faint'
                : 'bg-accent text-accent-ink hover:opacity-90'
            }`}
          >
            {applied ? 'Applied' : 'Apply'}
          </button>
        </div>
      </div>
    </article>
  );
}
