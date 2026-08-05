# Next & Previous Block

## Test Name
`next-previous.spec.js` → `test.describe("Next & Previous Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Next Previous Test"`
4. `addOneColumnSection(page, "Nav Section")`
5. `addNextPreviousBlock(page)` — no params, all hardcoded
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
8. Assert visible: `page.getByText(">")`, `page.getByText("<")`

## Test Data
| Next Link | Next Label | Previous Link | Previous Label |
|-----------|------------|---------------|----------------|
| Test Page | > | Test 2 | < |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addNextPreviousBlock } from "../helpers/next-previous.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addNextPreviousBlock(page)  // no parameters — all values hardcoded
```

## Rules
- Add block button uses `input[value*="Next"][value*="Previous"]`, not `getByRole("button")`.
- "Test Page" and "Test 2" must exist in Drupal for autocomplete.
- `collapseCurrentBlock(page)` after every block.
- Helper takes no parameters.
