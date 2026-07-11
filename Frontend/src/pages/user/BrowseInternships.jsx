import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
import InternshipCard from '../../components/ui/InternshipCard';
import useInternships from '../../hooks/useInternships';
import useSavedInternships from '../../hooks/useSavedInternships';
import useMyApplications from '../../hooks/useMyApplications';
import useCvStatus from '../../hooks/useCvStatus';
import useToast from '../../hooks/useToast';
import Toast from '../../components/shared/Toast';

const WORK_ENV = [
  { value: 'all', label: 'Any environment' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const INITIAL = {
  location: '',
  workEnvironment: 'all',
  category: 'all',
  company: 'all',
  industry: 'all',
  minPay: '',
  maxPay: '',
};

export default function BrowseInternships() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [filters, setFilters] = useState(INITIAL);
  const [showFilters, setShowFilters] = useState(false);

  const { internships, fetchInternships, loading, error } = useInternships();
  const { savedInternships, fetchSaved, saveInternship, unsaveInternship } = useSavedInternships();
  const { apply, hasApplied } = useMyApplications();
  const { hasCv } = useCvStatus();
  const { message: toastMessage, showToast, clearToast } = useToast();

  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());

  useEffect(() => {
    fetchInternships();
    fetchSaved();
  }, [fetchInternships, fetchSaved]);

  useEffect(() => {
    setSavedIds(new Set(savedInternships.map((j) => j.id)));
  }, [savedInternships]);

  // Sync the box when arriving from the navbar / home search (?q=)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) setSearchQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    setAppliedIds(new Set(internships.filter((j) => hasApplied(j.id)).map((j) => j.id)));
  }, [internships, hasApplied]);

  // Filter options derived from live data, so they never go stale.
  const { categories, companies, industries } = useMemo(() => {
    const c = new Set(), co = new Set(), ind = new Set();
    internships.forEach((j) => {
      if (j.internshipCategory) c.add(j.internshipCategory);
      if (j.company?.companyName) co.add(j.company.companyName);
      if (j.company?.industry) ind.add(j.company.industry);
    });
    return {
      categories: [...c].sort(),
      companies: [...co].sort(),
      industries: [...ind].sort(),
    };
  }, [internships]);

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return internships.filter((job) => {
      if (q) {
        const haystack = [
          job.title,
          job.company?.companyName,
          job.internshipCategory,
          job.skills,
          job.location,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
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
    });
  }, [internships, searchQuery, filters]);

  const activeCount =
    (searchQuery ? 1 : 0) +
    Object.entries(filters).filter(([k, v]) => v && v !== 'all' && v !== INITIAL[k]).length;

  const submitSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery.trim() ? { q: searchQuery.trim() } : {});
  };

  const clearAll = () => {
    setSearchQuery('');
    setFilters(INITIAL);
    setSearchParams({});
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
  };

  // Apply gate: no CV -> send them to the CV page first, then come back.
  const handleApply = async (job) => {
    if (!hasCv) {
      showToast('You need a CV before applying — build or upload one first.');
      navigate(`/cv?redirect=${encodeURIComponent('/user/internships')}&reason=apply`);
      return;
    }
    const res = await apply(job);
    if (res.success) {
      setAppliedIds((prev) => new Set(prev).add(job.id));
      showToast(`Applied to ${job.title}.`);
    } else if (res.needsCv) {
      // Server says no CV on file — send them to build one.
      showToast(res.message || 'You need a CV before applying.');
      navigate(`/cv?redirect=${encodeURIComponent('/user/internships')}&reason=apply`);
    } else {
      showToast(res.message || 'Could not apply.');
    }
  };

  const set = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const selectCls =
    'w-full rounded-lg border border-line bg-muted px-3 py-2 text-xs text-content focus:border-accent focus:outline-none';

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-content">Internships</h1>
          <p className="mt-1 text-sm text-subtle">
            Browse every open listing, then narrow it down with filters.
          </p>
        </header>

        <form onSubmit={submitSearch} className="mb-6 flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-raised px-4 py-2.5 focus-within:border-accent">
            <i className="bi bi-search text-faint" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or skill"
              aria-label="Search internships"
              className="w-full bg-transparent text-sm text-content placeholder:text-faint focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <i className="bi bi-x-circle-fill text-faint hover:text-subtle" />
              </button>
            )}
          </div>

          <button type="submit" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition hover:opacity-90">
            Search
          </button>

          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-subtle transition hover:text-content lg:hidden"
          >
            <i className="bi bi-sliders" /> Filters
          </button>
        </form>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-64 lg:flex-shrink-0`}>
            <div className="sticky top-24 space-y-4 rounded-xl border border-line bg-raised p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-content">Filters</h2>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="text-xs font-semibold text-accent hover:underline">
                    Clear all
                  </button>
                )}
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
                  {companies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Company type</label>
                <select value={filters.industry} onChange={(e) => set('industry', e.target.value)} className={selectCls}>
                  <option value="all">Any industry</option>
                  {industries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Pay range ($)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" value={filters.minPay} onChange={(e) => set('minPay', e.target.value)} placeholder="Min" className={selectCls} />
                  <span className="text-faint">–</span>
                  <input type="number" min="0" value={filters.maxPay} onChange={(e) => set('maxPay', e.target.value)} placeholder="Max" className={selectCls} />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="min-w-0 flex-1">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-subtle">
                {loading ? 'Loading…' : `${results.length} internship${results.length === 1 ? '' : 's'} found`}
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
                {error}
              </div>
            )}

            {loading && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-40 animate-pulse rounded-xl border border-line bg-muted" />
                ))}
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
                <i className="bi bi-search text-3xl text-faint" />
                <p className="mt-3 text-sm font-semibold text-content">No internships match your search</p>
                <p className="mt-1 text-xs text-subtle">Try removing a filter or searching for something broader.</p>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink">
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((job) => (
                  <InternshipCard
                    key={job.id}
                    job={job}
                    saved={savedIds.has(job.id)}
                    applied={appliedIds.has(job.id)}
                    onToggleSave={toggleSave}
                    onApply={handleApply}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}
