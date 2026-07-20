# Logs — Errors Found & Fixed

Sessions: `session-D-company` → `session-E-public-auth` → `session-F-public-browsing`
Last updated: 2026-07-13

Four rounds of debugging so far. Each round's symptoms in the console traced
back to a small number of root causes — this doc tracks all of them so nothing
gets re-diagnosed from scratch next time.

---

## Round 1 — Student-side crash + backend 500s

### 1.1 Frontend crash — `ReferenceError: error is not defined`

**File:** `Frontend/src/pages/user/UserApplication.jsx` — line 33

`{error && ...}` was rendered on line 80, but `error` was never destructured
from the hook, even though `useMyApplications()` returns it.

**Before**
```js
const { applications, withdraw, loading } = useMyApplications();
```

**After**
```js
const { applications, withdraw, loading, error } = useMyApplications();
```

Status: ✅ Fixed.

---

### 1.2 Backend `500` — `/api/auth/register`, `/api/admin/users`, `/api/admin/suspicious`

**File:** `Backend/.env` — did not exist, only `.env.example` did.

Without `DATABASE_URL` / `DIRECT_URL` / `JWT_SECRET` set, every DB-touching
route throws inside Prisma and gets caught into a generic `500`.

**Fix:** copy `.env.example` → `.env` and fill in `DATABASE_URL` (pooler),
`DIRECT_URL` (direct), `JWT_SECRET`, and `CLIENT_URL="http://localhost:5173"`.
Then `npm run migrate` if the schema needs applying.

Status: ✅ Fixed.

---

### 1.3 `ERR_CONNECTION_REFUSED` — `/api/applications/company`

Not a code bug — the backend simply wasn't running (most likely it crashed on
startup from the missing `.env` in 1.2).

**Fix:** `cd Backend && npm run dev`. Confirm the terminal prints
`Server is running on port 3000` with no crash right after.

Status: ✅ Fixed.

---

## Round 2 — Mass `401 Unauthorized` on student-side API calls

Symptoms: `useSavedInternships.js`, `useMyApplications.js`,
`useRecommendedInternships.js`, `useCvStatus.js`, `useFollowedCompanies.js`
all returning `401`.

### Root cause
`auth.middleware.js` verifies every token with
`jwt.verify(token, process.env.JWT_SECRET)`. The browser still held a token
signed **before** `JWT_SECRET` was set in 1.2. Once the secret changed, every
previously-issued token fails verification → `401` on every authenticated route.

Not a bug — it's the signature check working correctly — but a predictable side
effect any time `JWT_SECRET` changes.

### Fix
Clear the stale token (DevTools → Application → Local Storage → delete `token`,
or just log out), then log in again.

Status: ✅ Fixed (expected behavior, resolved by re-login).

---

## Round 3 — Company signup: `500` on register, `403` on company routes

### 3.1 Field name mismatch between signup form and backend

**File:** `Frontend/src/pages/auth/signup.auth.jsx`

The form sent a generic `name` field, but `Backend/services/auth.service.js`
destructures `fullName` (student) or `companyName` (company):

```js
const { email, password, role = "student", fullName, companyName } = payload;
```

So `companyName` always arrived `undefined` → stored as `null`. Not fatal by
itself, but every company account ended up with no name.

**Fix:** send the field the backend actually reads, keyed off the selected role.
In the Session E rewrite this is table-driven (`ROLES[role].nameField`), so the
mapping can't silently drift again.

Status: ✅ Fixed.

---

### 3.2 Prisma schema relation bug — `CompanyProfile` declared as a list

**File:** `Backend/prisma/schema.prisma`

`CompanyProfile.userId` is `@unique` (one-to-one), but the reverse side on
`User` was declared as an array (`CompanyProfile[]`), telling Prisma it was
one-to-many. `admin.model.js` filters on `companyProfile: null`, which is only
valid syntax for an optional one-to-one — so Prisma rejected it at runtime.
That is almost certainly what caused the original `/api/admin/suspicious` `500`.

**Fix**
```prisma
model User {
  companyProfile  CompanyProfile?    // was CompanyProfile[]
}
```
Then `npx prisma migrate dev --name fix_company_profile_relation`.

Status: ✅ Fixed — line 57 of the schema now reads `CompanyProfile?`.

