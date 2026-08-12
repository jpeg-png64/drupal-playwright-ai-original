import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addProfileListingBlock } from "../helpers/profile-listing.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Profile Listing Block", () => {
  test("Both layouts on one page", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Profile Listing Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Profile Section");
    });

    await test.step("Add Block 1 - One Column Layout", async () => {
      await addProfileListingBlock(page, "one_col");
    });

    await test.step("Collapse Block 1", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Add Block 2 - Two Column Layout", async () => {
      await addProfileListingBlock(page, "two_col");
    });

    await test.step("Collapse Block 2", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Playwright Profile Listing").first()).toBeVisible();
      await expect(page.getByText("Aea").first()).toBeVisible();
    });
  });
});
