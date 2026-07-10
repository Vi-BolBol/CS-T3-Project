// Translates the real backend Application shape (Prisma model, includes
// nested student/studentProfile/cv/internship) into the flat shape the
// dashboard UI components (ApplicantRowCard, ApplicantCVReview, the student
// UserApplication page) were built against back when they read from
// data/mockApplicants.js. Keeping the translation here means the UI
// components didn't need to change when the mock was swapped for a real
// fetch — only this file did.

function initialsFromName(name) {
  if (!name) return '—';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

// A student's CV isn't persisted to the database yet (see README "Known
// Issues" — CVBuilderContext only writes to localStorage), so `cv` will
// almost always be null right now. matchScore falls back to null rather
// than a fabricated number so the UI can show "Not scored yet" instead of
// a misleading placeholder.
const DEFAULT_PALETTE = { name: 'Emerald', primary: '#34D399', dark: '#0F172A' };

export function toDisplayApplicant(application) {
  const profile = application.student?.studentProfile;
  const fullName = profile?.fullName || application.student?.email || 'Unnamed applicant';

  return {
    id: application.id,
    studentId: application.studentId,
    internshipId: application.internshipId,
    cvId: application.cvId,
    status: application.status,
    appliedAt: application.appliedAt,
    matchScore: application.cv?.score != null ? Number(application.cv.score) : null,
    name: fullName,
    role: profile?.education || 'Student',
    university: profile?.education || 'Not specified',
    avatar: initialsFromName(fullName),
    // CVs aren't saved to the database yet (see README "Known Issues"), so
    // cvData/template/palette will be null for real applications until
    // that gap is closed. The review page falls back to a "no CV
    // submitted" state rather than crashing on a missing template.
    cvData: application.cv?.userCvData || null,
    template: application.cv?.userCvData?.template || 'classic',
    palette: application.cv?.userCvData?.palette || DEFAULT_PALETTE,
  };
}

export function toDisplayApplicantList(applications = []) {
  return applications.map(toDisplayApplicant);
}

// Translates an application (from the student's own /mine list) into the
// shape UserApplication.jsx's pipeline cards expect.
const STATUS_TO_LABEL = {
  pending: 'Pending',
  reviewed: 'Pending',
  accepted: 'Selected',
  rejected: 'Disqualified',
};

export function toDisplayMyApplication(application) {
  return {
    id: application.id,
    role: application.internship?.title || 'Untitled Internship',
    company: application.internship?.company?.companyName || 'Unknown Company',
    date: new Date(application.appliedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: STATUS_TO_LABEL[application.status] || 'Pending',
    rawStatus: application.status,
  };
}

export function toDisplayMyApplicationList(applications = []) {
  return applications.map(toDisplayMyApplication);
}
