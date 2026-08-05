import { selectMediaItem } from "./media.js";

export async function addSlideshowItem(page, index, mediaChoice, options = {}) {
  let item = page.locator(
    `div.paragraphs-subform[data-drupal-selector*="field-mod-slideshow-item-${index}-subform"]`,
  );

  await item.waitFor({
    timeout: 7500,
  });

  if (options.slideType === "video") {
    await item.getByLabel("Slide Type").selectOption("video");
    if (options.videoFile) {
      await page.locator('input[type="file"][name*="field_mod_slide_video"]').last().setInputFiles(options.videoFile);
    }
  } else {
    await item.getByLabel("Slide Type").selectOption("image");

    await item
      .getByRole("button", {
        name: "Add media",
      })
      .click();

    await selectMediaItem(page, page.locator(".js-media-library-item"), mediaChoice);

    await page
      .getByRole("button", {
        name: "Insert selected",
      })
      .click();

    // Drupal AJAX rebuild

    await page.waitForTimeout(3000);

    item = page.locator(
      `div.paragraphs-subform[data-drupal-selector*="field-mod-slideshow-item-${index}-subform"]`,
    );

    await item.waitFor();
  }

  const line1text = options.line1Text || `Slide ${index + 1} title`;
  const line2text = options.line2Text || `Slide ${index + 1} description`;

  await item
    .getByRole("textbox", {
      name: "Slide Text Line 1",
    })
    .fill(line1text);

  await item
    .getByRole("textbox", {
      name: "Slide Text Line 2",
    })
    .fill(line2text);

  const textPos = options.textPosition || "middle";
  await item.getByLabel("Text Position").selectOption(textPos);

  const textAlign = options.textAlignment || "center";
  await item.getByLabel("Text Alignment").selectOption(textAlign);

  // Slide link + target

  if (options.link) {
    await item.getByRole("textbox", { name: "Slide Link" }).fill(options.link);
  }
  if (options.target) {
    await item.getByLabel("Select a target").selectOption(options.target);
  }

  // Line 1 styling

  if (options.line1Size) {
    await item
      .getByRole("spinbutton", { name: "Size (em)" })
      .first()
      .fill(options.line1Size);
  }
  if (options.line1Radius) {
    await item
      .getByRole("spinbutton", { name: "Radius (px)" })
      .first()
      .fill(options.line1Radius);
  }
  if (options.line1Color) {
    await page.evaluate(function(val) {
      var el = document.querySelector('input[name*="_1_color"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.line1Color);
  }
  if (options.line1Bg) {
    await page.evaluate(function(val) {
      var el = document.querySelector('input[name*="_1_bg"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.line1Bg);
  }

  // Line 2 styling

  if (options.line2Size) {
    await item
      .getByRole("spinbutton", { name: "Size (em)" })
      .last()
      .fill(options.line2Size);
  }
  if (options.line2Radius) {
    await item
      .getByRole("spinbutton", { name: "Radius (px)" })
      .last()
      .fill(options.line2Radius);
  }
  if (options.line2Color) {
    await page.evaluate(function(val) {
      var el = document.querySelector('input[name*="_2_color"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.line2Color);
  }
  if (options.line2Bg) {
    await page.evaluate(function(val) {
      var el = document.querySelector('input[name*="_2_bg"]');
      if (el) { el.value = val; el.dispatchEvent(new Event("change", { bubbles: true })); }
    }, options.line2Bg);
  }
}
