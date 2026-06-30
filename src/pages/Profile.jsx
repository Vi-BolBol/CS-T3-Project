import Navbar from '../components/Layout/Navbar';

export default function Profile() {
  // Temporary mock data for visualization
  const user = {
    name: "Kimtech",
    email: "kimtech@design.com",
    role: "Member",
    joined: "Joined January 2026"
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-100 font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 space-y-12">
        
        {/* Header / Hero Section */}
        <header className="relative bg-gradient-to-r from-slate-900 via-[#131c35] to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800/60 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative z-10">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0b1224] rounded-[14px] flex items-center justify-center text-3xl font-bold text-indigo-400">
                {user.name.charAt(0)}
              </div>
            </div>
            
            {/* User Info */}
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide border border-indigo-500/20">
                {user.role}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {user.name}
              </h1>
              <p className="text-slate-400 font-medium">{user.email}</p>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar / Quick Stats */}
          <div className="bg-slate-950/40 rounded-2xl p-6 border border-slate-800/50 space-y-6">
            <h3 className="text-lg font-semibold text-slate-200">Account Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/40">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Member Status</p>
                <p className="text-sm font-semibold text-slate-200 mt-1">{user.joined}</p>
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/40">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Security</p>
                <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> 2FA Enabled
                </p>
              </div>
            </div>
          </div>

          {/* Main settings/content placeholder */}
          <div className="lg:col-span-2 bg-slate-950/20 rounded-2xl p-8 border border-slate-800/40 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400 mb-4">
              ✨
            </div>
            <h3 className="text-xl font-bold text-slate-200">Your Dashboard</h3>
            <p className="text-slate-400 max-w-sm mt-2 text-sm leading-relaxed">
              We're preparing your personal activity, settings, and insights. Check back shortly!
            </p>
          </div>

        </section>
      </main>
    </div>
  );
}