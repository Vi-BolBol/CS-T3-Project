import { Link, useLocation } from 'react-router-dom';

export default function CompanyNavbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/company/home' },
    { name: 'Dashboard', path: '/company/dashboard' },
    { name: 'Profile', path: '/company/profile' },
    { name: 'Settings', path: '/company/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#070B19]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Brand Platform Logo Anchor */}
          <div className="flex items-center gap-8">
            <Link to="/company/home" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-xs text-[#070B19] shadow-md shadow-emerald-500/20">
                IF
              </div>
              <span className="text-sm font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Internship Finder
              </span>
            </Link>

            {/* Inner Dashboard View Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white/5 text-emerald-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Context Controls Deck */}
          <div className="flex items-center gap-4">
            {/* Design Call to Action matching the global '+ Create an Internship' design boundary */}
            <Link
              to="/company/create-internship"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070B19] font-bold text-xs transition duration-150 shadow-md shadow-emerald-500/10"
            >
              + Create an Internship
            </Link>

            {/* User Meta Tracking Badge */}
            <div className="h-8 w-8 rounded-full border border-white/10 bg-[#111B34] flex items-center justify-center font-bold text-xs text-emerald-400 cursor-pointer hover:border-emerald-500/40 transition">
              NG
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
