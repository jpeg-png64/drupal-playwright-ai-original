export async function addAccordionBlock(page) {
  const columnMenu = page
    .locator(
      '[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]',
    )
    .last();

  await columnMenu.scrollIntoViewIfNeeded();

  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  await page.waitForTimeout(500);

  await page
    .getByRole("button", {
      name: "Add Accordion Block",
    })
    .click();

  await page.waitForTimeout(4000);
}

export async function addAccordionItem(page) {
  await page
    .getByRole("button", {
      name: "Add Accordion Item",
    })
    .last()
    .click();

  await page.waitForTimeout(2000);
}

export async function configureAccordionItem(page, config) {
  const title = page
    .locator('textarea[name*="field_mtpc_accordion_title"]')
    .last();

  await title.fill(config.title);

  const expanded = page
    .locator('input[name*="field_mtpc_accordion_expended"]')
    .last();

  if (config.expanded !== (await expanded.isChecked())) {
    config.expanded ? await expanded.check() : await expanded.uncheck();
  }

  await page
    .getByRole("textbox", {
      name: "Rich Text Editor. Editing",
    })
    .last()
    .fill(config.text);
}
