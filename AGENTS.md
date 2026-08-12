# Drupal Playwright Automation

Playwright automation tests for Drupal custom blocks — generate reliable, maintainable tests by reusing existing helpers and patterns.

# Project Structure

```
docs/             - Block documentation (source of truth)
manual/           - Human-facing docs (README, USAGE, TEST-REPORT)
docs/test-inputs/ - Exact input values per test
helpers/          - Shared helper functions
tests/            - Generated Playwright spec files
test-results/     - Reports and failure artifacts
uat/              - Ad-hoc UAT probes against Docker UAT servers
```

# UAT Probes

`uat/` contains throwaway Playwright probes run against the Docker UAT servers
(`*.docker-uat01.ust.hk`) — they are NOT part of the main suite. To run one
against a specific server:

```bash
PATH="/usr/local/bin:$PATH" npx playwright test uat/block-build.spec.js \
  --config=uat/playwright-uat.config.js --reporter=line
```

Learnings that apply to the main suite:

- **Login is via the given link, not `drush uli`** — the human provides the login
  link (each new user has their own); open it once to capture the session
  (`uat/capture-session.mjs`), then probes reuse the saved storage state.
  Authentication check on `/user`: body contains "logout" (case-insensitive).
- **Slow sites need `waitForLoadState("domcontentloaded")`** instead of
  `networkidle` — UAT servers frequently never reach `networkidle` on admin forms.
- **Publish guard:** after "Publish Page", wait for the URL to leave `/node/add`
  (e.g. `waitForFunction(() => !window.location.pathname.startsWith("/node/add"))`
  or `waitForURL`). A publish failure leaves the form on `/node/add`; the guard
  turns that into a clear timeout instead of a false frontend-assertion pass.
- **Autocomplete needs existing nodes:** `addNextPreviousBlock` fills a search
  term and clicks the first suggestion — the term must match a node that exists.
  Defaults are `"Test Page"` / `"Test 2"`; specs should create their own link
  targets and pass `nextSearch` / `prevSearch` (see `tests/next-previous.spec.js`).

# Running Tests

Worker count and phase come from tags in the test title, routed via projects in `playwright.config.js`. Projects run **sequentially** via `dependencies` (parallel → solo → combined), so heavy tests never collide:

- No tag → **parallel** project → 2 workers (runs first)
- `@media-modal` only → **solo** project → 1 worker (runs after parallel)
- `@combined` → **combined** project → 1 worker (runs last)

```bash
# Full suite (parallel → solo → combined, sequential)
PATH="/usr/local/bin:$PATH" npx playwright test

# Standard tests only (2 workers)
PATH="/usr/local/bin:$PATH" npx playwright test --project=parallel

# Media-modal tests only (1 worker, fully isolated)
PATH="/usr/local/bin:$PATH" npx playwright test --project=solo

# Combined multi-block tests only (1 worker, runs last)
PATH="/usr/local/bin:$PATH" npx playwright test --project=combined

# Single spec
PATH="/usr/local/bin:$PATH" npx playwright test tests/accordion.spec.js --reporter=line

# Specific test by name
PATH="/usr/local/bin:$PATH" npx playwright test -g "All blocks on one page"
```

## Tagging new tests

Add `@media-modal` when a test uses the media library modal or is otherwise heavy; `@combined` for multi-block page tests. The config routes it automatically:

```js
test("All configurable fields @media-modal", async ({ page }) => { ... });
test("Many blocks on one page @combined", async ({ page }) => { ... });
test("Default", async ({ page }) => { ... }); // runs at 2 workers
```

**Combined tests always run last** — the all-blocks check is the final test of the suite.

Node is at `/usr/local/bin/node` — always prefix with `PATH="/usr/local/bin:$PATH"`.

# General Rules

- Use JavaScript ES Modules + `@playwright/test`.
- Reuse existing helpers whenever possible. Never recreate helper functions.
- Never modify helpers unless explicitly requested.
- Follow existing project conventions.

# ⚠️ HIGHEST AUTHORITY: Check Docs Before Every Test Run

**Before running any test (single spec, project, or full suite), or before generating/editing a spec, the agent MUST read BOTH of these files for the block under test:**

1. `docs/block-profiles/<block>.md` — **profile**: selectors, field names, valid option values, gotchas, helper signatures.
2. `docs/test-inputs/<block>.md` — **test-inputs**: the exact input values the test must use.

