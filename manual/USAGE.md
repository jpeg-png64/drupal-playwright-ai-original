# Usage (Procedure Runbook)

This is the full step-by-step procedure. Keep root `README.md` as the quick start.

## 1. Before you run

- Node.js 18+
- Install dependencies:

```bash
npm install
npx playwright install
```

- Required env:
  - `BASE_URL` (target Drupal site)
  - `STORAGE_STATE` (saved session JSON), or a one-time `LOGIN_LINK` to capture it

## 2. First run (quick success path)

Run one known working spec first:

```bash
BASE_URL="https://your-site" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js
```

If you only have a login link, capture once, then rerun:

```bash
BASE_URL="https://your-site" LOGIN_LINK="https://your-one-time-login-link" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js
```

## 3. Create one block (spec.js-first workflow)

Procedure:
1. Read `docs/block-profiles/<block>.md`
2. Read `docs/test-inputs/<block>.md`
3. Check `helpers/<block>.js` signature
4. Run the target spec

Example:

```bash
BASE_URL="https://your-site" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/accordion.spec.js
```

## 4. Create two blocks on one page

Use the existing example:

```bash
PATH="/usr/local/bin:$PATH" npx playwright test uat/publish-two-blocks.spec.js --config=uat/playwright.config.js
```

## 5. Publish and verify frontend

Recommended publish examples:
- `uat/publish-image.spec.js`
- `uat/publish-accordion.spec.js`
- `uat/publish-two-blocks.spec.js`

Run one example:

```bash
PATH="/usr/local/bin:$PATH" npx playwright test uat/publish-image.spec.js --config=uat/playwright.config.js
```

## 6. Optional cleanup (user decides)

Cleanup is never automatic. Run only when you explicitly want deletion:

```bash
PATH="/usr/local/bin:$PATH" npx playwright test uat/delete-created-pages.spec.js --config=uat/playwright.config.js
```

## 7. Shell fallback (supplementary)

Use shell only for quick probing (top bar, Reports, Recent log messages).  
Primary workflow stays `spec.js`.

## 8. UAT procedure (builder-clean)

Prereqs:
- Access to `https://builder-clean.docker-uat01.ust.hk` (basic auth)
- Captured admin session at `.auth/storage-state-builder-clean.json`

Capture once:

```bash
node uat/capture-session.mjs
```

Run UAT suite:

```bash
PATH="/usr/local/bin:$PATH" npx playwright test --config=uat/playwright.config.js
```

Anonymous-only lockdown checks:

```bash
PATH="/usr/local/bin:$PATH" npx playwright test --config=uat/playwright-nosession.config.js
```

## 9. Troubleshooting

- Missing `BASE_URL`: set it explicitly before running.
- Session expired: recapture storage state with `LOGIN_LINK` flow or `uat/capture-session.mjs`.
- Helper mismatch: re-check `helpers/<block>.js` before editing spec.
- Media/modal flakiness: keep heavy tests tagged `@media-modal` or `@combined`.

## 10. Reports and references

- Main suite HTML report: `test-results/html-report/` (`npm run report`)
- UAT HTML report: `uat/test-results/html-report-uat/`
- UAT findings: `uat/UAT-ADMIN-OVERVIEW.md`, `results/UAT-BLOCK-HEALTH.txt`
