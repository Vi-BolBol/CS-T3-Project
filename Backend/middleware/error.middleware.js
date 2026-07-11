/**
 * Central error handling. Gen11 Backend requires "Error handling middleware
 * implemented" — previously the app had none, so an unhandled throw leaked a
 * raw stack trace instead of structured JSON.
 */

// 404 — no route matched. Must be registered AFTER all routes.
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Global error handler. Must be the LAST app.use(), and must keep all four args
// or Express won't recognise it as an error handler.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  // Log the full error server-side; never send a stack trace to the client.
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  // Prisma known errors -> friendlier statuses
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A record with that value already exists.",
    });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "Record not found." });
  }

  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : err.message || "Request failed",
    ...(process.env.NODE_ENV === "development" && status === 500
      ? { detail: err.message }
      : {}),
  });
};
