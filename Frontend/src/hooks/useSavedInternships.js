import { useState, useCallback } from 'react';

const BASE_URL = '/api/student/saved-internships';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function useSavedInternships() {
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL, { headers: authHeaders() });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || 'Failed to load saved internships.';
        setError(message);
        return { success: false, message, internships: [] };
      }

      setSavedInternships(data.internships || []);
      return { success: true, internships: data.internships || [] };
    } catch (err) {
      const message = 'Network error. Please check your connection and try again.';
      setError(message);
      return { success: false, message, internships: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const saveInternship = useCallback(async (internshipId) => {
    try {
      const response = await fetch(`${BASE_URL}/${internshipId}`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to save internship.' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  const unsaveInternship = useCallback(async (internshipId) => {
    try {
      const response = await fetch(`${BASE_URL}/${internshipId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to remove saved internship.' };
      }
      setSavedInternships((prev) => prev.filter((job) => job.id !== internshipId));
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  return {
    savedInternships,
    loading,
    error,
    fetchSaved,
    saveInternship,
    unsaveInternship,
  };
}
