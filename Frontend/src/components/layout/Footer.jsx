import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Explore', to: '/explore' },
      { label: 'Sign up', to: '/signup' },
      { label: 'Log in', to: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-raised">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">
              IF
            </span>
            <span className="text-sm font-black text-content">Internship Finder</span>
          </div>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-subtle">
            Connecting students with companies offering real internships — build a CV,
            apply in a click, and track every application in one place.
          </p>
          <p className="mt-4 text-xs text-faint">
            A CADT Gen11 cross-disciplinary project.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-faint">
              {col.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-subtle transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-faint sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Internship Finder — CADT. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
