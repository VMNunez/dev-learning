# Interview-prep project route — build the study order over the project question banks

Create or reconcile the one cross-project interview study route. This prompt selects; it never authors,
refines, studies, translates, or duplicates an answer.

> **Runtime contract:** Before dispatching a role, read
> `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles and reasoning
> tiers through the active platform adapter.

> **▶ Run first:** `portfolio-audit PROJECT_PATH = projects/«name» PORTFOLIO_SCOPE = full` on every
> project this route is meant to carry. That gate is what writes a bank, its `es/` twin, its
> `{PROJECT_NAME}-{NNN}` IDs and its `⭐⭐⭐`/`⭐⭐`/`⭐` markers, and what produces the `✅ Ready` verdict
> eligibility below reads.** A bank may contain unrefined questions; the route selects them, but
> `interview-prep-block-open` will not present one until Victor marks it `[refined]`.

**Why this is its own prompt and not a mode of `interview-prep-route-prompt.md`** (`REC-180`, 2026-09-06):
that prompt's `▶ Run first` mandates `interview-prep-audit` and its guard 4 requires a `Coverage SHA-256`
on every bank it reads. A project bank has neither and never will — it is written by `portfolio-audit`
from a project's own code and carries no coverage fingerprint by design. Those are prohibitions this
route **violates**, not ones it substitutes, and one file cannot carry a prohibition it breaks depending
on which invocation is reading it. Both prompts also own one `_last-run-report-<prompt-name>.md` and one
`_run-tracker.md` row apiece, which two branches of a single prompt would overwrite in turn.

## Configuration

```text
MODE = [update | dry-run]
```

One run builds the whole route. There is no per-project mode: which projects are represented is
**measured** from eligibility below, never configured.

## Inputs and output

Read:

- `notes/prompts/_internal/_shared-context.md` for role, stack and company weighting — it is the source
  for those facts;
- `notes/prompts/projects/portfolio/_internal/_portfolio-standard.md` for the question format, the
  `{PROJECT_NAME}-{NNN}` identity, the `[refined]` freeze and **"Priority markers"** — that file governs
  this bank, and `_interview-prep-standard.md` explicitly does not;
- each candidate project's `{PROJECT_PATH}/PLANNING.md` §23 — the G7 box is where the verdict lives, so
  it is eligibility's **owner** — and `notes/prompts/_internal/_run-tracker.md` →
  `## Per-project prompts`, its Angular-only fallback;
- every eligible project's `notes/interview-prep/projects/en/«name».md` and its `es/` twin;
- the **existing** `notes/interview-prep/routes/projects.md`, where one is already on disk — guard 5 owes
  a list of the `[studied]` questions this run drops, and a **downgrade** is only visible against the
  route the previous run built. A first run has none, and owes no such list.

Write only `notes/interview-prep/routes/projects.md`.

## Eligibility — the `✅ Ready` verdict, read where that verdict actually lives

Victor's ruling is that this route carries the `⭐⭐⭐` questions of projects whose portfolio gate closed
**`✅ Ready`**. Reading that verdict is the whole of eligibility here; whether the *bank* is fit to route
over is guards 3–4's work, measured on the bank itself and never inferred from a verdict.

**Where the verdict lives, in order.** `_run-tracker.md` → `## Per-project prompts` states it against
itself: *"the verdict itself lives in the project's own `PLANNING.md` §23 G7 box"*, because that column is
an execution record whose last run **overwrites** the previous one — and since `REC-189` a
`PORTFOLIO_SCOPE = backend | frontend | global` run computes no verdict at all, so one such run erases a
`✅ Ready` from the cell without the project having changed.

