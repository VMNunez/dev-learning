---
description: Create, review, or tailor the one-page Spanish CV to a job offer, with an ATS check and a gap analysis
argument-hint: MODE=create|review|tailor [EDUCATION=...|auto] [CAMBRIDGE="obtained (B2)"|"in progress (B1→B2)"|"not yet started"] [LOCATION=...|auto] [PHONE=...|auto] [PROJECTS=list|auto] [BASE_CV=path|auto]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/strategy/apply/cv-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- `EDUCATION`, `LOCATION`, `PHONE`, and `PROJECTS` may use `auto`; `CAMBRIDGE` must use one of the three canonical values in the hint and never accepts `auto`.
- `BASE_CV` applies only to `tailor`; use a path or `auto` for the most recent master CV in `job-search/master`.
- `tailor` needs the job offer pasted; ask for it if missing, and append the posting to `notes/prompts/_internal/_job-market-evidence.md` as the prompt specifies.
- Output goes to `job-search/` **outside the repo** — never committed from here.
- Every bullet must be defensible in an interview: nothing on the CV that Victor cannot explain.
