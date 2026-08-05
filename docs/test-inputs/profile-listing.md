# Profile Listing — Test Inputs

**Spec:** `tests/profile-listing.spec.js` · **Helper:** `addProfileListingBlock(page, layout?)`

## Test 1: Both layouts on one page (2 blocks)

- **Page title:** "Profile Listing Test"
- **Section:** "Profile Section"

### Block 1 — one_col

### Block 2 — two_col

### Hardcoded values inside helper (both blocks)

| Field                      | Value                                   |
| -------------------------- | --------------------------------------- |
| List Title                 | Playwright Profile Listing              |
| Profile Link               | `<front>`                               |
| Open Link in a new tab     | checked                                 |
| English Name               | Aea                                     |
| Chinese Name               | 艾雅                                    |
| Profile Details (CKEditor) | This profile was created by Playwright. |

## Frontend assertions

- "Playwright Profile Listing" visible
- "Aea" visible
