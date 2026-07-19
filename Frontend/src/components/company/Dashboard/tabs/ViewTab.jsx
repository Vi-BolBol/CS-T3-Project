import React, { useEffect, useState, useMemo } from 'react';
import ApplicantRowCard from '../ApplicantRowCard';
import useApplications from '../../../../hooks/useApplications';

export default function ViewTab({ job }) {
  const { fetchApplicants, loading } = useApplications();
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    let cancelled = false;
    setApplicants([]);
    fetchApplicants(job.id).then((result) => {
      if (!cancelled && result.success) setApplicants(result.applicants);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id]);

  const visibleApplicants = useMemo(() => {
    let list = applicants.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.university.toLowerCase().includes(search.toLowerCase())
    );
    // Sorting by "match" is gone with the score it depended on. Recency and
    // review status are things the platform actually knows.
    if (sort === 'status') {
      const ORDER = { pending: 0, reviewed: 1, accepted: 2, rejected: 3 };
      list = [...list].sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9));
    } else {
      list = [...list].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    }
    return list;
  }, [applicants, search, sort]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-content">New Applicants</h3>
          <p className="text-[11px] text-subtle">Open a CV to review it, then accept or reject.</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants..."
            className="px-3 py-1.5 rounded-lg border border-line bg-surface/60 text-xs text-content placeholder:text-faint focus:outline-none focus:border-accent/40 w-40 sm:w-48"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-line bg-surface/60 text-xs text-subtle focus:outline-none"
          >
            <option value="recent">Most recent</option>
            <option value="status">Review status</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 border border-dashed border-line rounded-xl bg-raised/[0.01]">
          <p className="text-xs text-subtle">Loading applicants…</p>
        </div>
      ) : visibleApplicants.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleApplicants.map((applicant) => (
            <ApplicantRowCard key={applicant.id} applicant={applicant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-line rounded-xl bg-raised/[0.01]">
          <p className="text-xs text-subtle mt-2">No new pending candidates listed in this processing queue.</p>
        </div>
      )}
    </div>
  );
}
