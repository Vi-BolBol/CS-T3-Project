import { useState, useCallback } from 'react';
import { getApplicantsForInternship, getApplicantById } from '../data/mockApplicants';

// TEMPORARY: backed by mock data (see src/data/mockApplicants.js) until the
// backend exposes /api/internships/:id/applicants and
// /api/applications/:id endpoints. The async shape here matches what real
// fetch calls will look like, so callers won't need to change.
export default function useApplications() {
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchApplicants = useCallback(async (internshipId) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return { success: true, applicants: getApplicantsForInternship(internshipId) };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplicantCV = useCallback(async (applicantId) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const applicant = getApplicantById(applicantId);
      if (!applicant) {
        return { success: false, message: 'Applicant not found.' };
      }
      return { success: true, applicant };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mutation handler to advance a candidate's pipeline tracking node state
  const dispatchApplicationStatus = useCallback(async (applicantId, targetStatus) => {
    setProcessingId(applicantId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Candidate #${applicantId} moved to status: ${targetStatus}`);
      return true;
    } catch (error) {
      console.error('Pipeline transition failure:', error);
      return false;
    } finally {
      setProcessingId(null);
    }
  }, []);

  return {
    fetchApplicants,
    fetchApplicantCV,
    dispatchApplicationStatus,
    isProcessing: processingId !== null,
    processingId,
    loading,
  };
}
