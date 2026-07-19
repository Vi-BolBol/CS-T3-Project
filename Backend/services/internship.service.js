import {
  findCompanyProfileByUserId,
  createInternship,
  findInternshipsByCompanyId,
  findInternshipById,
  findPublicInternships,
  updateInternship,
  deleteInternship,
} from "../models/internship.model.js";

const WORK_ENV_MAP = {
  "on-site": "onsite",
  onsite: "onsite",
  hybrid: "hybrid",
  remote: "remote",
};

const PLAN_VALUES = ["standard", "featured"];

function mapWorkEnvironment(value) {
  if (!value) return null;
  const key = String(value).trim().toLowerCase();
  return WORK_ENV_MAP[key] || null;
}

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

// Mirrors the validation already done client-side in the job wizard, so a
// request that skips the frontend (e.g. hits the API directly) still gets
// rejected with the same rules instead of silently producing bad data.
function validateWizardPayload(payload) {
  const errors = {};

  if (isBlank(payload.title)) errors.title = "Job title is required.";
  if (isBlank(payload.department)) errors.department = "Department is required.";
  if (isBlank(payload.description) || String(payload.description).trim().length < 20) {
    errors.description = "Description must be at least 20 characters.";
  }
  if (!mapWorkEnvironment(payload.workEnvironment)) {
    errors.workEnvironment = "Work environment must be On-site, Hybrid, or Remote.";
  }

  if (!Array.isArray(payload.skills) || payload.skills.length === 0) {
    errors.skills = "At least one required skill is needed.";
  }
  if (!Array.isArray(payload.responsibilities) || payload.responsibilities.length === 0) {
    errors.responsibilities = "At least one responsibility is needed.";
  }

  const payMin = Number(payload.payMin);
  const payMax = Number(payload.payMax);
  if (isBlank(payload.payMin) || Number.isNaN(payMin) || payMin < 0) {
    errors.payMin = "Enter a valid minimum pay.";
  }
  if (isBlank(payload.payMax) || Number.isNaN(payMax) || payMax < 0) {
    errors.payMax = "Enter a valid maximum pay.";
  }
  if (!errors.payMin && !errors.payMax && payMax < payMin) {
    errors.payMax = "Maximum pay must be greater than or equal to minimum pay.";
  }

  const durationValue = Number(payload.durationValue);
  if (isBlank(payload.durationValue) || Number.isNaN(durationValue) || durationValue <= 0) {
    errors.durationValue = "Enter a valid duration.";
  }

  if (payload.plan && !PLAN_VALUES.includes(payload.plan)) {
    errors.plan = "Plan must be 'standard' or 'featured'.";
  }

  return errors;
}

function toWizardDbFields(payload) {
  return {
    title: payload.title.trim(),
    internshipCategory: payload.department.trim(),
    workEnvironment: mapWorkEnvironment(payload.workEnvironment),
    jobDescription: payload.description.trim(),
    skills: payload.skills.join(", "),
    requirements: payload.responsibilities.join("\n"),
    salaryMin: Number(payload.payMin),
    salaryMax: Number(payload.payMax),
    salary: (Number(payload.payMin) + Number(payload.payMax)) / 2,
    durationValue: Number(payload.durationValue),
    durationUnit: payload.durationUnit || "Months",
    plan: payload.plan || "featured",
    location: payload.location ? payload.location.trim() : null,
  };
}

export const publishInternshipService = async (userId, payload = {}) => {
  const errors = validateWizardPayload(payload);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validation failed", errors };
  }

  const companyProfile = await findCompanyProfileByUserId(userId);
  if (!companyProfile) {
    return {
      success: false,
      message: "No company profile found for this account. Please complete your company profile first.",
    };
  }

  const internship = await createInternship({
    companyId: companyProfile.id,
    status: "open",
    ...toWizardDbFields(payload),
  });

  return { success: true, message: "Internship published successfully", internship };
};

export const listCompanyInternshipsService = async (userId) => {
  const companyProfile = await findCompanyProfileByUserId(userId);
  if (!companyProfile) {
    return { success: false, message: "No company profile found for this account." };
  }

  const internships = await findInternshipsByCompanyId(companyProfile.id);
  return { success: true, internships };
};

/**
 * `status` is whitelisted, not passed straight through.
 *
 * It used to be `query.status || "open"` — so GET /api/internships?status=draft
 * handed any anonymous visitor every UNPUBLISHED listing on the platform. A
 * bogus value (?status=foo) also blew up Prisma's enum check into a 500.
 * "draft" is never browsable; a company sees its own drafts via /mine.
 */
const PUBLIC_STATUSES = ["open", "closed"];

