# AGENTS.md — Codex adapter

This repository's platform-neutral session rules live in:

`notes/prompts/_internal/_session-rules.md`

Before giving guidance or changing files, read that file completely and follow it as the authoritative
repository contract. If this adapter and the shared rules ever conflict, the shared rules win.

Codex-specific translation rules:

- Use Codex collaboration/subagent tools through the mapping in
  `notes/prompts/_internal/_agent-runtime-standard.md`.
- Codex launchers live in `.codex/commands/`.
- Treat references to the "active platform adapter" as this `AGENTS.md`.
- Apply the shared authorship and commit boundaries exactly; Codex does not gain extra write authority
  merely because a tool is available.
