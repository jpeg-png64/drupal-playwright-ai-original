import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  timeout: 180000,
  retries: 0,
  reporter: [["line"]],
  use: {
    baseURL: "https://builder-clean.docker-uat01.ust.hk",
    headless: true,
    actionTimeout: 30000,
    navigationTimeout: 60000,
    httpCredentials: { username: "helper", password: "DaTLLkturGtSUgI0" },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
