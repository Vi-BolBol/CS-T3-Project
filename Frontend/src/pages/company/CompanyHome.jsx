import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanyNavbar from '../../components/layout/CompanyNavbar';
import Footer from '../../components/layout/CompanyFooter';
import { getMyStats, getConnections } from '../../api/companyApi';

const ONBOARD_KEY = 'if-company-onboarded';

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-line bg-raised p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-subtle">{label}</p>
        <i className={`bi ${icon} text-accent`} />
      </div>
      <p className="mt-2 text-2xl font-black text-content">{value ?? 0}</p>
    </div>
  );
}

export default function CompanyHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOnboard, setShowOnboard] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, c] = await Promise.all([getMyStats(), getConnections()]);
      if (s.success) { setStats(s.stats); setProfile(s.profile); }
      else setError(s.message);
      if (c.success) setConnections(c.companies || []);
      setLoading(false);

      // A brand-new company (no listings, never prompted) is asked whether to
      // post one now. Answering "no" leaves them on an empty dashboard.
      const seen = localStorage.getItem(ONBOARD_KEY);
      if (s.success && s.stats.internships === 0 && !seen) setShowOnboard(true);
    })();
  }, []);

  const dismissOnboard = (goCreate) => {
    localStorage.setItem(ONBOARD_KEY, '1');
    setShowOnboard(false);
    if (goCreate) navigate('/company/create-internship');
    else navigate('/company/dashboard');
  };

  const maxApplicants = Math.max(1, ...(stats?.perInternship || []).map((i) => i.applicants));

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <CompanyNavbar />

      {/* New-company prompt */}
      {showOnboard && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-raised p-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent-soft">
              <i className="bi bi-rocket-takeoff text-xl text-accent" />
            </span>
            <h2 className="mt-4 text-lg font-black text-content">Welcome! Post your first internship?</h2>
            <p className="mt-1 text-sm text-subtle">
              You don't have any listings yet. Create one now, or set it up later from your dashboard.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => dismissOnboard(true)}
                className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition hover:opacity-90"
              >
                Yes, create one
              </button>
              <button
                onClick={() => dismissOnboard(false)}
                className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-subtle transition hover:text-content"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{error}</div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: company profile card */}
          <aside className="lg:w-72 lg:flex-shrink-0">
            <div className="sticky top-24 rounded-xl border border-line bg-raised p-5 text-center">
              {profile?.logoUrl ? (
                <img src={profile.logoUrl} alt="" className="mx-auto h-20 w-20 rounded-xl border border-line object-cover" />
              ) : (
                <span className="mx-auto grid h-20 w-20 place-items-center rounded-xl bg-accent-soft text-2xl font-black text-accent">
                  {(profile?.companyName || 'C').charAt(0).toUpperCase()}
                </span>
              )}

              <h2 className="mt-3 truncate text-base font-black text-content">
                {profile?.companyName || 'Your company'}
              </h2>
              <p className="text-xs text-subtle">{profile?.industry || 'Add an industry'}</p>

              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-left">
                <div className="flex items-center gap-2 text-xs">
                  <i className="bi bi-geo-alt text-faint" />
                  <dd className="truncate text-subtle">{profile?.location || 'Add a location'}</dd>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <i className="bi bi-people text-faint" />
                  <dd className="text-subtle">
                    {profile?.employeeCount ? `${profile.employeeCount} employees` : 'Add headcount'}
                  </dd>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <i className="bi bi-briefcase text-faint" />
                  <dd className="text-subtle">{stats?.internships ?? 0} listings posted</dd>
                </div>
              </dl>

              <Link
                to="/company/profile"
                className="mt-4 block rounded-lg border border-line px-3 py-2 text-xs font-semibold text-subtle transition hover:text-content"
              >
                Edit profile
              </Link>
            </div>
          </aside>

          {/* Right: stats, analytics, connections */}
          <div className="min-w-0 flex-1">
            <header className="mb-6">
              <h1 className="text-2xl font-black tracking-tight text-content">
                Welcome back{profile?.companyName ? `, ${profile.companyName}` : ''}
              </h1>
              <p className="mt-1 text-sm text-subtle">Your listings and how candidates are responding.</p>
            </header>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl border border-line bg-muted" />)}
              </div>
            ) : (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat label="Active listings" value={stats?.openInternships} icon="bi-briefcase-fill" />
                  <Stat label="Total applicants" value={stats?.applications} icon="bi-people-fill" />
                  <Stat label="Awaiting review" value={stats?.pending} icon="bi-hourglass-split" />
                  <Stat label="Accepted" value={stats?.accepted} icon="bi-check-circle-fill" />
                </div>

                {/* Analytics: applications per listing */}
                <section className="mb-8">
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <h2 className="text-lg font-black text-content">Applications per listing</h2>
                      <p className="text-xs text-subtle">How much interest each internship is attracting.</p>
                    </div>
                    <Link to="/company/internships" className="text-xs font-semibold text-accent hover:underline">
                      Review applicants →
                    </Link>
                  </div>

                  {!stats?.perInternship?.length ? (
                    <div className="rounded-xl border border-dashed border-line bg-raised py-12 text-center">
                      <i className="bi bi-bar-chart text-2xl text-faint" />
                      <p className="mt-2 text-sm font-semibold text-content">No listings yet</p>
                      <p className="mt-1 text-xs text-subtle">Post an internship and analytics will appear here.</p>
                      <Link to="/company/create-internship" className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink">
                        Post an internship
                      </Link>
                    </div>
                  ) : (
                    <ul className="space-y-2 rounded-xl border border-line bg-raised p-4">
                      {stats.perInternship.map((i) => (
                        <li key={i.id}>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <Link to="/company/internships" className="truncate font-semibold text-content hover:text-accent">
                              {i.title}
                            </Link>
                            <span className="ml-3 flex-shrink-0 text-subtle">
                              {i.applicants} applicant{i.applicants === 1 ? '' : 's'}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-accent transition-all"
                              style={{ width: `${(i.applicants / maxApplicants) * 100}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Connections */}
                <section>
                  <h2 className="mb-3 text-lg font-black text-content">Companies on the platform</h2>
                  {connections.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-line bg-raised py-10 text-center">
                      <p className="text-sm text-subtle">No other companies yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {connections.map((c) => (
                        <Link
                          key={c.id}
                          to={`/explore?type=companies&company=${c.id}`}
                          className="flex items-center gap-3 rounded-xl border border-line bg-raised p-3 transition hover:border-accent/60"
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
                            <p className="truncate text-xs text-subtle">
                              {c.industry || 'Company'} · {c._count?.internships ?? 0} listings
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
