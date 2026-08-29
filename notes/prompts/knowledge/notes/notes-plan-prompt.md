# Notes Plan Prompt

Create or reconcile the persistent pedagogical study-file plan for one topic and one professional level.
This prompt plans only. It never authors, reviews, translates, or commits study-note prose.
It does classify pre-existing bilingual notes across professional levels and relocates an intact
English/Spanish pair when the evidence makes the correct level unambiguous.

> **▶ Run first:** `coverage-prompt` for this exact topic and level — the coverage files are the input
> this plan maps, and it refuses to proceed when they are missing or differ from the global mirror.
> `coverage-verify` is recommended but **advisory**: it reports whether the coverage is complete for the
> job target. A consumed `superseded` verdict records a completed review cycle; a missing, stale, or
> open `gaps` verdict is recorded without stopping the run.

## Configuration

```text
TOPIC = [one registered topic from `../coverage/_internal/_topic-ownership.md`]
LEVEL = [junior | middle | senior]
MODE = [update | dry-run]
```

One execution handles exactly one topic and one level. `TOPIC = all` is unsupported.

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Use canonical roles and reasoning tiers from the runtime standard. Any delegated analysis is
read-only. If a required role cannot be dispatched, stop unless its instruction explicitly permits
a local fallback.

## Paths

Derive the topic slug by lowercasing and replacing spaces with hyphens.

- `COVERAGE = notes/{topic}/coverage/{LEVEL}.md`
- `VERIFY = notes/{topic}/coverage/verify-{LEVEL}.md`
- `PREREQUISITES = none for junior; junior for middle; junior and middle for senior`
- `PLAN = notes/{topic}/coverage/notes-plan-{LEVEL}.md`
- `EN_DIR = notes/{topic}/{LEVEL}/en/`
- `ES_DIR = notes/{topic}/{LEVEL}/es/`
- `GLOBAL_MIRROR = notes/coverage/{LEVEL}.md`

The plan is a committed source of truth. It is not a temporary worklist.

The topic's three level directories and three coverage files are all classification inputs. `LEVEL`
selects the plan being produced; it does not mean existing files in that directory are assumed to
belong there.

## Guards

1. Read the active adapter, `_session-rules.md`, `_note-quality-standard.md`, and all three topic
   coverage files.
2. Inventory every English and Spanish note in all three level directories. Read every English note
   end-to-end before classifying it; `en/` is canonical. Verify whether its Spanish counterpart exists
   and, when present, has matching substantive headings before relocating either file. A legacy note
   that exists only in English may still be renumbered inside the same level under Planning algorithm
   step 6; it may not be relocated across levels without its Spanish counterpart. Follow the
   repository's line-count and read-to-EOF rule.
3. Stop on `main`.
4. Execute the run-start decision table in `_pipeline-self-report.md` against this prompt's
   `_internal/_last-run-report-notes-plan.md` if it exists. Never restate the shared `Status:` meanings
   or apply a surfaced finding inside the run it would affect. This is
   the trigger that keeps an earlier run's finding from rotting — three of this prompt's ledger entries
   came out of `notes-plan` runs.
5. Stop if `COVERAGE` is missing or differs from the topic section in `GLOBAL_MIRROR`.
6. Read `VERIFY` but never stop on it, and never classify it into a stored status. Its verdict is
   history: an open `gaps` verdict, a `superseded` one, missing findings, or no `VERIFY` file at all
   all continue planning identically. Report the verdict you read in the final summary and move on.
   Zero gaps is never required before planning or authoring notes, and this prompt never requests
   another verification.
7. For `middle`, require the junior progression gate to be closed. For `senior`, require junior and
   middle to be closed. Planning later levels is blocked just like authoring them. The gate is defined
   in "Progression gate" in `_coverage-standard.md`; its observable evidence is the earlier level's
   `Notes` and `Interview` cells in `_internal/_run-tracker.md` reading complete over their plan
   denominators. State which evidence you read.
8. Preserve unrelated working-tree changes.

## Legacy note classification and relocation

