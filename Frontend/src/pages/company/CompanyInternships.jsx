import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../../components/shared/Toast';
import useToast from '../../hooks/useToast';
import useApplicantAlerts from '../../hooks/useApplicantAlerts';
import { getMyStats, decideApplication } from '../../api/companyApi';

const STATUS_STYLE = {
  pending:  'bg-muted text-subtle',
  reviewed: 'bg-muted text-subtle',
  accepted: 'bg-accent-soft text-accent',
  rejected: 'bg-danger/10 text-danger',
};

export default function CompanyInternships() {
  const { applications, refresh, markAllSeen, count } = useApplicantAlerts();
  const { message: toastMessage, showToast, clearToast } = useToast();
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');   // all | pending | accepted | rejected
  const [expanded, setExpanded] = useState(null);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await getMyStats();
      if (s.success) setStats(s.stats);
    })();
  }, []);

  // Opening this page clears the "new applicant" badge.
  useEffect(() => {
    if (applications.length) markAllSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications.length]);

  const visible = useMemo(
    () => (filter === 'all' ? applications : applications.filter((a) => a.status === filter)),
    [applications, filter]
  );

  /** Anything past `pending` means the CV has been reviewed at least once. */
  const reviewed = (app) => ['reviewed', 'accepted', 'rejected'].includes(app.status);

  const decide = async (app, status) => {
    setBusy(app.id);
    const res = await decideApplication(app.id, status);
    showToast(res.success
      ? `${app.student?.studentProfile?.fullName || 'Applicant'} ${status}.`
      : res.message);
    if (res.success) await refresh();
    setBusy(null);
  };

  const tabCls = (v) =>
    `rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
      filter === v ? 'bg-accent-soft text-accent' : 'text-subtle hover:bg-muted hover:text-content'
    }`;

  return (
    <div className="flex flex-1 flex-col bg-surface">

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-content">Internships & applicants</h1>
            <p className="mt-1 text-sm text-subtle">Review CVs and decide, without leaving this page.</p>
          </div>
          <Link to="/company/create-internship" className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink transition hover:opacity-90">
            <i className="bi bi-plus-lg mr-1" /> Post internship
          </Link>
        </header>

        {count > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-accent/40 bg-accent-soft p-3 text-sm text-accent">
            <i className="bi bi-bell-fill" />
            <span className="font-semibold">
              {count} new applicant{count === 1 ? '' : 's'} since your last visit.
            </span>
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-raised p-4">
            <p className="text-xs font-semibold text-subtle">Listings</p>
            <p className="mt-1 text-2xl font-black text-content">{stats?.internships ?? 0}</p>
          </div>
          <div className="rounded-xl border border-line bg-raised p-4">
            <p className="text-xs font-semibold text-subtle">Applications received</p>
            <p className="mt-1 text-2xl font-black text-content">{stats?.applications ?? 0}</p>
          </div>
          <div className="rounded-xl border border-line bg-raised p-4">
            <p className="text-xs font-semibold text-subtle">Awaiting your decision</p>
            <p className="mt-1 text-2xl font-black text-accent">{stats?.pending ?? 0}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1 rounded-xl border border-line bg-raised p-1">
          {['all', 'pending', 'accepted', 'rejected'].map((v) => (
            <button key={v} onClick={() => setFilter(v)} className={tabCls(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
            <i className="bi bi-inbox text-3xl text-faint" />
            <p className="mt-3 text-sm font-semibold text-content">No applicants here</p>
            <p className="mt-1 text-xs text-subtle">
              {filter === 'all' ? 'Nobody has applied to your listings yet.' : `No ${filter} applications.`}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((a) => {
              const p = a.student?.studentProfile || {};
              const isOpen = expanded === a.id;
              return (
                <li key={a.id} className="rounded-xl border border-line bg-raised p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      {p.profileImage ? (
                        <img src={p.profileImage} alt="" className="h-11 w-11 flex-shrink-0 rounded-full border border-line object-cover" />
                      ) : (
                        <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-accent">
                          {(p.fullName || a.student?.email || '?').charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-content">{p.fullName || a.student?.email}</p>
                        <p className="truncate text-xs text-subtle">
                          {a.internship?.title || 'Internship'} · applied {new Date(a.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[a.status]}`}>
                        {a.status}
                      </span>

                      <button
                        onClick={() => setExpanded(isOpen ? null : a.id)}
                        className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-subtle transition hover:text-content"
                      >
                        <i className="bi bi-file-earmark-person mr-1" /> {isOpen ? 'Hide' : 'View CV'}
                      </button>

                      {/* Accept/Reject stay locked until the CV has been marked
                          reviewed. A decision notifies the student, so it should
                          follow actually reading the CV rather than sitting one
                          stray click away in a list. */}
                      {!reviewed(a) ? (
                        <button
                          disabled={busy === a.id}
                          onClick={() => decide(a, 'reviewed')}
                          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-ink transition hover:opacity-90 disabled:opacity-50"
                        >
                          <i className="bi bi-check2-square mr-1" /> Reviewed CV
                        </button>
                      ) : (
                        <>
                          {a.status !== 'accepted' && (
                            <button
                              disabled={busy === a.id}
                              onClick={() => decide(a, 'accepted')}
                              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-ink transition hover:opacity-90 disabled:opacity-50"
                            >
                              Accept
                            </button>
                          )}
                          {a.status !== 'rejected' && (
                            <button
                              disabled={busy === a.id}
                              onClick={() => decide(a, 'rejected')}
                              className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:border-danger hover:text-danger disabled:opacity-50"
                            >
                              Reject
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Inline CV / profile — no page change needed to decide */}
                  {isOpen && (
                    <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
                      <div>
                        <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-faint">About</h3>
                        <p className="text-sm text-subtle">{p.bio || 'No bio provided.'}</p>

                        <h3 className="mb-1 mt-3 text-xs font-bold uppercase tracking-wide text-faint">Education</h3>
                        <p className="text-sm text-subtle">{p.education || '—'}</p>
                      </div>

                      <div>
                        <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-faint">Skills</h3>
                        {p.skills ? (
                          <div className="flex flex-wrap gap-1.5">
                            {p.skills.split(',').map((s) => (
                              <span key={s} className="rounded-md border border-line px-2 py-0.5 text-xs text-subtle">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-subtle">—</p>
                        )}

                        <h3 className="mb-1 mt-3 text-xs font-bold uppercase tracking-wide text-faint">CV</h3>
                        {a.cv ? (
                          <div className="flex items-center gap-2 text-sm">
                            <i className="bi bi-file-earmark-check text-accent" />
                            <span className="text-subtle">
                              CV attached{a.cv.score ? ` · score ${a.cv.score}` : ''}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-subtle">No CV attached.</p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-3">
                          <Link
                            to={`/company/applicant/${a.student?.id}/profile`}
                            className="text-xs font-semibold text-accent hover:underline"
                          >
                            View full profile →
                          </Link>
                          {a.cv && (
                            <Link
                              to={`/company/applicant/${a.id}/cv`}
                              className="text-xs font-semibold text-accent hover:underline"
                            >
                              Open CV in full →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}
