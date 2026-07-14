import { createUser, findUserByEmail } from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logAction } from "../utils/audit.js";

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

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
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
    await logAction({ userId: user.id, action: "LOGIN_BLOCKED_SUSPENDED", entityType: "User", entityId: user.id });
    return { success: false, message: "This account has been suspended. Contact an administrator." };
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
