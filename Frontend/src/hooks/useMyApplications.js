import { useState, useEffect, useCallback } from 'react';

/*
  The STUDENT's own applications ("internships I applied to").
  Now backed by the real API — /api/applications was built in Session B.
  (Distinct from useApplications.js, which is the COMPANY view.)
*/
const BASE_URL = import.meta.env.VITE_API_URL || '';
const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/*
  Flatten the API shape into what the UI renders.

  `displayTitle` / `displayCompany` come from the server already resolved: for a
  live listing they're read off the relation, and for one whose company was
  deleted they're read off the tombstone snapshot (the relation is null by then).
  Reading `a.internship?.title` alone would show "Untitled internship" for every
  removed listing.
*/
const normalize = (a) => ({
  id: a.id,
  internshipId: a.internshipId,
  title: a.displayTitle || a.internship?.title || a.internshipTitle || 'Untitled internship',
  companyName: a.displayCompany || a.internship?.company?.companyName || a.companyName || 'Unknown company',
  companyId: a.internship?.company?.id ?? null,
  location: a.internship?.location || 'Not specified',
  status: a.status,
  appliedAt: a.appliedAt,
  decidedAt: a.decidedAt || null,

  // How the company/listing behind this application is doing.
  // 'active' | 'suspended' | 'listing_suspended' | 'deleted'
  companyState: a.companyState || 'active',
  companyStateReason: a.companyStateReason || null,
  companyStateUntil: a.companyStateUntil || null,
  companyStateAt: a.companyStateAt || null,
});

export default function useMyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/applications/mine`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Could not load applications');
        return { success: false };
      }
      const list = (data.applications || []).map(normalize);
      setApplications(list);
      window.dispatchEvent(new Event('if-applications-changed'));
      return { success: true, applications: list };
    } catch (err) {
      setError('Could not reach the server');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const hasApplied = useCallback(
    (internshipId) => applications.some((a) => a.internshipId === internshipId),
    [applications]
  );

  const apply = useCallback(async (internship) => {
    try {
      const res = await fetch(`${BASE_URL}/api/applications`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ internshipId: internship.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Could not apply' };
      }
      await fetchApplications();
      return { success: true, application: data.application };
    } catch {
      return { success: false, message: 'Could not reach the server' };
    }
  }, [fetchApplications]);

  const withdraw = useCallback(async (applicationId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/applications/${applicationId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Could not withdraw' };
      }
      await fetchApplications();
      return { success: true };
    } catch {
      return { success: false, message: 'Could not reach the server' };
    }
  }, [fetchApplications]);

  return { applications, loading, error, fetchApplications, apply, withdraw, hasApplied };
}
