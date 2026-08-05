export async function fastCollapseCurrentBlock(page) {
  const collapse = page.locator("input.paragraphs-icon-button-collapse").last();

  await collapse.scrollIntoViewIfNeeded();

  await collapse.click();
  await page.waitForTimeout(1500);
}