---

### 3.3 `403 Forbidden` on company-only routes

**File:** `Backend/middleware/role.middleware.js`

`403` (rather than `401`) means the request **was** authenticated — the token is
valid — but its `role` isn't `"company"`. Since every company registration had
been failing with `500` (3.1/3.2), no company account ever existed; the browser
was still holding an older student token while visiting company-only pages.

**Fix:** clear the stale token, apply 3.1 and 3.2, then sign up again with
**Company** selected.

Status: ✅ Fixed (both dependencies applied — clear the token and sign up fresh).

---

## Round 4 — Logout redirect + public-site theming

### 4.1 Logging out landed on `/login` instead of the public home

**Files:** `components/layout/AdminLayout.jsx`, `components/layout/AdminNavbar.jsx`,
`pages/user/UserSetting.jsx`, `pages/company/CompanySetting.jsx`

All four carried their own copy of the same handler:

```js
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login');          // ❌ dumps a logged-out visitor straight back into a form
};
```

Four copies meant four places to get it wrong, and a logged-out visitor never
got the chance to browse the product before being asked to log in again.

**Fix:** one shared `Frontend/src/hooks/useLogout.js`:

```js
navigate('/', { replace: true });
```

`replace: true` matters — without it, Back returns to the authenticated page,
which then fires API calls with a token that no longer exists and 401s.

The hook also clears the per-device caches (`if-cv-data`, `if-applications`, …).
Leaving those behind leaks the previous user's CV and application list into the
next login on a shared machine.

Status: ✅ Fixed.

### 4.2 Public site was on a different design system entirely

**Files:** `pages/Home.jsx`, `About.jsx`, `Contact.jsx`, `NotFound.jsx`,
`pages/auth/*`, `components/layout/{Header,Footer,HeroSection}.jsx`,
`components/common/{Button,Card,Input}.jsx`, `pages/company/{company,companyDetail}.jsx`

These pages predate the token system and still hardcoded `bg-[#070B19]`,
`text-gray-400`, `greenMain`, `darkBlue`. They ignored the theme toggle
entirely — a light-mode user logging out fell off a cliff into a dark page.

**Fix:** every public page migrated to the semantic tokens
(`bg-surface` / `bg-raised` / `bg-muted` / `border-line` / `text-content` /
`text-subtle` / `text-faint` / `bg-accent`). Zero hex literals remain outside
`index.css`. Verified with a grep for `#0`, `#1`, `greenMain`, `darkBlue`,
`gray-N` across the public tree.

### 4.3 `<Input label="…" />` warning

`components/common/Input.jsx` spread `label` straight onto the `<input>` element,
so React warned and dropped it — the auth pages had been passing `label` and
silently rendering nothing. `Input` now renders the label properly (and supports
`error`).

Status: ✅ Fixed.

---

## Summary table

| # | Symptom | Root cause | File(s) | Status |
|---|---|---|---|---|
| 1.1 | `ReferenceError: error is not defined` | `error` not destructured from hook | `pages/user/UserApplication.jsx` | ✅ Fixed |
| 1.2 | `500` on register / admin routes | Missing `Backend/.env` | `Backend/.env` | ✅ Fixed |
| 1.3 | `ERR_CONNECTION_REFUSED` | Backend not running | — | ✅ Fixed |
| 2 | Mass `401` on student routes | Stale token signed with old `JWT_SECRET` | browser Local Storage | ✅ Fixed |
| 3.1 | Company name never saved | Frontend sent `name`; backend reads `companyName`/`fullName` | `pages/auth/signup.auth.jsx` | ✅ Fixed |
| 3.2 | `500` on register-as-company, `/admin/suspicious` | `CompanyProfile[]` should be `CompanyProfile?` | `Backend/prisma/schema.prisma` | ✅ Fixed |
| 3.3 | `403` on company routes | Stale non-company token + failed registration | Local Storage + 3.1/3.2 | ✅ Fixed |
| 4.1 | Logout landed on `/login` | Four hardcoded `navigate('/login')` handlers | → `hooks/useLogout.js` | ✅ Fixed |
| 4.2 | Public site ignored the theme | Hardcoded hex predating the token system | 12 public files | ✅ Fixed |
| 4.3 | `label` prop dropped with a React warning | `label` spread onto `<input>` | `components/common/Input.jsx` | ✅ Fixed |
| 5.1 | Navbar and content on different left edges | `max-w-5xl` sections under a `max-w-7xl` navbar | `pages/Home.jsx` | ✅ Fixed |
| 5.2 | No public browsing; signup required to see anything | No public API + no public pages | `/api/public/*`, `Explore.jsx`, `InternshipDetail.jsx` | ✅ Fixed |
| 5.3 | `/company` showed six fake companies | Hardcoded array | `pages/company/company.jsx` (deleted) | ✅ Fixed |

