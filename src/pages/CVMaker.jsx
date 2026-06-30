import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
export default function CVMaker() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070B19] text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
          <div className="text-left space-y-1">
            <h1 className="text-xl font-bold tracking-tight">Interactive CV Matrix</h1>
            <p className="text-xs text-slate-400">Step 2: Input engineering metrics, project histories, and tool stacks.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/cv-choice')}
              className="px-4 py-2 border border-slate-700 text-xs font-semibold rounded-lg text-slate-400 hover:bg-slate-800 transition-all"
            >
              Back
            </button>
            <button 
              onClick={() => navigate('/cv-preview')}
              className="px-4 py-2 bg-[#10b981] text-xs font-bold text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Generate Layout
            </button>
          </div>
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Editing Column */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="bg-[#131c35] border border-slate-800/60 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Summary</h3>
              <textarea 
                rows={4}
                className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981] transition-all resize-none"
                placeholder="Detail your operational expertise, architectural focuses, and engineering milestones..."
              />
            </div>

            <div className="bg-[#131c35] border border-slate-800/60 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Technical Project</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Project Title (e.g., E-Commerce Core)" className="bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981]" />
                  <input type="text" placeholder="Role/Contribution" className="bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981]" />
                </div>
                <input type="text" placeholder="Technologies Employed (Comma separated)" className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981]" />
                <textarea 
                  rows={3}
                  className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981] resize-none"
                  placeholder="Describe building phases, scalability achievements, and optimization steps..."
                />
              </div>
            </div>
          </div>

          {/* Guidelines Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="bg-[#131c35] border border-slate-800/60 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase text-[#10b981] tracking-wider">💡 Builder Strategy</h4>
              <ul className="space-y-2.5 text-[11px] text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span>•</span> <span>Quantify architectural wins (e.g., *optimized parsing overhead by 22%*).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span> <span>List core languages and runtimes early to score higher on filter systems.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}