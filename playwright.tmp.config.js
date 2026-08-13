import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  throw new Error("BASE_URL environment variable is required.");
}

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results/artifacts",
  globalSetup: "./global-setup.js",
  workers: 2,
  timeout: 180000,
  retries: 2,
  reporter: [["line"], ["json", { outputFile: "test-results/tmp-report.json" }]],
  use: {
    baseURL: BASE_URL,
    headless: process.env.HEADLESS === "true" ? true : false,
    actionTimeout: 30000,
    navigationTimeout: 60000,
    httpCredentials:
      process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS
        ? { username: process.env.BASIC_AUTH_USER, password: process.env.BASIC_AUTH_PASS }
        : undefined,
    storageState: process.env.STORAGE_STATE || ".auth/storage-state.json",
    screenshot: process.env.SCREENSHOT || "only-on-failure",
    trace: process.env.TRACE || "retain-on-failure",
  },
});
