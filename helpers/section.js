export async function addOneColumnSection(page, sectionName) {
  // Add section

  await page
    .getByRole("button", {
      name: "Add 1-Column Section",
    })
    .click();

  // Fill the newest section's name

  await page
    .getByRole("textbox", {
      name: "Section Name",
    })
    .last()
    .fill(sectionName);
}
