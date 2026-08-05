export async function addNavigationMenuBlock(
  page,
  menuName,
  desktopStyle,
  mobileStyle,
) {
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

  await page
    .getByRole("button", {
      name: "Add Navigation Menu Block",
    })
    .click();

  const menu = page
    .getByRole("textbox", {
      name: "Navigation Menu",
      exact: true,
    })
    .last();

  await menu.waitFor({
    state: "visible",
    timeout: 30000,
  });

  await menu.fill(menuName);

  await page.waitForTimeout(2000);

  const suggestion = page.locator(".ui-autocomplete li.ui-menu-item").first();

  await suggestion.waitFor({
    state: "visible",
    timeout: 10000,
  });

  await suggestion.click();

  await page.getByLabel("Desktop Style").last().selectOption(desktopStyle);

  await page.getByLabel("Mobile Style").last().selectOption(mobileStyle);
}
