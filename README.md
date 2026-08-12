# Drupal Playwright Automation — Quick Start

Simple Playwright tests for Drupal custom blocks. Tests reuse shared helpers and a consistent flow: login, create a Standard Page, add a section, add block(s), publish, and verify the frontend.

1) Install

PATH="/usr/local/bin:$PATH"
npm install
npx playwright install

2) Capture login (one-time)

- Preferred: Provide the one-time login link (LOGIN_LINK). The test runner can open it and save an authenticated storage state.
- Or: Capture storage state manually and save to .auth/storage-state.json.

Quick interactive capture (agent or manual):

LOGIN_LINK="https://example.com/user/one-time-login/XYZ" BASE_URL="https://example.com" STORAGE_STATE=".auth/storage-state.json" PATH="$PATH" npx playwright test --project=parallel --grep "capture"

(When prompted, complete login in the opened browser and press ENTER to save.)

3) Run tests

Full suite:
PATH="$PATH" npx playwright test

Single spec:
BASE_URL="https://your-site" STORAGE_STATE=".auth/storage-state.json" PATH="$PATH" npx playwright test tests/image.spec.js

4) Important env vars
- BASE_URL (required for remote sites)
- STORAGE_STATE (defaults to .auth/storage-state.json)
- LOGIN_LINK (one-time interactive capture)
- ALLOW_DRUSH=true (only for local Docker; disabled for remote sites)
- HEADLESS, SCREENSHOT, TRACE (optional runner controls)

5) When editing or generating tests
Always read the block docs first: docs/block-profiles/<block>.md and docs/test-inputs/<block>.md. Check the helper in helpers/ for its exact signature before calling it.

For agent usage and detailed onboarding see AGENT_INSTRUCTIONS.md and AGENTS.md.
