import { chromium } from "@playwright/test";

const BASE_URL = "https://builder-clean.docker-uat01.ust.hk";
const STORAGE_STATE = "/Users/leemingfung/Desktop/drupal-playwright-ai/.auth/storage-state-builder-clean.json";
const BASIC_AUTH = { username: "helper", password: "DaTLLkturGtSUgI0" };

const TITLES = [
  "Views Block Test",
  "Accordion Test Page",
  "Event Carousel Test Page",
  "Event Carousel All Fields",
  "Icon Text Highlight Test",
  "Image Test Page",
  "Image Animation Test Page",
  "Navigation Menu Test",
  "Next Previous Test",
  "Next Previous Colors Test",
  "Page Title Test",
  "Page Title Advanced Test",
  "Profile Details Test",
  "Profile Listing Test",
  "Slideshow Test Page",
  "Text Area Test",
  "Video Test Page",
  "Video Autoplay Test Page",
  "YouTube Test Page",
  "Grid Zoom Enabled",
  "3-Column Carousel Test",
  "All Blocks Combined Test",
  "ZZ Next Target",
  "ZZ Previous Target",
];

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: STORAGE_STATE, httpCredentials: BASIC_AUTH });
const page = await context.newPage();

await page.goto(`${BASE_URL}/admin/content`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

let deleted = 0;
let notFound = [];

for (const title of TITLES) {
  try {
    await page.goto(`${BASE_URL}/admin/content?title=${encodeURIComponent(title)}`, { waitUntil: "networkidle" });
    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    let matched = null;
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const rowText = await row.innerText();
      if (rowText.includes(title)) {
        matched = row;
        break;
      }
    }
    if (!matched) {
      notFound.push(title);
      console.log(`NOT FOUND: ${title}`);
      continue;
    }
    await matched.locator('select').first().selectOption({ label: "Delete" });
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Apply to selected items" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.waitForURL("**/admin/content**", { timeout: 30000 });
    deleted++;
    console.log(`DELETED: ${title}`);
    await page.waitForTimeout(1200);
  } catch (err) {
    notFound.push(title);
    console.log(`ERROR: ${title} -> ${err.message.split("\n")[0]}`);
  }
}

console.log(`\nDONE: deleted=${deleted}, notFound=${notFound.length}`);
if (notFound.length) console.log("Not found/errored: " + notFound.join(", "));

await browser.close();
