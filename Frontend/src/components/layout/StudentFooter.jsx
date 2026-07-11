import { Link } from 'react-router-dom';

export default function StudentFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-raised">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">IF</span>
          <span className="text-sm font-black text-content">Internship Finder</span>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-subtle">
          <Link to="/user/home" className="transition-colors hover:text-accent">Home</Link>
          <Link to="/user/internships" className="transition-colors hover:text-accent">Internships</Link>
          <Link to="/cv" className="transition-colors hover:text-accent">CV Builder</Link>
          <Link to="/user/applications" className="transition-colors hover:text-accent">Applications</Link>
          <Link to="/about" className="transition-colors hover:text-accent">About</Link>
          <Link to="/contact" className="transition-colors hover:text-accent">Contact</Link>
        </nav>

        <p className="text-xs text-faint">© {new Date().getFullYear()} Internship Finder — CADT</p>
      </div>
    </footer>
  );
}
