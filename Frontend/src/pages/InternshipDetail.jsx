import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import PublicFooter from '../components/layout/Footer';
import StudentNavbar from '../components/layout/StudentNavbar';
import StudentFooter from '../components/layout/StudentFooter';
import Toast from '../components/shared/Toast';
import { payRange, splitList } from '../components/shared/DetailPane';
import { getPublicInternship } from '../api/publicApi';
import useSavedInternships from '../hooks/useSavedInternships';
import useMyApplications from '../hooks/useMyApplications';
import useCvStatus from '../hooks/useCvStatus';
import useToast from '../hooks/useToast';

const ENV_LABEL = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' };

function readRole() {
  try {
    if (!localStorage.getItem('token')) return null;
    return JSON.parse(localStorage.getItem('user') || 'null')?.role || null;
  } catch {
    return null;
  }
}

/* ---------- Shared presentation ---------- */

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xs font-black uppercase tracking-wider text-faint">{title}</h2>
      {children}
    </section>
  );
}

function Body({ job }) {
  const skills = splitList(job.skills);
  const requirements = splitList(job.requirements, '\n');

  return (
    <div className="rounded-2xl border border-line bg-raised p-6 sm:p-8">
      <div className="flex items-start gap-4">
        {job.company?.logoUrl ? (
          <img src={job.company.logoUrl} alt="" className="h-16 w-16 flex-shrink-0 rounded-2xl border border-line object-cover" />
        ) : (
          <span className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-accent-soft text-xl font-black text-accent">
            {(job.company?.companyName || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-content sm:text-3xl">{job.title}</h1>
          <p className="mt-0.5 text-sm font-semibold text-subtle">
            {job.company?.companyName || 'Unknown company'}
          </p>
          {job.company?.industry && (
            <p className="text-xs text-faint">{job.company.industry}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-subtle">
          <i className="bi bi-geo-alt mr-1" />{job.location || 'Not specified'}
        </span>
        {job.workEnvironment && (
          <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-subtle">
            <i className="bi bi-laptop mr-1" />{ENV_LABEL[job.workEnvironment] || job.workEnvironment}
          </span>
        )}
        {job.internshipCategory && (
          <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-subtle">
            <i className="bi bi-tag mr-1" />{job.internshipCategory}
          </span>
        )}
        {job.durationValue ? (
          <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-subtle">
            <i className="bi bi-clock mr-1" />{job.durationValue} {job.durationUnit || ''}
          </span>
        ) : null}
        <span className="rounded-lg bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent">
          {payRange(job)}
        </span>
      </div>

      <Section title="About the role">
        {job.jobDescription && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-subtle">
            {job.jobDescription}
          </p>
        )}
      </Section>

      {requirements.length > 0 && (
        <Section title="Requirements">
          <ul className="mt-2 space-y-2">
            {requirements.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-subtle">
                <i className="bi bi-check2 mt-0.5 text-accent" />
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="rounded-lg bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {job.education && (
        <Section title="Education">
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-subtle">{job.education}</p>
        </Section>
      )}

      {job.benefit && (
        <Section title="Benefits">
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-subtle">{job.benefit}</p>
        </Section>
      )}

      {job.companyCulture && (
        <Section title="Company culture">
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-subtle">{job.companyCulture}</p>
        </Section>
      )}
    </div>
  );
}

function Sidebar({ children }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-line bg-raised p-6">{children}</div>
    </aside>
  );
}

/* ---------- Role-specific shells ----------
   Split so the student-only hooks (saved / applications / CV status) are never
   mounted for an anonymous visitor. They send an Authorization header; calling
   them with no token would 401 on every page load for someone just browsing. */

function StudentView({ job }) {
  const navigate = useNavigate();
  const { savedInternships, fetchSaved, saveInternship, unsaveInternship } = useSavedInternships();
  const { apply, hasApplied } = useMyApplications();
  const { hasCv } = useCvStatus();
  const { message, showToast, clearToast } = useToast();

  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);
  useEffect(() => { setSaved(savedInternships.some((j) => j.id === job.id)); }, [savedInternships, job.id]);
  useEffect(() => { setApplied(hasApplied(job.id)); }, [hasApplied, job.id]);

  const toggleSave = async () => {
    if (saved) { setSaved(false); await unsaveInternship(job.id); }
    else { setSaved(true); await saveInternship(job.id); }
  };

  const handleApply = async () => {
    if (!hasCv) {
      showToast('You need a CV before applying — build or upload one first.');
      navigate(`/cv?redirect=${encodeURIComponent(`/internships/${job.id}`)}&reason=apply`);
      return;
    }
    const res = await apply(job);
    if (res.success) { setApplied(true); showToast(`Applied to ${job.title}.`); }
    else if (res.needsCv) {
      showToast(res.message || 'You need a CV before applying.');
      navigate(`/cv?redirect=${encodeURIComponent(`/internships/${job.id}`)}&reason=apply`);
    } else showToast(res.message || 'Could not apply.');
  };

  return (
    <>
      <Sidebar>
        <p className="text-xs font-bold uppercase tracking-wider text-faint">Compensation</p>
        <p className="mt-1 text-xl font-black text-content">{payRange(job)}</p>

        <button
          type="button"
          onClick={handleApply}
          disabled={applied}
          className={`mt-5 w-full rounded-xl px-5 py-3 text-sm font-bold transition ${
            applied ? 'cursor-default bg-muted text-faint' : 'bg-accent text-accent-ink hover:brightness-95'
          }`}
        >
          {applied ? 'Applied' : 'Apply for this internship'}
        </button>

        <button
          type="button"
          onClick={toggleSave}
          className={`mt-2 w-full rounded-xl border px-5 py-2.5 text-xs font-bold transition-colors ${
            saved ? 'border-accent bg-accent-soft text-accent' : 'border-line text-subtle hover:bg-muted hover:text-content'
          }`}
        >
          <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'} mr-1`} />
          {saved ? 'Saved' : 'Save for later'}
        </button>

        {!hasCv && (
          <p className="mt-3 text-center text-[11px] leading-relaxed text-subtle">
            You&apos;ll need a CV on file before you can apply.
          </p>
        )}
      </Sidebar>

      <Toast message={message} onClose={clearToast} />
    </>
  );
}

function PublicView({ job }) {
  const navigate = useNavigate();
  const next = encodeURIComponent(`/internships/${job.id}`);

  return (
    <Sidebar>
      <p className="text-xs font-bold uppercase tracking-wider text-faint">Compensation</p>
      <p className="mt-1 text-xl font-black text-content">{payRange(job)}</p>

      <button
        type="button"
        onClick={() => navigate(`/signup?next=${next}`)}
        className="mt-5 w-full rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition hover:brightness-95"
      >
        Sign up to apply
      </button>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-subtle">
        Applying needs a student account — it takes a minute.
      </p>
      <p className="mt-1 text-center text-[11px] text-faint">
        Already have one?{' '}
        <Link to={`/login?next=${next}`} className="font-bold text-accent hover:underline">
          Log in
        </Link>
      </p>
    </Sidebar>
  );
}

function OtherRoleView({ job, role }) {
  return (
    <Sidebar>
      <p className="text-xs font-bold uppercase tracking-wider text-faint">Compensation</p>
      <p className="mt-1 text-xl font-black text-content">{payRange(job)}</p>
      <button
        type="button"
        disabled
        className="mt-5 w-full cursor-not-allowed rounded-xl bg-muted px-5 py-3 text-sm font-bold text-faint"
      >
        Only students can apply
      </button>
      <p className="mt-3 text-center text-[11px] text-subtle">
        You&apos;re signed in as a {role}.
      </p>
    </Sidebar>
  );
}

/* ---------- Page ---------- */

export default function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = readRole();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const res = await getPublicInternship(id);
      if (!alive) return;
      if (res.success && res.internship) setJob(res.internship);
      else setError(res.message || 'That internship could not be found.');
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [id]);

  const isStudent = role === 'student';
  const Nav = isStudent ? StudentNavbar : Header;
  const Foot = isStudent ? StudentFooter : PublicFooter;
  const backTo = isStudent ? '/user/internships' : '/explore';

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {!isStudent && <AnimatedBackground />}
      <Nav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(backTo))}
          className="text-xs font-bold text-accent hover:underline"
        >
          <i className="bi bi-arrow-left mr-1" /> Back to listings
        </button>

        {loading && <div className="mt-6 h-96 animate-pulse rounded-2xl border border-line bg-muted" />}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-line bg-raised py-20 text-center">
            <i className="bi bi-search text-2xl text-faint" />
            <p className="mt-3 text-sm font-bold text-content">{error}</p>
            <Link
              to={backTo}
              className="mt-5 inline-block rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-ink"
            >
              Browse internships
            </Link>
          </div>
        )}

        {!loading && job && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
            <Body job={job} />
            {isStudent ? (
              <StudentView job={job} />
            ) : !role ? (
              <PublicView job={job} />
            ) : (
              <OtherRoleView job={job} role={role} />
            )}
          </div>
        )}
      </main>

      <Foot />
    </div>
  );
}
