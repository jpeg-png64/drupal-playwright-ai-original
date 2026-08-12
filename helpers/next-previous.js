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
  await nextLink.fill(options.nextSearch || "Test Page");
  await page.waitForTimeout(2000);
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
  await previousLink.fill(options.prevSearch || "Test 2");
  await page.waitForTimeout(2000);
  await page.locator(".ui-autocomplete:visible li").first().click();

  const prevLabel = options.prevTitle || "<";
  await page
    .locator(
      'input[data-drupal-selector*="field-mtpc-previous-link"][data-drupal-selector$="title"]',
    )
    .fill(prevLabel);

  // Color fields — hidden inputs inside Drupal color field widgets, set via JS.
  // Use the LAST matching input so colors land on the correct block (profile gotcha 5).

  const setColor = async (nameFragment, value) => {
    if (!value) return;
    await page.evaluate(({ fragment, val }) => {
      const els = document.querySelectorAll(`input[name*="${fragment}"]`);
      const el = els[els.length - 1];
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, { fragment: nameFragment, val: value });
  };

  await setColor("field_mtpc_next_previous_bg", options.bgColor);
  await setColor("field_mtpc_next_previous_color", options.linkColor);
  await setColor("field_mtpc_next_previous_border", options.borderColor);
  await setColor("field_mtpc_next_prev_bg_hvr", options.bgHoverColor);
  await setColor("field_mtpc_next_prev_clr_hvr", options.linkHoverColor);
  await setColor("field_mtpc_next_prev_brdr_hvr", options.borderHoverColor);
}
