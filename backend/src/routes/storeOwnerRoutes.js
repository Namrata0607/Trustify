import { Router } from "express";
import { getMyStoreRatings, getMyStoreAverage } from "../controllers/storeOwnerController.js";
import { authMiddleware, isStoreOwner } from "../middleware/authMiddleware.js";

const router = Router();

// View list of users who rated their store
router.get("/my-store/ratings", authMiddleware, isStoreOwner, getMyStoreRatings);

// View average rating of their store
router.get("/my-store/average-rating", authMiddleware, isStoreOwner, getMyStoreAverage);

export default router;
