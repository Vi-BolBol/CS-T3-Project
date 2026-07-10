# Internship Finder

A platform that connects students with companies offering internships. Students build a CV, browse and apply to listings, and track their applications. Companies post and manage internship listings and review applicants. This is a team final project for CADT (Cambodia Academy of Digital Technology).

> Note: `PROJECT_SPEC.md` in this repo describes the *original proposal* (MySQL + Sequelize). The team pivoted during development to **PostgreSQL + Prisma**, which is what's actually implemented and documented below. Treat this README as the source of truth for the current codebase; treat `PROJECT_SPEC.md` as historical context for *why* certain features exist.

---

## 1. Core Concepts

Three roles share one platform:

| Role | What they can do |
|---|---|
| **Student** | Register/login, build a CV (manual entry, PDF upload+parse, or AI scoring), browse/search internships, apply, track application status, save/favorite listings |
| **Company** | Register/login, manage a company profile, post internships through a 5-step wizard, view their posted listings on a dashboard, review applicants |
| **Admin** | Reserved role in the schema (`UserRole.admin`) — no admin-facing UI is built yet |

**Key design decisions to know before touching the code:**
- A `User` row is the account (email, password hash, role). It's deliberately separate from `StudentProfile` / `CompanyProfile`, which hold the role-specific details (name, bio, company industry, etc.) — a 1:1 relation via `userId`.
- **Registration currently only creates the `User` row, not the profile row.** This is a known gap — see "Known Issues" below. Every account created through the real sign-up form needs a profile created afterward (manually via Prisma Studio, or by using the seed script's accounts) before company-side internship posting will work.
- CV data lives client-side in `localStorage` via `CVBuilderContext` (not saved to the `cvs` table yet) — it survives page navigation and refreshes, but not switching devices/browsers. There's no backend save/load endpoint for CVs yet, only one-shot AI actions (`/api/cv/score`, `/api/cv/parse-upload`, `/api/cv/generate-photo`).
- Applicant/CV review on the company dashboard is currently **mocked** (`Frontend/src/data/mockApplicants.js`) — the `Application` Prisma model exists but has no controller/service/routes yet.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router v6, Tailwind CSS |
| Backend | Node.js + Express 5 |
| Database | PostgreSQL, via Prisma ORM (schema + migrations + seed) |
| Auth | JWT (`jsonwebtoken`), bcrypt password hashing |
| AI features | Google Gemini (`@google/generative-ai`) for CV scoring/parsing, Hugging Face Inference for AI headshot generation |
| PDF | `jspdf` (CV export), `pdf-parse` (CV upload parsing) |
| Dev proxy | Vite dev server proxies `/api/*` → `http://localhost:3000` (see `Frontend/vite.config.js`) — this is why frontend API calls use relative paths like `/api/auth/login` instead of a full URL |

---

## 3. Project Structure

```
Fullstack-Project/
├── Backend/
│   ├── src/server.js           # Express app entry point
│   ├── config/                 # DB, env, JWT config
│   ├── routes/                 # One file per domain: auth, internship, cv
│   ├── controllers/            # HTTP layer — parses req, calls services, shapes res
│   ├── services/                # Business logic & validation (the layer with the real rules)
│   ├── models/                 # Prisma query functions (thin DB access layer)
│   ├── middleware/              # verifyToken (JWT check), etc.
│   ├── utils/                   # jwt helpers, etc.
│   └── prisma/
│       ├── schema.prisma        # Source of truth for the DB shape
│       ├── migrations/          # Applied migration history
│       └── seed.js              # Populates realistic test data — see "Test Data" below
│
├── Frontend/
│   └── src/
│       ├── pages/                # Route-level components, grouped by area
│       │   ├── auth/             # Login, Signup
│       │   ├── company/          # Company dashboard, wizard, settings, profile
│       │   ├── user/             # Student dashboard, applications, profile
│       │   └── CV/               # CV Builder step pages
│       ├── components/           # Reusable building blocks, grouped by scope
│       │   ├── common/           # overlaps with components/company/ui — see Known Issues
│       │   ├── company/          # Company-only UI (wizard steps, dashboard tabs, profile blocks)
│       │   ├── cv/               # CV Builder inputs, templates, previews
│       │   ├── layout/           # Navbars, footers, hero
│       │   ├── shared/           # Cross-cutting: toasts, dialogs, dropdowns
│       │   └── ui/                # Card/job/company display components
│       ├── context/              # React context (CVBuilderContext = CV builder global state)
│       ├── hooks/                # Data-fetching hooks (useCompanyJobs, useApplications, useToast)
│       ├── api/                  # fetch() wrappers per domain (authApi, cvApi)
│       ├── utils/                # Pure helper functions (validators, PDF generation, mappers)
│       └── routes/App.route.jsx  # All route definitions live here
│
├── PROJECT_SPEC.md               # Original proposal reference (see stack note above)
├── FRONTEND_BACKEND_SETUP.md     # Notes from wiring the frontend to the real backend
└── GEN11-CrossDisciplinaryProject.md
```

**Backend layering, when adding or fixing code:**
```
routes/       -> defines endpoints + which middleware guards them
controllers/  -> reads req.body/req.params, calls a service, sends res.status(...).json(...)
services/     -> validation + business logic; returns { success, message, ...data }
models/       -> raw Prisma calls only, no business logic
```
A controller should never call Prisma directly, and a service should never touch `req`/`res` — keeping this separation is what makes each layer independently testable and easy for a teammate to find the right file.

---

## 4. Getting Started

### Prerequisites
- Node.js
- PostgreSQL running locally (or a connection string to a hosted instance)

### Backend
```bash
cd Backend
npm install                 # postinstall runs `prisma generate` automatically
# create Backend/.env — see Environment Variables below
npx prisma migrate dev      # applies migrations, syncs schema to your DB
npx prisma db seed          # optional but recommended — see Test Data below
npm run dev                 # starts on http://localhost:3000
```

### Frontend
```bash
cd Frontend
npm install
# create Frontend/.env — see Environment Variables below
npm run dev                 # starts on http://localhost:5173
```

### Environment Variables

**`Backend/.env`**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/internship_finder?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/internship_finder?schema=public"
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

# AI features (CV scoring, parsing) — get a free key at https://aistudio.google.com/apikey
GEMINI_API_KEY_1=
GEMINI_API_KEY_2=   # optional — used as fallback if key 1 is rate-limited
GEMINI_API_KEY_3=   # optional
```

**`Frontend/.env`**
```env
VITE_API_URL=http://localhost:3000
VITE_MOCK_AUTH=false   # true = fake login, no backend calls at all — only for pure UI testing
```

---

## 5. Test Data

Rather than manually creating one-off test accounts, use the seed script — it creates a full, consistent dataset (students, companies, an admin, **and their matching profile rows**, plus CVs, internships, applications, and saved listings) in one command:

```bash
cd Backend
npx prisma migrate reset   # wipes the DB and reseeds from scratch
# or, without wiping:
npx prisma db seed
```

All seeded accounts use the password `password123`:
- `student1@example.com` ... `student10@example.com`
- `company1@example.com` ... `company3@example.com`
- `admin1@example.com`

This is preferable to manual test accounts because it's reproducible (anyone can reset to the same known state) and it seeds *complete* data — including the `companyProfile`/`studentProfile` rows that manual registration currently skips (see Known Issues).

---

## 6. API Reference (current)

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | — | Creates a `User` only — no profile row yet |
| POST | `/api/auth/login` | — | Returns JWT (1 day expiry) |
| GET | `/api/internships` | — | Public browsing, filterable by status |
| GET | `/api/internships/:id` | — | Single listing detail |
| GET | `/api/internships/mine` | company | Requires a `CompanyProfile` to exist for the logged-in user |
| POST | `/api/internships` | company | Publish a new listing (5-step wizard submits here) |
| PUT | `/api/internships/:id` | company | Edit an existing listing |
| DELETE | `/api/internships/:id` | company | — |
| POST | `/api/cv/score` | — | Gemini-based CV scoring, returns structured suggestions |
| POST | `/api/cv/parse-upload` | — | Parses an uploaded PDF CV into structured fields |
| POST | `/api/cv/generate-photo` | — | AI headshot generation (Hugging Face) |

Auth is an `Authorization: Bearer <token>` header, checked by `middleware/auth.middleware.js`. A missing/invalid token returns `401`. A `400` on the internship endpoints means the request reached the service layer but failed a business rule (e.g. no `CompanyProfile` found, or wizard validation failed) — not an auth problem.

---

## 7. Known Issues

These are tracked so the team (and any AI assistant helping out) doesn't rediscover them from scratch:

1. **Registration doesn't create a profile row.** `registerService` only creates a `User`. Every route that needs a `CompanyProfile`/`StudentProfile` (like `/api/internships/mine` and posting a listing) will 400 for any manually-registered account. Fix: create the profile row in the same transaction as the user, in `Backend/services/auth.service.js`. Workaround until fixed: use seeded accounts, or manually insert the missing profile via `npx prisma studio`.
2. **Duplicate component libraries.** `components/common/` and `components/company/ui/` both define `Button`, `Card`, `Input` with different styling — pick one before adding more UI.
3. **`pages/CV` vs `pages/cv` casing mismatch** in an import inside `App.route.jsx`. Works today because Windows/macOS filesystems are case-insensitive; will break on Linux/CI. Fix before deploying.
4. **CVs aren't persisted to the database.** `localStorage` only — no `POST /api/cv` / `GET /api/cv/mine` endpoints exist yet despite the `Cv` model being in the schema.
5. **Applicant/CV review data is mocked** (`mockApplicants.js`) pending the `Application` model getting real controller/service/routes.
6. **Payment on the company internship wizard (Step 5) is a UI-only simulation** — card fields validate (Luhn check, expiry, CVC) but nothing is charged or persisted; there's no real payment processor integrated.

---

## 8. Team

Chhon Chhaychanvibol - Lov Kimtech - Rith Sereyrathanak - Hem Rothapanharith - Bol
