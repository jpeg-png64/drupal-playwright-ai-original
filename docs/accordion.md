# Accordion Block

## Test Name
`accordion.spec.js` → `test.describe("Accordion Block")` → `test("Default")`

## What the Test Does
1. `login(page)`
2. goto `/node/add/custom_page/mtpc`, wait `networkidle`
3. Fill Page Title: `"Accordion Test Page"`
4. `addOneColumnSection(page, "Accordion Section")`
5. **Block 1 (number style)**: `addAccordionBlock` → `addAccordionItem` + `configureAccordionItem({ title: "Number Block Item eins", expanded: true, text: "First item with numeric style starting at 5" })`; second item `{ title: "Number Block Item 2", expanded: false, text: "Second item with numeric style" }`; set inline `icon_style → "number"`, `numeric_start → "9"` → `collapseCurrentBlock`
6. **Block 2 (fab)**: item `{ title: "Brands Icon Item", expanded: false, text: "Item with Font Awesome Brands icon" }`; set `icon_style → "icon"`, `fa_acc_icon_style → "fab"`, collapsed+expanded icons `"fa-brands fa-github"` → `collapseCurrentBlock`
7. **Block 3 (fas)**: item `{ title: "Pro Icon Item", expanded: true, text: "Item with Font Awesome Pro icon" }`; `icon_style → "icon"`, `fa_acc_icon_style → "fas"`, icons `"fa-solid fa-star"` → `collapseCurrentBlock`
8. **Block 4 (fad)**: item `{ title: "Duotone Icon Item", expanded: false, text: "Item with Font Awesome Duotone icon" }`; `icon_style → "icon"`, `fa_acc_icon_style → "fad"`, icons `"fa-duotone fa-heart"` → `collapseCurrentBlock`
9. Publish: `getByRole("button", { name: "Publish Page" })`, wait `networkidle`
10. Assert all visible (`exact: true`): "Number Block Item eins", "Number Block Item 2", "Brands Icon Item", "Pro Icon Item", "Duotone Icon Item"

## Test Data
| Block | Icon Style | FA Set | Collapsed Icon | Expanded Icon | Start | Item Title | Expanded |
|-------|-----------|--------|----------------|---------------|-------|------------|----------|
| 1 | number | — | — | — | 9 | Number Block Item eins | true |
| 1 | number | — | — | — | — | Number Block Item 2 | false |
| 2 | icon | fab | fa-brands fa-github | fa-brands fa-github | — | Brands Icon Item | false |
| 3 | icon | fas | fa-solid fa-star | fa-solid fa-star | — | Pro Icon Item | true |
| 4 | icon | fad | fa-duotone fa-heart | fa-duotone fa-heart | — | Duotone Icon Item | false |

## Imports Required
```javascript
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import {
  addAccordionBlock,
  addAccordionItem,
  configureAccordionItem,
} from "../helpers/accordion.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
```

## Helper Signatures
```javascript
addAccordionBlock(page)
addAccordionItem(page)
configureAccordionItem(page, { title: string, expanded: boolean, text: string })
// Numeric style set inline in spec (icon_style → "number", numeric_start → "9")
```

## Rules
- `collapseCurrentBlock(page)` after every block (4s wait mandatory).
- Always `.last()` on selectors with multiple accordion blocks.
- Expanded checkbox is `field_mtpc_accordion_expended` (Drupal typo — "expended").
- FA icon classes include style prefix: `"fa-brands fa-github"`, not `"fa-github"`.
- Call `addAccordionItem` + `configureAccordionItem` per item — never skip the add step.
