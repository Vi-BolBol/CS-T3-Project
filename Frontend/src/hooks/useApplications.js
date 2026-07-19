import { useState, useCallback } from 'react';
import {
  getCompanyApplications,
  getInternshipApplicants,
  decideApplication,
} from '../api/companyApi';

/*
  The COMPANY's view of its applicants.
  (Distinct from useMyApplications.js, which is the STUDENT view.)

  This was backed entirely by src/data/mockApplicants.js — the applicant list,
  the CV shown for review, and Accept/Reject, which only ever console.logged.
  A company could click "Reject" all day and the student would never hear about
  it. The real endpoints have existed since Session B; this now uses them.

  The returned shape is kept identical to what the mock produced, so the pages
  rendering it did not have to change.
*/

const PALETTE = { name: 'Emerald', primary: '#34D399', dark: '#0F172A' };

/** Initials for the avatar tile — the API has no avatar field. */
const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?';

/**
 * Rough fit signal from the CV score when one exists.
 * Explicitly derived, not invented — a company should not be shown a precise
 * looking "87% match" that nothing actually computed.
 */
const matchFrom = (cv) => (typeof cv?.score === 'number' ? Math.round(cv.score) : null);

const normalize = (a) => {
  const profile = a.student?.studentProfile || {};
  const cvData = a.cv?.userCvData || null;
  const name = profile.fullName || a.student?.email || 'Applicant';

  return {
    id: a.id,
    applicationId: a.id,
    studentId: a.student?.id ?? null,
    name,
    avatar: initials(name),
    role: a.internship?.title || 'Applicant',
    university: profile.education || 'Not specified',
    email: a.student?.email || '',
    skills: profile.skills || '',
    bio: profile.bio || '',
    status: a.status,
    appliedAt: a.appliedAt,
    matchScore: matchFrom(a.cv),
    hasCv: Boolean(cvData),
    cvData,
    // The API stores the CV content, not the chosen template/palette, so review
    // always renders in Classic. Companies are reading it, not styling it.
    template: 'classic',
    palette: PALETTE,
  };
};

export default function useApplications() {
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /** Applicants for one listing, or every applicant when no id is given. */
  const fetchApplicants = useCallback(async (internshipId) => {
    setLoading(true);
    try {
      const res = internshipId
        ? await getInternshipApplicants(internshipId)
        : await getCompanyApplications();

      if (!res.success) return { success: false, message: res.message, applicants: [] };
      return { success: true, applicants: (res.applications || []).map(normalize) };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * One applicant, with their CV.
   * There is no single-application GET endpoint, so this pulls the company's
   * applicants and picks the one asked for — which also means the ownership
   * check on that endpoint applies here for free: a company cannot fetch an
   * applicant belonging to somebody else's listing.
   */
  const fetchApplicantCV = useCallback(async (applicationId) => {
    setLoading(true);
    try {
      const res = await getCompanyApplications();
      if (!res.success) return { success: false, message: res.message };

      const found = (res.applications || []).find(
        (a) => String(a.id) === String(applicationId)
      );
      if (!found) return { success: false, message: 'Applicant not found.' };

      return { success: true, applicant: normalize(found) };
    } finally {
      setLoading(false);
    }
  }, []);

  /** Accept / reject / mark reviewed. This is what lights up the student's badge. */
  const dispatchApplicationStatus = useCallback(async (applicationId, targetStatus) => {
    setProcessingId(applicationId);
    try {
      const res = await decideApplication(applicationId, targetStatus);
      if (!res.success) {
        console.error('Could not update application:', res.message);
        return false;
      }
      return true;
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
