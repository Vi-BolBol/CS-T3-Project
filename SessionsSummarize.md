# Sessions Summary — Internship Finder

Running log of everything changed, why, and what's still open.
**All future session notes get appended here** rather than scattered across new files.

---

## Setup (read this first)

```powershell
# Backend
cd Backend
npm install
npx prisma migrate reset     # drops, rebuilds, seeds
npm run dev                  # :3000

# Frontend
cd Frontend
npm install
npm run dev                  # :5173
```

**Run commands one at a time.** In PowerShell `|` is a *pipe*, not "and then" — chaining
with `|` runs everything at once and produces confusing, interleaved errors.

`Backend/.env` is **never** included in any zip (secrets shouldn't round-trip through a
chat). Back it up before extracting, or you'll delete it. `Backend/.env.example` lists the
required keys.

### Logins (seeded, password `password123`)
| Account | Lands on |
|---|---|
| `admin1@example.com` | `/admin` |
| `student1@example.com` … `student10@` | `/user/home` |
| `company1@example.com` … `company3@` | `/company/home` |

### Becoming an admin
Admins **cannot** self-register — `/api/auth/register` rejects `role: "admin"` by design.
Two legitimate paths:
1. Log in as the seeded `admin1@example.com`.
2. Register normally, then from `Backend/`: `npm run make-admin -- your@email.com`
   (`--revoke` to undo). **Log out and back in** — the role lives in the JWT.

---

## ⚠️ Outstanding security actions (not done — require you)

1. **Rotate the Supabase database password.** `Rathanak02` (the `postgres` superuser) was
   pasted into chat. Owned by whoever holds the Supabase project.
2. **Replace `JWT_SECRET="a"`.** A one-character secret is forgeable in milliseconds —
   anyone could mint a token with `role:"admin"` and walk into the admin panel.
   Generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

---

## Session 1 — Design system & student navigation

- **Theme tokens.** Every colour moved to CSS variables in `index.css` (`--c-surface`,
  `--c-accent`, …) exposed to Tailwind as semantic classes (`bg-surface`, `text-content`,
  `border-line`, `bg-accent`). Light + green is the default; `.dark` on `<html>` flips
  everything. **Never hardcode hex in JSX again.**
- **`ThemeProvider`** + `useTheme()`, persisted to `localStorage` (`if-theme`).
  Toggle lives **only in Settings → Appearance**.
- **`StudentNavbar` rebuilt** — full-width sticky bar; Home / CV / Applications /
  Internships; live search with internship-title suggestions; alert badge on Applications.
- **Routes** — added `/user/internships` (the search destination), `/user/profile/:id`
  (public profile); `/user/browse` redirects.

## Session 2 — Student pages

- **Home** — hero search, recommendations, followed companies, saved preview, CV-sync prompt.
- **Internships** — filters for location, work environment, internship type, company,
  company type, pay range. Lands pre-filled from `?q=`.
- **Applications** — Applied + Saved tabs, status tracking, withdraw.
- **Settings** — left sidebar: Appearance · Account · Security · Memory, plus Log out.
- **Profile** — cover banner, avatar, editable **target role** with autocomplete,
  owner mode (edit / preview-as-public / share) vs read-only public mode.
- **Apply gate** — no CV → redirect to `/cv`; finishing either CV path unlocks Apply.

## Session 3 — CV pages + persistence

- All 8 CV pages and 15 CV components migrated to theme tokens.
  **`components/cv/templates/` deliberately left white** — that's the printable CV paper;
  theming it would produce dark PDFs.
- **CV was never being saved.** `CVBuilderProvider` only wraps `/cv/*` and held state in
  plain `useState`, so navigating to Home unmounted it and destroyed the CV. Now persisted.
- **Profile sync now copies data.** `markCvSynced()` previously only flipped a boolean.
- **Date of birth** — three dropdowns (which allowed 31 February) → one native date picker.

## Session A — Security & authorization

**The root bug: the JWT had no `role`.** `loginService` signed `{ id, email }`, so
`req.user.role` was always `undefined` and *every* role check would 403 everyone — which is
why none were wired up. This single field blocked all RBAC.

- `authorize()` existed in `role.middleware.js` and was **never imported**. Now enforced on
  every company, student, and admin route.
- **CV/AI routes had no auth at all** — anyone could loop `/api/cv/score` and drain the
  Gemini/HuggingFace quota. Now protected and rate-limited.
