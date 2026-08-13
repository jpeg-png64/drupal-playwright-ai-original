import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.UAT_BASE || "https://builder-clean.docker-uat01.ust.hk";
const STATE = resolve(__dirname, "../.auth/storage-state-builder-clean.json");
const BASIC_AUTH = {
  username: process.env.UAT_BASIC_AUTH_USER || "helper",
  password: process.env.UAT_BASIC_AUTH_PASS || "DaTLLkturGtSUgI0",
};

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  httpCredentials: BASIC_AUTH,
  storageState: STATE,
});
const page = await context.newPage();

console.log("Browser opened. Log in to " + BASE + " via CAS in the window (admin account).");
await page.goto(BASE + "/user/login", { waitUntil: "domcontentloaded" });

let loggedIn = false;
const deadline = Date.now() + 5 * 60 * 1000;
while (Date.now() < deadline && !loggedIn) {
  await page.waitForTimeout(3000);
  try {
    await page.goto(BASE + "/user", { waitUntil: "domcontentloaded", timeout: 20000 });
    const logoutLink = page.locator('a[data-drupal-link-system-path="logout"], a[href*="/logout"]');
    const adminLink = page.locator('a:has-text("MTPC Administration")');
    loggedIn = (await logoutLink.count()) > 0 || (await adminLink.count()) > 0;
  } catch {
    /* CAS redirects mid-login — keep waiting */
  }
}

if (loggedIn) {
  const state = await context.storageState();
  writeFileSync(STATE, JSON.stringify(state));
  console.log("SAVED fresh builder-clean session to .auth/storage-state-builder-clean.json");
} else {
  console.log("Timed out waiting for login — session NOT saved.");
}
await browser.close();
process.exit(0);
