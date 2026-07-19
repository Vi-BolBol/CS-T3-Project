-- CompanyProfile is 1:1 with User (same as StudentProfile), but userId was never
-- marked UNIQUE. Prisma's findUnique({ where: { userId } }) requires it, so any
-- company lookup by userId would fail at runtime.
-- Clean up any accidental duplicates first, keeping the earliest row.
DELETE FROM "company_profiles" a
USING "company_profiles" b
WHERE a."userId" = b."userId" AND a.id > b.id;

CREATE UNIQUE INDEX IF NOT EXISTS "company_profiles_userId_key"
  ON "company_profiles"("userId");

-- Fields needed by the company profile card (location, headcount) and cover banner.
ALTER TABLE "company_profiles" ADD COLUMN IF NOT EXISTS "coverUrl" VARCHAR(500);
ALTER TABLE "company_profiles" ADD COLUMN IF NOT EXISTS "location" VARCHAR(150);
ALTER TABLE "company_profiles" ADD COLUMN IF NOT EXISTS "employeeCount" INTEGER;
