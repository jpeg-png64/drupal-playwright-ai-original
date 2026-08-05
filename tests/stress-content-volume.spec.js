import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { fastCollapseCurrentBlock } from "../helpers/fast-collapse.js";
import { addTextAreaBlock } from "../helpers/text-area.js";
import { addSlideshowBlock } from "../helpers/slideshow.js";

const LONG_TITLE = "A".repeat(500);
const LONG_HTML = "<p>" + "B".repeat(2000) + "</p>";
const MASSIVE_HTML = "<p>" + "C".repeat(5000) + "</p>";

test.describe("Stress - Content Volume", () => {
  test("Large text and complex content @combined", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => { await login(page); });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Stress Content Volume");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Content Stress Section");
    });

    await test.step("Accordion Block - 3 items, long content", async () => {
      const colMenu = page
        .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]')
        .last();
      await colMenu.scrollIntoViewIfNeeded();
      await colMenu.getByRole("button", { name: "List additional actions" }).click();
      await page.waitForTimeout(500);
      await page.getByRole("button", { name: "Add Accordion Block" }).click();
      await page.waitForTimeout(4000);

      for (let i = 0; i < 3; i++) {
        await page.getByRole("button", { name: "Add Accordion Item" }).last().click();
        await page.waitForTimeout(2000);
        await page.locator('textarea[name*="field_mtpc_accordion_title"]').last().fill(`Item ${i} - ${LONG_TITLE}`);
        await page.getByRole("textbox", { name: "Rich Text Editor. Editing" }).last().fill(LONG_HTML);
      }
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Text Area Block - 5k chars", async () => {
      await addTextAreaBlock(page, MASSIVE_HTML);
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Slideshow Block - 2 slides", async () => {
      await addSlideshowBlock(page);
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Profile Listing Block - long content", async () => {
      const columnMenu = page.locator('[id*="field-mod-1-col-container-add-more"]').last();
      await columnMenu.getByRole("button", { name: "List additional actions" }).click();
      await columnMenu.getByRole("listitem").filter({ hasText: "Add Profile Listing Block" }).click();
      await page.waitForTimeout(3000);
      await page.getByRole("textbox", { name: "List Title" }).last().fill(`Profile Listing - ${LONG_TITLE}`);
      await page.getByRole("textbox", { name: "Profile Link" }).last().fill("<front>");
      await page.getByRole("checkbox", { name: "Open Link in a new tab" }).last().check();
      await page.getByRole("textbox", { name: "English Name" }).last().fill("A".repeat(200));
      await page.getByRole("textbox", { name: "Chinese Name" }).last().fill("艾".repeat(100));
      await page.getByRole("textbox", { name: "Rich Text Editor. Editing" }).last().fill(LONG_HTML);
      await page.locator('select[name*="field_mtpc_pl_list_style"]').last().selectOption("one_col");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByRole("heading", { name: "Stress Content Volume" })).toBeVisible();
      await expect(page.getByText("Item 0").first()).toBeVisible();
      await expect(page.getByText("Slide 1 title").first()).toBeVisible();
      await expect(page.getByText("Slide 2 title").first()).toBeVisible();
    });
  });
});
