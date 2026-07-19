import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAll } from '../../api/companyApi';

const TABS = [
  { id: 'internships', label: 'Internships', icon: 'bi-briefcase' },
  { id: 'students', label: 'Students', icon: 'bi-person' },
  { id: 'companies', label: 'Companies', icon: 'bi-building' },
];

export default function CompanySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState({ students: [], companies: [], internships: [] });
  const [tab, setTab] = useState('internships');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (!q || q.trim().length < 2) return;
    setQuery(q);
    setLoading(true);
    (async () => {
      const res = await searchAll(q);
      if (res.success) setResults(res.results);
      setLoading(false);
    })();
  }, [searchParams]);

  const submit = (e) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  const counts = {
    internships: results.internships?.length || 0,
    students: results.students?.length || 0,
    companies: results.companies?.length || 0,
  };

  return (
    <div className="flex flex-1 flex-col bg-surface">

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-1 text-2xl font-black tracking-tight text-content">Search</h1>
        <p className="mb-6 text-sm text-subtle">Find students, other companies, or internships.</p>

        <form onSubmit={submit} className="mb-6 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-raised px-4 py-2.5 focus-within:border-accent">
            <i className="bi bi-search text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, skill, industry, or role"
              className="w-full bg-transparent text-sm text-content placeholder:text-faint focus:outline-none"
            />
          </div>
          <button type="submit" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition hover:opacity-90">
            Search
          </button>
        </form>

        <div className="mb-4 flex gap-1 rounded-xl border border-line bg-raised p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === t.id ? 'bg-accent-soft text-accent' : 'text-subtle hover:bg-muted hover:text-content'
              }`}
            >
              <i className={`bi ${t.icon}`} /> {t.label} ({counts[t.id]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-48 animate-pulse rounded-xl border border-line bg-muted" />
        ) : counts[tab] === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
            <i className="bi bi-search text-3xl text-faint" />
            <p className="mt-3 text-sm font-semibold text-content">
              {query.trim().length < 2 ? 'Type at least 2 characters' : 'No matches'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-raised">
            {tab === 'internships' && results.internships.map((i) => (
              <li key={i.id}>
                <Link to={`/company/explore?type=internships&job=${i.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
                  <i className="bi bi-briefcase text-faint" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-content">{i.title}</p>
                    <p className="truncate text-xs text-subtle">
                      {i.company?.companyName} {i.location ? `· ${i.location}` : ''}
                    </p>
                  </div>
                </Link>
              </li>
            ))}

            {tab === 'students' && results.students.map((s) => (
              <li key={s.id}>
                <Link to={`/company/applicant/${s.userId}/profile`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
                  {s.profileImage ? (
                    <img src={s.profileImage} alt="" className="h-9 w-9 rounded-full border border-line object-cover" />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                      {(s.fullName || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-content">{s.fullName || 'Student'}</p>
                    <p className="truncate text-xs text-subtle">{s.skills || s.education || 'Student'}</p>
                  </div>
                </Link>
              </li>
            ))}

            {tab === 'companies' && results.companies.map((c) => (
              <li key={c.id}>
                {/* Whole row is clickable, but an explicit label makes it
                    obvious the destination is the company's profile. */}
                <Link
                  to={`/company/explore?type=companies&company=${c.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                >
                  {c.logoUrl ? (
                    <img src={c.logoUrl} alt="" className="h-9 w-9 rounded-lg border border-line object-cover" />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-xs font-bold text-accent">
                      {(c.companyName || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-content">{c.companyName}</p>
                    <p className="truncate text-xs text-subtle">
                      {c.industry || 'Company'} {c.location ? `· ${c.location}` : ''}
                    </p>
                  </div>
                  <span className="flex-shrink-0 rounded-lg border border-line px-2.5 py-1 text-[11px] font-semibold text-accent">
                    View profile
                  </span>
                  <div className="hidden">
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
