# Image Grid Block

## How to Add
- Button: `getByRole("button", { name: "Add Image Grid Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`

## Key Fields
| Field | Selector | Type | Required | Valid Values |
|-------|----------|------|----------|-------------|
| Layout | `select[name*="field_mod_grid_layout"]` | select | Yes | `small` (Four Images), `large` (Three Images) |
| Hover Effect | `select[name*="field_mtpc_image_grid_hover_eff"]` | select | Yes | `_none`, `fade`, `slide` |
| Zoom | `select[name*="field_mtpc_image_grid_zoom"]` | select | Yes | `_none`, `enabled`, `disabled` |
| Border Width | `input[name*="field_mtpc_image_grid_brdr_width"]` | text input | Yes | Number (string) |
| Border Radius | `input[name*="field_mtpc_image_grid_brdr_radiu"]` | text input | Yes | Number (string) |
| Caption Background | `input[name*="field_mtpc_image_grid_caption_bg"]` | checkbox | No | Boolean |
| Image | `input[data-drupal-selector*="field-mod-image-open-button"]` | media button | Yes | Uses `addGridMedia` helper |
| Overlay Image | `input[data-drupal-selector*="field-mtpc-image-grid-overlay-open-button"]` | media button | No | Uses `addGridMedia` helper |
| Link URL | `input[name*="field_mtpc_mod_link"][name$="[uri]"]` | text input | No | URL |
| Link Target | `select[name*="field_mtpc_mod_link"][name*="target"]` | select | No | `_self`, `_blank` |
| Caption | `textarea[name*="field_mod_image_caption"]` | textarea | No | Text |
| Border Color | `input[name*="field_mtpc_image_grid_brdr_color"]` | color (hidden) | No | Hex value |
| Caption BG Color | `input[name*="field_mtpc_image_grid_cap_bgcol"]` | color (hidden) | No | Hex value |
| Caption Text Color | `input[name*="field_mtpc_image_grid_cap_txtcol"]` | color (hidden) | No | Hex value |
| Caption Text Hover | `input[name*="field_mtpc_image_grid_cap_txthov"]` | color (hidden) | No | Hex value |
| Overlay BG / Overlay BG Hover | — | — | No | **Do NOT exist** — color widgets absent for overlay; overlay is media-only |

## Gotchas
1. Media buttons use `input[data-drupal-selector]`, NOT `getByRole("button", { name: "Add media" })` — `page.locator('input[data-drupal-selector*="...open-button"]').last()`.
2. Two media buttons — main image (`field-mod-image-open-button`) + overlay (`field-mtpc-image-grid-overlay-open-button`).
3. Config required — `addImageGridBlock(page, option)` needs all: `{ layout, hover, zoom, borderWidth, borderRadius, captionBg, link, target, caption }`.
4. None options use underscore prefix — `_none`, not `none`, for hover, zoom.
5. **Color field naming:** the caption BG color widget is `field_mtpc_image_grid_cap_bgcol` — NOT `caption_bg_color` (a helper filling `field_mtpc_image_grid_caption_bg_color` silently misses it). Caption text color/hover are `cap_txtcol` / `cap_txthov`. Overlay BG color widgets do NOT exist at all.
6. Color fields match partial `name` (`input[name*]`) — set via `page.evaluate` (hidden color widgets).

## Helper Signature
```javascript
addImageGridBlock(page, option)
// option = {
//   layout: "small",           // "small" or "large"
//   hover: "_none",            // "_none", "fade", "slide"
//   zoom: "_none",             // "_none", "enabled", "disabled"
//   borderWidth: "0",          // string
//   borderRadius: "0",         // string
//   captionBg: false,          // boolean
//   link: "https://...",       // string
//   target: "_self",           // "_self", "_blank"
//   caption: "Test caption",   // string
//   borderColor: "#ff0000",    // hex (optional) — field_mtpc_image_grid_brdr_color
//   captionBgColor: "#f0f0f0", // hex (optional) — field_mtpc_image_grid_cap_bgcol
//   captionTextColor: "#111",  // hex (optional) — field_mtpc_image_grid_cap_txtcol
//   captionTextHover: "#111",  // hex (optional) — field_mtpc_image_grid_cap_txthov
//   // overlayBg / overlayBgHover: NOT supported — overlay BG color fields do not exist
//   media: "name-or-index",    // main image (optional, default first item)
//   mediaOverlay: "name-or-index", // overlay image (optional, default first item)
// }
```

## Frontend Assertion
```javascript
await expect(page.locator("article img").first()).toBeVisible();
```

## Test Coverage
- **6 layout/hover combos** (small+fade, small+none, small+slide, large+fade, large+none, large+slide) — 1 block each, single page
- **Zoom enabled** — 1 block with zoom=enabled
- **All configurable fields** (2 blocks: border+caption colors, then caption text colors)
