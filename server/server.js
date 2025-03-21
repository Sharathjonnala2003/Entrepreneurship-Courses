import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import db from "./database.js";
// Fix: Make sure we properly import cache middleware with proper ES import
import cacheMiddleware from "./middleware/cacheMiddleware.js";
// Import routes
import courseRoutes from "./routes/courses.js";
import authRoutes from "./routes/auth.js";
import enrollmentRoutes from "./routes/enrollments.js";
import reviewRoutes from "./routes/reviews.js";
import calendarEventRoutes from "./routes/calendarEvents.js";

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Set up __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Fix CORS configuration for handling credentials
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Improved request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const { method, url, body, headers } = req;

  console.log(`📥 ${method} ${url}`);

  if (method !== "GET" && body && Object.keys(body).length > 0) {
    console.log("Body:", body);
  }

  // Log auth header (partial) for debugging
  if (headers.authorization) {
    console.log("Auth:", headers.authorization.substring(0, 15) + "...");
  }

  // Capture response to log
  const original = res.json;
  res.json = function (data) {
    const responseTime = Date.now() - start;
    if (res.statusCode >= 400) {
      console.error(
        `Response error: ${method} ${url} [${res.statusCode}] - ${responseTime}ms`
      );
      console.error("Response error:", data);
    }
    return original.call(this, data);
  };

  next();
});

// Test database connection and ensure tables exist
db.get("SELECT 1", (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database");

    // Ensure the calendar_events table exists
    db.run(
      `
      CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (course_id) REFERENCES courses (id)
      )
    `,
      function (err) {
        if (err) {
          console.error(
            "Error ensuring calendar_events table exists:",
            err.message
          );
        } else {
          console.log("calendar_events table exists or was created");
        }
      }
    );
  }
});

// Fix: Wrap cache middleware in try/catch to prevent app crashes
try {
  // API routes with proper /api prefix
  app.use("/api/courses", cacheMiddleware(300), courseRoutes); // Cache for 5 minutes
  app.use("/api/auth", authRoutes); // No cache for auth routes
  app.use("/api/enrollments", enrollmentRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/calendar-events", calendarEventRoutes);
} catch (error) {
  console.error("Error setting up routes with cache middleware:", error);
}

// API documentation route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the EntrepreneurHub API",
    endpoints: {
      auth: "/api/auth",
      courses: "/api/courses",
      enrollments: "/api/enrollments",
      reviews: "/api/reviews",
      calendarEvents: "/api/calendar-events",
    },
  });
});

// Fix: Wrap status endpoint in try/catch to prevent crashes
app.get("/api/status", (req, res) => {
  try {
    res.json({
      status: "Server is running",
      time: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    console.error("Error in status endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve static files in production
app.get("/api/debug/auth", (req, res) => {
  const token =
    req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
  res.json({
    hasCookie: !!req.cookies.token,
    hasAuthHeader: !!req.headers.authorization,
    token: token ? `${token.substring(0, 10)}...` : null,
  });
});

app.get("/api/debug/db", (req, res) => {
  db.get("SELECT sqlite_version() as version", (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", message: err.message });
    }
    res.json({
      message: "Database connection successful",
      version: row.version,
      databasePath: db.filename,
    });
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all handler for React routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Improved error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    error: "Server error",
    message: err.message,
    // Add stack trace in development mode only
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Unhandled promise rejection handler to prevent crashes
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't crash the server on unhandled promises
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;
