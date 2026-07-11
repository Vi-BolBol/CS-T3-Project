import { Navigate } from 'react-router-dom';

/**
 * Client-side gate for the admin area.
 *
 * This is CONVENIENCE, not security — anyone can edit localStorage. The real
 * enforcement is server-side: every /api/admin route runs
 * `protect + authorize("admin")`, so a forged local role gets 403 and the pages
 * render nothing. Never rely on this component alone.
 */
export default function RequireAdmin({ children }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch { /* malformed */ }

  const token = localStorage.getItem('token');

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
