import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addPageTitleBlock } from "../helpers/page-title.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Page Title Block", () => {
  test("Default", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Page Title Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Title Section");
    });

    await test.step("Add Page Title Block", async () => {
      await addPageTitleBlock(page, {
        title: "Override Title",
        align: "center",
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
      await expect(page.getByText("Override Title")).toBeVisible();
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
      await page.getByRole("textbox", { name: "Page Title" }).fill("Page Title Advanced Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Advanced Section");
    });

    await test.step("Add Block 1 - Top position + height + breadcrumbs", async () => {
      await addPageTitleBlock(page, {
        title: "Top Position Title",
        align: "center",
        position: "top",
        desktopHeight: "150",
        tabletHeight: "120",
        mobileHeight: "100",
        showBreadcrumbs: true,
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Add Block 2 - Middle position + breadcrumb override", async () => {
      await addPageTitleBlock(page, {
        title: "Middle Position Title",
        align: "center",
        position: "middle",
        desktopHeight: "200",
        showBreadcrumbs: true,
        overrideBreadcrumbs: true,
        breadcrumbUrl: "<front>",
        breadcrumbText: "Home",
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
      await expect(page.getByText("Top Position Title").first()).toBeVisible();
      await expect(page.getByText("Middle Position Title").first()).toBeVisible();
      await expect(page.getByText("Home").first()).toBeAttached();
    });
  });
});
