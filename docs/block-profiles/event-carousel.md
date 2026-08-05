# Event Carousel Block

## How to Add
- Button: `getByRole("button", { name: "Add Events Carousel Block" })`
- Column menu: `page.locator('[id^="edit-field-mod-sections-0-subform-field-mod-1-col-container"]').last()`

## Key Fields

### Block-Level Fields
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Animation Active | `input[data-drupal-selector*="field-mtpc-animation-active"]` | checkbox | No | Unchecked by default |
| Auto Carousel | `input[data-drupal-selector*="field-mtpc-events-carousel-auto"]` | checkbox | No | Unchecked by default |
| Show Ongoing | `input[name*="field_mtpc_evt_carousel_ongoing"]` | checkbox | No | Enables ongoing label on frontend |
| Ongoing Label | `input[data-drupal-selector*="field-mtpc-events-carousel-going"]` | text input | No | Default text visible on frontend |
| Character Limit | `input[data-drupal-selector*="field-mtpc-carousel-limit-chars"]` | number | No | Number (min 50) |

### Item-Level Fields (per event item)
| Field | Selector | Type | Required | Notes |
|-------|----------|------|----------|-------|
| Active Event | `input[name*="field_mtpc_carousel_active_event"]` | checkbox | No | Checked by default |
| Event Link | `input[data-drupal-selector*="field-mtpc-event-carousel-link"]` | text input | No | URL |
| Start Date | `input[data-drupal-selector*="field-mtpc-event-carousel-start"]` | date | Yes | Format: YYYY-MM-DD |
| End Date | `input[data-drupal-selector*="field-mtpc-event-carousel-end"]` | date | Yes | Format: YYYY-MM-DD |
| Description | `getByRole("textbox", { name: /Rich Text Editor/i })` | CKEditor 5 | Yes | HTML content |

## Gotchas
1. Block-level fields NOT in block container (parent container) — page-wide `.last()`.
2. Uses `data-drupal-selector`, not `name` — exceptions: Active Event & Show Ongoing use `name*`.
3. CKEditor uses regex match — `getByRole("textbox", { name: /Rich Text Editor/i })`, not exact.
4. Active Event checked by default — set `activeEvent: false` to uncheck.
5. Show Ongoing must be checked for label to appear — `field_mtpc_evt_carousel_ongoing` enables frontend ongoing label.
6. Nested items — items live in `field_mtpc_carousel_event_item` multi-value field.

## Helper Signature
```javascript
addEventCarouselBlock(page, config)
// config = {
//   name: "Event Name",          // Used in <h2> inside description
//   startDate: "YYYY-MM-DD",     // Required
//   endDate: "YYYY-MM-DD",       // Required
//   ongoingLabel: "Ongoing",     // Optional, default "Ongoing Event"
//   activeEvent: true,           // Optional, default true (checked)
// }
```

## Frontend Assertion
```javascript
await expect(page.getByText("Event Name")).toBeVisible();
```

## Test Coverage
- **Default** — 4 blocks on one page: one-day, one-week, past, future events
- **All configurable fields** — 2 blocks: Block 1 (inactive event, ongoing "Happening Now"), Block 2 (active event, ongoing "In Progress")
