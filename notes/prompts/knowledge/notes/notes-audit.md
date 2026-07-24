# Notes Audit

Build or audit exactly one planned study-note file.

The persistent notes plan decides the file, its level, and the exact coverage concepts it owes. This
prompt never scans or completes a whole folder.

> **▶ Run first:** `notes-plan-prompt` for this exact topic and level — this prompt can process only
> an entry from a current, coverage-fingerprinted plan.

## Configuration

```text
TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
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

Read the active adapter, `_session-rules.md`, `_note-quality-standard.md`, `COVERAGE`, and `PLAN`.

Before dispatching any role:

1. Stop on `main`.
2. Require `NOTE` to be exactly two digits.
3. Require exactly one `## {NOTE} — ...` entry in `PLAN`.
4. Calculate SHA-256 over the exact UTF-8 bytes of `COVERAGE`. Stop with `run notes-plan-prompt`
   when it differs from `Coverage SHA-256` in `PLAN`.
5. Require `Plan status: current`.
6. Require the entry's English and Spanish paths to remain inside the selected topic and level.
7. Require every assigned bullet to exist verbatim in `COVERAGE`, exactly once in the complete plan,
   and in neither sibling-level coverage file.
8. Require the selected entry to contain non-empty `Narrative role`, `Learning outcome`,
   `Prerequisites`, `Must answer`, and `Handoff` fields. Require `Prerequisites` to contain only
   `none` or earlier entries and agree with the mechanical `Depends on` gate. Stop with
   `run notes-plan-prompt` when this pedagogical contract is absent or malformed.
9. For entry `00`, require its plan contract to cover every topic-introduction invariant from
   `_note-quality-standard.md`, regardless of Action.
10. Require every dependency entry to be `complete`.
11. For `middle`, require the junior progression gate to be closed. For `senior`, require junior and
   middle to be closed.
12. If the entry is already `complete`, verify both files exist and report a no-op.

Never accept an arbitrary file path or create a note absent from the current plan.

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
- `REWRITE_MODE = first-pass` for `create`, otherwise `standard`.

It must author or audit only the selected English file, cover every assigned concept, avoid sibling
level scope, and report a section trace plus `N lines, read to EOF`.

If it cannot finish, stop without translation and leave the entry pending.

## Stage B — English reviewer

Dispatch `_notes-review-prompt.md` for the resolved English file. Give it the complete selected plan
entry, including the exact assigned coverage bullets and pedagogical contract, as acceptance
criteria. It must fix the file, verify every bullet is substantively covered, verify that the
learning outcome and must-answer questions are achieved without undeclared prerequisites, enforce
the introduction invariant when applicable, reject unassigned higher-level expansion, and return a
section trace, pedagogical-contract trace, and EOF proof.

## Stage T — translator

Dispatch `_notes-translate-prompt.md` for the final English file and the resolved Spanish path. It
must preserve exact structural parity, produce natural Spanish, and return a section trace plus EOF
proof.

## Stage C — Spanish reviewer and commit

Dispatch `_notes-review-es-prompt.md` for the resolved paths, with:

- `PLAN`;
- `NOTE`;
- permission to change only this entry's `Status: pending` to `Status: complete`;
- the exact assigned concepts and complete pedagogical contract.

It reads Spanish independently, fixes quality, verifies that Spanish alone achieves the pedagogical
contract, verifies both files exist, changes only the selected status, then commits the English file,
Spanish file, and plan atomically. A structural pedagogical gap blocks completion and returns the
entry to the English stages. It must run `git status`
immediately before staging and committing and stage exact paths only.

Commit:

```text
docs(notes): complete {topic} {level} note {NOTE}
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
verdict, status transition, and commit.

After the content attempt, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it in
full. Write `_internal/_last-run-report.md`; upsert the exact `TOPIC + LEVEL + NOTE` row in
`notes/prompts/_internal/_run-tracker.md` with both language paths, plan status, date, and
`completed|blocked|dry-run`; then recalculate the matching Notes J/M/S summary cell from the plan.
Commit report and tracker together. A failed content run remains `blocked` and never changes the plan
entry to complete.
