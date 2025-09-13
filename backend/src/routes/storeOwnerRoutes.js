import { Router } from "express";
import { getMyStoreRatings, getMyStoreAverage } from "../controllers/storeOwner.controller.js";
import { authMiddleware, isStoreOwner } from "../middleware/auth.middleware.js";

const router = Router();

// View list of users who rated their store
router.get("/my-store/ratings", authMiddleware, isStoreOwner, getMyStoreRatings);

// View average rating of their store
router.get("/my-store/average-rating", authMiddleware, isStoreOwner, getMyStoreAverage);

export default router;
