# Accordion — Test Inputs

**Spec:** `tests/accordion.spec.js` · **Helper:** `addAccordionBlock(page)`, `addAccordionItem(page)`, `configureAccordionItem(page, config)`

## Test 1: Default (1 test, 4 blocks)

- **Page title:** "Accordion Test Page"
- **Section:** "Accordion Section"

### Block 1 — Number Style

| Field                           | Value                                       |
| ------------------------------- | ------------------------------------------- |
| Item 1 title                    | Number Block Item eins                      |
| Item 1 expanded                 | true                                        |
| Item 1 text                     | First item with numeric style starting at 5 |
| Item 2 title                    | Number Block Item 2                         |
| Item 2 expanded                 | false                                       |
| Item 2 text                     | Second item with numeric style              |
| field_mtpc_accordion_icon_style | number                                      |
| field_mtpc_numeric_start        | 9                                           |

### Block 2 — Brands Icon

| Field                                       | Value                              |
| ------------------------------------------- | ---------------------------------- |
| Item title                                  | Brands Icon Item                   |
| Item expanded                               | false                              |
| Item text                                   | Item with Font Awesome Brands icon |
| field_mtpc_accordion_icon_style             | icon                               |
| field_mtpc_fa_acc_icon_style                | Font Awesome Brands                |
| field_mtpc_fa_acc_icon_collapsed / expanded |                                    |

### Block 3 — Pro Icon

| Field                                       | Value                           |
| ------------------------------------------- | ------------------------------- |
| Item title                                  | Pro Icon Item                   |
| Item expanded                               | true                            |
| Item text                                   | Item with Font Awesome Pro icon |
| field_mtpc_accordion_icon_style             | icon                            |
| field_mtpc_fa_acc_icon_style                | Font Awesome Pro                |
| field_mtpc_fa_acc_icon_collapsed / expanded |                                 |

### Block 4 — Duotone Icon

| Field                                       | Value                               |
| ------------------------------------------- | ----------------------------------- |
| Item title                                  | Duotone Icon Item                   |
| Item expanded                               | false                               |
| Item text                                   | Item with Font Awesome Duotone icon |
| field_mtpc_accordion_icon_style             | icon                                |
| field_mtpc_fa_acc_icon_style                | Font Awesome Duotone                |
| field_mtpc_fa_acc_icon_collapsed / expanded |                                     |

## Frontend assertions

- Item titles visible: Number Block Item eins, Number Block Item 2, Brands Icon Item, Pro Icon Item, Duotone Icon Item
