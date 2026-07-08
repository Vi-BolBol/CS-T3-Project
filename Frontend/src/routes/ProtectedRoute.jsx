import { Navigate } from "react-router-dom";

/**
 * Lightweight role guard. Reads the logged-in user from localStorage
 * (set by authService on login) — swap this for real auth/session state
 * (context, redux, query cache, whatever) once that's built out.
 *
 * `role={null}` means "no restriction" — anyone (including logged-out
 * visitors) can view the route.
 */
export default function ProtectedRoute({ role, children }) {
  if (!role) return children;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return children;
}