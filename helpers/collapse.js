export async function collapseCurrentBlock(page) {
  const collapse = page.locator("input.paragraphs-icon-button-collapse").last();

  await collapse.scrollIntoViewIfNeeded();

  await collapse.click();
  await page.waitForTimeout(4000);
}