Run this stage before building the selected-level entries. It exists because pre-plan notes may all
sit under `junior/` even when their actual content belongs to middle or senior.

1. Compare every substantive section of every existing English note with all three coverage files.
   Classify from the mechanism and responsibility being taught, not from the current folder, numeric
   prefix, title, project chronology, length, or words such as "production" in isolation.
2. Keep a note at its current level when its central learning unit belongs there. Extra examples or
   brief forward references to a later level do not promote the whole note.
3. Relocate a complete English/Spanish pair when all substantive sections form one coherent unit
   owned by a different level. Move both languages together; never relocate one side alone.
4. At the destination, allocate the next unused two-digit number for that level. Preserve the
   English and Spanish slugs, preserve all prose byte-for-byte apart from link/path corrections, and
   keep the same new numeric prefix on both files.
5. Update repository-relative Markdown links that target or originate from a relocated file. Verify
   every changed local link resolves after the move.
6. If a current or destination plan already references a relocated path, reconcile that entry's two
   paths. Do not mark it complete unless its exact coverage set and both relocated files still meet
   the normal preservation rule.
7. Do not force a move when one file contains substantive sections owned by multiple levels. Record
   it under `## Legacy notes requiring split`, with a heading-level routing map and the reason a
   byte-preserving move is impossible, then stop the run as `blocked`. Splitting or rewriting prose
   belongs to the notes author/reviewer pipeline, not this planner.
8. Do not leave an intact, unambiguously mis-levelled pair under `## Unassigned existing notes`.
   `Unassigned` is only for material not owned by any coverage bullet at any level, duplicates, or a
   blocked mixed-level file already listed in the split section.

Before planning continues, report the classification decision for every pre-existing pair or
English-only note as `keep`, `move <current level> -> <correct level>`, `renumber NN -> MM`
(`English-only` when applicable), `unassigned`, or `requires split`.

## Coverage fingerprint

Calculate the lowercase SHA-256 digest of `COVERAGE`'s **scope bytes** using the canonical command in
"Evidence markers" in `_coverage-standard.md`, which alone defines the byte normalisation and marker
stripping. Never reproduce or approximate that definition locally. Markers record where a concept was
demonstrated or drilled, not what the scope is, so a closed step must never look like a stale plan.

The plan stores it as:

```text
Coverage SHA-256: <64 lowercase hexadecimal characters>
```

`notes-audit` and `validate-prompt-system.ps1` each recalculate this value independently. A mismatch
means the plan is stale.

## Planning algorithm

1. Read every coverage bullet and preserve its exact text.
2. Inspect the now-classified note filenames and headings in `EN_DIR` and `ES_DIR`. Do not
   quality-audit prose.
3. Build a gradual zero-assumption study sequence. Group concepts only when they form one coherent
   learning unit and can be taught to one clear learning outcome. There is no target or maximum
   number of files.
4. Assign every selected-level coverage bullet to exactly one entry. Never paraphrase a coverage
   bullet in the assignment list.
