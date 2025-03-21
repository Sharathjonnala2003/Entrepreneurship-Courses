import jwt from "jsonwebtoken";
import db from "../database.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const auth = (req, res, next) => {
  try {
    console.log("Auth middleware running");

    // Get token from cookie or header with better parsing
    let token = req.cookies.token;

    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      // Handle different Authorization header formats
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      } else {
        token = authHeader;
      }
      console.log("Using token from Authorization header");
    }

    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({ error: "Authentication required" });
    }

    console.log("Found token:", token.substring(0, 20) + "...");

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ error: "Invalid token" });
      }

      console.log("Token verified for user ID:", decoded.id);

      // Find the user
      db.get(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [decoded.id],
        (err, user) => {
          if (err) {
            console.error("Database error in auth middleware:", err.message);
            return res.status(500).json({ error: "Server error" });
          }

          if (!user) {
            console.log("User not found for token");
            return res.status(401).json({ error: "Authentication required" });
          }

          console.log("User found:", user);

          // Attach the user to the request
          req.user = user;
          next();
        }
      );
    });
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ error: "Authentication required" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role === "admin") {
    next();
  } else {
    console.log("Admin access denied for user:", req.user.id);
    res.status(403).json({ error: "Admin access required" });
  }
};
