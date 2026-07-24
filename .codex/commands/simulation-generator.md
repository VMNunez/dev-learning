---
description: Write new timed technical-test specs (Angular / Spring Boot / SQL) into the simulation bank (runs inside Codex)
argument-hint: TYPE=angular|spring-boot|sql|all  [COUNT=2] [DIFFICULTY=standard|challenge] [FOCUS=...]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/simulations/simulation-generator-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- `TYPE = sql` first reads `practice/sql/PLANNING.md` §8: a SQL test may only require techniques from steps already closed, and the prompt refuses if fewer than three are. Do not override that.
- Match the existing bank's format exactly — read the two most recent specs in the folder before writing.
- Study materials commit on the active branch; check `git branch --show-current` and stop if it is `main`.
