import { chromium } from "playwright";
import { writeFileSync } from "fs";

const STATE = "/Users/leemingfung/Desktop/drupal-playwright-ai/.auth/storage-state-builder-clean.json";
const BASE = "https://builder-clean.docker-uat01.ust.hk";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  httpCredentials: { username: "helper", password: "DaTLLkturGtSUgI0" },
});
const page = await context.newPage();

await page.goto(BASE + "/user/login", { waitUntil: "domcontentloaded" });
console.log("URL after /user/login:", page.url());

await page.fill("#edit-name", "helper");
await page.fill("#edit-pass", "DaTLLkturGtSUgI0");
await page.click('#edit-submit');
await page.waitForLoadState("domcontentloaded").catch(() => {});

await page.goto(BASE + "/user", { waitUntil: "domcontentloaded" });
const body = await page.locator("body").innerText().catch(() => "");
console.log("/user contains 'logout':", body.toLowerCase().includes("logout"));
console.log("/user url:", page.url());
if (body.toLowerCase().includes("error") || body.toLowerCase().includes("unrecognized") || body.toLowerCase().includes("has not been recognized")) {
  console.log("LOGIN REJECTED - showing first 500 chars:", body.slice(0, 500));
}

if (body.toLowerCase().includes("logout")) {
  const state = await context.storageState();
  writeFileSync(STATE, JSON.stringify(state));
  console.log("SAVED fresh builder-clean session");
} else {
  console.log("Login failed - session NOT saved");
}
await browser.close();
process.exit(0);
