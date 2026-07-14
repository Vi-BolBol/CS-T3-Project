import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostedJobsList({ jobs, selectedJobId, onSelectJob }) {
  const navigate = useNavigate();
  const activeCount = jobs.filter((job) => job.status === 'open').length;

  return (
    <div className="rounded-2xl border border-line bg-raised p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-accent">Posted Internships</h2>
          <p className="text-xs text-subtle mt-0.5">{jobs.length} Positions Published</p>
        </div>
        <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-md font-medium">
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
                  ? 'bg-raised border-accent/40 shadow-md shadow-accent/20'
                  : 'bg-transparent border-line hover:border-accent/40 hover:bg-raised'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-tight text-content line-clamp-1">{job.title}</h3>
                <span
                  className={`text-[10px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded ${
                    job.status === 'open'
                      ? 'bg-accent/10 text-accent'
                      : job.status === 'draft'
                      ? 'bg-raised/10 text-subtle'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {job.statusLabel}
                </span>
              </div>

              <p className="text-xs text-subtle mt-1">{job.location} - {job.workEnvironment}</p>

              <div className="mt-3 pt-3 border-t border-line flex items-center justify-between text-[11px] text-subtle">
                <span>{job.applicantsCount} Applicants</span>
                <span className="text-accent font-medium">View Pipeline -&gt;</span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate('/company/create-internship')}
        className="w-full mt-4 bg-accent hover:bg-accent text-accent-ink font-bold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-accent/10"
      >
        <span>+</span> Post a New Job
      </button>
    </div>
  );
}
