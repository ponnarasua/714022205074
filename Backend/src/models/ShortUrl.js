import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true }  // 🔹 Expiry timestamp
}, { timestamps: true });

export default mongoose.model("ShortUrl", shortUrlSchema);
