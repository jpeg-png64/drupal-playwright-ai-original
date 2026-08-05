# Views Block — Test Inputs

**Spec:** (combined: `tests/zz-all-blocks.spec.js`) · **Helper:** `addViewsBlock(page, viewName, displayIndex?)`

## Combined usage

- **View name:** `"Events"` (renders content — "News Block" is empty on this site)
- **Display:** index 1 (`Block`)

### Hardcoded values inside helper

| Field        | Value    |
| ------------ | -------- |
| Views name   | Events   |
| Display      | index 1  |

## Frontend assertions

- `.paragraph--type--mod-views-block` visible
- `.views-element-container` visible
