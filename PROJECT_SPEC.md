# Internship Finder — Project Spec Reference

This is a condensed, implementation-focused reference derived from `InternshipFinder_Proposal.pdf`. Use this file as context when asking an AI agent to fix a bug, add a feature, or review code — it tells the agent what the system is supposed to do, who the actors are, what the data model looks like, and what's in/out of scope, so it doesn't guess or invent requirements that conflict with the proposal.

---

## 1. System Overview

Three roles, one platform, role-based ecosystem:

| Role | Can do |
|---|---|
| **Student** | Register/login, search & filter internships, apply, track application status, build/upload/generate/score a CV, save/favorite internships |
| **Company** | Register/login, manage company profile, post/edit/delete internship listings, view applicant profiles & CVs |
| **Admin** | Manage all users, moderate content, view analytics dashboard, audit logs |

**Out of scope (do not build unless explicitly asked):** accept/reject workflow for applicants, auto-notifications, in-platform messaging/chat, native mobile apps, payments/billing, AI recommendation engine, multi-language beyond English/Khmer.

---

## 2. Tech Stack (do not substitute without asking)

| Layer | Technology |
|---|---|
| Frontend | React.js (SPA), React Router, Axios, Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL 8.x + Sequelize ORM (migrations + seeders) |
| Auth | JWT (jsonwebtoken), bcrypt (≥10 salt rounds) |
| Validation | express-validator |
| Security | Helmet.js, express-rate-limit (on login/register) |
| Docs/Testing | Swagger UI (`/api/docs`), Postman collection |

Backend layering (keep this separation when adding/fixing code):
```
routes/        → Express routers, one file per domain (auth, students, companies, internships, applications, admin)
controllers/   → HTTP request/response handling, calls services, returns JSON
services/      → business logic, validation, orchestration
repositories/  → raw Sequelize queries, no business logic
middleware/    → verifyToken, roleGuard(roles), validate(), errorHandler, request logger
```

Middleware pipeline order: `cors()` → `helmet()` → `express.json()` → `morgan()` → `verifyToken` (protected routes) → `roleGuard(roles)` → `validate()` → controller → `errorHandler`.

---

## 3. Database Schema (MySQL via Sequelize)

7 core tables. When fixing bugs touching the DB, check this matches — flag it if the actual schema has drifted.

| Table | Key columns | Relationship |
|---|---|---|
| `users` | `id` PK, `email` UNIQUE, `password_hash`, `role` ENUM, `created_at` | central account table |
| `student_profiles` | `id` PK, `user_id` FK→users, `full_name`, `bio`, `skills`, `education` | 1:1 with users |
| `company_profiles` | `id` PK, `user_id` FK→users, `company_name`, `industry`, `logo_url` | 1:1 with users |
| `internships` | `id` PK, `company_id` FK, `title`, `description`, `deadline`, `status` | N:1 with company_profiles |
| `applications` | `id` PK, `student_id` FK, `internship_id` FK, `status`, `applied_at` | N:1 users, N:1 internships |
| `saved_internships` | `user_id` FK + `internship_id` FK (composite PK) | M:N junction (bookmarks) |
| `audit_logs` | `id` PK, `user_id` FK, `action`, `entity_type`, `entity_id`, `timestamp` | 1:N with users |

Constraints to preserve:
- `users.email` — UNIQUE
- `applications(student_id, internship_id)` — UNIQUE (prevents duplicate applications)
- `saved_internships` — composite PRIMARY KEY `(user_id, internship_id)`
- `applications.internship_id` — `ON DELETE CASCADE` when internship is deleted
- `role` and `status` fields are ENUM/CHECK constrained, not free text
- Indexes: `users.email` (UNIQUE INDEX), `internships.title` (FULLTEXT, for search), `applications.status` (INDEX), all FK columns indexed

DB access roles (least privilege): `app_user` (CRUD on app tables), `app_admin` (full schema access, migrations), `read_only` (SELECT only, for reporting).

---

## 4. Auth Flow

- **Register**: validate → bcrypt hash password → store → `201`
- **Login**: fetch user → `bcrypt.compare` → sign JWT with `{ userId, role, expiry }` → return token
- **Protected route**: client sends `Bearer` token → `verifyToken` middleware decodes/verifies → populates `req.user` → route executes
- **Authorization**: after JWT verified, `roleGuard(allowedRoles)` checks `req.user.role` → `403` if not allowed
- Token expiry: 24 hours. Refresh-token pattern is documented as future work, not yet implemented — don't assume it exists.

