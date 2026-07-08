import { useState, useEffect } from 'react';
import { getCompanyById, getCompanyInternships } from '../services/companyService';

/**
 * Fetches a single company plus its internship listings together, since
 * the company detail page always needs both.
 */
export default function useCompanyDetail(companyId) {
  const [company, setCompany] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getCompanyById(companyId), getCompanyInternships(companyId)])
      .then(([companyData, internshipData]) => {
        if (cancelled) return;
        setCompany(companyData);
        setInternships(internshipData);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load company.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  return { company, internships, loading, error };
}