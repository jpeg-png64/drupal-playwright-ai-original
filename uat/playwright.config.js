import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    baseURL: process.env.UAT_BASE || "https://builder-clean.docker-uat01.ust.hk",
    headless: true,
    actionTimeout: 30000,
    navigationTimeout: 60000,
    httpCredentials: {
      username: process.env.UAT_BASIC_AUTH_USER || "helper",
      password: process.env.UAT_BASIC_AUTH_PASS || "DaTLLkturGtSUgI0",
    },
    storageState: resolve(
      __dirname,
      "../.auth/storage-state-builder-clean.json"
    ),
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
