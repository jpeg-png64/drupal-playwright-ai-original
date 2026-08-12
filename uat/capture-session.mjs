import { chromium } from "playwright";
import { writeFileSync } from "fs";

const STATE = "/Users/leemingfung/Desktop/drupal-playwright-ai/.auth/storage-state-builder-clean.json";
const BASE = "https://builder-clean.docker-uat01.ust.hk";

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  httpCredentials: { username: "helper", password: "DaTLLkturGtSUgI0" },
  storageState: STATE,
});
const page = await context.newPage();

console.log("Browser opened. Log in to builder-clean via CAS in the window (admin account).");
await page.goto(BASE + "/user/login", { waitUntil: "domcontentloaded" });

let loggedIn = false;
const deadline = Date.now() + 5 * 60 * 1000;
while (Date.now() < deadline && !loggedIn) {
  await page.waitForTimeout(3000);
  try {
    await page.goto(BASE + "/user", { waitUntil: "domcontentloaded", timeout: 20000 });
    const body = await page.locator("body").innerText().catch(() => "");
    if (body.toLowerCase().includes("logout")) loggedIn = true;
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
