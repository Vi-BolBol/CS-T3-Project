import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../common/Button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Company", path: "/company" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#070B19]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Platform Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-xs text-[#070B19] shadow-md shadow-emerald-500/20">
                IF
              </div>
              <span className="text-sm font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Internship Finder
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-white/5 text-emerald-400"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Controls Deck (Login & Mobile Toggle) */}
          <div className="flex items-center gap-4">
            {/* Desktop Login Button */}
            <div className="hidden md:block">
              <Link to="/login">
                <Button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070B19] font-bold text-xs transition duration-150 shadow-md shadow-emerald-500/10 border-none">
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white md:hidden hover:bg-white/10 transition"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span className="flex flex-col gap-1">
                <span className={`block h-0.5 w-4 bg-current transition-transform duration-200 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block h-0.5 w-4 bg-current transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-4 bg-current transition-transform duration-200 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#070B19]/95 backdrop-blur-lg">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-2">
            {navigationLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/5 text-emerald-400"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="h-px bg-white/5 my-2" />

            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-3">
              <Button className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070B19] font-bold text-xs shadow-md shadow-emerald-500/10 border-none">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}