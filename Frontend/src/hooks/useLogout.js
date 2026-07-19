import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * One logout path for student / company / admin.
 *
 * Logging out lands on the PUBLIC HOME ("/"), not "/login" — a logged-out
 * visitor should be able to look around the product first. `replace: true`
 * drops the authenticated page from history, so Back doesn't bounce them
 * into a dead dashboard that immediately 401s.
 */
export default function useLogout() {
  const navigate = useNavigate();

  return useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Per-device caches keyed to the account — leaving these behind leaks the
    // previous user's CV/applications into the next login on a shared machine.
    ['if-cv-data', 'if-cv-steps', 'if-cv-status', 'if-student-profile',
     'if-applications', 'if-app-seen', 'if-applicants-seen'].forEach((k) =>
      localStorage.removeItem(k)
    );
    window.dispatchEvent(new Event('if-cv-changed'));
    window.dispatchEvent(new Event('if-applications-changed'));
    navigate('/', { replace: true });
  }, [navigate]);
}
