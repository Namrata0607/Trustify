import { PrismaClient } from "@prisma/client";
import { validateInput } from "../middleware/validateInput.js";
import { z } from "zod";

const prisma = new PrismaClient();

// Zod schema for rating
const ratingSchema = z.object({
  storeId: z.coerce.number(),  // accepts "2" as 2
  rating: z.coerce.number().min(1).max(5),
});

// Get all stores with overall rating + user's rating
export const getAllStores = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalStores = await prisma.store.count();
    
    // Get stores with pagination
    const stores = await prisma.store.findMany({
      skip: skip,
      take: limit,
      include: {
        ratings: true, // include ratings for average calculation
      },
    });

    const formattedStores = stores.map((store) => {
      const overallRating =
        store.ratings.length > 0
          ? store.ratings.reduce((acc, r) => acc + r.rating, 0) / store.ratings.length
          : null;

      const userRating = store.ratings.find((r) => r.userId === userId)?.rating || null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating,
        userRating,
      };
    });

    // Send response with pagination metadata
    res.json({
      stores: formattedStores,
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

// Search stores by name or address
export const searchStores = async (req, res, next) => {
  try {
    const { q } = req.query; // e.g., /stores/search?q=Kolhapur
    const userId = req.user.id;
    
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Define search criteria
    const searchCriteria = {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ]
    };
    
    // Get total count for pagination
    const totalStores = await prisma.store.count({
      where: searchCriteria
    });

    const stores = await prisma.store.findMany({
      where: searchCriteria,
      skip: skip,
      take: limit,
      include: { ratings: true },
    });

    const formattedStores = stores.map((store) => {
      const overallRating =
        store.ratings.length > 0
          ? store.ratings.reduce((acc, r) => acc + r.rating, 0) / store.ratings.length
          : null;

      const userRating = store.ratings.find((r) => r.userId === userId)?.rating || null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating,
        userRating,
      };
    });

    // Send response with pagination metadata
    res.json({
      stores: formattedStores,
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

// Submit or update rating (upsert)
export const submitRating = async (req, res, next) => {
  try {
    const data = validateInput(ratingSchema, req.body);
    const userId = req.user.id;

    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId: data.storeId,
        },
      },
      update: {
        rating: data.rating,
      },
      create: {
        userId,
        storeId: data.storeId,
        rating: data.rating,
      },
    });

    res.status(201).json(rating);
  } catch (error) {
    next(error);
  }
};

// Get current user's ratings history
export const getMyRatings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalRatings = await prisma.rating.count({
      where: { userId }
    });

    const ratings = await prisma.rating.findMany({
      where: { userId },
      skip: skip,
      take: limit,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'  // Most recent ratings first
      }
    });

    const formatted = ratings.map((r) => ({
      storeId: r.store.id,
      storeName: r.store.name,
      storeAddress: r.store.address,
      rating: r.rating,
      createdAt: r.createdAt,
    }));

    // Send response with pagination metadata
    res.json({
      ratings: formatted,
      pagination: {
        total: totalRatings,
        page: page,
        limit: limit,
        pages: Math.ceil(totalRatings / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

//  user deletes own rating
export const deleteRating = async (req, res, next) => {
  try {
    const { storeId } = req.body;
    const userId = req.user.id;

    await prisma.rating.delete({
      where: {
        userId_storeId: { userId, storeId }
      }
    });

    res.json({ message: "Rating deleted successfully" });
  } catch (err) {
    next(err);
  }
};
