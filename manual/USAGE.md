# Usage

Two workflows. Shared prereqs:
- Node.js 18+
- Playwright installed (`npx playwright install`)

## Workflow A — Block suite (any Drupal site)

Prereqs:
- A reachable Drupal site (`BASE_URL`)

Setup:
```
npm install
npx playwright install
```

Capture login (one-time):
- Option A: Let the agent open your `LOGIN_LINK` and save `.auth/storage-state.json` when you finish login and press ENTER.
- Option B: Manually capture storage state using a short Playwright script and save as `.auth/storage-state.json`.

Run:
```
Full suite: PATH="/usr/local/bin:$PATH" npx playwright test
Single spec: BASE_URL="https://your-site" STORAGE_STATE=".auth/storage-state.json" PATH="$PATH" npx playwright test tests/image.spec.js
```

## Workflow B — UAT probes (builder-clean)

Prereqs:
- Access to `https://builder-clean.docker-uat01.ust.hk` (basic-auth protected)
- A captured admin session at `.auth/storage-state-builder-clean.json`

Capture the session (one-time):
```
node uat/headless-login.mjs    # headless login with the helper account
node uat/capture-session.mjs   # interactive browser (CAS) login as the real admin user
```

Run:
```
# All UAT specs (session-based)
PATH="$PATH" npx playwright test --config=uat/playwright.config.js

# Anonymous-only probes (verifies admin lockdown with no Drupal session)
PATH="$PATH" npx playwright test --config=uat/playwright-nosession.config.js

# One probe at a time
PATH="$PATH" npx playwright test --config=uat/playwright.config.js block-build
PATH="$PATH" npx playwright test --config=uat/playwright.config.js route-crawl
PATH="$PATH" npx playwright test --config=uat/playwright.config.js views-display
PATH="$PATH" npx playwright test --config=uat/playwright.config.js zz-all-blocks
```

## Reports and artifacts

- Main suite HTML report: `npm run report` (opens `test-results/html-report`); failure artifacts in `test-results/artifacts/`
- UAT HTML report: `uat/test-results/html-report-uat/`; UAT artifacts in `uat/test-results/artifacts/`
- UAT findings: `uat/UAT-ADMIN-OVERVIEW.md` (admin walkthrough), `results/UAT-BLOCK-HEALTH.txt` (health status)

If unsure, read `docs/` for block profiles and exact test inputs before editing tests.
