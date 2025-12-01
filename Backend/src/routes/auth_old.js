import express from "express";import express from "express";import express from "express";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";import bcrypt from "bcryptjs";import jwt from "jsonwebtoken";

import User from "../models/User.js";

import OTP from "../models/OTP.js";import jwt from "jsonwebtoken";import { body, validationResult } from "express-validator";

import { generateOTP, sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";

import { auth } from "../middleware/auth.js";import User from "../models/User.js";import User from "../models/User.js";



const router = express.Router();import OTP from "../models/OTP.js";import { auth } from "../middleware/auth.js";



// Step 1: Signup - Send OTPimport { generateOTP, sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";

router.post("/signup", async (req, res) => {

  try {import { auth } from "../middleware/auth.js";const router = express.Router();

    const { name, email, password } = req.body;



    // Validation

    if (!name || !email || !password) {const router = express.Router();// Register new user

      return res.status(400).json({ error: "All fields are required" });

    }router.post(



    if (password.length < 6) {// Step 1: Signup - Send OTP  "/register",

      return res.status(400).json({ error: "Password must be at least 6 characters" });

    }router.post("/signup", async (req, res) => {  [



    // Check if user already exists  try {    body("name").trim().notEmpty().withMessage("Name is required"),

    const existingUser = await User.findOne({ email });

    if (existingUser) {    const { name, email, password } = req.body;    body("email").isEmail().withMessage("Valid email is required"),

      if (existingUser.isVerified) {

        return res.status(400).json({ error: "Email already registered. Please login." });    body("password")

      } else {

        return res.status(400).json({     // Validation      .isLength({ min: 6 })

          error: "Email already registered but not verified. Please verify your email.",

          needsVerification: true     if (!name || !email || !password) {      .withMessage("Password must be at least 6 characters"),

        });

      }      return res.status(400).json({ error: "All fields are required" });  ],

    }

    }  async (req, res) => {

    // Generate OTP

    const otp = generateOTP();    const errors = validationResult(req);



    // Save OTP to database    if (password.length < 6) {    if (!errors.isEmpty()) {

    await OTP.create({ email, otp });

      return res.status(400).json({ error: "Password must be at least 6 characters" });      return res.status(400).json({ error: errors.array()[0].msg });

    // Create user (unverified)

    const hashedPassword = await bcrypt.hash(password, 10);    }    }

    await User.create({

      name,

      email,

      password: hashedPassword,    // Check if user already exists    try {

      isVerified: false,

    });    const existingUser = await User.findOne({ email });      const { name, email, password } = req.body;



    // Send OTP email    if (existingUser) {

    const emailResult = await sendOTPEmail(email, otp, name);

          if (existingUser.isVerified) {      // Check if user already exists

    if (!emailResult.success) {

      return res.status(500).json({ error: "Failed to send verification email. Please try again." });        return res.status(400).json({ error: "Email already registered. Please login." });      const existingUser = await User.findOne({ email });

    }

      } else {      if (existingUser) {

    res.status(201).json({

      message: "Signup successful! Please check your email for OTP verification.",        // User exists but not verified - allow resend OTP        return res.status(409).json({ error: "Email already registered" });

      email,

    });        return res.status(400).json({       }

  } catch (error) {

    console.error("Signup error:", error);          error: "Email already registered but not verified. Please verify your email.",

    res.status(500).json({ error: "Server error during signup" });

  }          needsVerification: true       // Create new user

});

        });      const user = await User.create({ name, email, password });

// Step 2: Verify OTP

router.post("/verify-otp", async (req, res) => {      }

  try {

    const { email, otp } = req.body;    }      // Generate JWT token



    if (!email || !otp) {      const token = jwt.sign(

      return res.status(400).json({ error: "Email and OTP are required" });

    }    // Generate OTP        { userId: user._id },



    const otpRecord = await OTP.findOne({ email, verified: false }).sort({ createdAt: -1 });    const otp = generateOTP();        process.env.JWT_SECRET || "your-secret-key",



    if (!otpRecord) {        { expiresIn: "7d" }

      return res.status(400).json({ error: "OTP expired or not found. Please request a new one." });

    }    // Save OTP to database      );



    const otpAge = Date.now() - otpRecord.createdAt.getTime();    await OTP.create({ email, otp });

    if (otpAge > 10 * 60 * 1000) {

      return res.status(400).json({ error: "OTP has expired. Please request a new one." });      res.status(201).json({

    }

    // Create user (unverified)        token,

    if (otpRecord.attempts >= 5) {

      return res.status(429).json({ error: "Too many failed attempts. Please request a new OTP." });    const hashedPassword = await bcrypt.hash(password, 10);        user: {

    }

    await User.create({          id: user._id,

    if (otpRecord.otp !== otp) {

      otpRecord.attempts += 1;      name,          name: user.name,

      await otpRecord.save();

      return res.status(400).json({       email,          email: user.email,

        error: "Invalid OTP. Please try again.",

        attemptsLeft: 5 - otpRecord.attempts       password: hashedPassword,        },

      });

    }      isVerified: false,      });



    otpRecord.verified = true;    });    } catch (err) {

    await otpRecord.save();

      console.error("Registration error:", err);

    const user = await User.findOne({ email });

    if (!user) {    // Send OTP email      res.status(500).json({ error: "Registration failed. Please try again." });

      return res.status(404).json({ error: "User not found" });

    }    const emailResult = await sendOTPEmail(email, otp, name);    }



    user.isVerified = true;      }

    user.verifiedAt = new Date();

    await user.save();    if (!emailResult.success) {);



    await sendWelcomeEmail(email, user.name);      return res.status(500).json({ error: "Failed to send verification email. Please try again." });



    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", {    }// Login user

      expiresIn: "7d",

    });router.post(



    res.json({    res.status(201).json({  "/login",

      message: "Email verified successfully! Welcome aboard!",

      token,      message: "Signup successful! Please check your email for OTP verification.",  [

      user: {

        id: user._id,      email,    body("email").isEmail().withMessage("Valid email is required"),

        name: user.name,

        email: user.email,    });    body("password").notEmpty().withMessage("Password is required"),

        isVerified: user.isVerified,

      },  } catch (error) {  ],

    });

  } catch (error) {    console.error("Signup error:", error);  async (req, res) => {

    console.error("OTP verification error:", error);

    res.status(500).json({ error: "Server error during verification" });    res.status(500).json({ error: "Server error during signup" });    const errors = validationResult(req);

  }

});  }    if (!errors.isEmpty()) {



// Resend OTP});      return res.status(400).json({ error: errors.array()[0].msg });

router.post("/resend-otp", async (req, res) => {

  try {    }

    const { email } = req.body;

// Step 2: Verify OTP

    if (!email) {

      return res.status(400).json({ error: "Email is required" });router.post("/verify-otp", async (req, res) => {    try {

    }

  try {      const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {    const { email, otp } = req.body;

      return res.status(404).json({ error: "User not found. Please signup first." });

    }      // Find user by email



    if (user.isVerified) {    if (!email || !otp) {      const user = await User.findOne({ email });

      return res.status(400).json({ error: "Email already verified. Please login." });

    }      return res.status(400).json({ error: "Email and OTP are required" });      if (!user) {



    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });    }        return res.status(401).json({ error: "Invalid email or password" });



    if (recentOTP) {      }

      const timeSinceLastOTP = Date.now() - recentOTP.createdAt.getTime();

      if (timeSinceLastOTP < 60 * 1000) {    // Find the latest OTP for this email

        const waitTime = Math.ceil((60 * 1000 - timeSinceLastOTP) / 1000);

        return res.status(429).json({     const otpRecord = await OTP.findOne({ email, verified: false })      // Check password

          error: `Please wait ${waitTime} seconds before requesting a new OTP.` 

        });      .sort({ createdAt: -1 });      const isMatch = await user.comparePassword(password);

      }

    }      if (!isMatch) {



    const otp = generateOTP();    if (!otpRecord) {        return res.status(401).json({ error: "Invalid email or password" });

    await OTP.deleteMany({ email });

    await OTP.create({ email, otp });      return res.status(400).json({ error: "OTP expired or not found. Please request a new one." });      }



    const emailResult = await sendOTPEmail(email, otp, user.name);    }

    

    if (!emailResult.success) {      // Generate JWT token

      return res.status(500).json({ error: "Failed to send verification email. Please try again." });

    }    // Check if OTP has expired (10 minutes)      const token = jwt.sign(



    res.json({    const otpAge = Date.now() - otpRecord.createdAt.getTime();        { userId: user._id },

      message: "New OTP sent successfully! Please check your email.",

    });    if (otpAge > 10 * 60 * 1000) {        process.env.JWT_SECRET || "your-secret-key",

  } catch (error) {

    console.error("Resend OTP error:", error);      return res.status(400).json({ error: "OTP has expired. Please request a new one." });        { expiresIn: "7d" }

    res.status(500).json({ error: "Server error while resending OTP" });

  }    }      );

});



// Login

router.post("/login", async (req, res) => {    // Check attempts      res.json({

  try {

    const { email, password } = req.body;    if (otpRecord.attempts >= 5) {        token,



    if (!email || !password) {      return res.status(429).json({ error: "Too many failed attempts. Please request a new OTP." });        user: {

      return res.status(400).json({ error: "Email and password are required" });

    }    }          id: user._id,



    const user = await User.findOne({ email });          name: user.name,

    if (!user) {

      return res.status(401).json({ error: "Invalid email or password" });    // Verify OTP          email: user.email,

    }

    if (otpRecord.otp !== otp) {        },

    if (!user.isVerified) {

      return res.status(403).json({       otpRecord.attempts += 1;      });

        error: "Email not verified. Please verify your email first.",

        needsVerification: true       await otpRecord.save();    } catch (err) {

      });

    }      return res.status(400).json({       console.error("Login error:", err);



    const isPasswordValid = await user.comparePassword(password);        error: "Invalid OTP. Please try again.",      res.status(500).json({ error: "Login failed. Please try again." });

    if (!isPasswordValid) {

      return res.status(401).json({ error: "Invalid email or password" });        attemptsLeft: 5 - otpRecord.attempts     }

    }

      });  }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", {

      expiresIn: "7d",    });

    });



    res.json({

      message: "Login successful",    // Mark OTP as verified// Get current user

      token,

      user: {    otpRecord.verified = true;router.get("/me", auth, async (req, res) => {

        id: user._id,

        name: user.name,    await otpRecord.save();  res.json({

        email: user.email,

        isVerified: user.isVerified,    user: {

      },

    });    // Update user as verified      id: req.user._id,

  } catch (error) {

    console.error("Login error:", error);    const user = await User.findOne({ email });      name: req.user.name,

    res.status(500).json({ error: "Server error during login" });

  }    if (!user) {      email: req.user.email,

});

      return res.status(404).json({ error: "User not found" });    },

// Get current user

router.get("/me", auth, async (req, res) => {    }  });

  try {

    const user = await User.findById(req.user._id).select("-password");});

    res.json({ user });

  } catch (error) {    user.isVerified = true;

    console.error("Get user error:", error);

    res.status(500).json({ error: "Server error" });    user.verifiedAt = new Date();// Logout (client-side handles token removal)

  }

});    await user.save();router.post("/logout", auth, (req, res) => {



export default router;  res.json({ message: "Logged out successfully" });


    // Send welcome email});

    await sendWelcomeEmail(email, user.name);

export default router;

    // Generate JWT token
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

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found. Please signup first." });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified. Please login." });
    }

    // Check rate limiting - allow resend only after 1 minute
    const recentOTP = await OTP.findOne({ email })
      .sort({ createdAt: -1 });

    if (recentOTP) {
      const timeSinceLastOTP = Date.now() - recentOTP.createdAt.getTime();
      if (timeSinceLastOTP < 60 * 1000) {
        const waitTime = Math.ceil((60 * 1000 - timeSinceLastOTP) / 1000);
        return res.status(429).json({ 
          error: `Please wait ${waitTime} seconds before requesting a new OTP.` 
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();

    // Delete old OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, otp });

    // Send OTP email
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

// Login
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

    // Check if email is verified
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

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
