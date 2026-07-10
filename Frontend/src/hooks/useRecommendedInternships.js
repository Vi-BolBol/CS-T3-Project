import { useState, useCallback } from 'react';

const BASE_URL = '/api/student/recommended-internships';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function useRecommendedInternships() {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommended = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL, { headers: authHeaders() });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || 'Failed to load recommendations.';
        setError(message);
        return { success: false, message, internships: [] };
      }

      setRecommended(data.internships || []);
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
    recommended,
    loading,
    error,
    fetchRecommended,
  };
}