---

## 5. Key API Endpoints (reference shape — verify against actual code, this is the planned contract)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register student or company |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/internships` | Public | List internships, paginated + filterable |
| POST | `/api/internships` | Company | Create listing |
| PUT | `/api/internships/:id` | Company | Update listing |
| DELETE | `/api/internships/:id` | Company | Delete listing |
| POST | `/api/applications` | Student | Submit application |
| GET | `/api/students/profile` | Student | Get own profile |
| POST | `/api/cv/generate` | Student | Generate CV from profile data |
| GET | `/api/cv/score` | Student | Get CV score + feedback |
| GET | `/api/admin/users` | Admin | List all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete/suspend user |

Standard HTTP status codes expected: `200`, `201`, `400`, `401`, `403`, `404`, `500`. All errors should return structured JSON via the global `errorHandler` (e.g. `{ message, status }`), not raw stack traces or plain strings.

---

## 6. Functional Requirements (FR) — for checking if a fix/feature is in scope

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Register/login with email + password | High |
| FR-02 | Company CRUD on internship listings | High |
| FR-03 | Student keyword search + category/location filter | High |
| FR-04 | Submit application; duplicate prevented by unique constraint | High |
| FR-05 | Company views applicant profiles & CVs | High |
| FR-06 | Admin manages all users, moderates content | High |
| FR-07 | Student uploads a PDF CV | Medium |
| FR-08 | Student builds a CV via guided wizard ("CV Maker") | Medium |
| FR-09 | Student auto-generates a CV + receives a score with feedback | Medium |
| FR-10 | Admin dashboard with aggregate platform stats | Medium |

## 7. Non-Functional Requirements (NFR) — performance/quality bars to respect

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | API response time (normal load) | < 500ms |
| NFR-02 | Password hashing / token expiry | bcrypt ≥10 rounds; JWT 24h expiry |
| NFR-03 | Usability (user testing satisfaction) | ≥ 4.0 / 5.0 |
| NFR-04 | Stateless API (no server-side session state) | horizontal scaling ready |
| NFR-05 | Code documentation / test coverage | ≥ 60% coverage, Swagger docs |

---

## 8. User Flows (don't break these sequences when refactoring)

**Student application flow:**
`Register/Login → Browse/Search Internships → Filter (category, location) → View Listing Detail → Submit Application → Track Status (Pending/Under Review) → Contact company directly (email/Telegram)`

**Company recruitment flow:**
`Register/Login → Complete Company Profile → Post Listing → Receive Applicant Enquiries → Review Applicant Profiles/CVs → Communicate decisions directly with students`

Note: there is **no in-platform accept/reject or messaging system** in current scope — companies/students communicate off-platform (email/Telegram). Don't build a chat or notification system unless the scope changes.

---

## 9. UX/UI Principles (apply when fixing frontend bugs, not just backend)

- **Consistency**: shared design tokens (colors, typography, spacing) via Tailwind across all pages.
- **Navigation**: persistent role-based top nav bar; breadcrumbs on deep pages.
- **Feedback**: loading spinners, success toasts, error alerts, empty states — no native `alert()`/`confirm()` dialogs.
- **Error prevention**: confirmation dialogs before destructive actions; disable buttons during async ops.
- **Accessibility**: semantic HTML5, ARIA labels, keyboard navigation, WCAG AA contrast.
- **Responsive**: mobile-first Tailwind, must work across phone/tablet/desktop.

---

## 10. Security Checklist (verify when touching auth/data-handling code)

- Passwords: bcrypt, ≥10 salt rounds, never plaintext.
- JWT secret: in `.env`, never hardcoded or committed.
- All Sequelize queries parameterized (no raw string concatenation → SQL injection risk).
- React JSX escaping + Helmet CSP → XSS prevention.
- Rate limiting on `/api/auth/login` and `/api/auth/register`.
- `.env` excluded from version control.
- CV files served via access-controlled URLs, not directly exposed file paths.

---

## 11. How to use this file with an AI agent

When asking an agent to fix or extend something, point it at the relevant section above plus the actual code, e.g.:

> "Per `PROJECT_SPEC.md` section 5, `/api/cv/score` should return a score + feedback for a student's CV (FR-09). The current implementation in `cvController.js` doesn't return feedback, only a number — fix it to match the spec."

This keeps the agent from inventing endpoints, weakening auth requirements, adding out-of-scope features (chat, payments, AI recommendations), or quietly changing the schema/roles.
