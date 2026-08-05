# Profile Listing Block

## Test Name
`profile-listing.spec.js` → `test.describe("Profile Listing Block")` → `test("Both layouts on one page")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Profile Listing Test"`
4. `addOneColumnSection(page, "Profile Section")`
5. `addProfileListingBlock(page, "one_col")` → `collapseCurrentBlock(page)`
6. `addProfileListingBlock(page, "two_col")` → `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
8. Assert visible (`.first()`): "Playwright Profile Listing", "Aea"

## Test Data
| Block | Layout | List Title | English Name | Chinese Name |
|-------|--------|-----------|--------------|--------------|
| 1 | one_col | Playwright Profile Listing | Aea | 艾雅 |
| 2 | two_col | Playwright Profile Listing | Aea | 艾雅 |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addProfileListingBlock } from "../helpers/profile-listing.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addProfileListingBlock(page, layout?)
// layout: "one_col" (default) | "two_col"
```

## Rules
- Pass layout as string (`"one_col"`/`"two_col"`), not an object.
- Column menu uses `.first()` (not `.last()`); menu item via `getByRole("listitem").filter({ hasText: "Add Profile Listing Block" })`.
- `.first()` on text assertions (both blocks share title text).
- Chinese name field supports Unicode.
- `collapseCurrentBlock(page)` after every block.
