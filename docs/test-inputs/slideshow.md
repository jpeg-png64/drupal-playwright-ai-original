# Slideshow — Test Inputs

**Spec:** `tests/slideshow.spec.js` · **Helper:** `addSlideshowBlock(page, options?)`

## Test 1: Default

- **Page title:** "Slideshow Test Page"
- **Section:** "Slideshow Section"
- `addSlideshowBlock(page)` — no config → creates 2 slides with default settings

### Hardcoded default slide values (helper)

- Slide 1: title "Slide 1 title", media item 0
- Slide 2: title "Slide 2 title", media item 1

### Media selection

`options.media` is **optional** — an array of media names/indexes, one per slide (index fallback: item 0, item 1, …). Omit to keep default behavior. See `docs/test-inputs/INDEX.md` → Media library for available files.

## Test 2: All configurable fields (@media-modal, 2 blocks)

- **Page title:** "Slideshow Advanced Test"
- **Section:** "Advanced Section"

### Block 1 — all block options + styled slide

| Field              | Value                                                      |
| ------------------ | ---------------------------------------------------------- |
| autoplay           | true                                                       |
| infinite           | true                                                       |
| fade               | true                                                       |
| arrows             | true                                                       |
| adaptiveHeight     | true                                                       |
| navigationBullets  | circle                                                     |
| slideDuration      | 4000                                                       |
| transitionDuration | 600                                                        |
| cssClasses         | custom-slideshow                                           |
| slideCount         | 1 (item: line1 "Styled Title", line2 "Styled Description") |

**Slide 1 item config:**
| Field | Value |
|-------|-------|
| line1Text | Styled Title |
| line2Text | Styled Description |
| textPosition | top |
| textAlignment | left |
| link | https://example.com |
| target | \_blank |
| line1Size / line1Radius | 3 / 0 |
| line1Color / line1Bg | #ffffff / #333333 |
| line2Size / line2Radius | 1.5 / 0 |
| line2Color / line2Bg | #cccccc / #000000 |

### Block 2 — minimal (defaults)

- `addSlideshowBlock(page)` → 2 default slides ("Slide 1 title", "Slide 2 title")

## Frontend assertions

- Test 1: "Slide 1 title", "Slide 2 title" visible
- Test 2: "Styled Title", "Slide 1 title" visible
