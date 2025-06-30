const request = require("supertest");
const app = require("../server");

// Mock email service
jest.mock("../utils/emailService", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));
quest = require("supertest");
const app = require("../server");

// Mock email service
jest.mock("../services/emailService", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

// Use test environment
process.env.NODE_ENV = "test";

describe("Quick Health Check", () => {
  test("Public health endpoint should work", async () => {
    const response = await request(app).get("/healthz").expect(200);

    expect(response.body.status).toBe("healthy");
    expect(response.body.timestamp).toBeDefined();
  });

  test("Protected health endpoint should work with API key", async () => {
    const response = await request(app)
      .get("/health")
      .set("x-api-key", process.env.API_KEY)
      .expect(200);

    expect(response.body.status).toBe("healthy");
    expect(response.body.database).toBeDefined();
  });

  test("Protected endpoint should reject without API key", async () => {
    const response = await request(app).get("/health").expect(401);

    expect(response.body.error).toBe("API key required");
  });
});

describe("API Endpoint Structure", () => {
  test("Should have auth routes defined", async () => {
    // Test that auth routes exist (even if they fail due to no DB)
    const response = await request(app)
      .post("/auth/register")
      .set("x-api-key", process.env.API_KEY)
      .send({
        email: "test@example.com",
        password: "Test123!@#",
        name: "Test User",
      });

    // Should not be 404 (route exists)
    expect(response.status).not.toBe(404);
  });

  test("Should require API key for auth endpoints", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@example.com",
      password: "Test123!@#",
      name: "Test User",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("API key required");
  });
});
