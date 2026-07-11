import { useState, useEffect, useCallback } from 'react';

/* Drives the badge on the Applications nav item.
   Counts applications whose status changed to accepted/rejected and
   haven't been seen yet. Reads the same local store as useMyApplications.
   TODO(backend): replace with a `seen` flag on GET /api/applications/mine.
   Keep the { count, refresh, clear } shape and the navbar won't change. */
const APPS_KEY = 'if-applications';
const SEEN_KEY = 'if-app-seen';

function computeCount() {
  try {
    const apps = JSON.parse(window.localStorage.getItem(APPS_KEY) || '[]');
    const seen = JSON.parse(window.localStorage.getItem(SEEN_KEY) || '[]');
    return apps.filter(
      (a) => (a.status === 'accepted' || a.status === 'rejected') && !seen.includes(a.id)
    ).length;
  } catch {
    return 0;
  }
}

export default function useApplicationAlerts() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => setCount(computeCount()), []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener('storage', onChange);
    window.addEventListener('if-applications-changed', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('if-applications-changed', onChange);
    };
  }, [refresh]);

  // Called when the student opens the Applications page.
  const clear = useCallback(() => {
    try {
      const apps = JSON.parse(window.localStorage.getItem(APPS_KEY) || '[]');
      window.localStorage.setItem(SEEN_KEY, JSON.stringify(apps.map((a) => a.id)));
    } catch { /* ignore */ }
    setCount(0);
  }, []);

  return { count, refresh, clear };
}
