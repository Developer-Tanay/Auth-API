const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      logger.warn("Token valid but user not found", { userId: decoded.userId });
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("JWT verification failed", { error: error.message });

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    next();
  });
};

module.exports = { auth, adminAuth };
