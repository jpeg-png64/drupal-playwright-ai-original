import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addEventCarouselBlock } from "../helpers/event-carousel.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";

function fmtDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

test.describe("Events Carousel Block", () => {
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
        .fill("Event Carousel Test Page");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Event Carousel Section");
    });

    await test.step("Block 1 - One Day Event Today", async () => {
      await addEventCarouselBlock(page, {
        name: "One Day Event Today",
        startDate: fmtDate(0),
        endDate: fmtDate(0),
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Block 2 - One Week Event", async () => {
      await addEventCarouselBlock(page, {
        name: "One Week Event",
        startDate: fmtDate(0),
        endDate: fmtDate(7),
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Block 3 - Past Event", async () => {
      await addEventCarouselBlock(page, {
        name: "Past Event",
        startDate: fmtDate(-30),
        endDate: fmtDate(-29),
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Block 4 - Future Event", async () => {
      await addEventCarouselBlock(page, {
        name: "Future Event",
        startDate: fmtDate(30),
        endDate: fmtDate(34),
      });
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("One Day Event Today")).toBeVisible();
      await expect(page.getByText("One Week Event")).toBeVisible();
      await expect(page.getByText("Past Event")).toBeVisible();
      await expect(page.getByText("Future Event")).toBeVisible();
    });
  });

  test("All configurable fields", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page
        .getByRole("textbox", { name: "Page Title" })
        .fill("Event Carousel All Fields");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "Advanced Section");
    });

    await test.step("Add Block 1 - ongoing enabled + active unchecked", async () => {
      await addEventCarouselBlock(page, {
        name: "Inactive Event",
        startDate: fmtDate(0),
        endDate: fmtDate(0),
        ongoingLabel: "Happening Now",
        activeEvent: false,
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Add Block 2 - ongoing enabled + active default", async () => {
      await addEventCarouselBlock(page, {
        name: "Active Event",
        startDate: fmtDate(0),
        endDate: fmtDate(7),
        ongoingLabel: "In Progress",
      });
    });

    await test.step("Collapse Block", async () => {
      await collapseCurrentBlock(page);
    });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 });
      await page.waitForLoadState("load");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Active Event").first()).toBeVisible();
    });
  });
});
