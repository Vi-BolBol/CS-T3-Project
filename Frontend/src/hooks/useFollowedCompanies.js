import { useState, useCallback } from 'react';

const BASE_URL = '/api/student/followed-companies';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function useFollowedCompanies() {
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFollowed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL, { headers: authHeaders() });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || 'Failed to load followed companies.';
        setError(message);
        return { success: false, message, companies: [] };
      }

      setFollowedCompanies(data.companies || []);
      return { success: true, companies: data.companies || [] };
    } catch (err) {
      const message = 'Network error. Please check your connection and try again.';
      setError(message);
      return { success: false, message, companies: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const followCompany = useCallback(async (companyId) => {
    try {
      const response = await fetch(`${BASE_URL}/${companyId}`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to follow company.' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  const unfollowCompany = useCallback(async (companyId) => {
    try {
      const response = await fetch(`${BASE_URL}/${companyId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to unfollow company.' };
      }
      setFollowedCompanies((prev) => prev.filter((company) => company.id !== companyId));
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  return {
    followedCompanies,
    loading,
    error,
    fetchFollowed,
    followCompany,
    unfollowCompany,
  };
}
