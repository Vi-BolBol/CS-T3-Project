import React, { useEffect, useState, useCallback } from 'react';
import CompanyNavbar from '../../components/layout/CompanyNavbar';
import CompanyFooter from '../../components/layout/CompanyFooter';
import PostedJobsList from '../../components/company/Dashboard/PostedJobsList';
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
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-[#070B19]">
      <CompanyNavbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && jobs.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#111B34]/40 p-10 text-center text-sm text-gray-400">
            Loading your internships…
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-10 text-center">
            <p className="text-sm text-rose-400 font-medium">{loadError}</p>
            <button
              type="button"
              onClick={loadInternships}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center">
            <p className="text-sm text-gray-300 font-semibold">No internships posted yet</p>
            <p className="text-xs text-gray-500 mt-1">Once you publish a listing, it will show up here alongside its applicants.</p>
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

      <CompanyFooter />
    </div>
  );
}
