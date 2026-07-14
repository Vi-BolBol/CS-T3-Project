import { Link, useLocation } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

const LINKS = [
  { label: 'Dashboard', path: '/admin', icon: 'bi-speedometer2' },
  { label: 'Users', path: '/admin/users', icon: 'bi-people' },
  { label: 'Audit Logs', path: '/admin/audit', icon: 'bi-list-columns' },
];

export default function AdminNavbar() {
  const location = useLocation();

  const logout = useLogout();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-line bg-raised/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/admin" className="flex flex-shrink-0 items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">IF</span>
          <span className="text-sm font-black text-content">Internship Finder</span>
          <span className="rounded-md border border-warn/40 bg-warn/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warn">
            Admin
          </span>
        </Link>

        <div className="ml-4 flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                location.pathname === l.path
                  ? 'bg-accent-soft text-accent'
                  : 'text-subtle hover:bg-muted hover:text-content'
              }`}
            >
              <i className={`bi ${l.icon}`} /> <span className="hidden sm:inline">{l.label}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={logout}
          className="ml-auto rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-danger"
        >
          <i className="bi bi-box-arrow-right mr-1" /> Log out
        </button>
      </div>
    </nav>
  );
}
