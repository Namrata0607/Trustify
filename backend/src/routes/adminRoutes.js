import { Router } from "express";
import {
  createUser,
  createStore,
  promoteUserToStoreOwner,
  getDashboardStats,
  getStoresList,
  getUsersList,
  deleteUser,
  updateStore,
  deleteStore,
} from "../controllers/adminController.js";

import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// All admin routes require admin token
router.use(authMiddleware, isAdmin);

// Create a new user (normal)
router.post("/add-users", createUser);

// Create a store (assign to store owner)
router.post("/add-stores", createStore);

// Promote existing user to store owner
router.post("/promote-user", promoteUserToStoreOwner);

// Dashboard stats → total users, stores, ratings
router.get("/dashboard", getDashboardStats);

// List stores with filters
router.get("/stores", getStoresList);

// List users with filters
router.get("/users", getUsersList);

// Delete user
router.delete("/users/:userId", authMiddleware, isAdmin, deleteUser);

// Update store details
router.put("/stores/:storeId", authMiddleware, isAdmin, updateStore);

// Delete store
router.delete("/stores/:storeId", authMiddleware, isAdmin, deleteStore);

export default router;
