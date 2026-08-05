export async function addYoutubeBlock(page, width = "1280", height = "550") {
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
      name: "Add YouTube/Youku Block",
    })
    .click();

  const youtubeCode = page
    .locator('input[name*="field_youtube_embed_url"]')
    .last();

  await youtubeCode.waitFor({
    state: "visible",
    timeout: 15000,
  });

  await youtubeCode.fill("vBmU5v2EyxM");

  await page
    .locator('input[name*="field_mtpc_youtube_width"]')
    .last()
    .fill(width);

  await page
    .locator('input[name*="field_mtpc_youtube_height"]')
    .last()
    .fill(height);
}
