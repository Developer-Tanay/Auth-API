const request = require("supertest");
const app = require("../server");
const User = require("../models/User");

// Mock email service
jest.mock("../utils/emailService", () => ({
  sendOTPEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

describe("Auth Controller", () => {
  const validApiKey = "dev_api_key_123";
  const validUser = {
    email: "test@example.com",
    password: "Password123!",
  };

  describe("POST /auth/register", () => {
    it("should register a new user with valid data", async () => {
      const response = await request(app)
        .post("/auth/register")
        .set("x-api-key", validApiKey)
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("registered successfully");
      expect(response.body.data.email).toBe(validUser.email);
    });

    it("should reject registration with invalid email", async () => {
      const response = await request(app)
        .post("/auth/register")
        .set("x-api-key", validApiKey)
        .send({
          email: "invalid-email",
          password: "Password123!",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should reject registration with weak password", async () => {
      const response = await request(app)
        .post("/auth/register")
        .set("x-api-key", validApiKey)
        .send({
          email: "test@example.com",
          password: "weak",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject registration without API key", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send(validUser);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("API key is required");
    });
  });

  describe("POST /auth/verify-otp", () => {
    beforeEach(async () => {
      // Create an unverified user
      const user = new User({
        email: validUser.email,
        password: validUser.password,
        otp: "hashedOTP",
        otpExpires: new Date(Date.now() + 10 * 60 * 1000),
        verified: false,
      });
      await user.save();
    });

    it("should verify OTP with valid data", async () => {
      // Mock the OTP verification
      const mockVerifyOTP = jest.fn().mockReturnValue(true);
      jest.doMock("../utils/tokenUtils", () => ({
        ...jest.requireActual("../utils/tokenUtils"),
        verifyOTP: mockVerifyOTP,
      }));

      const response = await request(app)
        .post("/auth/verify-otp")
        .set("x-api-key", validApiKey)
        .send({
          email: validUser.email,
          otp: "123456",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Create a verified user
      const user = new User({
        email: validUser.email,
        password: validUser.password,
        verified: true,
      });
      await user.save();
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .set("x-api-key", validApiKey)
        .send(validUser);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should reject login with invalid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .set("x-api-key", validApiKey)
        .send({
          email: validUser.email,
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("GET /auth/profile", () => {
    let accessToken;

    beforeEach(async () => {
      // Create a verified user and get access token
      const user = new User({
        email: validUser.email,
        password: validUser.password,
        verified: true,
      });
      await user.save();

      const loginResponse = await request(app)
        .post("/auth/login")
        .set("x-api-key", validApiKey)
        .send(validUser);

      accessToken = loginResponse.body.data.accessToken;
    });

    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/auth/profile")
        .set("x-api-key", validApiKey)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUser.email);
    });

    it("should reject request without token", async () => {
      const response = await request(app)
        .get("/auth/profile")
        .set("x-api-key", validApiKey);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
