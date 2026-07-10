import { useState, useCallback } from 'react';
import { toPublicListing, toPublicListingList } from '../utils/internshipMapper';

const BASE_URL = '/api/internships';

export default function usePublicInternships() {
  const [loading, setLoading] = useState(false);

  // Public browse/search — no auth required.
  const searchInternships = useCallback(async ({ search = '', location = '' } = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (location) params.set('location', location);

      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to load internships.', listings: [] };
      }

      return { success: true, listings: toPublicListingList(data.internships) };
    } catch (err) {
      return { success: false, message: 'Network error. Please check your connection and try again.', listings: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  // Single listing by id — used when a student opens a specific internship
  // (e.g. from a "Quick Apply" link) rather than browsing search results.
  const getInternshipById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Internship not found.', listing: null };
      }

      return { success: true, listing: toPublicListing(data.internship) };
    } catch (err) {
      return { success: false, message: 'Network error. Please check your connection and try again.', listing: null };
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchInternships, getInternshipById, loading };
}
