import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addYoutubeBlock } from "../helpers/youtube.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("YouTube Block", () => {
  test("Default", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("YouTube Test Page");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "YouTube Section");
    });

    await test.step("Add YouTube Block", async () => {
      await addYoutubeBlock(page, "1280", "550");
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      const iframe = page.locator("article iframe");
      await expect(iframe.first()).toBeVisible();
      await expect(page.locator('iframe[src*="youtube.com/embed/vBmU5v2EyxM"]').first()).toBeVisible();
    });
  });
});
