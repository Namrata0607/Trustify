import jwt from "jsonwebtoken";

export const generateToken = (payload, secret, options = { expiresIn: "1h" }) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
