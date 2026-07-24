---
description: Run a live mock technical interview from your Q&A bank, scored, tracking weak areas across sessions
argument-hint: MODE=full|topic [TOPIC=angular|sql|java|...] [SECTION=all|## Routing] [LANGUAGE=es|en]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/interview/simulator-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- This is a live conversation, not a batch job: ask one question at a time and wait for the answer. Never show the model answer before Victor has attempted his.
- Run `/interview-prep-audit` first — the simulator draws from the Q&A bank and has nothing to ask without it.
- Update `interview-prep/SESSION-LOG.md` at the end so the next session knows the weak areas.