These two files are the source of truth for test behavior — the highest authority in this project.

- If a spec **contradicts** either file → fix the spec to match the docs (test-inputs wins for input values; profile wins for selectors/fields/behavior).
- If a spec is **missing** something the docs define → add it.
- If the docs are stale/wrong about a discovered truth, update them **and** the spec together.

**This rule is never violated — not for speed, convenience, or intuition — unless the user explicitly and deliberately asks to bypass it.**

# Playwright Standards

Always use `test.describe()`, `test()`, `test.step()`, `expect()`.

Prefer locators in this order: `getByRole()` → `getByLabel()` → `getByPlaceholder()` → stable CSS selectors.

Avoid: XPath, dynamic IDs, `page.waitForTimeout()` (helpers use it — don't add more).

After publishing (publish guard — a failed publish leaves the form on `/node/add`, which becomes a clear timeout instead of a false frontend pass):

```js
await page.getByRole("button", { name: "Publish Page" }).click();
await page.waitForFunction(
  () => !window.location.pathname.startsWith("/node/add"),
  { timeout: 120000 },
);
await page.waitForLoadState("load");
```

# Test Structure

Every test follows: 1) Login, 2) Create Standard Page (`/node/add/custom_page/mtpc`), 3) Add Section, 4) Add Block(s) + Collapse after each, 5) Publish Page, 6) Verify Frontend.

# Drupal Site Details

- **URL:** `http://localhost:8325`
- **Content type URL:** `/node/add/custom_page/mtpc`
- **Title field:** `getByRole("textbox", { name: "Page Title" })`
- **Publish button:** `getByRole("button", { name: "Publish Page" })`
- **Login:** Use the provided login link — no `drush uli` (see "Login: Given-Link Workflow")

# Login: Given-Link Workflow

**The automation never generates a login. It uses the link that is provided.**

- Each user has their own login link (a one-time session link or CAS login) — a new user gets a new link.
- To use a given link:
  1. Open the provided link once in a browser to establish the Drupal session
     (`uat/capture-session.mjs` for UAT; the `login()` helper for the main suite).
  2. The session is cached in the storage-state file
     (`.auth/storage-state-builder-clean.json` for UAT, `.auth/storage-state.json` for local).
  3. Tests/probes authenticate from that saved session — no per-test login.
- Running the suite for a different user? Re-capture the session with their new
  link, then run the same tests unchanged.

# Helper Function Reference

## CRITICAL: Helper Signatures & Gotchas

Every helper has different parameter expectations. **Read the helper source before calling it.** Do NOT guess parameters.

### Simple helpers (no config needed)

| Helper | Signature | Notes |
|--------|-----------|-------|
| `addPageTitleBlock(page, options?)` | `options = { title?, align? }` | Uses first column menu (no `.last()`) |
| `addNextPreviousBlock(page, options?)` | `options = { nextSearch?, prevSearch?, nextTitle?, prevTitle?, bgColor?, linkColor?, borderColor?, bgHoverColor?, linkHoverColor?, borderHoverColor? }` — autocomplete links; pass `nextSearch`/`prevSearch` for nodes you create |
| `addYoutubeBlock(page, width, height)` | Width/height as strings | Fills video ID directly |
| `addSlideshowBlock(page, options?)` | `options.media?` = array of names/indexes per slide | Items default to 2 slides, media item = index |
| `addThreeColCarouselBlock(page, options?)` | `options.media?` = array of names/indexes per item | Creates 3 items, media item = first |
| `addEventCarouselBlock(page, config)` | `config = { name, startDate, endDate }` | Dates as `YYYY-MM-DD` |

### Helpers requiring config objects

| Helper | Required Config Fields |
|--------|----------------------|
| `addImageBlock(page, config)` | `{ captionBg, originalSize, align, target }` — ALL required; `media?` = name/index (default first item) |
| `addVideoBlock(page, config)` | `{ url, width, height }` — `autoplay` optional (default `false`) |
| `addImageGridBlock(page, option)` | `{ layout, hover, zoom, borderWidth, borderRadius, captionBg, link, target, caption, borderColor?, captionBgColor?, captionTextColor?, captionTextHover? }` — `media?` (main) and `mediaOverlay?` (overlay), default first item. Gotchas: the caption BG color field is `cap_bgcol` (NOT `caption_bg_color`) — helper targets `field_mtpc_image_grid_cap_bgcol`; overlay BG color fields do NOT exist (use caption text color fields `cap_txtcol`/`cap_txthov`); color setters use `.last()` for multi-block pages |
| `addProfileListingBlock(page, layout?)` | `layout` = `"one_col"` (default) or `"two_col"` — no config object |
| `addProfileDetailsBlock(page)` | **No params** — no config object |

