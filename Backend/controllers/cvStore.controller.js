import { saveCvService, getMyCvService, deleteMyCvService } from "../services/cvStore.service.js";

export const saveCv = async (req, res, next) => {
  try {
    const result = await saveCvService(req.user.id, req.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMyCv = async (req, res, next) => {
  try {
    const result = await getMyCvService(req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteMyCv = async (req, res, next) => {
  try {
    const result = await deleteMyCvService(req.user.id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    next(err);
  }
};
