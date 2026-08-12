# Usage (short)

Prereqs:
- Node.js 18+
- Playwright installed (npx playwright install)
- A reachable Drupal site (BASE_URL)

Setup:
npm install
npx playwright install

Capture login (one-time):
- Option A: Let the agent open your LOGIN_LINK and save .auth/storage-state.json when you finish login and press ENTER.
- Option B: Manually capture storage state using a short Playwright script and save as .auth/storage-state.json.

Run:
Full suite: PATH="/usr/local/bin:$PATH" npx playwright test
Single spec: BASE_URL="https://your-site" STORAGE_STATE=".auth/storage-state.json" PATH="$PATH" npx playwright test tests/image.spec.js

Reports and artifacts:
- HTML report: npm run report (opens test-results/html-report)
- Failure artifacts and traces are in test-results/artifacts/

If unsure, read docs/ for block profiles and exact test inputs before editing tests.
