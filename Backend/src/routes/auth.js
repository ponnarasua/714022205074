import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: "Email already registered. Please login." });
      } else {
        return res.status(400).json({ 
          error: "Email already registered but not verified. Please verify your email.",
          needsVerification: true 
        });
      }
    }

    const otp = generateOTP();
    await OTP.create({ email, otp });

    await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    const emailResult = await sendOTPEmail(email, otp, name);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: "Failed to send verification email. Please try again." });
    }

    res.status(201).json({
      message: "Signup successful! Please check your email for OTP verification.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const otpRecord = await OTP.findOne({ email, verified: false }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ error: "OTP expired or not found. Please request a new one." });
    }

    const otpAge = Date.now() - otpRecord.createdAt.getTime();
    if (otpAge > 10 * 60 * 1000) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(429).json({ error: "Too many failed attempts. Please request a new OTP." });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ 
        error: "Invalid OTP. Please try again.",
        attemptsLeft: 5 - otpRecord.attempts 
      });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    await sendWelcomeEmail(email, user.name);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    });

    res.json({
      message: "Email verified successfully! Welcome aboard!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Server error during verification" });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found. Please signup first." });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified. Please login." });
    }

    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (recentOTP) {
      const timeSinceLastOTP = Date.now() - recentOTP.createdAt.getTime();
      if (timeSinceLastOTP < 60 * 1000) {
        const waitTime = Math.ceil((60 * 1000 - timeSinceLastOTP) / 1000);
        return res.status(429).json({ 
          error: `Please wait ${waitTime} seconds before requesting a new OTP.` 
        });
      }
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    const emailResult = await sendOTPEmail(email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: "Failed to send verification email. Please try again." });
    }

    res.json({
      message: "New OTP sent successfully! Please check your email.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Server error while resending OTP" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        error: "Email not verified. Please verify your email first.",
        needsVerification: true 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Request OTP for account deletion
router.post("/delete-account/request-otp", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate and send OTP
    const otp = generateOTP();
    await OTP.create({ email: user.email, otp });

    const emailResult = await sendOTPEmail(user.email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: "Failed to send OTP email. Please try again." });
    }

    res.json({ 
      message: "OTP sent to your email for account deletion confirmation",
      email: user.email 
    });
  } catch (error) {
    console.error("Delete account OTP request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete account after OTP verification
router.post("/delete-account/verify", auth, async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ 
      email: user.email, 
      otp: otp.trim() 
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Check if OTP has expired (10 minutes)
    const otpAge = Date.now() - otpRecord.createdAt.getTime();
    if (otpAge > 10 * 60 * 1000) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      return res.status(400).json({ error: "Too many failed attempts. Please request a new OTP." });
    }

    // Increment attempts
    otpRecord.attempts += 1;
    await otpRecord.save();

    // Import ShortUrl model
    const ShortUrl = (await import("../models/ShortUrl.js")).default;

    // Delete all URLs created by this user
    await ShortUrl.deleteMany({ user: user._id });

    // Delete OTP records
    await OTP.deleteMany({ email: user.email });

    // Delete user account
    await User.findByIdAndDelete(user._id);

    res.json({ 
      message: "Account and all associated URLs deleted successfully" 
    });
  } catch (error) {
    console.error("Delete account verification error:", error);
    res.status(500).json({ error: "Server error during account deletion" });
  }
});

// Forgot Password - Request OTP
router.post("/forgot-password/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "Please verify your email first" });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Generate new OTP
    const otp = generateOTP();
    await OTP.create({ email, otp });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.name, "Password Reset");
    
    if (!emailResult.success) {
      return res.status(500).json({ error: "Failed to send OTP email. Please try again." });
    }

    res.json({ 
      message: "OTP sent to your email",
      email 
    });
  } catch (error) {
    console.error("Forgot password request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Forgot Password - Verify OTP and Reset Password
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      return res.status(400).json({ error: "Too many failed attempts. Please request a new OTP." });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