5. Do not assign bullets from either sibling level.
6. Prefer an existing English file when its topic matches the group. At `LEVEL = junior`, reserve
   `00` for the required topic introduction and allocate subsequent files from the next unused
   two-digit number. Middle and senior continue their level-specific sequence from `01`; they build
   on a consolidated earlier level rather than reintroducing the whole topic. When the correct route
   needs a chapter between two existing ones — including when one existing file carries more than one
   teachable mental model and must become two — renumbering existing notes inside the same level is
   permitted so that filename order and study order stay identical. When both languages exist, the
   renumbering moves the English and Spanish files together. When a legacy note exists only in English,
   Victor's standing authorization permits renumbering that English file alone; the plan assigns the
   same new prefix to the missing Spanish path so `notes-audit` creates it later. Never create a fake
   Spanish copy or translate prose in this planner. Either form never crosses a level boundary,
   preserves every existing slug and all prose byte-for-byte apart from link corrections, updates
   every repository-relative link that targets the renumbered file, and is reported as
   `renumber NN -> MM` (add `English-only` when applicable). **Filename order matching study order is a
   standing requirement, not an optional tidy-up** (Victor, 2026-08-21): a route whose numbers no longer
   match is a defect this planner must repair, and the size of the link surface is never a reason to
   decline. That link surface is explicitly repository-wide, not topic-local — the inbound links of a
   legacy Java note reach the Spanish notes, the Spring Boot notes, `_note-quality-standard.md`, prompt
   internals, both skill mirrors and `_run-tracker.md` — and correcting **every one of them** is part of
   the renumber, including inside prompt-system machinery, which this clause authorises. Only the link
   target changes in those files; nothing else in them may be touched. A file listed under `## Unassigned existing
   notes` does not reserve its numeric prefix: when a required renumber target collides with one,
   renumber the unassigned file to the next free prefix above the route's last entry, leave it listed as
   unassigned with no plan entry and no Spanish path assigned, and report it as
   `renumber NN -> MM (unassigned)`, adding `English-only` exactly as a normal renumber does.
   A renumbered existing English note keeps `Action: audit`. Dividing one file's prose remains the notes
   author/reviewer pipeline's work, not this planner's: the plan declares both entries and their
   paths, and the new file's entry is `Action: create`. This is a same-level route repair and never
   populates `## Legacy notes requiring split`, which stays reserved for pairs whose sections are
   owned by different levels.
7. An entry is:
   - `audit` when its English file already exists;
   - `create` when it does not.
8. Every new or existing entry begins `pending`, except an old `complete` entry may remain complete
   only when its English path, Spanish path, exact assigned bullet set, and complete pedagogical
   contract are unchanged and both files still exist. A newly added or materially changed learning
   outcome, prerequisite, must-answer question, handoff, or introduction contract reopens the entry
   to `pending`; prose previously accepted against a weaker plan has not passed the new contract.
   `refined` is the exception to this entire rule. It is Victor's manual freeze, set only by him, and it
   outranks every reconciliation rule here. This plan never sets it, never clears it, and never
   downgrades it to `pending` or `complete` for any reason — not a changed contract, not a changed
   bullet set, not a renumber, not a `Plan status: stale` rebuild. When a `refined` entry gains coverage
   bullets or a materially changed contract, keep `Status: refined`, leave the existing prose out of
   scope, and list only the newly owed bullets verbatim under that entry's `Pending additions:` field,
   appending to what is already there and never rewriting or dropping an unconsumed one. Reconciliation
   reports these as `refined + N additions`, never as reopened entries. A `refined` entry whose English
   or Spanish file is missing is reported as a broken freeze and left untouched for Victor to resolve.
   `Studied` is a separate state: write `Studied: pending` on a new entry and treat a missing legacy
   field as pending. Preserve a date only while the accepted bilingual pair and its pedagogical
   contract remain materially unchanged. Reset it to `pending` when an entry is reopened, loses
   either language, or its prose contract changes. **Gaining a `Pending addition` is not one of those**
   (changed 2026-08-22): an owed bullet means prose does not exist yet, so it cannot unstudy prose that
   does — the date survives, and the gap is recorded only when the append-only run actually lands the
   section, as a `Pending study` entry. A byte-preserving
   same-level renumber or relocation preserves the date. This prompt never writes a date.
   `Pending study` is study state, so this prompt never authors one either: preserve every existing
   entry verbatim across reconciliation, and drop one only in the two cases that make it meaningless —
   the English heading it names no longer exists in the note, or `Studied` was just reset to `pending`,
   which owes the whole file again and leaves a per-section list describing nothing. **Every path that
   resets `Studied` writes `Pending study: none` in the same edit**; a reset that leaves the list behind
   strands lines `study-block-close` may not clear, since it only ever clears what Victor studied.
   Migrating a legacy entry writes `Pending study: none`.
   Every pre-existing `[x]` bullet under that entry's `Coverage concepts` is also a coverage lock. Compare
   scope text with every trailing marker stripped, of either kind: if coverage moved, reworded, deleted, split,
   merged, routed, or reordered one, stop and report a broken coverage lock. Never reconcile the
   refined entry to the changed coverage and never treat the replacement as a `Pending addition`.
   Coverage-concept state is granular: preserve every existing `[x]`; add newly assigned concepts as
   `[ ]`; and never mark one `[x]` merely because it was planned. For legacy plans without concept
   checkboxes, migrate bullets under `complete` to `[x]`; under `refined`, migrate every bullet not
   listed in `Pending additions` to `[x]` and each pending addition to `[ ]`; under `pending`, migrate
   every bullet to `[ ]`. This is a metadata-only plan migration and never edits note prose.
