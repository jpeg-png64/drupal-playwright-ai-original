# Page Title — Test Inputs

**Spec:** `tests/page-title.spec.js` · **Helper:** `addPageTitleBlock(page, options?)`

## Test 1: Default

- **Page title:** "Page Title Test"
- **Section:** "Title Section"

| Field | Value          |
| ----- | -------------- |
| title | Override Title |
| align | center         |

## Test 2: All configurable fields (2 blocks)

- **Page title:** "Page Title Advanced Test"
- **Section:** "Advanced Section"

### Block 1 — top position + heights + breadcrumbs

| Field           | Value              |
| --------------- | ------------------ |
| title           | Top Position Title |
| align           | center             |
| position        | top                |
| desktopHeight   | 150                |
| tabletHeight    | 120                |
| mobileHeight    | 100                |
| showBreadcrumbs | true               |

### Block 2 — middle position + breadcrumb override

| Field               | Value                 |
| ------------------- | --------------------- |
| title               | Middle Position Title |
| align               | center                |
| position            | middle                |
| desktopHeight       | 200                   |
| showBreadcrumbs     | true                  |
| overrideBreadcrumbs | true                  |
| breadcrumbUrl       | `<front>`             |
| breadcrumbText      | Home                  |

## Frontend assertions

- Test 1: "Override Title" visible
- Test 2: "Top Position Title", "Middle Position Title" visible; "Home" attached
