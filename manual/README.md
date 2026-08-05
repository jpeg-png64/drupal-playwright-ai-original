# Drupal Playwright Automation

Playwright E2E tests for 15 Drupal custom blocks (32 tests across 19 spec files). Generated and maintained with AI assistance.

## TL;DR

```bash
# Everything, one command (~20 min, sequential)
PATH="/usr/local/bin:$PATH" npx playwright test

# The ONLY thing you tag: heavy tests get @media-modal / @combined
test("All configurable fields @media-modal", ...); // runs solo (1 worker)
test("Many blocks @combined", ...);                 // runs last (1 worker)
test("Default", ...);                               // runs parallel (2 workers)
```

## Requirements

- Node.js 18+
- Docker (for Drupal at `../Docker/mtpc_template`)
- `drush` available inside the Drupal container

```bash
npm install
npx playwright install
```

## Quick Start

Tests are routed by tags via three projects in `playwright.config.js`, chained with `dependencies` so they run **sequentially** (parallel → solo → combined):

- No tag → **parallel** project (2 workers, runs first)
- `@media-modal` only → **solo** project (1 worker, fully isolated)
- `@combined` → **combined** project (1 worker, runs last)

```bash
# Full suite (parallel → solo → combined, sequential)
PATH="/usr/local/bin:$PATH" npx playwright test

# Standard tests only (2 workers)
PATH="/usr/local/bin:$PATH" npx playwright test --project=parallel

# Media-modal tests only (1 worker, fully isolated)
PATH="/usr/local/bin:$PATH" npx playwright test --project=solo

# Combined multi-block tests only (1 worker, runs last)
PATH="/usr/local/bin:$PATH" npx playwright test --project=combined

# Run a single block test
PATH="/usr/local/bin:$PATH" npx playwright test tests/accordion.spec.js

# Or via npm scripts (no PATH prefix needed)
npm run test:spec --spec=accordion
npm run test:name --name="All blocks on one page"
```

> Full procedures: see `USAGE.md`.

> **Note:** Node is at `/usr/local/bin/node`. Always prefix with `PATH="/usr/local/bin:$PATH"`.

## Running via an AI Agent

Working with an AI agent (e.g. opencode)? Just ask it to run a test — e.g. "test the accordion block". The agent will:

1. Read `docs/block-profiles/<block>.md` and `docs/test-inputs/<block>.md` — the **highest authority** (never skipped unless you explicitly bypass it).
2. Fix the spec first if it contradicts either doc (test-inputs wins for input values; profile wins for selectors/behavior).
3. Run the test with the correct `PATH` prefix — you don't need to give it the command.

You can also update `docs/test-inputs/<block>.md` yourself and ask the agent to "apply the inputs to the test".

## Project Structure

```
.
├── docs/                    Block documentation (source of truth)
│   ├── *.md                 One doc per block
│   ├── block-profiles/      Quick-reference profiles per block
│   ├── test-inputs/         Exact input values per test
│   └── explore-new-site.md  Universal exploration workflow for new Drupal sites
├── helpers/                 Shared Playwright helper functions
│   ├── <block>.js           One helper per block
│   ├── collapse.js          Collapse block (4s wait)
│   ├── fast-collapse.js     Collapse block (1.5s wait)
│   ├── login.js             Login via drush uli
│   ├── section.js           Add 1-col / 2-col sections
│   └── ...
├── tests/                   Playwright spec files
│   ├── <block>.spec.js      One spec per block (23 tests)
│   ├── zz-all-blocks.spec.js All 15 blocks on one page (@combined, runs last)
│   ├── stress-block-variety.spec.js  Many block types (@combined)
│   ├── stress-content-volume.spec.js Large text and complex content (@combined)
│   └── stress-size-extremes.spec.js  Boundary dimensions (@combined)
├── manual/                   Human-facing docs (README, USAGE, TEST-REPORT)
├── playwright.config.js
├── package.json
└── AGENTS.md                AI agent instructions
```

