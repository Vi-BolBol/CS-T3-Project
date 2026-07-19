import { useState, useEffect, useCallback } from 'react';
import { getCompanyApplications } from '../api/companyApi';

/*
  Badge on the company's Internships tab: how many applicants have arrived
  since the company last looked. "Seen" is tracked locally by application id.
*/
const SEEN_KEY = 'if-company-seen-applicants';

export default function useApplicantAlerts() {
  const [count, setCount] = useState(0);
  const [applications, setApplications] = useState([]);

  const refresh = useCallback(async () => {
    const res = await getCompanyApplications();
    if (!res.success) return;
    const apps = res.applications || [];
    setApplications(apps);

    let seen = [];
    try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { /* ignore */ }
    setCount(apps.filter((a) => !seen.includes(a.id)).length);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const markAllSeen = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(applications.map((a) => a.id)));
    } catch { /* ignore */ }
    setCount(0);
  }, [applications]);

  return { count, applications, refresh, markAllSeen };
}
