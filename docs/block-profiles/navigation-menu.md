# Navigation Menu Block

## How to Add
- Button: `getByRole("button", { name: "Add Navigation Menu Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`
- Wait after adding: 3s

## Key Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Menu Name | `page.getByRole("textbox", { name: "Navigation Menu", exact: true }).last()` | autocomplete | Yes | Must exist in Drupal (e.g. `"Top Links"`) |
| Desktop Style | `page.getByLabel("Desktop Style").last()` | select | Yes | `style1` (Style 1), `style2` (Style 2), `style3` (Style 3) |
| Mobile Style | `page.getByLabel("Mobile Style").last()` | select | Yes | `dropdown` (Dropdown List), `scroll` (Scrolling) |

## Gotchas
1. Autocomplete: fill textbox → wait 2000ms → click first `.ui-autocomplete li.ui-menu-item`.
2. Menu must exist in Drupal — autocomplete searches existing menus; use `"Top Links"` (guaranteed to exist).
3. Style selects use `getByLabel`, not `select[name*="..."]` — `page.getByLabel("Desktop Style").last()`.

## Helper Signature
```javascript
addNavigationMenuBlock(page, menuName, desktopStyle, mobileStyle)
// menuName: "Top Links"
// desktopStyle: "style1"
// mobileStyle: "dropdown"
```

## Frontend Assertion
```javascript
await expect(page.getByText("Home", { exact: true })).toBeVisible();
```
- Renders as `<nav>` with links; "Home" link always present in Top Links menu
