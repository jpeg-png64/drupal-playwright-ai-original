# Slideshow Block

## How to Add
- Button: `columnMenu.getByRole("button", { name: "Add Slideshow Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container-add-more"]')`

## Key Fields

### Block-Level Fields
| Field | Selector | Type | Default | Notes |
|-------|----------|------|---------|-------|
| Autoplay | `getByLabel("Autoplay")` | checkbox | off | |
| Infinite Loop | `getByLabel("Infinite Loop")` | checkbox | off | |
| Fade Effect | `getByLabel("Fade Effect")` | checkbox | off | |
| Show navigation arrows | `getByLabel("Show navigation arrows")` | checkbox | off | |
| Adaptive Height | `getByLabel("Adaptive Height")` | checkbox | off | |
| Navigation Bullets | `getByLabel("Navigation Bullets")` | select | `square` | `square`, `circle`, `hide` |
| Slide Duration | `getByRole("spinbutton", { name: "Slide Duration" })` | number | `5000` | ms |
| Transition Duration | `getByRole("spinbutton", { name: "Transition duration" })` | number | `500` | ms |
| CSS Classes | `textarea[name*="field_mod_css_classes"]` | textarea | empty | block-level |

### Item-Level Fields (per slide)
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Slide Type | `item.getByLabel("Slide Type")` | select | Yes | `image`, `video` |
| Image | `item.getByRole("button", { name: "Add media" })` | media button | Yes | Scoped to item |
| Slide Link | `input[name*="field_mod_slide_link"][name$="[uri]"]` | text input | No | URL |
| Link Target | `select[name*="field_mod_link_target"]` | select | No | `_self`, `_blank` |
| Slide Text Line 1 | `item.getByRole("textbox", { name: "Slide Text Line 1" })` | text input | Yes | Title text |
| Line 1 Size | `input[name*="field_mod_slide_text_1_size"]` | number | No | em |
| Line 1 Radius | `input[name*="field_mod_slide_text_1_radius"]` | number | No | px |
| Line 1 Color | `input[name*="field_mod_slide_text_1_color"]` | color (hidden) | No | hex |
| Line 1 BG | `input[name*="field_mod_slide_text_1_bg"]` | color (hidden) | No | hex |
| Slide Text Line 2 | `item.getByRole("textbox", { name: "Slide Text Line 2" })` | text input | Yes | Description text |
| Line 2 Size | `input[name*="field_mod_slide_text_2_size"]` | number | No | em |
| Line 2 Radius | `input[name*="field_mod_slide_text_2_radius"]` | number | No | px |
| Line 2 Color | `input[name*="field_mod_slide_text_2_color"]` | color (hidden) | No | hex |
| Line 2 BG | `input[name*="field_mod_slide_text_2_bg"]` | color (hidden) | No | hex |
| Text Position | `item.getByLabel("Text Position")` | select | Yes | `top`, `middle`, `bottom` |
| Text Alignment | `item.getByLabel("Text Alignment")` | select | Yes | `left`, `center`, `right` |

## Gotchas
1. Items container via `data-drupal-selector` — `div.paragraphs-subform[data-drupal-selector*="field-mod-slideshow-item-${index}-subform"]`.
2. AJAX rebuild after media insert — wait 3s, then re-locate the item container.
3. Media selection NOT `.first()` — helper uses `page.locator(".js-media-library-item")` via `selectMediaItem`, matching a name (substring on text/alt/title) or numeric index (default = index per slide).
4. Color fields are hidden inputs — set via `page.evaluate` with `change` event dispatch.

## Helper Signature
```javascript
addSlideshowBlock(page, options = {})
// options (all optional):
//   autoplay: false,          // checkbox
//   infinite: false,          // checkbox
//   fade: false,              // checkbox
//   arrows: false,            // checkbox
//   adaptiveHeight: false,    // checkbox
//   navigationBullets: "square",  // "square" | "circle" | "hide"
//   slideDuration: "5000",    // ms
//   transitionDuration: "500", // ms
//   cssClasses: "",           // block CSS class
//   slideCount: 2,            // number of slides (creates N items)
//   media: ["name-or-index", "name-or-index"], // per slide (optional, default index per slide)
//   items: [                  // per-slide configs
//     {
//       slideType: "image",   // "image" | "video"
//       line1Text: "title", line2Text: "desc",
//       textPosition: "middle", textAlignment: "center",
//       link: "", target: "",
//       line1Size: "", line1Radius: "", line1Color: "", line1Bg: "",
//       line2Size: "", line2Radius: "", line2Color: "", line2Bg: "",
//     },
//   ]
// }
```

## Frontend Assertion
```javascript
await expect(page.getByText("Slide title").first()).toBeVisible();
```

## Test Coverage
- **Default** — 1 block, 2 slides, hardcoded defaults
- **All configurable fields** — 2 blocks: Block 1 (all checkboxes on, styled slide with link/target/colors), Block 2 (defaults)
