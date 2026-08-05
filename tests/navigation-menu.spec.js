import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addNavigationMenuBlock } from "../helpers/navigation-menu.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Navigation Menu Block", () => {
  test("Default", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Navigation Menu Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Nav Section");
    });

    await test.step("Add Navigation Menu Block", async () => {
      await addNavigationMenuBlock(page, "Top Links", "style1", "dropdown");
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByRole("heading", { name: "Navigation Menu Test" })).toBeVisible();
      await expect(page.getByText("Menu 01").first()).toBeAttached();
      await expect(page.getByText("Menu 02 test").first()).toBeAttached();
    });
  });
});
