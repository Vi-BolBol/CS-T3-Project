import React from 'react';

export default function DetailsTab({ job }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Full Description</h3>
        <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
          {job.description || 'No description provided.'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/5 bg-[#070B19]/50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Department</p>
          <p className="text-xs font-semibold text-white mt-1">{job.category || '—'}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#070B19]/50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Work Environment</p>
          <p className="text-xs font-semibold text-white mt-1">{job.workEnvironment}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#070B19]/50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Duration</p>
          <p className="text-xs font-semibold text-white mt-1">
            {job.durationValue ? `${job.durationValue} ${job.durationUnit}` : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#070B19]/50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Compensation</p>
          <p className="text-xs font-semibold text-emerald-400 mt-1">{job.salaryRange}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Required Skills</h3>
        {job.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span key={skill} className="text-[11px] bg-[#070B19]/60 border border-white/5 text-gray-300 px-2.5 py-1 rounded-lg font-medium">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No skills listed.</p>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Responsibilities</h3>
        {job.responsibilities.length > 0 ? (
          <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
            {job.responsibilities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">No responsibilities listed.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-4 border-t border-white/5">
        <div>Listing ID: <span className="text-gray-200 font-mono">{job.code}</span></div>
        <div>Posted: <span className="text-gray-200">{job.postedDate}</span></div>
        <div>Plan: <span className="text-gray-200 capitalize">{job.plan || 'standard'}</span></div>
      </div>
    </div>
  );
}
