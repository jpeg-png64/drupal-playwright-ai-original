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



## Token efficiency
- Read the smallest set of files needed.
- Prefer the example spec and one helper before broad searches.
- Stop once the pattern is clear enough to act.
- Use shell only for quick single checks, not as the default path.
