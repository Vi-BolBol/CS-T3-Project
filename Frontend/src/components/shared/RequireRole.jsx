import { Navigate, useLocation } from 'react-router-dom';

/**
 * Client-side route gate.
 *
 * CONVENIENCE, NOT SECURITY — anyone can edit localStorage. The real boundary is
 * server-side: every protected API route runs `protect + authorize(role)`, so a
 * forged local role gets a 403 and the page renders nothing useful. What this
 * fixes is the *routing*: before it, a logged-out visitor could open /user/home
 * or /company/dashboard and watch every fetch 401 into an empty shell, and a
 * student could sit on /company/dashboard.
 *
 * Wrong role -> their own home. Not logged in -> login, with ?next= so they come
 * back where they were headed.
 */
const HOME_FOR = { student: '/user/home', company: '/company/home', admin: '/admin' };

export default function RequireRole({ roles, children }) {
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch { /* malformed */ }
  const token = localStorage.getItem('token');

  if (!token || !user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={HOME_FOR[user.role] || '/'} replace />;
  }

  return children;
}
