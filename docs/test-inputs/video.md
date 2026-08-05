# Video — Test Inputs

**Spec:** `tests/video.spec.js` · **Helper:** `addVideoBlock(page, config)`

## Test 1: Default

- **Page title:** "Video Test Page"
- **Section:** "Video Section"

| Field    | Value                                                  |
| -------- | ------------------------------------------------------ |
| url      | https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D |
| width    | 640                                                    |
| height   | 360                                                    |
| autoplay | false                                                  |

## Test 2: Autoplay

- **Page title:** "Video Autoplay Test Page"
- **Section:** "Video Section"

| Field    | Value                                                  |
| -------- | ------------------------------------------------------ |
| url      | https://video.ust.hk/Watch.aspx?Video=1BAE6B06870F601D |
| width    | 640                                                    |
| height   | 360                                                    |
| autoplay | true                                                   |

## Frontend assertions

- `article iframe, article video` visible
- `iframe[src*="video.ust.hk"]` visible
