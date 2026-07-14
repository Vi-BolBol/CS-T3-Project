import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { InternshipPane, CompanyPane, payRange } from '../components/shared/DetailPane';
import Pagination from '../components/shared/Pagination';
import { getPublicInternships, getPublicCompanies } from '../api/publicApi';

const ENV_LABEL = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' };

const WORK_ENV = [
  { value: 'all', label: 'Any environment' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const INITIAL = {
  type: 'internships',       // 'internships' | 'companies'
  location: '',
  workEnvironment: 'all',
  category: 'all',
  company: 'all',
  industry: 'all',
  minPay: '',
  maxPay: '',
};

const PAGE_SIZE = 5;   // 5 per page keeps the list readable without a scroll marathon

const selectCls =
  'w-full rounded-lg border border-line bg-muted px-3 py-2 text-xs text-content focus:border-accent focus:outline-none';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [filters, setFilters] = useState(() => ({
    ...INITIAL,
    type: searchParams.get('type') === 'companies' ? 'companies' : 'internships',
  }));
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [internships, setInternships] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // The "c" column.
  const [selected, setSelected] = useState(null);   // { kind: 'job'|'company', id }
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const [jobsRes, cosRes] = await Promise.all([getPublicInternships(), getPublicCompanies()]);
      if (!alive) return;
      if (jobsRes.success) setInternships(jobsRes.internships || []);
      if (cosRes.success) setCompanies(cosRes.companies || []);
      if (!jobsRes.success && !cosRes.success) setError(jobsRes.message || 'Could not load listings.');
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  // Deep links from elsewhere in the app: /explore?job=12 or /explore?company=3.
  useEffect(() => {
    const job = searchParams.get('job');
    const company = searchParams.get('company');
    if (job) setSelected({ kind: 'job', id: Number(job) });
    else if (company) setSelected({ kind: 'company', id: Number(company) });
  }, [searchParams]);

  const set = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const isCompanies = filters.type === 'companies';

  // Switching type clears the open detail — a company pane over an internship
  // list is just confusing.
  const setType = (type) => {
    setFilters((p) => ({ ...p, type }));
    setSelected(null);
    const next = new URLSearchParams(searchParams);
    next.set('type', type);
    next.delete('job');
    next.delete('company');
    setSearchParams(next, { replace: true });
  };

  const select = (kind, id) => {
    setSelected({ kind, id });
    setExpanded(false);   // every new selection starts collapsed — "Show more" is always there
  };

  const { categories, companyNames, industries } = useMemo(() => {
    const c = new Set(), co = new Set(), ind = new Set();
    internships.forEach((j) => {
      if (j.internshipCategory) c.add(j.internshipCategory);
      if (j.company?.companyName) co.add(j.company.companyName);
      if (j.company?.industry) ind.add(j.company.industry);
    });
    companies.forEach((x) => { if (x.industry) ind.add(x.industry); });
    return {
      categories: [...c].sort(),
      companyNames: [...co].sort(),
      industries: [...ind].sort(),
    };
  }, [internships, companies]);

  const q = searchQuery.trim().toLowerCase();

  const jobResults = useMemo(() => internships.filter((job) => {
    if (q) {
      const hay = [job.title, job.company?.companyName, job.internshipCategory, job.skills, job.location]
        .filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.location && !(job.location || '').toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.workEnvironment !== 'all' && job.workEnvironment !== filters.workEnvironment) return false;
    if (filters.category !== 'all' && job.internshipCategory !== filters.category) return false;
    if (filters.company !== 'all' && job.company?.companyName !== filters.company) return false;
    if (filters.industry !== 'all' && job.company?.industry !== filters.industry) return false;

    const min = Number(job.salaryMin ?? job.salary ?? 0);
    const max = Number(job.salaryMax ?? job.salary ?? 0);
    if (filters.minPay && max && max < Number(filters.minPay)) return false;
    if (filters.maxPay && min && min > Number(filters.maxPay)) return false;
    return true;
  }), [internships, q, filters]);

  const companyResults = useMemo(() => companies.filter((c) => {
    if (q) {
      const hay = [c.companyName, c.industry, c.location].filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.location && !(c.location || '').toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.industry !== 'all' && c.industry !== filters.industry) return false;
    return true;
  }), [companies, q, filters]);

  const results = isCompanies ? companyResults : jobResults;

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  // A filter change can shrink the result set below the current page — land on
  // page 4 of a 1-page result and you'd stare at an empty column.
  const safePage = Math.min(page, totalPages);
  const pageItems = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [searchQuery, filters]);

  // A deep link (?job=12) or a jump from a company's listing can point at an item
  // that isn't on the current page — without this you'd get a detail pane with no
  // matching card anywhere in the list.
  useEffect(() => {
    if (!selected) return;
    const idx = results.findIndex(
      (r) => r.id === selected.id && (selected.kind === 'company') === isCompanies
    );
    if (idx >= 0) setPage(Math.floor(idx / PAGE_SIZE) + 1);
  }, [selected, results, isCompanies]);

  const activeCount =
    (searchQuery ? 1 : 0) +
    Object.entries(filters).filter(([k, v]) => k !== 'type' && v && v !== 'all' && v !== INITIAL[k]).length;

  const clearAll = () => {
    setSearchQuery('');
    setFilters({ ...INITIAL, type: filters.type });
  };

  const selectedJob = selected?.kind === 'job' ? internships.find((j) => j.id === selected.id) : null;
  const selectedCompany = selected?.kind === 'company' ? companies.find((c) => c.id === selected.id) : null;
  const selectedCompanyListings = selectedCompany
    ? internships.filter((j) => j.company?.id === selectedCompany.id)
    : [];

  const hasDetail = Boolean(selectedJob || selectedCompany);

  /* The apply gate. Browsing is public; POST /api/applications is student-only,
     so we say so before the click rather than after a 401.

     Sign up is the PRIMARY action: someone who reached a listing detail on the
     public site almost certainly has no account yet — pushing them at a login
     form they can't fill is a dead end. Log in stays available for the minority
     who do have one. Both carry ?next= so they come back to this exact listing. */
  const applyGate = (jobId) => {
    const next = encodeURIComponent(`/explore?job=${jobId}`);
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate(`/signup?next=${next}`)}
          className="w-full rounded-lg bg-accent px-3 py-2.5 text-xs font-bold text-accent-ink transition hover:brightness-95"
        >
          Sign up to apply
        </button>
        <p className="text-center text-[11px] text-subtle">
          Applying needs a student account — it takes a minute.
        </p>
        <p className="text-center text-[11px] text-faint">
          Already have one?{' '}
          <button
            type="button"
            onClick={() => navigate(`/login?next=${next}`)}
            className="font-bold text-accent hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:h-screen lg:min-h-0 lg:overflow-hidden">
      <Header />

      {/* lg+: the page itself never scrolls. Filters, results, and detail each
          scroll independently inside their own column. Below lg it falls back to
          normal document scrolling, which is what you want on a phone. */}
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-6 sm:px-6 lg:min-h-0 lg:px-8">
        <header className="mb-4 flex-shrink-0">
          <h1 className="text-2xl font-black tracking-tight text-content">Explore</h1>
          <p className="mt-1 text-sm text-subtle">
            Search internships and companies. Anyone can browse — you only need an account to apply.
          </p>
        </header>

        <form
          onSubmit={(e) => { e.preventDefault(); }}
          className="mb-4 flex flex-shrink-0 flex-col gap-2 sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-raised px-4 py-2.5 focus-within:border-accent">
            <i className="bi bi-search text-faint" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, skill, or industry"
              aria-label="Search internships and companies"
              className="w-full bg-transparent text-sm text-content placeholder:text-faint focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <i className="bi bi-x-circle-fill text-faint hover:text-subtle" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-subtle transition hover:text-content lg:hidden"
          >
            <i className="bi bi-sliders" /> Filters
          </button>
        </form>

        <div className="flex flex-1 flex-col gap-5 lg:min-h-0 lg:flex-row">
          {/* (a) Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-60 lg:flex-shrink-0`}>
            <div className="custom-scrollbar h-full space-y-4 overflow-y-auto rounded-xl border border-line bg-raised p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-content">Filters</h2>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="text-xs font-semibold text-accent hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* One list, one type switch — no second nav tab. */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Show</label>
                <select value={filters.type} onChange={(e) => setType(e.target.value)} className={selectCls}>
                  <option value="internships">Internships</option>
                  <option value="companies">Companies</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Location</label>
                <input
                  value={filters.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g. Phnom Penh"
                  className={selectCls}
                />
              </div>

              {!isCompanies && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Work environment</label>
                    <select value={filters.workEnvironment} onChange={(e) => set('workEnvironment', e.target.value)} className={selectCls}>
                      {WORK_ENV.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Internship type</label>
                    <select value={filters.category} onChange={(e) => set('category', e.target.value)} className={selectCls}>
                      <option value="all">Any type</option>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Company</label>
                    <select value={filters.company} onChange={(e) => set('company', e.target.value)} className={selectCls}>
                      <option value="all">Any company</option>
                      {companyNames.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Company type</label>
                <select value={filters.industry} onChange={(e) => set('industry', e.target.value)} className={selectCls}>
                  <option value="all">Any industry</option>
                  {industries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {!isCompanies && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Pay range ($)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" value={filters.minPay} onChange={(e) => set('minPay', e.target.value)} placeholder="Min" className={selectCls} />
                    <span className="text-faint">–</span>
                    <input type="number" min="0" value={filters.maxPay} onChange={(e) => set('maxPay', e.target.value)} placeholder="Max" className={selectCls} />
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* (b) Results */}
          <section className="flex min-w-0 flex-1 flex-col lg:min-h-0">
            <p className="mb-3 flex-shrink-0 text-xs text-subtle">
              {loading
                ? 'Loading…'
                : `${results.length} ${isCompanies ? 'company' : 'internship'}${results.length === 1 ? '' : 's'} found`}
            </p>

            <div className="custom-scrollbar min-h-0 flex-1 lg:overflow-y-auto lg:pr-1">
            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{error}</div>
            )}

            {loading && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-36 animate-pulse rounded-xl border border-line bg-muted" />
                ))}
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
                <i className="bi bi-search text-3xl text-faint" />
                <p className="mt-3 text-sm font-semibold text-content">Nothing matches your search</p>
                <p className="mt-1 text-xs text-subtle">Try removing a filter or searching for something broader.</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className={`grid gap-4 ${hasDetail ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
                {isCompanies
                  ? pageItems.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => select('company', c.id)}
                        className={`flex flex-col rounded-xl border bg-raised p-4 text-left transition-all hover:border-accent/60 hover:shadow-sm ${
                          selected?.kind === 'company' && selected.id === c.id ? 'border-accent' : 'border-line'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {c.logoUrl ? (
                            <img src={c.logoUrl} alt="" className="h-11 w-11 flex-shrink-0 rounded-lg border border-line object-cover" />
                          ) : (
                            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-sm font-bold text-accent">
                              {(c.companyName || '?').charAt(0).toUpperCase()}
                            </span>
                          )}
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-content">{c.companyName || 'Unnamed company'}</h3>
                            <p className="truncate text-xs text-subtle">{c.industry || 'Industry not set'}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[11px]">
                          <span className="text-subtle"><i className="bi bi-geo-alt mr-1" />{c.location || '—'}</span>
                          <span className="font-bold text-accent">{c._count?.internships ?? 0} open</span>
                        </div>
                      </button>
                    ))
                  : pageItems.map((job) => (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => select('job', job.id)}
                        className={`flex flex-col rounded-xl border bg-raised p-4 text-left transition-all hover:border-accent/60 hover:shadow-sm ${
                          selected?.kind === 'job' && selected.id === job.id ? 'border-accent' : 'border-line'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {job.company?.logoUrl ? (
                            <img src={job.company.logoUrl} alt="" className="h-11 w-11 flex-shrink-0 rounded-lg border border-line object-cover" />
                          ) : (
                            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-sm font-bold text-accent">
                              {(job.company?.companyName || '?').charAt(0).toUpperCase()}
                            </span>
                          )}
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-content">{job.title}</h3>
                            <p className="truncate text-xs text-subtle">{job.company?.companyName || 'Unknown company'}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-subtle">
                          <span className="rounded-md bg-muted px-2 py-0.5">
                            <i className="bi bi-geo-alt mr-1" />{job.location || 'Not specified'}
                          </span>
                          {job.workEnvironment && (
                            <span className="rounded-md bg-muted px-2 py-0.5">
                              {ENV_LABEL[job.workEnvironment] || job.workEnvironment}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                          <span className="text-xs font-semibold text-accent">{payRange(job)}</span>
                          <span className="text-xs font-bold text-subtle">Details →</span>
                        </div>
                      </button>
                    ))}
              </div>
            )}
            </div>

            {/* Pages instead of an endless scroll. */}
            <div className="flex-shrink-0 pt-4">
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
              {results.length > 0 && (
                <p className="mt-2 text-center text-[11px] text-faint">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, results.length)} of {results.length}
                </p>
              )}
            </div>
          </section>

          {/* (c) Detail — appears beside the list, never replaces the page */}
          {hasDetail && (
            <section className="max-h-[75vh] lg:max-h-none lg:h-full lg:w-[34rem] lg:flex-shrink-0 xl:w-[40rem]">
              {selectedJob && (
                <InternshipPane
                  job={selectedJob}
                  expanded={expanded}
                  onToggleExpand={() => setExpanded((v) => !v)}
                  onClose={() => setSelected(null)}
                  actions={applyGate(selectedJob.id)}
                />
              )}
              {selectedCompany && (
                <CompanyPane
                  company={selectedCompany}
                  listings={selectedCompanyListings}
                  expanded={expanded}
                  onToggleExpand={() => setExpanded((v) => !v)}
                  onClose={() => setSelected(null)}
                  onSelectJob={(job) => { setFilters((p) => ({ ...p, type: 'internships' })); select('job', job.id); }}
                />
              )}
            </section>
          )}
        </div>
      </main>

    </div>
  );
}
