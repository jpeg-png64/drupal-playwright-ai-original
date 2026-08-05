# Icon & Text Highlight Block

## How to Add
- Button: `getByRole("button", { name: "Add Icon & Text Highlight Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`
- Wait after adding: 3s

## Key Fields

### Block-Level Fields (NOT in block container)
| Field | Selector | Type | Required | Valid Values |
|-------|----------|------|----------|-------------|
| Highlight Style | `page.locator('select[data-drupal-selector*="field-mtpc-highlight-style"]').last()` | select | No | `two` (2-Column), `three` (3-Column), `four` (4-Column) |
| Highlight Display | `page.locator('select[data-drupal-selector*="field-mtpc-highlight-display"]').last()` | select | No | `top` (Top), `middle` (Middle) |
| Heading Display | `page.locator('select[data-drupal-selector*="field-mtpc-highlight-h-display"]').last()` | select | No | `left` (Left), `center` (Center) |
| Icon Text Style | `page.locator('select[data-drupal-selector*="field-mtpc-icon-text-style"]').last()` | select | No | `row` (Row), `column` (Column) |
| Tablet Columns | `page.locator('select[data-drupal-selector*="field-mtpc-tablet-columns"]').last()` | select | No | `two` (Two Columns), `original` (Original Columns) |

### Item-Level Fields (per highlight item)
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Icon | `page.locator('input[data-drupal-selector*="field-mtpc-highlight-icon"]').last()` | text input | Yes | Font Awesome class (e.g. `fa-light fa-graduation-cap`) |
| Text | `page.locator(".ck-editor__editable").last()` | CKEditor 5 | Yes | HTML content |

## Gotchas
1. All dropdowns NOT in block container (parent container) — page-wide `.last()`.
2. CKEditor 5 uses `.ck-editor__editable`, not getByRole — `page.locator(".ck-editor__editable").last()`, wait for visibility.
3. Icon field expects Font Awesome class incl. style prefix — e.g. `fa-light fa-graduation-cap`.

## Helper Signature
```javascript
addIconTextHighlightBlock(page, options?)
// options = {
//   highlightStyle: "two",      // default
//   highlightDisplay: "top",    // default
//   headingDisplay: "center",   // default
//   iconTextStyle: "row",       // default
//   tabletColumns: "original",  // default
//   icon: "fa-light fa-graduation-cap",  // default
//   text: "<h3>...</h3><p>...</p>",      // default
// }
```

## Frontend Assertion
```javascript
await expect(page.getByText("Playwright Highlight Test")).toBeVisible();
```
