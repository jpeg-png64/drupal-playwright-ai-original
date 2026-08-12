# Drupal Playwright Automation

Playwright test suite for Drupal custom blocks (32 tests / 19 specs / 16 blocks).

## What the tests do

Every test drives a Drupal **Standard Page** through the same flow:

1. Login using the provided login link — session captured once, cached in the storage-state file (no `drush uli`)
2. Create a page at `/node/add/custom_page/mtpc` and fill "Page Title"
3. Add a 1-column section, then add block(s), `collapseCurrentBlock(page)` after each
4. Click "Publish Page" and wait for the URL to leave `/node/add`
5. Assert the block's output on the frontend

Heavy tests are tagged in the test title (`@media-modal`, `@combined`) and routed
through three sequential projects (`parallel` → `solo` → `combined`) so heavy tests
never collide. For the full workflow see `AGENTS.md` and `manual/README.md`.

## Quick start

```bash
PATH="/usr/local/bin:$PATH" npx playwright test   # full suite
PATH="/usr/local/bin:$PATH" npx playwright test tests/accordion.spec.js  # single spec
```

## Further reading

All usage instructions, test reports, and project details live in the [`manual/`](manual/) folder:

- [`manual/README.md`](manual/README.md) — full project overview (structure, commands, helpers, gotchas)
- [`manual/USAGE.md`](manual/USAGE.md) — how to run, add, and update tests
- [`manual/TEST-REPORT.md`](manual/TEST-REPORT.md) — block-by-block test report
- [`AGENT_INSTRUCTIONS.md`](AGENT_INSTRUCTIONS.md) — AI/agent quick-start and interactive login capture

## Testing a remote site (custom URL)

This suite can run against any reachable Drupal site. To test a non-localhost site, follow these steps:

1. Set the target URL via environment variable: BASE_URL="https://your-site.example"
2. Capture an authenticated Playwright storage state for your user and save it to STORAGE_STATE (defaults to .auth/storage-state.json). Quick workflow:
   - Open the site's provided login link in a real browser and complete login once.
   - Save the Playwright storage state (example):

     PATH="/usr/local/bin:$PATH" node -e "(async()=>{const { chromium }=require('playwright');const b=await chromium.launch({headless:false});const c=await b.newContext();const p=await c.newPage();await p.goto(process.env.BASE_URL||'http://localhost:8325');console.log('Complete login in the opened browser window, then press Enter');process.stdin.once('data', async()=>{require('fs').writeFileSync(process.env.STORAGE_STATE||'.auth/storage-state.json', JSON.stringify(await c.storageState()));await b.close();process.exit(0);});})();"

   - Alternatively, use a browser extension to export cookies and convert to Playwright storage state JSON.
3. Run tests with env overrides:

   BASE_URL="https://your-site.example" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js

Notes:
- For security, drush fallback is disabled for remote sites. To allow automatic drush fallback (local Docker only), set ALLOW_DRUSH=true.
- You can also set HEADLESS=true, SCREENSHOT, and TRACE via env vars to control runner behavior.

This adds flexibility for new users with their own site URLs. For more details see `manual/USAGE.md`.

## Agent quick start (one-line capture + sample run)

One-line capture (run locally after setting BASE_URL and optionally providing LOGIN_LINK):

- Option A (interactive via LOGIN_LINK): let the agent handle it—paste the login link when prompted and the agent will open a browser for you. Example agent-run:

  LOGIN_LINK="https://example.com/user/one-time-login/xyz" BASE_URL="https://example.com" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js

  The runner's global-setup will open the link in a browser and wait for you to complete login; return to the terminal and press ENTER to save storage state.

- Option B (manual one-line capture): if you prefer to capture storage state yourself:

  PATH="/usr/local/bin:$PATH" node -e "(async()=>{const { chromium }=require('playwright');const b=await chromium.launch({headless:false});const c=await b.newContext();const p=await c.newPage();await p.goto(process.env.BASE_URL);console.log('Open your login link in the opened browser then press ENTER');process.stdin.once('data', async()=>{require('fs').writeFileSync(process.env.STORAGE_STATE||'.auth/storage-state.json', JSON.stringify(await c.storageState()));await b.close();process.exit(0);});})();"

Sample run (single spec):

```bash
BASE_URL="https://your-site.example" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js
```

The agent must always prompt for BASE_URL and the user's login link (or a pre-captured STORAGE_STATE) before running tests.

```bash
PATH="/usr/local/bin:$PATH" node -e "(async()=>{const { chromium }=require('playwright');const b=await chromium.launch({headless:false});const c=await b.newContext();const p=await c.newPage();await p.goto(process.env.BASE_URL);console.log('Open your login link in the opened browser then press ENTER');process.stdin.once('data', async()=>{require('fs').writeFileSync(process.env.STORAGE_STATE||'.auth/storage-state.json', JSON.stringify(await c.storageState()));await b.close();process.exit(0);});})();"
```

Sample run (single spec):

```bash
BASE_URL="https://your-site.example" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js
```

The agent must always prompt for BASE_URL and the user's login link (or a pre-captured STORAGE_STATE) before running tests.

Technical docs live in [`docs/`](docs/): block documentation, exact test inputs (`docs/test-inputs/`), and exploration workflows.
