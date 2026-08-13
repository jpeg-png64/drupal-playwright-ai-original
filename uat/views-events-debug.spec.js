import { test } from "@playwright/test";

test("Debug: select Events, dump views field state", async ({ page }) => {
  test.setTimeout(300000);

  await page.goto("/user");
  await page.waitForLoadState("domcontentloaded");
  const ok = await page.locator('a[data-drupal-link-system-path="logout"], a[href*="/logout"], a:has-text("MTPC Administration")').count();
  if (!ok) throw new Error("Not logged in on UAT");

  const agree = page.getByRole("button", { name: "OK, I agree" });
  if (await agree.count()) await agree.click().catch(() => {});

  await page.goto("/node/add/custom_page/mtpc");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("textbox", { name: "Page Title" }).fill("Events Debug");
  await page.getByRole("button", { name: "Add 1-Column Section" }).click();
  await page.getByRole("textbox", { name: "Section Name" }).last().fill("S");

  const columnMenu = page.locator('[id*="field-mod-1-col-container-add-more"]').last();
  await columnMenu.getByRole("button", { name: "List additional actions" }).click();
  await page.locator("li.add-more-button-mod-views-block input").click();
  await page.waitForTimeout(4000);

  const viewsInput = page.getByLabel("Views name");
  await viewsInput.waitFor({ state: "visible", timeout: 60000 });
  await viewsInput.fill("Events");
  await page.waitForTimeout(2500);

  const items = page.locator(".ui-autocomplete li.ui-menu-item");
  console.log("SUGGESTION COUNT:", await items.count());
  for (let i = 0; i < (await items.count()); i++) {
    console.log("  item html:", await items.nth(i).evaluate((el) => el.outerHTML));
  }
  await items.first().click();
  await page.waitForTimeout(3500);

  const formItem = viewsInput
    .locator("xpath=ancestor::div[contains(@class,'form-item')][1]")
    .first();
  console.log("\n=== VIEWS NAME FORM ITEM HTML ===");
  console.log(await formItem.evaluate((el) => el.outerHTML));

  const display = page.getByLabel("Display");
  console.log("\n=== DISPLAY SELECTS (" + (await display.count()) + ") ===");
  if (await display.count()) {
    console.log(await display.last().evaluate((el) => el.outerHTML));
  }
});
