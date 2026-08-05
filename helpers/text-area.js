export async function addTextAreaBlock(page, text) {
  // Column 1 block menu

  const columnMenu = page
    .locator('[id*="field-mod-1-col-container-add-more"]')
    .last();

  // Open add block menu

  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  // Add Text Area Block

  await columnMenu
    .getByRole("listitem")
    .filter({
      hasText: "Add Text Area Block",
    })
    .click();

  // Find the newest Text Area editor

  await page
    .getByRole("textbox", {
      name: "Rich Text Editor. Editing",
    })
    .last()
    .fill(text);
}
