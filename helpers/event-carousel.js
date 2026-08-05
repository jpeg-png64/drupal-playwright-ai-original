export async function addEventCarouselBlock(page, config) {
  const columnMenu = page
    .locator(
      '[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]',
    )
    .last();

  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  await columnMenu
    .getByRole("button", {
      name: "Add Events Carousel Block",
    })
    .click();

  await page.waitForTimeout(6000);

  // Animation

  const animation = page
    .locator('input[data-drupal-selector*="field-mtpc-animation-active"]')
    .last();

  if (await animation.count()) {
    await animation.check();
  }

  // Auto carousel

  const autoCarousel = page
    .locator('input[data-drupal-selector*="field-mtpc-events-carousel-auto"]')
    .last();

  if (await autoCarousel.count()) {
    await autoCarousel.check();
  }

  // Show ongoing checkbox

  const showOngoing = page
    .locator('input[name*="field_mtpc_evt_carousel_ongoing"]')
    .last();

  if (await showOngoing.count()) {
    await showOngoing.check();
  }

  // Ongoing label

  const ongoingLabel = config.ongoingLabel || "Ongoing Event";
  await page
    .locator('input[data-drupal-selector*="field-mtpc-events-carousel-going"]')
    .last()
    .fill(ongoingLabel);

  // Character limit

  await page
    .locator('input[data-drupal-selector*="field-mtpc-carousel-limit-chars"]')
    .last()
    .fill("200");

  // Event link

  await page
    .locator('input[data-drupal-selector*="field-mtpc-event-carousel-link"]')
    .last()
    .fill("https://www.youtube.com/watch?v=Mzw2ttJD2qQ");

  // Start date

  await page
    .locator('input[data-drupal-selector*="field-mtpc-event-carousel-start"]')
    .last()
    .fill(config.startDate);

  // End date

  await page
    .locator('input[data-drupal-selector*="field-mtpc-event-carousel-end"]')
    .last()
    .fill(config.endDate);

  // Active event checkbox

  if (config.activeEvent === false) {
    const activeCheckbox = page
      .locator('input[name*="field_mtpc_carousel_active_event"]')
      .last();
    if (await activeCheckbox.count()) {
      await activeCheckbox.uncheck();
    }
  }

  // Description

  await page
    .getByRole("textbox", {
      name: /Rich Text Editor/i,
    })
    .last()
    .fill(
      `<h2>${config.name}</h2>
        <p>
        Playwright event carousel testing.
        </p>`,
    );
}
