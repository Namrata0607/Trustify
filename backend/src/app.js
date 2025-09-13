import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// import storeOwnerRoutes from "./routes/storeOwnerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import ratingRoutes from "./routes/ratingRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/store-owner", storeOwnerRoutes);
// app.use("/api/ratings", ratingRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🚀 Trustify API is running!" });
});

// Error Handler
app.use(errorHandler);

export default app;
