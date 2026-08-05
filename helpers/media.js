/**
 * Select a media item in the media library by name or index.
 *
 * @param {import("@playwright/test").Page} page
 * @param {import("@playwright/test").Locator} itemLocator - locator for the media grid items
 * @param {string|number|undefined} media - filename/name to match (substring), numeric index, or undefined = first item
 */
export async function selectMediaItem(page, itemLocator, media) {
  let target;

  if (typeof media === "number") {
    target = itemLocator.nth(media);
  } else if (typeof media === "string" && media.trim() !== "") {
    const needle = media.trim().toLowerCase();
    const count = await itemLocator.count();
    target = null;
    for (let i = 0; i < count; i++) {
      const item = itemLocator.nth(i);
      const haystack = await itemText(item);
      if (haystack.toLowerCase().includes(needle)) {
        target = item;
        break;
      }
    }
    if (!target) {
      target = itemLocator.first();
    }
  } else {
    target = itemLocator.first();
  }

  await target.waitFor({ state: "visible", timeout: 20000 });
  await target.click({ force: true });
}

async function itemText(item) {
  const text = await item.textContent().catch(() => "");
  const alt = await item.locator("img").getAttribute("alt").catch(() => "");
  const title = await item.getAttribute("title").catch(() => "");
  const dataTitle = await item.getAttribute("data-title").catch(() => "");
  return [text, alt, title, dataTitle].join(" | ");
}
