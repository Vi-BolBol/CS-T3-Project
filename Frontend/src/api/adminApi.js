const BASE_URL = import.meta.env.VITE_API_URL || '';

const headers = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const call = async (path, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/admin${path}`, { headers: headers(), ...options });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || `Request failed (${res.status})` };
    return data;
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
};

export const getStats        = () => call('/stats');
export const getUsers        = (q = {}) => call(`/users?${new URLSearchParams(q)}`);
export const getAuditLogs    = (q = {}) => call(`/audit-logs?${new URLSearchParams(q)}`);
export const getSuspicious   = () => call('/suspicious');
export const setUserStatus   = (id, status) =>
  call(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteUser      = (id) => call(`/users/${id}`, { method: 'DELETE' });
