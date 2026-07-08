import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostedJobsList({ jobs, selectedJobId, onSelectJob }) {
  const navigate = useNavigate();
  const activeCount = jobs.filter((job) => job.status === 'open').length;

  return (
    <div className="rounded-2xl border border-white/5 bg-[#111B34]/40 p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Posted Internships</h2>
          <p className="text-xs text-gray-400 mt-0.5">{jobs.length} Positions Published</p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-medium">
          {activeCount} Active
        </span>
      </div>

      <div className="space-y-2.5 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
        {jobs.map((job) => {
          const isSelected = job.id === selectedJobId;

          return (
            <button
              key={job.id}
              type="button"
              onClick={() => onSelectJob(job.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#111B34] border-emerald-500/40 shadow-md shadow-emerald-950/20'
                  : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-[#111B34]/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-tight text-white line-clamp-1">{job.title}</h3>
                <span
                  className={`text-[10px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded ${
                    job.status === 'open'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : job.status === 'draft'
                      ? 'bg-white/10 text-gray-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {job.statusLabel}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1">{job.location} - {job.workEnvironment}</p>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                <span>{job.applicantsCount} Applicants</span>
                <span className="text-emerald-400 font-medium">View Pipeline -&gt;</span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate('/company/create-internship')}
        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-[#070B19] font-bold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
      >
        <span>+</span> Post a New Job
      </button>
    </div>
  );
}
