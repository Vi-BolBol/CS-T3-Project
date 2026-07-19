-- Widen image columns so an uploaded picture can actually be stored.
--
-- `logoUrl`, `coverUrl` and `profileImage` were VARCHAR(500), which is fine for
-- a URL but far too small for an uploaded image. There is no file-storage
-- service in this project, so images are held as base64 data URLs in the same
-- way the CV builder already stores its photo — and those run to tens of
-- thousands of characters. Postgres TEXT has no length limit and, unlike
-- VARCHAR(n), costs nothing extra to store.
ALTER TABLE "company_profiles" ALTER COLUMN "logoUrl" TYPE TEXT;
ALTER TABLE "company_profiles" ALTER COLUMN "coverUrl" TYPE TEXT;
ALTER TABLE "student_profiles" ALTER COLUMN "profileImage" TYPE TEXT;
