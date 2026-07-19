import {
  getStatsService,
  getUsersService,
  updateUserStatusService,
  deleteUserService,
  getAuditLogsService,
  getSuspiciousService,
} from "../services/admin.service.js";

export const getStats = async (req, res, next) => {
  try {
    return res.status(200).json(await getStatsService());
  } catch (err) { next(err); }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    return res.status(200).json(await getUsersService({ role, status, search }));
  } catch (err) { next(err); }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const result = await updateUserStatusService(req.user.id, req.params.id, req.body?.status);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.user.id, req.params.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, limit } = req.query;
    return res.status(200).json(await getAuditLogsService({ action, limit }));
  } catch (err) { next(err); }
};

export const getSuspicious = async (req, res, next) => {
  try {
    return res.status(200).json(await getSuspiciousService());
  } catch (err) { next(err); }
};
