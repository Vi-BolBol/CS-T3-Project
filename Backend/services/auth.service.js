import { createUserWithProfile, findUserByEmail } from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerService = async (payload = {}) => {
  const { email, password, role = "student", name } = payload;

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUserWithProfile({
    email,
    passwordHash: hashedPassword,
    role,
    name,
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    message: "Register successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginService = async (payload = {}) => {
  const { email, password } = payload;

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};