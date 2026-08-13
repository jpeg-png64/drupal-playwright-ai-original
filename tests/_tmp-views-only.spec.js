import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addViewsBlock } from "../helpers/views.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Views Block (temporary individual spec)", () => {
  test("Default", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Views Block Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Views Block Section");
    });

    await test.step("Add Views Block", async () => {
      await addViewsBlock(page, "Events", 1);
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
      await expect(page.locator(".paragraph--type--mod-views-block").last()).toBeVisible();
    });
  });
});
