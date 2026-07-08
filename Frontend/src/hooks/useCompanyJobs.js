import { useState, useCallback, useEffect } from 'react';
import { getPostedJobs, publishNewJob as publishNewJobService } from '../services/jobService';

/**
 * Owns the "posted jobs" list plus the publish mutation, both backed by
 * jobService. Pages just call refresh()/publishNewJob() and read state.
 */
export default function useCompanyJobs({ autoFetch = false } = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPostedJobs();
      setJobs(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load posted jobs.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const publishNewJob = useCallback(async (jobPayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await publishNewJobService(jobPayload);
      return result;
    } catch (err) {
      setError(err.message || "Failed to broadcast your vacancy deployment.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchJobs();
  }, [autoFetch, fetchJobs]);

  return {
    jobs,
    fetchJobs,
    publishNewJob,
    loading,
    error
  };
}