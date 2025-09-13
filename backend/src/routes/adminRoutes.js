import { Router } from "express";
import { createUser, createStore, getDashboardStats, getStoresList, getUsersList } from "../controllers/adminController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Create a new user (normal/store owner)
router.post("/users", authMiddleware, isAdmin, createUser);

// Create a store (assign to store owner)
router.post("/stores", authMiddleware, isAdmin, createStore);

// Dashboard stats → total users, stores, ratings
router.get("/dashboard", authMiddleware, isAdmin, getDashboardStats);

// List stores (filter by name, email, address, role)
router.get("/stores", authMiddleware, isAdmin, getStoresList);

// List users (normal + store owners, with filters)
router.get("/users", authMiddleware, isAdmin, getUsersList);

export default router;
