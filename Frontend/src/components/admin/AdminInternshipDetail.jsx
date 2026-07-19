import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInternshipDetail } from '../../api/adminApi';

/*
  One listing, opened from the admin's company drill-down.

  The Listings tab could show a company's internships and let an admin suspend or
  delete them — but not open one. That meant moderating a reported listing
  without being able to read what it says or see who had applied to it. Deleting
  a listing tombstones every application attached to it, so knowing how many
  students that affects belongs on the screen where the decision is made.
*/

const STATUS_STYLE = {
  open: 'bg-accent-soft text-accent',
  closed: 'bg-muted text-subtle',
  draft: 'bg-muted text-subtle',
  suspended: 'bg-danger/10 text-danger',
};

const APP_STATUS_STYLE = {
  pending: 'bg-muted text-subtle',
  reviewed: 'bg-accent-soft text-accent',
  accepted: 'bg-accent-soft text-accent',
  rejected: 'bg-danger/10 text-danger',
};

export default function AdminInternshipDetail({ internshipId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await getInternshipDetail(internshipId);
      if (cancelled) return;
      if (res.success) { setData(res.internship); setError(''); }
      else setError(res.message || 'Could not load this listing.');
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [internshipId]);

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-line bg-raised shadow-xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-sm font-bold text-content">Listing detail</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-faint transition hover:text-content"
          >
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="max-h-[75vh] overflow-y-auto p-5">
          {loading && <div className="h-48 animate-pulse rounded-xl border border-line bg-muted" />}

          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{error}</div>
          )}

          {data && (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-black leading-snug text-content">{data.title}</h3>
                  <p className="mt-0.5 text-sm text-subtle">
                    {data.company?.companyName || 'Unknown company'}
                    {data.company?.industry ? ` · ${data.company.industry}` : ''}
                  </p>
                  <p className="mt-1 text-[11px] text-faint">
                    Posted {new Date(data.createdAt).toLocaleDateString()}
                    {data.deadline ? ` · closes ${new Date(data.deadline).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <span className={`rounded-md px-2 py-1 text-[11px] font-semibold capitalize ${
                  STATUS_STYLE[data.status] || STATUS_STYLE.draft
                }`}>
                  {data.status}
                </span>
              </div>

              {data.status === 'suspended' && data.suspensionReason && (
                <p className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                  <span className="font-bold">Suspension reason: </span>{data.suspensionReason}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
                {[
                  data.location && `📍 ${data.location}`,
                  data.workEnvironment,
                  data.internshipCategory,
                  data.internshipType,
                ].filter(Boolean).map((t) => (
                  <span key={t} className="rounded-md bg-muted px-2 py-1 text-subtle">{t}</span>
                ))}
              </div>

              {data.jobDescription && (
                <section className="mt-5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Description</h4>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-subtle">
                    {data.jobDescription}
                  </p>
                </section>
              )}

              {data.requirements && (
                <section className="mt-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Requirements</h4>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-subtle">
                    {data.requirements}
                  </p>
                </section>
              )}

              {data.skills && (
                <section className="mt-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">Skills</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-subtle">{data.skills}</p>
                </section>
              )}

              <section className="mt-6">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-faint">
                  Applicants ({data.applications?.length ?? 0})
                </h4>

                {!data.applications?.length ? (
                  <p className="mt-2 rounded-lg border border-dashed border-line py-8 text-center text-xs text-subtle">
                    Nobody has applied to this listing yet.
                  </p>
                ) : (
                  <>
                    <p className="mt-1.5 text-[11px] text-faint">
                      Deleting this listing marks all {data.applications.length} application(s) as
                      removed for these students.
                    </p>
                    <ul className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line">
                      {data.applications.map((a) => {
                        const p = a.student?.studentProfile || {};
                        return (
                          <li key={a.id} className="flex items-center gap-3 px-3 py-2.5">
                            {p.profileImage ? (
                              <img src={p.profileImage} alt="" className="h-8 w-8 flex-shrink-0 rounded-full border border-line object-cover" />
                            ) : (
                              <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-bold text-accent">
                                {(p.fullName || a.student?.email || '?').charAt(0).toUpperCase()}
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-content">
                                {p.fullName || a.student?.email || 'Applicant'}
                              </p>
                              <p className="truncate text-[11px] text-faint">
                                {p.education || 'No education listed'}
                                {a.cv ? ' · CV attached' : ' · no CV'}
                                {' · applied '}{new Date(a.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${
                              APP_STATUS_STYLE[a.status] || APP_STATUS_STYLE.pending
                            }`}>
                              {a.status}
                            </span>
                            {a.student?.id && (
                              <Link
                                to={`/admin/users/${a.student.id}`}
                                className="flex-shrink-0 rounded-lg border border-line px-2 py-1 text-[11px] font-semibold text-subtle transition hover:text-accent"
                              >
                                Inspect
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
