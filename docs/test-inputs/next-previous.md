# Next / Previous — Test Inputs

**Spec:** `tests/next-previous.spec.js` · **Helper:** `addNextPreviousBlock(page, options?)`

Each test first creates two published link-target pages (e.g. "Next Target" / "Previous Target") so the autocomplete always resolves, then passes those titles via `nextSearch` / `prevSearch`.

## Test 1: Default

- **Page title:** "Next Previous Test"
- **Link targets:** "Next Target" / "Previous Target"
- **Section:** "Nav Section"
- `addNextPreviousBlock(page, { nextSearch: "Next Target", prevSearch: "Previous Target" })` — autocomplete fills next/prev links

## Test 2: All configurable fields (2 blocks)

- **Page title:** "Next Previous Colors Test"
- **Link targets:** "Next Target Colors" / "Previous Target Colors"
- **Section:** "Color Section"

### Block 1 — custom labels + colors

| Field       | Value         |
| ----------- | ------------- |
| nextTitle   | Next Page     |
| prevTitle   | Previous Page |
| bgColor     | #f0f0f0       |
| linkColor   | #333333       |
| borderColor | #cccccc 　    |

### Block 2 — hover colors

| Field            | Value   |
| ---------------- | ------- |
| nextTitle        | >>      |
| prevTitle        | <<      |
| bgHoverColor     | #e0e0e0 |
| linkHoverColor   | #000000 |
| borderHoverColor | #999999 |

## Frontend assertions

- Test 1: ">" and "<" visible
- Test 2: "Next Page", "Previous Page", ">>", "<<" visible
