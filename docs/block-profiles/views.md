# Views Block

## How to Add
- Button: `page.locator("li.add-more-button-mod-views-block input")` — CSS class based, not `getByRole`
- Column menu: `page.locator('[id*="field-mod-1-col-container-add-more"]').last()`
- Wait after adding: 4s

## Key Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Views name | `page.getByLabel("Views name")` | autocomplete | Yes | Type name, wait 2s, click `.ui-autocomplete li.ui-menu-item` first |
| Display | `page.getByLabel("Display").last()` | select | Yes | Options depend on view (e.g. `block_1`); helper picks first non-empty option |
| CSS Classes | `textarea[name*="field_mod_css_classes"]` | textarea | No | Block-level |

## Gotchas
1. Add button is a CSS-class `li.add-more-button-mod-views-block input`, not a named button.
2. Views name is an entity-reference autocomplete: fill → wait 2s → click first `.ui-autocomplete li.ui-menu-item`.
3. Display select is required; value options appear only after the view name is selected. Default `- Select -` blocks publishing.
4. View content depends on site content; the container `.views-element-container` renders even when empty.

## Helper Signature
```javascript
addViewsBlock(page, viewName, displayIndex = 1)
// viewName: e.g. "Events" (views with no display options are skipped); displayIndex: 1-based index of the Display option
```

## Frontend Assertion
```javascript
await expect(page.locator(".paragraph--type--mod-views-block").last()).toBeVisible();
await expect(page.locator(".views-element-container").last()).toBeVisible();
```
