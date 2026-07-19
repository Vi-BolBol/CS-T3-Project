import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useApplicantAlerts from '../../hooks/useApplicantAlerts';
import { searchAll } from '../../api/companyApi';
import NotificationBell from '../shared/NotificationBell';

export default function CompanyNavbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ students: [], companies: [], internships: [] });
  const [showSuggest, setShowSuggest] = useState(false);
  const searchRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useApplicantAlerts();

  const links = [
    { label: 'Home', path: '/company/home' },
    { label: 'Dashboard', path: '/company/dashboard' },
    { label: 'Internships', path: '/company/internships', alert: true },
    // Explore is browsing (who's out there); Search is lookup (find this thing).
    { label: 'Explore', path: '/company/explore' },
  ];

  // Live suggestions across students, companies, and internships.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setSuggestions({ students: [], companies: [], internships: [] }); return; }
    const t = setTimeout(async () => {
      const res = await searchAll(q);
      if (res.success) setSuggestions(res.results);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggest(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const flat = useMemo(() => [
    ...(suggestions.internships || []).slice(0, 3).map((i) => ({
      key: `i-${i.id}`, icon: 'bi-briefcase', label: i.title,
      sub: i.company?.companyName || 'Internship', to: `/company/explore?type=internships&job=${i.id}`,
    })),
    ...(suggestions.students || []).slice(0, 3).map((s) => ({
      key: `s-${s.id}`, icon: 'bi-person', label: s.fullName || 'Student',
      sub: s.education || 'Student', to: `/company/applicant/${s.userId}/profile`,
    })),
    ...(suggestions.companies || []).slice(0, 2).map((c) => ({
      key: `c-${c.id}`, icon: 'bi-building', label: c.companyName || 'Company',
      sub: c.industry || 'Company', to: `/company/explore?type=companies&company=${c.id}`,
    })),
  ], [suggestions]);

  const runSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setShowSuggest(false);
    // Submitting goes to Explore with the query applied, not to a separate
    // results page. Explore already has the filters, the detail pane and the
    // pagination — sending the user somewhere else meant a second, weaker
    // results list and a dead end. This mirrors the student side.
    navigate(q ? `/company/explore?q=${encodeURIComponent(q)}` : '/company/explore');
  };

  const isActive = (p) => location.pathname.startsWith(p);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-line bg-raised/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/company/home" className="flex flex-shrink-0 items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">IF</span>
          <span className="hidden text-sm font-black text-content sm:inline">Internship Finder</span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive(l.path) ? 'bg-accent-soft text-accent' : 'text-subtle hover:bg-muted hover:text-content'
              }`}
            >
              {l.label}
              {l.alert && count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Search: students, companies, internships */}
        <div ref={searchRef} className="relative ml-auto hidden max-w-xs flex-1 lg:block">
          <form onSubmit={runSearch}>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-muted px-3 py-1.5 focus-within:border-accent">
              <i className="bi bi-search text-sm text-faint" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggest(true); }}
                onFocus={() => setShowSuggest(true)}
                placeholder="Search students, companies, internships"
                aria-label="Search"
                className="w-full bg-transparent text-xs text-content placeholder:text-faint focus:outline-none"
              />
            </div>
          </form>

          {showSuggest && flat.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-line bg-raised shadow-lg">
              {flat.map((s) => (
                <li key={s.key}>
                  <Link
                    to={s.to}
                    onClick={() => setShowSuggest(false)}
                    className="flex items-center gap-2 px-3 py-2 transition-colors hover:bg-muted"
                  >
                    <i className={`bi ${s.icon} text-xs text-faint`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-content">{s.label}</span>
                      <span className="block truncate text-[11px] text-subtle">{s.sub}</span>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-line">
                <button onClick={runSearch} className="w-full px-3 py-2 text-left text-[11px] font-semibold text-accent hover:bg-muted">
                  See all results for “{query}”
                </button>
              </li>
            </ul>
          )}
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex lg:ml-3">
          <NotificationBell />
          <Link
            to="/company/settings"
            aria-label="Settings"
            className={`grid h-9 w-9 place-items-center rounded-lg border border-line transition-colors ${
              isActive('/company/settings') ? 'bg-accent-soft text-accent' : 'text-subtle hover:bg-muted hover:text-content'
            }`}
          >
            <i className="bi bi-gear text-[15px]" />
          </Link>
          <Link
            to="/company/profile"
            aria-label="Company profile"
            className={`grid h-9 w-9 place-items-center rounded-full border transition-all ${
              isActive('/company/profile') ? 'border-accent' : 'border-line hover:border-faint'
            }`}
          >
            <i className="bi bi-building text-sm text-subtle" />
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-muted text-content md:hidden"
        >
          <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'} text-lg`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-raised md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            <form onSubmit={runSearch} className="mb-2">
              <div className="flex items-center gap-2 rounded-lg border border-line bg-muted px-3 py-2 focus-within:border-accent">
                <i className="bi bi-search text-sm text-faint" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search students, companies, internships"
                  className="w-full bg-transparent text-sm text-content placeholder:text-faint focus:outline-none"
                />
              </div>
            </form>
            {[...links, { label: 'Settings', path: '/company/settings' }, { label: 'Profile', path: '/company/profile' }].map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(l.path) ? 'bg-accent-soft text-accent' : 'text-subtle hover:bg-muted hover:text-content'
                }`}
              >
                {l.label}
                {l.alert && count > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-ink">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
