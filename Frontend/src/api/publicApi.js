const BASE_URL = import.meta.env.VITE_API_URL || '';

/** No Authorization header anywhere in this file — that's the point. */
const call = async (path) => {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || `Request failed (${res.status})` };
    return data;
  } catch {
    return { success: false, message: 'Could not reach the server.' };
  }
};

export const getPublicInternships = () => call('/api/internships');
export const getPublicInternship  = (id) => call(`/api/internships/${id}`);
export const getPublicCompanies   = () => call('/api/public/companies');
export const getPublicCompany     = (id) => call(`/api/public/companies/${id}`);
export const searchPublic         = (q) => call(`/api/public/search?q=${encodeURIComponent(q)}`);
