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

const updateUserSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  email: z.string().email().optional(),
  password: z.string()
    .min(8)
    .max(16)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .optional(),
  address: z.string().max(400).optional(),
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
// export const createStore = async (req, res, next) => {
//   try {
//     const data = validateInput(createStoreSchema, req.body);

//     let owner = await prisma.user.findUnique({ where: { email: data.ownerEmail } });

//     if (owner) {
//       if (owner.role === "USER") {
//         owner = await prisma.user.update({
//           where: { email: data.ownerEmail },
//           data: { role: "STORE_OWNER" },
//         });
//       }
//     } else {
//       if (!data.ownerPassword || !data.ownerName) {
//         res.status(400);
//         throw new Error("Owner name & password required when creating new owner");
//       }

//       const hashedPassword = await bcrypt.hash(data.ownerPassword, 10);

//       owner = await prisma.user.create({
//         data: {
//           name: data.ownerName,
//           email: data.ownerEmail,
//           password: hashedPassword,
//           role: "STORE_OWNER",
//         },
//       });
//     }

//     const store = await prisma.store.create({
//       data: {
//         name: data.storeName,
//         email: data.storeEmail,
//         address: data.storeAddress,
//         ownerId: owner.id,
//       },
//     });

//     res.status(201).json({
//       message: "✅ Store created successfully",
//       store,
//       owner: { id: owner.id, name: owner.name, email: owner.email, role: owner.role },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// ================== Promote User to Store Owner ==================
export const createStore = async (req, res, next) => {
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
    
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Define filter criteria
    const filterCriteria = {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      email: email ? { contains: email, mode: "insensitive" } : undefined,
      address: address ? { contains: address, mode: "insensitive" } : undefined,
    };

    // Get total count for pagination
    const totalStores = await prisma.store.count({
      where: filterCriteria
    });

    const stores = await prisma.store.findMany({
      where: filterCriteria,
      skip: skip,
      take: limit,
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
        ratings: true,
      },
    });

    // console.log(stores[0].ratings.reduce((a, r) => a + r.rating, 0) / stores[0].ratings.length);

    const storesWithRatings = stores.map(store => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating:
        store.ratings.length > 0
          ? Math.round((store.ratings.reduce((a, r) => a + r.rating, 0) / store.ratings.length) * 10) / 10
          : null,
      owner: store.owner,
    }));

    // Send response with pagination metadata
    res.json({
      stores: storesWithRatings,
      pagination: {
        total: totalStores,
        page: page,
        limit: limit,
        pages: Math.ceil(totalStores / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// ================== Users List (with filters) ==================
export const getUsersList = async (req, res, next) => {
  try {
    const { name, email, address, role } = req.query;
    
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Define filter criteria
    const filterCriteria = {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      email: email ? { contains: email, mode: "insensitive" } : undefined,
      address: address ? { contains: address, mode: "insensitive" } : undefined,
      role: role ? role.toUpperCase() : undefined,
    };

    // Get total count for pagination
    const totalUsers = await prisma.user.count({
      where: filterCriteria
    });

    const users = await prisma.user.findMany({
      where: filterCriteria,
      skip: skip,
      take: limit,
      include: {
        stores: {
          include: {
            ratings: true,
          },
        },
        ratings: true,
      },
    });

    // Add averageRating to each store
    const usersWithStoreRatings = users.map(user => ({
      ...user,
      stores: user.stores.map(store => ({
        ...store,
        averageRating:
          store.ratings.length > 0
            ? Math.round((store.ratings.reduce((a, r) => a + r.rating, 0) / store.ratings.length) * 10) / 10
            : null,
      })),
    }));

    // Send response with pagination metadata
    res.json({
      users: usersWithStoreRatings,
      pagination: {
        total: totalUsers,
        page: page,
        limit: limit,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// ================== Delete User ==================
// If user is normal: delete user → ratings auto-delete (cascade).
// If user is store owner: don’t delete directly. Instead downgrade to USER.

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) throw new Error("User not found");

    if (user.role === "STORE_OWNER") {
      // Check if store owner has any active stores
      const storeCount = await prisma.store.count({
        where: { ownerId: user.id }
      });
      
      if (storeCount > 0) {
        res.status(400);
        throw new Error(`Cannot delete store owner who has ${storeCount} active store(s). Delete stores first.`);
      }
      
      // Only delete if no stores exist
      await prisma.user.delete({ where: { id: user.id } });
      return res.json({ message: "Store owner deleted (no active stores)" });
    }

    // if normal user, delete (ratings cascade automatically)
    await prisma.user.delete({ where: { id: user.id } });
    res.json({ message: "User and their ratings deleted" });

  } catch (err) {
    next(err);
  }
};

// ================== Update user ==================
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const data = validateInput(updateUserSchema, req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ 
      where: { id: parseInt(userId) } 
    });
    
    if (!existingUser) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check if email is being updated and if it's already taken by another user
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ 
        where: { email: data.email } 
      });
      if (emailExists) {
        res.status(400);
        throw new Error("Email already exists");
      }
    }

    // Prepare update data
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.address !== undefined) updateData.address = data.address;
    
    // Hash password if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ 
      message: "User updated successfully",
      user: updatedUser 
    });
  } catch (err) {
    next(err);
  }
};


// ================== Update store ==================
export const updateStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { name, email, address } = req.body;

    const store = await prisma.store.update({
      where: { id: parseInt(storeId) },
      data: { name, email, address }
    });

    res.json(store);
  } catch (err) {
    next(err);
  }
};

// ================== Delete Store ==================
// Ratings cascade auto-delete.
// Store owner's role reset to USER.

export const deleteStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const store = await prisma.store.findUnique({ where: { id: parseInt(storeId) } });
    if (!store) throw new Error("Store not found");

    if (store.ownerId) {
      await prisma.user.update({
        where: { id: store.ownerId },
        data: { role: "USER" }
      });
    }

    await prisma.store.delete({ where: { id: store.id } });
    res.json({ message: "Store deleted and owner role reset to USER" });

  } catch (err) {
    next(err);
  }
};
