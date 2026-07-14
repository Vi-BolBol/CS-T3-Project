import React from 'react';

export default function SidebarNav({ activeTab, setActiveTab }) {
  const navigationItems = [
    { name: 'Organization', icon: 'ORG' },
    { name: 'Personal Data', icon: 'ID' },
    { name: 'Security', icon: 'SEC' },
    { name: 'Notifications', icon: 'NOT' },
    { name: 'Team Management', icon: 'TEAM' }
  ];

  return (
    <div className="rounded-2xl border border-line bg-raised p-3 space-y-1">
      <div className="px-3 pt-2 pb-3 border-b border-line mb-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-subtle block">Account Settings</span>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = item.name === activeTab;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                isActive
                  ? 'bg-accent text-accent-ink shadow-md shadow-accent/10 font-bold'
                  : 'text-subtle hover:text-content hover:bg-raised/[0.02]'
              }`}
            >
              <span className={`text-[10px] min-w-8 ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 mt-4 border-t border-line px-2">
        <button
          type="button"
          onClick={() => alert('Logging out...')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition duration-150"
        >
          <span className="text-[10px] min-w-8">OUT</span>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
