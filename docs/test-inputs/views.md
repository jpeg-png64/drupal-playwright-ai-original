# Views Block — Test Inputs

**Spec:** (combined: `tests/zz-all-blocks.spec.js`) · **Helper:** `addViewsBlock(page, viewName, displayIndex?)`

## Combined usage

- **View name:** `"Events"` (renders content — "News Block" is empty on this site)
- **Display:** index 1 (`Block`)

### View name candidates (verified on UAT 2026-08)

| View name | Display options        | Usable? |
| --------- | ---------------------- | ------- |
| Events    | Block, Block 2, Block 3 | Yes     |
| Content   | `- Select -` only       | No      |

### Hardcoded values inside helper

| Field        | Value    |
| ------------ | -------- |
| Views name   | Events   |
| Display      | index 1  |

## Frontend assertions

- `.paragraph--type--mod-views-block` visible
- `.views-element-container` visible
