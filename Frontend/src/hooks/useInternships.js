import { useState, useCallback } from 'react';

const BASE_URL = '/api/internships';

export default function useInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetches all publicly listed (open) internships — no auth required.
  const fetchInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || 'Failed to load internships.';
        setError(message);
        return { success: false, message, internships: [] };
      }

      setInternships(data.internships || []);
      return { success: true, internships: data.internships || [] };
    } catch (err) {
      const message = 'Network error. Please check your connection and try again.';
      setError(message);
      return { success: false, message, internships: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    internships,
    fetchInternships,
    loading,
    error,
  };
}