import React, { useEffect, useState, useCallback } from 'react';
import PostedJobsList from '../../components/company/Dashboard/postedjobsList';
import SelectedJobView from '../../components/company/Dashboard/SelectedJobView';
import useCompanyJobs from '../../hooks/useCompanyJobs';
import { toDisplayJobList } from '../../utils/internshipMapper';

export default function CompanyDashboard() {
  const { fetchMyInternships, loading, error } = useCompanyJobs();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const loadInternships = useCallback(async () => {
    const result = await fetchMyInternships();
    if (result.success) {
      const displayJobs = toDisplayJobList(result.internships);
      setJobs(displayJobs);
      setSelectedJobId((prev) => prev ?? displayJobs[0]?.id ?? null);
      setLoadError(null);
    } else {
      setLoadError(result.message);
    }
  }, [fetchMyInternships]);

  useEffect(() => {
    loadInternships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeJob = jobs.find((job) => job.id === selectedJobId) || jobs[0] || null;

  return (
    <div className="flex flex-1 flex-col bg-surface text-content">

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && jobs.length === 0 ? (
          <div className="rounded-2xl border border-line bg-raised p-10 text-center text-sm text-subtle">
            Loading your internships…
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-10 text-center">
            <p className="text-sm text-rose-400 font-medium">{loadError}</p>
            <button
              type="button"
              onClick={loadInternships}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-accent text-accent-ink hover:bg-accent transition"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-raised/[0.01] p-12 text-center">
            <p className="text-sm text-subtle font-semibold">No internships posted yet</p>
            <p className="text-xs text-subtle mt-1">Once you publish a listing, it will show up here alongside its applicants.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <PostedJobsList
                jobs={jobs}
                selectedJobId={activeJob?.id}
                onSelectJob={setSelectedJobId}
              />
            </div>

            <div className="lg:col-span-8">
              <SelectedJobView job={activeJob} onJobUpdated={loadInternships} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
