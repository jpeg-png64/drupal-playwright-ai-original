# Event Carousel — Test Inputs

**Spec:** `tests/event-carousel.spec.js` · **Helper:** `addEventCarouselBlock(page, config)`

Dates are computed at runtime relative to the run date (D = the day the test runs), formatted `YYYY-MM-DD` via the spec's `fmtDate(offsetDays)` helper.

## Test 1: Default (4 blocks)

- **Page title:** "Event Carousel Test Page"
- **Section:** "Event Carousel Section"

| Block | name                | startDate   | endDate     |
| ----- | ------------------- | ----------- | ----------- |
| 1     | One Day Event Today | D           | D           |
| 2     | One Week Event      | D           | D+7         |
| 3     | Past Event          | D−30        | D−29        |
| 4     | Future Event        | D+30        | D+34        |

## Test 2: All configurable fields (2 blocks)

- **Page title:** "Event Carousel All Fields"
- **Section:** "Advanced Section"

| Block | name           | startDate | endDate | ongoingLabel  | activeEvent       |
| ----- | -------------- | --------- | ------- | ------------- | ----------------- |
| 1     | Inactive Event | D         | D       | Happening Now | false (unchecked) |
| 2     | Active Event   | D         | D+7     | In Progress   | (default)         |

## Frontend assertions

- Test 1: all 4 event names visible
- Test 2: "Active Event" visible
