import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addNextPreviousBlock } from "../helpers/next-previous.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Next & Previous Block", () => {
  test("Default", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Next Previous Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Nav Section");
    });

    await test.step("Add Next & Previous Block", async () => {
      await addNextPreviousBlock(page);
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
      await expect(page.getByText(">").first()).toBeVisible();
      await expect(page.getByText("<").first()).toBeVisible();
    });
  });

  test("All configurable fields", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Next Previous Colors Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Color Section");
    });

    await test.step("Add Block 1 - custom labels + colors", async () => {
      await addNextPreviousBlock(page, {
        nextTitle: "Next Page",
        prevTitle: "Previous Page",
        bgColor: "#f0f0f0",
        linkColor: "#333333",
        borderColor: "#cccccc",
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Add Block 2 - hover color fields", async () => {
      await addNextPreviousBlock(page, {
        nextTitle: ">>",
        prevTitle: "<<",
        bgHoverColor: "#e0e0e0",
        linkHoverColor: "#000000",
        borderHoverColor: "#999999",
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
      await expect(page.getByText("Next Page").first()).toBeVisible();
      await expect(page.getByText("Previous Page").first()).toBeVisible();
      await expect(page.getByText(">>").first()).toBeVisible();
      await expect(page.getByText("<<").first()).toBeVisible();
    });
  });
});
