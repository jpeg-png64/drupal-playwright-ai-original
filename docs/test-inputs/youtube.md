# YouTube — Test Inputs

**Spec:** `tests/youtube.spec.js` · **Helper:** `addYoutubeBlock(page, width, height)`

## Test 1: Default

- **Page title:** "YouTube Test Page"
- **Section:** "YouTube Section"

| Field                          | Value       |
| ------------------------------ | ----------- |
| width                          | 1280        |
| height                         | 550         |
| video ID (hardcoded in helper) | vBmU5v2EyxM |

## Frontend assertions

- `article iframe` visible
- `iframe[src*="youtube.com/embed/vBmU5v2EyxM"]` visible
