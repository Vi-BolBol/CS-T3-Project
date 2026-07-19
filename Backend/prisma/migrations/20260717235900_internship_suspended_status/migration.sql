-- Adds the "suspended" state to internships.
--
-- Kept in its own migration on purpose: Postgres will not allow a new enum value
-- to be ADDED and USED inside the same transaction. Separating it guarantees the
-- value is committed before any later migration or seed references it.
ALTER TYPE "InternshipStatus" ADD VALUE IF NOT EXISTS 'suspended';
