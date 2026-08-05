# Image Block

## How to Add
- Button: `getByRole("button", { name: "Add Image Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`
- Wait after adding: 3s

## Key Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Image | `page.getByRole("button", { name: "Add media" }).last()` | Media library | Yes | Global selector, not scoped to block |
| Image Caption | `block.locator('textarea[name*="field_mod_image_caption"]')` | textarea | No | Directly editable |
| Caption Background | `block.locator('input[name*="field_mtpc_image_caption_bg"]')` | checkbox | No | Unchecked by default |
| Original Size | `block.locator('input[name*="field_mtpc_image_original_size"]')` | checkbox | No | Unchecked by default |
| Image Alignment | `block.locator('select[name*="field_mtpc_image_align_position"]')` | select | No | `_none`, `_left`, `_right`, `_center` |
| Link URL | `block.locator('input[name*="field_mtpc_mod_link"][name$="[uri]"]')` | text input | No | Optional hyperlink |
| Link Target | `block.locator('select[name*="field_mtpc_mod_link"][name$="[target]"]')` | select | No | `_self`, `_blank`, `_parent`, `_top` |
| CSS Classes | `block.locator('textarea[name*="field_mod_css_classes"]')` | textarea | No | Optional |
| Animation Effect | `select[name*="field_mtpc_animation_effect"]` | select | No | `fade-up`, `fade-down`, `fade-right`, `fade-left`, `fade-up-right`, `fade-up-left`, `fade-down-right`, `fade-down-left`, `flip-left`, `flip-right`, `flip-up`, `flip-down`, `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-right`, `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-right`, `zoom-out-left` (21 options) |
| Animation Easing | `select[name*="field_mtpc_animation_easing"]` | select | No | `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `ease-in-back`, `ease-out-back`, `ease-in-out-back`, `ease-in-sine`, `ease-out-sine`, `ease-in-out-sine`, `ease-in-quad`, `ease-out-quad`, `ease-in-out-quad`, `ease-in-cubic`, `ease-out-cubic`, `ease-in-out-cubic`, `ease-in-quart`, `ease-out-quart`, `ease-in-out-quart` (20 options) |
| Animation Duration | `select[name*="field_mtpc_animation_duration"]` | select | No | 0–3000ms in 50ms increments (e.g. `0`, `50`, `100`, ..., `500`, ..., `1000`, ..., `3000`) |
| Animation Repeat | `select[name*="field_mtpc_animation_repeat"]` | select | No | `true` = No Repeat, `false` = Scroll Down, `mirror` = Scroll Up/Down |
| Animation Active | `input[name*="field_mtpc_animation_active"]` | checkbox | No | Unchecked by default |

## Gotchas
1. Media button NOT inside block container — `div.paragraphs-subform` scoped locator finds 0 media buttons; use global `page.getByRole("button", { name: "Add media" }).last()`.
2. No new fields after media insert — same 6 selects, 1 input, 3 checkboxes, 2 textareas before/after; no AJAX rebuild.
3. Config required — `addImageBlock(page, config)` needs all 4: `{ captionBg, originalSize, align, target }`; omitting throws `TypeError: Cannot read properties of undefined`. `media` optional (name/index, default first item).
4. Checkbox defaults — `captionBg` & `originalSize` unchecked by default; `false` in config = "don't change default."

## Frontend Assertion
```javascript
await expect(page.locator("article img")).toBeVisible();
await expect(page.locator("article img")).toHaveAttribute(
  "src",
  /\/sites\/default\/files\/.*\.jpg/
);
```
- Image renders in `<article>`; src pattern `/sites/default/files/YYYY-MM/filename.jpg`
