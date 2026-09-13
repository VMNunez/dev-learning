# portfolio-audit — last run report

**Date:** 2026-09-13
**Target:** `PROJECT_PATH = projects/04-meal-finder`, `PORTFOLIO_SCOPE = full`, `DRY_RUN = true`
**Status:** open

## Close-out check against disk

**(a) Declared files** (`README.md` catalogue row): `interview-prep/projects/en/04-meal-finder.md` and its
`es/` twin — both written this run, untracked in the working tree (dry branch). `notes/cv/cv-bullets.md` —
bullet appended, uncommitted. `dev/portfolio/VMNunez/README.md` — row 04 refreshed, uncommitted in that
repo (resolved path `C:/Users/Victor/Documents/main/dev/portfolio/VMNunez`; external-path preflight passed
before the read). This report and `_run-tracker.md` land in the close-out commit; `_recommendation-ledger.md`
landed in `0fdedf89`. No breach-log row written.

**(b) `git status` + `git log`:** the four audit outputs are dirty, none committed — the dry branch as written.

**(c) Declared dispatches — 10 required, 12 made.** Four present sections × (author + reviewer) = 8, one
translator, one Spanish reviewer. The two extra are both stage T: a death-ladder re-dispatch and the parity
retry (bullet 3). Security & Auth skipped for the project — no auth anywhere in `src/`.

## 1. Plan vs reality

The section split held on the reviewers' own ratios (every section re-walked to 1.00 after the reviewer
added 3 / 1 / 3 / 1 questions and rewrote 30+ answers that the 2026-09-12 bank had shipped wrong). This
pipeline still has no step that reads the finished English bank whole outside the slice owners, so beyond
that the bullet claims no more than the traces prove. **The one step that did read a finished artefact
against its source was the orchestrator's own per-ID check of the twin, and it overturned stage T's
`RE-SYNCED`** — see bullet 3.

## 2. Report discipline

Nothing trimmed. The Business Rules reviewer reported "concurrent edits" (question 001's marker changing
between two reads); checked on disk, 001 was unchanged — a misread, no second writer existed.

## 3. Failures & retries

- **Stage T died on an Opus weekly limit** before writing a byte (`es/` mtime unchanged). Ladder: nothing
  persisted, resume impossible on the limited model, re-dispatched once on Sonnet — the strongest model
  still available, per `_agent-runtime-standard.md` → `Reasoning tiers`. Stage C ran on Sonnet for the same
  reason. Both substitutions are tier deviations the runtime standard permits; recorded, not a breach.
- **The re-dispatched T returned `RE-SYNCED` with matching counts and a claimed-empty marker diff, and was
  wrong.** Independent check: `-101` still said *seis* for *five*, `-033` kept a retracted claim, 12 bold
  lines never re-rendered, 9 markers differed. One retry was taken naming the 41 IDs this run changed; the
  second pass fixed 18 blocks + 9 markers, and ID-and-marker sequence equality was then verified by command.

## 4. Rule friction and rule breaches

**Friction — the Phase 1b parity gate is count-only.** It licenses a retry only on a count mismatch or a
missing sub-heading, so the stale twin above passed it; the retry was taken on the runtime standard's
*verify returned evidence* clause, not on the gate. Clears conditions 1–3 (a shipped twin would have been
wrong where Victor answers from it); condition 4 is arguable only via that generic clause. Second run in a
row where the orchestrator had to verify stage T beyond counts (2026-09-12: 10 self-reported marker slips).
Routed as **`REC-236`** rather than edited here: the cold reviewer this contract requires is `deep` tier and
the deep model was rate-limited for the rest of the session, so the tie goes to `open`.

**`BRCH-0001`/`0002` step (`CLAUDE.md` → `Claude Code adapter`) was reached and not breached** —
`_session-rules.md` read to EOF at step 0, before any dispatch or write. Both rows are `routed to REC-232`,
not `fixed`, so no confirmation count moves. No new breach.

## 5. Verdict

**Change worth considering: `REC-236`** — widen the parity gate to ID-and-marker sequence identity and check a
re-run T against the list of IDs the run changed. No edit drafted, so **no cold reviewer dispatched**.

`maps unaffected` — no edit landed. **`map: verified — README.md catalogue row`** (reads / generates, and the
"translator gated on per-section counts" description, which is exactly the defect `REC-236` names and is
therefore true as written). `_system-map.md` rows: `map: not verified — not opened this run`.

**Health budget: 998 lines, over the ~500 smoke alarm**; largest section `## Single-project procedure`
(441 lines). Unchanged since the last report; one-in-one-out binds whoever resolves `REC-236`.