9. Existing notes that cannot be justified by this level's coverage go under `## Unassigned existing
   notes`. They are never silently deleted or treated as required study files.
10. On reconciliation, report added, removed, regrouped, preserved-complete, and unassigned entries.
11. A note relocated into the selected level participates like any other existing note and therefore
    receives `Action: audit`. A note relocated out cannot remain assigned by the selected plan.
12. Give every entry the complete pedagogical contract from `_note-quality-standard.md`: narrative
    role, observable learning outcome, prerequisites, must-answer questions, and handoff. Coverage
    bullets define required scope, not the maximum explanation needed to teach it.
13. At `LEVEL = junior`, treat the topic introduction as a required learning unit. An existing `00`
    file receives the same full introduction contract under `Action: audit`; never assume that an
    existing first file already introduces the topic. If no `00` exists, allocate `00` for the
    introduction before normal numbering begins at `01`. Its orientation may go beyond literal
    coverage-bullet wording without importing concepts from another professional level.
14. Validate the complete route: no entry may rely on an unlisted or later prerequisite; every
    chapter must pick up a reason created by earlier chapters and hand off to a real later entry (or,
    for the final entry, close the selected-level journey).

## Cold pedagogical review

After drafting or reconciling the complete plan, dispatch **one cold reviewer**, `reasoning tier: deep`,
`execution: foreground`. Give it only the selected coverage, `_note-quality-standard.md`, existing note
headings, the proposed plan, and this prompt's **"Required plan format"** section. That last input is
not background: it is the contract the reviewer's own prerequisite-order verdict is measured against.
`Prerequisites` there accepts `none` or earlier entry numbers only, so a reviewer that cannot see the
restriction proposes the cross-topic dependencies the field cannot carry — which cost a round trip on
the 2026-08-27 run, the second consecutive run to lose one to a rule the reviewer could not see. It is
handed as a **field contract, never as a conformance checklist**: field presence and field shape are the
orchestrator's check and the validator's, not the reviewer's.

The plan's freshness header is out of the reviewer's scope, `Coverage SHA-256` above all. Its byte
normalisation lives in `_coverage-standard.md`, which this reviewer is not given, and both `notes-audit`
and `validate-prompt-system.ps1` recalculate the value independently — so a digest finding here is a
value the reviewer could not compute, judged against a definition it could not read. It reports nothing
about that line.

It does not edit files. It must challenge:

- for junior, whether `00` fulfils the complete topic-introduction contract;
- whether every learning outcome is achievable from the declared prerequisites;
- concepts or terms used before they are taught;
- chapters grouped around a label rather than one teachable mental model;
- missing must-answer questions that would leave the assigned concepts recognisable but unexplained;
- broken narrative handoffs, oversized chapters, and disconnected files;
- whether the route can teach the topic from zero as Victor's only study source.

Acceptance proof must include `N entries reviewed`, an explicit intro verdict, a prerequisite-order
verdict, and every proposed correction. Re-dispatch once if that proof is absent. Apply accepted
findings, then repeat exact coverage assignment and route validation. If the reviewer cannot be
dispatched or fails twice, stop; there is no single-agent fallback.

## Required plan format

```markdown
# Java Junior Notes Plan

Plan status: current
Coverage: notes/java/coverage/junior.md
Coverage SHA-256: <digest>
Generated: YYYY-MM-DD

