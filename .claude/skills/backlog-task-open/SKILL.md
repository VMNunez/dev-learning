---
name: backlog-task-open
description: >
  Validate a task from the active project's PROJECT-BACKLOG.md against its real project context BEFORE
  any teaching or fixing starts — the moment Victor picks one up ("sigamos con otra tarea", "vamos con
  la del @Transactional", "next backlog task", or he names one from the list). The backlog is written by
  `review-audit`, which reads the code but **never reads PLANNING.md**, so a finding can be correct about
  the code and still wrong about the project: it can contradict a documented decision, under-state its
  real scope, or be right in the abstract but wrong for a junior portfolio project two months from
  interviews. The failure mode this exists for is spending a full teach-solve-close cycle on a false
  positive, or fixing the two call sites the review listed while a third breaks the build. It ends with
  a verdict and, only then, hands off to the normal teach-first explanation. Do NOT use it to re-review
  the project, to open several tasks at once, to close a finished task (that is `backlog-task-close`),
  or inside the `review-audit` / `portfolio-audit` pipelines.
---

# Backlog-task opening triage

A task from `{PROJECT_PATH}/PROJECT-BACKLOG.md` is about to be worked on. This skill answers one
question — **does this finding actually hold in this project, and is what it asks for what should be
done?** — and produces a verdict before a single line is taught or written.

This is the twin of `backlog-task-close`. That one fires when the fix works and pushes the concept back
into coverage / README / PLANNING / PROGRESS. This one fires **first**, and exists because the two
artifacts have different blind spots:

> `review-audit` reads the **code**. It does not read `PLANNING.md`, it does not know Victor's level or
> his August 2026 interview target, and it cannot see a decision deliberately made in an earlier
> session. Every task it writes is a *hypothesis about the code*, not a ruling about the project.

Run it **inline, in the session** — not as a cold subagent. The whole value here is holding the code,
the plan, the closed ledger and Victor's goals in one context at once; a cold agent would have to
re-derive all of it and would still miss the session history.

---

## 1 — Read the task and the three things the reviewer could not

Quote the task line verbatim first, so what is being judged is on screen.

Then read, in this order — **all four, before forming any opinion**:

1. **The code the task names.** Open the actual files and lines. The task's line numbers may have moved
   since the review ran; find the real thing rather than trusting the citation.
2. **`PLANNING.md`** — the section that governs this area (§6 engineering rules, §8 business rules,
   §10 API contract, whichever applies). This is the reviewer's blind spot and the single most common
   source of a false positive.
3. **The `## Closed` ledger** in `PROJECT-BACKLOG.md` — a `DECISION, no code change` line is the record
   of a deliberate past choice, and re-litigating one is exactly what the ledger exists to prevent.
4. **What else touches it.** Grep for every consumer of the thing being changed — the other call sites,
   the DTO's other readers, the documented contract, the planned frontend that will consume it. This is
   what catches the "the review said 2 sites, the compiler will find 4" case.

If the task is a **decision task** — one whose text already says "decide before touching it", with two
or three defensible outcomes listed — the reviewer has already flagged that it needs this pass. Those
never skip it.

## 2 — Reach one of four verdicts

State which one, in one sentence, with the evidence that decided it.

- **Valid as written** — the finding holds and its proposed fix is the right fix. Proceed.
- **Valid, wrong scope** — the problem is real but the task under- or over-states what it touches.
  Restate the true scope *before* teaching, so Victor works from the real list. (The `fieldErrors` task
  on 2026-08-01: the review listed 2 sites, the actual change was 4, including a call site that would
  not compile and a documented contract in §10.)
- **Valid, wrong moment** — the finding is correct but should not be done now: it belongs to a level
  above where Victor is, it is a production concern this portfolio project will never have, or it costs
  more than it teaches with interviews close. Say so and let him choose; do not decide for him.
- **False positive** — the code is correct as it stands, and the reviewer was missing context. Name the
  context it was missing.

The bar for "false positive" is **evidence, not taste**: a documented rule in PLANNING, a `DECISION`
line in the ledger, or a mechanism the reviewer misread. "I would have written it differently" is not a
false positive, and neither is "this seems minor" — a Low task is still real.

Never soften a valid finding because the fix is inconvenient, and never manufacture a false positive to
save work. The whole point of this pass is that its verdict can be trusted in both directions.

## 3 — Route the verdict

**Valid as written / valid with corrected scope** → hand off to the normal cycle: explain the problem
and the theory first, let Victor try it himself, give code only if he asks (his standing teach-first
rule). Carry the corrected scope into that explanation so he is not working from the task's wrong list.

**Valid, wrong moment** → put the choice to Victor with the tradeoff stated. If he defers it, the task
stays open and untouched; annotate nothing. If he drops it, it goes to the ledger via
`backlog-task-close` as a `DECISION, no code change` line with the reason.

**False positive** → do not fix anything. Take it straight to `backlog-task-close`, which collapses it
into the `## Closed` ledger as `DECISION, no code change` with the reason in the `→` tail. That line is
the only thing standing between the same non-bug and the next `review-audit` run re-raising it, so it
must say *why* the code is right, not merely that the task was dropped.

In all three routes the task leaves this skill with a decision attached. A task that is read and then
worked on with no verdict stated is this skill not having run.

## 4 — Report

Compact, four lines, before any teaching begins:

| | |
|---|---|
| Task | *(quoted, one line)* |
| Checked | code · PLANNING §N · ledger · N consumers |
| Verdict | valid as written / valid, real scope is N sites / valid, wrong moment / false positive |
| Why | the one piece of evidence that decided it |

Then, and only then, start the explanation.

---

## What this skill is not

- **Not a second review.** It judges one task against its own claim. Defects it notices in passing are
  not its business — mention them once in chat and move on; `review-audit` owns finding them.
- **Not a rubber stamp.** If every task comes back "valid as written", the pass is not being run
  honestly — this session's own history has at least one scope correction and the reviewer's PLANNING
  blindness is structural, not occasional.
- **Not a licence to redesign.** "Valid, wrong scope" corrects the *extent* of the task's fix, not its
  approach. Preferring a different architecture is a new backlog task, not a reinterpretation of this
  one.

## Commits

This skill writes nothing and commits nothing. A false positive's ledger line is written by
`backlog-task-close`, under that skill's own authorization.
