import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { fastCollapseCurrentBlock } from "../helpers/fast-collapse.js";
import { addVideoBlock } from "../helpers/video.js";
import { addYoutubeBlock } from "../helpers/youtube.js";
import { addImageGridBlock } from "../helpers/image-grid.js";
import { addEventCarouselBlock } from "../helpers/event-carousel.js";

function fmtDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

test.describe("Stress - Size Extremes", () => {
  test("Boundary dimensions and limits @combined", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => { await login(page); });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Stress Size Extremes");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Size Stress Section");
    });

    await test.step("Video Block - min (50x50)", async () => {
      await addVideoBlock(page, {
        url: "https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D",
        width: 50, height: 50, autoplay: false,
      });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Video Block - huge (5000x5000)", async () => {
      await addVideoBlock(page, {
        url: "https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D",
        width: 5000, height: 5000, autoplay: false,
      });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("YouTube Block - min (50x50)", async () => {
      await addYoutubeBlock(page, "50", "50");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("YouTube Block - huge (5000x5000)", async () => {
      await addYoutubeBlock(page, "5000", "5000");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Image Grid - no border (0x0)", async () => {
      await addImageGridBlock(page, {
        layout: "small", hover: "_none", zoom: "_none",
        borderWidth: "0", borderRadius: "0", captionBg: false,
        link: "https://example.com", target: "_self", caption: "No border grid",
      });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Image Grid - extreme border (100x100)", async () => {
      await addImageGridBlock(page, {
        layout: "small", hover: "_none", zoom: "_none",
        borderWidth: "100", borderRadius: "100", captionBg: false,
        link: "https://example.com", target: "_self", caption: "Extreme border grid",
      });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Event Carousel - char limit 50 (min)", async () => {
      await addEventCarouselBlock(page, {
        name: "Tiny Limit Event", startDate: fmtDate(0), endDate: fmtDate(0),
      });
      await page.locator('input[data-drupal-selector*="field-mtpc-carousel-limit-chars"]').last().fill("50");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Event Carousel - char limit 300", async () => {
      await addEventCarouselBlock(page, {
        name: "Huge Limit Event", startDate: fmtDate(0), endDate: fmtDate(0),
      });
      await page.locator('input[data-drupal-selector*="field-mtpc-carousel-limit-chars"]').last().fill("300");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Tiny Limit Event")).toBeVisible();
      await expect(page.getByText("Huge Limit Event")).toBeVisible();
      await expect(page.getByText("No border grid").first()).toBeVisible();
      await expect(page.getByText("Extreme border grid").first()).toBeVisible();
      await expect(page.locator("article iframe").first()).toBeVisible();
    });
  });
});
