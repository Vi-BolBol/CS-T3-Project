import { useState, useEffect, useCallback } from 'react';

/*
  Whether the student has a CV — gates Apply and drives the profile sync prompt.
  Now backed by the real API (POST /api/cv, GET /api/cv/mine), built in Session B.
  A local mirror is kept so the CV builder keeps working offline/mid-edit.
*/
const BASE_URL = import.meta.env.VITE_API_URL || '';
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
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('if-cv-changed'));
}

/** Save the CV to the database. Call when a CV is built or uploaded. */
export async function markCvCreated(source = 'built') {
  write({ ...read(), hasCv: true, source, updatedAt: new Date().toISOString() });

  try {
    const userCvData = JSON.parse(localStorage.getItem(CV_KEY) || 'null');
    if (!userCvData) return { success: false };
    const res = await fetch(`${BASE_URL}/api/cv`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ userCvData }),
    });
    const data = await res.json();
    return { success: Boolean(data.success) };
  } catch {
    // Offline / server down — the local mirror still marks the CV as present.
    return { success: false };
  }
}

/** Alias kept for the CV pages that import this name. */
export const saveCvToServer = markCvCreated;

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
