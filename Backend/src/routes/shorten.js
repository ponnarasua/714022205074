import express from "express";
import { nanoid } from "nanoid";
import ShortUrl from "../models/ShortUrl.js";

const router = express.Router();

// Create new short URL
router.post("/", async (req, res) => {
  const { originalUrl, validity , customId } = req.body;

  if (!originalUrl) return res.status(400).json({ error: "URL is required" });
  if (!validity || isNaN(validity) || validity <= 0)
    validity = 30;
  try {
    const code = customId || nanoid(8);
    const expiresAt = new Date(Date.now() + validity * 1000);

    const short = await ShortUrl.create({ code, originalUrl, expiresAt });

    res.json({
      shortUrl: `${process.env.BASE_URL}/${code}`,
      expiresAt
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
