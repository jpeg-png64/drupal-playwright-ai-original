import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { fastCollapseCurrentBlock } from "../helpers/fast-collapse.js";

import { addPageTitleBlock } from "../helpers/page-title.js";
import { addTextAreaBlock } from "../helpers/text-area.js";
import { addIconTextHighlightBlock } from "../helpers/icon-text-highlight.js";
import { addNavigationMenuBlock } from "../helpers/navigation-menu.js";
import { addNextPreviousBlock } from "../helpers/next-previous.js";
import { addVideoBlock } from "../helpers/video.js";
import { addImageBlock } from "../helpers/image.js";
import { addYoutubeBlock } from "../helpers/youtube.js";
import { addThreeColCarouselBlock } from "../helpers/three-col-carousel.js";
import {
  addAccordionBlock,
  addAccordionItem,
  configureAccordionItem,
} from "../helpers/accordion.js";
import { addEventCarouselBlock } from "../helpers/event-carousel.js";
import { addImageGridBlock } from "../helpers/image-grid.js";
import { addSlideshowBlock } from "../helpers/slideshow.js";
import { addProfileListingBlock } from "../helpers/profile-listing.js";
import { addProfileDetailsBlock } from "../helpers/profile-details.js";
import { addViewsBlock } from "../helpers/views.js";

test.describe("All Blocks Combined", () => {
  test("All blocks on one page @combined @media-modal", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => {
      await login(page);
    });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page
        .getByRole("textbox", { name: "Page Title" })
        .fill("All Blocks Combined Test");
    });

    await test.step("Add 1-Column Section", async () => {
      await addOneColumnSection(page, "All Blocks Section");
    });

    await test.step("Add Page Title Block", async () => {
      await addPageTitleBlock(page, { title: "Custom Page Title", align: "center" });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Text Area Block", async () => {
      await addTextAreaBlock(page, "<h2>Text Area Block</h2><p>This is a text area block with rich content.</p>");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Icon & Text Highlight Block", async () => {
      await addIconTextHighlightBlock(page, {
        highlightStyle: "two", highlightDisplay: "top", headingDisplay: "center",
        iconTextStyle: "row", tabletColumns: "original",
        icon: "fa-light fa-graduation-cap",
        text: "<h3>Highlight Test</h3><p>Icon and text highlight block content.</p>",
      });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Navigation Menu Block", async () => {
      await addNavigationMenuBlock(page, "Top Links", "style1", "dropdown");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Next & Previous Block", async () => {
      await addNextPreviousBlock(page);
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Image Block", async () => {
      await addImageBlock(page, {
        captionBg: false, originalSize: false, align: "_none", target: "_self",
      });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Video Block", async () => {
      await addVideoBlock(page, {
        url: "https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D",
        width: 1280, height: 550, autoplay: false,
      });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add YouTube Block", async () => {
      await addYoutubeBlock(page, "1280", "550");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add 3-Column Carousel Block", async () => {
      await addThreeColCarouselBlock(page);
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Accordion Block", async () => {
      await addAccordionBlock(page);
      await addAccordionItem(page);
      await configureAccordionItem(page, { title: "Accordion Item 1", expanded: true, text: "First accordion item content" });
      await addAccordionItem(page);
      await configureAccordionItem(page, { title: "Accordion Item 2", expanded: false, text: "Second accordion item content" });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Event Carousel Block", async () => {
      await addEventCarouselBlock(page, { name: "Test Event", startDate: "2026-07-27", endDate: "2026-07-28" });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Image Grid Block", async () => {
      await addImageGridBlock(page, {
        layout: "small", hover: "_none", zoom: "disabled",
        borderWidth: "0", borderRadius: "0", captionBg: false,
        link: "https://www.youtube.com/watch?v=RwpiDqdugYY",
        target: "_self", caption: "Grid Caption",
      });
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Slideshow Block", async () => {
      await addSlideshowBlock(page);
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Profile Listing Block", async () => {
      await addProfileListingBlock(page, "one_col");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Profile Details Block", async () => {
      await addProfileDetailsBlock(page, "people-profile-picture.jpg");
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Add Views Block", async () => {
      await addViewsBlock(page, "Events", 1);
    });
    await test.step("Collapse Block", async () => { await fastCollapseCurrentBlock(page); });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForURL((url) => !url.pathname.includes("/node/add"), { timeout: 30000 });
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Custom Page Title").first()).toBeVisible({ timeout: 30000 });
      await expect(page.getByText("This is a text area block with rich content.")).toBeVisible();
      await expect(page.getByText("Highlight Test")).toBeVisible();
      await expect(page.getByText("Accordion Item 1")).toBeVisible();
      await expect(page.getByText("Accordion Item 2")).toBeVisible();
      await expect(page.getByText("Test Event")).toBeVisible();
      await expect(page.locator(".paragraph--type--mod-views-block").last()).toBeVisible();
    });
  });
});
