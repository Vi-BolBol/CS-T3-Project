import { useState, useEffect, useCallback, useRef } from 'react';

/*
  Re-validates the signed-in account against the database.

  `protect` on the server only verifies the JWT signature — it does not re-read
  the user row. That is a deliberate performance choice, but on its own it means
  an admin's "Suspend" click does nothing to a user who is already signed in
  until their token expires (up to a full day).

  This closes that gap from the client side: the check runs on mount, on every
  route change, and when the tab regains focus. Combined with `enforceStatus` on
  the server's sensitive routes, a suspension or deletion takes hold within one
  navigation instead of one day.
*/
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const SESSION_EVENT = 'if-session-invalid';

function clearSession() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch { /* ignore */ }
}

/** Wipes everything this device cached for the signed-out account. */
export function wipeLocalAccountData() {
  const KEYS = [
    'token', 'user',
    'if-cv-data', 'if-cv-steps', 'if-cv-status',
    'if-applications', 'if-app-seen',
    'if-saved-internships', 'if-followed-companies',
  ];
  KEYS.forEach((k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
}

/**
 * Asks the server whether this session is still valid.
 * Returns { valid, reason, suspension } — or null if the server was unreachable
 * (we never sign someone out just because their wifi dropped).
 */
export async function checkSession() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // An invalid/expired token is a normal signed-out state, not a suspension.
    if (res.status === 401) {
      clearSession();
      return { valid: false, reason: 'expired' };
    }
    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.success) return null;
    return data;
  } catch {
    // Offline — say nothing rather than locking the user out of their own app.
    return null;
  }
}

export default function useSessionGuard(pathname) {
  const [blocked, setBlocked] = useState(null); // { reason, suspension } | null
  const running = useRef(false);

  const run = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      const result = await checkSession();
      if (!result) return;

      if (result.valid) {
        setBlocked(null);
        return;
      }

      if (result.reason === 'deleted') {
        // The account is gone. Everything cached about it goes with it.
        wipeLocalAccountData();
        setBlocked({ reason: 'deleted' });
      } else if (result.reason === 'suspended' || result.reason === 'inactive') {
        // The token is kept: the suspension screen needs it to keep polling, and
        // a timed suspension should let the user straight back in when it lifts.
        setBlocked({ reason: result.reason, suspension: result.suspension || null });
      } else {
        setBlocked(null);
      }
    } finally {
      running.current = false;
    }
  }, []);

  // On mount and on every navigation.
  useEffect(() => { run(); }, [run, pathname]);

  // And when the tab comes back into view, so a long-idle tab doesn't sit stale.
  useEffect(() => {
    const onFocus = () => { if (document.visibilityState === 'visible') run(); };
    window.addEventListener('visibilitychange', onFocus);
    window.addEventListener('focus', onFocus);
    const onForced = () => run();
    window.addEventListener(SESSION_EVENT, onForced);
    return () => {
      window.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener(SESSION_EVENT, onForced);
    };
  }, [run]);

  const dismiss = useCallback(() => {
    wipeLocalAccountData();
    setBlocked(null);
  }, []);

  return { blocked, recheck: run, dismiss };
}
