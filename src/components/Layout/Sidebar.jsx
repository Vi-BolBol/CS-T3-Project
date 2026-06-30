import { Outlet, Link, useLocation } from 'react-router-dom';

export default function SidebarLayout() {
  const location = useLocation();

  const menuItems = [
    { label: 'Home Dashboard', path: '/home', icon: '🏠' },
    { label: 'Profile Hub', path: '/profile', icon: '👤' },
    { label: 'Applications', path: '/applications', icon: '💼' },
    { label: 'Pipeline', path: '/pipeline', icon: '🔗' },
    { label: 'CV Builder Options', path: '/cv-choice', icon: '📄' },
    { label: 'System Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b1224] font-sans text-slate-200">
      {/* Structural Sidebar */}
      <aside className="w-72 bg-[#131c35] border-r border-slate-800/60 flex flex-col justify-between p-6 z-20">
        <div className="space-y-10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20">i</div>
            <span className="text-lg font-bold tracking-tight text-white">Internship<span className="text-[#10b981]">Engine</span></span>
          </div>
          
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              // Handle matching logic safely for settings/applications pathways
              const isActive = location.pathname.startsWith(item.path.replace('s', ''));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-950/40 font-semibold'
                      : 'text-slate-400 hover:bg-[#0b1224]/60 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-base ${isActive ? 'scale-110' : 'opacity-70'}`}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Identity Block */}
        <div className="border-t border-slate-800/60 pt-4 px-2 flex items-center gap-3 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span>Workspace Environment Connected</span>
        </div>
      </aside>

      {/* Main Stream Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-[#131c35]/40 border-b border-slate-800/40 backdrop-blur-md flex items-center justify-between px-10 z-10">
          <h1 className="text-sm font-bold tracking-wider uppercase text-slate-400">
            {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">Alex Morgan</p>
              <p className="text-[10px] text-slate-500 font-medium">Candidate Mode</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-sm text-[#10b981] shadow-inner">
              AM
            </div>
          </div>
        </header>

        {/* Content Portal */}
        <main className="flex-1 overflow-y-auto bg-[#0b1224] relative focus:outline-none">
          <div className="container mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}