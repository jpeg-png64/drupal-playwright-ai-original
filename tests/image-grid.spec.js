import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addImageGridBlock } from "../helpers/image-grid.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

const GRID_LAYOUTS = ["small", "large"];
const OVERLAY_EFFECTS = ["_none", "fade", "slide"];

test.describe("Image Grid Block - All Layout/Overlay Combinations", () => {
  for (const layout of GRID_LAYOUTS) {
    for (const hover of OVERLAY_EFFECTS) {
      const layoutName = layout === "small" ? "Four Images" : "Three Images";
      const hoverName = hover === "_none" ? "None" : hover === "fade" ? "Fade" : "Slide";

      test(`${layoutName} + ${hoverName} @media-modal`, async ({ page }) => {
        await test.step("Login", async () => {
          await login(page);
        });

        await test.step("Create Standard Page", async () => {
          await page.goto("/node/add/custom_page/mtpc");
          await page.waitForLoadState("networkidle");
          await page.getByRole("textbox", { name: "Page Title" }).fill(`Grid ${layoutName} ${hoverName}`);
        });

        await test.step("Add 1-Column Section", async () => {
          await addOneColumnSection(page, "Test Section");
        });

        await test.step("Add Image Grid Block", async () => {
          await addImageGridBlock(page, {
            layout,
            hover,
            zoom: "disabled",
            borderWidth: "2",
            borderRadius: "8",
            captionBg: true,
            link: "https://example.com",
            target: "_self",
            caption: `${layoutName} ${hoverName}`,
            media: "1170_home.png",
            mediaOverlay: "image-placeholder-2.jpg",
          });
        });

        await test.step("Publish Page", async () => {
          await page.getByRole("button", { name: "Publish Page" }).click();
          await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
          await page.waitForLoadState("load");
        });

        await test.step("Verify Frontend", async () => {
          const images = page.locator("article img");
          await expect(images.first()).toBeVisible();
        });
      });
    }
  }

  test("Zoom Enabled @media-modal", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Grid Zoom Enabled");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Test Section");
    });

    await test.step("Add Image Grid Block with zoom enabled", async () => {
      await addImageGridBlock(page, {
        layout: "small",
        hover: "fade",
        zoom: "enabled",
        borderWidth: "2",
        borderRadius: "8",
        captionBg: true,
        link: "https://example.com",
        target: "_self",
        caption: "Zoom Enabled Grid",
        media: "1170_home.png",
        mediaOverlay: "image-placeholder-2.jpg",
      });
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      const images = page.locator("article img");
      await expect(images.first()).toBeVisible();
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
      await page.getByRole("textbox", { name: "Page Title" }).fill("Grid All Fields");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Color Section");
    });

    await test.step("Add Block 1 - border + caption colors", async () => {
      await addImageGridBlock(page, {
        layout: "small",
        hover: "_none",
        zoom: "_none",
        borderWidth: "3",
        borderRadius: "10",
        captionBg: true,
        link: "https://example.com",
        target: "_self",
        caption: "Block One",
        borderColor: "#ff0000",
        captionBgColor: "#f0f0f0",
        media: "1170_home.png",
        mediaOverlay: "image-placeholder-2.jpg",
      });
    });

    await test.step("Collapse Block 1", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Add Block 2 - overlay colors", async () => {
      await addImageGridBlock(page, {
        layout: "large",
        hover: "fade",
        zoom: "disabled",
        borderWidth: "1",
        borderRadius: "4",
        captionBg: false,
        link: "https://example.com",
        target: "_blank",
        caption: "Block Two",
        overlayBg: "rgba(0,0,0,0.3)",
        overlayBgHover: "rgba(0,0,0,0.7)",
        media: "1170_home.png",
        mediaOverlay: "image-placeholder-2.jpg",
      });
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      const images = page.locator("article img");
      await expect(images.first()).toBeVisible();
      await expect(images.last()).toBeVisible();
    });
  });
});