## Drupal Site

| Property | Value |
|----------|-------|
| URL | `http://localhost:8325` |
| Content type | `/node/add/custom_page/mtpc` |
| Login | `login(page)` helper (uses `drush uli`) |
| Title field | `getByRole("textbox", { name: "Page Title" })` |
| Publish button | `getByRole("button", { name: "Publish Page" })` |

## Test Structure

Every test follows the same flow:

```
1. login(page)
2. goto /node/add/custom_page/mtpc
3. Fill page title
4. addOneColumnSection(page, "Section Name")
5. Add block(s) + collapseCurrentBlock(page) after each
6. Click "Publish Page" + wait for URL to leave `/node/add` + waitForLoadState("load")
7. Assert content visible on frontend
```

## Individual Block Tests

Each test creates one Drupal page with one or more blocks of its type. Total: **23 tests, 15 spec files**.

| Block | Spec | Tests | Tags | ~Runtime |
|-------|------|-------|------|----------|
| Accordion | `accordion.spec.js` | 1 | — | 78s |
| Event Carousel | `event-carousel.spec.js` | 2 | Default, All configurable fields | 90s |
| Icon & Text Highlight | `icon-text-highlight.spec.js` | 1 | — | 40s |
| Image | `image.spec.js` | 2 | Default, With Animation | 54s |
| Image Grid | `image-grid.spec.js` | 8 | 6 layout/hover combos + Zoom + All configurable fields @media-modal | 180s |
| Navigation Menu | `navigation-menu.spec.js` | 1 | — | 24s |
| Next / Previous | `next-previous.spec.js` | 2 | Default, All configurable fields | 40s |
| Page Title | `page-title.spec.js` | 2 | Default, All configurable fields | 40s |
| Profile Details | `profile-details.spec.js` | 1 | — | 22s |
| Profile Listing | `profile-listing.spec.js` | 1 | Both layouts on one page | 32s |
| Slideshow | `slideshow.spec.js` | 2 | Default, All configurable fields @media-modal | 60s |
| Text Area | `text-area.spec.js` | 1 | — | 23s |
| Three Column Carousel | `three-col-carousel.spec.js` | 1 | @media-modal | 44s |
| Video | `video.spec.js` | 2 | Default, Autoplay | 54s |
| YouTube | `youtube.spec.js` | 1 | — | 22s |

## Combined Tests

Four tests that exercise multiple blocks on a single page. Total: **4 tests, 4 spec files**.

| Test | Spec | Description | Tags | ~Runtime |
|------|------|-------------|------|----------|
| All blocks on one page | `zz-all-blocks.spec.js` | All 15 blocks on one page | @combined @media-modal | 114s |
| Many block types | `stress-block-variety.spec.js` | 18 blocks of mixed types | @combined | 120s |
| Large text and content | `stress-content-volume.spec.js` | Large text and complex content | @combined | 120s |
| Boundary dimensions | `stress-size-extremes.spec.js` | Boundary dimensions and limits | @combined | 120s |

**Total: 32 tests, 19 spec files, 32 Drupal pages created.**

## Helper Signatures

### Simple helpers

| Helper | Signature | Notes |
|--------|-----------|-------|
| `addAccordionBlock(page)` | No config | Opens CKEditor per item |
| `addNextPreviousBlock(page, options?)` | `options = { bgColor?, linkColor?, borderColor?, bgHoverColor?, linkHoverColor?, borderHoverColor? }` | Colors as hex via evaluate |
| `addSlideshowBlock(page, options?)` | `options = { autoplay?, infinite?, fade?, arrows?, adaptiveHeight?, cssClasses?, slideCount?, items?, media? }` — `media` = array of names/indexes per slide | Items default to 2 slides |
| `addThreeColCarouselBlock(page, options?)` | `options = { media? }` — array of names/indexes per item | Creates 3 items with media |
| `addPageTitleBlock(page, options?)` | `options = { title?, align?, position?, desktopHeight?, tabletHeight?, mobileHeight?, showBreadcrumbs?, overrideBreadcrumbs?, breadcrumbUrl?, breadcrumbText? }` | |
| `addYoutubeBlock(page, width, height)` | Strings | Fills video ID directly |
| `addProfileDetailsBlock(page)` | No params | |
| `addProfileListingBlock(page, layout?)` | `"one_col"` (default) or `"two_col"` | |

