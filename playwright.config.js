import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  throw new Error('BASE_URL environment variable is required. Set BASE_URL to your Drupal site URL (e.g. BASE_URL="https://example.com"). The test runner will not default to localhost.');
}

export default defineConfig({
  testDir: "./tests",

  outputDir: "test-results/artifacts",

  globalSetup: "./global-setup.js",

  workers: 2,

  timeout: 180000,

  retries: 2,

  reporter: [
    ["line"],
    ["html", { outputFolder: "test-results/html-report", open: "never" }],
    [
      "json",
      {
        outputFile: "test-results/failure-report.json",
      },
    ],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:8325",
    // Allow overriding headless via env (false by default for visibility)
    headless: process.env.HEADLESS === "true" ? true : false,
    actionTimeout: 30000,
    navigationTimeout: 60000,
    // Allow overriding storage state path for per-user sessions
    storageState: process.env.STORAGE_STATE || ".auth/storage-state.json",
    screenshot: process.env.SCREENSHOT || "only-on-failure",
    trace: process.env.TRACE || "retain-on-failure",
  },

  projects: [
    {
      name: "parallel",
      grepInvert: /@media-modal|@combined/,
      workers: 2,
    },
    {
      name: "solo",
      grep: /@media-modal/,
      grepInvert: /@combined/,
      workers: 1,
      dependencies: ["parallel"],
    },
    {
      name: "combined",
      grep: /@combined/,
      workers: 1,
      dependencies: ["solo"],
    },
  ],
});
