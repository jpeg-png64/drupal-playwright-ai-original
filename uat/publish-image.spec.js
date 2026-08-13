import { test, expect } from "@playwright/test";

async function addUatSection(page, name) {
  await page.getByRole("button", { name: "Add 1-Column Section" }).click();
  await page.waitForTimeout(3000);
  await page.getByRole("textbox", { name: "Section Name" }).last().fill(name);
  await page.waitForTimeout(1000);
}

async function addUatImageBlock(page) {
  const colMenu = page
    .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]')
    .last();
  await colMenu.scrollIntoViewIfNeeded();
  await colMenu.getByRole("button", { name: "List additional actions" }).click();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Add Image Block" }).click();
  await page.waitForTimeout(4000);
}

async function collapseUat(page) {
  await page.locator("input.paragraphs-icon-button-collapse").last().scrollIntoViewIfNeeded();
  await page.locator("input.paragraphs-icon-button-collapse").last().click();
  await page.waitForTimeout(3000);
}

test.describe("UAT Publish Probe - Image Block", () => {
  test("Publish image block page", async ({ page }) => {
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
      await page.getByRole("textbox", { name: "Page Title" }).fill("UAT Publish Image Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addUatSection(page, "UAT Publish Section");
    });

    await test.step("Add Image Block", async () => {
      await addUatImageBlock(page);
      const mediaButton = page.getByRole("button", { name: "Add media" }).last();
      await mediaButton.click();
      const modal = page.locator(".ui-dialog.media-library-widget-modal, .media-library-widget-modal");
      await modal.waitFor({ state: "visible", timeout: 20000 });
      const items = modal.locator(".media-library-item, .js-media-library-item");
      await items.first().click({ force: true });
      const insert = modal.getByRole("button", { name: "Insert selected" });
      await insert.click();
      await modal.waitFor({ state: "hidden", timeout: 20000 });
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
      await expect(page.locator("article img").first()).toBeVisible({ timeout: 30000 });
    });
  });
});
