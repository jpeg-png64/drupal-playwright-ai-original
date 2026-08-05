# Text Area Block

## How to Add
- Button: `getByRole("listitem").filter({ hasText: "Add Text Area Block" })`
- Column menu: `page.locator('[id*="field-mod-1-col-container-add-more"]').last()`
- Wait after adding: 3s

## Key Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Content | `page.getByRole("textbox", { name: "Rich Text Editor. Editing" }).last()` | CKEditor 5 | Yes | HTML content |

## Gotchas
1. Column menu uses `.last()` — `[id*="field-mod-1-col-container-add-more"].last()`.
2. Menu item via `listitem` + `filter`, not `getByRole("button")`.
3. Only 1 field (CKEditor content) — simplest block.

## Helper Signature
```javascript
addTextAreaBlock(page, text)
// text: string — HTML content
```

## Frontend Assertion
```javascript
await expect(page.getByText("This is a text area block created by Playwright.")).toBeVisible();
```
