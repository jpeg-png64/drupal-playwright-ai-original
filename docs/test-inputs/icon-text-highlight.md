# Icon & Text Highlight — Test Inputs

**Spec:** `tests/icon-text-highlight.spec.js` · **Helper:** `addIconTextHighlightBlock(page, options)`

Each block uses the exact Font Awesome icon listed below (fixed — no randomization).

## Test 1: All column styles on one page (3 blocks)

- **Page title:** "Icon Text Highlight Test"
- **Section:** "Highlight Section"

### Block 1 — Two-column

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| highlightStyle   | two                                                              |
| highlightDisplay | top                                                              |
| headingDisplay   | center                                                           |
| iconTextStyle    | row                                                              |
| tabletColumns    | original                                                         |
| icon             | fa-light fa-lightbulb                                          |
| text             | `<h3>Two Column Highlight</h3><p>Testing two column layout.</p>` |

### Block 2 — Three-column

| Field            | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| highlightStyle   | three                                                                |
| highlightDisplay | middle                                                               |
| headingDisplay   | left                                                                 |
| iconTextStyle    | column                                                               |
| tabletColumns    | two                                                                  |
| icon             | fa-solid fa-rocket                                                     |
| text             | `<h3>Three Column Highlight</h3><p>Testing three column layout.</p>` |

### Block 3 — Four-column

| Field            | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| highlightStyle   | four                                                               |
| highlightDisplay | top                                                                |
| headingDisplay   | center                                                             |
| iconTextStyle    | row                                                                |
| tabletColumns    | original                                                           |
| icon             | fa-duotone fa-flask                                                 |
| text             | `<h3>Four Column Highlight</h3><p>Testing four column layout.</p>` |

## Frontend assertions

- Headings visible: "Two Column Highlight", "Three Column Highlight", "Four Column Highlight"
