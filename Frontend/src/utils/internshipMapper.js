// Single source of truth for translating between the backend Internship
// shape (Prisma model, snake-free but backend-flavored field names) and the
// shape the dashboard UI works with. Keeping this in one place means when
// the applications API lands later, only this file (plus the applicant
// mapper) needs to change.

const WORK_ENV_TO_LABEL = {
  remote: 'Remote',
  onsite: 'On-site',
  hybrid: 'Hybrid',
};

const LABEL_TO_WORK_ENV = {
  Remote: 'Remote',
  'On-site': 'On-site',
  Hybrid: 'Hybrid',
};

const STATUS_TO_LABEL = {
  open: 'Active',
  closed: 'Frozen',
  draft: 'Draft',
};

export function formatWorkEnvironment(value) {
  return WORK_ENV_TO_LABEL[value] || value || '—';
}

export function formatStatus(status) {
  return STATUS_TO_LABEL[status] || status || '—';
}

export function formatSalaryRange(salaryMin, salaryMax) {
  if (salaryMin == null && salaryMax == null) return '—';
  const min = salaryMin != null ? `$${Number(salaryMin).toLocaleString()}` : '—';
  const max = salaryMax != null ? `$${Number(salaryMax).toLocaleString()}` : '—';
  return `${min} - ${max}/mo`;
}

export function formatPostedDate(createdAt) {
  if (!createdAt) return '—';
  return new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Turns a raw internship row (from GET /mine or GET /:id) into the shape
// CompanyDashboard / PostedJobsList / SelectedJobView render.
export function toDisplayJob(internship) {
  if (!internship) return null;

  return {
    id: internship.id,
    title: internship.title,
    category: internship.internshipCategory || '',
    code: `REQ-${String(internship.id).padStart(4, '0')}`,
    location: internship.location || 'Not specified',
    workEnvironment: formatWorkEnvironment(internship.workEnvironment),
    status: internship.status,
    statusLabel: formatStatus(internship.status),
    description: internship.jobDescription || '',
    skills: internship.skills ? internship.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    responsibilities: internship.requirements
      ? internship.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
      : [],
    salaryMin: internship.salaryMin,
    salaryMax: internship.salaryMax,
    salaryRange: formatSalaryRange(internship.salaryMin, internship.salaryMax),
    durationValue: internship.durationValue,
    durationUnit: internship.durationUnit,
    plan: internship.plan,
    postedDate: formatPostedDate(internship.createdAt),
    applicantsCount: internship._count?.applications ?? 0,
    raw: internship,
  };
}

export function toDisplayJobList(internships = []) {
  return internships.map(toDisplayJob);
}

// Turns a display job back into edit-form field values (matches the wizard
// step INITIAL_DATA shape, minus plan/checkout fields that don't apply to
// editing an already-published listing).
export function toEditFormData(job) {
  if (!job) return null;
  return {
    title: job.title || '',
    department: job.category || '',
    workEnvironment: job.workEnvironment || 'Hybrid',
    description: job.description || '',
    skills: job.skills || [],
    responsibilities: job.responsibilities || [],
    payMin: job.salaryMin != null ? String(job.salaryMin) : '',
    payMax: job.salaryMax != null ? String(job.salaryMax) : '',
    durationValue: job.durationValue != null ? String(job.durationValue) : '',
    durationUnit: job.durationUnit || 'Months',
    location: job.raw?.location || '',
  };
}

// Turns edit-form field values into a PUT /api/internships/:id payload.
// Only fields the backend's updateInternshipService knows about are sent.
export function toUpdatePayload(formData) {
  return {
    title: formData.title,
    department: formData.department,
    workEnvironment: LABEL_TO_WORK_ENV[formData.workEnvironment] || formData.workEnvironment,
    description: formData.description,
    skills: formData.skills,
    responsibilities: formData.responsibilities,
    payMin: formData.payMin,
    payMax: formData.payMax,
    durationValue: formData.durationValue,
    durationUnit: formData.durationUnit,
    location: formData.location,
  };
}

// --- Student-facing (public) mapping -------------------------------------
// Turns a real Internship row (from GET /api/internships or GET /:id) into
// the shape UserHome's search results and ViewDetail's master-detail view
// render. This replaces the hardcoded `availableInternships` mock array
// that both pages used to ship with.

const AVATAR_PALETTE = [
  'bg-purple-600/20 text-purple-400',
  'bg-emerald-600/20 text-emerald-400',
  'bg-sky-600/20 text-sky-400',
  'bg-amber-600/20 text-amber-400',
  'bg-rose-600/20 text-rose-400',
];

function initialFromCompanyName(name) {
  return name?.trim()?.[0]?.toUpperCase() || '?';
}

function colorForId(id) {
  return AVATAR_PALETTE[id % AVATAR_PALETTE.length];
}

function formatDuration(value, unit) {
  if (!value) return 'Not specified';
  return `${value} ${unit || 'Months'}`;
}

export function toPublicListing(internship) {
  if (!internship) return null;

  return {
    id: internship.id,
    title: internship.title,
    company: internship.company?.companyName || 'Unknown Company',
    location: internship.location || 'Not specified',
    duration: formatDuration(internship.durationValue, internship.durationUnit),
    salary: formatSalaryRange(internship.salaryMin, internship.salaryMax),
    type: formatWorkEnvironment(internship.workEnvironment),
    initial: initialFromCompanyName(internship.company?.companyName),
    color: colorForId(internship.id),
    applicants: internship._count?.applications ?? 0,
    desc: internship.jobDescription || 'No description provided for this listing yet.',
    skills: internship.skills ? internship.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    requirements: internship.requirements
      ? internship.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
      : [],
    postedDate: formatPostedDate(internship.createdAt),
    raw: internship,
  };
}

export function toPublicListingList(internships = []) {
  return internships.map(toPublicListing);
}
