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
node uat/headless-login.mjs    # headless login with the helper account
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

- `BASE_URL` (required for remote sites)
- `STORAGE_STATE` (defaults to `.auth/storage-state.json`)
- `LOGIN_LINK` (one-time interactive capture)
- `ALLOW_DRUSH=true` (only for local Docker; disabled for remote sites)
- `HEADLESS`, `SCREENSHOT`, `TRACE` (optional runner controls)

## 5) When editing or generating tests

Always read the block docs first: `docs/block-profiles/<block>.md` and `docs/test-inputs/<block>.md`. Check the helper in `helpers/` for its exact signature before calling it.

For agent usage and detailed onboarding see `AGENT_INSTRUCTIONS.md` and `AGENTS.md`.