1. **`{PROJECT_PATH}/PLANNING.md` §23, the G7 box** — the owner. A ticked G7 is the verdict.
2. **Angular-only projects (01-06) have no §23 at all** — `_portfolio-standard.md` says so where it
   fences the unreviewed-code gate — so for those the `portfolio-audit` cell in `_run-tracker.md` is the
   only record there is, and it is read with the branch that column's own paragraph forces: a cell
   recording a **bank-only** run (`(backend only ...)`, `(frontend only ...)`, `(global only ...)`)
   records no verdict. Report that project as *pending a `full` run*, name the run owed, and never read
   the absence as a ❌.

A project with no `portfolio-audit` cell and no ticked G7 is not eligible and is not an error — it is a
project this gate has never run on. Name it and continue.

**If no project is eligible, stop.** Name every project, why its verdict could not be read as `✅ Ready`,
and which `portfolio-audit` run would settle it. A route with no source is not built empty.

## Guards

1. Stop on `main`; record the blocked run through `_pipeline-self-report.md`.
2. Run the shared run-start check owned by `notes/prompts/_internal/_pipeline-self-report.md` against
   `_internal/_last-run-report-interview-prep-route-projects.md`. **This prompt runs the pipeline
   contract, not the single-shot one**, for the reason its sibling does: it dispatches a cold reviewer
   and refuses its own commit without one, and only that contract's close-out check counts a mandated
   dispatch against the count actually made — the half no file can prove.
3. Count lines and read every eligible project's EN bank to EOF. Read each ES twin structurally and
   require identical questions, IDs, priorities and state markers.
4. Stop on a missing twin, a missing or malformed `{PROJECT_NAME}-{NNN}` ID, a duplicate ID, or EN/ES
   parity failure. Name every failing project; never build a plausible route over a partial denominator.
   **An unmarked question is not one of those states and never stops this run.** `_portfolio-standard.md`
   → "Priority markers" designs for it twice — a bank written before that rule carries no marker and is
   *declared debt*, and an unmarked **frozen** question can be marked by nobody, which is permanent — so a
   stop here would make the route unbuildable for exactly the banks that rule was written for. An
   unmarked question is simply not a `⭐⭐⭐` candidate: exclude it, count it, and list the frozen ones by
   ID as Victor's to mark, the same disposition every other consumer of this bank already gives them.
5. **`[studied]` is a valid state in this bank since 2026-09-06**, written by `study-block-close` alone
   after a recall pass, and it is inert for selection: this route selects on `⭐⭐⭐`, never on state, and
   you neither write nor remove one. **What it does change is what you report.** A question you drop
   from the route — deduplicated, or downgraded out of `⭐⭐⭐` — that carries `[studied]` leaves the
   study denominator it was counted in, so name every such ID: `_portfolio-standard.md` keeps its marker
   deliberately (the block is frozen, and the pass really happened) and `study-block-close` reports it
   thereafter, but only this run knows the moment it fell off.
6. Preserve unrelated working-tree changes.

## Inventory fingerprint

The digest algorithm is `interview-prep-route-prompt.md` → **"Inventory fingerprint"**, applied to this
route's own sources — project by project, **ascending by project folder name**, then file order within
each bank. Two clauses that algorithm cannot supply, because its own source has neither: the order across
files (a level route reads one bank per topic in a stated order; this one needs its projects fixed, and
ascending folder name is the only ordering here that cannot drift), and the **unit** — hash the
**question** lines, those matching `**[{PROJECT_NAME}-NNN] ...**`, never every bold line, since this
bank's header carries a bold `**Last banked:**` stamp that the levelled banks do not and that moves on
every `portfolio-audit` run. It is otherwise **not restated here**: two readings of one algorithm is the drift worth a pointer, and a fork between the
two routes' digests would be invisible until one of them silently stopped detecting a change.

Store it as:

```text
Question inventory SHA-256: <64 lowercase hexadecimal characters>
```

