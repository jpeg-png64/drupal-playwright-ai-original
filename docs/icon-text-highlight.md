# Icon & Text Highlight Block

## Test Name
`icon-text-highlight.spec.js` → `test.describe("Icon & Text Highlight Block")` → `test("All column styles on one page")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Icon Text Highlight Test"`
4. `addOneColumnSection(page, "Highlight Section")`
5. Per block below: `addIconTextHighlightBlock(page, {...})` then `collapseCurrentBlock(page)`
6. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
7. Assert visible (`.first()`): Two Column Highlight, Three Column Highlight, Four Column Highlight

## Test Data
| Block | Style | Display | Heading | Icon Style | Tablet | Icon | Text Heading |
|-------|-------|---------|---------|------------|--------|------|-------------|
| 1 | two | top | center | row | original | fa-light fa-graduation-cap | Two Column Highlight |
| 2 | three | middle | left | column | two | fa-solid fa-star | Three Column Highlight |
| 3 | four | top | center | row | original | fa-duotone fa-heart | Four Column Highlight |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addIconTextHighlightBlock } from "../helpers/icon-text-highlight.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addIconTextHighlightBlock(page, options?)
// options: { highlightStyle: "two"|"three"|"four", highlightDisplay: "top"|"middle",
//   headingDisplay: "left"|"center", iconTextStyle: "row"|"column",
//   tabletColumns: "original"|"two", icon: string, text: string (HTML) }
```

## Rules
- `collapseCurrentBlock(page)` after every block.
- Uses CKEditor 5 (`.ck-editor__editable`), not CKEditor 4 (`.cke_wysiwyg_div`).
- Wait for `.ck-editor__editable` visible (10s) before clicking/filling.
- `.first()` on text assertions (headings may repeat).
- FA icon classes include style prefix: `"fa-light fa-graduation-cap"`.
- `text` must be HTML: `<h3>Title</h3><p>Description</p>`.
