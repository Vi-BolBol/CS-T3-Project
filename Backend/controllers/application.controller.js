import {
  applyService,
  getMyApplicationsService,
  withdrawApplicationService,
  getInternshipApplicantsService,
  getCompanyApplicationsService,
  decideApplicationService,
  getMyApplicationAlertsService,
  markApplicationsSeenService,
} from "../services/application.service.js";

/* Controllers only touch req/res — no business logic, no Prisma. */

export const apply = async (req, res, next) => {
  try {
    const result = await applyService(req.user.id, req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const result = await getMyApplicationsService(req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const withdrawApplication = async (req, res, next) => {
  try {
    const result = await withdrawApplicationService(req.user.id, req.params.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
};

export const getInternshipApplicants = async (req, res, next) => {
  try {
    const result = await getInternshipApplicantsService(req.user.id, req.params.internshipId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
};

export const getCompanyApplications = async (req, res, next) => {
  try {
    const result = await getCompanyApplicationsService(req.user.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
};

export const decideApplication = async (req, res, next) => {
  try {
    const result = await decideApplicationService(req.user.id, req.params.id, req.body?.status);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
};

/** Badge count for the Applications nav item. */
export const getMyAlerts = async (req, res, next) => {
  try {
    return res.status(200).json(await getMyApplicationAlertsService(req.user.id));
  } catch (err) { next(err); }
};

/** Clears the badge — called when the student opens the Applications page. */
export const markSeen = async (req, res, next) => {
  try {
    return res.status(200).json(await markApplicationsSeenService(req.user.id));
  } catch (err) { next(err); }
};
