/*
  OpenAPI 3.0 specification for the Internship Finder API.

  Written as a JS module rather than YAML on purpose: no parser dependency, it
  can use constants, and a typo is caught by `node --check` instead of surfacing
  as a blank page in the docs UI.

  Served at GET /api/docs by src/server.js. Every endpoint below was read off the
  route files rather than assumed, so this describes what the server actually
  exposes.
*/

const bearer = [{ bearerAuth: [] }];

/** Endpoints share a response envelope: { success, message?, ...payload }. */
const ok = (description, example) => ({
  description,
  content: { "application/json": { example } },
});

const errors = {
  400: ok("Business-rule failure", { success: false, message: "A reason is required to suspend an account" }),
  401: ok("Missing or invalid token", { success: false, message: "Not authorised, no token" }),
  403: ok("Wrong role, or account suspended", { success: false, reason: "suspended", message: "Your account is suspended." }),
  404: ok("Not found", { success: false, message: "Internship not found" }),
  429: ok("Rate limited", { success: false, message: "Too many attempts. Try again in a minute." }),
  500: ok("Unhandled server error", { success: false, message: "Something went wrong" }),
};

const pathId = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer" },
  description: "Numeric id",
};

const body = (example) => ({
  required: true,
  content: { "application/json": { example } },
});

