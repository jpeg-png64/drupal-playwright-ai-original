import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addThreeColCarouselBlock } from "../helpers/three-col-carousel.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("3-Column Carousel Block", () => {
  test("Default @media-modal", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("3-Column Carousel Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Carousel Section");
    });

    await test.step("Add 3-Column Carousel Block", async () => {
      await addThreeColCarouselBlock(page);
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Carousel Highlight Title")).toBeVisible();
      await expect(page.getByText("Caption 0").first()).toBeVisible();
      await expect(page.getByText("Carousel Title 0").first()).toBeVisible();
    });
  });
});
