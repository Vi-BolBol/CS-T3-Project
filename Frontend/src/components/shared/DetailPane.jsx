import { Link } from 'react-router-dom';

/**
 * The "c" column: a summary of the selected internship/company, beside the
 * results rather than instead of them.
 *
 * It is deliberately a SUMMARY. The full text lives on its own page
 * (/internships/:id) — cramming a whole listing into a side column meant either
 * a wall of tiny text or an accordion nobody wants to fight. "View full details"
 * replaces the old Show more / Show less.
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

export function splitList(value, sep = ',') {
  return (value || '').split(sep).map((s) => s.trim()).filter(Boolean);
}

function Tag({ icon, children }) {
  if (!children) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-subtle">
      {icon && <i className={`bi ${icon}`} />} {children}
    </span>
  );
}

/** Fills its column and scrolls internally; the action row is pinned. */
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

function Section({ title, children }) {
  return (
    <section className="mt-5">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">{title}</h4>
      {children}
    </section>
  );
}

export function InternshipPane({ job, onClose, actions, detailTo }) {
  if (!job) return null;

  const skills = splitList(job.skills);
  const requirements = splitList(job.requirements, '\n');

  return (
    <Shell title="Internship details" onClose={onClose} actions={actions}>
      <div className="flex items-start gap-4">
        {job.company?.logoUrl ? (
          <img src={job.company.logoUrl} alt="" className="h-14 w-14 flex-shrink-0 rounded-xl border border-line object-cover" />
        ) : (
          <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl bg-accent-soft text-lg font-black text-accent">
            {(job.company?.companyName || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-black leading-snug text-content">{job.title}</h3>
          <p className="truncate text-sm text-subtle">{job.company?.companyName || 'Unknown company'}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Tag icon="bi-geo-alt">{job.location || 'Not specified'}</Tag>
        <Tag icon="bi-laptop">{ENV_LABEL[job.workEnvironment] || job.workEnvironment}</Tag>
        <Tag icon="bi-tag">{job.internshipCategory}</Tag>
        {job.durationValue ? (
          <Tag icon="bi-clock">{`${job.durationValue} ${job.durationUnit || ''}`.trim()}</Tag>
        ) : null}
      </div>

      <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2.5 text-sm font-bold text-accent">
        {payRange(job)}
      </p>

      {job.jobDescription && (
        <Section title="About the role">
          <p className="mt-2 line-clamp-5 whitespace-pre-line text-sm leading-relaxed text-subtle">
            {job.jobDescription}
          </p>
        </Section>
      )}

      {requirements.length > 0 && (
        <Section title="Requirements">
          <ul className="mt-2 space-y-1.5">
            {requirements.slice(0, 3).map((r, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-subtle">
                <i className="bi bi-check2 mt-0.5 text-accent" />
                <span className="line-clamp-2">{r}</span>
              </li>
            ))}
          </ul>
          {requirements.length > 3 && (
            <p className="mt-1.5 text-[11px] text-faint">
              +{requirements.length - 3} more in the full listing
            </p>
          )}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="rounded-md border border-line px-2 py-1 text-xs text-subtle">
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Everything else — education, benefits, culture, the full description —
          lives on the listing page rather than being crammed in here. */}
      <Link
        to={detailTo || `/internships/${job.id}`}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-accent px-3 py-2.5 text-xs font-bold text-accent transition-colors hover:bg-accent-soft"
      >
        View full details <i className="bi bi-arrow-right" />
      </Link>
    </Shell>
  );
}

export function CompanyPane({ company, listings = [], onClose, onSelectJob, actions }) {
  if (!company) return null;

  return (
    <Shell title="Company details" onClose={onClose} actions={actions}>
      <div className="flex items-start gap-4">
        {company.logoUrl ? (
          <img src={company.logoUrl} alt="" className="h-14 w-14 flex-shrink-0 rounded-xl border border-line object-cover" />
        ) : (
          <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl bg-accent-soft text-lg font-black text-accent">
            {(company.companyName || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-black leading-snug text-content">
            {company.companyName || 'Unnamed company'}
          </h3>
          <p className="truncate text-sm text-subtle">{company.industry || 'Industry not set'}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Tag icon="bi-geo-alt">{company.location || 'Not specified'}</Tag>
        {company.employeeCount != null && <Tag icon="bi-people">{`${company.employeeCount} employees`}</Tag>}
        <Tag icon="bi-briefcase">{`${listings.length} open`}</Tag>
      </div>

      {company.description && (
        <Section title="About">
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-subtle">
            {company.description}
          </p>
        </Section>
      )}

      {company.website && (
        <a
          href={company.website}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
        >
          <i className="bi bi-box-arrow-up-right" /> Visit website
        </a>
      )}

      <Section title="Open internships">
        {listings.length ? (
          <ul className="mt-2 space-y-2">
            {listings.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => onSelectJob?.(job)}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-left transition-colors hover:border-accent/60 hover:bg-muted"
                >
                  <span className="block truncate text-sm font-bold text-content">{job.title}</span>
                  <span className="block truncate text-xs text-subtle">
                    {job.location || '—'} · {payRange(job)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-subtle">No open listings right now.</p>
        )}
      </Section>
    </Shell>
  );
}


/**
 * A student, summarised.
 *
 * Companies browse people the same way they browse listings, so this uses the
 * same Shell as the other two panes rather than opening a separate page.
 */
export function StudentPane({ student, onClose, actions, profileTo }) {
  if (!student) return null;

  const name = student.fullName || 'Student';
  const skills = splitList(student.skills);

  return (
    <Shell title="Student details" onClose={onClose} actions={actions}>
      <div className="flex items-start gap-4">
        {student.profileImage ? (
          <img
            src={student.profileImage}
            alt=""
            className="h-16 w-16 flex-shrink-0 rounded-xl border border-line object-cover"
          />
        ) : (
          <span className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-xl bg-accent-soft text-xl font-black text-accent">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-xl font-black tracking-tight text-content">{name}</h3>
          <p className="mt-0.5 text-sm text-subtle">{student.education || 'Education not specified'}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Tag icon="bi-mortarboard">{student.education}</Tag>
        {skills.length > 0 && <Tag icon="bi-tools">{skills.length} skill{skills.length === 1 ? '' : 's'}</Tag>}
      </div>

      {student.bio && (
        <Section title="About">
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-subtle">{student.bio}</p>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skills.map((sk) => (
              <span key={sk} className="rounded-md border border-line px-2 py-0.5 text-xs text-subtle">
                {sk}
              </span>
            ))}
          </div>
        </Section>
      )}

      {!student.bio && skills.length === 0 && (
        <p className="mt-6 text-sm text-subtle">
          This student hasn&apos;t filled in their profile yet.
        </p>
      )}

      {profileTo && (
        <Link
          to={profileTo}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:underline"
        >
          View full profile <i className="bi bi-arrow-right text-xs" />
        </Link>
      )}
    </Shell>
  );
}
