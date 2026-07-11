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
      <div className="rounded-2xl border border-dashed border-white/10 bg-raised/[0.01] p-12 text-center text-sm text-subtle">
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
                <span className="text-[10px] uppercase font-bold tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                  {job.category}
                </span>
              )}
              <span className="text-[10px] font-mono text-subtle">ID: {job.code}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-content mt-2 sm:text-3xl">{job.title}</h1>
            <p className="text-sm text-subtle mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{job.location}</span>
              <span className="h-1 w-1 rounded-full bg-raised/20" />
              <span>{job.workEnvironment}</span>
              <span className="h-1 w-1 rounded-full bg-raised/20" />
              <span className="text-accent font-semibold">{job.salaryRange}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button className="px-3 py-1.5 border border-white/10 rounded-lg bg-raised/5 text-xs text-subtle hover:bg-raised/10 transition">
              Share
            </button>
            <button
              type="button"
              onClick={handleToggleListing}
              disabled={togglingStatus}
              className={`px-3 py-1.5 border rounded-lg text-xs transition disabled:opacity-40 ${
                job.status === 'open'
                  ? 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                  : 'border-accent/20 text-accent bg-accent/5 hover:bg-accent/10'
              }`}
            >
              {togglingStatus ? 'Updating…' : job.status === 'open' ? 'Freeze Listing' : 'Resume Listing'}
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-subtle max-w-3xl">
          {job.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-subtle">
          <div>Posted: <span className="text-content">{job.postedDate}</span></div>
          <div>Volume: <span className="text-accent font-bold">{job.applicantsCount} total tracking profiles</span></div>
        </div>

        <div className="mt-6 flex items-center gap-1 border-b border-white/5 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-subtle hover:text-content'
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
