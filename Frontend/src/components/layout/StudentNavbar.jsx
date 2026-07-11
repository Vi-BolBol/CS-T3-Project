import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useApplicationAlerts from '../../hooks/useApplicationAlerts';
import useInternships from '../../hooks/useInternships';

export default function StudentNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { count: alertCount } = useApplicationAlerts();
  const { internships, fetchInternships } = useInternships();
  const [showSuggest, setShowSuggest] = useState(false);
  const searchRef = useRef(null);

  // Public endpoint — no auth needed, so this is safe to load in the nav.
  useEffect(() => { fetchInternships(); }, [fetchInternships]);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggest(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Match internship TITLES (and company names) as you type.
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !Array.isArray(internships)) return [];
    return internships
      .filter((j) =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.company?.companyName || '').toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, internships]);

  const pickSuggestion = (job) => {
    setShowSuggest(false);
    setQuery(job.title);
    navigate(`/user/internships?q=${encodeURIComponent(job.title)}`);
  };

  const navLinks = [
    { label: 'Home', path: '/user/home' },
    { label: 'CV', path: '/cv' },
    { label: 'Applications', path: '/user/applications', alert: true },
    { label: 'Internships', path: '/user/internships' },
  ];

  const isActive = (path) =>
    path === '/cv' || path === '/user/internships'
      ? location.pathname.startsWith(path)
      : location.pathname === path;

  const runSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/user/internships?q=${encodeURIComponent(q)}` : '/user/internships');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-line bg-raised/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/user/home" className="group flex flex-shrink-0 items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">IF</span>
          <span className="hidden text-sm font-black tracking-tight text-content transition-colors group-hover:text-accent sm:inline">
            Internship Finder
          </span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive(link.path)
                  ? 'bg-accent-soft text-accent'
                  : 'text-subtle hover:bg-muted hover:text-content'
              }`}
            >
              {link.label}
              {link.alert && alertCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div ref={searchRef} className="relative ml-auto hidden max-w-xs flex-1 lg:block">
          <form onSubmit={runSearch}>
            <div className="flex w-full items-center gap-2 rounded-lg border border-line bg-muted px-3 py-1.5 transition-colors focus-within:border-accent">
              <i className="bi bi-search text-sm text-faint" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggest(true); }}
                onFocus={() => setShowSuggest(true)}
                placeholder="Search internship titles or companies"
                aria-label="Search internships or companies"
                className="w-full bg-transparent text-xs text-content placeholder:text-faint focus:outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                  <i className="bi bi-x-circle-fill text-xs text-faint hover:text-subtle" />
                </button>
              )}
            </div>
          </form>

          {showSuggest && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-line bg-raised shadow-lg">
              {suggestions.map((job) => (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => pickSuggestion(job)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <i className="bi bi-briefcase text-xs text-faint" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-content">{job.title}</span>
                      <span className="block truncate text-[11px] text-subtle">
                        {job.company?.companyName || 'Unknown company'}
                        {job.location ? ` · ${job.location}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              <li className="border-t border-line">
                <button
                  type="button"
                  onClick={runSearch}
                  className="w-full px-3 py-2 text-left text-[11px] font-semibold text-accent hover:bg-muted"
                >
                  See all results for “{query}”
                </button>
              </li>
            </ul>
          )}
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex lg:ml-3">
          <Link
            to="/user/settings"
            title="Settings"
            aria-label="Settings"
            className={`grid h-9 w-9 place-items-center rounded-lg border border-line transition-colors ${
              location.pathname === '/user/settings'
                ? 'bg-accent-soft text-accent'
                : 'text-subtle hover:bg-muted hover:text-content'
            }`}
          >
            <i className="bi bi-gear text-[15px]" />
          </Link>
          <Link
            to="/user/profile"
            aria-label="Profile"
            className={`grid h-9 w-9 place-items-center overflow-hidden rounded-full border transition-all ${
              location.pathname.startsWith('/user/profile') ? 'border-accent' : 'border-line hover:border-faint'
            }`}
          >
            <i className="bi bi-person-fill text-lg text-subtle" />
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-muted text-content transition hover:bg-line md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((p) => !p)}
        >
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} text-lg`} />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-line bg-raised md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            <form onSubmit={runSearch} className="mb-2">
              <div className="flex items-center gap-2 rounded-lg border border-line bg-muted px-3 py-2 focus-within:border-accent">
                <i className="bi bi-search text-sm text-faint" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search internship titles or companies"
                  aria-label="Search internships or companies"
                  className="w-full bg-transparent text-sm text-content placeholder:text-faint focus:outline-none"
                />
              </div>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-accent-soft text-accent'
                    : 'text-subtle hover:bg-muted hover:text-content'
                }`}
              >
                {link.label}
                {link.alert && alertCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-ink">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </Link>
            ))}

            <div className="my-2 h-px bg-line" />

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Link
                  to="/user/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-subtle transition-colors hover:text-content"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-line">
                    <i className="bi bi-person-fill text-subtle" />
                  </span>
                  Profile
                </Link>
                <Link
                  to="/user/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-subtle transition-colors hover:text-content"
                >
                  <i className="bi bi-gear" /> Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
