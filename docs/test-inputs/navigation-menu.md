# Navigation Menu — Test Inputs

**Spec:** `tests/navigation-menu.spec.js` · **Helper:** `addNavigationMenuBlock(page, menuName, desktopStyle, mobileStyle)`

## Test 1: Default

- **Page title:** "Navigation Menu Test"
- **Section:** "Nav Section"

| Field        | Value     |
| ------------ | --------- |
| menuName     | Top Links |
| desktopStyle | style1    |
| mobileStyle  | dropdown  |

_(Menu must already exist in Drupal — autocomplete populates "Top Links")_

## Frontend assertions

- Heading "Navigation Menu Test" visible
- "Menu 01" and "Menu 02 test" attached
