import React, { useState } from 'react';
import DetailsTab from './tabs/DetailsTab';
import ViewTab from './tabs/ViewTab';
import EditTab from './tabs/EditTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import useCompanyJobs from '../../../hooks/useCompanyJobs';

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'view', label: 'View' },
  { id: 'edit', label: 'Edit' },
  { id: 'analytics', label: 'Analytics' },
];

export default function SelectedJobView({ job, onJobUpdated }) {
  const [activeTab, setActiveTab] = useState('view');
  const { updateInternship, loading: togglingStatus } = useCompanyJobs();

  if (!job) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center text-sm text-gray-400">
        Select a job from the list to view its details.
      </div>
    );
  }

  const handleToggleListing = async () => {
    const nextStatus = job.status === 'open' ? 'closed' : 'open';
    const result = await updateInternship(job.id, { status: nextStatus });
    if (result.success) onJobUpdated?.();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111B34]/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <div className="border-b border-white/5 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {job.category && (
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {job.category}
                </span>
              )}
              <span className="text-[10px] font-mono text-gray-500">ID: {job.code}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-2 sm:text-3xl">{job.title}</h1>
            <p className="text-sm text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{job.location}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>{job.workEnvironment}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-emerald-400 font-semibold">{job.salaryRange}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button className="px-3 py-1.5 border border-white/10 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10 transition">
              Share
            </button>
            <button
              type="button"
              onClick={handleToggleListing}
              disabled={togglingStatus}
              className={`px-3 py-1.5 border rounded-lg text-xs transition disabled:opacity-40 ${
                job.status === 'open'
                  ? 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                  : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
              }`}
            >
              {togglingStatus ? 'Updating…' : job.status === 'open' ? 'Freeze Listing' : 'Resume Listing'}
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

        <div className="mt-6 flex items-center gap-1 border-b border-white/5 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'details' && <DetailsTab job={job} />}
        {activeTab === 'view' && <ViewTab job={job} />}
        {activeTab === 'edit' && <EditTab job={job} onSaved={onJobUpdated} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}
