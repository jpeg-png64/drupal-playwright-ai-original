# AI CLI Agent — Startup Instructions

Purpose: make the test suite usable by a new user or AI CLI agent immediately.

Quick checklist (enforced):
1. Prompt the user for BASE_URL (required). Do NOT default to localhost.
2. Prompt the user for their one-time login link or for a pre-captured STORAGE_STATE file path.
3. If the user gives a login link (LOGIN_LINK), the agent will run interactive capture automatically:
   - The agent sets env: BASE_URL, STORAGE_STATE (optional), LOGIN_LINK and runs the test runner.
   - global-setup will open a browser to LOGIN_LINK and wait for the user to complete login in that browser window. When the user indicates completion (press ENTER in the agent terminal), the agent saves the authenticated storage state to STORAGE_STATE.
   - This flow lets the user simply paste their login link; no manual file conversions are required.
4. If BASE_URL includes "localhost" and ALLOW_DRUSH=true, agent may attempt drush uli; otherwise do NOT run drush.
5. Read these files before generating or editing any spec: `docs/block-profiles/<block>.md`, `docs/test-inputs/<block>.md`, `helpers/<block>.js`.
6. Tag generated tests correctly: add `@media-modal` when using media modal; add `@combined` for many-block combined tests.
7. Run the targeted spec with env vars set: BASE_URL, STORAGE_STATE, optional HEADLESS/SCREENSHOT/TRACE.

One-line capture (user runs locally after opening login link in the browser window launched by this snippet):

```bash
PATH="/usr/local/bin:$PATH" node -e "(async()=>{const { chromium }=require('playwright');const b=await chromium.launch({headless:false});const c=await b.newContext();const p=await c.newPage();await p.goto(process.env.BASE_URL);console.log('Open your login link in the opened browser then press ENTER');process.stdin.once('data', async()=>{require('fs').writeFileSync(process.env.STORAGE_STATE||'.auth/storage-state.json', JSON.stringify(await c.storageState()));await b.close();process.exit(0);});})();"
```

Sample run (single spec):

```bash
BASE_URL="https://your-site.example" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js
```

Errors and guidance:
- If BASE_URL is missing, abort and prompt for it.
- If STORAGE_STATE missing for remote site, instruct manual capture; do not auto-fallback to drush unless allowed.

Keep responses terse and provide the user with exactly the prompts and commands they must run. Save no credentials.
