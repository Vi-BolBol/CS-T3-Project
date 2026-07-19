import { useEffect, useState } from "react";
import {
  getNotificationPermission,
  isNotificationSupported,
  requestNotificationPermission,
} from "../services/browserNotificationService";

/**
 * Small status/opt-in control for browser notifications. Drop it into a
 * settings page if you want an explicit "enable notifications" affordance
 * outside of the automatic login/register prompt.
 *
 * It never calls Notification.requestPermission() on its own — only in
 * response to the user clicking the button — and it disables itself once
 * the browser has already recorded a decision (granted or denied).
 */
export default function NotificationPermissionButton({ className = "" }) {
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  if (!isNotificationSupported()) {
    return (
      <p className={`text-xs text-subtle ${className}`}>
        <i className="bi bi-bell-slash mr-1" />
        Browser notifications aren&apos;t supported in this browser.
      </p>
    );
  }

  const handleClick = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
  };

  if (permission === "granted") {
    return (
      <p className={`text-xs font-medium text-accent ${className}`}>
        <i className="bi bi-bell-fill mr-1" />
        Browser notifications are on.
      </p>
    );
  }

  if (permission === "denied") {
    return (
      <p className={`text-xs text-subtle ${className}`}>
        <i className="bi bi-bell-slash mr-1" />
        Notifications are blocked. Enable them from your browser&apos;s site settings if you&apos;d like them back.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-lg border border-line bg-muted px-3 py-1.5 text-xs font-semibold text-content transition hover:border-accent hover:text-accent ${className}`}
    >
      <i className="bi bi-bell mr-1" />
      Enable browser notifications
    </button>
  );
}
