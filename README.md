# Drupal Playwright Automation — Quick Start

Two workflows:

1. **Block suite** (`tests/`) — Playwright E2E tests for Drupal custom blocks. Tests reuse shared helpers and a consistent flow: login, create a Standard Page, add a section, add block(s), publish, and verify the frontend.
2. **UAT probes** (`uat/`) — site health checks against the UAT build (`builder-clean.docker-uat01.ust.hk`): public/admin route crawls, anonymous access probes, and block build checks.

## 1) Install

```bash
PATH="/usr/local/bin:$PATH"
npm install
npx playwright install
```

## 2) Workflow A — Block suite (any Drupal site)

Requires a reachable Drupal site (`BASE_URL`) and an authenticated session.

### Capture login (one-time)

- Preferred: Provide the one-time login link (`LOGIN_LINK`). The test runner opens it and saves an authenticated storage state.
- Or: Capture storage state manually and save to `.auth/storage-state.json`.

Quick interactive capture (agent or manual):

```bash
LOGIN_LINK="https://example.com/user/one-time-login/XYZ" BASE_URL="https://example.com" STORAGE_STATE=".auth/storage-state.json" PATH="$PATH" npx playwright test --project=parallel --grep "capture"
```

(When prompted, complete login in the opened browser and press ENTER to save.)

### Run

```bash
# Full suite (parallel → solo → combined, sequential)
PATH="$PATH" npx playwright test

# Single spec
BASE_URL="https://your-site" STORAGE_STATE=".auth/storage-state.json" PATH="$PATH" npx playwright test tests/image.spec.js
```

## 3) Workflow B — UAT probes (builder-clean)

UAT site: `https://builder-clean.docker-uat01.ust.hk` (basic-auth protected; admin session cached in `.auth/storage-state-builder-clean.json`).

### Capture the admin session (one-time)

```bash
node uat/capture-session.mjs   # interactive browser (CAS) login as the real admin user
```

### Run the probes

```bash
# All UAT specs (uses the captured admin session)
PATH="$PATH" npx playwright test --config=uat/playwright.config.js

# Anonymous-only probes (no Drupal session — verifies lockdown)
PATH="$PATH" npx playwright test --config=uat/playwright-nosession.config.js

# One probe at a time
PATH="$PATH" npx playwright test --config=uat/playwright.config.js block-build
PATH="$PATH" npx playwright test --config=uat/playwright.config.js route-crawl
PATH="$PATH" npx playwright test --config=uat/playwright.config.js views-display
```

UAT reports: `uat/test-results/html-report-uat/`. UAT findings: `uat/UAT-ADMIN-OVERVIEW.md`, `results/UAT-BLOCK-HEALTH.txt`.

## 4) Important env vars

- `BASE_URL` (required)
- `STORAGE_STATE` (defaults to `.auth/storage-state.json`)
- `LOGIN_LINK` (one-time interactive capture)
- `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` (optional, for basic-auth protected sites in the main suite)
- `UAT_BASE`, `UAT_BASIC_AUTH_USER`, `UAT_BASIC_AUTH_PASS` (override the uat config defaults)
- `HEADLESS`, `SCREENSHOT`, `TRACE` (optional runner controls)

## 5) When editing or generating tests

Always read the block docs first: `docs/block-profiles/<block>.md` and `docs/test-inputs/<block>.md`. Check the helper in `helpers/` for its exact signature before calling it.

For agent usage and detailed onboarding see `AGENT_INSTRUCTIONS.md` and `AGENTS.md`.

---

Quick steps for a new user (new site) or same site with a different user

1) New site (use the clean/template copy)
- Open the clean/template folder on your desktop.
- Capture a login session (paste your one-time login link when prompted):

  BASE_URL="https://your-site" LOGIN_LINK="https://your-site/user/one-time-login/XYZ" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" node -e "(async()=>{const { chromium }=require('playwright');const b=await chromium.launch({headless:false});const c=await b.newContext();const p=await c.newPage();await p.goto(process.env.LOGIN_LINK);console.log('Complete login in the opened browser, then press ENTER');process.stdin.once('data', async()=>{require('fs').mkdirSync('.auth',{recursive:true});require('fs').writeFileSync(process.env.STORAGE_STATE||'.auth/storage-state.json', JSON.stringify(await c.storageState()));await b.close();process.exit(0);});})();"

- Run a spec:
  BASE_URL="https://your-site" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js

2) Same site, different user (use the no-creds copy)
- In the no-creds folder capture a new storage state for the other user and save e.g. .auth/storage-state-alice.json with the same capture command but STORAGE_STATE changed.
- Run tests using STORAGE_STATE=".auth/storage-state-alice.json".

Notes:
- BASE_URL is required for remote sites.
- Do not commit .auth/ files. The template/no-creds copies do not include storage-state files by design.
- For UAT with HTTP Basic, use the uat config which already includes httpCredentials and a pre-captured storage state.

See results/views-autofill-list.md for an example result output.
