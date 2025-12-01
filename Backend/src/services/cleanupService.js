import cron from "node-cron";
import ShortUrl from "../models/ShortUrl.js";
import Click from "../models/Click.js";

/**
 * Deletes expired non-permanent URLs from the database
 * Runs as a scheduled task
 */
export const cleanupExpiredUrls = async () => {
  try {
    const now = new Date();
    
    // Find all expired non-permanent URLs
    const expiredUrls = await ShortUrl.find({
      isPermanent: false,
      expiresAt: { $lt: now }
    });

    if (expiredUrls.length === 0) {
      console.log("🧹 Cleanup: No expired URLs found");
      return;
    }

    // Get IDs of expired URLs
    const expiredUrlIds = expiredUrls.map(url => url._id);

    // Delete associated clicks first
    const clicksDeleted = await Click.deleteMany({
      shortUrl: { $in: expiredUrlIds }
    });

    // Delete expired URLs
    const urlsDeleted = await ShortUrl.deleteMany({
      _id: { $in: expiredUrlIds }
    });

    console.log(`🧹 Cleanup: Deleted ${urlsDeleted.deletedCount} expired URLs and ${clicksDeleted.deletedCount} associated clicks`);
  } catch (error) {
    console.error("❌ Cleanup error:", error);
  }
};

/**
 * Starts the scheduled cleanup job
 * Runs every minute to clean up expired URLs
 */
export const startCleanupScheduler = () => {
  // Run cleanup every minute
  // Cron format: minute hour day month weekday
  cron.schedule("* * * * *", () => {
    console.log("🧹 Running scheduled cleanup of expired URLs...");
    cleanupExpiredUrls();
  });

  // Also run cleanup on startup
  console.log("🧹 Running initial cleanup of expired URLs...");
  cleanupExpiredUrls();

  console.log("✅ Cleanup scheduler started (runs every minute)");
};
