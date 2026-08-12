# Drupal Playwright Usage Guide

How to use this project: setup, run tests, add new tests, and read results.

---

## 1. Overview

This project runs Playwright E2E tests against a Drupal site with custom blocks. Each test:

1. Logs in
2. Creates a Standard Page
3. Adds a section + one or more blocks
4. Publishes the page
5. Verifies the frontend

There are **32 tests across 19 spec files**, covering 16 block types. Each test creates a Drupal page (Next/Previous also creates two small link-target pages so its autocomplete has nodes to find).

---

## 2. Prerequisites

- **Node.js 18+** (this project's Node is at `/usr/local/bin/node`)
- **Docker** running the Drupal site at `../Docker/mtpc_template`
- **Drupal site** reachable at `http://localhost:8325`
- **A Drupal login link** (each user has their own — a new user gets a new link; no `drush uli`)

---

## 3. First-Time Setup

```bash
npm install
npx playwright install
```

That's it. Login uses the **provided login link** — not `drush uli`. Open the given
link once in a browser to establish the Drupal session; it's cached in
`.auth/storage-state.json` and reused by every test. A new user with a new link?
Open their link to re-capture the session, then run the same tests unchanged.

> **Node note:** If `npx` is not found, prefix commands with `PATH="/usr/local/bin:$PATH"`.

---

## 4. Running Tests

### Everything (recommended)

```bash
npm test
```

This runs the full suite in three sequential steps (parallel → solo → combined), enforced by project `dependencies` in `playwright.config.js`:

1. **parallel** project — non-heavy tests, 2 workers (runs first)
2. **solo** project — `@media-modal` tests, 1 worker (fully isolated)
3. **combined** project — `@combined` tests, 1 worker (runs last)

> Without the `PATH` prefix, use:
>
> ```bash
> PATH="/usr/local/bin:$PATH" npm test
> ```

### Individual project

```bash
# Standard tests only (2 workers, runs first)
npm run test:parallel

# Media-modal tests only (1 worker, isolated)
npm run test:solo

# Combined multi-block tests only (1 worker, runs last)
npm run test:combined
```

### Single spec file

```bash
npm run test:spec --spec=accordion
```

Run by spec name (no `.spec.js` suffix). Examples:

```bash
npm run test:spec --spec=video
npm run test:spec --spec=image-grid
npm run test:spec --spec=zz-all-blocks
```

### Single test by name

```bash
npm run test:name --name="All blocks on one page"
npm run test:name --name="All configurable fields"
```

---

## 5. How Test Tags Control Execution

The worker count is decided by **tags in the test title**, routed via three projects in `playwright.config.js`. Projects are chained with `dependencies` (parallel → solo → combined), so a plain `npx playwright test` runs them sequentially:

| Tag in title                  | Project    | Workers | Phase                     |
| ----------------------------- | ---------- | ------- | ------------------------- |
| _(none)_                      | `parallel` | 2       | runs first                |
| `@media-modal` only           | `solo`     | 1       | runs after parallel       |
| `@combined`                   | `combined` | 1       | runs last                 |

Rules for tagging:

- Add **`@media-modal`** when the test uses the media library modal (image picker) or is otherwise heavy on AJAX.
- Add **`@combined`** when the test places many blocks on one page.
- Add **both** if both apply (e.g. `zz-all-blocks.spec.js`).

```js
test("All configurable fields @media-modal", async ({ page }) => { ... });
test("Many blocks on one page @combined", async ({ page }) => { ... });
test("Default", async ({ page }) => { ... });  // no tag → 2 workers
```

**Why?** Drupal cannot handle 3+ concurrent heavy form submissions. Running media-heavy tests at 1 worker, fully isolated, prevents flaky failures. The `@combined` phase runs last so the all-blocks check never contends with anything. Do NOT run the projects concurrently — that reintroduces contention.

---

## 6. Adding a New Test

1. Read the block profile: `../docs/block-profiles/<block>.md`
2. Read the test inputs: `../docs/test-inputs/<block>.md`
3. Read the helper source: `helpers/<block>.js` — **always check the signature before calling**
4. Create spec: `tests/<block>.spec.js`
5. Follow the standard structure:

```js
import { test, expect } from "@playwright/test";
import { login } from "../helpers/login.js";
import { addOneColumnSection } from "../helpers/section.js";
import { collapseCurrentBlock } from "../helpers/collapse.js";
import { addVideoBlock } from "../helpers/video.js";

test.describe("Video Block", () => {
  test("Default", async ({ page }) => {
    await test.step("Login", async () => {
      await login(page);
    });
    await test.step("Create Standard Page", async () => {
      await page.goto("/node/add/custom_page/mtpc");
      await page.waitForLoadState("networkidle");
      await page
        .getByRole("textbox", { name: "Page Title" })
        .fill("Video Page");
    });
    await test.step("Add Section", async () => {
      await addOneColumnSection(page, "Video Section");
    });
    await test.step("Add Block", async () => {
      await addVideoBlock(page, {
        url: "https://...",
        width: "640",
        height: "360",
      });
    });
    await test.step("Collapse block", async () => {
      await collapseCurrentBlock(page);
    });
    await test.step("Publish Page", async () => {
      await page.getByRole("button", { name: "Publish Page" }).click();
      await page.waitForURL(
        (url) => !url.pathname.includes("/node/add"),
        { timeout: 120000 },
      );
    });
    await test.step("Verify Frontend", async () => {
      await expect(
        page.locator("article iframe, article video").first(),
      ).toBeVisible();
    });
  });
});
```

6. Tag it (`@media-modal` / `@combined`) based on section 5.
7. Run it:

```bash
npm run test:spec --spec=my-block
```

---

## 7. Viewing Results

### Console output

The `line` reporter shows pass/fail per test and the final summary.

### HTML report

```bash
npm run report
```

Opens `test-results/html-report/index.html`.

### Failure artifacts

On failure, screenshots, traces, and error context are saved to `test-results/artifacts/`:

- `test-failed-1.png` — screenshot
- `trace.zip` — Playwright trace (`npx playwright show-trace <file>`)
- `error-context.md` — snapshot of the page at failure

### JSON report

`test-results/failure-report.json` — machine-readable results.

---

## 8. Updating Test Inputs (markdown → spec sync)

The exact inputs for every test are documented in `docs/test-inputs/<block>.md` (see `docs/test-inputs/INDEX.md` for the block-to-file map). These files are the human-readable contract for what each test does.

**To change what a test fills in:**

1. Edit the matching input file, e.g. change the helper config in `docs/test-inputs/video.md`.
2. Ask the agent to "apply the inputs from `docs/test-inputs/<block>.md` to the test".
3. The agent reads the updated input file and mirrors the change into the corresponding helper call in `tests/<block>.spec.js`, then runs the spec to verify.

No other step is needed — the input files are kept in sync with the specs, so they stay the single place to review/edit test behavior.

---

## 9. Troubleshooting

| Symptom                  | Cause / Fix                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `npx: command not found` | Prefix with `PATH="/usr/local/bin:$PATH"`                                               |
| Login fails              | `.auth/storage-state.json` expired — delete it and re-capture the session with your login link |
| Drupal unreachable       | Check Docker: the site must be up at `http://localhost:8325`                            |
| Media modal test flaky   | Make sure it's tagged `@media-modal` so it runs at 1 worker                             |
| Multi-block page flaky   | Make sure it's tagged `@combined` (single section, 1 worker)                            |
| Timeout with 10+ blocks  | Add `test.setTimeout(600000)` to the test                                               |

---

## 10. Key Files

| File                   | Purpose                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `playwright.config.js` | Tag → project routing, workers, reporters                                              |
| `package.json`         | Run scripts (`test`, `test:parallel`, `test:solo`, `test:combined`, `test:spec`, `test:name`, `report`) |
| `helpers/`             | One helper per block (login, add block, collapse)                                      |
| `tests/`               | Playwright spec files                                                                  |
| `docs/`                | Block docs, profiles, test inputs (source of truth)                                    |
| `AGENTS.md`            | AI agent instructions + conventions                                                    |
