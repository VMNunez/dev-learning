---
description: Sync or re-optimise the GitHub profile README in the separate portfolio repo
argument-hint: MODE=sync|optimize
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/strategy/apply/profile-readme-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- Edits `dev/portfolio/VMNunez/README.md` — a **separate repo**. Its commit and push rule is the prompt's own, in `profile-readme-prompt.md` → "After generating"; follow it there.
- `sync` pulls in fact deltas only; `optimize` re-evaluates the whole thing against the job target. Do not silently do the second when asked for the first.
