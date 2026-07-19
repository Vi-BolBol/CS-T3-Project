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

/**
 * Builds a query string, dropping keys with no real value.
 *
 * `new URLSearchParams({ role: undefined })` does NOT skip the key — it
 * stringifies it to the literal text "undefined". That reached the server as
 * role="undefined", which Prisma then tried to match against the UserRole enum
 * and threw on, producing a 500 on a page that had no filters set at all.
 */
const qs = (params = {}) => {
  const clean = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '' && v !== 'undefined' && v !== 'null'
  );
  const s = new URLSearchParams(Object.fromEntries(clean)).toString();
  return s ? `?${s}` : '';
};

export const getStats        = () => call('/stats');
export const getUsers        = (q = {}) => call(`/users${qs(q)}`);
export const getAuditLogs    = (q = {}) => call(`/audit-logs${qs(q)}`);
export const getSuspicious   = () => call('/suspicious');
/**
 * Suspending requires a reason. `days` may be a number, or omitted/'permanent'
 * for an indefinite suspension.
 */
export const setUserStatus   = (id, status, { reason, days } = {}) =>
  call(`/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason, days }),
  });

/** `reason` is stamped onto the affected students' application tombstones. */
export const deleteUser      = (id, { reason } = {}) =>
  call(`/users/${id}`, { method: 'DELETE', body: JSON.stringify({ reason }) });

/* ---------- Per-user drill-down ---------- */
export const getUserDetail      = (id) => call(`/users/${id}`);
export const getUserActivity    = (id, q = {}) => call(`/users/${id}/activity${qs(q)}`);
export const getUserInternships = (id) => call(`/users/${id}/internships`);
export const getUserCv          = (id) => call(`/users/${id}/cv`);

/* ---------- Moderating one listing ---------- */
export const setInternshipStatus = (id, status, reason) =>
  call(`/internships/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
  });
export const deleteInternship    = (id, reason) =>
  call(`/internships/${id}`, { method: 'DELETE', body: JSON.stringify({ reason }) });
