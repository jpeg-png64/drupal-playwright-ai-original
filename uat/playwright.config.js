import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",

  outputDir: "test-results/artifacts",

  timeout: 180000,

  retries: 0,

  reporter: [
    ["line"],
    ["html", { outputFolder: "test-results/html-report-uat", open: "never" }],
  ],

  use: {
    baseURL: "https://builder-clean.docker-uat01.ust.hk",
    headless: true,
    actionTimeout: 30000,
    navigationTimeout: 60000,
    httpCredentials: {
      username: "helper",
      password: "DaTLLkturGtSUgI0",
    },
    storageState:
      "/Users/leemingfung/Desktop/drupal-playwright-ai/.auth/storage-state-builder-clean.json",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
