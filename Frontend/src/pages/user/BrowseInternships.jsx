import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
import JobCard from '../../components/ui/JobCard';
import useInternships from '../../hooks/useInternships';
import useSavedInternships from '../../hooks/useSavedInternships';

const WORK_ENV_OPTIONS = [
  { value: 'all', label: 'Any Work Environment' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const INITIAL_FILTERS = {
  location: '',
  workEnvironment: 'all',
  minPay: '',
  maxPay: '',
};

export default function BrowseInternships() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const { internships, fetchInternships, loading, error } = useInternships();
  const { savedInternships, fetchSaved, saveInternship, unsaveInternship } = useSavedInternships();
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    fetchInternships();
    fetchSaved();
  }, [fetchInternships, fetchSaved]);

  useEffect(() => {
    setSavedIds(new Set(savedInternships.map((job) => job.id)));
  }, [savedInternships]);

  const toggleSave = async (jobId) => {
    if (savedIds.has(jobId)) {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
      await unsaveInternship(jobId);
    } else {
      setSavedIds((prev) => new Set(prev).add(jobId));
      await saveInternship(jobId);
    }
  };

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters(INITIAL_FILTERS);
  };

  const hasActiveFilters =
    searchQuery ||
    filters.location ||
    filters.workEnvironment !== 'all' ||
    filters.minPay ||
    filters.maxPay;

  const filteredInternships = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const locationQuery = filters.location.trim().toLowerCase();
    const minPay = filters.minPay ? Number(filters.minPay) : null;
    const maxPay = filters.maxPay ? Number(filters.maxPay) : null;

    return internships.filter((job) => {
      // Keyword search — title, category, skills, company, industry
      if (query) {
        const haystack = [
          job.title,
          job.internshipCategory,
          job.skills,
          job.company?.companyName,
          job.company?.industry,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      // Location filter
      if (locationQuery && !(job.location || '').toLowerCase().includes(locationQuery)) {
        return false;
      }

      // Work environment filter
      if (
        filters.workEnvironment !== 'all' &&
        (job.workEnvironment || '').toLowerCase() !== filters.workEnvironment
      ) {
        return false;
      }

      // Pay range filter — compare against the job's own range (salaryMin/salaryMax),
      // falling back to the flat `salary` field when a range isn't set.
      if (minPay !== null || maxPay !== null) {
        const jobMin = job.salaryMin != null ? Number(job.salaryMin) : Number(job.salary) || null;
        const jobMax = job.salaryMax != null ? Number(job.salaryMax) : Number(job.salary) || null;

        if (jobMin == null && jobMax == null) return false;
        if (minPay !== null && (jobMax ?? jobMin) < minPay) return false;
        if (maxPay !== null && (jobMin ?? jobMax) > maxPay) return false;
      }

      return true;
    });
  }, [internships, searchQuery, filters]);

  return (
    <div className="min-h-screen bg-[#070B19]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4">
        {/* Big Search + Filters */}
        <div className="mt-[90px] mb-10">
          <h1 className="text-2xl font-extrabold text-white mb-4">Browse Internships</h1>

          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search internships by title, skill, or company..."
              className="w-full rounded-2xl border border-slate-800 bg-[#131c35] pl-14 pr-6 py-6 text-lg text-white placeholder-slate-500 focus:border-[#10b981] focus:outline-none focus:ring-1 focus:ring-[#10b981] transition shadow-2xl"
            />
          </div>

          {/* Filter Row */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              placeholder="Location"
              className="flex-1 min-w-[160px] rounded-xl border border-slate-800 bg-[#131c35] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#10b981] focus:outline-none transition"
            />

            <select
              value={filters.workEnvironment}
              onChange={(e) => updateFilter('workEnvironment', e.target.value)}
              className="rounded-xl border border-slate-800 bg-[#131c35] px-4 py-3 text-sm text-white focus:border-[#10b981] focus:outline-none transition"
            >
              {WORK_ENV_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={filters.minPay}
              onChange={(e) => updateFilter('minPay', e.target.value)}
              placeholder="Min Pay ($/mo)"
              className="w-40 rounded-xl border border-slate-800 bg-[#131c35] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#10b981] focus:outline-none transition"
            />

            <input
              type="number"
              value={filters.maxPay}
              onChange={(e) => updateFilter('maxPay', e.target.value)}
              placeholder="Max Pay ($/mo)"
              className="w-40 rounded-xl border border-slate-800 bg-[#131c35] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#10b981] focus:outline-none transition"
            />

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 rounded-xl text-sm text-[#10b981] hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {hasActiveFilters ? `${filteredInternships.length} Results` : 'Available Roles'}
            </h2>
          </div>

          {loading && (
            <div className="text-center py-16 text-sm text-slate-400">Loading internships…</div>
          )}

          {!loading && error && (
            <div className="text-center py-16 rounded-2xl border border-rose-500/20 bg-rose-500/5">
              <p className="text-sm text-rose-400 font-medium">{error}</p>
              <button
                onClick={fetchInternships}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#10b981] text-[#070B19] hover:bg-emerald-400 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredInternships.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-800">
              <p className="text-sm text-slate-300 font-semibold">No internships found</p>
              <p className="text-xs text-slate-500 mt-1">
                {hasActiveFilters ? 'Try adjusting your search or filters.' : 'Check back soon for new opportunities.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredInternships.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInternships.map((job) => (
                <div key={job.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSave(job.id);
                    }}
                    className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-[#070B19]/80 border border-white/10 flex items-center justify-center text-sm hover:border-[#10b981] transition"
                    title={savedIds.has(job.id) ? 'Remove from saved' : 'Save internship'}
                  >
                    {savedIds.has(job.id) ? '💚' : '🤍'}
                  </button>
                  <Link to={`/company/${job.companyId}`}>
                    <JobCard
                      title={job.title}
                      company={job.company?.companyName}
                      location={job.location}
                      type={job.workEnvironment}
                      salary={
                        job.salaryMin && job.salaryMax
                          ? `$${job.salaryMin}-$${job.salaryMax}/mo`
                          : job.salary
                          ? `$${job.salary}/mo`
                          : 'Not disclosed'
                      }
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
