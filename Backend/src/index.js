import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import shortenRoutes from "./routes/shorten.js";
import redirectRoutes from "./routes/redirect.js";
dotenv.config();
const app = express();
app.use(cors({ orgin: "*" }));
app.use(express.json());

// Routes
app.use("/shorturls", shortenRoutes);
app.use("/", redirectRoutes);

const PORT = process.env.PORT || 4000;
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
