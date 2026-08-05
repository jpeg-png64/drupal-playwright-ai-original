# Video Block

## How to Add
- Button: `getByRole("button", { name: "Add Video Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`
- Wait after adding: 5s

## Key Fields
| Field | Selector | Type | Required | Valid Values |
|-------|----------|------|----------|-------------|
| Video Type | `page.locator('select[name*="field_video_block_type"]').last()` | select | Yes | `upload`, `hkust_video` |
| Embed URL | `page.locator('input[name*="field_hkust_video_embed_url"]').last()` | text input | Yes (if hkust_video) | HKUST video URL |
| Width | `page.locator('input[name*="field_mtpc_youtube_width"]').last()` | text input | Yes | Number (string) |
| Height | `page.locator('input[name*="field_mtpc_youtube_height"]').last()` | text input | Yes | Number (string) |
| Autoplay | `page.locator('input[name*="field_mtpc_youtube_autoplay"]').last()` | checkbox | No | Boolean |

> **Bounds:** Width/Height minimum is 50px. Values under 50 are rejected by Drupal validation.

## Gotchas
1. AJAX rebuild on video type — select `hkust_video` → wait 1.5s → embed URL field appears.
2. Select video type BEFORE filling embed URL — field doesn't exist until type selected.
3. Wait 5s after adding — longer than other blocks (AJAX rebuild).
4. Autoplay optional — only checked if `config.autoplay` is true.
5. **Publish: use `waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 })` + `waitForLoadState("load")` — `networkidle` times out on the external HKUST video player.**

## Helper Signature
```javascript
addVideoBlock(page, config)
// config = {
//   url: "https://video.ust.hk/...",  // HKUST video embed URL
//   width: "1280",                      // string
//   height: "550",                      // string
//   autoplay: false,                    // boolean
// }
```

## Frontend Assertion
```javascript
await expect(page.locator("article iframe, article video").first()).toBeVisible();
```
- Use `article iframe, article video` to catch both embed types
- Use `.first()` to avoid tracking iframes
