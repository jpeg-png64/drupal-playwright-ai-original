# Test Report — All Blocks

**Suite:** 32 tests / 19 spec files / 16 blocks — **all passing** (final state).
**Total runtime:** ~21 min (parallel 2 workers → solo 1 worker → combined 1 worker, sequential via project `dependencies`).

---

## Procedure (identical for every test)

1. **Login** — open the provided login link once; session cached in `.auth/storage-state.json` (no `drush uli`)
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
| 16  | Views                 | — (covered in `zz-all-blocks.spec.js`) | 1 | Default | ✅     |

### Combined tests

| Test                      | Spec                            | Input                                             | Result |
| ------------------------- | ------------------------------- | ------------------------------------------------- | ------ |
| All 16 blocks on one page | `zz-all-blocks.spec.js`        | 16 blocks, single section                         | ✅     |
| Many block types          | `stress-block-variety.spec.js`  | 18 blocks mixed                                   | ✅     |
| Large content             | `stress-content-volume.spec.js` | Accordion ×3 + slideshow, large text              | ✅     |
| Boundary sizes            | `stress-size-extremes.spec.js`  | Video/YouTube 50×50 & 5000×5000, tiny/huge events | ✅     |

---

## Failures encountered & root causes

| `edit saved page` — expanding any section with a ckeditor block (Text Area, Accordion) returns Drupal "Oops" (500) | ckeditor paragraph-render AJAX 500s on UAT in every context (add + edit) | Backend bug; workaround — edit non-ckeditor fields (title), add new sections/blocks only |

| Failure                                                                                                 | Cause                                                                                            | Fix                                              |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `all-blocks` — media modal never appeared; YouTube field not visible; image-grid `selectOption` timeout | Running solo + parallel projects **concurrently** → 2 heavy Drupal submissions collided          | Projects run **sequentially** now — 3 phases via `dependencies` (parallel → solo → combined), so `@combined` always runs last on a solo worker |
| `event-carousel` "All configurable fields" (flaky, 1×)                                                  | "Add Events Carousel Block" click intercepted by the "Add 1-Column Section" button (DOM overlap) | Passed on retry; no code change                  |
| `image-grid` "Three Images + Fade" (flaky, 1×)                                                          | "Add Image Grid Block" not visible within 5s during concurrent run                               | Passed on retry; resolved by sequential projects |

**Historical fixes that got the suite to green:** collapse wait 8s→4s, media-modal tests isolated at 1 worker via `@media-modal` tags, `@combined` tests moved to their own final 1-worker phase, image-grid `_none` option values, helper signature corrections (image config required, slideshow no-param, text-area `.last()`).

**2026-08-12 revamp fixes:** Next/Previous now creates its own link-target pages and passes `nextSearch`/`prevSearch` (autocomplete defaults matched no nodes on a fresh site); image-grid color field corrected from nonexistent `caption_bg_color` to `cap_bgcol`, overlay colors replaced with caption text colors (`cap_txtcol`/`cap_txthov`); profile-details photo assertion added; stale root `docs/*.md` removed in favor of `block-profiles/` + `test-inputs/`.

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
| Image Grid      | 4 colors: borderColor, captionBgColor, captionTextColor, captionTextHover                                 |
| Event Carousel  | per-item Active checkbox, block-level Show Ongoing                                                       |
| Slideshow       | autoplay, infinite, fade, arrows, adaptiveHeight, cssClasses + per-slide link/target/8 line-style fields |

---

## UAT Report (builder-clean)

**Site:** https://builder-clean.docker-uat01.ust.hk — the refreshed UAT build. Probes run from `uat/` with their own config; the block suite above does **not** target this site.

**Commands:**

```
node uat/capture-session.mjs                       # one-time: capture admin session (interactive CAS login)
PATH="$PATH" npx playwright test --config=uat/playwright.config.js           # all UAT specs
PATH="$PATH" npx playwright test --config=uat/playwright-nosession.config.js # anonymous-only probes
```

### Block health

**Blocks (16/16): PASS** — Text Area, Icon & Text Highlight, Accordion, Events Carousel, 3-Column Carousel, Page Title, Navigation Menu, Next & Previous, Image, Video (iframe embed), Youtube, Image Grid, Slideshow, Views, Profile Listing, Profile Details. Full status and per-route detail in `UAT-BLOCK-HEALTH.txt`.

`uat/block-build.spec.js` (2026-08-12): Page Title, Accordion, Text Area, Image blocks all build on a draft Standard Page with **no server 500** — Accordion, previously a known 500 on older UAT builds, now passes. Draft page deliberately not published.

### Known UAT issues (real bugs, need code fix)

| Route / area | Error |
|--------------|-------|
| `/admin/event-registration/overview` | HTTP 500 — `ksort` TypeError (flips_core) |
| `/admin/config/people/otp` | HTTP 500 — ArgumentCountError (OTP module) |
| Video/Youtube frontend `/ajax/load_video/{nid}` | PHP deprecation: `str_replace(): Passing null to parameter #3` in `mtpcbuild_thm\RenderVideo->render()`; dynamic property deprecations in `mtpcbuild_sw\UserLocation` |
| Missing assets | `/sites/default/files/2024-01/bg_light_blue.png`(.jpg), `/themes/misc/menu-expanded.png` (404) |

Dblog (`/admin/reports/dblog?type[]=php`) is the source of truth for the actual exception messages — the site shows only a generic "unexpected error" page.

### Anonymous probes

`public-crawl.spec.js` (BFS crawl + endpoint probes) and `probe-nosession.spec.js` confirm admin/content routes are locked down with no Drupal session; a full top-bar/header sweep found **195 of 196 internal links OK**, the single failure being `/admin/config/people/otp` (500, listed above).

### UAT admin walkthrough

`../uat/UAT-ADMIN-OVERVIEW.md` — plain-language overview of the MTPC Administration area (content, structure, people, events sync, multimedia, roles, standard Drupal admin), plus the `builder-clean` vs `callitso` differences. `views-autofill-list.md` — the 42 Views autocomplete entries discovered by `uat/views-display.spec.js`.
