import { defineConfig } from "@playwright/test";

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
    baseURL: "http://localhost:8325",
    headless: false,
    actionTimeout: 30000,
    navigationTimeout: 60000,
    storageState: ".auth/storage-state.json",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
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
