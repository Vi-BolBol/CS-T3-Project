CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX IF NOT EXISTS "users_status_idx" ON "users"("status");
CREATE INDEX IF NOT EXISTS "cvs_studentId_updatedAt_idx" ON "cvs"("studentId", "updatedAt");
CREATE INDEX IF NOT EXISTS "internships_companyId_idx" ON "internships"("companyId");
CREATE INDEX IF NOT EXISTS "internships_status_createdAt_idx" ON "internships"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "applications_internshipId_idx" ON "applications"("internshipId");
CREATE INDEX IF NOT EXISTS "applications_status_idx" ON "applications"("status");
CREATE INDEX IF NOT EXISTS "audit_logs_userId_idx" ON "audit_logs"("userId");
CREATE INDEX IF NOT EXISTS "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");