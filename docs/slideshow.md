# Slideshow Block

## Test Name
`slideshow.spec.js` → `test.describe("Slideshow Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Slideshow Test Page"`
4. `addOneColumnSection(page, "Slideshow Section")`
5. `addSlideshowBlock(page)` — no collapse; one block then publish
6. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
7. Assert visible (`.first()` — Slick clones DOM): "Slide 1 title", "Slide 2 title"

## Test Data
| Setting | Value |
|---------|-------|
| Navigation Bullets | square |
| Slide Duration | 5000 |
| Transition Duration | 500 |
| Slide 0 text | Slide 1 title / Slide 1 description |
| Slide 1 text | Slide 2 title / Slide 2 description |
| Text Position / Alignment | middle / center |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addSlideshowBlock } from "../helpers/slideshow.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addSlideshowBlock(page, options = {})
// options: autoplay, infinite, fade, arrows, adaptiveHeight (checkbox),
//   navigationBullets ("square"|"circle"|"hide"), slideDuration, transitionDuration,
//   cssClasses, slideCount (default 2), media: [name-or-index per slide], items: [per-slide configs]
```
**Do NOT call `addSlideshowItem` separately — the helper creates slides internally.**

## Rules
- Call with no params for defaults; do not call `addSlideshowItem` separately.
- Media selection uses `.js-media-library-item` (not `.media-library-item`) via `selectMediaItem`; `.nth(mediaIndex)` per slide.
- After media insert, Drupal rebuilds the DOM — MUST re-locate the item locator before filling text fields.
- Wait 3000ms after media insert for AJAX rebuild before re-locating.
- `.first()` on text assertions (Slick clones elements).
- Wait 7.5s for slideshow items before interacting.
