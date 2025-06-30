const request = require("supertest");
const app = require("../server");

// Test without starting actual email service
describe("API Health Check", () => {
  test("Public health endpoint should work", async () => {
    const response = await request(app).get("/healthz");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    console.log("✅ Public health endpoint working");
  });

  test("Protected health endpoint should work with API key", async () => {
    const response = await request(app)
      .get("/health")
      .set("x-api-key", "dev_api_key_123");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    console.log("✅ Protected health endpoint working");
  });

  test("Protected endpoint should reject without API key", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    console.log("✅ API key protection working");
  });
});

// Mock email service for testing
jest.mock("../utils/emailService", () => ({
  sendOTPEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

describe("Auth Endpoints", () => {
  test("Registration should work with mocked email", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("x-api-key", "dev_api_key_123")
      .send({
        email: "test@example.com",
        password: "Test123!@#",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    console.log("✅ User registration working");
  });
});
