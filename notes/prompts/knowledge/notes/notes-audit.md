# Notes Audit

Build or audit exactly one planned study-note file.

The persistent notes plan decides the file, its level, and the exact coverage concepts it owes. This
prompt never scans or completes a whole folder.

> **▶ Run first:** `notes-plan-prompt` for this exact topic and level — this prompt can process only
> an entry from a current, coverage-fingerprinted plan.

## Configuration

```text
TOPIC = [one registered topic from `../coverage/_internal/_topic-ownership.md`]
LEVEL = [junior | middle | senior]
NOTE = [two-digit plan entry, for example 01]
```

Example:

```text
TOPIC = Angular
LEVEL = junior
NOTE = 01
```

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Run the four roles sequentially in cold contexts using the tiers specified below. There is no
single-agent fallback: if a required role cannot be dispatched or fails its retry gate, leave the
entry pending and stop.

## Resolve the selected entry

Derive the topic slug by lowercasing and replacing spaces with hyphens.

- `COVERAGE = notes/{topic}/coverage/{LEVEL}.md`
- `PLAN = notes/{topic}/coverage/notes-plan-{LEVEL}.md`
- `EN_DIR = notes/{topic}/{LEVEL}/en/`
- `ES_DIR = notes/{topic}/{LEVEL}/es/`

Read the active adapter, `_session-rules.md`, `_note-quality-standard.md`, `COVERAGE`, `PLAN`, and both
sibling-level coverage files — guard 8 below cannot clear a bullet as level-exclusive without them.

Before dispatching any role:

1. Stop on `main`.
2. Execute the run-start decision table in `_pipeline-self-report.md` against this prompt's
   `_internal/_last-run-report.md` if it exists. Never restate the shared `Status:` meanings or apply a
   surfaced finding inside this run.
3. Require `NOTE` to be exactly two digits.
4. Require exactly one `## {NOTE} — ...` entry in `PLAN`.
5. Calculate SHA-256 over `COVERAGE`'s **scope bytes** using the canonical command in "Evidence markers"
   in `_coverage-standard.md`, which alone defines the byte normalisation and marker stripping. Never
   reproduce or approximate that definition locally. Stop with `run notes-plan-prompt` when it differs from `Coverage SHA-256` in
   `PLAN`, and say in the stop message that markers were stripped first.
6. Require `Plan status: current`. `coverage-prompt` sets `stale` on a plan whose coverage moved under
   it, so this is a real gate, not a formality — a `stale` header stops the run with
   `run notes-plan-prompt` even if the fingerprint somehow still matches.
7. Require the entry's English and Spanish paths to remain inside the selected topic and level.
8. Require every assigned bullet, after stripping its plan `[ ]`/`[x]` prefix, to exist verbatim in
   `COVERAGE`, exactly once in the complete plan, and in neither sibling-level coverage file.
9. Require the selected entry to contain non-empty `Narrative role`, `Learning outcome`,
   `Prerequisites`, `Must answer`, and `Handoff` fields. Require `Prerequisites` to contain only
   `none` or earlier entries and agree with the mechanical `Depends on` gate. Stop with
   `run notes-plan-prompt` when this pedagogical contract is absent or malformed.
10. For entry `00`, require its plan contract to cover every topic-introduction invariant from
    `_note-quality-standard.md`, regardless of Action.
11. Require every dependency entry to be `complete` **or** `refined`. `refined` is the stronger
    guarantee, not a different one: this gate exists so the prose a later chapter builds on already
    exists, and a frozen pair's prose exists by definition. Unconsumed `Pending additions` on a
    dependency are appended material, not missing foundation — report them and proceed. Requiring
    literal `complete` would deadlock the whole route the moment Victor freezes its first chapter,
    since no prompt may ever move an entry off `refined`.
12. For `middle`, require the junior progression gate to be closed. For `senior`, require junior and
    middle to be closed. The gate is defined in "Progression gate" in `_coverage-standard.md`; its
    observable evidence is the earlier level's `Notes` and `Interview` tracker cells reading complete
    over their plan denominators.
13. If the entry is already `complete`, require every assigned concept to be `[x]`, verify both files
    exist, and report a no-op. A `complete` entry containing `[ ]` is malformed; stop with
    `run notes-plan-prompt`.
14. If the entry is `refined`, verify both files exist. With `Pending additions: none`, report a no-op
    only when every concept is `[x]`, and stop — a refined pair with nothing owed is never re-processed.
    Otherwise require the unchecked concept set to equal `Pending additions` exactly and run the whole
    pipeline in **append-only mode** for exactly those bullets. Never set, clear, or downgrade `refined`.
