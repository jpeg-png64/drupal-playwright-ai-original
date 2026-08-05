import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addProfileDetailsBlock } from "../helpers/profile-details.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Profile Details Block", () => {
  test("Default", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Profile Details Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Profile Section");
    });

    await test.step("Add Profile Details Block", async () => {
      await addProfileDetailsBlock(page, "people-profile-picture.jpg");
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("This is profile information created by Playwright.")).toBeVisible();
      await expect(page.getByText("This is picture information created by Playwright.")).toBeVisible();
    });
  });
});
