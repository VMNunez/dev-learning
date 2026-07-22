# Simulation Review Prompt

Use in a **separate conversation**. Fill in the configuration block, paste the prompt into a new chat, then paste your solution code at the very end.

Run this after you finish a timed simulation — no notes, no AI, timer stopped. You get the kind of feedback a real consultancy test reviewer would give.

**Before running this prompt:** fill in your own `Self-assessment` column in TRACKER.md (✅ Solid / 🔧 Good / ⚠️ Weak / ❌ Failed). The prompt updates `Status` and `Date` — it does not touch `Self-assessment`.

> **▶ Run first:** nothing — run it after finishing a simulation, with your solution pasted at the end.

---

**How to use:**

1. In the configuration block: delete all `SIMULATION_FILE` lines except the one you are reviewing
2. Fill in `TIME_USED` and `MODE`
3. Paste the entire prompt into a new chat
4. Paste your code below it — after the last line of the prompt

---

````
## Configuration — edit only this block

SIMULATION_FILE = practice/simulations/angular/01-task-form.md
SIMULATION_FILE = practice/simulations/angular/02-user-search.md
SIMULATION_FILE = practice/simulations/angular/03-product-filter.md
SIMULATION_FILE = practice/simulations/angular/04-login-form.md
SIMULATION_FILE = practice/simulations/angular/05-expense-dashboard.md
SIMULATION_FILE = practice/simulations/spring-boot/01-task-api.md
SIMULATION_FILE = practice/simulations/spring-boot/02-product-api.md
SIMULATION_FILE = practice/simulations/spring-boot/03-user-api.md
SIMULATION_FILE = practice/simulations/spring-boot/04-order-api.md
SIMULATION_FILE = practice/simulations/spring-boot/05-employee-api.md
SIMULATION_FILE = practice/simulations/sql/01-bookstore.md
SIMULATION_FILE = practice/simulations/sql/02-employees.md
SIMULATION_FILE = practice/simulations/sql/03-ecommerce.md
SIMULATION_FILE = practice/simulations/sql/04-university.md
SIMULATION_FILE = practice/simulations/sql/05-inventory.md
← delete all lines above except the one you are reviewing.
  For a spec created later by simulation-generator (06+), just write its path here
  (e.g. practice/simulations/spring-boot/06-invoice-api.md) — the list above is only the original bank.

TIME_USED       = [minutes used — exact, no rounding — e.g. 74]
MODE            = [review | hint — leave blank for review]

TYPE is auto-detected from SIMULATION_FILE — do not fill it in:
- path contains /angular/     → angular
- path contains /spring-boot/ → spring-boot
- path contains /sql/         → sql

MODE behaviour:
- review (default, blank): run after finishing the simulation — full scoring, feedback, ideal solution, interview questions, TRACKER update
- hint: run when stuck mid-simulation — reads your partial code and guides you one step at a time; skip to the Hint mode section at the end of this prompt

---

## Context

Before starting, read CLAUDE.md (teaching rules) and `notes/prompts/_internal/_shared-context.md`
(my profile, and what Spanish consultancies look for).

I just completed the simulation at {SIMULATION_FILE} under real conditions: no notes,
no documentation, no AI. {TIME_USED} minutes used. My code is pasted at the end of this chat.

**If MODE = hint:** skip Steps 1–5 and go directly to the Hint mode section at the end of
this prompt. Ignore TIME_USED.
**If MODE = review or blank:** continue with Step 1 below.

---

## Step 1 — Read the spec

Read {SIMULATION_FILE}. Understand exactly what was asked: requirements, acceptance criteria,
data or constraints given, and expected output or behaviour.

Do not look at my code yet. First, list the requirements as you understand them — numbered,
one per line. This list is the scoring basis for Step 2.

Note the time limit stated in the spec — you will compare it against {TIME_USED} in Step 2.

---

## Step 2 — Score my solution

Read the code pasted at the end of this chat.

Score each dimension:
- **3 — Strong:** a senior developer would accept this without changes
- **2 — Acceptable:** works but has noticeable issues a reviewer would flag
- **1 — Weak:** missing, broken, or fundamentally wrong approach

Core dimensions are marked *(core)*. A score of 1 in any core dimension triggers Borderline or Fail.
Secondary dimensions affect quality but not the overall verdict on their own.