## 01 — Variables and types

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/java/junior/en/01-variables-types.md
Spanish: notes/java/junior/es/01-variables-tipos.md

Depends on: none

Pending additions: none

Narrative role: concise explanation of why this chapter exists at this point in the journey.

Learning outcome: one observable sentence stating what Victor can understand, explain, or apply.

Prerequisites: none or earlier entry numbers only.

Must answer:

- concrete learner question the finished note must resolve
- concrete learner question the finished note must resolve

Coverage concepts:

- [ ] exact coverage bullet
- [x] exact coverage bullet

Rationale: one concise explanation of why these concepts belong together.

Handoff: what this chapter unlocks and why the next chapter follows, or how the final chapter closes
the selected-level journey.

## Unassigned existing notes

- path — concise reason it is not owned by this level plan

## Legacy notes requiring split

- English: path
  Spanish: path
  Routing:
  - `## Exact heading` → middle — exact matching coverage bullet or concise ownership reason
  - `## Exact heading` → senior — exact matching coverage bullet or concise ownership reason
  Blocker: concise explanation of why the pair cannot be moved intact
```

Rules:

- Entry headings are unique and ordered numerically.
- `Status` is exactly `pending`, `complete`, or `refined`.
- `Studied` is exactly `pending` or an ISO date (`YYYY-MM-DD`). A legacy entry with no field is read
  as pending and gains the field on its next reconciliation. A date is valid only on `complete` or
  `refined`; authoring never sets it.
- `Pending study` is `none` or a list of sections of this note that landed **after** the date in
  `Studied` and therefore still owe an active study pass — one line per section, the heading quoted
  verbatim and the ISO date it was added:
  `- "## 5 — Version conflicts under load" (added 2026-08-22)`. It exists so a single appended section
  does not unstudy a whole note Victor already studied: the entry keeps its date and owes only what is
  listed. It is meaningful **only while `Studied` holds a date** — on a `pending` `Studied` it is always
  `none`, because nothing in the note is studied yet and the whole file is already owed. Written by
  `notes-audit` Stage C in append-only mode and by `study-content-writer`; cleared by `study-block-close`
  alone, which is also the only writer of the date.
- `Action` is exactly `create` or `audit`.
- `Pending additions` is `none` or a list of coverage bullets quoted verbatim from `COVERAGE`. It is
  meaningful only on a `refined` entry; on `pending` and `complete` entries it is always `none`, because
  their whole bullet set is already in scope.
- Every `Coverage concepts` line is exactly `- [ ] {exact coverage bullet}` or
  `- [x] {exact coverage bullet}`. The checkbox is plan metadata and is stripped before exact matching
  against `COVERAGE`; trailing coverage evidence markers are handled by the normal scope-byte rule.
- `[ ]` means the concept is assigned but has not yet been incorporated by a successful notes pipeline
  run. `[x]` means the English and Spanish note pair contains it and Stage C committed that fact.
- A `pending` entry may contain `[x]` concepts preserved from an earlier successful run when a changed
  contract or newly assigned coverage reopened it; those checks are permanent history. Notes-audit
  owes every unchecked concept, may review the whole non-refined note against its current contract,
  and never clears an existing `[x]`.
- `Status: complete` requires every assigned concept to be `[x]`. `Status: refined` may contain `[ ]`
  only when those exact bullets also appear in `Pending additions`.
- Paths are repository-relative and remain inside the selected topic and level.
- **The header block is written spaced, in seven field groups**, exactly as the template shows: `Status`,
  then `Studied`, then `Pending study`, then `Action`, then `English` with `Spanish`, then `Depends on`,
  then `Pending additions` — one blank line between groups, none inside a group. `English` with `Spanish`
  is the only pair that shares a group; `Studied` and `Pending study` were split apart on 2026-08-27
  because a study date and the sections that date does not cover are read one at a time, not as a block.
  The grouping is the reading aid that makes a long plan scannable, so it is a format requirement, not a
  preference: never collapse an entry's header into a compact block, and never remove a blank line that
  already separates two groups. A run that rewrites an entry for any other reason writes that entry's header spaced;
  entries the run does not touch are left alone, so an older compact plan converges one audited entry at
  a time rather than in one sweeping reformat.
- **The entry number is the file number.** Entry `NN` carries `English:` and `Spanish:` paths whose
  basenames both begin `NN-`, in every entry of every plan, including an entry whose `Action` is
  `create` and whose file does not exist yet — that prefix is reserved for it. A plan may never publish a
  correspondence table, a remap note, or a sentence telling the reader that the numbering is not the
  reading order: those are the artefacts of the defect, not a way to live with it. When the inventory
  finds numbers that diverge, the renumber of Planning algorithm step 6 runs in the same session and
  the plan is written against the new names.
- `Depends on` contains `none` or earlier entry numbers only.
- `Prerequisites` contains `none` or earlier entry numbers only and agrees with `Depends on`;
  `Depends on` remains the mechanical execution gate while `Prerequisites` states the learning
  assumptions.
- `Narrative role`, `Learning outcome`, `Must answer`, and `Handoff` are non-empty and specific.
- Every `Must answer` item is a learner question, not a restatement of a coverage bullet.
- At junior, entry `00` satisfies the complete introduction contract for both `create` and `audit`.
- A missing Spanish file does not change `Action`; the notes pipeline creates or synchronises it.
- No coverage bullet may be absent, duplicated, paraphrased, or assigned across levels.
- Omit `## Legacy notes requiring split` when empty. If it is non-empty, the run is blocked and no
  relocation or selected plan commit occurs; the proposed plan and routing map are still reported.

