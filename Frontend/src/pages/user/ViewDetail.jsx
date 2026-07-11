import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
import Toast from '../../components/shared/Toast';
import useInternships from '../../hooks/useInternships';
import useSavedInternships from '../../hooks/useSavedInternships';
import useMyApplications from '../../hooks/useMyApplications';
import useToast from '../../hooks/useToast';
import { payRange } from '../../components/ui/InternshipCard';

const ENV_LABEL = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' };

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-muted p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-faint">{label}</p>
      <p className="mt-1 text-sm font-bold text-content">{value}</p>
    </div>
  );
}

export default function ViewDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = Number(searchParams.get('id'));

  const { internships, fetchInternships, loading } = useInternships();
  const { savedInternships, fetchSaved, saveInternship, unsaveInternship } = useSavedInternships();
  const { apply, hasApplied } = useMyApplications();
  const { message: toastMessage, showToast, clearToast } = useToast();

  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    fetchInternships();
    fetchSaved();
  }, [fetchInternships, fetchSaved]);

  useEffect(() => {
    setSavedIds(new Set((savedInternships || []).map((j) => j.id)));
  }, [savedInternships]);

  const list = Array.isArray(internships) ? internships : [];
  const job = useMemo(() => list.find((j) => j.id === jobId), [list, jobId]);

  // Other openings from the same company.
  const siblings = useMemo(
    () => (job ? list.filter((j) => j.company?.id === job.company?.id && j.id !== job.id) : []),
    [list, job]
  );

  const toggleSave = async (id) => {
    const next = new Set(savedIds);
    if (next.has(id)) { next.delete(id); setSavedIds(next); await unsaveInternship(id); }
    else { next.add(id); setSavedIds(next); await saveInternship(id); }
  };

  const handleApply = async () => {
    const res = await apply(job);
    if (res.success) showToast(`Applied to ${job.title}.`);
    else if (res.needsCv) {
      showToast(res.message || 'You need a CV before applying.');
      navigate(`/cv?redirect=${encodeURIComponent(`/view-detail?id=${job.id}`)}&reason=apply`);
    } else showToast(res.message || 'Could not apply.');
  };

  const skills = (job?.skills || '').split(',').map((s) => s.trim()).filter(Boolean);
  const applied = job ? hasApplied(job.id) : false;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {loading && <div className="h-64 animate-pulse rounded-2xl border border-line bg-muted" />}

        {!loading && !job && (
          <div className="rounded-2xl border border-dashed border-line bg-raised py-20 text-center">
            <i className="bi bi-exclamation-circle text-3xl text-faint" />
            <p className="mt-3 text-sm font-semibold text-content">Internship not found</p>
            <p className="mt-1 text-xs text-subtle">It may have been closed or removed.</p>
            <Link to="/user/internships" className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink">
              Browse internships
            </Link>
          </div>
        )}

        {!loading && job && (
          <>
            <Link to="/user/internships" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-subtle hover:text-accent">
              <i className="bi bi-arrow-left" /> Back to internships
            </Link>

            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Main */}
              <div className="min-w-0 flex-1">
                <section className="rounded-2xl border border-line bg-raised p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      {job.company?.logoUrl ? (
                        <img src={job.company.logoUrl} alt="" className="h-14 w-14 rounded-xl border border-line object-cover" />
                      ) : (
                        <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl bg-accent-soft text-xl font-black text-accent">
                          {(job.company?.companyName || '?').charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h1 className="text-2xl font-black tracking-tight text-content">{job.title}</h1>
                        <Link
                          to={job.company?.id ? `/company/${job.company.id}` : '#'}
                          className="text-sm text-subtle hover:text-accent"
                        >
                          {job.company?.companyName || 'Unknown company'}
                        </Link>
                        <p className="mt-1 text-xs text-faint">
                          <i className="bi bi-geo-alt mr-1" />{job.location || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 gap-2">
                      <button
                        onClick={() => toggleSave(job.id)}
                        className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${
                          savedIds.has(job.id)
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-line text-faint hover:text-content'
                        }`}
                        aria-label={savedIds.has(job.id) ? 'Remove from saved' : 'Save internship'}
                      >
                        <i className={`bi ${savedIds.has(job.id) ? 'bi-bookmark-fill' : 'bi-bookmark'}`} />
                      </button>
                      <button
                        onClick={handleApply}
                        disabled={applied}
                        className={`rounded-lg px-5 py-2 text-sm font-bold transition-all ${
                          applied ? 'cursor-default bg-muted text-faint' : 'bg-accent text-accent-ink hover:opacity-90'
                        }`}
                      >
                        {applied ? 'Applied' : 'Apply now'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat label="Type" value={ENV_LABEL[job.workEnvironment] || job.workEnvironment || '—'} />
                    <Stat
                      label="Duration"
                      value={job.durationValue ? `${job.durationValue} ${job.durationUnit || ''}`.trim() : '—'}
                    />
                    <Stat label="Salary" value={payRange(job)} />
                    <Stat label="Category" value={job.internshipCategory || '—'} />
                  </div>
                </section>

                <section className="mt-6 rounded-2xl border border-line bg-raised p-6">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-faint">About the role</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-subtle">
                    {job.jobDescription || 'No description provided.'}
                  </p>

                  {skills.length > 0 && (
                    <>
                      <h2 className="mt-6 text-xs font-bold uppercase tracking-wide text-faint">Skills</h2>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <span key={s} className="rounded-md border border-line px-2 py-0.5 text-xs text-subtle">{s}</span>
                        ))}
                      </div>
                    </>
                  )}

                  {job.deadline && (
                    <p className="mt-6 text-xs text-subtle">
                      <i className="bi bi-calendar-event mr-1.5" />
                      Apply before {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  )}
                </section>
              </div>

              {/* Sidebar — other roles at this company */}
              <aside className="lg:w-80 lg:flex-shrink-0">
                <div className="sticky top-24 rounded-2xl border border-line bg-raised p-4">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-faint">
                    More at {job.company?.companyName || 'this company'}
                  </h2>
                  <p className="mt-0.5 text-xs text-subtle">
                    {siblings.length} other {siblings.length === 1 ? 'role' : 'roles'}
                  </p>

                  {siblings.length === 0 ? (
                    <p className="mt-4 rounded-lg border border-dashed border-line py-6 text-center text-xs text-faint">
                      No other openings right now.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {siblings.slice(0, 5).map((s) => (
                        <li key={s.id}>
                          <Link
                            to={`/view-detail?id=${s.id}`}
                            className="block rounded-lg border border-line p-3 transition-colors hover:border-accent/60"
                          >
                            <p className="truncate text-sm font-bold text-content">{s.title}</p>
                            <p className="truncate text-xs text-subtle">
                              {s.location || 'Not specified'} · {ENV_LABEL[s.workEnvironment] || s.workEnvironment || ''}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-accent">{payRange(s)}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}
