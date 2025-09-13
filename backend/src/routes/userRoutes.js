import { Router } from "express";
import { getAllStores, searchStores, submitRating, getMyRatings } from "../controllers/userController.js";
import { authMiddleware, isUser } from "../middleware/authMiddleware.js";

const router = Router();

// View all stores
router.get("/stores", authMiddleware, isUser, getAllStores);

// Search stores
router.get("/stores/search", authMiddleware, isUser, searchStores);

// Submit or update rating
router.post("/stores/rate", authMiddleware, isUser, submitRating);

// Get current user's ratings history
router.get("/my-ratings", authMiddleware, isUser, getMyRatings);

export default router;
