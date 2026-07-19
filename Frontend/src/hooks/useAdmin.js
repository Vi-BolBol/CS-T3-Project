import { useState, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* All /api/admin/* routes are gated by protect + authorize("admin") server-side.
   The frontend guard is convenience only — the server is the real boundary. */
export default function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (path, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/admin${path}`, {
        headers: authHeaders(),
        ...options,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data.message || `Request failed (${res.status})`;
        setError(msg);
        return { success: false, message: msg };
      }
      return data;
    } catch {
      const msg = 'Could not reach the server';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(() => call('/stats'), [call]);

  const getUsers = useCallback((filters = {}) => {
    const qs = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v && v !== 'all')
    ).toString();
    return call(`/users${qs ? `?${qs}` : ''}`);
  }, [call]);

  const setUserStatus = useCallback(
    (id, status) =>
      call(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    [call]
  );

  const getAuditLogs = useCallback((limit = 100) => call(`/audit-logs?limit=${limit}`), [call]);

  return { loading, error, getStats, getUsers, setUserStatus, getAuditLogs };
}