export const listPublicInternshipsService = async (query = {}) => {
  const requested = String(query.status || "").toLowerCase();
  const status = PUBLIC_STATUSES.includes(requested) ? requested : "open";

  const { internships, total, page, pageSize } = await findPublicInternships({
    status, category: query.category, location: query.location,
    q: query.q, page: query.page, pageSize: query.pageSize,
  });

  return {
    success: true,
    internships,
    pagination: { total, page, pageSize, totalPages: Math.max(Math.ceil(total / pageSize), 1) },
  };
};
/**
 * `findInternshipById` includes the WHOLE CompanyProfile row — which carries
 * `contact` (phone), `telegramLink`, and `userId`, the internal link back to the
 * account. This route is public, so those were being handed to anyone who asked.
 *
 * `requester` comes from optionalAuth: undefined for an anonymous visitor. The
 * owning company (and an admin) still gets everything, because the company edit
 * form reads this same endpoint.
 */
const PUBLIC_COMPANY_FIELDS = [
  "id", "companyName", "industry", "description", "website",
  "logoUrl", "coverUrl", "location", "employeeCount",
];

export const getInternshipService = async (id, requester = null) => {
  const internship = await findInternshipById(id);
  if (!internship) {
    return { success: false, message: "Internship not found" };
  }

  const isAdmin = requester?.role === "admin";
  let isOwner = false;

  if (requester?.role === "company") {
    const profile = await findCompanyProfileByUserId(requester.id);
    isOwner = Boolean(profile && profile.id === internship.companyId);
  }

  // A draft is unpublished. Nobody but its owner (or an admin) may read it.
  if (internship.status === "draft" && !isOwner && !isAdmin) {
    return { success: false, message: "Internship not found" };
  }

  // A suspended listing has been pulled by an admin. The owning company still
  // sees it (with the reason, so they know why), the public does not.
  if (internship.status === "suspended" && !isOwner && !isAdmin) {
    return { success: false, message: "This listing is no longer available" };
  }

  if (isOwner || isAdmin) {
    return { success: true, internship };
  }

  const company = internship.company
    ? Object.fromEntries(
        PUBLIC_COMPANY_FIELDS.map((k) => [k, internship.company[k]])
      )
    : null;

  return { success: true, internship: { ...internship, company } };
};

async function assertOwnership(userId, internshipId) {
  const companyProfile = await findCompanyProfileByUserId(userId);
  if (!companyProfile) {
    return { ok: false, response: { success: false, message: "No company profile found for this account." } };
  }

  const internship = await findInternshipById(internshipId);
  if (!internship) {
    return { ok: false, response: { success: false, message: "Internship not found" } };
  }

  if (internship.companyId !== companyProfile.id) {
    return { ok: false, response: { success: false, message: "You do not have permission to modify this internship." } };
  }

  return { ok: true, internship };
}

export const updateInternshipService = async (userId, internshipId, payload = {}) => {
  const ownership = await assertOwnership(userId, internshipId);
  if (!ownership.ok) return ownership.response;

  const updateData = {};

  if (payload.title !== undefined) updateData.title = String(payload.title).trim();
  if (payload.department !== undefined) updateData.internshipCategory = String(payload.department).trim();
  if (payload.workEnvironment !== undefined) {
    const mapped = mapWorkEnvironment(payload.workEnvironment);
    if (!mapped) return { success: false, message: "Work environment must be On-site, Hybrid, or Remote." };
    updateData.workEnvironment = mapped;
  }
  if (payload.description !== undefined) updateData.jobDescription = String(payload.description).trim();
  if (Array.isArray(payload.skills)) updateData.skills = payload.skills.join(", ");
  if (Array.isArray(payload.responsibilities)) updateData.requirements = payload.responsibilities.join("\n");
  if (payload.payMin !== undefined) updateData.salaryMin = Number(payload.payMin);
  if (payload.payMax !== undefined) updateData.salaryMax = Number(payload.payMax);
  if (payload.payMin !== undefined && payload.payMax !== undefined) {
    updateData.salary = (Number(payload.payMin) + Number(payload.payMax)) / 2;
  }
  if (payload.durationValue !== undefined) updateData.durationValue = Number(payload.durationValue);
  if (payload.durationUnit !== undefined) updateData.durationUnit = payload.durationUnit;
  if (payload.plan !== undefined) updateData.plan = payload.plan;
  if (payload.status !== undefined) updateData.status = payload.status;
  if (payload.location !== undefined) updateData.location = payload.location;

  const internship = await updateInternship(internshipId, updateData);
  return { success: true, message: "Internship updated", internship };
};

export const deleteInternshipService = async (userId, internshipId) => {
  const ownership = await assertOwnership(userId, internshipId);
  if (!ownership.ok) return ownership.response;

  await deleteInternship(internshipId);
  return { success: true, message: "Internship deleted" };
};
