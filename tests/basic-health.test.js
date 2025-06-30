const request = require("supertest");

// Mock email service before requiring the app
jest.mock("../utils/emailService", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

// Set test environment
process.env.NODE_ENV = "test";

const app = require("../server");

// Skip the setup file for this test
jest.doMock("../tests/setup.js", () => {});

describe("App Health Check (No DB)", () => {
  test("Public health endpoint should work", async () => {
    const response = await request(app).get("/healthz");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("healthy");
    expect(response.body.timestamp).toBeDefined();
  });

  test("Protected endpoint should reject without API key", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("API key required");
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
