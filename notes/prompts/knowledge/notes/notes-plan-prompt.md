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
4. Stop if `COVERAGE` is missing or differs from the topic section in `GLOBAL_MIRROR`.
5. Read `VERIFY` but never stop on it. Record one of three states:
   - `verified` — `Verdict = complete`, its stored `Coverage SHA-256` matches the current `COVERAGE`,
     and every applicable prerequisite SHA matches the current earlier-level scope bytes;
   - `reviewed` — `Verdict = superseded`, no open gaps, `Superseded by Coverage SHA-256` matches current
     `COVERAGE`, and every applicable `Superseded {level} prerequisite SHA-256` matches the current earlier-level
     scope bytes, proving that a `coverage-prompt → coverage-verify → coverage-prompt` cycle consumed
     the findings into this exact dependency chain;
   - `unverified` — missing findings, an open `gaps` verdict, or any other stale SHA.
   Missing legacy prerequisite fields on a middle or senior verdict make it `unverified`; run the
   cumulative `coverage-verify` when a current chain verdict matters. All three states continue
   planning. `reviewed` is a completed cycle, not a degraded gate and not a
   reason to request another verification. When `unverified`, record the reason without blocking.
   Victor may start a fresh reassessment later, but zero gaps is never required before planning or
   authoring notes.
6. For `middle`, require the junior progression gate to be closed. For `senior`, require junior and
   middle to be closed. Planning later levels is blocked just like authoring them.
7. Preserve unrelated working-tree changes.

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

Calculate the lowercase SHA-256 digest of `COVERAGE`'s **scope bytes** — its exact UTF-8 bytes with every
trailing ` ✅ NN-slug — {evidence}` evidence marker stripped, using the canonical command in "Evidence markers" in
`_coverage-standard.md`. Markers record where a concept was demonstrated, not what the scope is, so a
closed step must never look like a stale plan.

The plan stores it as:

```text
Coverage SHA-256: <64 lowercase hexadecimal characters>
```

`notes-audit` independently recalculates this value. A mismatch means the plan is stale.

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
   `renumber NN -> MM` (add `English-only` when applicable). A renumbered existing English note keeps
   `Action: audit`. Dividing one file's prose remains the notes
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

After drafting or reconciling the complete plan, dispatch one cold reviewer. Give it only the selected
coverage, `_note-quality-standard.md`, existing note headings, and the proposed plan. It does not edit
files. It must challenge:

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
# Angular Junior Notes Plan

Plan status: current
Coverage: notes/angular/coverage/junior.md
Coverage SHA-256: <digest>
Coverage verification: verified | reviewed | unverified — <complete current SHA | gaps consumed and superseded | missing/open/stale findings>
Generated: YYYY-MM-DD

## 01 — Components and templates

Status: pending
Action: audit
English: notes/angular/junior/en/01-components.md
Spanish: notes/angular/junior/es/01-componentes.md
Depends on: none
Pending additions: none

Narrative role: concise explanation of why this chapter exists at this point in the journey.

Learning outcome: one observable sentence stating what Victor can understand, explain, or apply.

Prerequisites: none or earlier entry numbers only.

Must answer:

- concrete learner question the finished note must resolve
- concrete learner question the finished note must resolve

Coverage concepts:

- exact coverage bullet
- exact coverage bullet

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
- `Action` is exactly `create` or `audit`.
- `Pending additions` is `none` or a list of coverage bullets quoted verbatim from `COVERAGE`. It is
  meaningful only on a `refined` entry; on `pending` and `complete` entries it is always `none`, because
  their whole bullet set is already in scope.
- Paths are repository-relative and remain inside the selected topic and level.
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

Victor sets `Status: refined` by hand in `PLAN`; no prompt ever assigns it. From that moment the pair's
existing prose is immutable to the whole notes pipeline in both languages. The only mutation any prompt
may still perform on a `refined` entry is **appending** material for a coverage bullet listed under
`Pending additions:` — new sections added to `en/`, their Spanish counterparts appended to `es/`, every
pre-existing byte in both files untouched. `notes-audit` runs that append in its append-only mode and
clears the consumed bullets; nothing else about the files may change.

To hand a refined file back to the normal pipeline, Victor sets its status back to `pending` himself.

## Update mode

Write `PLAN` plus any unambiguous bilingual relocations, permitted same-level bilingual or English-only
renumberings, required local-link corrections, and path reconciliations in already-existing affected
sibling plans. Do not alter note prose. Before staging
and before committing, run `git status --short`; stage only these declared outputs and verify every
moved pair and affected link. Commit:

```text
docs(notes): plan {topic} {level} study files
```

Dry run prints the complete proposed plan and reconciliation summary without writing or committing.

After the plan commit, execute `_pipeline-self-report.md`: write
`_internal/_last-run-report-notes-plan.md`, update the selected `Plan J/M/S` tracker cell, recalculate
the matching Notes J/M/S summary as `complete entries / total entries` — a `refined` entry counts as
complete unless it carries unconsumed `Pending additions` — and commit the report and
tracker together. Dry run does not write `PLAN`, but it still writes and commits its self-report plus
a `dry-run` tracker outcome without replacing the persisted denominator.

## Final report

Report topic, level, coverage fingerprint, the coverage-verification state (`verified`, `reviewed`, or
`unverified`, with the reason; never prescribe repeated verification until zero gaps), entry count,
concept count, create/audit counts,
preserved-complete count, every `refined` entry with the count of `Pending additions` it now carries
(and any broken freeze), every legacy classification decision, relocations, renumberings, split
blockers,
unassigned existing notes, mirror parity, pedagogical-review completion, intro-contract verdict,
learning-outcome count, prerequisite-order verdict, handoff count, concepts-used-before-taught
verdict, and commit or `dry-run`.
