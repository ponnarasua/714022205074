import express from "express";
import ShortUrl from "../models/ShortUrl.js";
import Click from "../models/Click.js";

const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const short = await ShortUrl.findOne({ code: req.params.code });
    if (!short) return res.status(404).json({ error: "Not found" });

    // Check if expired
    if (short.expiresAt < new Date()) {
      // Delete expired URL and its clicks immediately
      await Click.deleteMany({ shortUrl: short._id });
      await ShortUrl.deleteOne({ _id: short._id });
      console.log(`🧹 Deleted expired URL: ${req.params.code}`);
      return res.status(410).json({ error: "Link expired" });
    }

    short.clicks++;
    await short.save();

    await Click.create({
      shortUrl: short._id,
      userAgent: req.headers["user-agent"],
      referrer: req.get("Referrer") || "",
      ip: req.ip
    });

    res.redirect(short.originalUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
