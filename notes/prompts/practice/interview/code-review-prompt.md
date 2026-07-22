# Code Review Practice Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste the prompt into a new chat.

This trains the newest filter in 2026 technical tests: you are shown a flawed snippet — often the
kind an AI assistant would generate — and asked to find what is wrong and explain it. The other
practice prompts cover recall (`simulator`) and building from scratch (`simulation-review`); this
one is the missing skill — **reviewing code you did not write.**

> **▶ Run first:** nothing — self-contained; it generates the flawed snippet for you.

How it works: the prompt generates a realistic snippet with planted issues and shows you only the
code. You write your review. Then it grades what you found, what you missed, and what you flagged by
mistake, and turns your gaps into interview questions.

---

**How to use:**

1. Fill in `TYPE`, and optionally `DIFFICULTY`, `ISSUE_COUNT`, and `FOCUS`
2. Paste the entire prompt into a new chat
3. Read the snippet, write your review in the same chat, then let it grade you

---

````
## Configuration — edit only this block

TYPE        = [angular | spring-boot | sql | all]
              → TYPE = all runs one snippet per type in turn — see notes/prompts/_internal/_batch-mode.md
                (order: angular, spring-boot, sql; finish reviewing one before the next starts)
DIFFICULTY  = [intro | standard | challenge]   → default: standard
ISSUE_COUNT = [number of issues to plant]       → default: 4
FOCUS       = [optional — a concept to centre the snippet on, e.g. "JWT filter", "reactive forms",
              "LEFT JOIN + NULL", "@Transactional". Leave blank to mix issues across the topic.]

Validation — before anything else:
- If TYPE is blank: print "Error: TYPE is required (angular | spring-boot | sql)." and stop.
- If DIFFICULTY is blank: use standard. If ISSUE_COUNT is blank or below 2: use 4.

---

## Context

Before starting, read `CLAUDE.md` (teaching rules) and `notes/prompts/_internal/_shared-context.md`
(my profile, and especially the **"Spanish job market 2026"** and **"AI factor 2026"** sections —
they list the exact mistakes interviewers test for in the code-review step).

The point of this exercise appears in the stage-3 technical test (a code-review step) and again live in stage 4. The underlying reality: a junior who can write code but cannot review
it gets filtered out. I must learn to spot the bug, name *why* it is wrong, and say how I would fix
it — out loud, the way I would in an interview.

---

## Step 1 — Generate the snippet

Write one realistic code snippet in {TYPE}, at {DIFFICULTY} level, centred on {FOCUS} if set.

Rules for the snippet:
- It must look like real, plausible code a junior or an AI assistant would produce — not obviously
  broken. The issues are hidden inside working-looking code.
- Plant exactly {ISSUE_COUNT} issues of **mixed severity** (at least one High). Draw from the real
  failure modes for {TYPE}, prioritising the AI mistakes listed in `_shared-context.md` when they
  fit:
  - **spring-boot:** `@Transactional` on a controller or a private method; entity returned instead
    of a DTO; `@NotNull` where `@NotBlank` was needed; hardcoded secret/JWT key; business logic in
    the controller; `userId` trusted from the request body instead of `SecurityContextHolder`;
    N+1 from `EAGER`/missing fetch; wrong HTTP status; a test with no meaningful assertion.
  - **angular:** HTTP call inside a component instead of a service; `any` types; subscription with
    no cleanup (`takeUntilDestroyed`); validation read on load instead of on submit; sequential
    `subscribe` where `forkJoin` fits; `Subject` where `BehaviorSubject` was needed; secret/API key
    in the source; missing loading/error state.
  - **sql:** `WHERE` used where `HAVING` is needed; `INNER JOIN` dropping rows a `LEFT JOIN` should
    keep; `COUNT(column)` ignoring NULLs unexpectedly; missing `GROUP BY` column; `=' NULL'` instead
    of `IS NULL`; `DELETE` with no `WHERE`; a query that returns duplicates because of a fan-out join.
- Difficulty calibration: **intro** = issues are clear once you look; **standard** = at least one is
  subtle; **challenge** = at least two are subtle and one is a design-level problem, not a typo.

Show **only**:
1. One or two sentences of context ("This is a service method that…", "This query is meant to…").
2. The code block.
3. This instruction: "Review this code. List every problem you find — for each, say what is wrong,
   why it matters, and how you would fix it. Reply when you are done."

**Do not reveal the issues, the count beyond what is in the config, or any hint. Keep your planted
list internally for Step 3.** Then stop and wait for my review.

---

## Step 2 — Wait for my review

Do not grade until I reply. If I say "no sé" or give an empty review, give one hint that points at
the most important area without naming the bug, then wait once more.

---

## Step 3 — Grade the review

Compare my review against your planted list.

**Planted issues table:**

| # | Issue | Severity | Found? | Note |
|---|-------|----------|--------|------|
| 1 | [what it is + the line] | High/Med/Low | ✅ / ❌ | one line: if missed, why it matters; if found, confirm |

For each issue I missed (❌): show the problematic line, explain in one sentence why it is wrong,
and show the corrected version in a code block.

Then:
- **False positives:** anything I flagged that is actually fine — explain why it is correct, in one
  sentence. (Flagging correct code as broken is itself a red flag in an interview.)
- **Bonus:** any real issue I found that you did not plant — credit it.

**Score:** X / {ISSUE_COUNT} planted issues found.
**Verdict:**
- ✅ Strong — found all High-severity issues and most others; no false positives that matter
- 🔧 Good — found the main issues but missed a subtle one, or had a minor false positive
- ⚠️ Weak — missed a High-severity issue, or flagged correct code as broken

One line on how I would phrase the most important finding out loud in an interview — the goal is not
just spotting it, but explaining it like someone who understands the code.

---

## Step 4 — Interview questions

For each **distinct concept** behind a missed issue or a false positive, add one interview question.
"Distinct" means a different underlying concept — if two misses share one root cause, add one
question. If I found everything cleanly, skip this step.

Route each question to the topic file for {TYPE}:
- angular → `notes/interview-prep/{en,es}/angular.md`
- spring-boot → `notes/interview-prep/{en,es}/spring-boot.md`
- sql → `notes/interview-prep/{en,es}/sql.md`

Then add each following **"Adding questions from outside the audit (practice prompts)"** in
`notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` — it defines the question format,
the bilingual rule, dedupe-by-concept, placement, and priority-marker reordering. Do not restate them
here. Answer in first person ("I check…", "I move it to…") and anchor to this exercise or a real
project when the question is about a pattern or decision.

---

## Step 5 — Commit message

Only if interview questions were added. One command per code block:

```
git add notes/interview-prep/en/{TYPE}.md notes/interview-prep/es/{TYPE}.md
```

```
git commit -m "docs: code-review practice {TYPE} — add questions for [main gap]"
```

If no questions were added (clean review), print: "Clean review — nothing to add. Run again with a
higher DIFFICULTY or a different FOCUS."

---

## Final step — write the self-report

Read `notes/prompts/_internal/_single-shot-self-report.md` and execute it in full: the close-out check
against this prompt's declared outputs in `notes/prompts/README.md`, the three bullets written to
`notes/prompts/practice/interview/_internal/_last-run-report-code-review.md`, its own commit, then the refinement step.

> **Run-start check (step 0):** that file's Step 5 — before anything else, read
> `notes/prompts/practice/interview/_internal/_last-run-report-code-review.md` and surface its Verdict in one line if `Status` is `open`.

````
