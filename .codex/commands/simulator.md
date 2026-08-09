---
description: Run a live mock technical interview from your Q&A bank, scored, tracking weak areas across sessions
argument-hint: MODE=full|topic LEVEL=junior|middle|senior LANGUAGE=es|en [TOPIC=angular|css|sql|java|spring-boot|typescript|architecture|general|security|git] [SECTION=all|exact heading] [MAX_QUESTIONS=N]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/interview/simulator-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- This is a live conversation, not a batch job: ask one question at a time and wait for the answer. Never show the model answer before Victor has attempted his.
- `TOPIC` and `SECTION` apply only to topic mode; `SECTION` accepts `all` or any exact section heading. Blank `MAX_QUESTIONS` means 10–12 in full mode and every question in the selected scope in topic mode.
- Run `/interview-prep-audit` first — the simulator draws from the Q&A bank and has nothing to ask without it.
- Update `interview-prep/SESSION-LOG.md` at the end so the next session knows the weak areas.