---

## Round 5 — Alignment, motion, public browsing

### 5.1 The navbar and the content didn't line up

**Files:** `pages/Home.jsx`

`Header` / `Footer` used `max-w-7xl`; the stats bar and the stories block used `max-w-5xl`.
Two different containers on the same page means two different left edges — the thing you
notice instantly and can't name. All public sections now share one container:
`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.

Status: ✅ Fixed.

### 5.2 No public browsing — you had to sign up to see a single listing

**New:** `Backend/{routes,controllers,services,models}/public.*` → `/api/public/*`,
`Frontend/src/pages/Explore.jsx`, `Frontend/src/pages/InternshipDetail.jsx`.

Browsing is now open to everyone. **Applying** is gated: no token →
`/login?next=/internships/:id`. That mirrors the server (`POST /api/applications` is
`protect` + student-only), so the gate is a courtesy, not the security boundary — the
server would 401 an anonymous apply regardless.

`?next=` is validated (`startsWith('/')`, not `//`). An unvalidated `next` is an
open-redirect: `/login?next=https://evil.example` would hand the attacker a login form on
your domain that bounces to theirs.

Status: ✅ Fixed.

### 5.3 `/company` was a hardcoded array of fake companies

`pages/company/company.jsx` shipped six invented companies (TechNova, RMA, AMK Bank…).
Deleted. `/company` now redirects to `/companies`, which reads `/api/public/companies`.

Status: ✅ Fixed.

---

## Round 6 — Signup hijack, routing, and the line through the stats bar

### 6.1 🔴 CRITICAL — Signing up logged you into the *previous* account

**Files:** `Backend/services/auth.service.js`, `Frontend/src/pages/auth/signup.auth.jsx`

`registerService` returned `{ success, message, user }` — **no token**. The signup page did:

```js
if (res.token) localStorage.setItem("token", res.token);   // no token -> no-op
if (res.user)  localStorage.setItem("user", JSON.stringify(res.user));
navigate("/user/home");
```

So on any machine that had logged in before, the **new user object was written over the
OLD token**. `user` said "you are Bob"; the `Authorization: Bearer` header still said
"you are Alice" — and the server believes the token, not the JSON. Every request came back
as Alice's data. This is the exact "it goes into an account before I made it" symptom.

Worse than a UI glitch: on a shared machine, a fresh signup silently hands the new person
the previous person's session.

**Fix (both ends):**
- `registerService` now signs and returns a token, identical in shape to `loginService`
  (`{ id, email, role }` — the `role` claim is what makes `authorize()` work).
- The signup page clears `token` and `user` **before** writing, and if no token comes back
  it refuses to proceed and sends you to `/login` rather than guessing.
- Login clears first too, for the same reason.

Status: ✅ Fixed. Verified: the register token decodes with `role` and an `exp`.

### 6.2 Auth cooldown was 15 minutes

`windowMs: 15 * 60 * 1000` → `60 * 1000`. Still 10 attempts per IP, but the lockout clears
after a minute. (This is brute-force protection, so it can't go to zero — 10 tries/minute is
still a hard ceiling for a password-guessing script, while being invisible during development.)

Status: ✅ Fixed.

### 6.3 A line ran through the stats bar on `/`

The stats card used `-mt-8` to hang over the hero, and the hero had `border-b border-line`.
The border ran straight across the overlapping card. Removed the overlap **and** the border.

Status: ✅ Fixed.

### 6.4 🔴 Dead routes — `/company/:id` links 404'd

Removing the public company page in Session F left three live links pointing at a route that
no longer existed: `UserHome`, `CompanyHome`, `CompanySearch`, plus `CompanyNavbar`'s search
suggestions. All repointed at the Explore pane.

Found by a script that extracts every `to=` / `navigate()` target in the codebase and
matches it against the route table. It now reports zero dead links.

Status: ✅ Fixed.

### 6.5 `/view-detail` rendered the STUDENT shell for company users

`ViewDetail.jsx` imports `StudentNavbar`, `StudentFooter`, and the student-only hooks — but
`CompanyNavbar` and `CompanySearch` both linked to it. A company clicking its own search
result got a student navbar and a wall of 403s. Details now open in a pane, so the page was
deleted and `/view-detail` is a redirect: students to their own page, everyone else to the
public one.

Status: ✅ Fixed.

### 6.6 No route guards at all outside `/admin`

A logged-out visitor could open `/user/home` or `/company/dashboard` and watch every fetch
401 into an empty shell; a student could sit on `/company/dashboard`. New
`components/shared/RequireRole.jsx` gates the student, company, and admin route groups and
redirects to `/login?next=…`.

**It is convenience, not security** — anyone can edit `localStorage`. The real boundary is
`protect + authorize(role)` on every API route. What it fixes is the *routing*.

One exception, deliberately: `/user/profile/:id` accepts `student | company | admin`.
Companies reach it from an applicant row and admins from the user table — student-only would
have bounced a company mid-review back to its own dashboard.

Status: ✅ Fixed.

### 6.7 The company wizard and dashboard were never migrated off the dark hex

30 files under `components/company/`, `components/ui/`, and `pages/company/` still hardcoded
`#070B19` / `#111B34` / `white/10` / `greenMain`. In **light mode the 5-step internship
wizard rendered as dark cards** — the single most demo-visible page on the company side.
All migrated to tokens; `greenMain`/`darkBlue` deleted from `tailwind.config.js` so nobody
can reach for them again.

Status: ✅ Fixed.

---

## Summary table — Rounds 5 & 6

| # | Symptom | Root cause | Status |
|---|---|---|---|
| 5.1 | Navbar and content on different left edges | `max-w-5xl` sections under a `max-w-7xl` navbar | ✅ Fixed |
| 5.2 | No public browsing | No public API, no public pages | ✅ Fixed |
| 5.3 | `/company` showed six fake companies | Hardcoded array | ✅ Fixed |
| **6.1** | **Signup drops you into the previous account** | **`register` returned no token; the new `user` overwrote the old one beside a stale token** | ✅ Fixed |
| 6.2 | 15-minute auth lockout | `windowMs: 15 * 60 * 1000` | ✅ Fixed (60s) |
| 6.3 | Line through the stats bar | `-mt-8` overlap + hero `border-b` | ✅ Fixed |
| 6.4 | `/company/:id` links 404'd | Route removed, links not updated | ✅ Fixed |
| 6.5 | Company users got the student navbar | `/view-detail` always rendered the student page | ✅ Fixed |
| 6.6 | No route guards outside `/admin` | No `RequireRole` | ✅ Fixed |
| 6.7 | Company wizard was dark in light mode | 30 files never migrated off hardcoded hex | ✅ Fixed |

---

## Round 7 — Public API leaks

### 7.1 🔴 `?status=draft` handed anonymous visitors every unpublished listing

**File:** `Backend/services/internship.service.js`

```js
const internships = await findPublicInternships({ status: query.status || "open" });
```

The query string went **straight into the Prisma `where`**. `GET /api/internships` is public
(no `protect`), so:

```
GET /api/internships?status=draft
```

returned every draft on the platform — listings companies had written but not published — to
anyone who typed the URL. `?status=bogus` also blew Prisma's enum check into a `500`.

**Fix:** whitelist. `open` and `closed` are browsable; anything else (including `draft`,
garbage, and mixed case) falls back to `open`. A company sees its own drafts through
`/api/internships/mine`, which is `protect + authorize("company")`.

Status: ✅ Fixed. Verified across `{}`, `draft`, `DRAFT`, `bogus`, `closed`.

### 7.2 🔴 The public listing detail returned the company's private fields

**File:** `Backend/models/internship.model.js` → `findInternshipById` uses
`include: { company: true }` — the **whole** `CompanyProfile` row. That includes `contact`
(phone number), `telegramLink`, and `userId`, the internal FK back to the user account.
`GET /api/internships/:id` is public, so all of it was being served to anyone.

It also returned **drafts** by id — so even with 7.1 fixed, `GET /api/internships/2` would
still have served an unpublished listing to a stranger.

**Fix:** a new `optionalAuth` middleware (decodes a token if present, never rejects) on that
one route. The service now knows *who is asking*:

| Requester | Draft listing | `company.contact` / `telegramLink` / `userId` |
|---|---|---|
| Anonymous | 404 | stripped |
| Student | 404 | stripped |
| Another company | 404 | stripped |
| **Owning company** | visible | visible |
| **Admin** | visible | visible |

The owner still gets everything because the company edit form reads this same endpoint —
narrowing it unconditionally would have broken editing.

`optionalAuth` is explicitly **not a guard** and is documented as such in the middleware.

Status: ✅ Fixed. Verified across all five requester types.

### 7.3 A "Log Out" button that didn't log out

`components/company/Settings/SidebarNav.jsx` ran `alert('Logging out...')` and nothing else.
Dead component with no importers — deleted.

### 7.4 `/company/create-wizard` was a mock page

`CreateSetting.jsx`: "Configure your foundational configuration matrix", a fake webhook field,
and `alert("Workspace settings generated successfully!")` on submit. Nothing linked to it, but
the route was live and a lecturer could have typed the URL. Deleted, with its route.

**There is now no native `alert()` anywhere in the app.**

Status: ✅ Fixed.

| # | Symptom | Root cause | Status |
|---|---|---|---|
| 7.1 | Anonymous users could read unpublished drafts | `query.status` passed straight to Prisma | ✅ Fixed |
| 7.2 | Public listing exposed company phone, Telegram, and internal `userId` | `include: { company: true }` on a public route | ✅ Fixed |
| 7.3 | Company Settings "Log Out" was an `alert()` | Fake handler | ✅ Fixed (deleted) |
| 7.4 | `/company/create-wizard` was a mock page | Never removed | ✅ Fixed (deleted) |

## Session J

| Bug | Why it mattered |
|---|---|
| **"Finish CV" did nothing** | `CVStep5Preview` called `saveCvToServer(cvData)`, but that name aliased `markCvCreated(source)` — whose parameter is a short *string*. The whole CV (base64 photo included) was written into the small `if-cv-status` key, throwing `QuotaExceededError` on any CV with a photo. The unguarded `setItem` rejected the async handler, so `navigate('/cv/manage')` never ran. Silent, and 100% reproducible once a photo existed. |
| **Uploaded PDFs never parsed** | `api/cvApi.js` is the one module still on axios and sent **no `Authorization` header**. Session A had put `protect` on `/api/cv/*`, so parse, scoring, and AI headshots had all been returning 401 since then — surfaced only as "Failed to parse CV". |
| **"Convert to Editable CV" threw** | `handleConvert` spread `...cvData`, but `cvData` was never destructured from `useCVBuilder()` in that file — a `ReferenceError` on click. Even with auth fixed, the parsed PDF could not reach the builder. |
| **Applications badge always read 0** | `useApplicationAlerts` counted from `localStorage['if-applications']`; `useMyApplications` fetches from the API and never wrote that key. Students were never notified of an accept or reject. Now server-backed via `seenAt`. |
| **Accept/Reject was a `console.log`** | `useApplications` was entirely mock-backed. A company could accept an applicant and nothing reached the database or the student. |
| **Company navbar remounted every tab** | Each company page rendered its own `<CompanyNavbar />`. Every navigation unmounted and rebuilt it — search box cleared, applicant badge refetched, visible flicker. Fixed with a shared `CompanyLayout`. |
| **Applicant profile showed the student navbar** | `/user/profile/:id` always rendered `StudentNavbar`, so a company reviewing an applicant got student navigation and no way back. Now viewer-aware, with a Back button. |
| **Suspension was cosmetic for signed-in users** | `protect` never re-read the DB, so a suspended user kept full access until their token expired — up to a day. Now `enforceStatus` on mutations plus a page-load session check. |
| **Deleting a company erased the student's application** | `applications.internshipId` cascaded. A student who had already been *accepted* lost the record entirely, with no notification. Now `ON DELETE SET NULL` plus a snapshot written before the delete. |
| **Suspension had no reason or end date** | Nothing to show the suspended person and nothing for the next admin to review. Reason is now required server-side; duration is optional and self-lifting. |
| **Suspended users could re-register** | Blocked, with an honest message instead of "email already exists". |
| **`findStudentDirectory` selected non-existent columns** | Caught before shipping: `university` and `location` are not on `StudentProfile` — Prisma would have thrown at runtime. |

## Session J.2 — 500 on the audit logs page

| Bug | Why it mattered |
|---|---|
| **`GET /api/admin/audit-logs` returned 500 with no filters set** | `new URLSearchParams({ role: undefined })` does **not** skip the key — it stringifies it to the literal text `"undefined"`. The request went out as `?action=undefined&role=undefined&from=undefined&to=undefined`, so Prisma tried to match `"undefined"` against the `UserRole` enum and threw. The page was unusable on load, before touching a single filter. Introduced in J.2 itself: `getUserActivity` had been written with the values filtered out, `getAuditLogs` had not. |
| **Any junk query param could 500 the admin API** | The deeper problem behind the above — query strings are untrusted input and were passed straight through to Prisma. A bad `role`, an unparseable date, or a non-numeric id all became server errors rather than being ignored. Now sanitised in the service layer: unknown roles, invalid dates, and bad ids are dropped, and `limit` is clamped to 1–2000. |

**Fixes:** a single `qs()` helper in `adminApi.js` used by every admin GET, so a
missing value can never become the string `"undefined"` again; plus `clean` /
`cleanRole` / `cleanDate` / `cleanId` guards in `admin.service.js` so the server
does not depend on the client behaving.

**Noted, not changed:** `hooks/useAdmin.js` is dead code — it duplicates
`api/adminApi.js` and is imported nowhere. It happens to filter its params
correctly, so it is not a live bug, but it is a second copy of the admin client
that will drift. Worth deleting.

## Session K — post-merge test findings

Fourteen issues found by manual testing after the three-branch merge. Four turned
out to have root causes different from the reported symptom.

| Bug | Root cause |
|---|---|
| **"Sync with profile" did nothing** | `getCvAsProfile` is exported at module level but was **missing from the `useCvStatus` hook's return object**. `UserProfile` destructures it from the hook, so it was `undefined` and the click threw a TypeError — silently, because nothing caught it. |
| **Company contact never saved** | `contact` and `telegramLink` were absent from the backend's `EDITABLE` whitelist in `company.service.js`. The form sent them correctly; the server discarded them on every request. |
| **A company viewing an applicant saw its own profile** | The student profile lived **entirely in localStorage** behind a TODO — there was no `GET /api/student/profile`. `/user/profile/:id` therefore read the *viewer's* cached profile and displayed it under the applicant's name. |
| **CV lost on refresh** | `CVBuilderContext` initialised from localStorage and **never read the CV back from the server**, despite the row existing in the database since Session B. Any clearing of local storage looked like the CV had been deleted. |
| `% Match` on applicant cards | Derived from a stored CV *quality* score with no relation to the listing. Presented as a match it implied AI matching the platform does not do. Removed. |
| Shortlist button | No state, no request — did nothing at all. Removed. |
| 404 sent signed-in users to the public homepage | The page always rendered the public `Header`, so a signed-in student was shown signed-out navigation and a "Go to dashboard" prompt. Now role-aware. |
| Suspended screen offered "Check again" | Invited retrying a state the user cannot change. Log out is now the only action; the login page reports the suspension reason and end date. |
| Company navbar search opened a second results page | Now routes to Explore with `?q=`, matching the student side. |
| No profile/logo picture anywhere | Added upload for both roles. Required widening `logoUrl`, `coverUrl`, `profileImage` from `VARCHAR(500)` to `TEXT` — base64 images far exceed 500 chars (migration `20260719000000_widen_image_columns`). |
| No route from a listing to the company | Company names are now clickable, and the company pane has Follow/Unfollow. The follow API and `FollowedCompany` table existed since Session D but nothing could call them, so the student's followed list could only ever be empty. |
| Admin could not open a listing | Added `GET /api/admin/internships/:id` returning the listing plus every applicant, so a reported listing can be read — and the number of students a delete will affect is visible where the decision is made. |
| Accept/Reject one click away in a list | Now gated behind an explicit "Reviewed CV" action. `reviewed` already existed in `ApplicationStatus` and was already accepted by the API, so no schema change was needed. |
| `data.description` in the admin listing panel | Caught by a schema check before shipping: the column is `jobDescription`. The section would have silently never rendered. |

## Session K.1 — follow-up test findings

| Bug | Root cause |
|---|---|
| **Could not replace an existing CV** | **Self-inflicted in Session K.** The `/cv` → `/cv/manage` redirect added to stop a refresh looking like the CV had vanished had no escape hatch, so "Upload a CV instead" bounced straight back to the dashboard. `?replace=1` now marks a deliberate visit. |
| **Uploaded CV synced only partially** | Key mismatch between the two CV sources. The PDF parser returns `personal.phoneNumber` and education as `{ institution, degree }`; `getCvAsProfile` read neither. Phone was dropped entirely despite `StudentProfile` having a `phone` column, and the degree was discarded leaving only the institution. Both key sets are now read, education renders as "Degree — School", and `phone` round-trips to the server with a field in the edit form. |
| **No route from a listing to the company** | The company name was plain text on the full detail page and in company search, so a student could not open the company's profile — or follow them — from the listing they were reading. Added a "View company profile" action that resolves per viewer role, so nobody is thrown out of their own shell. |

## Session K.2 — rate limiter scoping

| Bug | Root cause |
|---|---|
| **CV disappears after logout/login — but an admin can still see it** | The AI rate limiter (30/hour) was mounted on the **entire `/api/cv` router**, so `GET /api/cv/mine` — a plain database read with no AI involved — consumed the same budget as Gemini calls. After a testing session the budget was exhausted, the CV load returned 429, and both the hydration effect and the status check swallowed it silently. The row was in the database the whole time, which is exactly why the admin panel could still display it. |
| **`POST /api/cv/parse-upload` 429** | Same limiter, same exhausted budget. The two reports were one bug seen from two directions. |
| **Duplicate footers on an applicant's profile** | Self-inflicted in Session J: `UserProfile`'s navbar was made viewer-aware but the **footer was not**, so a company opening `/company/applicant/:id/profile` got the student footer stacked above the company shell's own. |

**Fixes.** The limiter now has a `skip` predicate so only `POST` to `/score`,
`/parse-upload` and `/generate-photo` are counted; CV persistence is untouched.
The cap was also raised 30 → 60, since one genuine CV review costs several calls
(parse, score, retry). The footer is now guarded by the same `viewerIsStudent`
check as the navbar.

Both failure paths now log the HTTP status instead of returning silently — a
failed load is not the same thing as "no CV saved", and treating them alike is
what disguised this bug in the first place.

**Verified by execution:** with a budget of 3, a 4th AI POST returns 429 while
`GET /mine`, `POST /` and `DELETE /mine` all still return 200, and the other two
AI endpoints remain limited. 6/6 assertions pass.

## Session K.3 — CV sync prompt

| Bug | Root cause |
|---|---|
| **"Sync now" on the home page copied nothing** | The handler called `markCvSynced()` and nothing else — it flipped the flag, hid the prompt, and announced "CV synced to your profile" while transferring **no data at all**. The real merge existed only on the profile page. Same family as the earlier `getCvAsProfile` bug, in the other location. |
| **Prompt reappears after logging out and back in** | `syncedToProfile` lives in the `if-cv-status` localStorage key, which `wipeLocalAccountData` clears on logout. A profile that had already been synced was offered the sync again on the next login. |

**Fixes.** The home button now performs the real merge: CV fields fill *empty*
profile fields, existing profile data is never overwritten, and the result is
persisted through `PUT /api/student/profile`.

Both prompts now also check the **server** profile, not just the local flag — if
the profile already carries the fields a sync would write (`fullName` plus
`education` or `skills`), there is nothing to offer and the prompt stays hidden.
That makes the dismissal durable across logout and across devices, which a
localStorage flag never could.

The two prompts share `syncedToProfile`, so syncing in either place has always
hidden both — that part was already correct.
