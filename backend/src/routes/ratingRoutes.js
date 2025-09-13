import { Router } from "express";
import { upsertRating, getMyRatings } from "../controllers/rating.controller.js";
import { authMiddleware, isUser } from "../middleware/auth.middleware.js";

const router = Router();

// Submit or update rating for a store
router.post("/:storeId", authMiddleware, isUser, upsertRating);

// Get ratings submitted by the logged-in user
router.get("/my", authMiddleware, isUser, getMyRatings);

export default router;
