---
description: Log a job application, record an outcome, or analyse the tracker for patterns and skill gaps
argument-hint: MODE=log|update|analyze [EMPRESA=...] [PUESTO=...] [CANAL=...] [FUENTE=...] [CONTACTO=...] [CV_USADO=...]
---

Read `notes/prompts/strategy/apply/tracker-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- Writes `personal/job-search/tracker.csv` and its application folders — **outside the repo**, never committed from here.
- `log` accepts every listed field and leaves unknown optional values blank; `update` needs `EMPRESA` and uses `PUESTO` only to disambiguate; `analyze` needs no additional configuration.
- `analyze` reads outcomes and feedback to surface recurring skill gaps; when it finds one, suggest `/evidence-intake` so the gap reaches coverage.
