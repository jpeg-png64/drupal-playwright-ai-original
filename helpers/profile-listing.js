export async function addProfileListingBlock(page, layout = "one_col") {
  const columnMenu = page
    .locator('[id*="field-mod-1-col-container-add-more"]')
    .last();

  // Open Add Block menu
  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  // Add Profile Listing Block
  await columnMenu
    .getByRole("listitem")
    .filter({
      hasText: "Add Profile Listing Block",
    })
    .click();

  // List Title
  await page
    .getByRole("textbox", { name: "List Title" })
    .last()
    .fill("Playwright Profile Listing");

  // Profile Link
  await page
    .getByRole("textbox", { name: "Profile Link" })
    .last()
    .fill("<front>");

  // New tab
  await page
    .getByRole("checkbox", { name: "Open Link in a new tab" })
    .last()
    .check();

  // English Name
  await page.getByRole("textbox", { name: "English Name" }).last().fill("Aea");

  // Chinese Name
  await page.getByRole("textbox", { name: "Chinese Name" }).last().fill("艾雅");

  // Profile Details
  await page
    .getByRole("textbox", {
      name: "Rich Text Editor. Editing",
    })
    .last()
    .fill("This profile was created by Playwright.");

  // Layout
  await page
    .locator('select[name*="field_mtpc_pl_list_style"]')
    .last()
    .selectOption(layout);
}
