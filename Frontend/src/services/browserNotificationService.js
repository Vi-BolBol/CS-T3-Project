/**
 * browserNotificationService.js
 *
 * Thin wrapper around the browser's native Web Notifications API
 * (window.Notification), NOT a custom in-app toast/bell system.
 *
 * Design notes:
 * - Permission is only ever requested when explicitly asked to (see
 *   requestNotificationPermission), and only actually prompts the browser
 *   when the current state is "default" — a user who already granted or
 *   denied is never asked again.
 * - showBrowserNotification() never throws: unsupported browsers, denied
 *   permission, and any runtime error (e.g. icon fails to load, SW not
 *   ready) all resolve to `{ shown: false }` so the caller can fall back to
 *   an in-app toast.
 * - No JWTs, passwords, or personal data are ever placed in a notification's
 *   title/body — only static, generic copy.
 */

const APP_ICON = "/icons/app-icon.svg";
const DEFAULT_CLICK_URL = "/student/dashboard";

/** True only when the Notification constructor actually exists on window. */
export function isNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

/** Current permission state, or "unsupported" if the API doesn't exist. */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission; // "default" | "granted" | "denied"
}

/**
 * Requests permission ONLY if it hasn't been decided yet.
 * Call this right after a successful, user-initiated action (login/register) —
 * never on page load, and never in a loop.
 *
 * @returns {Promise<"default"|"granted"|"denied"|"unsupported">}
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return "unsupported";

  // Already decided earlier (by this browser/profile) — respect it, don't ask again.
  if (Notification.permission !== "default") {
    return Notification.permission;
  }

  try {
    // Modern promise-based API. Some older engines only support the
    // callback form, so we support both.
    const result = Notification.requestPermission((legacyResult) => legacyResult);
    if (result && typeof result.then === "function") {
      return await result;
    }
    return result || Notification.permission;
  } catch {
    return Notification.permission || "denied";
  }
}

/**
 * Registers the click-handling service worker (public/sw.js) at the site
 * root. Safe to call multiple times — registration is idempotent.
 * Never throws; failures are swallowed because the app must keep working
 * (as an in-page Notification) even without a service worker.
 */
export async function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch (err) {
    console.warn("[notifications] service worker registration failed:", err);
    return null;
  }
}

/**
 * One-time listener that lets the service worker tell the already-open SPA
 * "the user clicked a notification, please client-side-navigate to this
 * URL" instead of forcing a full page reload. Call once near app start.
 *
 * @param {(url: string) => void} navigate - typically react-router's navigate
 */
export function listenForNotificationClicks(navigate) {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "NOTIFICATION_CLICK") {
      navigate(event.data.url || DEFAULT_CLICK_URL);
    }
  });
}

/**
 * Shows a real OS/browser notification if — and only if — permission is
 * already granted and the API is supported. Otherwise resolves to
 * `{ shown: false }` without throwing, so callers can show a toast instead.
 *
 * @param {string} title
 * @param {{ body?: string, url?: string, tag?: string }} options
 */
export async function showBrowserNotification(title, options = {}) {
  if (!isNotificationSupported()) return { shown: false, reason: "unsupported" };
  if (Notification.permission !== "granted") {
    return { shown: false, reason: Notification.permission };
  }

  const { body, url = DEFAULT_CLICK_URL, tag } = options;
  const payload = {
    body,
    icon: APP_ICON,
    badge: APP_ICON,
    tag, // same tag replaces an existing notification instead of stacking
    data: { url },
  };

  try {
    // Prefer showing it through the service worker: that's what lets
    // sw.js's `notificationclick` handler run and focus/navigate the tab.
    if ("serviceWorker" in navigator) {
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((resolve) => setTimeout(() => resolve(null), 1500)),
      ]);

      if (registration) {
        await registration.showNotification(title, payload);
        return { shown: true };
      }
    }

    // Fallback: no service worker available (registration failed, browser
    // doesn't support it, etc). Show a plain in-page notification instead,
    // wiring up its click handler by hand since there's no SW to do it.
    const notification = new Notification(title, payload);
    notification.onclick = () => {
      window.focus();
      window.location.assign(url);
      notification.close();
    };
    return { shown: true };
  } catch (err) {
    console.warn("[notifications] failed to show notification:", err);
    return { shown: false, reason: "error" };
  }
}

/** Shown after a successful registration. No personal data included. */
export function showRegistrationNotification() {
  return showBrowserNotification("Account Created Successfully", {
    body: "Welcome to Internship Finder! Complete your profile to receive better internship recommendations.",
    url: DEFAULT_CLICK_URL,
    tag: "registration-success",
  });
}

/** Shown after a successful login. No personal data included. */
export function showLoginNotification() {
  return showBrowserNotification("Welcome Back", {
    body: "You logged in successfully. Check your recommended internships.",
    url: DEFAULT_CLICK_URL,
    tag: "login-success",
  });
}
