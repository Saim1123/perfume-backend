import User from "../models/User.js";
import bcrypt from "bcryptjs";

import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { sendVerificationEmail } from "../nodemailer/mail.js";
import { sendWelcomeEmail } from "../nodemailer/welcome.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields are required.");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    console.log("hashing the password");

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("creating user");

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    console.log("user created");

    await sendVerificationEmail(user.email, verificationToken);
    console.log("otp send to the user");

    generateTokenAndSetCookie(res, user._id);
    console.log("token generated");

    res.status(201).json({
      success: true,
      message: "User created successfully. Please check your email to verify your account.",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.firstName, user.lastName);

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully", user: { ...user._doc, password: undefined } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", user: { ...user._doc, password: undefined } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
  } catch (error) {
    console.log("Forget Password: ", error.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
  } catch (error) {
    console.log("Reset Password: ", error.message);
  }
};

export const userDashboard = async (req, res) => {
  try {
  } catch (error) {
    console.log("Verify Otp: ", error.message);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: { ...user._doc } });
  } catch (error) {
    console.log("Check Auth Error: ", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
