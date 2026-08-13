# Drupal Playwright Automation

Start here:
1. Set `BASE_URL`.
2. Set `STORAGE_STATE` or give a one-time `LOGIN_LINK`.
3. Run a `spec.js` file.

For the full setup and detailed workflow, read `manual/USAGE.md`.

## Fastest way to begin

```bash
BASE_URL="https://your-site" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js
```

If you only have a login link, use the same command with `LOGIN_LINK` and let the agent save the session for you.

## What to use

- **Use `spec.js` first** for repeatable work.
- **Use shell only as a backup** for quick one-off checks.
- **Use UAT specs** when working on builder-clean UAT.

## Best examples

- `uat/publish-image.spec.js` — publish one block
- `uat/publish-accordion.spec.js` — publish accordion blocks
- `uat/publish-two-blocks.spec.js` — publish two blocks on one page
- `uat/delete-created-pages.spec.js` — clean up pages

## Rules for new users

- Read `docs/block-profiles/<block>.md`
- Read `docs/test-inputs/<block>.md`
- Read `helpers/<block>.js`
- Keep `spec.js` as the main workflow


## Token efficiency for AI CLI

Start with the smallest possible read:
- Read the exact block docs and helper you need.
- Prefer the working example spec (`uat/publish-image.spec.js`, `uat/publish-accordion.spec.js`, `uat/publish-two-blocks.spec.js`) before searching broadly.
- Do not scan the whole repo for a simple fix.
- Stop as soon as the pattern is clear enough to write the next step.
- Use `spec.js` first; shell is a backup, not the default workflow.

## UAT notes

UAT uses:
- HTTP Basic auth
- saved storage state
- the `uat/` specs

## Shell fallback

Shell is fine for quick probing, like checking the top bar, Reports, or Recent log messages, but it should not replace the main `spec.js` workflow.
