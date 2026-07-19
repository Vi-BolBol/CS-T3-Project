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
    const res = await fetch(`${BASE_URL}${path}`, { headers: headers(), ...options });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || `Request failed (${res.status})` };
    return data;
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
};

export const getMyNotifications = () => call('/api/notifications');
export const getUnreadNotifications = () => call('/api/notifications/unread');
export const getUnreadNotificationCount = () => call('/api/notifications/unread-count');
export const markNotificationRead = (id) =>
  call(`/api/notifications/${id}/read`, { method: 'PATCH' });
export const markAllNotificationsRead = () =>
  call('/api/notifications/read-all', { method: 'PATCH' });
