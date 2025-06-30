const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });

  return { accessToken, refreshToken };
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate secure random token
const generateSecureToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Hash OTP with secret
const hashOTP = (otp) => {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(otp)
    .digest("hex");
};

// Verify hashed OTP
const verifyOTP = (otp, hashedOTP) => {
  const hash = crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(otp)
    .digest("hex");
  return hash === hashedOTP;
};

module.exports = {
  generateTokens,
  verifyRefreshToken,
  generateOTP,
  generateSecureToken,
  hashOTP,
  verifyOTP,
};
