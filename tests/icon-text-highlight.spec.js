import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addIconTextHighlightBlock } from "../helpers/icon-text-highlight.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Icon & Text Highlight Block", () => {
  test("All column styles on one page", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Icon Text Highlight Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Highlight Section");
    });

    await test.step("Add Block 1 - Two-column layout", async () => {
      await addIconTextHighlightBlock(page, {
        highlightStyle: "two",
        highlightDisplay: "top",
        headingDisplay: "center",
        iconTextStyle: "row",
        tabletColumns: "original",
        icon: "fa-light fa-lightbulb",
        text: "<h3>Two Column Highlight</h3><p>Testing two column layout.</p>",
      });
    });

    await test.step("Collapse Block 1", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Add Block 2 - Three-column layout", async () => {
      await addIconTextHighlightBlock(page, {
        highlightStyle: "three",
        highlightDisplay: "middle",
        headingDisplay: "left",
        iconTextStyle: "column",
        tabletColumns: "two",
        icon: "fa-solid fa-rocket",
        text: "<h3>Three Column Highlight</h3><p>Testing three column layout.</p>",
      });
    });

    await test.step("Collapse Block 2", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Add Block 3 - Four-column layout", async () => {
      await addIconTextHighlightBlock(page, {
        highlightStyle: "four",
        highlightDisplay: "top",
        headingDisplay: "center",
        iconTextStyle: "row",
        tabletColumns: "original",
        icon: "fa-duotone fa-flask",
        text: "<h3>Four Column Highlight</h3><p>Testing four column layout.</p>",
      });
    });

    await test.step("Collapse Block 3", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Two Column Highlight").first()).toBeVisible();
      await expect(page.getByText("Three Column Highlight").first()).toBeVisible();
      await expect(page.getByText("Four Column Highlight").first()).toBeVisible();
    });
  });
});
