# Profile Details — Test Inputs

**Spec:** `tests/profile-details.spec.js` · **Helper:** `addProfileDetailsBlock(page, media?)`

## Test 1: Default

- **Page title:** "Profile Details Test"
- **Section:** "Profile Section"
- **Media:** `"people-profile-picture.jpg"` (first image item)

### Hardcoded values inside helper

| Field               | Value                                              |
| ------------------- | -------------------------------------------------- |
| Profile Information | This is profile information created by Playwright. |
| Picture info        | This is picture information created by Playwright. |
| Profile Photo       | people-profile-picture.jpg                         |

## Frontend assertions

- "This is profile information created by Playwright." visible
- "This is picture information created by Playwright." visible
- Profile photo image visible
