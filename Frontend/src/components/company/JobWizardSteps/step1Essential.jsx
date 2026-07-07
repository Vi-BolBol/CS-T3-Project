import React from 'react';

export default function Step1Essential({ onNext, onCancel }) {
  const steps = ["Job Essentials", "Role Details", "Compensation", "Review", "Finalize"];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      
      {/* Horizontal Wizard Progress Tracker */}
      <div className="mb-10 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] px-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                  idx === 0 
                    ? 'bg-emerald-500 border-emerald-400 text-[#070B19] shadow-lg shadow-emerald-500/20' 
                    : 'bg-[#070B19]/60 border-white/10 text-gray-400'
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-[11px] font-medium whitespace-nowrap ${idx === 0 ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="h-[2px] bg-white/5 flex-1 mx-4 mt-[-18px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Core Form Block */}
      <div className="border-t border-white/5 pt-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">Job Essentials</h2>
          <p className="text-xs text-gray-400 mt-1">Start by providing the core identifiers of this open tracking position.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Job Title</label>
            <input 
              type="text" 
              placeholder="e.g. Software Engineering Intern" 
              className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#070B19]/60 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Department</label>
              <select className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#070B19]/60 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/40 transition">
                <option>Select Department</option>
                <option>Engineering & Infrastructure</option>
                <option>Product & Design</option>
                <option>Data Science & AI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Work Arrangement</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#070B19]/60 rounded-xl border border-white/5">
                {["On-site", "Hybrid", "Remote"].map((type) => (
                  <button 
                    key={type}
                    type="button"
                    className={`py-2 text-xs font-medium rounded-lg transition ${type === 'Hybrid' ? 'bg-emerald-500 text-[#070B19] font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Job Description</label>
            <textarea 
              rows={5}
              placeholder="Describe the tasks, requirements, and tech stack options..." 
              className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#070B19]/60 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* Navigation Foot Actions */}
      <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition">
          Cancel
        </button>
        <button onClick={onNext} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition flex items-center gap-1 shadow-lg shadow-emerald-500/10">
          Next Step <span>-&gt;</span>
        </button>
      </div>

    </div>
  );
}
