const request = require("supertest");
const app = require("../server");

describe("Middleware Tests", () => {
  describe("API Key Authentication", () => {
    it("should allow requests with valid API key", async () => {
      const response = await request(app)
        .get("/healthz")
        .set("x-api-key", "dev_api_key_123");

      expect(response.status).not.toBe(401);
    });

    it("should reject requests without API key", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("API key is required");
    });

    it("should reject requests with invalid API key", async () => {
      const response = await request(app)
        .post("/auth/register")
        .set("x-api-key", "invalid-key")
        .send({
          email: "test@example.com",
          password: "Password123!",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid API key");
    });
  });

  describe("Rate Limiting", () => {
    it("should allow requests under the rate limit", async () => {
      const response = await request(app).get("/healthz");

      expect(response.status).not.toBe(429);
    });
  });

  describe("Input Validation", () => {
    const validApiKey = "dev_api_key_123";

    it("should sanitize and validate email input", async () => {
      const response = await request(app)
        .post("/auth/register")
        .set("x-api-key", validApiKey)
        .send({
          email: "TEST@EXAMPLE.COM",
          password: "Password123!",
        });

      // Should normalize email to lowercase
      expect(response.status).toBe(201);
    });

    it("should reject XSS attempts in input", async () => {
      const response = await request(app)
        .post("/auth/register")
        .set("x-api-key", validApiKey)
        .send({
          email: '<script>alert("xss")</script>@example.com',
          password: "Password123!",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
