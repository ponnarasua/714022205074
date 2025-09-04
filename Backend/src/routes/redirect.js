import express from "express";
import ShortUrl from "../models/ShortUrl.js";
import Click from "../models/Click.js";

const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const short = await ShortUrl.findOne({ code: req.params.code });
    if (!short) return res.status(404).json({ error: "Not found" });

    if (short.expiresAt < new Date()) {
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
