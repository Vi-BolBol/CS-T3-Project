import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
export default function CVPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070B19] text-white">
      <Navbar />  
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 text-left">
          <div>
            <h2 className="text-lg font-bold">Document Artifact</h2>
            <p className="text-xs text-slate-400">Step 3: Review generated output before submission nodes.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/cv-maker')}
              className="px-3.5 py-1.5 border border-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all"
            >
              Modify Fields
            </button>
            <button className="px-3.5 py-1.5 bg-[#10b981] text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors">
              Export PDF
            </button>
          </div>
        </div>

        {/* The Clean White Paper Mockup Area */}
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-10 lg:p-14 min-h-[700px] text-left space-y-8 font-sans">
          
          {/* Document Header Block */}
          <div className="border-b-2 border-slate-800 pb-5 flex justify-between items-end">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight uppercase text-slate-900">Alex Morgan</h1>
              <p className="text-sm font-bold text-emerald-700 tracking-wide">Full Stack Engineering Specialist</p>
            </div>
            <div className="text-right text-[11px] text-slate-500 space-y-0.5">
              <p>alex.morgan@dev.io</p>
              <p>github.com/amorgan-dev</p>
              <p>Phnom Penh, KH</p>
            </div>
          </div>

          {/* Section: Architectural Strategy Core */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">Professional Profile</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Detail-focused software engineering student with proven hands-on capacities designing scalable object models, full-stack React application trees, and optimized operational relational database normalization pipelines.
            </p>
          </div>

          {/* Section: Projects Layout Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">Key Production Development</h3>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <h4 className="text-xs font-bold text-slate-900">Distributed Metrics Tracker</h4>
                <span className="text-[10px] text-slate-500 font-medium">Q1 2026</span>
              </div>
              <p className="text-[11px] italic text-emerald-800 font-medium">Stack: React, Tailwind CSS, Vite runtime layers</p>
              <p className="text-xs text-slate-700 leading-relaxed">
                Designed a highly available monitoring layout structure processing real-time system events. Integrated precise component trees reducing execution rendering lag inside layout nodes by 18%.
              </p>
            </div>
          </div>

          {/* Section: Technical Competence */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">Technical Inventory</h3>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700">
              <div><strong className="text-slate-900">Languages:</strong> Java, JavaScript, C++</div>
              <div><strong className="text-slate-900">Frameworks:</strong> React, Express, Node</div>
              <div><strong className="text-slate-900">Databases:</strong> PostgreSQL, MySQL, 3NF Normalization</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}