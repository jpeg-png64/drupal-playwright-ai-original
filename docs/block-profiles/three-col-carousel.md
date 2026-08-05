# 3-Column Carousel Block

## How to Add
- Button: `getByRole("button", { name: "Add 3-Column Carousel Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`
- Wait after adding: 3s

## Key Fields

### Block-Level Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| CSS Classes | `page.getByRole("textbox", { name: "Additional CSS classes apply to 3-column carousel block" }).last()` | text input | No | Optional CSS class |
| Heading | `page.locator(".ck-editor__editable").first()` | CKEditor 5 | No | Block heading |

### Item-Level Fields (per carousel item)
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Active | `item.getByRole("checkbox", { name: "Active" })` | checkbox | No | Checked by default |
| Image | `item.getByRole("button", { name: "Add media" })` | media button | Yes | Scoped to item |
| Caption | `item.getByRole("textbox", { name: "Image Caption" })` | text input | No | Image caption |
| Title | `item.getByRole("textbox", { name: "Title" })` | text input | No | Carousel title |
| Link | `item.getByRole("textbox", { name: "Link" })` | text input | No | URL |
| Description | `item.getByRole("textbox", { name: /Rich Text Editor/ }).last()` | CKEditor 5 | No | Description text |

## Gotchas
1. Items container via `data-drupal-selector` — `[data-drupal-selector$="field-mtpc-3col-carousel-item-${index}-subform"]`.
2. Media button scoped to item — NOT `getByRole("button", { name: "Add media" }).last()`. Use `item.getByRole("button", { name: "Add media" })`.
3. 3 items created in loop — helper calls `addCarouselItem(page, i)`.
4. Heading uses `.first()` — `page.locator(".ck-editor__editable").first()`.

## Helper Signature
```javascript
addThreeColCarouselBlock(page, options = {})
// options:
//   media: ["name-or-index", "name-or-index", "name-or-index"] // per item (optional, default first item each)
// Creates 3 items with hardcoded settings
```

## Frontend Assertion
```javascript
await expect(page.getByText("Carousel Title 0")).toBeVisible();
await expect(page.getByText("Carousel Title 1")).toBeVisible();
await expect(page.getByText("Carousel Title 2")).toBeVisible();
```
