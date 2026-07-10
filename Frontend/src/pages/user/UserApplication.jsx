import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
import useApplications from '../../hooks/useApplications';

export default function Application() {
  const { fetchMyApplications, loading } = useApplications();
  const [pipeline, setPipeline] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchMyApplications().then((result) => {
      if (cancelled) return;
      if (result.success) {
        setPipeline(result.applications);
      } else {
        setLoadError(result.message || 'Failed to load your applications.');
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Placeholder recommendations — there's no match-scoring engine against
  // internships yet, so this section stays illustrative for now.
  const [topChoices] = useState([
    { role: 'UI Developer Intern', company: 'Vercel Operations', date: 'Active Selection Round', matchScore: '96%' },
    { role: 'AI Data Design Intern', company: 'OpenAI Studio Workspace', date: 'In Review Queue', matchScore: '91%' }
  ]);

  const statusBadges = {
    Selected: 'bg-emerald-500/10 text-[#10b981] border border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Disqualified: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between">
      <div>
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-10">
          
          {/* Core Status Block List */}
          <section className="bg-[#0b1224]/40 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <div className="text-left space-y-0.5">
              <h2 className="text-lg font-bold tracking-tight">Application Status</h2>
              <p className="text-xs text-slate-400">Track and monitor your active internship selection rounds.</p>
            </div>

            {loading ? (
              <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <p className="text-xs text-gray-400">Loading your applications…</p>
              </div>
            ) : loadError ? (
              <div className="text-center py-12 border border-dashed border-rose-500/20 rounded-2xl bg-rose-500/[0.02]">
                <p className="text-xs text-rose-400">{loadError}</p>
              </div>
            ) : pipeline.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <p className="text-xs text-gray-400">You haven't applied to any internships yet.</p>
                <Link to="/user/home" className="text-xs text-[#10b981] font-bold hover:text-emerald-400 transition-colors mt-2 inline-block">
                  Browse internships ›
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pipeline.map((app) => (
                  <div
                    key={app.id}
                    className="bg-[#0d1527] border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-all duration-200 text-left group shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusBadges[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-[#10b981] transition-colors line-clamp-1">
                          {app.role}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{app.company}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5 text-[11px] text-slate-500 font-medium">
                      <span>Filed: {app.date}</span>
                       <Link to="/pipeline" className="text-[#10b981] hover:text-emerald-400 transition-colors font-bold">
                         View Pipeline ›
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Priority Target Grid Row */}
          <section className="bg-[#0b1224]/40 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6 text-left">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold tracking-tight">Top Selection Choices</h2>
                <p className="text-xs text-slate-400">High-match positions tailored exactly to your runtime experience inventory.</p>
              </div>
              <Link to="/user/home" className="text-xs text-[#10b981] font-bold hover:text-emerald-400 transition-colors">
                Explore More Roles ›
              </Link>
            </div>

            <div className="space-y-3">
              {topChoices.map((choice, i) => (
                <div 
                  key={i} 
                  className="bg-[#0d1527] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#070B19] border border-white/5 flex items-center justify-center font-bold text-[#10b981] text-sm shadow-inner">
                      ⚡
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-white">{choice.role}</h4>
                      <p className="text-xs text-slate-400">
                        {choice.company} <span className="text-slate-700 mx-1.5">•</span> <span className="text-emerald-500/80 font-medium">{choice.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Match Rating</span>
                      <span className="text-sm font-black text-[#10b981]">{choice.matchScore}</span>
                    </div>
                    <button type="button" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold rounded-xl transition-all">
                      Review Matrix
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}