### Helpers with dropdown autocomplete

| Helper | Signature | Notes |
|--------|-----------|-------|
| `addNavigationMenuBlock(page, menuName, desktopStyle, mobileStyle)` | Menu must exist in Drupal (e.g. `"Top Links"`) | Waits for autocomplete |

### Helpers using CKEditor

| Helper | Notes |
|--------|-------|
| `addIconTextHighlightBlock(page, options)` | Waits for `.ck-editor__editable`, clicks then fills |
| Text Area (inline) | Same pattern — wait for editor visible, click, fill |

### Collapse helpers

| Helper | Wait | Notes |
|--------|------|-------|
| `collapseCurrentBlock(page)` | 4s | Original — use in most specs |
| `fastCollapseCurrentBlock(page)` | 1.5s | Used in `zz-all-blocks.spec.js` to speed up combined tests |

### Utility helpers

| Helper | Notes |
|--------|-------|
| `addOneColumnSection(page, title?)` | Adds a 1-column section — must call before adding blocks |

# Known Issues & Solutions

## 1. Section index prefix selectors are fragile

**Problem:** Selectors like `[id^="edit-field-mod-sections-0-subform-..."]` hardcode the section index (`-0-`). On multi-section pages the section you want is often not index 0, and on template edits the pre-existing section may already occupy index 0 — so helpers/specs using this prefix target the wrong element or time out entirely.

**Solution:** Use substring selectors with `.last()` instead of the `sections-0` prefix, and use a **single section** for all blocks in combined specs; call `collapseCurrentBlock(page)` after each block.

```js
// CORRECT — substring + .last() (works at any section index)
await page
  .locator('[id*="field-mod-1-col-container-add-more"]')
  .last()
  .getByRole("button", { name: "List additional actions" })
  .click();

// WRONG — hardcoded sections-0 prefix (breaks when section index != 0)
await page
  .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container-add-more"]')
  .getByRole("button", { name: "List additional actions" })
  .click();
```

```js
// CORRECT — single section
await addOneColumnSection(page, "All Blocks Section");
await addAccordionBlock(page);
await collapseCurrentBlock(page);
await addEventCarouselBlock(page, { ... });
await collapseCurrentBlock(page);

// WRONG — multiple sections cause selector ambiguity
await addOneColumnSection(page, "Section 1");
// ... block added ...
await addOneColumnSection(page, "Section 2");
// ... block added to wrong section ...
```

## 2. Text Area block CKEditor not found

**Problem:** `addTextAreaBlock` helper's CKEditor textbox (`getByRole("textbox", { name: "Rich Text Editor. Editing" })`) can resolve to an old editor when multiple blocks exist.

**Solution:** The helper already uses `.last()` on the column menu and the textbox, so it is multi-block safe. If a spec needs a custom content value in a combined page, inline the fill with `.last()`:

```js
await page
  .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]')
  .last()
  .getByRole("button", { name: "List additional actions" })
  .click();

await page.getByRole("button", { name: "Add Text Area Block" }).click();

const editor = page.locator(".ck-editor__editable").last();
await expect(editor).toBeVisible({ timeout: 15000 });
await editor.click();
await editor.fill("<p>Content</p>");
```

## 3. Image Block TypeError

**Problem:** `addImageBlock(page)` without config throws `Cannot read properties of undefined`.

**Solution:** Always pass config:

```js
await addImageBlock(page, {
  captionBg: false,
  originalSize: false,
  align: "_none",
  target: "_self",
});
```

## 4. Image Grid wrong option values

**Problem:** Drupal select options use underscore prefix for "none".

| Field | Wrong | Correct |
|-------|-------|---------|
| hover/overlay | `"none"` | `"_none"` |
| zoom | `"none"` | `"_none"` |
| align | `"none"` | `"_none"` |

## 5. Slideshow defaults

