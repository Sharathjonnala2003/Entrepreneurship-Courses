import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`Auth route accessed: ${req.method} ${req.path}`);
  console.log("Request body:", req.body);
  next();
});

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Registration attempt:", { name, email });

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    // Check if user already exists
    db.get(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, row) => {
        if (err) {
          console.error("Database error during registration:", err.message);
          return res.status(500).json({ error: "Server error" });
        }

        if (row) {
          return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const sql =
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.run(sql, [name, email, hashedPassword, "user"], function (err) {
          if (err) {
            console.error("Database error during user creation:", err.message);
            return res.status(500).json({ error: "Server error" });
          }

          const userId = this.lastID;

          // Create JWT token
          const token = jwt.sign({ id: userId }, JWT_SECRET, {
            expiresIn: "7d",
          });

          // Set cookie
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "none",
            secure: false,
            path: "/",
          });

          // Return user info
          res.status(201).json({
            id: userId,
            name,
            email,
            role: "user",
            token,
          });
        });
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt for:", email);

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    // Find the user
    db.get(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          console.error("Database error during login:", err.message);
          return res.status(500).json({ error: "Server error" });
        }

        if (!user) {
          console.log("User not found:", email);
          return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("Found user:", {
          id: user.id,
          email: user.email,
          role: user.role,
        });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          console.log("Password does not match for:", email);
          return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("Login successful for:", email, "with role:", user.role);

        // Create JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        // Set cookie with very permissive settings for debugging
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // set to false for local development without HTTPS
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "none", // use none for cross-site requests during development
          path: "/",
        });

        // Return user info
        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user
router.get("/me", (req, res) => {
  try {
    // Get token from cookie or header
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("No token found for /me request");
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("Token verified for user ID:", decoded.id);

    // Find user
    db.get(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id],
      (err, user) => {
        if (err) {
          console.error("Database error in /me endpoint:", err.message);
          return res.status(500).json({ error: "Server error" });
        }

        if (!user) {
          console.log("User not found for token ID:", decoded.id);
          return res.status(401).json({ error: "Not authenticated" });
        }

        console.log("Current user:", user);
        res.json(user);
      }
    );
  } catch (error) {
    console.error("Auth error in /me endpoint:", error.message);
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
});

export default router;
