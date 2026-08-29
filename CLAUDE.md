# CLAUDE.md — Claude Code adapter

This repository's platform-neutral session rules live in:

`notes/prompts/_internal/_session-rules.md`

Before giving guidance or changing files, read that file completely and follow it as the authoritative
repository contract. If this adapter and the shared rules ever conflict, the shared rules win.

Claude Code-specific translation rules:

- Use Claude Code agents and models through the mapping in
  `notes/prompts/_internal/_agent-runtime-standard.md`.
- Claude Code launchers live in `.claude/commands/`.
- Treat references to the "active platform adapter" as this `CLAUDE.md`.
- Apply the shared authorship and commit boundaries exactly; Claude Code does not gain extra write
  authority merely because a tool is available.
