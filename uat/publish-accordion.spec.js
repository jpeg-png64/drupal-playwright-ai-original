import { test, expect } from "@playwright/test";

async function addUatSection(page, name) {
  await page.getByRole("button", { name: "Add 1-Column Section" }).click();
  await page.waitForTimeout(3000);
  await page.getByRole("textbox", { name: "Section Name" }).last().fill(name);
  await page.waitForTimeout(1000);
}

async function addAccordionBlock(page) {
  const colMenu = page
    .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]')
    .last();
  await colMenu.scrollIntoViewIfNeeded();
  await colMenu.getByRole("button", { name: "List additional actions" }).click();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Add Accordion Block" }).click();
  await page.waitForTimeout(4000);
}

async function configureAccordion(page, config) {
  await page
    .getByRole("button", { name: "Add Accordion Item" })
    .last()
    .click();
  await page.waitForTimeout(2000);
  await page.locator('textarea[name*="field_mtpc_accordion_title"]').last().fill(config.title);
  await page
    .locator('input[name*="field_mtpc_accordion_expended"]')
    .last()
    .setChecked(config.expanded);
  await page.getByRole("textbox", { name: "Rich Text Editor. Editing" }).last().fill(config.text);
  await page
    .locator('select[name*="field_mtpc_accordion_icon_style"]')
    .last()
    .selectOption(config.iconStyle);
  if (config.iconStyle === "icon") {
    await page
      .locator('select[name*="field_mtpc_fa_acc_icon_style"]')
      .last()
      .selectOption(config.faStyle);
  } else {
    await page
      .locator('input[name*="field_mtpc_numeric_start"]')
      .last()
      .fill(config.numericStart);
  }
}

async function collapseUat(page) {
  await page.locator("input.paragraphs-icon-button-collapse").last().scrollIntoViewIfNeeded();
  await page.locator("input.paragraphs-icon-button-collapse").last().click();
  await page.waitForTimeout(3000);
}

test.describe("UAT Publish Probe - Accordion Block", () => {
  test("Publish accordion block page", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await page.goto("/user");
      await page.waitForLoadState("domcontentloaded");
      const logoutLink = page.locator('a[data-drupal-link-system-path="logout"], a[href*="/logout"]');
      const adminLink = page.locator('a:has-text("MTPC Administration")');
      expect((await logoutLink.count()) + (await adminLink.count())).toBeGreaterThan(0);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("domcontentloaded");
      await page.getByRole("textbox", { name: "Page Title" }).fill("UAT Publish Accordion Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addUatSection(page, "UAT Accordion Section");
    });

    await test.step("Add Accordion Block 1", async () => {
      await addAccordionBlock(page);
      await configureAccordion(page, {
        title: "UAT Accordion Item 1",
        expanded: true,
        text: "<p>UAT Accordion Content 1</p>",
        iconStyle: "number",
        numericStart: "5",
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseUat(page);
    });

    await test.step("Add Accordion Block 2", async () => {
      await addAccordionBlock(page);
      await configureAccordion(page, {
        title: "UAT Accordion Item 2",
        expanded: false,
        text: "<p>UAT Accordion Content 2</p>",
        iconStyle: "icon",
        faStyle: "fas",
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseUat(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), {
        timeout: 120000,
      });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("UAT Accordion Item 1", { exact: true })).toBeVisible({
        timeout: 30000,
      });
      await expect(page.getByText("UAT Accordion Item 2", { exact: true })).toBeVisible({
        timeout: 30000,
      });
    });
  });
});
