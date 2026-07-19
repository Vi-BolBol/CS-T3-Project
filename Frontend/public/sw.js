/**
 * sw.js — Internship Finder
 *
 * Scope: click handling for notifications shown via
 * `registration.showNotification()` from browserNotificationService.js.
 *
 * This is NOT a push service worker. It does not subscribe to push, cache
 * assets, or work while every tab is closed. It only wakes up (as service
 * workers do) to react to the user clicking a notification that was already
 * displayed while a tab was open. Real "notify me even with the app fully
 * closed" behaviour needs a push subscription + a backend push provider,
 * which is a separate feature.
 */

self.addEventListener("install", () => {
  // Activate this SW as soon as it's finished installing, instead of waiting
  // for every open tab to be closed first.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  const targetUrl = event.notification?.data?.url || "/student/dashboard";
  event.notification.close();

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // Prefer an existing tab: focus it and let the page's own router
      // navigate (via postMessage) instead of doing a hard reload.
      for (const client of allClients) {
        const clientUrl = new URL(client.url);
        if (clientUrl.origin === self.location.origin) {
          if ("focus" in client) await client.focus();
          client.postMessage({ type: "NOTIFICATION_CLICK", url: targetUrl });
          return;
        }
      }

      // No tab open at all -> open a fresh one directly on the target route.
      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })()
  );
});
