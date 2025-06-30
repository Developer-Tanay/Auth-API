const rateLimit = require("express-rate-limit");
const logger = require("../config/logger");

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: {
      success: false,
      message: message,
    },
    handler: (req, res) => {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      res.status(429).json({
        success: false,
        message: message,
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General rate limiter
const generalLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per window
  "Too many requests from this IP, please try again later"
);

// Strict rate limiter for auth endpoints (controlled by .env)
const authLimiter = createRateLimiter(
  parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // Use specific auth env var or 15 minutes
  parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 100, // Use specific auth env var or 100 attempts per window
  "Too many authentication attempts, please try again later"
);

// Password reset rate limiter (controlled by .env)
const passwordResetLimiter = createRateLimiter(
  parseInt(process.env.PASSWORD_RESET_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000, // Use specific password reset env var or 1 hour
  parseInt(process.env.PASSWORD_RESET_RATE_LIMIT_MAX) || 20, // Use specific password reset env var or 20 attempts
  "Too many password reset attempts, please try again later"
);

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
};
