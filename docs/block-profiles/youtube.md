# YouTube Block

## How to Add
- Button: `getByRole("button", { name: "Add YouTube/Youku Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`
- Wait after adding: 3s

## Key Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Video ID | `page.locator('input[name*="field_youtube_embed_url"]').last()` | text input | Yes | YouTube video ID (e.g. `vBmU5v2EyxM`) |
| Width | `page.locator('input[name*="field_mtpc_youtube_width"]').last()` | text input | Yes | Number (string) |
| Height | `page.locator('input[name*="field_mtpc_youtube_height"]').last()` | text input | Yes | Number (string) |

> **Bounds:** Width/Height minimum is 50px. Values under 50 are rejected by Drupal validation.

## Gotchas
1. Simplest embed block — only 3 fields, no AJAX, no media.
2. Video ID is just the ID, not the full URL — use `vBmU5v2EyxM`, not `https://www.youtube.com/watch?v=vBmU5v2EyxM`.
3. Wait for video ID field — `waitFor({ state: "visible", timeout: 15000 })` before filling.
4. **Publish: use `waitForFunction(() => !window.location.pathname.startsWith("/node/add"), { timeout: 120000 })` + `waitForLoadState("load")` — `networkidle` times out on the external YouTube iframe.**

## Helper Signature
```javascript
addYoutubeBlock(page, width = "1280", height = "550")
// width/height: strings
```

## Frontend Assertion
```javascript
await expect(page.locator("article iframe").first()).toBeVisible();
```
- Use `.first()` to avoid tracking iframes
