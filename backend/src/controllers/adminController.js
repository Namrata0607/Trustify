import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { validateInput } from "../middleware/validateInput.js";
import { z } from "zod";

// ================== Validation Schemas ==================
const createUserSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .max(16)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  address: z.string().max(400).optional(),
  role: z.enum(["USER", "OWNER"]).optional()
});

const createStoreSchema = z.object({
  storeName: z.string().min(10),
  storeEmail: z.string().email(),
  storeAddress: z.string().max(400),
  ownerEmail: z.string().email(),
  ownerName: z.string().min(10).max(60).optional(),
  ownerPassword: z.string().min(8).max(16).optional(),
});

// ================== Add Normal User ==================
export const createUser = async (req, res, next) => {
  try {
    const data = validateInput(createUserSchema, req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      res.status(400);
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        address: data.address || null,
        role: "USER",
      },
    });

    res.status(201).json({ message: "✅ Normal user created successfully", user });
  } catch (error) {
    next(error);
  }
};

// ================== Add Store (with Owner) ==================
export const createStore = async (req, res, next) => {
  try {
    const data = validateInput(createStoreSchema, req.body);

    let owner = await prisma.user.findUnique({ where: { email: data.ownerEmail } });

    if (owner) {
      if (owner.role === "USER") {
        owner = await prisma.user.update({
          where: { email: data.ownerEmail },
          data: { role: "STORE_OWNER" },
        });
      }
    } else {
      if (!data.ownerPassword || !data.ownerName) {
        res.status(400);
        throw new Error("Owner name & password required when creating new owner");
      }

      const hashedPassword = await bcrypt.hash(data.ownerPassword, 10);

      owner = await prisma.user.create({
        data: {
          name: data.ownerName,
          email: data.ownerEmail,
          password: hashedPassword,
          role: "STORE_OWNER",
        },
      });
    }

    const store = await prisma.store.create({
      data: {
        name: data.storeName,
        email: data.storeEmail,
        address: data.storeAddress,
        ownerId: owner.id,
      },
    });

    res.status(201).json({
      message: "✅ Store created successfully",
      store,
      owner: { id: owner.id, name: owner.name, email: owner.email, role: owner.role },
    });
  } catch (error) {
    next(error);
  }
};

// ================== Promote User to Store Owner ==================
export const promoteUserToStoreOwner = async (req, res, next) => {
  try {
    const { userId, storeName, storeEmail, storeAddress } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.role !== "USER") {
      res.status(400);
      throw new Error("Only normal users can be promoted");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "STORE_OWNER" },
    });

    const store = await prisma.store.create({
      data: {
        name: storeName,
        email: storeEmail,
        address: storeAddress,
        ownerId: updatedUser.id,
      },
    });

    res.json({
      message: "✅ User promoted to store owner and store created",
      storeOwner: updatedUser,
      store,
    });
  } catch (error) {
    next(error);
  }
};

// ================== Dashboard Stats ==================
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({
      users: totalUsers,
      stores: totalStores,
      ratings: totalRatings,
    });
  } catch (error) {
    next(error);
  }
};

// ================== Stores List (with filters) ==================
export const getStoresList = async (req, res, next) => {
  try {
    const { name, email, address } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        name: name ? { contains: name, mode: "insensitive" } : undefined,
        email: email ? { contains: email, mode: "insensitive" } : undefined,
        address: address ? { contains: address, mode: "insensitive" } : undefined,
      },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
        ratings: true,
      },
    });

    const storesWithRatings = stores.map(store => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating:
        store.ratings.length > 0
          ? store.ratings.reduce((a, r) => a + r.value, 0) / store.ratings.length
          : null,
      owner: store.owner,
    }));

    res.json(storesWithRatings);
  } catch (error) {
    next(error);
  }
};

// ================== Users List (with filters) ==================
export const getUsersList = async (req, res, next) => {
  try {
    const { name, email, address, role } = req.query;

    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: name, mode: "insensitive" } : undefined,
        email: email ? { contains: email, mode: "insensitive" } : undefined,
        address: address ? { contains: address, mode: "insensitive" } : undefined,
        role: role ? role.toUpperCase() : undefined,
      },
      include: {
        stores: true,
        ratings: true,
      },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};
