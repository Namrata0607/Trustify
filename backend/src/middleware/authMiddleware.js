import { verifyToken } from "../utils/jwtHelper.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Unauthorized: No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = decoded; // attach { id, role }
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Unauthorized: Invalid token"));
  }
};

// Role-based guards
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    res.status(403);
    return next(new Error("Forbidden: Admin access only"));
  }
  next();
};

export const isStoreOwner = (req, res, next) => {
  if (req.user.role !== "STORE_OWNER") {
    res.status(403);
    return next(new Error("Forbidden: Store Owner access only"));
  }
  next();
};

export const isUser = (req, res, next) => {
  if (req.user.role !== "USER") {
    res.status(403);
    return next(new Error("Forbidden: User access only"));
  }
  next();
};
