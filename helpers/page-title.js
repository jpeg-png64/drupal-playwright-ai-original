export async function addPageTitleBlock(page, options = {}) {
  const columnMenu = page.locator(
    '[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container-add-more"]',
  );

  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  await columnMenu
    .getByRole("button", {
      name: "Add Page Title Block",
    })
    .click();

  if (options.title) {
    await page
      .getByRole("textbox", {
        name: "Override Page Title",
      })
      .fill(options.title);
  }

  if (options.align) {
    await page.getByLabel("Alignment").selectOption(options.align);
  }

  if (options.position) {
    await page.locator('select[name*="field_mtpc_pagetitle_position"]').last().selectOption(options.position);
  }

  if (options.desktopHeight) {
    await page.locator('input[name*="field_mtpc_pagetitle_height_desk"]').last().fill(String(options.desktopHeight));
  }

  if (options.tabletHeight) {
    await page.locator('input[name*="field_mtpc_pagetitle_height_tab"]').last().fill(String(options.tabletHeight));
  }

  if (options.mobileHeight) {
    await page.locator('input[name*="field_mtpc_pagetitle_height_mob"]').last().fill(String(options.mobileHeight));
  }

  if (options.showBreadcrumbs) {
    await page.getByLabel("Show Breadcrumbs").check();
  }

  if (options.overrideBreadcrumbs) {
    await page.getByLabel("Override Breadcrumbs").check();
  }

  if (options.breadcrumbUrl) {
    await page.locator('input[name*="field_mtpc_pagetitle_bc_item"][name$="[uri]"]').fill(options.breadcrumbUrl);
    await page.waitForTimeout(2000);
    const suggestion = page.locator(".ui-autocomplete:visible li").first();
    if (await suggestion.count()) {
      await suggestion.click();
    }
  }

  if (options.breadcrumbText) {
    await page.locator('input[name*="field_mtpc_pagetitle_bc_item"][name$="[title]"]').fill(options.breadcrumbText);
  }
}
