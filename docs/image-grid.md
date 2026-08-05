# Image Grid Block

## Test Name

`image-grid.spec.js` → `test.describe("Image Grid Block - All Layout/Overlay Combinations")` → 6 layout/hover combos + Zoom Enabled + All configurable fields

## What the Test Does

Each combo test (1 block per page, no collapse):

1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Grid ${layoutName} ${hoverName}"`
4. `addOneColumnSection(page, "Test Section")`
5. `addImageGridBlock(page, { layout, hover, zoom: "disabled", borderWidth: "2", borderRadius: "8", captionBg: true, link: "https://example.com", target: "_self", caption: "${layoutName} ${hoverName}" })`
6. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
7. Assert: `expect(page.locator("article img").first()).toBeVisible()`

## Test Data

| Test Name            | Layout | Hover  | Caption            |
| -------------------- | ------ | ------ | ------------------ |
| Four Images + None   | small  | \_none | Four Images None   |
| Four Images + Fade   | small  | fade   | Four Images Fade   |
| Four Images + Slide  | small  | slide  | Four Images Slide  |
| Three Images + None  | large  | \_none | Three Images None  |
| Three Images + Fade  | large  | fade   | Three Images Fade  |
| Three Images + Slide | large  | slide  | Three Images Slide |

## Imports Required

```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addImageGridBlock } from "../helpers/image-grid.js";
```

## Helper Signature

```javascript
addImageGridBlock(page, option);
// option: { layout: "small"|"large", hover: "_none"|"fade"|"slide",
//   zoom: "_none"|"enabled"|"disabled", borderWidth: string, borderRadius: string,
//   captionBg: boolean, link: string, target: "_self"|"_blank", caption: string }
// media? / mediaOverlay? — media name or index (default first item)
```

## Rules

- All config fields required — omitting any throws `TypeError`.
- Hover/zoom use `_none` (underscore), not `"none"`.
- Each grid needs two media inserts: main image + overlay image.
- Use `force: true` on media item clicks.
- Use `.first()` on `article img` assertions (multiple images produced).
- No `collapseCurrentBlock` — one block per page.
