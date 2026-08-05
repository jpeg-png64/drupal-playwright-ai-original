import { expect } from "@playwright/test";

export async function addIconTextHighlightBlock(page, options = {}) {
  const {
    highlightStyle = "two",

    highlightDisplay = "top",

    headingDisplay = "center",

    iconTextStyle = "row",

    tabletColumns = "original",

    icon = "fa-light fa-graduation-cap",

    text = "<h3>Playwright Highlight Test</h3><p>This is a highlight block test.</p>",
  } = options;

  // Find the current section column menu

  const columnMenu = page
    .locator(
      '[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]',
    )
    .last();

  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  await columnMenu
    .getByRole("button", {
      name: "Add Icon & Text Highlight Block",
    })
    .click();

  /*
        Dropdown settings
    */

  await page
    .locator('select[data-drupal-selector*="field-mtpc-highlight-style"]')
    .last()
    .selectOption(highlightStyle);

  await page
    .locator('select[data-drupal-selector*="field-mtpc-highlight-display"]')
    .last()
    .selectOption(highlightDisplay);

  await page
    .locator('select[data-drupal-selector*="field-mtpc-highlight-h-display"]')
    .last()
    .selectOption(headingDisplay);

  await page
    .locator('select[data-drupal-selector*="field-mtpc-icon-text-style"]')
    .last()
    .selectOption(iconTextStyle);

  await page
    .locator('select[data-drupal-selector*="field-mtpc-tablet-columns"]')
    .last()
    .selectOption(tabletColumns);

  /*
        Icon field
    */

  await page
    .locator('input[data-drupal-selector*="field-mtpc-highlight-icon"]')
    .last()
    .fill(icon);

  /*
        CKEditor text
    */

  const editor = page.locator(".ck-editor__editable").last();

  await expect(editor).toBeVisible({
    timeout: 10000,
  });

  await editor.click();

  await editor.fill(text);
}
