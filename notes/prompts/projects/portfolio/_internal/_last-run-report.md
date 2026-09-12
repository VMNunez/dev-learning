# portfolio-audit — last run report

**Date:** 2026-09-12
**Target:** `PROJECT_PATH = projects/04-meal-finder`, `PORTFOLIO_SCOPE = full`, `DRY_RUN = true`
**Status:** open

## 1. Close-out check against disk

Declared files, from `README.md`'s catalogue row: `notes/interview-prep/projects/en/04-meal-finder.md`
(created, 126 questions), `notes/interview-prep/projects/es/04-meal-finder.md` (created, 126),
`notes/cv/cv-bullets.md` (**correctly not written** — Phase 3 is skipped on a Check 3 stop, so nothing may
reach it), `dev/portfolio/VMNunez/README.md` (**correctly not written** — the ✅-only step, and no verdict
was computed; the external-path preflight was therefore never triggered, that path being neither read nor
written), plus this report, `_run-tracker.md`, `_breach-log-portfolio-audit.md` and
`_recommendation-ledger.md`.

`git status` + `git log --name-only`: the two bank files are untracked in the working tree, which is the
dry branch as written. The ledger row landed in `11482418`; the tracker cell, the breach-log row and this
report land in the close-out commit. No commit of the audit outputs, so no `git add` touched them.

**Declared dispatches — 10 required, 11 made.** Four present sections × (author + reviewer) = 8, plus one
translator and one Spanish reviewer = 10 roles, every one of which ran. The eleventh is the death-ladder
re-dispatch in bullet 3. Security & Auth was skipped for the project (no auth, no guards, no interceptors
anywhere in `src/`), so its pair is not owed.

## 2. Plan vs reality

The split held, and the evidence is **not** the subagents' own traces. All four sections were authored
below their own acceptance bar and lifted to it by the cold reviewer — ratios 0.78 → 1.00, 0.81 → 1.00,
0.74 → 1.00, 0.81 → 1.00, the reviewers adding 10, 6, 6 and 5 questions. That is 27 questions the authors
missed and a second pass caught, which is the section-sized unit doing what it exists for. No reviewer was
re-dispatched on a below-1 ratio, so that gate never fired.

This pipeline has **no step that reads the finished bank whole and is not written by the slice owners** —
the cross-section scan reads bold lines only, and stage C reads the twin, never the English. So beyond
those ratios this bullet claims no more than the traces prove.

**One sizing fact worth recording:** this is the first project bank to run the **Testing** section; runs
01–03 all skipped it. The standard's stub rule decided it in both directions, correctly and cheaply —
counting what the specs *assert* rather than what exists found three hand-authored assertions on 04
against zero real ones on 03.

## 3. Failures & retries

**The Testing reviewer was killed mid-flight by an Opus session limit**, after applying 3 of its 7 factual
repairs and writing none of its 5 new questions. This is the one dispatch failure the runtime standard
says destroys work already done, and the scratch-path requirement is what saved it: the persisted file held
the complete 27-decision inventory, the identity check, the marker audit and the cross-section dedupe —
but **no `N lines, read to EOF` proof and no verdict token**, so it was a partial return and not an
approval. The ladder ran as written: read what it persisted, could not resume (the model was
rate-limited), re-dispatched once on the strongest *available* model per the runtime standard's
substitution clause. The re-dispatch was seeded with the role's **own** prior findings — not an author's
reasoning — finished the application half and returned `FIXED` at ratio 1.00. The death consumed no
acceptance-gate retry, correctly: a death is not a below-1 ratio.

Stage T self-reported 10 marker transcription slips it caught in its own verification pass. Those were
**verified independently per ID** before the parity gate passed — a self-reported correction is precisely
the class of claim a parity count cannot catch.

## 4. Rule friction and rule breaches