- **Registration never created a profile row**, so manually-registered accounts 400'd on
  every profile-dependent route. Now `User` + profile in one transaction. Email format and
  8-char password enforced; `admin` self-assignment blocked.
- **Error middleware** (`notFound`, `errorHandler`) — structured JSON, stack logged
  server-side only, Prisma `P2002`→409 / `P2025`→404.
- **helmet, morgan, express-rate-limit** (auth: 10/15min; AI: 30/hr).
- **Deleted `guards/`** — never imported, CommonJS in an ESM project, and comparing roles to
  uppercase `"COMPANY"` against a lowercase enum. Broken three ways.

Verified by execution: no token → 401 · old token (no role) → 403 · student→company route →
403 · company→company → 200 · unknown route → 404 · thrown error → 500 with no stack leak.

## Session B — Application & CV APIs (the database connection)

The `Application` model existed in Prisma with **no controller, service, or routes** — the
frontend called `/api/applications` and got a 404. This blocked the student *and* company
*and* admin sides simultaneously.

| Method | Endpoint | Role |
|---|---|---|
| POST | `/api/applications` | student — apply (auto-attaches CV) |
| GET | `/api/applications/mine` | student — track |
| DELETE | `/api/applications/:id` | student — withdraw (own only) |
| GET | `/api/applications/company` | company — all applicants |
| GET | `/api/applications/internship/:id` | company — applicants for one listing |
| PATCH | `/api/applications/:id/status` | company — **accept / reject** |
| POST / GET / DELETE | `/api/cv`, `/api/cv/mine` | student — CV persistence |

- Ownership enforced everywhere: companies only touch applications on internships they own.
- The `Cv` model was unused; CVs now live in the DB (`userCvData` JSON column) and **follow
  the student across devices**.
- Frontend hooks swapped from `localStorage` to real `fetch` — **no page component changed**,
  because the return shapes were matched from the start.
- The "Simulate accept/reject" dev buttons are **gone** — decisions are real now.

Verified against real PostgreSQL: all 9 tables built from the real migrations; **duplicate
applications rejected** by `applications_studentId_internshipId_key` (**FR-04**); status
enum-constrained; cascade deletes working.

## Session C — Admin panel

- **API** (all `protect` + `authorize("admin")`): `/stats`, `/users`, `/users/:id/status`,
  `/users/:id` (delete), `/audit-logs`, `/suspicious`.
- **Guardrails:** an admin can't suspend or delete themselves, and admin accounts can't be
  modified through the panel at all — only via CLI. Prevents an admin lockout war.
- **`AuditLog` is real now.** Records `USER_REGISTERED`, `USER_LOGIN`, `LOGIN_FAILED`,
  `LOGIN_BLOCKED_SUSPENDED`, `APPLICATION_SUBMITTED`, `APPLICATION_ACCEPTED/REJECTED`,
  `USER_SUSPENDED/ACTIVE`, `USER_DELETED`, `ADMIN_GRANTED/REVOKED`. Fire-and-forget —
  a logging failure never breaks the request it records.
- **Suspension actually works** — `loginService` refuses to issue a token to a suspended
  account. Without that, "Suspend" would have been purely cosmetic.
- **Pages:** `/admin` (stats + flagged accounts), `/admin/users` (search, suspend,
  reactivate, delete), `/admin/audit` (colour-coded activity feed).
- `RequireAdmin` gates routes client-side — **convenience, not security.** Anyone can edit
  `localStorage`; real enforcement is server-side. This is why the weak `JWT_SECRET` matters.

