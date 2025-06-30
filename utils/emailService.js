const nodemailer = require("nodemailer");
const logger = require("../config/logger");

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const getOTPEmailTemplate = (otp) => {
  return {
    subject: "Email Verification - OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification Required</h2>
        <p>Thank you for registering with our service. Please use the following OTP code to verify your email address:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666;">This OTP code will expire in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this verification, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };
};

const getPasswordResetEmailTemplate = (resetUrl) => {
  return {
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666;">This link will expire in 1 hour.</p>
        <p style="color: #666;">If you didn't request this password reset, please ignore this email.</p>
        <p style="color: #666;">For security reasons, if you continue to receive these emails, please contact our support team.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    const template = getOTPEmailTemplate(otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      html: template.html,
    };

    await transporter.sendMail(mailOptions);
    logger.info("OTP email sent successfully", { email });
    return true;
  } catch (error) {
    logger.error("Failed to send OTP email", { email, error: error.message });
    throw new Error("Failed to send verification email");
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const transporter = createTransporter();
    const template = getPasswordResetEmailTemplate(resetUrl);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      html: template.html,
    };

    await transporter.sendMail(mailOptions);
    logger.info("Password reset email sent successfully", { email });
    return true;
  } catch (error) {
    logger.error("Failed to send password reset email", {
      email,
      error: error.message,
    });
    throw new Error("Failed to send password reset email");
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
};
