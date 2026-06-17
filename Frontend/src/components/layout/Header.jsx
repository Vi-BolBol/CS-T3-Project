import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="px-8 py-5">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold text-greenMain">
          Internship Finder
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link to="/" className="hover:text-greenMain">Home</Link>
          <Link to="/about" className="hover:text-greenMain">About</Link>
          <Link to="/company" className="hover:text-greenMain">Company</Link>
          <Link to="/contact" className="hover:text-greenMain">Contact</Link>
        </nav>

        <div className="hidden md:block">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>

      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <nav className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <Link to="/" className="hover:text-greenMain" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="hover:text-greenMain" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link to="/company" className="hover:text-greenMain" onClick={() => setIsMenuOpen(false)}>
            Company
          </Link>
          <Link to="/contact" className="hover:text-greenMain" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>

          <Link to="/login" className="pt-2" onClick={() => setIsMenuOpen(false)}>
            <Button className="w-full">Login</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}