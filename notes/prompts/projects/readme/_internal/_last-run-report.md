# Pipeline self-report — readme-audit

Date: 2026-09-24 · Project: projects/07-timetrack (full-stack → targets `global`, `backend`, `frontend`)
Status: clean

- **Report discipline** — nothing discarded; every dispatch returned an actionable verdict and summary within budget. The dispatch count was 16 against 13 required (3 authors, 3 reviewers, 1 coherence pass, 3 judges, 3 appliers), plus 3 re-dispatches, all itemised below.
- **Trace verification** — all three reviewer traces were complete on the first pass (global 12 sections + final line, backend 9, frontend 7, each in standard order). No trace re-dispatch, no false alarm.
- **Coherence** — 2 conflicts:
  - One real rationale divergence between the global README and PLANNING §19. It was re-dispatched to the global reviewer and aligned.
  - One fact where PLANNING §9 claims the demo password "is written in the global README" but no README ever carried it. No README re-dispatch can fix that, because the standard forbids inventing a password. The prompt's coherence branch only names "the README that is wrong", so it is silent when PLANNING is the wrong side. The orchestrator ruled no re-dispatch and routed the item to Victor.
- **Effect judge** — items per target: global 8 (+2 KEEP), backend 10 (+3 KEEP), frontend 8 (+3 KEEP).
  - Objections: 1, the global live-demo credentials ADD, **sustained** on rule 3's "never invent or guess a password". The GIF ADD was returned as not applicable, since nobody here can capture one.
  - The pre-commit `git diff` verification, read against a pre-judge baseline snapshot, **found two things**:
    - The global applier had cut the Tech stack Testing row on the false ground that the project has no tests. Four frontend specs and `ValidationMessagesTest` exist, and the standard's Testing-row clause positively includes the row. The orchestrator raised this as its own objection, **overruled the cut**, and re-dispatched B, which restored the row and made the tradeoff wording consistent with it.
    - The backend regroup (the Key patterns ADD) left one false "below" cross-reference. B was re-dispatched and fixed it.
  - `⚠ regenerable — standard gap`: 0 qualify under the prompt's criterion, since no effect-only `What I learned` cut matches a PLANNING objective. The appliers flagged 11 effect-only tier cuts (backend Key patterns, frontend Tradeoffs figures, global Project structure / How to run) as regenerable by analogy.
  - The judge outranks the green traces here: every target cleared its reviewer and still returned "does not land".
- **Failure protocol** — not triggered. No subagent errored, and no README was excluded from commit `db821281`.
- **Anything else** — no rule broken:
  - Step 0 ran: session rules read to EOF, previous `Status: clean` → silent.
  - Every mandated dispatch ran, and the diff verification ran before the commit.
  - One improvisation where the prompt is silent: the orchestrator folded a second, self-raised item (the Testing row a reviewer had removed) into the coherence re-dispatch of the global reviewer, which is outside that step's quote-the-conflict channel. The later applier undid it again, and the diff check caught that.
  - `FRIC-0002` dismissed on condition 3 (`e7ca3096`).
  - No breach log exists and none was created.
  - Prompt size is 325 lines.
- **Verdict** — pipeline clean. Friction recorded, not applied:
  - (a) coherence is silent when PLANNING rather than a README is the wrong side — fails condition 3, since the README output was unchanged;
  - (b) the regenerable flag covers `What I learned` only, while tier Key patterns/Tradeoffs cuts are just as re-addable from PLANNING — fails condition 1, hypothetical until a later run actually re-adds one;
  - (c) there is no declared channel for an orchestrator-raised finding before the judge step — fails condition 3, since the pre-commit diff check reached the same result.