## The `refined` freeze

`complete` means the pipeline finished the entry. `refined` means Victor has since taken the pair to his
own bar with TODOs and considers the prose final. The two are not the same guarantee, and only the
second one is protected from the pipeline.

Victor sets `Status: refined` in `PLAN` — by hand, or by declaring in the session that he has refined
the pair, which is the same authority typed instead of edited (2026-08-22). No prompt ever assigns it on
its own initiative. His declaration names the language he refined, and that file is final from that
moment: the run that acts on it changes **nothing** in it and brings only the counterpart into line —
same content, same message, same structure, native prose in its own language — commits both files, and
only then writes `Status: refined`. The direction is whatever he declares; a note refined in `es/` syncs
`es/` → `en/`, and the canonical-`en/` default does not override it. Before accepting the freeze, every
current concept should be `[x]` and `Pending additions` should be `none`; if either fails, sync the
counterpart, report it, and leave `Status` where it is. From the freeze the pair's existing prose is
immutable to the whole notes pipeline in both languages.

**What the freeze protects against is the pipeline's own initiative** — a prompt rewording, restructuring
or "improving" prose Victor already approved. It was never meant to stop *Victor* from correcting his own
note. So a `refined` entry admits exactly **two** mutations, and nothing else:

1. **Appending** material for a coverage bullet listed under `Pending additions:` — new sections added to
   `en/`, their Spanish counterparts appended to `es/`, every pre-existing byte in both files untouched.
   `notes-audit` runs that append in its append-only mode and clears the consumed bullets.
