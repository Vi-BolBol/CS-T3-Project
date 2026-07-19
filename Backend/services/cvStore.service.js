import { findCvByStudent, upsertCv, deleteCvByStudent } from "../models/cv.model.js";

/*
  CV persistence. The `Cv` model existed in the schema but had no routes at all —
  CVs lived only in the browser's localStorage, so they were lost on a different
  device or browser. This gives them a real home in the database.

  `userCvData` is a JSON column, so the whole CV-builder object is stored as-is.
*/

export const saveCvService = async (studentId, payload = {}) => {
  const { userCvData, fileUrl = null, score = null } = payload;

  if (!userCvData || typeof userCvData !== "object") {
    return { success: false, message: "userCvData object is required" };
  }

  const cv = await upsertCv({ studentId, userCvData, fileUrl, score });
  return { success: true, message: "CV saved", cv };
};

export const getMyCvService = async (studentId) => {
  const cv = await findCvByStudent(studentId);
  // Not an error — a new student simply has no CV yet.
  return { success: true, cv: cv || null };
};

export const deleteMyCvService = async (studentId) => {
  const deleted = await deleteCvByStudent(studentId);
  if (!deleted) return { success: false, message: "No CV found to delete" };
  return { success: true, message: "CV deleted" };
};