**Angular simulations:**
| Dimension | Score (1–3) | Notes |
|-----------|-------------|-------|
| Requirements met (X/Y from Step 1) *(core)* | | |
| Reactive forms — FormGroup, validators, error messages wired *(core)* | | |
| HTTP service — correct method, URL, error handled *(core)* | | |
| TypeScript — interfaces defined, no `any` | | |
| Patterns — service for HTTP, smart/dumb split where relevant | | |
| Edge cases — loading state, empty state, error state | | |

If the spec explicitly requires tests, add this row:
| Tests — written and meaningful | | |

**Spring Boot simulations:**
| Dimension | Score (1–3) | Notes |
|-----------|-------------|-------|
| Requirements met (X/Y from Step 1) *(core)* | | |
| Layered architecture — controller handles HTTP only *(core)* | | |
| DTOs — request and response separate from entity *(core)* | | |
| Validation — @Valid, @NotBlank, @NotNull on request DTOs | | |
| Error handling — @RestControllerAdvice or manual try/catch in service | | |
| HTTP conventions — correct status codes (201, 204, 404, 400, 409) | | |

If the spec explicitly requires tests, add this row:
| Tests — written and meaningful | | |

**SQL simulations:**
| Dimension | Score (1–3) | Notes |
|-----------|-------------|-------|
| Requirements met (X/Y from Step 1) *(core)* | | |
| Query correctness — right result returned *(core)* | | |
| JOIN type correct for each query *(core)* | | |
| Aggregates and GROUP BY / HAVING used correctly | | |
| NULL handling — IS NULL, COALESCE where needed | | |
| PostgreSQL features used where they help (ILIKE, ::, DISTINCT ON) | | |

**Overall verdict:**
- **Pass** — Requirements met scored 2 or 3, and no other core dimension scored 1
- **Borderline** — Requirements met scored 2 or 3, and exactly 1 other core dimension scored 1
- **Fail** — Requirements met scored 1, OR both other core dimensions scored 1

"Other" means the 2 core dimensions besides Requirements met — each simulation type has exactly 2 of them. If Requirements met = 1, the verdict is always Fail regardless of other scores.

Compare {TIME_USED} to the spec time limit:
- If exceeded: note which parts took the most time and why. Distinguish between time lost on
  syntax (fixable with practice) vs time lost on design decisions (requires deeper project
  experience).
- If under or on time: note it briefly — finishing within the limit signals confidence in the
  material.

---

## Step 3 — Detailed feedback

For every requirement NOT fully met:
- Quote the requirement text
- Describe what was missing or wrong
- Show the corrected version in a code block

For every dimension scored 1:
- Quote the problematic code
- Explain why it is wrong (one sentence)
- Show the corrected version

Name 1–2 things done well (applies to any verdict, not just Pass). One line each.
Only mention real strengths — no false positives. If nothing stands out, skip this.

**Pattern check — before closing this step:**
Read practice/simulations/TRACKER.md. Count completed simulations for the same TYPE (angular / spring-boot / sql)
that show ❌ Fail or ⚠️ Borderline status. Then add 1 if the current verdict is also ❌ Fail or
⚠️ Borderline. If the combined total is 2 or more, flag it:
"Recurring pattern: [N] of your [TYPE] simulations resulted in Borderline or Fail. In this session
the weakest dimensions were: [list dimensions that scored 1 or 2 from Step 2]. Prioritise these
before the next one."
If no previous completed simulations of this type exist in TRACKER.md (this is the first one),
skip this check.

**Ideal solution:**
Write a complete, clean solution that scores 3 on every dimension — all files needed to
satisfy every requirement. Add a brief inline comment on each non-obvious decision (why
this approach, not what the code does). This is the reference Victor compares against his
own version.

---

## Step 4 — Interview questions

**If verdict is Borderline or Fail:** write 2–3 questions targeting the specific gaps in this
solution — not generic questions about the technology.

**If verdict is Pass:** write 1 question. If the Step 2 scorecard shows any dimension scored 1
or 2, target the most important gap. If every dimension scored 3, write a reinforcement question
about the strongest pattern applied correctly in this solution.

Route each question to the topic file for the simulation TYPE:
- Angular → `notes/interview-prep/{en,es}/angular.md`
- Spring Boot → `notes/interview-prep/{en,es}/spring-boot.md`
- SQL → `notes/interview-prep/{en,es}/sql.md`

