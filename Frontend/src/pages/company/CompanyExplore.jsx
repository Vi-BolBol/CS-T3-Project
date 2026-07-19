import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InternshipPane, CompanyPane, StudentPane, payRange } from '../../components/shared/DetailPane';
import Pagination from '../../components/shared/Pagination';
import { getStudentDirectory } from '../../api/companyApi';
import { getPublicInternships, getPublicCompanies } from '../../api/publicApi';

/*
  Explore, for companies.

  Deliberately the same three-column master-detail shape as the student Explore —
  filters | results | detail — because a company browsing the platform is doing
  the same job a student is, and there was no reason for it to feel like a
  different product. The differences are only the ones that matter:

    - a third type, Students, which the public Explore has no business showing
    - every link stays inside /company/*, so the company shell (and its navbar)
      is never swapped out for the signed-out public one

  This is separate from Company Search on purpose. Search is lookup: type a
  thing, get hits. Explore is browsing: everything is listed before you type.
*/

const ENV_LABEL = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' };

const WORK_ENV = [
  { value: 'all', label: 'Any environment' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const TYPES = [
  { value: 'internships', label: 'Internships', noun: 'internship' },
  { value: 'companies',   label: 'Companies',   noun: 'company', plural: 'companies' },
  { value: 'students',    label: 'Students',    noun: 'student' },
];

const INITIAL = {
  type: 'companies',      // companies first: affiliating is the reason a company explores
  location: '',
  workEnvironment: 'all',
  category: 'all',
  company: 'all',
  industry: 'all',
  minPay: '',
  maxPay: '',
  skill: '',
  education: 'all',
};

const PAGE_SIZE = 5;

const selectCls =
  'w-full rounded-lg border border-line bg-muted px-3 py-2 text-xs text-content focus:border-accent focus:outline-none';

export default function CompanyExplore() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  // Arriving from the navbar search: ?q= is the query, and it should apply
  // immediately rather than needing a re-type.
  const [filters, setFilters] = useState(() => ({
    ...INITIAL,
    type: TYPES.some((t) => t.value === searchParams.get('type'))
      ? searchParams.get('type')
      : INITIAL.type,
  }));
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [internships, setInternships] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selected, setSelected] = useState(null);   // { kind: 'job'|'company'|'student', id }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const [jobsRes, cosRes, stuRes] = await Promise.all([
        getPublicInternships(),
        getPublicCompanies(),
        getStudentDirectory(),
      ]);
      if (!alive) return;
      if (jobsRes.success) setInternships(jobsRes.internships || []);
      if (cosRes.success) setCompanies(cosRes.companies || []);
      if (stuRes.success) setStudents(stuRes.students || []);
      if (!jobsRes.success && !cosRes.success && !stuRes.success) {
        setError(jobsRes.message || 'Could not load the directory.');
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) setSearchQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Deep links from the navbar search and the home page.
  useEffect(() => {
    const job = searchParams.get('job');
    const company = searchParams.get('company');
    const student = searchParams.get('student');
    if (job) setSelected({ kind: 'job', id: Number(job) });
    else if (company) setSelected({ kind: 'company', id: Number(company) });
    else if (student) setSelected({ kind: 'student', id: Number(student) });
  }, [searchParams]);

  const set = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const isCompanies = filters.type === 'companies';
  const isStudents = filters.type === 'students';
  const isJobs = filters.type === 'internships';

  // Switching type clears the open detail — a company pane over a student list
  // is just confusing.
  const setType = (type) => {
    setFilters((p) => ({ ...p, type }));
    setSelected(null);
    const next = new URLSearchParams(searchParams);
    next.set('type', type);
    next.delete('job');
    next.delete('company');
    next.delete('student');
    setSearchParams(next, { replace: true });
  };

  const select = (kind, id) => setSelected({ kind, id });

  const { categories, companyNames, industries, educations } = useMemo(() => {
    const c = new Set(), co = new Set(), ind = new Set(), ed = new Set();
    internships.forEach((j) => {
      if (j.internshipCategory) c.add(j.internshipCategory);
      if (j.company?.companyName) co.add(j.company.companyName);
      if (j.company?.industry) ind.add(j.company.industry);
    });
    companies.forEach((x) => { if (x.industry) ind.add(x.industry); });
    students.forEach((s) => { if (s.education) ed.add(s.education); });
    return {
      categories: [...c].sort(),
      companyNames: [...co].sort(),
      industries: [...ind].sort(),
      educations: [...ed].sort(),
    };
  }, [internships, companies, students]);

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

  const studentResults = useMemo(() => students.filter((s) => {
    if (q) {
      const hay = [s.fullName, s.education, s.skills, s.bio].filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.education !== 'all' && s.education !== filters.education) return false;
    if (filters.skill && !(s.skills || '').toLowerCase().includes(filters.skill.toLowerCase())) return false;
    return true;
  }), [students, q, filters]);

  const results = isCompanies ? companyResults : isStudents ? studentResults : jobResults;
  const typeMeta = TYPES.find((t) => t.value === filters.type) || TYPES[0];

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  // A filter change can shrink the result set below the current page.
  const safePage = Math.min(page, totalPages);
  const pageItems = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [searchQuery, filters]);

  // A deep link can point at an item that isn't on the current page.
  useEffect(() => {
    if (!selected) return;
    const kindMatches =
      (selected.kind === 'company' && isCompanies) ||
      (selected.kind === 'student' && isStudents) ||
      (selected.kind === 'job' && isJobs);
    if (!kindMatches) return;
    const idx = results.findIndex((r) => r.id === selected.id);
    if (idx >= 0) setPage(Math.floor(idx / PAGE_SIZE) + 1);
  }, [selected, results, isCompanies, isStudents, isJobs]);

  const activeCount =
    (searchQuery ? 1 : 0) +
    Object.entries(filters).filter(([k, v]) => k !== 'type' && v && v !== 'all' && v !== INITIAL[k]).length;

  const clearAll = () => {
    setSearchQuery('');
    setFilters({ ...INITIAL, type: filters.type });
  };

  const selectedJob = selected?.kind === 'job' ? internships.find((j) => j.id === selected.id) : null;
  const selectedCompany = selected?.kind === 'company' ? companies.find((c) => c.id === selected.id) : null;
  const selectedStudent = selected?.kind === 'student' ? students.find((s) => s.id === selected.id) : null;
  const selectedCompanyListings = selectedCompany
    ? internships.filter((j) => j.company?.id === selectedCompany.id)
    : [];

  const hasDetail = Boolean(selectedJob || selectedCompany || selectedStudent);

  const countLabel = loading
    ? 'Loading…'
    : `${results.length} ${
        results.length === 1
          ? typeMeta.noun
          : typeMeta.plural || `${typeMeta.noun}s`
      } found`;

  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-black tracking-tight text-content">Explore</h1>
        <p className="mt-1 text-sm text-subtle">
          Browse companies to affiliate with, discover student talent, and see what
          else is being hired for.
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
            placeholder="Search by role, company, skill, industry, or name"
            aria-label="Search the platform"
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

      <div className="flex flex-1 flex-col gap-5 lg:h-[calc(100vh-19rem)] lg:min-h-[26rem] lg:flex-row">
        {/* (a) Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-56 lg:flex-shrink-0`}>
          <div className="custom-scrollbar h-full space-y-4 overflow-y-auto rounded-xl border border-line bg-raised p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-content">Filters</h2>
              {activeCount > 0 && (
                <button onClick={clearAll} className="text-xs font-semibold text-accent hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-subtle">Show</label>
              <select value={filters.type} onChange={(e) => setType(e.target.value)} className={selectCls}>
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Students have no location column on their profile, so offering the
                filter there would silently match nothing. */}
            {!isStudents && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Location</label>
                <input
                  value={filters.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g. Phnom Penh"
                  className={selectCls}
                />
              </div>
            )}

            {isJobs && (
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

            {!isStudents && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Company type</label>
                <select value={filters.industry} onChange={(e) => set('industry', e.target.value)} className={selectCls}>
                  <option value="all">Any industry</option>
                  {industries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {isJobs && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-subtle">Pay range ($)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" value={filters.minPay} onChange={(e) => set('minPay', e.target.value)} placeholder="Min" className={selectCls} />
                  <span className="text-faint">–</span>
                  <input type="number" min="0" value={filters.maxPay} onChange={(e) => set('maxPay', e.target.value)} placeholder="Max" className={selectCls} />
                </div>
              </div>
            )}

            {isStudents && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Education</label>
                  <select value={filters.education} onChange={(e) => set('education', e.target.value)} className={selectCls}>
                    <option value="all">Any education</option>
                    {educations.map((e2) => <option key={e2} value={e2}>{e2}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Skill</label>
                  <input
                    value={filters.skill}
                    onChange={(e) => set('skill', e.target.value)}
                    placeholder="e.g. React"
                    className={selectCls}
                  />
                </div>
              </>
            )}
          </div>
        </aside>

        {/* (b) Results */}
        <section className="flex min-w-0 flex-1 flex-col lg:min-h-0">
          <p className="mb-3 flex-shrink-0 text-xs text-subtle">{countLabel}</p>

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
                {isCompanies && pageItems.map((c) => (
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
                ))}

                {isStudents && pageItems.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => select('student', s.id)}
                    className={`flex flex-col rounded-xl border bg-raised p-4 text-left transition-all hover:border-accent/60 hover:shadow-sm ${
                      selected?.kind === 'student' && selected.id === s.id ? 'border-accent' : 'border-line'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {s.profileImage ? (
                        <img src={s.profileImage} alt="" className="h-11 w-11 flex-shrink-0 rounded-lg border border-line object-cover" />
                      ) : (
                        <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-sm font-bold text-accent">
                          {(s.fullName || '?').charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-content">{s.fullName || 'Student'}</h3>
                        <p className="truncate text-xs text-subtle">{s.education || 'Education not set'}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-subtle">
                      {(s.skills || '').split(',').map((sk) => sk.trim()).filter(Boolean).slice(0, 3).map((sk) => (
                        <span key={sk} className="rounded-md bg-muted px-2 py-0.5">{sk}</span>
                      ))}
                      {!s.skills && <span className="text-faint">No skills listed</span>}
                    </div>
                  </button>
                ))}

                {isJobs && pageItems.map((job) => (
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

        {/* (c) Detail — every link below stays under /company/*, so the company
            shell and its navbar are never replaced by the public one. */}
        {hasDetail && (
          <section className="max-h-[75vh] lg:max-h-none lg:h-full lg:w-[42rem] lg:flex-shrink-0 xl:w-[48rem]">
            {selectedJob && (
              <InternshipPane
                job={selectedJob}
                onSelectCompany={(c) => { setFilters((p) => ({ ...p, type: "companies" })); select("company", c.id); }}
                detailTo={`/company/listing/${selectedJob.id}`}
                onClose={() => setSelected(null)}
              />
            )}
            {selectedCompany && (
              <CompanyPane
                company={selectedCompany}
                listings={selectedCompanyListings}
                onClose={() => setSelected(null)}
                onSelectJob={(job) => { setFilters((p) => ({ ...p, type: 'internships' })); select('job', job.id); }}
              />
            )}
            {selectedStudent && (
              <StudentPane
                student={selectedStudent}
                profileTo={`/company/applicant/${selectedStudent.userId || selectedStudent.id}/profile`}
                onClose={() => setSelected(null)}
              />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