15. Read `Studied` independently from `Status`; a missing legacy field means `pending`. A dated marker
    is valid only on a `complete` or `refined` entry. A run that authors or audits a `pending` or
    `complete` entry passes `Studied: pending` to Stage C — and `Pending study: none` with it, because a
    note owed whole has no per-section gaps — since the accepted content changed under Victor and the
    whole note needs a new active study pass. **An append-only run is the exception**
    (changed 2026-08-22): it adds sections and alters nothing he studied, so an existing date is
    preserved and the appended headings go to Stage C as `Pending study` entries instead — the note
    stays studied and owes only the new sections. On an entry whose `Studied` is already `pending` there
    is no gap to record and `Pending study` stays `none`. A guard 13/14 no-op preserves both fields.

Guards 9 and 10 do not reopen a `refined` entry: a missing or malformed pedagogical contract on a frozen
pair is reported, not fixed, because fixing it would mean rewriting prose Victor has declared final.

Never accept an arbitrary file path or create a note absent from the current plan.

## Append-only mode

This mode exists so a note Victor has refined to his own bar can still receive a coverage concept that
was added later, without any prompt touching a line he already approved.

It binds every stage of this run:

1. Every pre-existing byte of the English and the Spanish file is immutable — no rewording, no
   restructuring, no reordering, no renumbering, no "improving", no TODO resolution, no link or heading
   fix inside existing text. A quality miss found in existing prose is reported, never fixed.
   **The TODO ban is a routing rule, not a dead end** (2026-08-22): a TODO Victor wrote on a refined pair
   is admissible work — see "The `refined` freeze" in `notes-plan-prompt.md` — but it belongs to the daily
   session, where `study-content-writer` resolves it in the language of the file carrying it. This
   pipeline stays out because a four-stage cold run is the wrong instrument for a corrected sentence, and
   because the Spanish-side resolution it would require is exactly what stage T is built to overwrite.
   Report the markers you saw and name that route.
2. The only permitted change is **new sections appended** for the bullets in `Pending additions`, placed
   where they read best without moving existing sections, plus their Spanish counterparts.
3. The new sections themselves are held to the full standard, and the run reports which existing content
   they assume so Victor can judge the seam.
4. Every stage must prove the freeze held over every file it touches or commits, with the pre-existing
   headings unchanged and in their original order. **The proof's form is the stage's own, and they are
   not identical**: A, B and T diff the one file each **writes** — never the several each may read —
   while Stage C — which commits both but
   is `en/`-blind — includes the full `git diff HEAD` of `{ES_FILE}` and proves `{FILE}` with
   `git diff --numstat HEAD`, whose removed count must be `0` (both against `HEAD`, because a diff
   against the index goes empty once the file is staged). Demanding a textual English diff there would
   hand the cold-Spanish reviewer the very file its isolation exists to withhold. A stage whose proof
   shows a removed or modified pre-existing line has failed — revert it and re-dispatch that stage once.
5. Stage C marks each successfully consumed `Coverage concepts` checkbox from `[ ]` to `[x]`, clears
   the same bullets from `Pending additions` (back to `none` when all are consumed), and leaves
   `Status: refined` as it is. It never writes `complete`. It also leaves `Studied` exactly as it found
   it and, on a dated entry, records each appended section under `Pending study` — see guard 15.

Stage flags for this mode: Stage A gets `REWRITE_MODE = append-only`, stages B and T get
`SCOPE = append-only` naming the appended sections, and Stage C reviews and commits only those sections.

## Runtime and model policy

Read `_agent-runtime-standard.md` before dispatch. Run the four stages sequentially, one cold context
per stage:

| Stage | Tier |
|---|---|
| English author | deep |
| English reviewer | deep |
| Translator | standard |
| Spanish reviewer | standard |

Never overlap stages. The Spanish reviewer owns the atomic commit.

## Stage A — English author

Dispatch `_notes-write-prompt.md` with:

- `TOPIC`, `LEVEL`, resolved English `FILE`;
- `TASK` containing the entry title, `Action`, exact coverage bullets, dependencies, and rationale;
- the complete pedagogical contract: narrative role, learning outcome, prerequisites, every
  must-answer question, and handoff;
- `REWRITE_MODE = first-pass` for `create`, `append-only` for a `refined` entry, otherwise `standard`.

It must author or audit only the selected English file, cover every assigned concept, avoid sibling
level scope, and report a section trace plus `N lines, read to EOF`.

If it cannot finish, stop without translation and leave the entry pending.

## Stage B — English reviewer

Dispatch `_notes-review-prompt.md` for the resolved English file. Give it the complete selected plan
entry, including the exact assigned coverage bullets and pedagogical contract, as acceptance
criteria, plus `SCOPE = append-only` with the appended section headings when the entry is `refined`.
It must fix the file, verify every bullet is substantively covered, verify that the
learning outcome and must-answer questions are achieved without undeclared prerequisites, enforce
the introduction invariant when applicable, reject unassigned higher-level expansion, and return a
section trace, pedagogical-contract trace, and EOF proof.

## Stage T — translator

