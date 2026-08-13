import { test, expect } from "@playwright/test";

test.describe("UAT Cleanup - Delete Created Pages", () => {
  test("Delete publish probe pages", async ({ page }) => {
    test.setTimeout(300000);

    await page.goto("/admin/content", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);

    const titles = [
      "UAT Publish Accordion Test",
      "UAT Publish Image Test",
    ];

    for (const title of titles) {
      const row = page.locator("tr", { hasText: title }).first();
      await expect(row).toBeVisible({ timeout: 15000 });
      const checkbox = row.locator('input[type="checkbox"]').first();
      await checkbox.check();
    }

    await page.locator('select[name="action"]').selectOption("node_delete_action");
    await page.locator('input[type="submit"][value="Apply to selected items"]').first().click();
    await page.waitForLoadState("domcontentloaded");

    const confirm = page.locator('input[type="submit"][value="Delete"]').first();
    if (await confirm.count()) {
      await confirm.click();
    }

    await page.waitForLoadState("domcontentloaded");

    for (const title of titles) {
      await expect(page.getByText(title, { exact: true })).toHaveCount(0);
    }
  });
});
