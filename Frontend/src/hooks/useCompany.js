import { useState, useEffect } from 'react';
import { getCompanies } from '../services/companyService';

/**
 * Fetches the company directory once and hands back loading/error state.
 * Shared by every page that renders a company list (public directory,
 * student pipeline explorer, etc.) so they all read from one source.
 */
export default function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCompanies()
      .then((data) => {
        if (!cancelled) setCompanies(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load companies.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { companies, loading, error };
}