**No transactions page**, deliberately. Step-5 payment is a UI-only simulation
(README Known Issue #6) and `PROJECT_SPEC.md` lists payments as **out of scope**. Faking a
transactions table would look worse at defense than not having one.

## Session D — Company side

**Run `npx prisma migrate dev` (or `migrate reset`) — this session adds a migration.**

### Schema fix found while building
`CompanyProfile.userId` had **no `@unique`**, but `StudentProfile.userId` did — yet code
(including Session B's) calls `findUnique({ where: { userId } })` on it, which Prisma
**rejects** unless the field is unique. Latent runtime error, now fixed.
The same migration adds `location`, `employeeCount`, and `coverUrl`, which the profile card
needs and the schema didn't have.

Verified on real Postgres: unique index created, duplicate `userId` rejected, new columns readable.

### New backend
| Method | Endpoint | Purpose |
|---|---|---|
| GET/PUT | `/api/company/profile` | Own profile (whitelisted fields only) |
| GET | `/api/company/stats` | Listings, applicants, pending/accepted/rejected, per-listing counts |
| GET | `/api/company/connections` | Other companies on the platform |
| GET | `/api/company/search?q=` | Students + companies + internships |

All `protect + authorize("company")`.

### New/rebuilt pages
- **Navbar** — Home · Dashboard · Internships · Search · Settings · Profile, with a
  **new-applicant badge** and live search suggestions across students, companies, internships.
- **Home** — left profile card (logo, name, location, headcount, listings), stat cards,
  **applications-per-listing analytics bars**, and other companies on the platform.
- **Internships** — listing/application counts, filter by status, **inline CV + profile
  review**, and **Accept / Reject in one click**. Uses the Session B API, so decisions are
  real and light up the student's notification badge. Opening the page clears the badge.
- **Search** — tabbed across internships / students / companies.
- **Profile** — cover banner, logo with online ring, editable name, industry, location,
  headcount, website, contact, Telegram, description.
- **Settings** — sidebar: Appearance · Account · Security, plus Log out.
- **New-company onboarding** — a company with zero listings is asked "post your first
  internship?" → yes goes to the wizard, no leaves them on an empty dashboard.

### Also
- **Student profile avatar** was rendering *behind* the cover. The negative margin alone
  wasn't enough — the row needed its own stacking context (`relative z-10`). Now it sits in
  front, with a pulsing **online ring** and status dot.
- Every remaining company page and component converted to theme tokens (dashboard, 5-step
  wizard, profile blocks, settings, footer).

### Still mocked
`mockApplicants.js` is now unused by the new Internships page — the old `CompanyDashboard`
still references it. Safe to delete once the dashboard is migrated to the real API.

---

## Bugs found and fixed along the way

| Bug | Why it mattered |
|---|---|
| JWT missing `role` | Made all authorization impossible |
| `/api/applications` didn't exist | Blocked student, company, and admin features |
| `pages/CV` vs `pages/cv` | Guaranteed Linux/CI build failure |
| `common/input.jsx` vs `Input.jsx` | **Was already breaking `vite build`** |
| CV lost on navigation | `CVBuilderProvider` had no persistence |
| CV/AI routes unauthenticated | Anyone could drain the paid AI quota |
| Registration created no profile row | Every profile-dependent route 400'd |
| `bg-linear-to-br` | Tailwind **v4** syntax in a v3 project — silently did nothing |
| DOB as 3 dropdowns | Allowed 31 February |
| Duplicate audit imports | Double-logged every login and registration |
| `cors({ origin: CLIENT_URL })` | Regression I introduced — README's `CLIENT_URL` pointed at the backend's own port, blocking the frontend |
| 3 duplicate admin scripts | Consolidated to one |
| `CompanyProfile.userId` not `@unique` | `findUnique({where:{userId}})` would throw at runtime |
| Profile avatar behind the cover | Negative margin without a stacking context |

---

## Still open

**Code**
- `CompanyDashboard` still uses `mockApplicants.js` — migrate it to the real API, then delete the mock
- **Swagger** docs (`/api/docs`) — Gen11 lists it twice
- **DB indexes** — zero `@@index` in the schema; Postgres does *not* auto-index FKs
- **DB roles/privileges**, backup scripts, encryption — Gen11 Database Administration
- Tests — `npm test` is a no-op; NFR-05 wants ≥60% coverage

**Documentation (worth real marks, no code needed)**
- **Software Engineering:** 4 UML diagrams (use case, activity, class, sequence) with
  descriptions, plus a stated methodology (SCRUM/etc.)
- **HCI:** UX research, a persona, user stories, documented user flow.
  *(Wireframes and mockups exist — attach them.)*

**Scope conflict to resolve before defense:** `PROJECT_SPEC.md` says payments are out of
scope, but the company wizard has a payment step. Pick a story — a lecturer reading both
documents will ask.

### Gen11 scorecard
- **Backend:** 7/13 → **11/13** (authorization ✓, error middleware ✓, CRUD complete ✓).
  Remaining: Swagger, API testing.
- **Database:** 6/12 → **7/12**. Remaining: indexing, user privileges, backup/recovery,
  encryption.
- **FR-04, FR-05, FR-06, FR-10** now have working code (all previously had none).
