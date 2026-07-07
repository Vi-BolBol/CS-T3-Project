import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/user/home' },
    { label: 'CV', path: '/cv' },
    { label: 'Applications', path: '/user/applications' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#070B19]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Platform Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/user/home" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-xs text-[#070B19] shadow-md shadow-emerald-500/20">
                IF
              </div>
              <span className="text-sm font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Internship Finder
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-white/5 text-emerald-400' 
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Context Control Deck (Settings & Profile Avatar) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Smooth Settings Cog Link */}
            <Link 
              to="/user/settings" 
              className={`text-sm p-2 rounded-lg transition-all ${
                location.pathname === '/user/settings' 
                  ? 'bg-white/5 text-emerald-400' 
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
              title="Settings"
            >
              ⚙️
            </Link>

            {/* Glowing User Avatar Ring */}
            <Link 
              to="/user/profile" 
              className={`w-8 h-8 rounded-full overflow-hidden border transition-all duration-150 p-[1px] ${
                location.pathname === '/user/profile' 
                  ? 'border-emerald-400 bg-emerald-400/20 shadow-md shadow-emerald-500/10' 
                  : 'border-white/10 hover:border-white/30 bg-slate-800'
              }`}
            >
              <img 
                src="https://p7.hiclipart.com/preview/782/114/405/5bbc3519d674c.jpg" 
                alt="User profile avatar" 
                className="w-full h-full object-cover rounded-full"
              />
            </Link>
          </div>

          {/* Micro-Animating Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white md:hidden hover:bg-white/10 transition"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="flex flex-col gap-1">
              <span className={`block h-0.5 w-4 bg-current transition-transform duration-200 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 w-4 bg-current transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-4 bg-current transition-transform duration-200 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </span>
          </button>

        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#070B19]/95 backdrop-blur-lg">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/5 text-emerald-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Divider */}
            <div className="h-px bg-white/5 my-2" />

            {/* Mobile Footer Meta Deck */}
            <div className="flex items-center justify-between px-3 pt-1">
              <Link 
                to="/user/profile" 
                onClick={() => setIsOpen(false)} 
                className={`text-sm font-medium flex items-center gap-3 transition-colors ${
                  location.pathname === '/user/profile' ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                  <img 
                    src="https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=" 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                Profile Hub
              </Link>
              
              <Link 
                to="/user/settings" 
                onClick={() => setIsOpen(false)} 
                className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/user/settings' ? 'bg-white/5 text-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>⚙️</span> Settings
              </Link>
            </div>
          </nav>
        </div>
      )}
    </nav>
  );
}