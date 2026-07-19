import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/notificationApi';

// Polling interval for the unread badge. Notifications aren't latency
// sensitive enough to justify a websocket for this project's scope.
const POLL_MS = 30_000;

/*
  Backs the notification bell everywhere it's used (student + company navbars).
  Flow: fetch unread count on mount and every POLL_MS -> user opens the bell ->
  fetch full list -> user clicks a notification -> mark it read -> refresh count.
*/
export default function useNotifications() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);

  const refreshCount = useCallback(async () => {
    const res = await getUnreadNotificationCount();
    if (res.success) setCount(res.count);
  }, []);

  const refreshList = useCallback(async () => {
    setLoading(true);
    const res = await getMyNotifications();
    if (res.success) setNotifications(res.notifications || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshCount();
    pollRef.current = setInterval(refreshCount, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [refreshCount]);

  // Called when the bell dropdown opens.
  const open = useCallback(() => {
    refreshList();
  }, [refreshList]);

  // Called when the user opens/clicks a single notification.
  const markRead = useCallback(async (id) => {
    const res = await markNotificationRead(id);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setCount((prev) => Math.max(0, prev - 1));
    }
    return res;
  }, []);

  const markAllRead = useCallback(async () => {
    const res = await markAllNotificationsRead();
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setCount(0);
    }
    return res;
  }, []);

  return { count, notifications, loading, open, markRead, markAllRead, refreshCount };
}
