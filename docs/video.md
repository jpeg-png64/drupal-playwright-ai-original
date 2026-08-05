# Video Block

## Test Name
`video.spec.js` → `test.describe("Video Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Video Test Page"`
4. `addOneColumnSection(page, "Video Section")`
5. `addVideoBlock(page, { url: "https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D", width: 640, height: 360, autoplay: false })`
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })` → `waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 })` → `waitForLoadState("load")`
8. Assert: `page.locator("article iframe, article video").first()` visible

## Test Data
| url | width | height | autoplay |
|-----|-------|--------|----------|
| https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D | 640 | 360 | false |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addVideoBlock } from "../helpers/video.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addVideoBlock(page, config)
// config: { url: string, width: number, height: number, autoplay: boolean (default false) }
// url, width, height REQUIRED
```

## Rules
- **Publish uses `waitForFunction` + `waitForLoadState("load")`, NOT `networkidle`** — the external HKUST video player never stops loading, so `networkidle` times out.
- Select `hkust_video` type first, wait 1500ms AJAX, then fill embed URL — the URL field doesn't exist until the type is selected.
- Autoplay checkbox via `input[name*="field_mtpc_youtube_autoplay"]` `.last()`, only if `autoplay` truthy.
- Wait 5000ms after adding the block for the form to render.
- `collapseCurrentBlock(page)` after every block.
- `.first()` on `article iframe, article video` (multiple embeds).
- **Width/height hard minimum 50px** — Drupal blocks values under 50 (stress test: 50x50 and 5000x5000 both work).
