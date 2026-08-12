import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addImageBlock } from "../helpers/image.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Image Block", () => {
  test("Default", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page
        .getByRole("textbox", { name: "Page Title" })
        .fill("Image Test Page");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Image Section");
    });

    await test.step("Add Image Block", async () => {
      await addImageBlock(page, {
        captionBg: false,
        originalSize: false,
        align: "_none",
        target: "_self",
      });
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
      await expect(page.locator("article img").first()).toBeVisible();
      await expect(page.locator("article img").first()).toHaveAttribute(
        "src",
        /\/sites\/default\/files\/.*\.jpg/
      );
    });
  });

  test("With Animation", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page
        .getByRole("textbox", { name: "Page Title" })
        .fill("Image Animation Test Page");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Image Section");
    });

    await test.step("Add Image Block", async () => {
      await addImageBlock(page, {
        captionBg: false,
        originalSize: false,
        align: "_none",
        target: "_self",
      });
    });

    await test.step("Enable Animation", async () => {
      const animActive = page
        .locator('input[name*="field_mtpc_animation_active"]')
        .last();
      if (await animActive.count()) {
        await animActive.check();
      }

      const animEffect = page
        .locator('select[name*="field_mtpc_animation_effect"]')
        .last();
      if (await animEffect.count()) {
        await animEffect.selectOption("fade-up");
      }

      const animEasing = page
        .locator('select[name*="field_mtpc_animation_easing"]')
        .last();
      if (await animEasing.count()) {
        await animEasing.selectOption("ease-in-out");
      }

      const animDuration = page
        .locator('select[name*="field_mtpc_animation_duration"]')
        .last();
      if (await animDuration.count()) {
        await animDuration.selectOption("500");
      }

      const animRepeat = page
        .locator('select[name*="field_mtpc_animation_repeat"]')
        .last();
      if (await animRepeat.count()) {
        await animRepeat.selectOption("true");
      }
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
      await expect(page.locator("article img").first()).toBeVisible();
      await expect(page.locator("article img").first()).toHaveAttribute(
        "src",
        /\/sites\/default\/files\/.*\.jpg/
      );
    });
  });
});
