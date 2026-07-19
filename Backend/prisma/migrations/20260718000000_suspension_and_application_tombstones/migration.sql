-- Suspension metadata + application tombstones
--
-- Two changes that belong together:
--   1. A suspension needs a reason and an end date, so the suspended user can be
--      told why and for how long. `status` alone could not answer either.
--   2. An application must survive its internship being deleted. It used to
--      cascade away, which meant a student who had already been accepted lost
--      the record entirely when an admin removed the company.

-- (The InternshipStatus 'suspended' value is added in the preceding migration —
--  Postgres cannot add and use an enum value in the same transaction.)

-- 1. User suspension metadata
ALTER TABLE "users" ADD COLUMN "suspendedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "suspendedUntil" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "suspensionReason" TEXT;

-- 2. Per-listing suspension reason
ALTER TABLE "internships" ADD COLUMN "suspensionReason" TEXT;

-- 3. Application tombstone + notification tracking
ALTER TABLE "applications" ADD COLUMN "removedType" VARCHAR(20);
ALTER TABLE "applications" ADD COLUMN "removedReason" TEXT;
ALTER TABLE "applications" ADD COLUMN "removedAt" TIMESTAMP(3);
ALTER TABLE "applications" ADD COLUMN "internshipTitle" VARCHAR(255);
ALTER TABLE "applications" ADD COLUMN "companyName" VARCHAR(200);
ALTER TABLE "applications" ADD COLUMN "decidedAt" TIMESTAMP(3);
ALTER TABLE "applications" ADD COLUMN "seenAt" TIMESTAMP(3);

-- 4. internshipId becomes nullable and stops cascading.
--    SET NULL is what turns a delete into a tombstone instead of a vanishing row.
ALTER TABLE "applications" ALTER COLUMN "internshipId" DROP NOT NULL;
ALTER TABLE "applications" DROP CONSTRAINT "applications_internshipId_fkey";
ALTER TABLE "applications" ADD CONSTRAINT "applications_internshipId_fkey"
  FOREIGN KEY ("internshipId") REFERENCES "internships"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
