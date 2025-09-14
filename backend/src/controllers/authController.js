import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { validateInput } from "../middleware/validateInput.js";
import { generateToken } from "../utils/jwtHelper.js";
import { z } from "zod";

// ================== Schemas ==================
const signupSchema = z.object({
  name: z
    .string()
    .min(10, "Name must be at least 10 characters")
    .max(60, "Name must not exceed 60 characters"),
  email: z
    .string()
    .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  address: z
    .string()
    .max(400, "Address must not exceed 400 characters")
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8).max(16),
});


// ================== Signup (Normal Users) ==================
export const signup = async (req, res, next) => {
  try {
    const data = validateInput(signupSchema, req.body);

    // Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with role = USER
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        address: data.address || null,
        role: "USER",
      },
    });

    res.status(201).json({
      message: "Signup successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// ================== Login (All Roles) ==================
export const login = async (req, res, next) => {
  try {
    const data = validateInput(loginSchema, req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Check password
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = generateToken(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address},
    });
  } catch (error) {
    next(error);
  }
};

// ================== Logout ==================
export const logout = async (req, res, next) => {
  try {
    // Since JWT is stateless, just tell frontend to clear token
    res.json({ message: "Logout successful (please clear token on client)" });
  } catch (error) {
    next(error);
  }
};

// ================== Update Password ==================
export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);

    if (!oldPassword || !newPassword) {
      res.status(400);
      throw new Error("Old and new passwords are required");
    }

    // Find logged-in user
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Old password is incorrect");
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
