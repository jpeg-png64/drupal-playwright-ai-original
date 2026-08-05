// helpers/next-previous.js

export async function addNextPreviousBlock(page, options = {}) {
  const columnMenu = page.locator(
    '[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container-add-more"]',
  );

  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  await page.locator('input[value*="Next"][value*="Previous"]').click();

  const nextLink = page.locator(
    'input[data-drupal-selector*="field-mtpc-next-link"][data-drupal-selector$="uri"]',
  );

  await nextLink.click();
  await nextLink.fill("Test Page");
  await page.locator(".ui-autocomplete:visible li").first().click();

  const nextLabel = options.nextTitle || ">";
  await page
    .locator(
      'input[data-drupal-selector*="field-mtpc-next-link"][data-drupal-selector$="title"]',
    )
    .fill(nextLabel);

  const previousLink = page.locator(
    'input[data-drupal-selector*="field-mtpc-previous-link"][data-drupal-selector$="uri"]',
  );

  await previousLink.click();
  await previousLink.fill("Test 2");
  await page.locator(".ui-autocomplete:visible li").first().click();

  const prevLabel = options.prevTitle || "<";
  await page
    .locator(
      'input[data-drupal-selector*="field-mtpc-previous-link"][data-drupal-selector$="title"]',
    )
    .fill(prevLabel);

  // Color fields — hidden inputs inside Drupal color field widgets, set via JS

  if (options.bgColor) {
    await page.evaluate((val) => {
      const el = document.querySelector('input[name*="field_mtpc_next_previous_bg"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.bgColor);
  }
  if (options.linkColor) {
    await page.evaluate((val) => {
      const el = document.querySelector('input[name*="field_mtpc_next_previous_color"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.linkColor);
  }
  if (options.borderColor) {
    await page.evaluate((val) => {
      const el = document.querySelector('input[name*="field_mtpc_next_previous_border"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.borderColor);
  }
  if (options.bgHoverColor) {
    await page.evaluate((val) => {
      const el = document.querySelector('input[name*="field_mtpc_next_prev_bg_hvr"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.bgHoverColor);
  }
  if (options.linkHoverColor) {
    await page.evaluate((val) => {
      const el = document.querySelector('input[name*="field_mtpc_next_prev_clr_hvr"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.linkHoverColor);
  }
  if (options.borderHoverColor) {
    await page.evaluate((val) => {
      const el = document.querySelector('input[name*="field_mtpc_next_prev_brdr_hvr"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.borderHoverColor);
  }
}