Dispatch `_notes-translate-prompt.md` for the final English file and the resolved Spanish path, adding
`SCOPE = append-only` with the appended English headings when the entry is `refined` — it then appends
only their Spanish counterparts and re-syncs nothing else. In that mode its ordinary STOP on an
unresolved `es/` TODO marker does not apply: a refined pair is expected to carry markers this pipeline
deliberately leaves for the in-session route, and stopping on them would deadlock the append against a
resolution this run is forbidden to perform. It must preserve exact structural parity, produce natural Spanish, and return a section trace plus EOF
proof.

## Stage C — Spanish reviewer and commit

Dispatch `_notes-review-es-prompt.md` for the resolved paths, with:

- `PLAN`;
- `NOTE`;
- permission to mark every successfully incorporated assigned concept `[x]` and then change only this
  entry's `Status: pending` to `Status: complete` when no `[ ]` remains — or, in append-only mode, to
  mark only the consumed additions `[x]` and clear those same bullets from `Pending additions` while
  `Status: refined` stays;
- permission to set this entry's `Studied: pending` when an authoring or audit run changed prose,
  inserting the field for a legacy entry when absent; a no-op preserves its current value. **In
  append-only mode it never writes that field**: it preserves the existing value and, when that value is
  a date, appends one `Pending study` line per appended section — the **English** heading, which this
  prompt passes it as text in the dispatch below so an `en/`-blind stage never has to open the file to
  get it, and today's ISO date. Each line is added to whatever the field already holds, never rewriting
  an earlier entry, and the field is **inserted after `Studied`** when the entry does not carry it yet,
  exactly as `Studied` itself is inserted on a legacy entry — no plan in the repository has the field
  until its first append or its next reconciliation, so creating it is the normal path, not the edge
  case;
- the exact assigned concepts with checkbox metadata stripped, the unchecked concepts this run must
  incorporate, and the complete pedagogical contract;
- `SCOPE = append-only` when the entry is `refined`, carrying the appended **Spanish** headings as its
  review scope **and** their **English** counterparts as the text for the `Pending study` lines — two
  lists, labelled by language. Stage C is `en/`-blind by design, so the English headings reach it only
  as data in this dispatch and never by opening the file; handing it one unlabelled list is what would
  put a Spanish heading in a field `study-block-close` later has to match by exact line.

It reads Spanish independently, fixes quality, verifies that Spanish alone achieves the pedagogical
contract, verifies both files exist, changes only the selected status, then commits the English file,
Spanish file, and plan atomically. A structural pedagogical gap blocks completion and returns the
entry to the English stages. It must run `git status`
immediately before staging and committing and stage exact paths only.

Commit:

```text
docs(notes): complete {topic} {level} note {NOTE}
```

In append-only mode:

```text
docs(notes): extend refined {topic} {level} note {NOTE} with {N} coverage additions
```

## Trace gate

After every stage, compare its trace with the actual headings. For author and both reviewers, also
require the pedagogical-contract trace declared by their component prompt. Re-dispatch the same stage
once when a trace or EOF proof is incomplete. A second failure leaves the plan entry pending and
stops the run. Never mark a partially verified or merely bullet-complete file complete.

## Final report

Report branch, topic, level, note, resolved paths, action, assigned-concept count, fingerprint match,
dependency gate, pedagogical-contract gate, intro-contract gate when applicable, four stage results,
coverage confirmation, learning-outcome verdict, must-answer verdict, prerequisite verdict, handoff
verdict, concept checkbox transitions, status transition, studied-state transition, and commit. In append-only mode, also report the consumed bullets, the
appended headings in both languages, the additions-only diff proof for each file, any quality issue
observed in existing prose and deliberately left untouched, any TODO marker seen in the frozen prose
with the inline route named, the `Pending study` entries written or the reason none were, and the
remaining `Pending additions`.

After the content attempt and before the self-report, **invoke the `authoring-progress-recount` skill**,
passing the level this run audited. It owns the `## Authoring progress` rows of `PROGRESS.md` end to
end: it resolves the registered topics, recounts authored notes over every plan of the level, decides
the `*` and `—` guards, and commits `PROGRESS.md` itself. Do not reproduce its counting here and do not
edit those rows yourself — the tracker cell below and that table share one arithmetic, and a second copy
derived from this run's memory is exactly how they drift. Two things to pass it explicitly, because they
are this run's context and not the skill's: the level, and whether this run ended `blocked`, since a
blocked run changed no `Status` and its recount is an expected no-op. Fold its report row into the
report above, and do not re-stage `PROGRESS.md` here.

After the content attempt, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it in
full. Write `_internal/_last-run-report.md`; upsert the exact `TOPIC + LEVEL + NOTE` row in
`notes/prompts/_internal/_run-tracker.md` with both language paths, plan status, date, and an outcome
of `completed`, `completed — no-op` for a guard 13/14 entry that owed nothing, or `blocked`. This prompt
has no dry-run mode and never records one. Then recalculate the matching Notes J/M/S summary cell from the plan.
Commit report and tracker together. A failed content run remains `blocked` and never changes the plan
entry to complete.
