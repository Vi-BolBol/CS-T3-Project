import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../shared/ThemeToggle';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

/** Where a still-logged-in visitor gets sent if they land on the public site. */
function dashboardFor(role) {
  if (role === 'admin') return '/admin';
  if (role === 'company') return '/company/home';
  if (role === 'student') return '/user/home';
  return null;
}

function readSession() {
  try {
    if (!localStorage.getItem('token')) return null;
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const to = dashboardFor(user?.role);
    return to ? { user, to } : null;
  } catch {
    return null;
  }
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const session = readSession();

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-raised/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex flex-shrink-0 items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">
            IF
          </span>
          <span className="text-sm font-black tracking-tight text-content transition-colors group-hover:text-accent">
            Internship Finder
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive(link.to)
                  ? 'bg-accent-soft text-accent'
                  : 'text-subtle hover:bg-muted hover:text-content'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle variant="icon" />

          {session ? (
            <Link
              to={session.to}
              className="hidden rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-ink transition hover:brightness-95 sm:inline-flex"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-xl px-3 py-2 text-xs font-semibold text-subtle transition hover:bg-muted hover:text-content sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-ink transition hover:brightness-95 sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-subtle transition-colors hover:bg-muted hover:text-content md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} text-base`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-line bg-raised md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive(link.to)
                    ? 'bg-accent-soft text-accent'
                    : 'text-subtle hover:bg-muted hover:text-content'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex gap-2 border-t border-line pt-3">
              {session ? (
                <Link
                  to={session.to}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-bold text-accent-ink"
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-xl border border-line px-4 py-2.5 text-center text-sm font-semibold text-content"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-bold text-accent-ink"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
