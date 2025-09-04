import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  shortUrl: { type: mongoose.Schema.Types.ObjectId, ref: "ShortUrl" },
  userAgent: String,
  referrer: String,
  ip: String,
}, { timestamps: true });

export default mongoose.model("Click", clickSchema);
