---
description: Create, review, or tailor the one-page Spanish CV to a job offer, with an ATS check and a gap analysis
argument-hint: MODE=create|review|tailor  (personal fields default to auto — read from the existing CV)
---

Read `notes/prompts/strategy/apply/cv-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- Personal fields (EDUCATION, LOCATION, PHONE, CAMBRIDGE) default to `auto` — read them from the existing CV in `personal/job-search/` rather than asking.
- `tailor` needs the job offer pasted; ask for it if missing, and append the posting to `notes/prompts/_job-market-evidence.md` as the prompt specifies.
- Output goes to `personal/job-search/` **outside the repo** — never committed from here.
- Every bullet must be defensible in an interview: nothing on the CV that Victor cannot explain.
