# Page Title Block

## Test Name
`page-title.spec.js` → `test.describe("Page Title Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Page Title Test"`
4. `addOneColumnSection(page, "Title Section")`
5. `addPageTitleBlock(page, { title: "Override Title", align: "center" })`
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
8. Assert: `expect(page.getByText("Override Title")).toBeVisible()`

## Test Data
| Override Title | Alignment |
|----------------|-----------|
| Override Title | center |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addPageTitleBlock } from "../helpers/page-title.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addPageTitleBlock(page, options?)
// options: { title: string, align: "left"|"center"|"right" }
```

## Rules
- Uses unique column menu selector (`-add-more` suffix) — no `.last()` needed.
- `collapseCurrentBlock(page)` after every block.
- If no override title, original page title is shown.
