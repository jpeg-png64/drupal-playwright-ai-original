# Test Report — All Blocks

**Suite:** 32 tests / 19 spec files / 15 blocks — **all passing** (final state).
**Total runtime:** ~21 min (parallel 2 workers → solo 1 worker → combined 1 worker, sequential via project `dependencies`).

---

## Procedure (identical for every test)

1. **Login** — `drush uli` one-time link via global setup; cached in `.auth/storage-state.json`
2. **Create Standard Page** — goto `/node/add/custom_page/mtpc`, fill Page Title
3. **Add Section** — `addOneColumnSection()` (1-column)
4. **Add Block(s)** — block helper fills every configurable field; `collapseCurrentBlock()` (4s) after each
5. **Publish** — click "Publish Page", wait for redirect + load
6. **Verify frontend** — assert rendered block output

## Inputs

Exact inputs per block are documented in [`../docs/test-inputs/`](../docs/test-inputs/INDEX.md) — one file per block with the full helper config, hardcoded helper values, and frontend assertions. The spec files (`tests/<block>.spec.js`) are the executable source. Per block, **test 2** ("All configurable fields") covers every discovered field and is the reference input; test 1 ("Default") uses baseline values. Helpers called are in `helpers/<block>.js`.

## Results by Block

| #   | Block                 | Spec                          | Tests | Input ref                          | Result |
| --- | --------------------- | ----------------------------- | ----- | ---------------------------------- | ------ |
| 1   | Accordion             | `accordion.spec.js`           | 1     | Default                            | ✅     |
| 2   | Event Carousel        | `event-carousel.spec.js`      | 2     | Default + All config               | ✅     |
| 3   | Icon & Text Highlight | `icon-text-highlight.spec.js` | 1     | All column styles                  | ✅     |
| 4   | Image                 | `image.spec.js`               | 2     | Default + Animation                | ✅     |
| 5   | Image Grid            | `image-grid.spec.js`          | 8     | 6 layout/hover + Zoom + All config | ✅     |
| 6   | Navigation Menu       | `navigation-menu.spec.js`     | 1     | Default                            | ✅     |
| 7   | Next / Previous       | `next-previous.spec.js`       | 2     | Default + All config               | ✅     |
| 8   | Page Title            | `page-title.spec.js`          | 2     | Default + All config               | ✅     |
| 9   | Profile Details       | `profile-details.spec.js`     | 1     | Default                            | ✅     |
| 10  | Profile Listing       | `profile-listing.spec.js`     | 1     | Both layouts                       | ✅     |
| 11  | Slideshow             | `slideshow.spec.js`           | 2     | Default + All config               | ✅     |
| 12  | Text Area             | `text-area.spec.js`           | 1     | Default                            | ✅     |
| 13  | Three-Col Carousel    | `three-col-carousel.spec.js`  | 1     | Default                            | ✅     |
| 14  | Video                 | `video.spec.js`               | 2     | Default + Autoplay                 | ✅     |
| 15  | YouTube               | `youtube.spec.js`             | 1     | Default                            | ✅     |

### Combined tests

| Test                      | Spec                            | Input                                             | Result |
| ------------------------- | ------------------------------- | ------------------------------------------------- | ------ |
| All 15 blocks on one page | `zz-all-blocks.spec.js`        | 15 blocks, single section                         | ✅     |
| Many block types          | `stress-block-variety.spec.js`  | 18 blocks mixed                                   | ✅     |
| Large content             | `stress-content-volume.spec.js` | Accordion ×3 + slideshow, large text              | ✅     |
| Boundary sizes            | `stress-size-extremes.spec.js`  | Video/YouTube 50×50 & 5000×5000, tiny/huge events | ✅     |

---

## Failures encountered & root causes

| Failure                                                                                                 | Cause                                                                                            | Fix                                              |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `all-blocks` — media modal never appeared; YouTube field not visible; image-grid `selectOption` timeout | Running solo + parallel projects **concurrently** → 2 heavy Drupal submissions collided          | Projects run **sequentially** now — 3 phases via `dependencies` (parallel → solo → combined), so `@combined` always runs last on a solo worker |
| `event-carousel` "All configurable fields" (flaky, 1×)                                                  | "Add Events Carousel Block" click intercepted by the "Add 1-Column Section" button (DOM overlap) | Passed on retry; no code change                  |
| `image-grid` "Three Images + Fade" (flaky, 1×)                                                          | "Add Image Grid Block" not visible within 5s during concurrent run                               | Passed on retry; resolved by sequential projects |

**Historical fixes that got the suite to green:** collapse wait 8s→4s, media-modal tests isolated at 1 worker via `@media-modal` tags, `@combined` tests moved to their own final 1-worker phase, image-grid `_none` option values, helper signature corrections (image config required, slideshow no-param, text-area `.last()`).

---

## Can't publish page — caused by bad input values

Recorded during test development. These are the **values we entered** that made Drupal reject the publish (page stays on `/node/add`). AJAX/timing/concurrency causes are excluded — they're covered by the tag-split protocol above.

| # | Bad input | What we entered | Why Drupal rejected the publish | Fix |
|---|-----------|-----------------|---------------------------------|-----|
| 1 | **Out-of-bounds dimensions** | Video/YouTube width/height `1×1` (and `10000×10000`) | Below the **50px minimum** — Drupal shows a validation popup ("why you can't publish") on click; form never submits | Use real bounds: **50–5000px** |
| 2 | **Non-existent menu name** | Nav block menu `"NonExistentMenu12345XYZ"` | Autocomplete finds nothing → Desktop/Mobile Style fields can't be set → validation fails | Use a real menu (e.g. `"Top Links"`) |
| 3 | **Too-heavy content** | 15+ blocks with `5000×5000` videos, 500-char titles, 2000-char HTML on one page | Drupal can't save the form (PHP `memory_limit`/`max_execution_time`) → no redirect | Cap values (≤5000px) and split the mega page into 3 focused stress tests |

**Key diagnostic:** after clicking "Publish Page", check whether the URL leaves `/node/add` — if it does, the publish succeeded; if it doesn't and there's a validation popup or no error at all, suspect the input values (Drupal rejects out-of-range/unknown-field values silently in headless mode).

---

## Block fields discovered & tested (from gap analysis)

| Block           | Fields patched into helper + tests                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Page Title      | position, 3 device heights, breadcrumb show/override/url/text                                            |
| Next / Previous | 6 colors: bg, link, border, bgHover, linkHover, borderHover                                              |
| Image Grid      | 4 colors: borderColor, captionBgColor, overlayBg, overlayBgHover                                         |
| Event Carousel  | per-item Active checkbox, block-level Show Ongoing                                                       |
| Slideshow       | autoplay, infinite, fade, arrows, adaptiveHeight, cssClasses + per-slide link/target/8 line-style fields |