2. **Resolving a correction Victor asked for** — a TODO he wrote in the pair, or one he states directly
   in the session, which is the same instruction without the marker and is admitted on the condition that
   the resolving run **quotes it**, since a chat request leaves no artefact in the file and the quote is
   the only thing that later distinguishes his correction from the agent's proposal (added 2026-08-22).
   A TODO is Victor correcting his own
   note through the agent, under the same authority that set `refined` in the first place, so the entry
   does not have to be unfrozen to accept it — the round trip through `pending` and back cost him the
   study state of the note for a corrected sentence. This is how the system already works one folder
   over: `_interview-prep-standard.md` reopens a frozen question *"by adding a TODO to that question"*.
   Notes differ in what survives, and deliberately: the interview question drops both `[refined]` and
   `[studied]`, while the note keeps `Status: refined` **and** its `Studied` date, because a question is
   one atomic block that a correction replaces whole, and a note is many sections of which a TODO touches
   one.

   **The bound is the marked passage** — the paragraph, list, table, callout or code block the marker
   sits in, plus its heading when the TODO asks for that. Every other byte of both files stays as
   immutable as before. The direction rule applies unchanged: a marker in `es/` is resolved in `es/`, in
   Spanish, and `en/` is then brought into line. Three things are past this licence and are reported
   rather than done: **rewriting a whole section**, even when the TODO names one — that is the thing the
   freeze exists to prevent, and it would carry a study date across prose Victor never studied;
   **restructuring the note**; and **appending a new section**, which reaches a frozen pair through
   mutation 1 only, with its bullet, its cold stages and its diff proof. **Only `study-content-writer`,
   in the daily session, runs this route** — the four cold stages of `notes-audit` stay out of it and
   keep reporting the markers they see, because a corrected sentence is the wrong thing to spend a
   pipeline on. That route has no cold reviewer and no diff gate, so it owes a report instead: the
   instruction quoted, the passage named in both languages, and the statement that nothing else moved.

A quality miss the *agent* notices in frozen prose is still reported and never fixed, on either route.
That, and not the file being untouchable, is what the freeze has always been for.

The same freeze protects the incorporated coverage scope: every `[x]` `Coverage concepts` bullet stays
in the same coverage topic, level, section, and relative locked-bullet order with identical scope text.
A trailing project evidence marker may still be added because it is metadata, not curriculum scope.
An unchecked concept in `Pending additions` is not locked yet and may be remapped until the append-only
pipeline marks it `[x]`. An entry merely present in the plan but still `pending` or `complete` creates
no coverage lock and may be remapped normally.

To hand a refined file back to the normal pipeline, Victor sets its status back to `pending` himself.

## Update mode

Write `PLAN` plus any unambiguous bilingual relocations, permitted same-level bilingual or English-only
renumberings, required local-link corrections, and path reconciliations in already-existing affected
sibling plans. Do not alter note prose. Write `Plan status: current` in the header — this run is the
only thing that clears a `stale` header set by `coverage-prompt`, and the plan it just rebuilt maps
today's coverage by construction. Before staging
and before committing, run `git status --short`; stage only these declared outputs and verify every
moved pair and affected link. Commit:

```text
docs(notes): plan {topic} {level} study files
```

Dry run prints the complete proposed plan and reconciliation summary without writing or committing.

After the plan commit, execute `_pipeline-self-report.md`: write
`_internal/_last-run-report-notes-plan.md`, update the selected `Plan J/M/S` tracker cell — rewriting it
whole, so any ` · ⚠ stale` flag it carried disappears with the debt this run just paid — correct the
`## Notes file executions` rows of every pair this run relocated or renumbered, since they are keyed by
`TOPIC + LEVEL + NOTE` and would otherwise name files that no longer exist, recalculate
the matching Notes J/M/S summary as `complete entries / total entries` — a `refined` entry counts as
complete unless it carries unconsumed `Pending additions` — and commit the report and
tracker together. Dry run does not write `PLAN`, but it still writes and commits its self-report plus
a `dry-run` tracker outcome without replacing the persisted denominator.

## Final report

Report topic, level, coverage fingerprint, the `VERIFY` verdict as read (never prescribe repeated
verification until zero gaps), entry count,
concept count, create/audit counts,
checked/unchecked concept counts, preserved-complete count, studied/pending entry counts, every `refined` entry with the count of `Pending additions` it now carries, and every entry carrying an open `Pending study` with the sections it still owes — plus any gap line this reconciliation dropped and the reason, since dropping one is the only way study state is ever lost here
(and any broken freeze), every legacy classification decision, relocations, renumberings, split
blockers,
unassigned existing notes, mirror parity, pedagogical-review completion, intro-contract verdict,
learning-outcome count, prerequisite-order verdict, handoff count, concepts-used-before-taught
verdict, and commit or `dry-run`.
