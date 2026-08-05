import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addVideoBlock } from "../helpers/video.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Video Block", () => {
  test("Default", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Video Test Page");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Video Section");
    });

    await test.step("Add Video Block", async () => {
      await addVideoBlock(page, {
        url: "https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D",
        width: 640,
        height: 360,
        autoplay: false,
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
      const video = page.locator("article iframe, article video");
      await expect(video.first()).toBeVisible();
      await expect(page.locator('iframe[src*="video.ust.hk"]').first()).toBeVisible();
    });
  });

  test("Autoplay", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Video Autoplay Test Page");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Video Section");
    });

    await test.step("Add Video Block with autoplay", async () => {
      await addVideoBlock(page, {
        url: "https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D",
        width: 640,
        height: 360,
        autoplay: true,
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
      const video = page.locator("article iframe, article video");
      await expect(video.first()).toBeVisible();
      await expect(page.locator('iframe[src*="video.ust.hk"]').first()).toBeVisible();
    });
  });
});
