module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "middleware/**/*.js",
    "utils/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
    "!**/coverage/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 60000,
  detectOpenHandles: true,
  forceExit: true,
};
