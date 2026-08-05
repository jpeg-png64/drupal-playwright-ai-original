import { selectMediaItem } from "./media.js";

export async function addThreeColCarouselBlock(page, options = {}) {
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
      name: "Add 3-Column Carousel Block",
    })
    .click();

  await page.waitForTimeout(2500);

  const css = page
    .getByRole("textbox", {
      name: "Additional CSS classes apply to 3-column carousel block",
    })
    .last();

  if (await css.count()) {
    await css.fill("test-carousel");
  }

  const heading = page
    .getByRole("textbox", {
      name: "Rich Text Editor. Editing",
    })
    .first();

  if (await heading.count()) {
    await heading.fill("Carousel Highlight Title");
  }

  for (let i = 0; i < 3; i++) {
    if (i > 0) {
      await page
        .getByRole("button", {
          name: "Add 3-Col Carousel Item",
        })
        .last()
        .scrollIntoViewIfNeeded();

      await page.waitForTimeout(500);

      await page
        .getByRole("button", {
          name: "Add 3-Col Carousel Item",
        })
        .last()
        .click();

      await page.waitForTimeout(2500);
    }

    await addCarouselItem(page, i, options);
  }
}

async function addCarouselItem(page, index, options) {
  const item = page
    .locator(
      `[data-drupal-selector$="field-mtpc-3col-carousel-item-${index}-subform"]`,
    )
    .last();

  await item.waitFor({
    state: "visible",
    timeout: 15000,
  });

  const active = item.getByRole("checkbox", {
    name: "Active",
  });

  if ((await active.count()) && !(await active.isChecked())) {
    await active.check();
  }

  const addMedia = item.getByRole("button", {
    name: "Add media",
  });

  if (await addMedia.count()) {
    await addMedia.click();

    const modal = page.locator(".ui-dialog.media-library-widget-modal");

    await modal.waitFor({
      state: "visible",
      timeout: 5000,
    });

    await page.waitForTimeout(1500);

    await selectMediaItem(
      page,
      modal.locator(".media-library-item"),
      options.media?.[index],
    );

    await page.waitForTimeout(500);

    await page
      .getByRole("button", {
        name: "Insert selected",
      })
      .click();

    await modal.waitFor({
      state: "hidden",
      timeout: 5000,
    });

    await page.waitForTimeout(1000);
  }

  const caption = item.getByRole("textbox", {
    name: "Image Caption",
  });

  if (await caption.count()) {
    await caption.fill(`Caption ${index}`);
  }

  const title = item.getByRole("textbox", {
    name: "Title",
  });

  if (await title.count()) {
    await title.fill(`Carousel Title ${index}`);
  }

  const link = item.getByRole("textbox", {
    name: "Link",
  });

  if (await link.count()) {
    await link.fill("https://www.youtube.com/watch?v=RwpiDqdugYY");
  }

  const description = item
    .getByRole("textbox", {
      name: /Rich Text Editor/,
    })
    .last();

  if (await description.count()) {
    await description.fill(`Description for carousel item ${index}`);
  }
}
