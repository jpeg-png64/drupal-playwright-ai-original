# Profile Details Block

## Test Name
`profile-details.spec.js` → `test.describe("Profile Details Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Profile Details Test"`
4. `addOneColumnSection(page, "Profile Section")`
5. `addProfileDetailsBlock(page, "people-profile-picture.jpg")` — text hardcoded, media passed
6. `collapseCurrentBlock(page)`
7. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
8. Assert visible: "This is profile information created by Playwright." and "This is picture information created by Playwright." and profile photo

## Test Data
| Profile Information | Picture Information |
|---------------------|---------------------|
| This is profile information created by Playwright. | This is picture information created by Playwright. |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addProfileDetailsBlock } from "../helpers/profile-details.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addProfileDetailsBlock(page, media?)  // text hardcoded; media optional (name/index)
```

## Rules
- Column menu uses `.last()`.
- Menu item via `getByRole("listitem").filter({ hasText: "Add Profile Details Block" })`, not `getByRole("button")`.
- Textboxes nested in labeled container — `getByLabel("...").locator("..").getByRole("textbox")`.
- `collapseCurrentBlock(page)` after every block.
- Text values hardcoded; media optional second param.
