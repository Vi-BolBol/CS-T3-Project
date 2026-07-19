const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const headers = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const call = async (path, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { headers: headers(), ...options });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || `Request failed (${res.status})` };
    return data;
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
};

/* Company profile + analytics */
export const getMyCompany   = () => call('/api/company/profile');
export const updateMyCompany = (body) =>
  call('/api/company/profile', { method: 'PUT', body: JSON.stringify(body) });
export const getMyStats     = () => call('/api/company/stats');
export const getConnections = () => call('/api/company/connections');
export const searchAll      = (q) => call(`/api/company/search?q=${encodeURIComponent(q)}`);
export const getStudentDirectory = () => call('/api/company/students');

/* Applicants (built in Session B) */
export const getCompanyApplications = () => call('/api/applications/company');
export const getInternshipApplicants = (internshipId) =>
  call(`/api/applications/internship/${internshipId}`);
export const decideApplication = (id, status) =>
  call(`/api/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
