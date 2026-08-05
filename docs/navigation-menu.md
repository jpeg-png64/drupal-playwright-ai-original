# Navigation Menu Block

## Test Name

`navigation-menu.spec.js` → `test.describe("Navigation Menu Block")` → `test("Default")`

## What the Test Does

1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Navigation Menu Test"`
4. `addOneColumnSection(page, "Nav Section")`
5. `addNavigationMenuBlock(page, "Top Links", "style1", "dropdown")`
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
8. Assert: `expect(page.getByRole("heading", { name: "Navigation Menu Test" })).toBeVisible()`

## Test Data

| Menu Name | Desktop Style | Mobile Style |
| --------- | ------------- | ------------ |
| Top Links | style1        | dropdown     |

## Imports Required

```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addNavigationMenuBlock } from "../helpers/navigation-menu.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature

```javascript
addNavigationMenuBlock(page, menuName, desktopStyle, mobileStyle);
// menuName: must exist in Drupal, e.g. "Top Links"
// desktopStyle: "style1"|"style2"|"style3"
// mobileStyle: "dropdown"|"scroll"
```

## Rules

- Menu must exist in Drupal. Use `"Top Links"`.
- Wait 2000ms after filling for autocomplete; wait `.ui-autocomplete li.ui-menu-item` visible (10s) before clicking first.
- `exact: true` on the textbox name.
- `collapseCurrentBlock(page)` after every block.
- Assertion checks the page heading — the menu itself produces no unique visible text.
