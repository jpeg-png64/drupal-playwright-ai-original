export async function addViewsBlock(page, viewName, displayIndex = 1) {
  const columnMenu = page
    .locator('[id*="field-mod-1-col-container-add-more"]')
    .last();

  await columnMenu
    .getByRole("button", { name: "List additional actions" })
    .click();

  await page.locator("li.add-more-button-mod-views-block input").click();
  await page.waitForTimeout(4000);

  const viewsInput = page.getByLabel("Views name");
  await viewsInput.waitFor({ state: "visible", timeout: 30000 });
  await viewsInput.fill(viewName);
  await page.waitForTimeout(2000);

  const suggestion = page.locator(".ui-autocomplete li.ui-menu-item").first();
  await suggestion.waitFor({ state: "visible", timeout: 10000 });
  await suggestion.click();
  await page.waitForTimeout(2000);

  const display = page.getByLabel("Display").last();
  await display.waitFor({ state: "visible", timeout: 10000 });

  const options = await display.locator("option").allTextContents();
  const optionValues = await display.locator("option").evaluateAll((els) =>
    els.map((el) => el.value)
  );
  let targetIndex = displayIndex;
  if (targetIndex >= options.length || optionValues[targetIndex] === "") {
    targetIndex = 0;
    while (targetIndex < options.length && optionValues[targetIndex] === "") {
      targetIndex++;
    }
  }
  if (targetIndex >= options.length) {
    throw new Error(`No selectable Display options for view "${viewName}"`);
  }
  await display.selectOption({ index: targetIndex });
}
