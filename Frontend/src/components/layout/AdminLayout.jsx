import { Link, useLocation, Navigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import ThemeToggle from '../shared/ThemeToggle';

const NAV = [
  { to: '/admin', label: 'Overview', icon: 'bi-speedometer2', exact: true },
  { to: '/admin/users', label: 'Users', icon: 'bi-people' },
  { to: '/admin/audit', label: 'Audit logs', icon: 'bi-clock-history' },
];

/** Reads the logged-in user. The server enforces admin access; this only
 *  keeps non-admins from seeing a broken page. */
function currentUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); }
  catch { return null; }
}

export default function AdminLayout({ children, title, subtitle }) {
  const location = useLocation();
  const user = currentUser();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-50 border-b border-line bg-raised/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">IF</span>
            <span className="text-sm font-black text-content">Internship Finder</span>
            <span className="rounded-md bg-danger/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-danger">
              Admin
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive(item)
                    ? 'bg-accent-soft text-accent'
                    : 'text-subtle hover:bg-muted hover:text-content'
                }`}
              >
                <i className={`bi ${item.icon}`} /> {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs text-subtle sm:inline">{user.email}</span>
            <ThemeToggle variant="icon" />
            <button
              onClick={logout}
              title="Log out"
              aria-label="Log out"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-subtle transition hover:text-danger"
            >
              <i className="bi bi-box-arrow-right text-[15px]" />
            </button>
          </div>
        </div>

        {/* mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                isActive(item) ? 'bg-accent-soft text-accent' : 'text-subtle'
              }`}
            >
              <i className={`bi ${item.icon}`} /> {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-content">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-subtle">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
