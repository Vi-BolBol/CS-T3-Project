import { useState, useEffect, useCallback } from 'react';

/*
  Badge on the Applications nav item.

  This used to count from a localStorage key (`if-applications`) that nothing
  ever wrote to — `useMyApplications` fetches from the API and never mirrored its
  result there. The count was therefore permanently zero, so a student was never
  told their application had been accepted or rejected.

  It is now server-backed: `seenAt` lives on the application row, which also
  means the badge follows the student across devices instead of resetting.

  Counts both kinds of news:
    - an accept/reject decision they haven't opened yet
    - a listing that was removed out from under them (company deleted/suspended)
*/
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const POLL_MS = 60000;

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function useApplicationAlerts() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('token')) { setCount(0); return; }
    try {
      const res = await fetch(`${BASE_URL}/api/applications/alerts`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success) setCount(Number(data.unseen) || 0);
    } catch { /* offline — leave the last known count alone */ }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    const onChange = () => refresh();
    window.addEventListener('if-applications-changed', onChange);
    window.addEventListener('focus', onChange);
    return () => {
      clearInterval(timer);
      window.removeEventListener('if-applications-changed', onChange);
      window.removeEventListener('focus', onChange);
    };
  }, [refresh]);

  /** Called when the student opens the Applications page. */
  const clear = useCallback(async () => {
    setCount(0);   // optimistic — the badge should vanish on the click, not after a round trip
    try {
      await fetch(`${BASE_URL}/api/applications/seen`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      });
    } catch { /* it will clear on the next successful call */ }
    refresh();
  }, [refresh]);

  return { count, refresh, clear };
}
