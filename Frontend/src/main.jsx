import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import { registerServiceWorker } from "./services/browserNotificationService";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Best-effort: enables notification-click focus/navigate handling.
// Works on localhost (treated as a secure context by browsers) and on
// HTTPS in production. Silently no-ops anywhere else (see
// registerServiceWorker's own try/catch) so a failure here never breaks
// the rest of the app.
registerServiceWorker();
