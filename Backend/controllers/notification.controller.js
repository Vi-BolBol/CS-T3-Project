import {
  getMyNotificationsService,
  getUnreadNotificationsService,
  getUnreadCountService,
  markAsReadService,
  markAllAsReadService,
} from "../services/notification.service.js";

/* Controllers only touch req/res — no business logic, no Prisma. */

export const getMyNotifications = async (req, res, next) => {
  try {
    const result = await getMyNotificationsService(req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUnreadNotifications = async (req, res, next) => {
  try {
    const result = await getUnreadNotificationsService(req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const result = await getUnreadCountService(req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const result = await markAsReadService(req.user.id, req.params.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await markAllAsReadService(req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
