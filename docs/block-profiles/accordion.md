# Accordion Block

## How to Add
- Button: `getByRole("button", { name: "Add Accordion Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`
- Wait after adding: 4s

## Key Fields

### Block-Level Fields
| Field | Selector | Type | Required | Valid Values |
|-------|----------|------|----------|-------------|
| Icon Style | `page.locator('select[name*="field_mtpc_accordion_icon_style"]').last()` | select | No | `number`, `icon` (page-wide, not in block container) |
| Numeric Start | `page.locator('input[name*="field_mtpc_numeric_start"]').last()` | input | No | Number (page-wide, not in block container) |
| Font Awesome Icon Style | `page.locator('select[name*="field_mtpc_fa_acc_icon_style"]').last()` | select | No | Select by label: `Font Awesome Brands`, `Font Awesome Pro`, `Font Awesome Duotone` (machine values `fab`, `fas`, `fad`) |
| FA Icon (Collapsed) | `page.locator('input[name*="field_mtpc_fa_acc_icon_collapsed"]').last()` | input | No | Icon class, e.g. `fa-solid fa-star` — currently NOT filled (empty in test-inputs) |
| FA Icon (Expanded) | `page.locator('input[name*="field_mtpc_fa_acc_icon_expanded"]').last()` | input | No | Icon class, e.g. `fa-solid fa-star` — currently NOT filled (empty in test-inputs) |

### Item-Level Fields (per accordion item)
| Field | Selector | Type | Required | Valid Values |
|-------|----------|------|----------|-------------|
| Title | `block.locator('textarea[name*="field_mtpc_accordion_title"]').last()` | textarea | Yes | Any text |
| Expanded | `block.locator('input[name*="field_mtpc_accordion_expended"]').last()` | checkbox | No | Boolean (typo "expended" in Drupal) |
| Content | `page.getByRole("textbox", { name: "Rich Text Editor. Editing" }).last()` | CKEditor 5 | Yes | HTML content |

## Gotchas
1. Icon style & numeric start NOT in block container (parent container) — page-wide `.last()`; do NOT scope to `div.paragraphs-subform`.
2. "Expanded" typo in Drupal — field is `field_mtpc_accordion_expended`; checkbox works despite typo.
3. CKEditor 5, not 4 — `getByRole("textbox", { name: "Rich Text Editor. Editing" })`.
4. Multi-value field `field_mod_container0` — items at `[0]`, `[1]`, ...; add via `getByRole("button", { name: "Add Accordion Item" }).last()`.
5. Title is textarea, not input — `textarea[name*="field_mtpc_accordion_title"]`.

## Adding Items
```javascript
await page.getByRole("button", { name: "Add Accordion Item" }).last().click();
await page.waitForTimeout(2000);
await page.locator('textarea[name*="field_mtpc_accordion_title"]').last().fill("Title");
await page.locator('input[name*="field_mtpc_accordion_expended"]').last().check();
await page.getByRole("textbox", { name: "Rich Text Editor. Editing" }).last().fill("<p>Content</p>");
```

## Number Icon Style
```javascript
await page.locator('select[name*="field_mtpc_accordion_icon_style"]').last().selectOption("number");
await page.waitForTimeout(1000);
await page.locator('input[name*="field_mtpc_numeric_start"]').last().fill("5");
```

## Font Awesome Icon Style (select by label)
```javascript
await page.locator('select[name*="field_mtpc_fa_acc_icon_style"]').last().selectOption({ label: "Font Awesome Brands" });
```

## Frontend Assertion
```javascript
await expect(page.getByText("Test Accordion Title")).toBeVisible();
await expect(page.getByText("Test accordion content")).toBeVisible();
```
- Title appears as a clickable header; content appears when expanded
