import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import {
  addAccordionBlock,
  addAccordionItem,
  configureAccordionItem,
} from "../helpers/accordion.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

test.describe("Accordion Block", () => {
  test("Default", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page
        .getByRole("textbox", { name: "Page Title" })
        .fill("Accordion Test Page");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Accordion Section");
    });

    await test.step("Block 1 - Number Style", async () => {
      await addAccordionBlock(page);
      await addAccordionItem(page);
      await configureAccordionItem(page, {
        title: "Number Block Item eins",
        expanded: true,
        text: "First item with numeric style starting at 5",
      });
      await addAccordionItem(page);
      await configureAccordionItem(page, {
        title: "Number Block Item 2",
        expanded: false,
        text: "Second item with numeric style",
      });
      await page
        .locator('select[name*="field_mtpc_accordion_icon_style"]')
        .last()
        .selectOption("number");
      await page
        .locator('input[name*="field_mtpc_numeric_start"]')
        .last()
        .fill("9");
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Block 2 - Brands Icon", async () => {
      await addAccordionBlock(page);
      await addAccordionItem(page);
      await configureAccordionItem(page, {
        title: "Brands Icon Item",
        expanded: false,
        text: "Item with Font Awesome Brands icon",
      });
      await page
        .locator('select[name*="field_mtpc_accordion_icon_style"]')
        .last()
        .selectOption("icon");
      await page
        .locator('select[name*="field_mtpc_fa_acc_icon_style"]')
        .last()
        .selectOption({ label: "Font Awesome Brands" });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Block 3 - Pro Icon", async () => {
      await addAccordionBlock(page);
      await addAccordionItem(page);
      await configureAccordionItem(page, {
        title: "Pro Icon Item",
        expanded: true,
        text: "Item with Font Awesome Pro icon",
      });
      await page
        .locator('select[name*="field_mtpc_accordion_icon_style"]')
        .last()
        .selectOption("icon");
      await page
        .locator('select[name*="field_mtpc_fa_acc_icon_style"]')
        .last()
        .selectOption({ label: "Font Awesome Pro" });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Block 4 - Duotone Icon", async () => {
      await addAccordionBlock(page);
      await addAccordionItem(page);
      await configureAccordionItem(page, {
        title: "Duotone Icon Item",
        expanded: false,
        text: "Item with Font Awesome Duotone icon",
      });
      await page
        .locator('select[name*="field_mtpc_accordion_icon_style"]')
        .last()
        .selectOption("icon");
      await page
        .locator('select[name*="field_mtpc_fa_acc_icon_style"]')
        .last()
        .selectOption({ label: "Font Awesome Duotone" });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify Frontend", async () => {
      await expect(
        page.getByText("Number Block Item eins", { exact: true })
      ).toBeVisible();
      await expect(
        page.getByText("Number Block Item 2", { exact: true })
      ).toBeVisible();
      await expect(
        page.getByText("Brands Icon Item", { exact: true })
      ).toBeVisible();
      await expect(
        page.getByText("Pro Icon Item", { exact: true })
      ).toBeVisible();
      await expect(
        page.getByText("Duotone Icon Item", { exact: true })
      ).toBeVisible();
    });
  });
});
