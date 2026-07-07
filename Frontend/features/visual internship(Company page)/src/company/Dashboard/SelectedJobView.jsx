import React from 'react';
import ApplicantRowCard from './ApplicantRowCard';

export default function SelectedJobView({ job }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111B34]/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <div className="border-b border-white/5 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Active Pipeline
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white mt-2 sm:text-3xl">{job.title}</h1>
            <p className="text-sm text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{job.location}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>{job.type}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-emerald-400 font-semibold">{job.salary}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button className="px-3 py-1.5 border border-white/10 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10 transition">
              Share
            </button>
            <button className="px-3 py-1.5 border border-amber-500/20 text-amber-400 rounded-lg bg-amber-500/5 text-xs hover:bg-amber-500/10 transition">
              Freeze Listing
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-gray-400 max-w-3xl">
          {job.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
          <div>Posted: <span className="text-gray-200">{job.postedDate}</span></div>
          <div>Volume: <span className="text-emerald-400 font-bold">{job.applicantsCount} total tracking profiles</span></div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">New Applicants</h3>
            <p className="text-[11px] text-gray-400">Review candidate matches algorithmically indexed by platform score tools</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search applicants..."
              className="px-3 py-1.5 rounded-lg border border-white/5 bg-[#070B19]/60 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 w-40 sm:w-48"
            />
            <select className="px-2 py-1.5 rounded-lg border border-white/5 bg-[#070B19]/60 text-xs text-gray-400 focus:outline-none">
              <option>Top Match</option>
              <option>Recent</option>
            </select>
          </div>
        </div>

        {job.applicants.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {job.applicants.map((applicant) => (
              <ApplicantRowCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
            <p className="text-xs text-gray-400 mt-2">No new pending candidates listed in this processing queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
