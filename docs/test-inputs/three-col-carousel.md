# Three-Column Carousel — Test Inputs

**Spec:** `tests/three-col-carousel.spec.js` · **Helper:** `addThreeColCarouselBlock(page, options?)` — creates 3 items; `options.media` = array of media names/indexes per item (omit → first item each)

## Test 1: Default (@media-modal)

- **Page title:** "3-Column Carousel Test"
- **Section:** "Carousel Section"

### Block-level hardcoded values (helper)

| Field                        | Value                    |
| ---------------------------- | ------------------------ |
| Additional CSS classes       | test-carousel            |
| Highlight heading (CKEditor) | Carousel Highlight Title |

### Item config (3 items, i = 0, 1, 2)

| Field                  | Value                                                                             |
| ---------------------- | --------------------------------------------------------------------------------- |
| Active                 | checked                                                                           |
| Media                  | first media item in library (override via `options.media: [name0, name1, name2]`) |
| Image Caption          | Caption {i}                                                                       |
| Title                  | Carousel Title {i}                                                                |
| Link                   | https://www.youtube.com/watch?v=RwpiDqdugYY                                       |
| Description (CKEditor) | Description for carousel item {i}                                                 |

## Frontend assertions

- "Carousel Highlight Title", "Caption 0", "Carousel Title 0" visible
