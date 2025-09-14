import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();


// Retry logic for database connection
async function connectDBWithRetry(retries = 5, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      console.log("✅ Database connected successfully!");
      return;
    } catch (error) {
      console.error(`❌ Database connection failed (Attempt ${attempt}/${retries}):`, error.message);
      if (attempt < retries) {
        console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error("❌ All retry attempts failed. Exiting.");
        process.exit(1);
      }
    }
  }
}

// Connect to database with retry
connectDBWithRetry();

export default prisma;