Then add each following **"Adding questions from outside the audit (practice prompts)"** in
`notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` — it defines the question format,
the bilingual rule, dedupe-by-concept, placement, and priority-marker reordering. Do not restate them
here. Anchor the answer to this simulation or a real project when the question is about a pattern or
decision ("I chose…", "I used…", not "it is used").

---

## Step 5 — Update the tracker

Update three files:

**practice/simulations/TRACKER.md** — find the row for {SIMULATION_FILE} and update:
- **Status:** ✅ Pass / ⚠️ Borderline / ❌ Fail (from Step 2 verdict)
- **Date:** today's date

**{SIMULATION_FILE}** — update the header fields at the top of the spec:
- **Status:** same value as TRACKER.md
- **Date completed:** today's date

Leave **Self-assessment** untouched in both files — Victor fills that himself before running
this prompt.

**PROGRESS.md** — refresh the `## Simulations` section. Once the TRACKER.md row above is updated,
recount from TRACKER.md itself (it is small and already open) and rewrite the four lines:

```
## Simulations

- Angular: X completed (X Pass, X Borderline, X Fail)
- Spring Boot: X completed (X Pass, X Borderline, X Fail)
- SQL: X completed (X Pass, X Borderline, X Fail)
- Total: X / 15 minimum target
```

Three counting rules, each easy to get silently wrong:
- **Count the `Status` column, never `Self-assessment`.** The two columns use different scales —
  Status is Pass/Borderline/Fail, Self-assessment is Solid/Good/Weak/Failed. Counting the wrong one
  yields plausible numbers and no error.
- **`X completed` = Pass + Borderline only.** A ❌ Fail appears in the breakdown but does not count
  as completed. `Total` is the sum of the three `completed` values, against the 15 target.
- **Rows still ⏳ Pending count as nothing** — skip them.

This section has two writers: this prompt (primary — it holds the Step 2 verdict) and
`progress-update-prompt.md` (safety net — its Steps C and D4 recount the same section from the same
file). Their output must be **identical**; if the format or the three rules above ever drift apart,
the two will overwrite each other on every run. Change them together or not at all.

PROGRESS.md follows the active branch (CLAUDE.md 2026-07-14 — `main` only receives merges via PR),
so it commits alongside the other two.

Then show the commit message:

```
git add {SIMULATION_FILE} practice/simulations/TRACKER.md PROGRESS.md
```
If (and only if) questions were added, also stage the two exact Q&A files:
```
git add notes/interview-prep/en/{topic}.md notes/interview-prep/es/{topic}.md
```

```
git commit -m "docs: simulation {type} {NN} — [Pass/Borderline/Fail], {TIME_USED}min"
```

---

## Hint mode

*This section only runs when MODE = hint. Victor is mid-simulation and needs help to advance.
Do not run Steps 1–5. Do not score, do not update TRACKER.md, do not add interview questions.*

**H1 — Read the spec**
Read {SIMULATION_FILE}. List every requirement, numbered — the same way Step 1 would.

**H2 — Read the partial code**
Read the code pasted at the end of this chat. For each requirement from H1, mark:
- ✅ done — implemented correctly
- ⚠️ started — attempt exists but has a problem (describe the problem in one sentence)
- ❌ missing — not attempted yet

**H3 — Guide the next step**
Pick the first ⚠️ or ❌ item. For that item only:
- If ⚠️: name the mistake in one sentence, explain why it is wrong, then ask Victor to fix it
- If ❌: explain the concept behind this requirement in 2–3 sentences, name the exact file
  or class where to write it, then ask Victor to try it

Do not write the code. Do not address any other requirement in this run.
Victor pastes the updated code and runs this prompt again for the next step.

---

---

## Final step — write the self-report

Read `notes/prompts/_internal/_single-shot-self-report.md` and execute it in full: the close-out check
against this prompt's declared outputs in `notes/prompts/README.md`, the three bullets written to
`notes/prompts/practice/simulations/_internal/_last-run-report-simulation-review.md`, its own commit, then the refinement step.

> **Run-start check (step 0):** that file's Step 5 — before anything else, read
> `notes/prompts/practice/simulations/_internal/_last-run-report-simulation-review.md` and surface its Verdict in one line if `Status` is `open`.


[paste your solution below this line]
````
