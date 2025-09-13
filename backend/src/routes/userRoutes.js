import { Router } from "express";
// import { getAllStores, searchStores } from "../controllers/userController.js";
import { authMiddleware, isUser } from "../middleware/authMiddleware.js";

const router = Router;

// View all stores with ratings
// router.get("/stores", authMiddleware, isUser, getAllStores);

// Search stores by name or address
// router.get("/stores/search", authMiddleware, isUser, searchStores);

export default router;
