# Image Grid — Test Inputs

**Spec:** `tests/image-grid.spec.js` · **Helper:** `addImageGridBlock(page, option)`

## Tests 1–6: Layout/Overlay combinations (@media-modal)

Each test = 1 block. **Page title:** `Grid {Layout} {Hover}` · **Section:** "Test Section"

| Test                 | layout | hover  | zoom     | caption            |
| -------------------- | ------ | ------ | -------- | ------------------ |
| Four Images + None   | small  | \_none | disabled | Four Images None   |
| Four Images + Fade   | small  | fade   | disabled | Four Images Fade   |
| Four Images + Slide  | small  | slide  | disabled | Four Images Slide  |
| Three Images + None  | large  | \_none | disabled | Three Images None  |
| Three Images + Fade  | large  | fade   | disabled | Three Images Fade  |
| Three Images + Slide | large  | slide  | disabled | Three Images Slide |

**Shared config (all 6):** borderWidth `2`, borderRadius `8`, captionBg `true`, link `https://example.com`, target `_self`, media `1170_home.png`, mediaOverlay `image-placeholder-2.jpg`

## Test 7: Zoom Enabled (@media-modal)

- **Page title:** "Grid Zoom Enabled" · **Section:** "Test Section"
- layout `small`, hover `fade`, **zoom `enabled`**, borderWidth `2`, borderRadius `8`, captionBg `true`, link `https://example.com`, target `_self`, caption "Zoom Enabled Grid", media `1170_home.png`, mediaOverlay `image-placeholder-2.jpg`

## Test 8: All configurable fields (@media-modal)

- **Page title:** "Grid All Fields" · **Section:** "Color Section"

### Block 1 — border + caption colors

| Field                      | Value                        |
| -------------------------- | ---------------------------- |
| layout                     | small                        |
| hover                      | \_none                       |
| zoom                       | \_none                       |
| borderWidth / borderRadius | 3 / 10                       |
| captionBg                  | true                         |
| link / target              | https://example.com / \_self |
| caption                    | Block One                    |
| borderColor                | #ff0000                      |
| captionBgColor             | #f0f0f0                      |
| media                      | 1170_home.png                |
| mediaOverlay               | image-placeholder-2.jpg      |

### Block 2 — overlay colors

| Field                      | Value                         |
| -------------------------- | ----------------------------- |
| layout                     | large                         |
| hover                      | fade                          |
| zoom                       | disabled                      |
| borderWidth / borderRadius | 1 / 4                         |
| captionBg                  | false                         |
| link / target              | https://example.com / \_blank |
| caption                    | Block Two                     |
| overlayBg                  | rgba(0,0,0,0.3)               |
| overlayBgHover             | rgba(0,0,0,0.7)               |
| media                      | 1170_home.png                 |
| mediaOverlay               | image-placeholder-2.jpg       |

## Media selection

`option.media` (main image) and `option.mediaOverlay` (overlay image) are **optional** — omit for first item. Pass a media **name** (filename/title) or numeric **index**. See `docs/test-inputs/INDEX.md` → Media library for available files.

## Frontend assertions

- `article img` visible (first / last)
