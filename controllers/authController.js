const User = require("../models/User");
const {
  generateTokens,
  verifyRefreshToken,
  generateOTP,
  generateSecureToken,
  hashOTP,
  verifyOTP: verifyOTPUtil,
} = require("../utils/tokenUtils");
const {
  sendOTPEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");
const logger = require("../config/logger");
const jwt = require("jsonwebtoken");

// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpires = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRE) * 60 * 1000
    );

    // Create user
    const user = new User({
      name,
      email,
      password,
      otp: hashedOTP,
      otpExpires,
      verified: false,
    });

    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    logger.info("User registered successfully", { email, userId: user._id });

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for OTP verification.",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }
    const isOTPValid = verifyOTPUtil(otp, user.otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    logger.info("Email verified successfully", { email, userId: user._id });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
      data: {
        userId: user._id,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Resend OTP
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, verified: false });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found or already verified",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpires = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRE) * 60 * 1000
    );

    user.otp = hashedOTP;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    logger.info("OTP resent successfully", { email, userId: user._id });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token to user
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
    });

    // Clean old refresh tokens (keep only last 5)
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    logger.info("User logged in successfully", { email, userId: user._id });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and check if refresh token exists
    const user = await User.findOne({
      _id: decoded.userId,
      "refreshTokens.token": refreshToken,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );
    user.refreshTokens.push({
      token: tokens.refreshToken,
      createdAt: new Date(),
    });

    await user.save();

    logger.info("Token refreshed successfully", { userId: user._id });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: tokens,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }
    next(error);
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;

    if (refreshToken) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== refreshToken
      );
    } else {
      // Remove all refresh tokens (logout from all devices)
      user.refreshTokens = [];
    }

    await user.save();

    logger.info("User logged out successfully", { userId: user._id });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message:
          "If an account with this email exists, you will receive a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = generateSecureToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/auth/reset-password?token=${resetToken}`;

    // Send password reset email
    await sendPasswordResetEmail(email, resetUrl);

    logger.info("Password reset requested", { email, userId: user._id });

    res.status(200).json({
      success: true,
      message:
        "If an account with this email exists, you will receive a password reset link.",
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all refresh tokens

    await user.save();

    logger.info("Password reset successfully", {
      email: user.email,
      userId: user._id,
    });

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -otp -resetToken");

    logger.info("User profile updated", { userId, updateData });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info("User password changed", { userId });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete user account
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);

    logger.info("User account deleted", { userId });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete any user
const adminDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    logger.info("User deleted by admin", {
      deletedUserId: userId,
      adminId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all users
const adminGetUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
