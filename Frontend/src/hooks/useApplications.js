import { useState, useCallback } from 'react';
import { toDisplayApplicant, toDisplayApplicantList, toDisplayMyApplicationList } from '../utils/applicationMapper';

const BASE_URL = '/api/applications';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function useApplications() {
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Company: fetch applicants for one of their internships
  // (GET /api/applications/internship/:internshipId).
  const fetchApplicants = useCallback(async (internshipId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'You must be signed in as a company to view applicants.', applicants: [] };
      }

      const response = await fetch(`${BASE_URL}/internship/${internshipId}`, { headers: authHeaders() });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to load applicants.', applicants: [] };
      }

      return { success: true, applicants: toDisplayApplicantList(data.applications) };
    } catch (err) {
      return { success: false, message: 'Network error. Please check your connection and try again.', applicants: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  // Company: fetch a single applicant's full detail, including CV data
  // (GET /api/applications/:id). Used by the CV review page.
  const fetchApplicantCV = useCallback(async (applicationId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'You must be signed in as a company to view this.' };
      }

      const response = await fetch(`${BASE_URL}/${applicationId}`, { headers: authHeaders() });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Applicant not found.' };
      }

      return { success: true, applicant: toDisplayApplicant(data.application) };
    } catch (err) {
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Student: fetch their own application history (GET /api/applications/mine).
  const fetchMyApplications = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'You must be signed in to view your applications.', applications: [] };
      }

      const response = await fetch(`${BASE_URL}/mine`, { headers: authHeaders() });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to load your applications.', applications: [] };
      }

      return { success: true, applications: toDisplayMyApplicationList(data.applications) };
    } catch (err) {
      return { success: false, message: 'Network error. Please check your connection and try again.', applications: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  // Student: apply to an internship (POST /api/applications).
  const applyToInternship = useCallback(async (internshipId, cvId = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'You must be signed in as a student to apply.' };
      }

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ internshipId, cvId }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to submit application.' };
      }

      return { success: true, application: data.application };
    } catch (err) {
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Company: accept/reject/mark-reviewed an applicant
  // (PATCH /api/applications/:id/status).
  const dispatchApplicationStatus = useCallback(async (applicationId, targetStatus) => {
    setProcessingId(applicationId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'You must be signed in as a company to do this.' };
      }

      const response = await fetch(`${BASE_URL}/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to update application status.' };
      }

      return { success: true, application: data.application };
    } catch (err) {
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    } finally {
      setProcessingId(null);
    }
  }, []);

  return {
    fetchApplicants,
    fetchApplicantCV,
    fetchMyApplications,
    applyToInternship,
    dispatchApplicationStatus,
    isProcessing: processingId !== null,
    processingId,
    loading,
  };
}
