# Profile Listing Block

## How to Add
- Button: `getByRole("listitem").filter({ hasText: "Add Profile Listing Block" })`
- Column menu: `page.locator('[id*="field-mod-1-col-container-add-more"]').last()`
- Wait after adding: 3s

## Key Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| List Title | `page.getByRole("textbox", { name: "List Title" }).last()` | text input | Yes | Display title |
| Profile Link | `page.getByRole("textbox", { name: "Profile Link" }).last()` | text input | Yes | URL (e.g. `<front>`) |
| Open in New Tab | `page.getByRole("checkbox", { name: "Open Link in a new tab" }).last()` | checkbox | No | Boolean |
| English Name | `page.getByRole("textbox", { name: "English Name" }).last()` | text input | Yes | Name in English |
| Chinese Name | `page.getByRole("textbox", { name: "Chinese Name" }).last()` | text input | Yes | Name in Chinese |
| Profile Details | `page.getByRole("textbox", { name: "Rich Text Editor. Editing" }).last()` | CKEditor 5 | Yes | Description text |
| Layout | `page.locator('select[name*="field_mtpc_pl_list_style"]').last()` | select | Yes | `one_col`, `two_col` |

## Gotchas
1. Column menu uses `.last()` — `[id*="field-mod-1-col-container-add-more"].last()`.
2. Menu item via `listitem` + `filter`, not `getByRole("button")`.
3. All fields use `getByRole` — not `select[name*="..."]` or `input[name*="..."]`.

## Helper Signature
```javascript
addProfileListingBlock(page, layout = "one_col")
// layout: "one_col" or "two_col"
```

## Frontend Assertion
```javascript
await expect(page.getByText("Playwright Profile Listing")).toBeVisible();
await expect(page.getByText("Aea")).toBeVisible();
await expect(page.getByText("艾雅")).toBeVisible();
```
