# Block Explorer Workflow

Goal-oriented exploration of a single Drupal block type. The output is a block profile — enough information to write a reliable Playwright test.

---

## Input

A block type name, e.g. `"Video Block"`.

## Output

A markdown block profile (written to `docs/block-profiles/{block-name}.md`) containing:

1. How to add the block
2. Key fields and their selectors
3. Interaction patterns (CKEditor, media, autocomplete, AJAX)
4. Gotchas and unknowns
5. What the frontend renders

---

## Workflow

### 0. Read existing knowledge

Before starting any test, read these files in order:

1. `AGENTS.md` — project structure, test patterns, and helper reference
2. `docs/block-profiles/*.md` — all existing block profiles

This gives you:
- How to login, navigate, add blocks, publish pages
- What selectors and patterns have already been discovered
- Known gotchas and field behaviors

Do NOT skip this step. The block profiles contain critical information about selectors, field types, and gotchas that you need before writing any test.

Print `"instructions checked"` after reading this file.
Print `"profiles checked"` after reading the block profiles.

### 1. Add the block

Log in using the provided login link (no `drush uli`), navigate to `/node/add/custom_page/mtpc`, add a 1-Column Section, then add the block.

Record:
- The exact button text to add the block (e.g. `"Add Video Block"`)
- Whether it uses `getByRole("button")`, `getByRole("listitem").filter()`, or `input[value*="..."]`
- How long to wait after adding (typically 3–5s for AJAX rebuild)

### 2. Identify the key fields

Don't catalog every field. Focus on:

- **Required fields** — what must be filled for the block to save
- **Fields that affect rendering** — what changes the frontend output
- **Fields with special patterns** — media library, autocomplete, CKEditor, AJAX rebuilds

For each key field, record:
- A working selector (use `name*`, `data-drupal-selector*`, or `getByRole`/`getByLabel`)
- The type (select, input, checkbox, textarea, button)
- Valid values (for selects: the actual `<option>` values)
- Whether it's required

### 3. Test the interaction patterns

For each pattern the block uses, do a quick interaction:

**CKEditor:** Find the editor, click it, fill with `<p>Test content</p>`. Record which version (CKEditor 4: `getByRole("textbox", { name: "Rich Text Editor. Editing" })`, CKEditor 5: `.ck-editor__editable`).

**Media library:** Click "Add media", wait for modal, select first item, click "Insert selected", wait for modal to close. Record the button selector and whether `force: true` is needed on the media item click.

**Autocomplete:** Fill the textbox, wait 2s, wait for `.ui-autocomplete` suggestion, click first one. Record the textbox selector and what value works.

**AJAX rebuild:** Change a select value, wait for the form to update. Record which select triggers a rebuild and what field appears/disappears.

**Nested items:** If the block has "Add [Item] Item" buttons, add one item. Record the button text and what fields appear inside the item.

### 4. Check for gotchas

Look for:

- Does the block use `.first()` or `.last()` on the column menu? (Most use `.last()`, some use `.first()`)
- Does inserting media trigger an AJAX rebuild that invalidates locators?
- Does the block have fields that only appear after a specific select value?
- Are there any color/size fields that default to working values?

### 5. Check the frontend

Publish the page and verify:
- What text/element appears on the frontend?
- What selector works for assertions? (`getByText`, `locator("article img")`, etc.)
- Does the block produce duplicate DOM elements (e.g. Slick slider cloning)?

### 6. Write or update block profile

Save or update at `docs/block-profiles/{block-name}.md`:

```markdown
# {Block Name}

## How to Add
- Button: "Add {Block Name}"
- Pattern: getByRole("button") / getByRole("listitem").filter() / input[value]
- Wait after adding: {X}s

## Key Fields
| Field | Selector | Type | Required | Valid Values |
|-------|----------|------|----------|-------------|
| ... | ... | ... | ... | ... |

## Patterns Used
- [ ] CKEditor {4/5}: {selector}
- [ ] Media library: {button selector}, force: {true/false}
- [ ] Autocomplete: {textbox selector}, test value: "..."
- [ ] AJAX rebuild on: {select selector}, reveals: {field}
- [ ] Nested items: {button text}, {fields per item}

## Gotchas
- {any issues found}

## Frontend Assertion
- {what to assert and with which selector}

## Unknowns
- {things not tested or unclear}
```

---

## Example: Video Block Profile

```markdown
# Video Block

## How to Add
- Button: "Add Video Block"
- Pattern: getByRole("button", { name: "Add Video Block" })
- Wait after adding: 5s

## Key Fields
| Field | Selector | Type | Required | Valid Values |
|-------|----------|------|----------|-------------|
| Video Type | select[name*="field_video_block_type"] | select | Yes | upload, hkust_video |
| Embed URL | input[name*="field_hkust_video_embed_url"] | input | Yes (if hkust_video) | HKUST video URL |
| Width | input[name*="field_mtpc_youtube_width"] | input | Yes | Number |
| Height | input[name*="field_mtpc_youtube_height"] | input | Yes | Number |
| Autoplay | input[name*="field_mtpc_youtube_autoplay"] | checkbox | No | Boolean |

## Patterns Used
- [ ] AJAX rebuild on video type select → reveals embed URL field (wait 1.5s)
- [ ] No CKEditor
- [ ] No media library

## Gotchas
- Must select hkust_video BEFORE filling embed URL — field doesn't exist until type is selected
- Wait 1.5s after changing video type for AJAX rebuild

## Frontend Assertion
- `page.locator("article iframe, article video").first()` is visible

## Unknowns
- What does upload type look like? (never tested)
- Does autoplay actually auto-play? (never verified)
```
