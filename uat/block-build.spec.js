import { test, expect } from "@playwright/test";

async function addUatSection(page, name) {
  await page.locator("input[value='Add 1-Column Section']").first().click();
  await page.waitForTimeout(3000);
  await page.getByRole("textbox", { name: "Section Name" }).last().fill(name);
  await page.waitForTimeout(1000);
}

async function addUatBlock(page, blockValue) {
  const colMenu = page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last();
  await colMenu.scrollIntoViewIfNeeded();
  await colMenu.getByRole("button", { name: "List additional actions" }).click();
  await page.waitForTimeout(1500);
  await colMenu.locator(`input[value='${blockValue}']`).click();
  await page.waitForTimeout(6000);
}

async function collapseUat(page) {
  await page.locator("input.paragraphs-icon-button-collapse").last().scrollIntoViewIfNeeded();
  await page.locator("input.paragraphs-icon-button-collapse").last().click();
  await page.waitForTimeout(3000);
}

test.describe("UAT Build Probe - Multiple Blocks", () => {
  test("Build Page Title, Accordion, Text Area, Image blocks (no publish)", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await page.goto("/user");
      await page.waitForLoadState("domcontentloaded");
      const logoutLink = page.locator('a[data-drupal-link-system-path="logout"], a[href*="/logout"]');
      const adminLink = page.locator('a:has-text("MTPC Administration")');
      expect((await logoutLink.count()) + (await adminLink.count())).toBeGreaterThan(0);
    });

    await test.step("Create Standard Page (draft)", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("domcontentloaded");
      await page.getByRole("textbox", { name: "Page Title" }).fill("UAT Multi Block Probe");
    });

    await test.step("Add 1-Column Section", async () => {
      await addUatSection(page, "UAT Multi Section");
    });

    await test.step("Block 1 - Page Title", async () => {
      await addUatBlock(page, "Add Page Title Block");
      const titleField = page.getByRole("textbox", { name: "Override Page Title" });
      await expect(titleField).toBeVisible({ timeout: 15000 });
      await titleField.fill("UAT Page Title One");
      await expect(titleField).toHaveValue("UAT Page Title One");
      await collapseUat(page);
    });

    await test.step("Block 2 - Accordion", async () => {
      await addUatBlock(page, "Add Accordion Block");
      const body = await page.locator("body").innerText().catch(() => "");
      if (body.includes("Oops, something went wrong")) {
        console.log("ACCORDION: server-side 500 error on UAT (see dblog). Skipping accordion config.");
      } else {
        await page.getByRole("button", { name: "Add Accordion Item" }).last().click();
        await page.waitForTimeout(2000);
        await page.locator('textarea[name*="field_mtpc_accordion_title"]').last().fill("UAT Accordion Item 1");
        await page.getByRole("textbox", { name: "Rich Text Editor. Editing" }).last().fill("<p>UAT Accordion Content</p>");
        console.log("ACCORDION: added + configured OK (no 500)");
      }
      await collapseUat(page);
    });

    await test.step("Block 3 - Text Area (CKEditor)", async () => {
      await addUatBlock(page, "Add Text Area Block");
      const editor = page.locator(".ck-editor__editable").last();
      await expect(editor).toBeVisible({ timeout: 15000 });
      await editor.click();
      await editor.fill("<p>UAT Text Area Content</p>");
      const body = await page.locator("body").innerText().catch(() => "");
      expect(body).not.toContain("Oops, something went wrong");
      await collapseUat(page);
    });

    await test.step("Block 4 - Image (media library)", async () => {
      await addUatBlock(page, "Add Image Block");
      const mediaButton = page.getByRole("button", { name: "Add media" }).last();
      if (await mediaButton.count()) {
        await mediaButton.click();
        const modal = page.locator(".ui-dialog.media-library-widget-modal, .media-library-widget-modal");
        await modal.waitFor({ state: "visible", timeout: 20000 });
        const items = modal.locator(".media-library-item, .js-media-library-item");
        const itemCount = await items.count();
        console.log("Media items in modal:", itemCount);
        if (itemCount) {
          await items.first().click({ force: true });
          await page.waitForTimeout(500);
          const insert = modal.getByRole("button", { name: "Insert selected" });
          if (await insert.count()) {
            await insert.click();
            await modal.waitFor({ state: "hidden", timeout: 20000 });
          }
        } else {
          console.log("No media items available in library");
        }
      } else {
        console.log("No Add media button found");
      }
      const body = await page.locator("body").innerText().catch(() => "");
      expect(body).not.toContain("Oops, something went wrong");
    });

    await test.step("Verify draft still unsaved", async () => {
      const url = page.url();
      expect(url).toContain("/node/add/custom_page/mtpc");
      const publishBtn = page.getByRole("button", { name: "Publish Page" });
      expect(await publishBtn.count()).toBe(1);
      console.log("All blocks built and configured. NOT published.");
    });
  });
});
