import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addTextAreaBlock } from "../helpers/text-area.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Text Area Block", () => {
  test("Default", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Text Area Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Text Area Section");
    });

    await test.step("Add Text Area Block", async () => {
      await addTextAreaBlock(page, "<p>Playwright Text Area Test</p>");
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Playwright Text Area Test")).toBeVisible();
    });
  });
});
