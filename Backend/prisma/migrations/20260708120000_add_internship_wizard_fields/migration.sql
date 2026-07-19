-- AlterTable
ALTER TABLE "internships"
  ADD COLUMN "salaryMin" DECIMAL(10,2),
  ADD COLUMN "salaryMax" DECIMAL(10,2),
  ADD COLUMN "durationValue" INTEGER,
  ADD COLUMN "durationUnit" VARCHAR(20),
  ADD COLUMN "plan" VARCHAR(20);
