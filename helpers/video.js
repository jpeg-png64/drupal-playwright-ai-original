export async function addVideoBlock(page, config) {
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
      name: "Add Video Block",
    })
    .click();

  await page.waitForTimeout(5000);

  const autoplay = page
    .locator('input[name*="field_mtpc_youtube_autoplay"]')
    .last();

  if (config.autoplay && (await autoplay.count())) {
    await autoplay.check();
  }

  const videoType = page
    .locator('select[name*="field_video_block_type"]')
    .last();

  await videoType.selectOption("hkust_video");

  // Wait for video type AJAX update
  await page.waitForTimeout(1500);

  await page
    .locator('input[name*="field_hkust_video_embed_url"]')
    .last()
    .fill(config.url);

  await page
    .locator('input[name*="field_mtpc_youtube_width"]')
    .last()
    .fill(String(config.width));

  await page
    .locator('input[name*="field_mtpc_youtube_height"]')
    .last()
    .fill(String(config.height));
}
