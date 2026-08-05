---
description: Generate a Playwright spec from a Drupal block documentation file.
mode: subagent
---

# Workflow

Always begin by reading `AGENTS.md`.

Treat `AGENTS.md` as the highest priority instructions.

Then:

1. Read the requested `docs/<block>.md`.
2. Read only the required helper files.
3. Read at most ONE similar spec if needed.
4. Generate:

```
tests/<block>.spec.js
```

5. Overwrite the existing spec if it already exists.
6. Run only:

```bash
npx playwright test tests/<block>.spec.js
```

Never run the entire Playwright suite unless requested.

---

# Generation Rules

- Reuse helpers.
- Never recreate helpers.
- Never modify helpers unless requested.
- Follow AGENTS.md.
- Follow the documentation exactly.
- Generate JavaScript Playwright tests only.

---

# Validation

Verify:

- Block added
- Configuration saved
- Publish successful
- Frontend rendered
- No Drupal errors

---

# Failure Handling

If the test fails:

Stop immediately.

Do not:

- Retry
- Modify code
- Guess selectors
- Add waits
- Rewrite helpers

Analyze only:

- Failed test
- Failed step
- Failed locator
- First Playwright error

Report:

- Likely cause
- Suggested fix

---

# Reports

Always generate:

```
test-results/<block>-report.md
```

Include:

- Status
- Files read
- Validation summary

If failed also include:

- Failed step
- Locator
- Error
- Likely cause

Generate failure artifacts only on failure.

---

# Output

Success:

```
Done
```

Failure:

```
Exit Code: <code>

Test:
...

Step:
...

Locator:
...

Error:
...

Likely Cause:
...
```
