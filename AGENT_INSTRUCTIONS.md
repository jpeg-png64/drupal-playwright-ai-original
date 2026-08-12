# Agent Quick Guide (what to ask and do)

Goal: let a new user run tests by pasting a login link or uploading storage state.

Steps an agent should follow (short):
1. Ask the user for BASE_URL (required).
2. Ask for a one-time login link (LOGIN_LINK) or a path to STORAGE_STATE.
3. If LOGIN_LINK provided: open it in a browser, let the user log in, then press ENTER to save storage state to STORAGE_STATE (.auth/storage-state.json by default).
4. Run the requested spec with BASE_URL and STORAGE_STATE set.

Rules:
- Never store or echo credentials or storage-state contents.
- Do not attempt drush on remote sites (only allowed when BASE_URL is localhost and ALLOW_DRUSH=true).
- Always remind the user which command will run and show the exact env vars used.

Example run (single spec):
BASE_URL="https://example.com" STORAGE_STATE=".auth/storage-state.json" PATH="/usr/local/bin:$PATH" npx playwright test tests/image.spec.js

