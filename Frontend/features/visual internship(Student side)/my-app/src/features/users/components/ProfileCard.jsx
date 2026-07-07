export default function ProfileCard({ profile }) {
  return (
    <section className="bg-[#131c35] border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl text-left">
      <div className="h-36 bg-gradient-to-r from-slate-800 to-slate-900" />
      <div className="px-8 pb-8 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-12">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
          <div className="w-28 h-28 rounded-full border-4 border-[#131c35] overflow-hidden bg-slate-700 shadow-xl relative z-10">
            <img 
              src={profile.avatar} 
              alt="Profile avatar frame" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 mb-2">
            <h2 className="text-2xl font-bold text-white">@{profile.username}</h2>
            <p className="text-sm text-[#10b981] font-medium">{profile.role}</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
              <span>📍 {profile.location}</span>
              <span>🔗 {profile.website}</span>
              <span>✉️ {profile.email}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mb-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-[#10b981] text-xs font-bold text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5">
            📥 Download CV
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 border border-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            Message
          </button>
        </div>
      </div>
      
      <div className="px-8 pb-6 flex gap-2 border-t border-slate-800/40 pt-4 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-[#10b981] border border-emerald-500/20 px-2.5 py-1 rounded-md">Available Now</span>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">Remote</span>
      </div>
    </section>
  );
}