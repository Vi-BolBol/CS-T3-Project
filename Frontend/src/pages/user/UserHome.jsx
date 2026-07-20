import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
import InternshipCard from '../../components/ui/InternshipCard';
import Toast from '../../components/shared/Toast';
import useRecommendedInternships from '../../hooks/useRecommendedInternships';
import useSavedInternships from '../../hooks/useSavedInternships';
import useFollowedCompanies from '../../hooks/useFollowedCompanies';
import useMyApplications from '../../hooks/useMyApplications';
import useCvStatus from '../../hooks/useCvStatus';
import { getMyStudentProfile, updateMyStudentProfile } from '../../api/studentApi';
import useToast from '../../hooks/useToast';

function Section({ title, subtitle, action, children }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-black tracking-tight text-content">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-subtle">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon, title, body, cta }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-raised py-12 text-center">
      <i className={`bi ${icon} text-2xl text-faint`} />
      <p className="mt-2 text-sm font-semibold text-content">{title}</p>
      <p className="mt-1 text-xs text-subtle">{body}</p>
      {cta}
    </div>
  );
}

export default function UserHome() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const { recommended, fetchRecommended, loading: loadingRec } = useRecommendedInternships();
  const { savedInternships, fetchSaved, saveInternship, unsaveInternship } = useSavedInternships();
  const { followedCompanies, fetchFollowed } = useFollowedCompanies();
  const { apply, hasApplied } = useMyApplications();
  const { hasCv, syncedToProfile, markCvSynced, getCvAsProfile } = useCvStatus();
  const { message: toastMessage, showToast, clearToast } = useToast();

  const [savedIds, setSavedIds] = useState(new Set());
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);

  // Guard against a hook returning undefined (e.g. a failed/unauth fetch).
  const recList = Array.isArray(recommended) ? recommended : [];
  const savedList = Array.isArray(savedInternships) ? savedInternships : [];
  const followedList = Array.isArray(followedCompanies) ? followedCompanies : [];

  useEffect(() => {
    fetchRecommended();
    fetchSaved();
    fetchFollowed();
  }, [fetchRecommended, fetchSaved, fetchFollowed]);

  useEffect(() => {
    setSavedIds(new Set(savedList.map((j) => j.id)));
  }, [savedInternships]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
    "Sync your CV to your profile" prompt.

    Two conditions have to hold, not one. `syncedToProfile` lives in
    localStorage, so logging out wipes it and the prompt would reappear for a
    profile that was already filled in. Checking the SERVER profile as well
    makes the dismissal durable: if the profile already carries the fields a
    sync would write, there is nothing to offer.
  */
  const [profileAlreadyFilled, setProfileAlreadyFilled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getMyStudentProfile();
      if (cancelled || !res.success) return;
      const p = res.profile;
      setProfileAlreadyFilled(Boolean(p?.fullName && (p?.education || p?.skills)));
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setShowSyncPrompt(hasCv && !syncedToProfile && !profileAlreadyFilled);
  }, [hasCv, syncedToProfile, profileAlreadyFilled]);

  /*
    Actually performs the sync.

    This button previously called markCvSynced() and nothing else — it flipped
    the flag and announced "CV synced to your profile" while copying no data at
    all. It now runs the same merge the profile page does: CV fields fill empty
    profile fields, existing profile data is never overwritten, and the result
    is persisted to the server.
  */
  const runSync = async () => {
    const fromCv = getCvAsProfile?.();
    if (!fromCv) {
      showToast('No CV data found to sync.');
      return;
    }

    const current = await getMyStudentProfile();
    const existing = current.success && current.profile ? current.profile : {};

    const merged = {
      fullName:     existing.fullName     || fromCv.fullName   || null,
      bio:          existing.bio          || fromCv.bio        || null,
      education:    existing.education    || fromCv.university || null,
      skills:       existing.skills       || fromCv.skills     || null,
      phone:        existing.phone        || fromCv.phone      || null,
      profileImage: existing.profileImage || fromCv.photo      || null,
    };

    const res = await updateMyStudentProfile(merged);
    markCvSynced();
    setShowSyncPrompt(false);
    setProfileAlreadyFilled(true);
    showToast(res.success
      ? 'CV synced — your profile has been filled in.'
      : (res.message || 'Synced on this device only.'));
  };

  const runSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/user/internships?q=${encodeURIComponent(q)}` : '/user/internships');
  };

  const toggleSave = async (id) => {
    const next = new Set(savedIds);
    if (next.has(id)) {
      next.delete(id);
      setSavedIds(next);
      await unsaveInternship(id);
    } else {
      next.add(id);
      setSavedIds(next);
      await saveInternship(id);
    }
    fetchSaved();
  };

  const handleApply = async (job) => {
    if (!hasCv) {
      showToast('You need a CV before applying — build or upload one first.');
      navigate(`/cv?redirect=${encodeURIComponent('/user/home')}&reason=apply`);
      return;
    }
    const res = await apply(job);
    if (res.success) {
      showToast(`Applied to ${job.title}.`);
    } else if (res.needsCv) {
      showToast(res.message || 'You need a CV before applying.');
      navigate(`/cv?redirect=${encodeURIComponent('/user/home')}&reason=apply`);
    } else {
      showToast(res.message || 'Could not apply.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* CV sync prompt */}
        {showSyncPrompt && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent-soft p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <i className="bi bi-arrow-repeat mt-0.5 text-accent" />
              <div>
                <p className="text-sm font-bold text-content">Sync your CV with your profile</p>
                <p className="text-xs text-subtle">
                  Use your CV details to fill in your public profile so companies can find you.
                </p>
              </div>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <button
                onClick={runSync}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink transition hover:opacity-90"
              >
                Sync now
              </button>
              <button
                onClick={() => setShowSyncPrompt(false)}
                className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-subtle transition hover:text-content"
              >
                Later
              </button>
            </div>
          </div>
        )}

        {/* Hero + search */}
        <section className="mb-10 rounded-2xl border border-line bg-raised p-8 text-center sm:p-12">
          <h1 className="text-2xl font-black tracking-tight text-content sm:text-4xl">
            Find the team where you <span className="text-accent">belong</span>.
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-subtle">
            Discover internships that match your skills and move your career forward.
          </p>

          <form onSubmit={runSearch} className="mx-auto mt-6 flex max-w-xl flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-muted px-4 py-3 focus-within:border-accent">
              <i className="bi bi-search text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Role, company, or skill"
                aria-label="Search internships"
                className="w-full bg-transparent text-sm text-content placeholder:text-faint focus:outline-none"
              />
            </div>
            <button type="submit" className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-ink transition hover:opacity-90">
              Search
            </button>
          </form>

          {!hasCv && (
            <p className="mt-4 text-xs text-subtle">
              No CV yet?{' '}
              <Link to="/cv" className="font-semibold text-accent hover:underline">
                Build or upload one
              </Link>{' '}
              to start applying.
            </p>
          )}
        </section>

        {/* Recommendations */}
        <Section
          title="Recommended for you"
          subtitle="Based on your profile and recent activity"
          action={<Link to="/user/internships" className="text-xs font-semibold text-accent hover:underline">View all →</Link>}
        >
          {loadingRec ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-40 animate-pulse rounded-xl border border-line bg-muted" />)}
            </div>
          ) : recList.length === 0 ? (
            <EmptyState
              icon="bi-stars"
              title="No recommendations yet"
              body="Browse a few internships and we'll start tailoring suggestions."
              cta={<Link to="/user/internships" className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink">Browse internships</Link>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recList.slice(0, 6).map((job) => (
                <InternshipCard
                  key={job.id}
                  job={job}
                  saved={savedIds.has(job.id)}
                  applied={hasApplied(job.id)}
                  onToggleSave={toggleSave}
                  onApply={handleApply}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Followed companies */}
        <Section title="Companies you follow" subtitle="New listings from companies on your radar">
          {followedList.length === 0 ? (
            <EmptyState
              icon="bi-building"
              title="You're not following any companies"
              body="Search for a company and follow it to see its internships here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {followedList.map((c) => (
                <Link
                  key={c.id}
                  to={`/user/internships?type=companies&company=${c.id}`}
                  className="flex items-center gap-3 rounded-xl border border-line bg-raised p-4 transition-all hover:border-accent/60"
                >
                  {c.logoUrl ? (
                    <img src={c.logoUrl} alt="" className="h-10 w-10 rounded-lg border border-line object-cover" />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-sm font-bold text-accent">
                      {(c.companyName || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-content">{c.companyName}</p>
                    <p className="truncate text-xs text-subtle">{c.industry || 'Company'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Section>

        {/* Saved preview */}
        <Section
          title="Saved internships"
          subtitle="Listings you bookmarked"
          action={<Link to="/user/applications?tab=saved" className="text-xs font-semibold text-accent hover:underline">See all →</Link>}
        >
          {savedList.length === 0 ? (
            <EmptyState
              icon="bi-bookmark"
              title="Nothing saved yet"
              body="Tap the bookmark icon on any internship to keep it here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedList.slice(0, 3).map((job) => (
                <InternshipCard
                  key={job.id}
                  job={job}
                  saved
                  applied={hasApplied(job.id)}
                  onToggleSave={toggleSave}
                  onApply={handleApply}
                  compact
                />
              ))}
            </div>
          )}
        </Section>
      </main>

      <Footer />
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}
