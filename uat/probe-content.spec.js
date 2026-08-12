import { test } from "@playwright/test";

const PATHS = [
  "/admin/config",
  "/admin/reports/dblog",
  "/node/1/edit",
  "/user/1/edit",
  "/install.php",
  "/update.php",
  "/admin",
  "/admin/structure",
  "/admin/people",
];

test.describe("UAT Content Probe - anonymous", () => {
  test("Capture body content of suspicious 200s", async ({ page }) => {
    test.setTimeout(300000);
    for (const path of PATHS) {
      const resp = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30000 });
      const status = resp ? resp.status() : "?";
      const url = page.url();
      const title = await page.title().catch(() => "");
      const text = (await page.locator("body").innerText().catch(() => "")).slice(0, 400).replace(/\s+/g, " ");
      console.log(`=== [${status}] ${path} -> landed: ${url}  title: "${title}"`);
      console.log(`    body: ${text.slice(0, 300)}`);
      console.log(`    has 'log in': ${/log in|user login/i.test(text)}  has 'logout': ${/logout/i.test(text)}  has 'access denied': ${/access denied/i.test(text)}`);
    }
  });
});
