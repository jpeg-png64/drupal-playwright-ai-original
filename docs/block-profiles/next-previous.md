# Next & Previous Block

## How to Add
- Button: `"Next & Previous Block"` — `page.locator('input[value*="Next"][value*="Previous"]').click()`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container-add-more"]')`

## Key Fields

### Next Link
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| URI | `input[data-drupal-selector*="field-mtpc-next-link"][data-drupal-selector$="uri"]` | autocomplete | Yes | Fill → click `.ui-autocomplete:visible li` |
| Title | `input[data-drupal-selector*="field-mtpc-next-link"][data-drupal-selector$="title"]` | text input | No | Arrow label (default `>`) |

### Previous Link
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| URI | `input[data-drupal-selector*="field-mtpc-previous-link"][data-drupal-selector$="uri"]` | autocomplete | Yes | Fill → click `.ui-autocomplete:visible li` |
| Title | `input[data-drupal-selector*="field-mtpc-previous-link"][data-drupal-selector$="title"]` | text input | No | Arrow label (default `<`) |

### Color Fields
| Field | Selector | Type | Notes |
|-------|----------|------|-------|
| BG Color | `input[name*="field_mtpc_next_previous_bg"]` | text (hex) | `#f0f0f0` |
| Link Color | `input[name*="field_mtpc_next_previous_color"]` | text (hex) | `#333333` |
| Border Color | `input[name*="field_mtpc_next_previous_border"]` | text (hex) | `#cccccc` |
| BG Hover Color | `input[name*="field_mtpc_next_prev_bg_hvr"]` | text (hex) | `#e0e0e0` |
| Link Hover Color | `input[name*="field_mtpc_next_prev_clr_hvr"]` | text (hex) | `#000000` |
| Border Hover Color | `input[name*="field_mtpc_next_prev_brdr_hvr"]` | text (hex) | `#999999` |

## Gotchas
1. Column menu Variant B — `[id^="...field-mod-1-col-container-add-more"]` (not `.last()`).
2. Add button via `input[value]`, not `getByRole("button")` — `input[value*="Next"][value*="Previous"]`.
3. Autocomplete for links — fill → **wait ~2s for `.ui-autocomplete:visible li`** → click first. The helper already waits.
4. Link fields use `data-drupal-selector`, not `name`.
5. Color fields match partial `name` with `.last()`.
6. **Dependency:** the autocomplete needs an existing node for each search term. Defaults are `"Test Page"` / `"Test 2"` — specs that do NOT create matching nodes must pass `nextSearch` / `prevSearch` pointing at nodes they created (e.g. the current test page). The helper's autocomplete works against published nodes; passing a search term for the page under test is the safest choice.

## Helper Signature
```javascript
addNextPreviousBlock(page, options = {})
// options (all optional):
//   nextSearch         - Autocomplete search term for Next URI (default "Test Page")
//   prevSearch         - Autocomplete search term for Previous URI (default "Test 2")
//   nextTitle          - Next link label (default ">")
//   prevTitle          - Previous link label (default "<")
//   bgColor            - BG color hex
//   linkColor          - Link color hex
//   borderColor        - Border color hex
//   bgHoverColor       - BG hover color hex
//   linkHoverColor     - Link hover color hex
//   borderHoverColor   - Border hover color hex
```

## Frontend Assertion
```javascript
await expect(page.getByText(nextLabel).first()).toBeVisible();
await expect(page.getByText(prevLabel).first()).toBeVisible();
```

## Test Coverage
- **Default** (1 block, title+label only)
- **All configurable fields** (2 blocks: 3 color fields + custom labels, then 3 hover color fields + alternate labels)
