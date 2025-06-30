const logger = require("../config/logger");

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    logger.warn("API key missing in request", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      path: req.path,
    });
    return res.status(401).json({
      success: false,
      message: "API key is required",
    });
  }

  const validApiKeys = process.env.API_KEYS?.split(",") || [];

  if (!validApiKeys.includes(apiKey)) {
    logger.warn("Invalid API key used", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      path: req.path,
      apiKey: apiKey.substring(0, 8) + "...", // Log partial key for debugging
    });
    return res.status(401).json({
      success: false,
      message: "Invalid API key",
    });
  }

  logger.info("Valid API key used", {
    ip: req.ip,
    path: req.path,
    apiKey: apiKey.substring(0, 8) + "...",
  });

  next();
};

module.exports = apiKeyAuth;
