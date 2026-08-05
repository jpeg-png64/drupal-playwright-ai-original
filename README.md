# Drupal Playwright Automation

Playwright test suite for Drupal custom blocks (32 tests / 19 specs / 15 blocks).

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

Technical docs live in [`docs/`](docs/): block documentation, exact test inputs (`docs/test-inputs/`), and exploration workflows.
