import { selectMediaItem } from "./media.js";

export async function addImageBlock(page, config) {
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
      name: "Add Image Block",
    })
    .click();

  await page.waitForTimeout(3000);

  const mediaButton = page
    .getByRole("button", {
      name: "Add media",
    })
    .last();

  if (await mediaButton.count()) {
    await mediaButton.click();

    const modal = page.locator(".ui-dialog.media-library-widget-modal");

    await modal.waitFor({
      state: "visible",
      timeout: 20000,
    });

    await page.waitForTimeout(1000);

    await selectMediaItem(page, modal.locator(".media-library-item"), config.media);

    await page.waitForTimeout(500);

    await modal
      .getByRole("button", {
        name: "Insert selected",
      })
      .click();

    await modal.waitFor({
      state: "hidden",
      timeout: 20000,
    });

    await page.waitForTimeout(1000);
  }

  const caption = page
    .locator('textarea[name*="field_mod_image_caption"]')
    .last();

  if (await caption.count()) {
    await caption.fill("Playwright Image Caption");
  }

  const captionBg = page
    .locator('input[name*="field_mtpc_image_caption_bg"]')
    .last();

  if (config.captionBg && (await captionBg.count())) {
    await captionBg.check();
  }

  const originalSize = page
    .locator('input[name*="field_mtpc_image_original_size"]')
    .last();

  if (config.originalSize && (await originalSize.count())) {
    await originalSize.check();
  }

  const alignment = page
    .locator('select[name*="field_mtpc_image_align_position"]')
    .last();

  if (await alignment.count()) {
    await alignment.selectOption(config.align);
  }

  const link = page
    .locator('input[name*="field_mtpc_mod_link"][name$="[uri]"]')
    .last();

  if (await link.count()) {
    await link.fill("https://www.youtube.com/watch?v=_oDneimJOCI");
  }

  const target = page
    .locator('select[name*="field_mtpc_mod_link"][name*="target"]')
    .last();

  if (await target.count()) {
    await target.selectOption(config.target);
  }
}
