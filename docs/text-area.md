# Text Area Block

## Test Name
`text-area.spec.js` → `test.describe("Text Area Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Text Area Test"`
4. `addOneColumnSection(page, "Text Area Section")`
5. `addTextAreaBlock(page, "<p>Playwright Text Area Test</p>")`
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
8. Assert: `expect(page.getByText("Playwright Text Area Test")).toBeVisible()`

## Test Data
| Content |
|---------|
| `<p>Playwright Text Area Test</p>` |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addTextAreaBlock } from "../helpers/text-area.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addTextAreaBlock(page, text)  // text: HTML content
```

## Multi-Block Inline Pattern
Helper uses `.first()` on the column menu — **breaks in multi-block pages**. Inline with `.last()`:

```javascript
await page
  .locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]')
  .last()
  .getByRole("button", { name: "List additional actions" })
  .click();
await page.getByRole("button", { name: "Add Text Area Block" }).click();
const editor = page.locator(".ck-editor__editable").last();
await expect(editor).toBeVisible({ timeout: 15000 });
await editor.click();
await editor.fill("<p>Content here</p>");
```

## Rules
- Helper safe for single-block tests only; inline with `.last()` for multi-block pages.
- `collapseCurrentBlock(page)` after every block.
- Helper uses `.first()` on column menu + `getByRole("listitem").filter({ hasText: "Add Text Area Block" })`.
