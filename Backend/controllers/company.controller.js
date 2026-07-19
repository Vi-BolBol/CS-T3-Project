import {
  getMyCompanyService,
  updateMyCompanyService,
  getMyStatsService,
  getConnectionsService,
  searchService,
  getStudentDirectoryService,
} from "../services/company.service.js";

export const getMyCompany = async (req, res, next) => {
  try {
    const result = await getMyCompanyService(req.user.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const updateMyCompany = async (req, res, next) => {
  try {
    const result = await updateMyCompanyService(req.user.id, req.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const getMyStats = async (req, res, next) => {
  try {
    const result = await getMyStatsService(req.user.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

export const getConnections = async (req, res, next) => {
  try {
    return res.status(200).json(await getConnectionsService(req.user.id));
  } catch (err) { next(err); }
};

export const search = async (req, res, next) => {
  try {
    return res.status(200).json(await searchService(req.query.q));
  } catch (err) { next(err); }
};

/** Browsable student directory for the Explore page. */
export const getStudentDirectory = async (req, res, next) => {
  try {
    return res.status(200).json(await getStudentDirectoryService());
  } catch (err) { next(err); }
};