### Helpers requiring config

| Helper | Config |
|--------|--------|
| `addImageBlock(page, config)` | `{ captionBg, originalSize, align, target }` — all required; `media?` = name/index (default first item) |
| `addVideoBlock(page, config)` | `{ url, width, height }` — `autoplay` optional (default `false`) |
| `addImageGridBlock(page, option)` | `{ layout, hover, zoom, borderWidth, borderRadius, captionBg, link, target, caption, borderColor?, captionBgColor?, overlayBg?, overlayBgHover? }` — `media?` (main) and `mediaOverlay?` (overlay), default first item |
| `addEventCarouselBlock(page, config)` | `{ name, startDate, endDate, ongoingLabel?, activeEvent? }` — dates as `YYYY-MM-DD` |
| `addIconTextHighlightBlock(page, options?)` | `{ highlightStyle, highlightDisplay, headingDisplay, iconTextStyle, tabletColumns, icon, text }` |
| `addNavigationMenuBlock(page, menuName, desktopStyle, mobileStyle)` | Menu must exist in Drupal |

### Utility helpers

| Helper | Notes |
|--------|-------|
| `login(page)` | Generates one-time login link via `drush uli` |
| `addOneColumnSection(page, title?)` | Must call before adding blocks |
| `collapseCurrentBlock(page)` | 4s wait after collapsing |
| `fastCollapseCurrentBlock(page)` | 1.5s wait — used in combined tests |

## Valid Option Values

| Block | Field | Values |
|-------|-------|--------|
| Accordion | icon_style | `number`, `icon` |
| Image Grid | layout | `small` (Four Images), `large` (Three Images) |
| Image Grid | hover | `_none`, `fade`, `slide` |
| Image Grid | zoom | `_none`, `enabled`, `disabled` |
| Image | align | `_none`, `left`, `right`, `center` |
| Image | target | `_self`, `_blank`, `_parent`, `_top` |
| Icon Text Highlight | highlightStyle | `two`, `three`, `four` |
| Icon Text Highlight | highlightDisplay | `top`, `middle` |
| Icon Text Highlight | headingDisplay | `left`, `center` |
| Icon Text Highlight | iconTextStyle | `row`, `column` |
| Navigation Menu | desktopStyle | `style1`, `style2`, `style3` |
| Navigation Menu | mobileStyle | `dropdown`, `scroll` |
| Profile Listing | layout | `one_col`, `two_col` |
| Page Title | align | `_none`, `left`, `center`, `right` |
| Video | video_type | `upload`, `hkust_video` |

### Animation fields (image, profile-details, and others)

