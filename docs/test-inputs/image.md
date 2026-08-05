# Image — Test Inputs

**Spec:** `tests/image.spec.js` · **Helper:** `addImageBlock(page, config)`

## Test 1: Default

- **Page title:** "Image Test Page"
- **Section:** "Image Section"

| Field        | Value               |
| ------------ | ------------------- |
| captionBg    | false               |
| originalSize | false               |
| align        | \_none              |
| target       | \_self              |
| media        | (none — first item) |

## Test 2: With Animation

- **Page title:** "Image Animation Test Page"
- **Section:** "Image Section"

Same config as Test 1, then animation fields:

| Field              | Value       |
| ------------------ | ----------- |
| animation_active   | checked     |
| animation_effect   | fade-up     |
| animation_easing   | ease-in-out |
| animation_duration | 500         |
| animation_repeat   | true        |

## Frontend assertions

- `article img` visible, src matches `/sites/default/files/.*\.jpg`

## Media selection

`config.media` is **optional**. Omit it (or pass `undefined`) to use the first item in the library. Pass a media **name** (filename or title, e.g. `"1170_home.png"`) or a numeric **index** to pick a specific item. See `docs/test-inputs/INDEX.md` → Media library for available files.
