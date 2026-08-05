# Events Carousel Block

## Test Name
`event-carousel.spec.js` → `test.describe("Events Carousel Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Event Carousel Test Page"` (`getByRole("textbox", { name: "Page Title" })`)
4. `addOneColumnSection(page, "Event Carousel Section")`
5. Per event below: `addEventCarouselBlock(page, { name, startDate, endDate })` then `collapseCurrentBlock(page)`
6. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
7. Assert visible: One Day Event Today, One Week Event, Past Event, Future Event

## Test Data
Dates computed at runtime relative to run date D (= the day the test runs, `YYYY-MM-DD`) via the spec's `fmtDate(offsetDays)`.

| Event Name | Start Date | End Date |
|-----------|------------|----------|
| One Day Event Today | D | D |
| One Week Event | D | D+7 |
| Past Event | D−30 | D−29 |
| Future Event | D+30 | D+34 |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { addEventCarouselBlock } from "../helpers/event-carousel.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signature
```javascript
addEventCarouselBlock(page, { name: string, startDate: string, endDate: string })
// startDate/endDate in YYYY-MM-DD format
```

## Rules
- `collapseCurrentBlock(page)` after every block.
- Dates must be `YYYY-MM-DD` — no other format accepted.
- Event name is inserted as `<h2>` inside CKEditor, not a separate field.
- Ongoing label, character limit, and event link are hardcoded in the helper.
