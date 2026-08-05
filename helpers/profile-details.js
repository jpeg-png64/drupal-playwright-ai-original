import { selectMediaItem } from "./media.js";

export async function addProfileDetailsBlock(page, media) {
  const columnMenu = page
    .locator('[id*="field-mod-1-col-container-add-more"]')
    .last();

  // Open block menu

  await columnMenu
    .getByRole("button", {
      name: "List additional actions",
    })
    .click();

  // Add Profile Details Block

  await columnMenu
    .getByRole("listitem")
    .filter({
      hasText: "Add Profile Details Block",
    })
    .click();

  // Profile Information

  await page
    .getByLabel("Profile Information")
    .locator("..")
    .getByRole("textbox")
    .fill("This is profile information created by Playwright.");

  // Picture info

  await page
    .getByLabel("Picture info")
    .locator("..")
    .getByRole("textbox")
    .fill("This is picture information created by Playwright.");

  // Profile Photo (media library)

  if (media !== undefined) {
    const mediaButton = page.getByRole("button", { name: "Add media" }).last();
    if (await mediaButton.count()) {
      await mediaButton.click();

      const modal = page.locator(".ui-dialog.media-library-widget-modal");
      await modal.waitFor({ state: "visible", timeout: 20000 });
      await page.waitForTimeout(1000);

      await selectMediaItem(
        page,
        modal.locator(".media-library-item"),
        media,
      );

      await page.waitForTimeout(500);

      await modal
        .getByRole("button", { name: "Insert selected" })
        .click();

      await modal.waitFor({ state: "hidden", timeout: 20000 });
    }
  }
}
