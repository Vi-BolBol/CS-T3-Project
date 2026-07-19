import {
  listCompaniesService,
  getCompanyService,
  searchService,
} from "../services/public.service.js";

export const listCompanies = async (req, res, next) => {
  try {
    return res.status(200).json(await listCompaniesService());
  } catch (err) { next(err); }
};

export const getCompany = async (req, res, next) => {
  try {
    const result = await getCompanyService(req.params.id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) { next(err); }
};

export const search = async (req, res, next) => {
  try {
    return res.status(200).json(await searchService(req.query.q));
  } catch (err) { next(err); }
};
