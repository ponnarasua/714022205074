import express from "express";
import { nanoid } from "nanoid";
import ShortUrl from "../models/ShortUrl.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Validate URL format
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// Validate custom ID (alphanumeric, hyphens, underscores only)
const isValidCustomId = (id) => {
  return /^[a-zA-Z0-9_-]+$/.test(id);
};

// Create new short URL (with optional authentication)
router.post("/", optionalAuth, async (req, res) => {
  let { originalUrl, validity, customId, isPermanent } = req.body;

  // Validate original URL
  if (!originalUrl || !originalUrl.trim()) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL format. Please include http:// or https://" });
  }

  // Check if permanent URLs are only for authenticated users
  if (isPermanent && !req.userId) {
    return res.status(401).json({ error: "Please login to create permanent URLs" });
  }

  // Validate and set default validity
  if (!validity || isNaN(validity) || validity <= 0) {
    validity = isPermanent ? 365 * 24 * 60 * 60 : 3600; // 1 year for permanent, 1 hour for temporary
  }

  // Validate custom ID if provided
  if (customId) {
    customId = customId.trim();
    if (!isValidCustomId(customId)) {
      return res.status(400).json({ error: "Custom ID can only contain letters, numbers, hyphens, and underscores" });
    }

    if (customId.length < 3 || customId.length > 30) {
      return res.status(400).json({ error: "Custom ID must be between 3 and 30 characters" });
    }

    // Check if custom ID already exists
    const existing = await ShortUrl.findOne({ code: customId });
    if (existing) {
      return res.status(409).json({ error: "Custom ID already in use. Please choose another." });
    }
  }

  try {
    const code = customId || nanoid(8);
    const expiresAt = new Date(Date.now() + validity * 1000);

    const shortUrlData = {
      code,
      originalUrl,
      expiresAt,
      isPermanent: isPermanent || false,
    };

    // Add user reference if authenticated
    if (req.userId) {
      shortUrlData.user = req.userId;
    }

    const short = await ShortUrl.create(shortUrlData);

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${code}`,
      expiresAt,
      code,
      isPermanent: short.isPermanent,
    });
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Get user's URL history (authenticated only)
router.get("/history", optionalAuth, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const urls = await ShortUrl.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const formattedUrls = urls.map((url) => ({
      id: url._id,
      code: url.code,
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL}/${url.code}`,
      clicks: url.clicks,
      isPermanent: url.isPermanent,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    }));

    res.json({ urls: formattedUrls });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Delete a URL (authenticated only)
router.delete("/:code", optionalAuth, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const url = await ShortUrl.findOne({ code: req.params.code, user: req.userId });
    
    if (!url) {
      return res.status(404).json({ error: "URL not found or you don't have permission to delete it" });
    }

    await ShortUrl.deleteOne({ _id: url._id });
    res.json({ message: "URL deleted successfully" });
  } catch (err) {
    console.error("Error deleting URL:", err);
    res.status(500).json({ error: "Failed to delete URL" });
  }
});

export default router;
