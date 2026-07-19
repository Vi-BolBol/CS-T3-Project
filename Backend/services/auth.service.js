import { createUser, findUserByEmail } from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logAction } from "../utils/audit.js";
import { liftSuspension, findUserStatusById } from "../models/auth.model.js";

const VALID_ROLES = ["student", "company", "admin"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerService = async (payload = {}) => {
  const { email, password, role = "student", fullName, companyName } = payload;

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  if (!EMAIL_RE.test(String(email).trim())) {
    return { success: false, message: "Enter a valid email address" };
  }

  if (String(password).length < 8) {
    return { success: false, message: "Password must be at least 8 characters" };
  }

  // Never let a client self-assign "admin" through the public register endpoint.
  if (!VALID_ROLES.includes(role) || role === "admin") {
    return { success: false, message: "Role must be either 'student' or 'company'" };
  }

  const existingUser = await findUserByEmail(String(email).trim().toLowerCase());
  if (existingUser) {
    // A suspended account must not be escapable by re-registering the same
    // address. Say so plainly rather than hiding behind "email already exists" —
    // the person needs to know the suspension is what is blocking them.
    if (existingUser.status === "suspended") {
      return {
        success: false,
        message: "This email belongs to a suspended account and cannot be re-registered.",
        suspended: true,
      };
    }
    return { success: false, message: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Creates the User AND its StudentProfile/CompanyProfile in one transaction.
  const user = await createUser({
    email: String(email).trim().toLowerCase(),
    passwordHash: hashedPassword,
    role,
    fullName,
    companyName,
  });


  await logAction({ userId: user.id, action: "USER_REGISTERED", entityType: "User", entityId: user.id });

  // Register now issues a session, exactly like login.
  //
  // It previously returned no token. The frontend did `if (res.token) setItem(...)`,
  // so on a machine that had logged in before, the NEW user object was written over
  // the OLD token — and every subsequent request authenticated as the *previous*
  // account. That's the "signing up drops me into someone else's account" bug.
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  return {
    success: true,
    message: "Register successful",
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

export const loginService = async (payload = {}) => {
  const { email, password } = payload;

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  const user = await findUserByEmail(String(email).trim().toLowerCase());
  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    await logAction({ userId: user.id, action: "LOGIN_FAILED", entityType: "User", entityId: user.id });
    return { success: false, message: "Invalid email or password" };
  }

  // A suspension must actually block access — otherwise the admin panel's
  // "suspend" button is decorative.
  if (user.status === "suspended") {
    // A timed suspension lifts itself. Doing it here (rather than on a cron)
    // keeps the whole feature inside the request cycle with no scheduler.
    if (user.suspendedUntil && new Date(user.suspendedUntil) <= new Date()) {
      await liftSuspension(user.id);
      await logAction({ userId: user.id, action: "USER_SUSPENSION_EXPIRED", entityType: "User", entityId: user.id });
      user.status = "active";
    } else {
      await logAction({ userId: user.id, action: "LOGIN_BLOCKED_SUSPENDED", entityType: "User", entityId: user.id });
      return {
        success: false,
        message: "This account has been suspended.",
        suspended: true,
        suspension: {
          reason: user.suspensionReason || null,
          until: user.suspendedUntil || null,
          since: user.suspendedAt || null,
        },
      };
    }
  }
  if (user.status === "inactive") {
    return { success: false, message: "This account is inactive. Contact an administrator." };
  }

  // CRITICAL: `role` must be in the token. Without it req.user.role is undefined,
  // so every roleGuard/authorize() check silently fails and RBAC is impossible.
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );


  await logAction({ userId: user.id, action: "USER_LOGIN", entityType: "User", entityId: user.id });

  return {
    success: true,
    message: "Login successful",
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
};


/*
  Session check. The frontend calls this on page load and before sensitive
  actions so a suspension or deletion takes effect without waiting for the JWT
  to expire (which could be a full day).

  This is the deliberate middle ground: we do NOT pay a DB read on every single
  request, but we also never leave a suspended user with a working session for
  more than one navigation.
*/
export const getSessionService = async (userId) => {
  const user = await findUserStatusById(userId);

  // The row is gone — the admin deleted this account while it was signed in.
  if (!user) {
    return { success: true, valid: false, reason: "deleted" };
  }

  if (user.status === "suspended") {
    if (user.suspendedUntil && new Date(user.suspendedUntil) <= new Date()) {
      await liftSuspension(user.id);
      return { success: true, valid: true, user: { ...user, status: "active" } };
    }
    return {
      success: true,
      valid: false,
      reason: "suspended",
      suspension: {
        reason: user.suspensionReason || null,
        until: user.suspendedUntil || null,
        since: user.suspendedAt || null,
      },
    };
  }

  if (user.status === "inactive") {
    return { success: true, valid: false, reason: "inactive" };
  }

  return { success: true, valid: true, user };
};