| Field | Values |
|-------|--------|
| effect | `fade-up`, `fade-down`, `fade-right`, `fade-left`, `fade-up-right`, `fade-up-left`, `fade-down-right`, `fade-down-left`, `flip-left`, `flip-right`, `flip-up`, `flip-down`, `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-right`, `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-right`, `zoom-out-left` |
| easing | `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `ease-in-back`, `ease-out-back`, `ease-in-out-back`, `ease-in-sine`, `ease-out-sine`, `ease-in-out-sine`, `ease-in-quad`, `ease-out-quad`, `ease-in-out-quad`, `ease-in-cubic`, `ease-out-cubic`, `ease-in-out-cubic`, `ease-in-quart`, `ease-out-quart`, `ease-in-out-quart` |
| duration | `0`–`3000` (ms, 50ms increments) |
| repeat | `true` (No Repeat), `false` (Scroll Down), `mirror` (Scroll Up/Down) |

## Key Patterns

### Media Library Modal

```js
await page.getByRole("button", { name: "Add media" }).last().click();
const modal = page.locator(".ui-dialog.media-library-widget-modal");
await modal.waitFor({ state: "visible", timeout: 20000 });
await modal.locator(".media-library-item").first().waitFor({ state: "visible", timeout: 20000 });
await modal.locator(".media-library-item").first().click({ force: true });
await page.getByRole("button", { name: "Insert selected" }).click();
await modal.waitFor({ state: "hidden", timeout: 20000 });
```

### Autocomplete Fields

```js
await page.getByRole("textbox", { name: "Field Name", exact: true }).last().fill("search term");
await page.waitForTimeout(2000);
await page.locator(".ui-autocomplete li.ui-menu-item").first().click();
```

### CKEditor 5

```js
const editor = page.locator(".ck-editor__editable").last();
await expect(editor).toBeVisible({ timeout: 10000 });
await editor.click();
await editor.fill("<p>Content</p>");
```

### Collapse Block

```js
await collapseCurrentBlock(page);    // 4s wait
await fastCollapseCurrentBlock(page); // 1.5s wait — combined tests only
```

Always collapse after configuring a block before adding the next one.

## Known Gotchas

1. **Text Area helper** — Uses `.first()` on the column menu. Breaks in multi-block pages. Inline the code with `.last()` instead (see `tests/text-area.spec.js`).

2. **Image block requires all config fields** — `addImageBlock(page)` without config throws `TypeError`. Always pass `{ captionBg, originalSize, align, target }`.

3. **Image Grid `_none` prefix** — Hover, zoom, and align use `_none` (underscore prefix), not `"none"`.

4. **Slideshow** — Now accepts `options` for block-level settings (autoplay, infinite, fade, arrows, adaptiveHeight, cssClasses). Items are created via `addSlideshowItem(page, options?)` with link/target and 8 line styling fields.

5. **Multi-section selector conflicts** — Use a **single section** for all blocks in combined specs. Multiple sections cause selector ambiguity.

6. **Test timeout with many blocks** — Set `test.setTimeout(600000)` for tests with 10+ blocks. Default 180s is not enough.

7. **Video minimum size** — Drupal rejects width/height under 50px with a validation popup.

8. **Collapse wait reduced** — `collapseCurrentBlock(page)` now waits 4s (was 8s). Stable across 162+ executions.

9. **Tag-based worker routing** — `playwright.config.js` defines three projects chained via `dependencies`. Untagged tests run parallel (2 workers, first); `@media-modal` tests run solo (1 worker); `@combined` tests run last (1 worker). A plain `npx playwright test` runs them sequentially, so heavy tests never collide.

## Creating a New Test

1. Read the block doc: `../docs/<block>.md`
2. Read the block profile: `../docs/block-profiles/<block>.md`
3. Read the helper source: `helpers/<block>.js`
4. Create spec: `tests/<block>.spec.js`
5. Follow the test structure (login → page → section → block → publish → verify)
6. Run: `npx playwright test tests/<block>.spec.js`

## Reports

Test reports are generated in `test-results/html-report/` (open with `npm run report`). Failure artifacts (screenshots, traces) go to `test-results/artifacts/`.

## Further Reading

- `USAGE.md` — How to run tests, add new tests, and read results
- `TEST-REPORT.md` — Block-by-block test report and failure history
- `../docs/test-inputs/` — Exact input values used by every test
- `AGENTS.md` — Full AI agent instructions and conventions
- `../docs/explore-new-site.md` — Universal exploration workflow for new Drupal sites
- `../docs/block-profiles/` — Quick reference for each block's selectors and fields
