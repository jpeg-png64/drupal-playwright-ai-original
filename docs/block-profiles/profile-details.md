# Profile Details Block

## How to Add
- Button: `getByRole("listitem").filter({ hasText: "Add Profile Details Block" })`
- Column menu: `page.locator('[id*="field-mod-1-col-container-add-more"]').last()`
- Wait after adding: 4s

## Key Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Profile Information | `getByLabel("Profile Information").locator("..").getByRole("textbox")` | CKEditor 5 | Yes | Hidden textarea, CKEditor replaces it |
| Picture Information | `getByLabel("Picture info").locator("..").getByRole("textbox")` | CKEditor 5 | Yes | Hidden textarea, CKEditor replaces it |
| Profile Photo | `getByRole("button", { name: "Add media" }).last()` | media library | No | Optional; opens media library modal |
| CSS Classes | `textarea[name*="field_mod_css_classes"]` | textarea | No | Visible, optional |
| Animation Effect | `select[name*="field_mtpc_animation_effect"]` | select | No | `fade-up`, `fade-down`, `fade-right`, `fade-left`, `fade-up-right`, `fade-up-left`, `fade-down-right`, `fade-down-left`, `flip-left`, `flip-right`, `flip-up`, `flip-down`, `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-right`, `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-right`, `zoom-out-left` (21 options) |
| Animation Easing | `select[name*="field_mtpc_animation_easing"]` | select | No | `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `ease-in-back`, `ease-out-back`, `ease-in-out-back`, `ease-in-sine`, `ease-out-sine`, `ease-in-out-sine`, `ease-in-quad`, `ease-out-quad`, `ease-in-out-quad`, `ease-in-cubic`, `ease-out-cubic`, `ease-in-out-cubic`, `ease-in-quart`, `ease-out-quart`, `ease-in-out-quart` (20 options) |
| Animation Duration | `select[name*="field_mtpc_animation_duration"]` | select | No | 0–3000ms in 50ms increments (e.g. `0`, `50`, `100`, ..., `500`, ..., `1000`, ..., `3000`) |
| Animation Repeat | `select[name*="field_mtpc_animation_repeat"]` | select | No | `true` = No Repeat, `false` = Scroll Down, `mirror` = Scroll Up/Down |
| Animation Active | `input[name*="field_mtpc_animation_active"]` | checkbox | No | Unchecked by default |

## Helper Signature
```javascript
addProfileDetailsBlock(page, media?)
// media: name/index of media item (undefined = skip media)
```

## Gotchas
1. Two CKEditor 5 instances (profile info + picture info) — locate via `getByLabel("Profile Information").locator("..").getByRole("textbox")` (label → parent container → textbox).
2. Textareas are hidden (`visible=false`) — CKEditor replaces them with editable div; do NOT fill textarea directly, fill the CKEditor.
3. Column menu uses `.last()`.
4. Menu item via `listitem` + `filter`, not `getByRole("button")`.
5. Media field uses `.last()` (matches other helpers; safe when only one block).

## Frontend Assertion
```javascript
await expect(page.getByText("This is profile information created by Playwright.")).toBeVisible();
await expect(page.getByText("This is picture information created by Playwright.")).toBeVisible();
await expect(page.locator(".media-library-item img")).toBeVisible();
```
- Profile photo (media item) renders in the article body when a media item is set
