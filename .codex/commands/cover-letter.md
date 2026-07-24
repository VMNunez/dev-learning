---
description: Write a tailored carta de presentación, or a short recruiter message, in the same voice as the CV
argument-hint: MODE=letter|message EMPRESA=... PUESTO=... [CONTACTO=recruiter name]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/strategy/apply/cover-letter-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- Ask for the job offer text if it was not pasted — both modes are tailored to it and a generic letter is worse than none.
- Output only — nothing is written to the repo.