What stales this route is whatever that algorithm hashes, and nothing here changes it: adding, removing,
rewording, **reprioritising** or reordering a question stales the route; refining one does not. The
priority marker being inside the digest is not peculiar to this bank — the sibling keeps it there for the
same reason — and it matters here only because a downgrade is how a question **leaves** this route's pool.
`[studied]` sits in that algorithm's strip list, so marking a question studied never stales this route —
which is what makes the two rituals independent: the daily block writes markers into a bank all day
without obliging a rebuild.

## Selection algorithm

1. Candidate pool: current `⭐⭐⭐` questions from eligible banks only. `⭐⭐` and `⭐` stay in the bank and
   never enter the route to fill a quota.
2. Deduplicate by tested decision or mechanism, not wording — **across projects as well as within one**.
   Two projects that made the same choice are asked about it once, in the project whose code defends it
   best; name the dropped ID in the report.
3. **No dedupe against the levelled CORE route** (Victor's ruling, 2026-09-05). The same decision asked
   from the topic side and from the project side is two rehearsals, and both are worth having: one
   answers "what does Angular do", the other "what did *you* do". Neither route reads the other, and
   this clause exists so a later reader does not mistake that for an omission.
4. Order for study: **project by project, most recent first** — the project an interviewer opens on is
   the one he built last — and, within a project, the bank's own file order. Never reorder a bank to
   build this route.
5. There is no per-level budget: the route carries every `⭐⭐⭐` that survives step 2. Report the count and
   its per-project split; the reviewer below judges whether it is studiable.
6. Keep stable IDs only; never copy an answer into the route.

## Cold route review

Dispatch one cold `reviewer`, reasoning tier `deep`, execution `foreground`, with a real scratch path —
`_agent-runtime-standard.md` requires one on every `reviewer` dispatch and requires this prompt to read
it when the reviewer dies. Give it the proposed route, the selected question lines, `_shared-context.md`
and the eligible projects' PLANNING.md files. The route's `Question inventory SHA-256` is out of its
scope: the deterministic ID, count and fingerprint checks are rerun here after corrections are applied.
It must return:

- `N questions reviewed` and the selected count;
- duplicate-decision verdict, **including across projects**;
- per-project balance verdict — a project contributing one question when it has fifteen `⭐⭐⭐` is a
  selection defect, not a small project;
- every question it would remove, and every `⭐⭐⭐` it would have expected and did not find;
- whether the total is studiable in the daily block, with its reasoning.

It writes nothing. Re-dispatch once if the proof is incomplete. Apply accepted corrections, then rerun
the deterministic ID, count and fingerprint checks. No reviewer means no route commit.

## Required route format

```markdown
# Project Interview-prep Route

Route status: current
Question inventory SHA-256: <digest>
Generated: YYYY-MM-DD
Route questions: 17
Projects: 01-todo-list

| Order | ID | Project | Question |
|---:|---|---|---|
| 1 | 01-todo-list-012 | 01-todo-list | Your app has three components and one service. Walk me through who owns the task list? |
```

There is no `Level:` line: a project bank has no level, which is the whole reason this route is a file of
its own. IDs are unique, every ID resolves to exactly one bilingual question, and table order is the
study order. The question text is a navigation label only; the bank remains the content source.

## Write, commit and close out

`MODE = dry-run` prints the proposed route and the reviewer verdict without writing it. `MODE = update`
writes it, runs `git status --short` immediately before staging and committing, stages only the route,
and commits:

```text
docs(interview): plan the project question route
```

Then execute `notes/prompts/_internal/_pipeline-self-report.md` in full: write
`_internal/_last-run-report-interview-prep-route-projects.md`, record the target/outcome in this prompt's
own row under `## Single-shot prompt executions` — **that table holds the run record of both route
prompts, which are the two orchestrators the per-project and per-topic tables have no cell for** — and
commit the report plus `_run-tracker.md` separately. Report the eligible and ineligible projects with their reason, the inventory fingerprint,
the candidate count, the selected count and its per-project split, **every `[studied]` question this run
dropped from the route, by ID** (guard 5), the reviewer verdict, the route commit
and the self-report commit.
