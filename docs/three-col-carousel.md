# 3-Column Carousel Block

## Test Name
`three-col-carousel.spec.js` → `test.describe("3-Column Carousel Block")` → `test("Default")`
**Timeout: 600000ms (10 min)**

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"3-Column Carousel Test"`
4. `addOneColumnSection(page, "Carousel Section")`
5. `addThreeColCarouselBlock(page)` — creates 3 items internally
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
8. Assert visible: "Carousel Highlight Title", "Caption 0" (`.first()`), "Carousel Title 0" (`.first()`)

## Test Data
| Setting | Value |
|---------|-------|
| CSS classes | test-carousel |
| Heading | Carousel Highlight Title |
| Item i caption | Caption {i} |
| Item i title | Carousel Title {i} |
| Item i link | https://www.youtube.com/watch?v=RwpiDqdugYY |
| Item i description | Description for carousel item {i} |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addThreeColCarouselBlock } from "../helpers/three-col-carousel.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addThreeColCarouselBlock(page, options = {})
// options.media: ["name-or-index", ...] per item (optional, default first item each)
// Creates 3 items with hardcoded settings
```

## Rules
- `test.setTimeout(600000)` — 3 media modal cycles exceed default timeout.
- `collapseCurrentBlock(page)` after every block.
- Wait 15s for carousel items before interacting.
- `.first()` on caption/title assertions (duplicate elements).
- `force: true` on media item clicks.
- Heading uses `.first()` (not `.last()`).
