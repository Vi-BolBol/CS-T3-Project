/**
 * The "c" column: an internship/company detail that opens *beside* the results
 * instead of navigating away, so the filters and the list stay put.
 *
 * Collapsed by default with a "Show more" — and selecting a different item
 * re-collapses it (the parent resets `expanded`), so the affordance is always
 * there for whatever you just clicked.
 */

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

function splitList(value, sep = ',') {
  return (value || '').split(sep).map((s) => s.trim()).filter(Boolean);
}

function Tag({ icon, children }) {
  if (!children) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-subtle">
      {icon && <i className={`bi ${icon}`} />} {children}
    </span>
  );
}

/**
 * Fills its column and scrolls *internally* — the page itself never scrolls.
 * The action row is pinned to the bottom so "Apply" stays reachable no matter
 * how long the description is.
 */
function Shell({ title, onClose, actions, children }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-raised">
      <header className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-line px-5 py-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-faint">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="grid h-7 w-7 place-items-center rounded-lg text-faint transition-colors hover:bg-muted hover:text-content"
        >
          <i className="bi bi-x-lg text-xs" />
        </button>
      </header>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-5">{children}</div>

      {actions && (
        <footer className="flex-shrink-0 border-t border-line bg-raised p-4">{actions}</footer>
      )}
    </div>
  );
}

function MoreButton({ expanded, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className="mt-4 w-full rounded-lg border border-line px-3 py-2 text-xs font-bold text-accent transition-colors hover:bg-muted"
    >
      {expanded ? 'Show less' : 'Show more'}{' '}
      <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'} ml-1`} />
    </button>
  );
}

export function InternshipPane({ job, expanded, onToggleExpand, onClose, actions }) {
  if (!job) return null;

  const skills = splitList(job.skills);
  const requirements = splitList(job.requirements, '\n');

  return (
    <Shell title="Internship details" onClose={onClose} actions={actions}>
      <div className="flex items-start gap-3">
        {job.company?.logoUrl ? (
          <img src={job.company.logoUrl} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg border border-line object-cover" />
        ) : (
          <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-base font-black text-accent">
            {(job.company?.companyName || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-black leading-snug text-content">{job.title}</h3>
          <p className="truncate text-xs text-subtle">{job.company?.companyName || 'Unknown company'}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Tag icon="bi-geo-alt">{job.location || 'Not specified'}</Tag>
        <Tag icon="bi-laptop">{ENV_LABEL[job.workEnvironment] || job.workEnvironment}</Tag>
        <Tag icon="bi-tag">{job.internshipCategory}</Tag>
        {job.durationValue ? (
          <Tag icon="bi-clock">{`${job.durationValue} ${job.durationUnit || ''}`.trim()}</Tag>
        ) : null}
      </div>

      <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-xs font-bold text-accent">
        {payRange(job)}
      </p>

      {job.jobDescription && (
        <p
          className={`mt-3 whitespace-pre-line text-sm leading-relaxed text-subtle ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {job.jobDescription}
        </p>
      )}

      {expanded && (
        <>
          {requirements.length > 0 && (
            <section className="mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Requirements</h4>
              <ul className="mt-2 space-y-1.5">
                {requirements.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-subtle">
                    <i className="bi bi-check2 mt-0.5 text-accent" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {skills.length > 0 && (
            <section className="mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Skills</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="rounded-md border border-line px-2 py-0.5 text-[11px] text-subtle">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {job.education && (
            <section className="mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Education</h4>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-subtle">{job.education}</p>
            </section>
          )}

          {job.benefit && (
            <section className="mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Benefits</h4>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-subtle">{job.benefit}</p>
            </section>
          )}

          {job.companyCulture && (
            <section className="mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Company culture</h4>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-subtle">{job.companyCulture}</p>
            </section>
          )}
        </>
      )}

      <MoreButton expanded={expanded} onToggle={onToggleExpand} />
    </Shell>
  );
}

export function CompanyPane({
  company,
  listings = [],
  expanded,
  onToggleExpand,
  onClose,
  onSelectJob,
  actions,
}) {
  if (!company) return null;

  const shown = expanded ? listings : listings.slice(0, 3);

  return (
    <Shell title="Company details" onClose={onClose} actions={actions}>
      <div className="flex items-start gap-3">
        {company.logoUrl ? (
          <img src={company.logoUrl} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg border border-line object-cover" />
        ) : (
          <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-base font-black text-accent">
            {(company.companyName || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-black leading-snug text-content">
            {company.companyName || 'Unnamed company'}
          </h3>
          <p className="truncate text-xs text-subtle">{company.industry || 'Industry not set'}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Tag icon="bi-geo-alt">{company.location || 'Not specified'}</Tag>
        {company.employeeCount != null && <Tag icon="bi-people">{`${company.employeeCount} employees`}</Tag>}
        <Tag icon="bi-briefcase">{`${listings.length} open`}</Tag>
      </div>

      {company.description && (
        <p
          className={`mt-3 whitespace-pre-line text-sm leading-relaxed text-subtle ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {company.description}
        </p>
      )}

      {expanded && company.website && (
        <a
          href={company.website}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
        >
          <i className="bi bi-box-arrow-up-right" /> Visit website
        </a>
      )}

      <section className="mt-4">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Open internships</h4>
        {shown.length ? (
          <ul className="mt-2 space-y-2">
            {shown.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => onSelectJob?.(job)}
                  className="w-full rounded-lg border border-line px-3 py-2 text-left transition-colors hover:border-accent/60 hover:bg-muted"
                >
                  <span className="block truncate text-xs font-bold text-content">{job.title}</span>
                  <span className="block truncate text-[11px] text-subtle">
                    {job.location || '—'} · {payRange(job)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-subtle">No open listings right now.</p>
        )}
        {!expanded && listings.length > 3 && (
          <p className="mt-2 text-[11px] text-faint">+{listings.length - 3} more — show more to see them all.</p>
        )}
      </section>

      <MoreButton expanded={expanded} onToggle={onToggleExpand} />
    </Shell>
  );
}
