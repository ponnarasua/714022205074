import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import shortenRoutes from "./routes/shorten.js";
import redirectRoutes from "./routes/redirect.js";
import { startCleanupScheduler } from "./services/cleanupService.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN}));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/shorturls", shortenRoutes);
app.use("/", redirectRoutes);

const PORT = process.env.PORT || 4000;

// Connect to database and start cleanup scheduler
connectDB().then(() => {
  // Start the cleanup scheduler after database connection is established
  startCleanupScheduler();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
