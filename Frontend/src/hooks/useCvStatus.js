import { useState, useEffect, useCallback } from 'react';

/*
  Whether the student has a CV — gates Apply and drives the profile sync prompt.
  Now backed by the real API (POST /api/cv, GET /api/cv/mine), built in Session B.
  A local mirror is kept so the CV builder keeps working offline/mid-edit.
*/
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const KEY = 'if-cv-status';
const CV_KEY = 'if-cv-data';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const EMPTY = { hasCv: false, source: null, syncedToProfile: false, updatedAt: null };

function read() {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { ...EMPTY }; }
}

function write(next) {
  // Guarded on purpose. This key used to be written with the whole CV object
  // (photo included) stuffed into `source`, which blew the localStorage quota
  // and threw — killing the Finish CV handler before it could navigate.
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (err) {
    console.warn('[cv-status] could not persist status:', err?.name || err);
  }
  window.dispatchEvent(new Event('if-cv-changed'));
}

/**
 * Marks a CV as present locally.
 * `source` is a short string ('built' | 'uploaded') — nothing else.
 */
export function markCvCreated(source = 'built') {
  const label = typeof source === 'string' ? source : 'built';
  write({ ...read(), hasCv: true, source: label, updatedAt: new Date().toISOString() });
}

/**
 * Persists the CV to the database.
 *
 * Takes the CV object directly. It previously aliased `markCvCreated`, whose
 * only parameter is a *source string* — so callers passing `cvData` were writing
 * the entire CV (base64 photo and all) into the small status key. On any CV with
 * a photo that threw QuotaExceededError, the async handler rejected silently,
 * and the "Finish CV" button did nothing at all.
 *
 * Falls back to the locally mirrored CV when called with no argument.
 */
export async function saveCvToServer(cvData, source = 'built') {
  let payload = cvData;
  if (!payload || typeof payload !== 'object') {
    try { payload = JSON.parse(localStorage.getItem(CV_KEY) || 'null'); }
    catch { payload = null; }
  }

  if (!payload) {
    return { success: false, message: 'There is no CV to save yet.' };
  }

  // Mirror locally first so the CV survives a failed request.
  try { localStorage.setItem(CV_KEY, JSON.stringify(payload)); }
  catch (err) { console.warn('[cv] could not mirror CV locally:', err?.name || err); }
  markCvCreated(source);

  try {
    const res = await fetch(`${BASE_URL}/api/cv`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ userCvData: payload }),
    });

    if (res.status === 401) {
      return { success: false, message: 'Your session has expired. Please log in again.' };
    }

    const data = await res.json().catch(() => ({}));
    return {
      success: Boolean(data.success),
      message: data.message || (res.ok ? '' : 'Could not save your CV to the server.'),
    };
  } catch {
    // Offline / server down — the local mirror still marks the CV as present.
    return { success: false, message: 'Saved on this device only — the server was unreachable.' };
  }
}

export function markCvSynced() {
  write({ ...read(), syncedToProfile: true });
}

/** Maps the saved CV onto the student profile shape. */
export function getCvAsProfile() {
  try {
    const cv = JSON.parse(localStorage.getItem(CV_KEY) || 'null');
    if (!cv) return null;
    const p = cv.personal || {};
    const a = cv.about || {};
    const exp = cv.experience || {};
    const firstEdu = Array.isArray(exp.education) && exp.education[0] ? exp.education[0] : {};
    const firstLink = Array.isArray(a.links) && a.links[0] ? a.links[0] : {};

    return {
      fullName: p.fullName || '',
      location: p.location || '',
      email: p.email || '',
      bio: a.aboutMe || '',
      skills: Array.isArray(a.skills)
        ? a.skills.map((s) => (typeof s === 'string' ? s : s?.name || s?.label || '')).filter(Boolean).join(', ')
        : '',
      university: firstEdu.school || firstEdu.institution || firstEdu.university || '',
      portfolio: typeof firstLink === 'string' ? firstLink : firstLink.url || '',
      photo: cv.photo || null,
    };
  } catch {
    return null;
  }
}

export default function useCvStatus() {
  const [status, setStatus] = useState(read);

  const refresh = useCallback(() => setStatus(read()), []);

  // On mount, ask the server whether a CV exists — this is what makes a CV
  // follow the student across devices, which localStorage alone never did.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/cv/mine`, { headers: authHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data.success) return;
        if (data.cv) {
          if (data.cv.userCvData) {
            localStorage.setItem(CV_KEY, JSON.stringify(data.cv.userCvData));
          }
          const cur = read();
          if (!cur.hasCv) write({ ...cur, hasCv: true, updatedAt: data.cv.updatedAt });
          else setStatus(read());
        }
      } catch { /* offline — fall back to the local mirror */ }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('if-cv-changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('if-cv-changed', refresh);
    };
  }, [refresh]);

  return { ...status, refresh, markCvCreated, markCvSynced };
}
