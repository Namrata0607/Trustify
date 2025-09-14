import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import storeOwnerRoutes from "./routes/storeOwnerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import ratingRoutes from "./routes/ratingRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://trustify-mocha.vercel.app", // production frontend
  "http://localhost:5173"              // local Vite dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/store-owner", storeOwnerRoutes);
// app.use("/api/ratings", ratingRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🚀 Trustify API is running!" });
});

// Error Handler
app.use(errorHandler);

export default app;
