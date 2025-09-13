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

    const stores = await prisma.store.findMany({
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

    res.json(formattedStores);
  } catch (error) {
    next(error);
  }
};

// Search stores by name or address
export const searchStores = async (req, res, next) => {
  try {
    const { q } = req.query; // e.g., /stores/search?q=Kolhapur
    const userId = req.user.id;

    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
        ],
      },
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

    res.json(formattedStores);
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

    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    const formatted = ratings.map((r) => ({
      storeId: r.store.id,
      storeName: r.store.name,
      storeAddress: r.store.address,
      rating: r.rating,
      createdAt: r.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};