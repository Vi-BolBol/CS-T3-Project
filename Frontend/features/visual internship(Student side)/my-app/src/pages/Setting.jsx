import { useState } from 'react';
import Navbar from '../components/Layout/Navbar';

export default function Setting() {
  const [activeTab, setActiveTab] = useState('Personal Data');
  
  const settingTabs = [
    { name: 'Personal Data', icon: '' },
    { name: 'Account Options', icon: '' },
    { name: 'Security Keys', icon: '' },
    { name: 'Linked Platforms', icon: '' }
  ];

  // Logic handler placeholder for authentication signout
  const handleSignOut = () => {
    console.log("Signing out user...");
    // Add your auth logout logic here (e.g., clearing tokens, redirecting)
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sub-Navigation Panel Wrapper */}
          <nav className="lg:col-span-3 bg-[#131c35] border border-slate-800/60 rounded-2xl p-4 flex flex-col gap-1 shadow-xl">
            {settingTabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all text-left ${
                  activeTab === tab.name
                    ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-950/20'
                    : 'text-slate-400 hover:bg-[#0b1224]/60 hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.name}
              </button>
            ))}

            {/* Visual Divider Line */}
            <div className="h-px bg-slate-800/60 my-2" />

            {/* Danger Zone Action: Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 active:scale-98 transition-all text-left border border-transparent hover:border-rose-500/20"
            > 
              <span className="text-sm"> </span>
              Sign Out
            </button>
          </nav>

          {/* Core Configuration Sheet Context */}
          <div className="lg:col-span-9 bg-[#131c35] border border-slate-800/60 rounded-3xl p-8 lg:p-10 shadow-2xl space-y-8">
            <div className="border-b border-slate-800/60 pb-5 space-y-1 text-left">
              <h2 className="text-xl font-bold tracking-tight text-white">{activeTab}</h2>
              <p className="text-xs text-slate-400">Manage database parameters used to fill structural application models dynamically.</p>
            </div>

            {/* Profile Picture Identity Component */}
            <div className="flex items-center gap-5 bg-[#0b1224]/40 border border-slate-800/50 rounded-2xl p-5 text-left">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#10b981] bg-slate-700 shadow-md">
                <img 
                  src="https://p7.hiclipart.com/preview/782/114/405/5bbc3519d674c.jpg" 
                  alt="Identity Avatar View" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Avatar Frame</p>
                <div className="flex gap-2">
                  <button type="button" className="px-3 py-1.5 bg-[#10b981] hover:bg-emerald-600 transition-colors text-[11px] font-bold rounded-lg text-white">Upload New</button>
                  <button type="button" className="px-3 py-1.5 bg-transparent border border-slate-700 text-[11px] font-semibold rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">Remove</button>
                </div>
              </div>
            </div>

            {/* Data Inputs Array Form Block */}
            <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                  <input type="text" defaultValue="Kimtech" className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                  <input type="text" defaultValue="Lov" className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981] transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Headline Descriptor</label>
                <input type="text" defaultValue="Full Stack Developer Candidate" className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981] transition-all" />
              </div>

              {/* Connected Handles Blocks */}
              <div className="space-y-3">
                <h4 className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Social Handles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-[#0b1224] border border-slate-800 rounded-xl px-4 py-3">
                    <span className="text-slate-500 text-sm">🔗</span>
                    <input type="text" placeholder="github.com/profile" className="w-full bg-transparent text-sm focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-3 bg-[#0b1224] border border-slate-800 rounded-xl px-4 py-3">
                    <span className="text-slate-500 text-sm">💼</span>
                    <input type="text" placeholder="linkedin.com/in/user" className="w-full bg-transparent text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Interactive Submit Panel */}
              <div className="flex items-center justify-end pt-4 border-t border-slate-800/60">
                <button type="submit" className="px-6 py-3 bg-[#10b981] hover:bg-emerald-600 active:scale-95 transition-all rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-950/20">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}