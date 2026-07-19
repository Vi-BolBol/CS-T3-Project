import {
  getStatsService,
  getUsersService,
  updateUserStatusService,
  deleteUserService,
  getAuditLogsService,
  getSuspiciousService,
  getUserDetailService,
  getUserActivityService,
  getUserInternshipsService,
  getUserCvService,
  moderateInternshipService,
  getInternshipDetailService,
  deleteInternshipService,
} from "../services/admin.service.js";

export const getStats = async (req, res, next) => {
  try {
    return res.status(200).json(await getStatsService());
  } catch (err) { next(err); }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page, pageSize } = req.query;
    return res.status(200).json(await getUsersService({ role, status, search, page, pageSize }));
  } catch (err) { next(err); }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status, reason, days } = req.body || {};
    const result = await updateUserStatusService(req.user.id, req.params.id, status, { reason, days });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.user.id, req.params.id, { reason: req.body?.reason });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

/* ---------- Per-user drill-down ---------- */

export const getUserDetail = async (req, res, next) => {
  try {
    const result = await getUserDetailService(req.params.id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) { next(err); }
};

export const getUserActivity = async (req, res, next) => {
  try {
    const { from, to, action, limit } = req.query;
    const result = await getUserActivityService(req.params.id, { from, to, action, limit });
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) { next(err); }
};

export const getUserInternships = async (req, res, next) => {
  try {
    const result = await getUserInternshipsService(req.params.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const getUserCv = async (req, res, next) => {
  try {
    const result = await getUserCvService(req.params.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const getInternshipDetail = async (req, res, next) => {
  try {
    const result = await getInternshipDetailService(req.params.id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) { next(err); }
};

/* ---------- Moderating a listing ---------- */

export const moderateInternship = async (req, res, next) => {
  try {
    const { status, reason } = req.body || {};
    const result = await moderateInternshipService(req.user.id, req.params.id, status, reason);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const deleteInternship = async (req, res, next) => {
  try {
    const result = await deleteInternshipService(req.user.id, req.params.id, req.body?.reason);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, limit, from, to, role, search, userId } = req.query;
    return res.status(200).json(
      await getAuditLogsService({ action, limit, from, to, role, search, userId })
    );
  } catch (err) { next(err); }
};

export const getSuspicious = async (req, res, next) => {
  try {
    return res.status(200).json(await getSuspiciousService());
  } catch (err) { next(err); }
};
