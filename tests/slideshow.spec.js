import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addSlideshowBlock } from "../helpers/slideshow.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Slideshow Block", () => {
  test("Default", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Slideshow Test Page");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Slideshow Section");
    });

    await test.step("Add Slideshow Block with 2 slides", async () => {
      await addSlideshowBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Slide 1 title").first()).toBeVisible();
      await expect(page.getByText("Slide 2 title").first()).toBeVisible();
    });
  });

  test("All configurable fields @media-modal", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Slideshow Advanced Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Advanced Section");
    });

    await test.step("Add Block 1 - all block options + styled slides", async () => {
      await addSlideshowBlock(page, {
        autoplay: true,
        infinite: true,
        fade: true,
        arrows: true,
        adaptiveHeight: true,
        navigationBullets: "circle",
        slideDuration: "4000",
        transitionDuration: "600",
        cssClasses: "custom-slideshow",
        slideCount: 1,
        items: [
          {
            line1Text: "Styled Title",
            line2Text: "Styled Description",
            textPosition: "top",
            textAlignment: "left",
            link: "https://example.com",
            target: "_blank",
            line1Size: "3",
            line1Radius: "0",
            line1Color: "#ffffff",
            line1Bg: "#333333",
            line2Size: "1.5",
            line2Radius: "0",
            line2Color: "#cccccc",
            line2Bg: "#000000",
          },
        ],
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Add Block 2 - minimal block (defaults)", async () => {
      await addSlideshowBlock(page);
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
      await expect(page.getByText("Styled Title").first()).toBeVisible();
      await expect(page.getByText("Slide 1 title").first()).toBeVisible();
    });
  });
});
