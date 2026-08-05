# Page Title Block

## How to Add
- Button: `columnMenu.getByRole("button", { name: "Add Page Title Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container-add-more"]')`
- Wait after adding: none (fields have stable labels)

## Key Fields
| Field | Selector | Type | Required | Valid Values |
|-------|----------|------|----------|-------------|
| Override Page Title | `page.getByRole("textbox", { name: "Override Page Title" })` | text input | No | Any text |
| Alignment | `page.getByLabel("Alignment")` | select | No | `_none`, `left`, `center`, `right` |
| Title Position | `page.locator('select[name*="field_mtpc_pagetitle_position"]').last()` | select | No | `_none`, `top`, `middle`, `bottom` |
| Height [Desktop] | `page.locator('input[name*="field_mtpc_pagetitle_height_desk"]').last()` | number | No | Positive integer |
| Height [Tablet] | `page.locator('input[name*="field_mtpc_pagetitle_height_tab"]').last()` | number | No | Positive integer |
| Height [Mobile] | `page.locator('input[name*="field_mtpc_pagetitle_height_mob"]').last()` | number | No | Positive integer |
| Show Breadcrumbs | `page.getByLabel("Show Breadcrumbs")` | checkbox | No | Boolean |
| Override Breadcrumbs | `page.getByLabel("Override Breadcrumbs")` | checkbox | No | Boolean |
| Breadcrumb URL | `page.locator('input[name*="field_mtpc_pagetitle_bc_item"][name$="[uri]"]')` | text input | No | Path or `<front>` (autocomplete) |
| Breadcrumb Link Text | `page.locator('input[name*="field_mtpc_pagetitle_bc_item"][name$="[title]"]')` | text input | No | Link label |

## Gotchas
1. Column menu Variant B — `[id^="...field-mod-1-col-container-add-more"]` (no `.first()`/`.last()`).
2. Not the simplest block — 10 configurable fields (all optional).
3. Title Position is vertical, not horizontal — `top`, `middle`, `bottom`, NOT left/center/right. Use Alignment for horizontal.
4. Heights are device-specific — separate fields for desktop, tablet, mobile.
5. Breadcrumb URL autocomplete — same as navigation menu / next-previous: fill, wait, click suggestion.

## Helper Signature
```javascript
addPageTitleBlock(page, options?)
// options = {
//   title: "Override Title",        // optional
//   align: "center",                // optional: _none, left, center, right
//   position: "top",                // optional: _none, top, middle, bottom
//   desktopHeight: "150",           // optional: string number
//   tabletHeight: "120",            // optional: string number
//   mobileHeight: "100",            // optional: string number
//   showBreadcrumbs: true,          // optional: boolean
//   overrideBreadcrumbs: true,      // optional: boolean
//   breadcrumbUrl: "<front>",       // optional: path (autocomplete)
//   breadcrumbText: "Home",         // optional: link label
// }
```

## Frontend Assertion
```javascript
await expect(page.getByText("Override Title")).toBeVisible();
await expect(page.getByText("Home").first()).toBeAttached(); // breadcrumb
```
- Page title appears as text (may not be `<h1>` depending on theme)
- Breadcrumb links render when Show Breadcrumbs is checked
