import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
export default function CVChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070B19] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 text-center space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight">Prepare Your Application</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Choose how you want to present your professional matrix to outstanding tech teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {/* Track 1: Direct File Upload Container */}
          <div className="bg-[#131c35] border border-slate-800/80 rounded-2xl p-8 flex flex-col justify-between items-center text-center space-y-6 hover:border-slate-700 transition-all group">
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#0b1224] flex items-center justify-center text-xl text-slate-400 border border-slate-800">
                📤
              </div>
              <h3 className="text-lg font-bold group-hover:text-[#10b981] transition-colors">Upload Existing CV</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drop your existing PDF or doc file directly. Our processing node will extract matching configurations instantly.
              </p>
            </div>
            <button className="w-full py-3 bg-[#0b1224] border border-slate-700 text-xs font-bold rounded-xl text-slate-300 hover:bg-slate-800 transition-colors">
              Select Document
            </button>
          </div>

          {/* Track 2: Builder Interface Entry */}
          <div className="bg-[#131c35] border border-slate-800/80 rounded-2xl p-8 flex flex-col justify-between items-center text-center space-y-6 hover:border-slate-700 transition-all group">
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#10b981]/10 flex items-center justify-center text-xl text-[#10b981] border border-[#10b981]/20">
                ✨
              </div>
              <h3 className="text-lg font-bold group-hover:text-[#10b981] transition-colors">Create Online Resume</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build a tailored layout using structured input matrices optimized for modern applicant tracking filters.
              </p>
            </div>
            <button 
              onClick={() => navigate('/cv-maker')}
              className="w-full py-3 bg-[#10b981] text-xs font-bold rounded-xl text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-950/25"
            >
              Initialize Builder
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}