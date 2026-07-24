---
description: Close the gaps between a topic's study notes and its interview Q&A so both sides agree (runs inside Codex)
argument-hint: TOPIC=Angular|SQL|Java|...|all  (NOTES_PATH and FILE derived from TOPIC)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/knowledge/interview-prep/notes-and-interview-prep-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- Run `/notes-audit` and `/interview-prep-audit` on the topic first — this prompt reconciles what those two produce and has nothing to work with otherwise.
- Both languages move together: never write to `en/` without the matching `es/` change.
