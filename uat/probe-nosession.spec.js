import { test } from "@playwright/test";

test.describe("UAT No-Session Probe - anonymous + basic auth only", () => {
  test("Admin access WITHOUT any Drupal session cookie", async ({ page }) => {
    test.setTimeout(180000);
    for (const path of ["/user", "/admin", "/admin/config", "/admin/people", "/node/1/edit"]) {
      const resp = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30000 });
      const status = resp ? resp.status() : "?";
      const title = await page.title().catch(() => "");
      const text = (await page.locator("body").innerText().catch(() => "")).slice(0, 300).replace(/\s+/g, " ");
      const hasLogout = /logout/i.test(text);
      console.log(`[${status}] ${path}  title="${title}"  has-logout=${hasLogout}`);
      console.log(`    body: ${text.slice(0, 220)}`);
    }
  });
});
