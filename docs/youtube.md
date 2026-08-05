# YouTube Block

## Test Name
`youtube.spec.js` → `test.describe("YouTube Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"YouTube Test Page"`
4. `addOneColumnSection(page, "YouTube Section")`
5. `addYoutubeBlock(page, "1280", "550")`
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })` → `waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 })` → `waitForLoadState("load")`
8. Assert: `page.locator("article iframe").first()` visible

## Test Data
| Video ID | Width | Height |
|----------|-------|--------|
| vBmU5v2EyxM | 1280 | 550 |

Video ID hardcoded inside the helper.

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addYoutubeBlock } from "../helpers/youtube.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addYoutubeBlock(page, width?, height?)
// width: string, default "1280"
// height: string, default "550"
// Video ID hardcoded to "vBmU5v2EyxM"
```

## Rules
- **Publish uses `waitForFunction` + `waitForLoadState("load")`, NOT `networkidle`** — the external YouTube iframe never stops loading, so `networkidle` times out.
- Video ID hardcoded — do not pass as a parameter.
- Width/height passed as **strings**, not numbers.
- Wait for `input[name*="field_youtube_embed_url"]` `.last()` visible (15s) before filling.
- `collapseCurrentBlock(page)` after every block.
- `.first()` on `article iframe` (multiple iframes).
- **Width/height hard minimum 50px** — Drupal blocks values under 50 (stress test: 50x50 and 5000x5000 both work).
