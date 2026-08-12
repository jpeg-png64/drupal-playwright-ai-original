# Agent and Test Conventions (short)

- Tagging: add `@media-modal` for tests that use the media modal; add `@combined` for many-block combined tests.
- Projects run in order: parallel (default) → solo (@media-modal) → combined (@combined).
- Always read these before editing or generating a spec:
  - docs/block-profiles/<block>.md
  - docs/test-inputs/<block>.md
  - helpers/<block>.js
- Helper signatures vary — check code before calling.
- Do not modify helpers unless explicitly requested by a human.

Agent behavior:
- Prompt for BASE_URL and login link/storage-state.
- Run interactive capture only when user consents and runs locally.
- Keep replies short and give exact commands to run.