**Breached — `CLAUDE.md` → `Claude Code adapter`, `BRCH-0002`, the second row on that step.**
`_session-rules.md` was read at the close-out, after the bank, the twin, the header stamp and the tracker
cell were written, and then only in part. `BRCH-0001` names the same step one run earlier. The cost is no
longer hypothetical: that file carries the non-negotiable **"No `Co-Authored-By` lines"**, while this
session's own harness reminder instructed the opposite footer and asserted it superseded earlier
attribution guidance. On `DRY_RUN = false` the bank commit *precedes* the point where both runs performed
this read, so that ordering ships a commit with a forbidden footer; only the dry branch's deferral of every
commit past the read caught it here. Two rows on one step, so bar condition 2 is met by the count alone —
and the scope is `shared`, so it is routed and never fixed here: **`REC-232`**, citing both `BRCH` IDs and
naming the log file. Commit convention followed: no footer, per the repo rule.

**Friction, recorded and not applied — a scratch file holding analysis but no verdict.** The runtime
standard says to read a dead reviewer's scratch path, and says a file lacking the proof line and a verdict
token is a partial return taking the ladder. It does not say whether the single re-dispatch may be
*seeded* with that partial work or must be cold. Both readings are defensible; seeding preserved an
analysis a cold re-dispatch would have paid for twice. **Fails bar condition 3** — the section's content
would have come out equivalent either way, so this is cost, not result — and the text is
`_agent-runtime-standard.md`'s in any case, not this prompt's.

**Report discipline (bullet 2's half).** The Architecture author volunteered a **presence ruling about a
different section** — that Testing was a skip — outside its declared return contract and outside its lane;
`_portfolio-write-prompt.md` says nothing about presence and the orchestrator owns it. Taken at face
value, the bank would be 27 questions and three `⭐⭐⭐` poorer. The orchestrator verified against the specs
and commit `0a8f8100` and overruled it. **No edit owed**: the prompt already states who decides presence
and what an author may return, which is bar condition 4.

**`REC-231`'s shape reproduced, on the same run-class it was opened on.** The Technical Decisions author
found a precision defect in `04-meal-finder-011` — its answer frames change detection as if `zone.js`
drove it, in an app that ships none — in a section it was not reviewing. The claim is literally true, so
it is not the falsifiable-error class `REC-231` carries, but the routing gap is identical: no role may
repair it (the orchestrator never authors or audits a section), and the final report is its only channel.
Reported there, unrepaired.

## 5. Verdict

**Change worth considering: none for this prompt.** No edit is drafted, so **no cold reviewer was
dispatched** and there is no `cold reviewer:` line to record — the two findings clearing bar condition 1
are both `shared` scope, belonging to files this run may not edit (`REC-232` → `CLAUDE.md` and the shared
step-0 lists; the scratch-seeding question → `_agent-runtime-standard.md`, which fails condition 3
anyway). `Status: open` records `REC-232` as the real, unapplied machinery change this run's evidence
opened, exactly as the previous run's `Status` recorded `REC-231`.

`maps unaffected` — no edit landed. **`map: verified`** — the whole-file read of this prompt fired the read
trigger, and every row either map claims about it was checked and is true as written: `README.md`'s
Public-interface-index row (command, config trio, runtime/commit owner, and the run-first chain including
`REC-218`'s step-0 announcement and `REC-217`'s markerless branch) and its catalogue row's *reads* and
*generates* cells; `_system-map.md` §7 for `interview-prep/projects/en|es/*.md`, §8's authoring-progress
row, the G7 line in the gate chain including G6's two closing conditions, and §81's no-human-gate row.
Nothing corrected, so no map commit.

**Health budget: 998 lines, over the ~500 smoke alarm.** Largest section by far is
`## Single-project procedure` at 441 lines — 44% of the file — then `## Finishing` (157) and
`## Hard rules` (102). Named as the contract requires; no extraction proposed, because no edit is being
applied and one-in-one-out binds only a run that is adding. Worth flagging for whoever edits it next:
`## Single-project procedure` holds Phases 1a/1b/1c/2/3 inline, and Phase 1c is the youngest and most
self-contained of them.
