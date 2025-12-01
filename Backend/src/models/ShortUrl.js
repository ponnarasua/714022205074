import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },  // 🔹 Expiry timestamp
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who created the URL (optional for guest users)
  isPermanent: { type: Boolean, default: false }, // For logged-in users to save permanently
}, { timestamps: true });

export default mongoose.model("ShortUrl", shortUrlSchema);
