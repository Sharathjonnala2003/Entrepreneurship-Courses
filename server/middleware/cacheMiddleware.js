/**
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
      console.log(`Cache hit for ${key}`);
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
        console.log(`Cached response for ${key}`);
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

// Fix: use ES Module export instead of CommonJS
export default cacheMiddleware;
