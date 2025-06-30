const express = require("express");
const router = express.Router();

const {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  adminDeleteUser,
  adminGetUsers,
} = require("../controllers/authController");

const { auth, adminAuth } = require("../middleware/auth");
const {
  authLimiter,
  passwordResetLimiter,
} = require("../middleware/rateLimiter");
const {
  validateRegister,
  validateLogin,
  validateOTP,
  validatePasswordReset,
  validatePasswordUpdate,
  validateRefreshToken,
  validateProfileUpdate,
  validatePasswordChange,
  handleValidationErrors,
} = require("../middleware/validation");

// Public routes
router.post(
  "/register",
  authLimiter, // Re-enabled with increased limits from env vars
  validateRegister,
  handleValidationErrors,
  register
);

router.post(
  "/verify-otp",
  authLimiter, // Re-enabled with increased limits from env vars
  validateOTP,
  handleValidationErrors,
  verifyOTP
);

router.post(
  "/resend-otp",
  authLimiter,
  validateOTP,
  handleValidationErrors,
  resendOTP
);

router.post(
  "/login",
  authLimiter, // Re-enabled with increased limits from env vars
  validateLogin,
  handleValidationErrors,
  login
);

router.post(
  "/refresh-token",
  validateRefreshToken,
  handleValidationErrors,
  refreshToken
);

router.post(
  "/request-password-reset",
  passwordResetLimiter,
  validatePasswordReset,
  handleValidationErrors,
  requestPasswordReset
);

router.post(
  "/reset-password",
  passwordResetLimiter,
  validatePasswordUpdate,
  handleValidationErrors,
  resetPassword
);

// Protected routes
router.post("/logout", auth, logout);
router.get("/profile", auth, getProfile);

router.put("/profile", auth, updateProfile);
router.put(
  "/change-password",
  auth,
  validatePasswordChange,
  handleValidationErrors,
  changePassword
);
router.delete("/account", auth, deleteAccount);

// Admin routes
router.get("/admin/users", adminAuth, adminGetUsers);
router.delete("/admin/users/:userId", adminAuth, adminDeleteUser);

module.exports = router;
