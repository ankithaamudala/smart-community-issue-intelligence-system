import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, location } = req.body;

  if (!name || !email || !password || !location) {
    throw new AppError("Name, email, password, and location are required.", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already in use.", 409);
  }

  const user = await User.create({ name, email, password, location });
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location
    }
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required.", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("No user found with that email address.", 404);
  }

  const resetToken = user.generatePasswordReset();
  await user.save({ validateBeforeSave: false });

  // In a real application, you would send this email via a service like SendGrid or Nodemailer
  // For now, we'll return the token (not recommended for production)
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  res.json({
    success: true,
    message: "Password reset link sent to email. (For development: check console or use the token below)",
    resetToken, // Remove this in production - only for development
    resetUrl
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, passwordConfirm } = req.body;

  if (!token || !password || !passwordConfirm) {
    throw new AppError("Token, password, and password confirmation are required.", 400);
  }

  if (password !== passwordConfirm) {
    throw new AppError("Passwords do not match.", 400);
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new AppError("Token is invalid or has expired.", 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const jwtToken = signToken(user._id);

  res.json({
    success: true,
    message: "Password has been reset successfully.",
    token: jwtToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location
    }
  });
});

