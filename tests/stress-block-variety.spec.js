import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { fastCollapseCurrentBlock } from "../helpers/fast-collapse.js";
import { addImageBlock } from "../helpers/image.js";

const LONG_TITLE = "A".repeat(500);
const LONG_HTML = "<p>" + "B".repeat(2000) + "</p>";
const MASSIVE_HTML = "<p>" + "C".repeat(5000) + "</p>";

test.describe("Stress - Block Variety", () => {
  test("Many block types on one page @combined", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => { await login(page); });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Stress Block Variety");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Variety Stress Section");
    });

    for (let i = 0; i < 2; i++) {
      await test.step(`Icon Text Highlight Block ${i + 1}/2`, async () => {
        const colMenu = page
          .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]')
          .last();
        await colMenu.scrollIntoViewIfNeeded();
        await colMenu.getByRole("button", { name: "List additional actions" }).click();
        await colMenu.getByRole("button", { name: "Add Icon & Text Highlight Block" }).click();
        await page.waitForTimeout(2000);

        const styles = ["two", "three"];
        const displays = ["top", "middle"];
        await page.locator('select[data-drupal-selector*="field-mtpc-highlight-style"]').last().selectOption(styles[i]);
        await page.locator('select[data-drupal-selector*="field-mtpc-highlight-display"]').last().selectOption(displays[i]);
        await page.locator('select[data-drupal-selector*="field-mtpc-highlight-h-display"]').last().selectOption("center");
        await page.locator('select[data-drupal-selector*="field-mtpc-icon-text-style"]').last().selectOption("row");
        await page.locator('select[data-drupal-selector*="field-mtpc-tablet-columns"]').last().selectOption("original");
        await page.locator('input[data-drupal-selector*="field-mtpc-highlight-icon"]').last().fill("fa-light fa-graduation-cap");

        const editor = page.locator(".ck-editor__editable").last();
        await editor.click();
        await editor.fill(`<h3>Highlight ${i + 1} - ${LONG_TITLE}</h3><p>${LONG_HTML}</p>`);
      });
      await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });
    }

    for (let i = 0; i < 2; i++) {
      await test.step(`Profile Details Block ${i + 1}/2`, async () => {
        const columnMenu = page.locator('[id*="field-mod-1-col-container-add-more"]').last();
        await columnMenu.getByRole("button", { name: "List additional actions" }).click();
        await columnMenu.getByRole("listitem").filter({ hasText: "Add Profile Details Block" }).click();
        await page.getByLabel("Profile Information").locator("..").getByRole("textbox").fill(`Profile ${i + 1} - ${MASSIVE_HTML}`);
        await page.getByLabel("Picture info").locator("..").getByRole("textbox").fill(`Picture ${i + 1} - ${MASSIVE_HTML}`);
      });
      await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });
    }

    for (let i = 0; i < 2; i++) {
      await test.step(`Image Block ${i + 1}/2`, async () => {
        await addImageBlock(page, {
          captionBg: false, originalSize: false, align: "_none", target: "_self",
        });
        const caption = page.locator('textarea[name*="field_mod_image_caption"]').last();
        if (await caption.count()) {
          await caption.fill(`Image ${i + 1} caption - ${LONG_TITLE}`);
        }
      });
      await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });
    }

    await test.step("Navigation Menu - long name", async () => {
      const colMenu = page
        .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]')
        .last();
      await colMenu.scrollIntoViewIfNeeded();
      await colMenu.getByRole("button", { name: "List additional actions" }).click();
      await page.getByRole("button", { name: "Add Navigation Menu Block" }).click();

      const menu = page.getByRole("textbox", { name: "Navigation Menu", exact: true }).last();
      await menu.waitFor({ state: "visible", timeout: 30000 });
      await menu.fill("Top Links");
      await page.waitForTimeout(3000);

      await page.locator(".ui-autocomplete li.ui-menu-item").first().click();
      await page.getByLabel("Desktop Style").last().selectOption("style1");
      await page.getByLabel("Mobile Style").last().selectOption("dropdown");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Page Title Block - long title", async () => {
      const colMenu = page
        .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]')
        .last();
      await colMenu.scrollIntoViewIfNeeded();
      await colMenu.getByRole("button", { name: "List additional actions" }).click();
      await page.getByRole("button", { name: "Add Page Title Block" }).click();

      const override = page.getByRole("textbox", { name: "Override Page Title" }).last();
      await override.fill(`Page Title - ${LONG_TITLE}`);
      const align = page.locator('select[name*="field_mtpc_pagetitle_align"]').last();
      if (await align.count()) {
        await align.selectOption("_none");
      }
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByRole("heading", { name: "Stress Block Variety" })).toBeVisible();
      await expect(page.getByText("Menu 01").first()).toBeAttached();
      await expect(page.getByText("Menu 02 test").first()).toBeAttached();
      await expect(page.locator("article img").first()).toBeVisible();
    });
  });
});
