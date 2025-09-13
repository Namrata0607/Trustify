import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// View list of users who rated the store owned by the logged-in owner
export const getMyStoreRatings = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    // Fetch store with ratings and user info
    const store = await prisma.store.findFirst({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: { id: true, name: true, email: true }, // show user info
            },
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const ratings = store.ratings.map((r) => ({
      userId: r.user.id,
      userName: r.user.name,
      userEmail: r.user.email,
      rating: r.rating,
      createdAt: r.createdAt,
    }));

    res.json({
      storeId: store.id,
      storeName: store.name,
      ratings,
    });
  } catch (error) {
    next(error);
  }
};

// View average rating of the owner’s store
export const getMyStoreAverage = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    const store = await prisma.store.findFirst({
      where: { ownerId },
      include: { ratings: true },
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const avgRating =
      store.ratings.length > 0
        ? store.ratings.reduce((acc, r) => acc + r.rating, 0) / store.ratings.length
        : null;

    res.json({
      storeId: store.id,
      storeName: store.name,
      averageRating: avgRating,
      totalRatings: store.ratings.length,
    });
  } catch (error) {
    next(error);
  }
};