export const openapiSpec = {
  openapi: "3.0.3",

  info: {
    title: "Internship Finder API",
    version: "1.0.0",
    description: [
      "REST API for the Internship Finder platform (CADT Gen11 cross-disciplinary project).",
      "",
      "**Authentication.** Sign in via `POST /api/auth/login`, then send the returned",
      "token as `Authorization: Bearer <token>` on every protected call. Use the",
      "**Authorize** button above to set it once for all requests in this page.",
      "",
      "**Authorization.** The JWT carries a `role` claim (`student` | `company` |",
      "`admin`). Protected routes run `protect` (verifies the token) followed by",
      "`authorize(role)` (checks the claim), so calling an endpoint with the wrong",
      "role returns 403 rather than an empty result.",
      "",
      "**Account status.** Sensitive mutations additionally run `enforceStatus`,",
      "which re-reads the account from the database. A suspended or deleted user is",
      "rejected with 403/401 even if their token has not expired yet.",
      "",
      "**Seeded logins** (password `password123`): `student1@example.com` …",
      "`student10@`, `company1@example.com` … `company10@`, `admin1@example.com`.",
    ].join("\n"),
  },

  servers: [
    { url: "http://localhost:3000", description: "Local development" },
  ],

  tags: [
    { name: "Auth", description: "Registration, login, and session validation" },
    { name: "Internships", description: "Listings — public browsing and company CRUD" },
    { name: "Applications", description: "Students apply; companies decide" },
    { name: "CV", description: "CV persistence and the AI-assisted features" },
    { name: "Student", description: "Student profile, saved listings, followed companies" },
    { name: "Company", description: "Company profile, stats, and directory search" },
    { name: "Notifications", description: "In-app notification feed" },
    { name: "Public", description: "Unauthenticated browsing" },
    { name: "Admin", description: "Moderation — admin role only" },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Paste the token returned by /api/auth/login (without the word 'Bearer').",
      },
    },
  },

  paths: {
    /* ------------------------------------------------------------------ Auth */
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Create an account",
        description:
          "Creates the User **and** its matching profile row in one transaction. " +
          "`admin` is rejected — admins are promoted via the CLI. Rate limited to 10/minute per IP.",
        requestBody: body({
          email: "newstudent@example.com",
          password: "password123",
          role: "student",
          fullName: "Sok Dara",
        }),
        responses: {
          201: ok("Account created; a token is returned so the user is signed straight in", {
            success: true,
            token: "eyJhbGciOiJIUzI1NiIs...",
            user: { id: 22, email: "newstudent@example.com", role: "student" },
          }),
          400: ok("Validation failed, or the email is taken", {
            success: false,
            message: "This email belongs to a suspended account and cannot be re-registered.",
          }),
          429: errors[429],
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Sign in",
        description: "Returns a JWT carrying `{ id, email, role }`. Rate limited to 10/minute per IP.",
        requestBody: body({ email: "student1@example.com", password: "password123" }),
        responses: {
          200: ok("Signed in", {
            success: true,
            token: "eyJhbGciOiJIUzI1NiIs...",
            user: { id: 1, email: "student1@example.com", role: "student" },
          }),
          400: ok("Wrong email or password", { success: false, message: "Invalid credentials" }),
          403: ok("Account suspended — includes the admin's reason and end date", {
            success: false,
            suspended: true,
            message: "This account has been suspended.",
            suspension: { reason: "Spam listings", until: "2026-08-01T00:00:00.000Z" },
          }),
          429: errors[429],
        },
      },
    },

    "/api/auth/session": {
      get: {
        tags: ["Auth"],
        summary: "Re-validate the current session",
        description:
          "Re-reads the account from the database. This is what makes a suspension or " +
          "deletion take effect without waiting for the token to expire — the client " +
          "calls it on page load and on tab focus. Exempt from the auth rate limiter.",
        security: bearer,
        responses: {
          200: ok("Session state", {
            success: true,
            valid: false,
            reason: "suspended",
            suspension: { reason: "Spam listings", until: "2026-08-01T00:00:00.000Z" },
          }),
          401: errors[401],
        },
      },
    },

    /* ----------------------------------------------------------- Internships */
    "/api/internships": {
      get: {
        tags: ["Internships"],
        summary: "Browse published listings",
        description:
          "Public. `status` is whitelisted to `open`/`closed` — drafts and suspended " +
          "listings are never returned here, whatever is passed.",
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["open", "closed"] } },
          { name: "q", in: "query", schema: { type: "string" }, description: "Free-text search" },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 100, maximum: 100 } },
        ],
        responses: {
          200: ok("Paginated listings", {
            success: true,
            internships: [{ id: 1, title: "Frontend Developer Intern", location: "Phnom Penh", status: "open" }],
            pagination: { total: 10, page: 1, pageSize: 100 },
          }),
        },
      },
      post: {
        tags: ["Internships"],
        summary: "Publish a listing",
        description: "Company role. Requires a CompanyProfile to exist for the account.",
        security: bearer,
        requestBody: body({
          title: "Backend Developer Intern",
          jobDescription: "Work on our Node/Express API.",
          requirements: "JavaScript, basic SQL",
          location: "Phnom Penh, Cambodia",
          workEnvironment: "onsite",
          internshipCategory: "Information Technology",
          salaryMin: 150,
          salaryMax: 250,
          status: "open",
        }),
        responses: { 201: ok("Created", { success: true, internship: { id: 11 } }), 400: errors[400], 401: errors[401], 403: errors[403] },
      },
    },

    "/api/internships/mine": {
      get: {
        tags: ["Internships"],
        summary: "The signed-in company's own listings",
        security: bearer,
        responses: { 200: ok("Listings", { success: true, internships: [] }), 401: errors[401], 403: errors[403] },
      },
    },

    "/api/internships/{id}": {
      get: {
        tags: ["Internships"],
        summary: "One listing",
        description:
          "Uses `optionalAuth`: the owning company (and admins) see drafts and suspended " +
          "listings plus private contact fields; everyone else gets 404/stripped fields.",
        parameters: [pathId],
        responses: { 200: ok("Listing", { success: true, internship: { id: 1, title: "Frontend Developer Intern" } }), 404: errors[404] },
      },
      put: {
        tags: ["Internships"],
        summary: "Edit a listing",
        description: "Company role, owner only.",
        security: bearer,
        parameters: [pathId],
        requestBody: body({ title: "Updated title", status: "closed" }),
        responses: { 200: ok("Updated", { success: true }), 401: errors[401], 403: errors[403], 404: errors[404] },
      },
      delete: {
        tags: ["Internships"],
        summary: "Delete a listing",
        security: bearer,
        parameters: [pathId],
        responses: { 200: ok("Deleted", { success: true }), 401: errors[401], 403: errors[403], 404: errors[404] },
      },
    },

    /* ---------------------------------------------------------- Applications */
    "/api/applications": {
      post: {
        tags: ["Applications"],
        summary: "Apply to a listing",
        description:
          "Student role. Blocked on closed and suspended listings, and on duplicates — " +
          "the latter enforced by a unique constraint on (studentId, internshipId), which " +
          "is requirement FR-04. The student's CV is attached automatically when present.",
        security: bearer,
        requestBody: body({ internshipId: 1 }),
        responses: {
          201: ok("Applied", { success: true, application: { id: 12, status: "pending" } }),
          400: ok("Duplicate, closed, or suspended", { success: false, message: "You have already applied to this internship" }),
          401: errors[401], 403: errors[403],
        },
      },
    },

    "/api/applications/mine": {
      get: {
        tags: ["Applications"],
        summary: "The student's own applications",
        description:
          "Each row carries a `companyState` of `active` | `suspended` | `listing_suspended` | " +
          "`deleted`, so the student is told when a company was suspended or removed rather " +
          "than the application silently going quiet.",
        security: bearer,
        responses: {
          200: ok("Applications", {
            success: true,
            unseen: 2,
            applications: [{
              id: 12, status: "accepted", companyState: "deleted",
              displayTitle: "Backend Intern", displayCompany: "Acme",
              companyStateReason: "Fraudulent listings",
            }],
          }),
          401: errors[401], 403: errors[403],
        },
      },
    },

    "/api/applications/alerts": {
      get: {
        tags: ["Applications"],
        summary: "Unseen decision count",
        description: "Powers the badge on the Applications tab. Counts unseen accept/reject decisions and removed listings.",
        security: bearer,
        responses: { 200: ok("Count", { success: true, unseen: 2 }), 401: errors[401] },
      },
    },

    "/api/applications/seen": {
      patch: {
        tags: ["Applications"],
        summary: "Clear the badge",
        security: bearer,
        responses: { 200: ok("Marked seen", { success: true, seen: 2 }), 401: errors[401] },
      },
    },

    "/api/applications/{id}": {
      delete: {
        tags: ["Applications"],
        summary: "Withdraw an application",
        description: "Student role, own applications only.",
        security: bearer,
        parameters: [pathId],
        responses: { 200: ok("Withdrawn", { success: true }), 401: errors[401], 403: errors[403], 404: errors[404] },
      },
    },

    "/api/applications/company": {
      get: {
        tags: ["Applications"],
        summary: "Every applicant to this company's listings",
        security: bearer,
        responses: { 200: ok("Applications", { success: true, applications: [] }), 401: errors[401], 403: errors[403] },
      },
    },

    "/api/applications/internship/{internshipId}": {
      get: {
        tags: ["Applications"],
        summary: "Applicants for one listing",
        description: "Company role. An ownership check rejects listings belonging to another company.",
        security: bearer,
        parameters: [{ ...pathId, name: "internshipId" }],
        responses: { 200: ok("Applicants", { success: true, applications: [] }), 401: errors[401], 403: errors[403] },
      },
    },

    "/api/applications/{id}/status": {
      patch: {
        tags: ["Applications"],
        summary: "Review, accept, or reject an applicant",
        description:
          "Company role, owner only. `accepted`/`rejected` stamp `decidedAt`, clear `seenAt` " +
          "and raise a notification for the student. The UI requires `reviewed` first.",
        security: bearer,
        parameters: [pathId],
        requestBody: body({ status: "accepted" }),
        responses: { 200: ok("Updated", { success: true }), 400: errors[400], 401: errors[401], 403: errors[403] },
      },
    },

    /* -------------------------------------------------------------------- CV */
    "/api/cv": {
      post: {
        tags: ["CV"],
        summary: "Save the student's CV",
        description: "Stores the builder's JSON in the `cvs` table so the CV follows the student across devices.",
        security: bearer,
        requestBody: body({ userCvData: { personal: { fullName: "Sok Dara" }, about: {}, experience: {} } }),
        responses: { 200: ok("Saved", { success: true }), 401: errors[401], 403: errors[403] },
      },
    },

    "/api/cv/mine": {
      get: {
        tags: ["CV"],
        summary: "Load the saved CV",
        security: bearer,
        responses: { 200: ok("CV", { success: true, cv: { id: 3, userCvData: {}, score: 78 } }), 401: errors[401] },
      },
      delete: {
        tags: ["CV"],
        summary: "Delete the saved CV",
        security: bearer,
        responses: { 200: ok("Deleted", { success: true }), 401: errors[401] },
      },
    },

    "/api/cv/score": {
      post: {
        tags: ["CV"],
        summary: "Score a CV (Google Gemini)",
        description: "Rate limited to 30/hour — these call a paid third-party API.",
        security: bearer,
        requestBody: body({ cvData: { personal: {}, about: {}, experience: {} } }),
        responses: { 200: ok("Score and suggestions", { score: 78, summary: "Solid CV.", suggestions: [] }), 401: errors[401], 429: errors[429] },
      },
    },

    "/api/cv/parse-upload": {
      post: {
        tags: ["CV"],
        summary: "Parse an uploaded PDF into CV fields",
        description: "Extracts text with pdf-parse, then structures it with Gemini. Rate limited to 30/hour.",
        security: bearer,
        requestBody: body({ file: "data:application/pdf;base64,JVBERi0xLjQK..." }),
        responses: { 200: ok("Structured CV", { personal: {}, about: {}, experience: {} }), 400: errors[400], 401: errors[401], 429: errors[429] },
      },
    },

    "/api/cv/generate-photo": {
      post: {
        tags: ["CV"],
        summary: "Generate a headshot (Hugging Face)",
        security: bearer,
        requestBody: body({ image: "data:image/jpeg;base64,/9j/4AAQ..." }),
        responses: { 200: ok("Generated image", { image: "data:image/jpeg;base64,..." }), 401: errors[401], 429: errors[429] },
      },
    },

    /* --------------------------------------------------------------- Student */
    "/api/student/profile": {
      get: {
        tags: ["Student"],
        summary: "The student's own profile",
        security: bearer,
        responses: { 200: ok("Profile", { success: true, profile: { fullName: "Sok Dara", education: "CADT", skills: "React, SQL" } }), 401: errors[401] },
      },
      put: {
        tags: ["Student"],
        summary: "Update the student's own profile",
        description: "Whitelisted fields only: fullName, phone, bio, education, skills, profileImage.",
        security: bearer,
        requestBody: body({ fullName: "Sok Dara", education: "BSc Computer Science — CADT", skills: "React, SQL", phone: "+855 12 345 678" }),
        responses: { 200: ok("Updated", { success: true }), 400: errors[400], 401: errors[401] },
      },
    },

    "/api/student/profile/{id}": {
      get: {
        tags: ["Student"],
        summary: "Another student's profile",
        description:
          "Readable by student, company, and admin — a company reviewing an applicant needs " +
          "it, so this route sits above the student-only guard. `phone` is stripped for " +
          "non-admin viewers.",
        security: bearer,
        parameters: [pathId],
        responses: { 200: ok("Profile", { success: true, profile: {} }), 401: errors[401], 403: errors[403], 404: errors[404] },
      },
    },

    "/api/student/saved-internships": {
      get: { tags: ["Student"], summary: "Saved listings", security: bearer, responses: { 200: ok("Saved", { success: true, internships: [] }), 401: errors[401] } },
    },
    "/api/student/saved-internships/{internshipId}": {
      post: { tags: ["Student"], summary: "Save a listing", security: bearer, parameters: [{ ...pathId, name: "internshipId" }], responses: { 200: ok("Saved", { success: true }), 401: errors[401] } },
      delete: { tags: ["Student"], summary: "Unsave a listing", security: bearer, parameters: [{ ...pathId, name: "internshipId" }], responses: { 200: ok("Removed", { success: true }), 401: errors[401] } },
    },

    "/api/student/followed-companies": {
      get: { tags: ["Student"], summary: "Followed companies", security: bearer, responses: { 200: ok("Companies", { success: true, companies: [] }), 401: errors[401] } },
    },
    "/api/student/followed-companies/{companyId}": {
      post: { tags: ["Student"], summary: "Follow a company", description: "Followers are notified when the company posts a new listing.", security: bearer, parameters: [{ ...pathId, name: "companyId" }], responses: { 200: ok("Following", { success: true }), 401: errors[401] } },
      delete: { tags: ["Student"], summary: "Unfollow a company", security: bearer, parameters: [{ ...pathId, name: "companyId" }], responses: { 200: ok("Unfollowed", { success: true }), 401: errors[401] } },
    },

    "/api/student/recommended-internships": {
      get: { tags: ["Student"], summary: "Recommended listings", security: bearer, responses: { 200: ok("Recommendations", { success: true, internships: [] }), 401: errors[401] } },
    },

    /* --------------------------------------------------------------- Company */
    "/api/company/profile": {
      get: { tags: ["Company"], summary: "The company's own profile", security: bearer, responses: { 200: ok("Profile", { success: true, profile: {} }), 401: errors[401], 403: errors[403] } },
      put: {
        tags: ["Company"],
        summary: "Update the company profile",
        description: "Whitelisted fields: companyName, industry, location, description, website, logoUrl, coverUrl, employeeCount, contact, telegramLink.",
        security: bearer,
        requestBody: body({ companyName: "TechNova", industry: "Information Technology", contact: "hr@technova.com" }),
        responses: { 200: ok("Updated", { success: true }), 400: errors[400], 401: errors[401], 403: errors[403] },
      },
    },
    "/api/company/stats": { get: { tags: ["Company"], summary: "Dashboard counters", security: bearer, responses: { 200: ok("Stats", { success: true, stats: { listings: 3, applicants: 12 } }), 401: errors[401], 403: errors[403] } } },
    "/api/company/connections": { get: { tags: ["Company"], summary: "Other companies on the platform", security: bearer, responses: { 200: ok("Companies", { success: true, companies: [] }), 401: errors[401], 403: errors[403] } } },
    "/api/company/students": { get: { tags: ["Company"], summary: "Browsable student directory", description: "Active accounts only. Powers the Explore > Students tab.", security: bearer, responses: { 200: ok("Students", { success: true, students: [] }), 401: errors[401], 403: errors[403] } } },
    "/api/company/search": {
      get: {
        tags: ["Company"], summary: "Search students, companies, and listings",
        security: bearer,
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string", minLength: 2 } }],
        responses: { 200: ok("Results", { success: true, results: { students: [], companies: [], internships: [] } }), 401: errors[401], 403: errors[403] },
      },
    },

    /* --------------------------------------------------------- Notifications */
    "/api/notifications": { get: { tags: ["Notifications"], summary: "The user's notifications", security: bearer, responses: { 200: ok("Notifications", { success: true, notifications: [] }), 401: errors[401] } } },
    "/api/notifications/unread": { get: { tags: ["Notifications"], summary: "Unread only", security: bearer, responses: { 200: ok("Unread", { success: true, notifications: [] }), 401: errors[401] } } },
    "/api/notifications/unread-count": { get: { tags: ["Notifications"], summary: "Unread count for the bell badge", security: bearer, responses: { 200: ok("Count", { success: true, count: 3 }), 401: errors[401] } } },
    "/api/notifications/read-all": { patch: { tags: ["Notifications"], summary: "Mark everything read", security: bearer, responses: { 200: ok("Marked", { success: true }), 401: errors[401] } } },
    "/api/notifications/{id}/read": { patch: { tags: ["Notifications"], summary: "Mark one read", description: "Refuses a notification belonging to another user.", security: bearer, parameters: [pathId], responses: { 200: ok("Marked", { success: true }), 401: errors[401], 404: errors[404] } } },

    /* ---------------------------------------------------------------- Public */
    "/api/public/companies": { get: { tags: ["Public"], summary: "Browse companies", responses: { 200: ok("Companies", { success: true, companies: [] }) } } },
    "/api/public/companies/{id}": { get: { tags: ["Public"], summary: "One company, with its open listings", parameters: [pathId], responses: { 200: ok("Company", { success: true, company: {} }), 404: errors[404] } } },
    "/api/public/search": { get: { tags: ["Public"], summary: "Search listings and companies", parameters: [{ name: "q", in: "query", required: true, schema: { type: "string", minLength: 2 } }], responses: { 200: ok("Results", { success: true, results: {} }) } } },

    /* ----------------------------------------------------------------- Admin */
    "/api/admin/stats": { get: { tags: ["Admin"], summary: "Platform totals", security: bearer, responses: { 200: ok("Stats", { success: true, stats: { users: 21, internships: 10, applications: 10 } }), 401: errors[401], 403: errors[403] } } },
    "/api/admin/suspicious": { get: { tags: ["Admin"], summary: "Flagged accounts", description: "Suspended users, and company accounts with no profile row (junk signups).", security: bearer, responses: { 200: ok("Flagged", { success: true, flagged: [] }), 403: errors[403] } } },

    "/api/admin/audit-logs": {
      get: {
        tags: ["Admin"],
        summary: "Audit trail",
        description:
          "Filtering is applied in the query, not in the browser — so a search for a rare " +
          "action still finds it beyond the row limit. `limit` is clamped to 1–2000.",
        security: bearer,
        parameters: [
          { name: "action", in: "query", schema: { type: "string" }, example: "USER_LOGIN" },
          { name: "role", in: "query", schema: { type: "string", enum: ["student", "company", "admin"] } },
          { name: "from", in: "query", schema: { type: "string", format: "date" } },
          { name: "to", in: "query", schema: { type: "string", format: "date" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 150, maximum: 2000 } },
        ],
        responses: { 200: ok("Logs plus the distinct action list", { success: true, logs: [], actions: ["USER_LOGIN"], limit: 150 }), 403: errors[403] },
      },
    },

    "/api/admin/users": {
      get: {
        tags: ["Admin"], summary: "List accounts", security: bearer,
        parameters: [
          { name: "role", in: "query", schema: { type: "string", enum: ["student", "company", "admin"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "inactive", "suspended"] } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 200, maximum: 200 } },
        ],
        responses: { 200: ok("Users", { success: true, users: [], page: 1, pageSize: 200 }), 403: errors[403] },
      },
    },

    "/api/admin/users/{id}": {
      get: { tags: ["Admin"], summary: "One account in detail", security: bearer, parameters: [pathId], responses: { 200: ok("User", { success: true, user: {} }), 403: errors[403], 404: errors[404] } },
      delete: {
        tags: ["Admin"], summary: "Delete an account",
        description:
          "Irreversible. For a company, every application to its listings is **tombstoned " +
          "first** — snapshotting the title and company name — so students keep the record " +
          "of an application they may already have been accepted for. Admin accounts cannot " +
          "be deleted here.",
        security: bearer, parameters: [pathId],
        requestBody: body({ reason: "Fraudulent listings" }),
        responses: { 200: ok("Deleted", { success: true, tombstoned: 4 }), 400: errors[400], 403: errors[403] },
      },
    },

    "/api/admin/users/{id}/status": {
      patch: {
        tags: ["Admin"], summary: "Suspend, reactivate, or deactivate",
        description:
          "Suspending **requires a reason**. `days` may be 1–3650 or `permanent`; a timed " +
          "suspension lifts itself on the next login or session check, with no scheduler. " +
          "An admin cannot change their own status, and admin accounts are not modifiable here.",
        security: bearer, parameters: [pathId],
        requestBody: body({ status: "suspended", reason: "Repeated spam listings", days: 7 }),
        responses: { 200: ok("Updated", { success: true, message: "User suspended until Sun Jul 26 2026" }), 400: errors[400], 403: errors[403] },
      },
    },

    "/api/admin/users/{id}/activity": {
      get: {
        tags: ["Admin"], summary: "One account's audit trail", security: bearer,
        parameters: [pathId,
          { name: "from", in: "query", schema: { type: "string", format: "date" } },
          { name: "to", in: "query", schema: { type: "string", format: "date" } },
          { name: "action", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: ok("Logs", { success: true, logs: [] }), 403: errors[403], 404: errors[404] },
      },
    },

    "/api/admin/users/{id}/internships": { get: { tags: ["Admin"], summary: "A company's listings", security: bearer, parameters: [pathId], responses: { 200: ok("Listings", { success: true, internships: [] }), 400: errors[400], 403: errors[403] } } },
    "/api/admin/users/{id}/cv": { get: { tags: ["Admin"], summary: "A student's CV", description: "So an admin can check a CV isn't being used maliciously.", security: bearer, parameters: [pathId], responses: { 200: ok("CV", { success: true, cv: {} }), 400: errors[400], 403: errors[403] } } },

    "/api/admin/internships/{id}": {
      get: { tags: ["Admin"], summary: "One listing with every applicant", description: "Read a reported listing and see who it affects before moderating it.", security: bearer, parameters: [pathId], responses: { 200: ok("Listing", { success: true, internship: {} }), 403: errors[403], 404: errors[404] } },
      delete: { tags: ["Admin"], summary: "Delete a listing", description: "Tombstones its applications first, same as deleting a company.", security: bearer, parameters: [pathId], requestBody: body({ reason: "Misleading description" }), responses: { 200: ok("Deleted", { success: true, tombstoned: 2 }), 403: errors[403], 404: errors[404] } },
    },

    "/api/admin/internships/{id}/status": {
      patch: {
        tags: ["Admin"], summary: "Suspend or restore a listing",
        description: "A suspended listing is hidden from browsing and stops accepting applications. A reason is required to suspend.",
        security: bearer, parameters: [pathId],
        requestBody: body({ status: "suspended", reason: "Misleading salary information" }),
        responses: { 200: ok("Updated", { success: true }), 400: errors[400], 403: errors[403], 404: errors[404] },
      },
    },
  },
};

export default openapiSpec;
