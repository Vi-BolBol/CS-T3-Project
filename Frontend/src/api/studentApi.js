/*
  Student profile API.

  The profile used to live only in localStorage behind a TODO. That meant it
  never followed the student to another device, and a company opening an
  applicant's profile was shown its OWN cached profile — the page had no way to
  fetch anybody else's. These calls back the real endpoints.
*/
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const call = async (path, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/student${path}`, {
      headers: authHeaders(),
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: data.message || `Request failed (${res.status})` };
    return data;
  } catch {
    return { success: false, message: 'Could not reach the server.' };
  }
};

export const getMyStudentProfile = () => call('/profile');

export const updateMyStudentProfile = (body) =>
  call('/profile', { method: 'PUT', body: JSON.stringify(body) });

/** Another student's profile — used by companies and admins. */
export const getStudentProfileById = (id) => call(`/profile/${id}`);
