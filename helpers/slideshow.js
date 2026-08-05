import { addSlideshowItem } from "./slideshow-item.js";

export async function addSlideshowBlock(page, options = {}) {
  const columnMenu = page.locator(
    '[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container-add-more"]',
  ).last();

  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  await columnMenu
    .getByRole("button", {
      name: "Add Slideshow Block",
    })
    .click();

  // Block-level checkboxes

  if (options.autoplay) {
    await page.getByLabel("Autoplay").check();
  }
  if (options.infinite) {
    await page.getByLabel("Infinite Loop").check();
  }
  if (options.fade) {
    await page.getByLabel("Fade Effect").check();
  }
  if (options.arrows) {
    await page.getByLabel("Show navigation arrows").check();
  }
  if (options.adaptiveHeight) {
    await page.getByLabel("Adaptive Height").check();
  }

  // Block-level selects / inputs

  const nav = options.navigationBullets || "square";
  await page.getByLabel("Navigation Bullets").selectOption(nav);

  const slideDur = options.slideDuration || "5000";
  await page
    .getByRole("spinbutton", {
      name: "Slide Duration",
    })
    .fill(slideDur);

  const transDur = options.transitionDuration || "500";
  await page
    .getByRole("spinbutton", {
      name: "Transition duration",
    })
    .fill(transDur);

  // Block CSS classes

  if (options.cssClasses) {
    await page
      .locator('textarea[name*="field_mod_css_classes"]')
      .last()
      .fill(options.cssClasses);
  }

  // Create slides

  const slideCount = options.slideCount || 2;
  for (let i = 0; i < slideCount; i++) {
    if (i > 0) {
        await page
          .getByRole("button", {
            name: "Add Slideshow Item",
          })
          .last()
          .click();
    }
    const itemOptions = (options.items && options.items[i]) || {};
    const mediaChoice = options.media?.[i] ?? i;
    await addSlideshowItem(page, i, mediaChoice, itemOptions);
  }
}
