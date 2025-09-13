import { Router } from "express";
import { signup, login, logout, updatePassword } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Normal User self signup
router.post("/signup", signup);

// Login (works for all roles: Admin, Store Owner, User)
router.post("/login", login);

// Logout (works for all roles)
router.post("/logout", authMiddleware, logout);

// Update password (after login) → Store Owner + User
router.put("/update-password", authMiddleware, updatePassword);

export default router;