**Problem:** `addSlideshowBlock(page, options = {})` — calling with no options uses defaults: navigation `"square"`, slide duration `"5000"`, transition `"500"`, 2 slides created internally. Options support `autoplay`, `infinite`, `fade`, `arrows`, `adaptiveHeight`, `navigationBullets`, `slideDuration`, `transitionDuration`, `cssClasses`, `slideCount`, `media`, `items`.

**Solution:** Call with no args for defaults. Do NOT call `addSlideshowItem` separately.

## 6. Test timeout with many blocks

**Problem:** 16 blocks with media modals + 4s collapse waits exceeds 180s default.

**Solution:** Set extended timeout for combined specs:

```js
test("All blocks on one page", async ({ page }) => {
  test.setTimeout(600000); // 10 minutes
  // ...
});
```

# Drupal Form Patterns

## Media Library Modal

Every helper that uses media follows this pattern:

```js
const mediaButton = page.getByRole("button", { name: "Add media" }).last();
await mediaButton.click();

const modal = page.locator(".ui-dialog.media-library-widget-modal");
await modal.waitFor({ state: "visible", timeout: 20000 });

const media = modal.locator(".media-library-item").first();
await media.waitFor({ state: "visible", timeout: 20000 });
await media.click({ force: true });

await page.getByRole("button", { name: "Insert selected" }).click();
await modal.waitFor({ state: "hidden", timeout: 20000 });
```

Key points:
- Use `.last()` on the media button when multiple blocks exist
- Use `force: true` on media item click
- Wait for modal visible → click → wait for modal hidden

## Autocomplete Fields

```js
await page.getByRole("textbox", { name: "Field Name", exact: true }).last().fill("search term");
await page.waitForTimeout(2000); // wait for autocomplete to populate
await page.locator(".ui-autocomplete li.ui-menu-item").first().click();
```

## AJAX Rebuilds

After media inserts or select changes, Drupal rebuilds parts of the form. Always:
1. Wait for the rebuild to complete (`waitForTimeout` or `waitForLoadState`)
2. Re-locate elements after rebuild (don't cache locators across rebuilds)

## Collapse Block

```js
await collapseCurrentBlock(page);
// Waits 8 seconds after collapsing — required before adding next block
```

**Always collapse after configuring a block.** This prevents DOM conflicts with subsequent blocks.

# Creating Combined Multi-Block Specs

When adding multiple blocks to one page:
1. Use **one section** (not one per block)
2. Call `collapseCurrentBlock(page)` after every block
3. Read each helper source to confirm its signature
4. Set `test.setTimeout(600000)` for 10+ blocks
5. For blocks with tricky helpers (text-area, image), inline the code

Template:

```js
import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
import { addAccordionBlock } from "../helpers/accordion.js";
// ... import other helpers

test.describe("Combined Test", () => {
  test("Blocks on one page", async ({ page }) => {
    test.setTimeout(600000);

    await test.step("Login", async () => { await login(page); });

    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page.getByRole("textbox", { name: "Page Title" }).fill("Test Page");
    });

    await test.step("Add Section", async () => {
      await addOneColumnSection(page, "Test Section");
    });

    await test.step("Add Block A", async () => { /* ... */ });
    await test.step("Collapse block", async () => { await collapseCurrentBlock(page); });

    await test.step("Add Block B", async () => { /* ... */ });
    await test.step("Collapse block", async () => { await collapseCurrentBlock(page); });

    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify Frontend", async () => {
      await expect(page.getByText("Expected text")).toBeVisible();
    });
  });
});
```

# Block Configuration Reference

## Valid Option Values

| Block | Field | Valid Values |
|-------|-------|-------------|
| Accordion | icon_style | `number`, `icon` |
| Accordion | fa_acc_icon_style | `fab`, `fad`, `fas` |
| Image Grid | layout | `small` (Four Images), `large` (Three Images) |
| Image Grid | hover/overlay | `_none`, `fade`, `slide` |
| Image Grid | zoom | `_none`, `enabled`, `disabled` |
| Profile Listing | layout | `one_col`, `two_col` |
| Slideshow | navigation | `hide`, `square`, `circle` |
| Video | video_type | `upload`, `hkust_video` |

# Reports

Reports belong in `test-results/`. Failure artifacts: screenshot, trace, error.txt. Do not create unnecessary files.

# Token Efficiency

Read only files required for the current task.
Never scan the entire project unless explicitly requested.
Read at most one similar spec when necessary.
**Always read helper source before calling it** — signatures vary.
