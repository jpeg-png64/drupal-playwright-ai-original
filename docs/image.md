# Image Block

## Test Name

`image.spec.js` → `test.describe("Image Block")` → `test("Default")`

## What the Test Does

1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Image Test Page"`
4. `addOneColumnSection(page, "Image Section")`
5. `addImageBlock(page, { captionBg: false, originalSize: false, align: "_none", target: "_self" })`
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
8. Assert: `expect(page.locator("article img").first()).toBeVisible()`

## Test Data

| captionBg | originalSize | align  | target |
| --------- | ------------ | ------ | ------ |
| false     | false        | \_none | \_self |

## Imports Required

```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addImageBlock } from "../helpers/image.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature

```javascript
addImageBlock(page, config);
// config: { captionBg: boolean, originalSize: boolean,
//   align: "_none"|"_left"|"_center"|"_right", target: "_self"|"_blank" }
// media? — name or index (default first item)
```

**Calling without config throws `TypeError: Cannot read properties of undefined`.**

## Rules

- All 4 config fields required.
- `collapseCurrentBlock(page)` after every block.
- `.first()` on `article img` assertions (multiple images).
- `force: true` on media item clicks.
- Modal timeouts 20s (slower image processing).
