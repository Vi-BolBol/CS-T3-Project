import { useState, useCallback } from 'react';

const BASE_URL = '/api/internships';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function useCompanyJobs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const publishNewJob = useCallback(async (jobPayload) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'You must be signed in as a company to post an internship.';
        setError(message);
        return { success: false, message };
      }

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const firstFieldError = data.errors ? Object.values(data.errors)[0] : null;
        const message = firstFieldError || data.message || 'Failed to publish internship.';
        setError(message);
        return { success: false, message, errors: data.errors };
      }

      return { success: true, internship: data.internship };
    } catch (err) {
      const message = 'Network error. Please check your connection and try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetches all internships owned by the signed-in company (GET /api/internships/mine).
  const fetchMyInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'You must be signed in as a company to view your dashboard.';
        setError(message);
        return { success: false, message, internships: [] };
      }

      const response = await fetch(`${BASE_URL}/mine`, { headers: authHeaders() });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || 'Failed to load your internships.';
        setError(message);
        return { success: false, message, internships: [] };
      }

      return { success: true, internships: data.internships || [] };
    } catch (err) {
      const message = 'Network error. Please check your connection and try again.';
      setError(message);
      return { success: false, message, internships: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetches a single internship by id (GET /api/internships/:id).
  const fetchInternship = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { headers: authHeaders() });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || 'Failed to load internship.';
        setError(message);
        return { success: false, message };
      }

      return { success: true, internship: data.internship };
    } catch (err) {
      const message = 'Network error. Please check your connection and try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Updates an internship (PUT /api/internships/:id). Used by the Edit tab
  // and by quick actions like pausing/resuming a listing.
  const updateInternship = useCallback(async (id, updatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'You must be signed in as a company to edit this listing.';
        setError(message);
        return { success: false, message };
      }

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || 'Failed to update internship.';
        setError(message);
        return { success: false, message };
      }

      return { success: true, internship: data.internship };
    } catch (err) {
      const message = 'Network error. Please check your connection and try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    publishNewJob,
    fetchMyInternships,
    fetchInternship,
    updateInternship,
    loading,
    error,
  };
}
