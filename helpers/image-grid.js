import { selectMediaItem } from "./media.js";

export async function addImageGridBlock(page, option) {
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
      name: "Add Image Grid Block",
    })
    .waitFor({ state: "visible", timeout: 5000 });

  await page
    .getByRole("button", {
      name: "Add Image Grid Block",
    })
    .click();

  await page.waitForTimeout(2500);

  await page
    .locator('select[name*="field_mod_grid_layout"]')
    .last()
    .selectOption(option.layout);

  await page
    .locator('select[name*="field_mtpc_image_grid_hover_eff"]')
    .last()
    .selectOption(option.hover);

  await page
    .locator('select[name*="field_mtpc_image_grid_zoom"]')
    .last()
    .selectOption(option.zoom);

  await page
    .locator('input[name*="field_mtpc_image_grid_brdr_width"]')
    .last()
    .fill(option.borderWidth);

  await page
    .locator('input[name*="field_mtpc_image_grid_brdr_radiu"]')
    .last()
    .fill(option.borderRadius);

  const captionCheckbox = page
    .locator('input[name*="field_mtpc_image_grid_caption_bg"]')
    .last();

  if (option.captionBg !== (await captionCheckbox.isChecked())) {
    option.captionBg
      ? await captionCheckbox.check()
      : await captionCheckbox.uncheck();
  }

  await addGridMedia(page, "field-mod-image-open-button", option.media);

  await addGridMedia(page, "field-mtpc-image-grid-overlay-open-button", option.mediaOverlay);

  const link = page
    .locator('input[name*="field_mtpc_mod_link"][name$="[uri]"]')
    .last();

  await link.fill(option.link);

  const target = page
    .locator('select[name*="field_mtpc_mod_link"][name*="target"]')
    .last();

  await target.selectOption(option.target);

  const caption = page
    .locator('textarea[name*="field_mod_image_caption"]')
    .last();

  await caption.fill(option.caption);

  // Color fields — hidden inputs inside Drupal color field widgets, set via JS.
  // Use the LAST matching input so color settings land on the correct block
  // when multiple blocks exist on the page (profile gotcha 6).

  const setColor = async (nameFragment, value) => {
    if (!value) return;
    await page.evaluate(({ fragment, val }) => {
      const els = document.querySelectorAll(`input[name*="${fragment}"]`);
      const el = els[els.length - 1];
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, { fragment: nameFragment, val: value });
  };

  await setColor("field_mtpc_image_grid_brdr_color", option.borderColor);
  await setColor("field_mtpc_image_grid_cap_bgcol", option.captionBgColor);
  await setColor("field_mtpc_image_grid_cap_txtcol", option.captionTextColor);
  await setColor("field_mtpc_image_grid_cap_txthov", option.captionTextHover);
}

async function addGridMedia(page, selector, media) {
  const button = page
    .locator(`input[data-drupal-selector*="${selector}"]`)
    .last();

  await button.waitFor({
    state: "visible",
    timeout: 10000,
  });

  await button.scrollIntoViewIfNeeded();

  await button.click({ force: true });

  await page.waitForTimeout(3000);

  const modal = page.locator(".ui-dialog.media-library-widget-modal");

  await modal.waitFor({
    state: "visible",
    timeout: 20000,
  });

  await page.waitForTimeout(500);

  await selectMediaItem(page, modal.locator(".media-library-item"), media);

  await modal
    .getByRole("button", {
      name: "Insert selected",
    })
    .click();

  await modal.waitFor({
    state: "hidden",
    timeout: 10000,
  });

  await page.waitForTimeout(500);
}
