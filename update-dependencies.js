/**
 * This utility script checks for potential module import/export issues
 * and ensures compatibility between ES Modules and CommonJS formats
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to check
const serverDir = path.join(__dirname, "server");
const middlewareDir = path.join(serverDir, "middleware");

// Ensure middleware directory exists
if (!fs.existsSync(middlewareDir)) {
  fs.mkdirSync(middlewareDir, { recursive: true });
  console.log(`Created directory: ${middlewareDir}`);
}

// Check if cacheMiddleware.js exists and has the correct export format
const cacheMiddlewarePath = path.join(middlewareDir, "cacheMiddleware.js");
if (!fs.existsSync(cacheMiddlewarePath)) {
  console.log(`Cache middleware file does not exist: ${cacheMiddlewarePath}`);
  console.log("Creating file with ES Module exports...");

  const cacheMiddlewareContent = `/**
 * Simple in-memory cache for API responses
 */
const cache = new Map();

/**
 * Middleware to cache API responses
 * @param {number} ttl - Time to live in seconds (defaults to 5 minutes)
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    // Return cached response if available and not expired
    if (cachedResponse && Date.now() < cachedResponse.expiry) {
      console.log(\`Cache hit for \${key}\`);
      return res.send(cachedResponse.data);
    }

    // Override send method to cache the response
    const originalSend = res.send;
    res.send = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          data: body,
          expiry: Date.now() + ttl * 1000,
        });
        console.log(\`Cached response for \${key}\`);
      }
      return originalSend.call(this, body);
    };

    next();
  };
};

// Utility to clear cache
cacheMiddleware.clearCache = () => {
  cache.clear();
  console.log("Cache cleared");
};

// Using ES Module export
export default cacheMiddleware;
`;

  fs.writeFileSync(cacheMiddlewarePath, cacheMiddlewareContent);
  console.log(`Created cache middleware file with ES Module exports`);
} else {
  // Check if the file uses CommonJS exports and fix if needed
  const content = fs.readFileSync(cacheMiddlewarePath, "utf8");
  if (content.includes("module.exports")) {
    console.log("Converting CommonJS export to ES Module export...");
    const updatedContent = content.replace(
      "module.exports = cacheMiddleware;",
      "export default cacheMiddleware;"
    );
    fs.writeFileSync(cacheMiddlewarePath, updatedContent);
    console.log("Updated cache middleware to use ES Module exports");
  } else {
    console.log("Cache middleware already uses ES Module exports");
  }
}

console.log("Dependency check complete!");
console.log("To run this fix: node update-dependencies.js");
