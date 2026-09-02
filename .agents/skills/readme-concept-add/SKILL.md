---
name: readme-concept-add
description: >
  Decide whether a concept just applied in project code is already represented in the project's README(s),
  and write its entry in the right file and the right section if it is not — called by the `step-complete`
  and `backlog-task-close` rituals as their README sub-step, and directly when Victor asks ("añade esto al
  README", "esto no está en el README del backend", "add a README bullet for this"). It derives the
  project's README layout from the project number, routes the concept by **audience** (recruiter vs
  technical interviewer) to the global / backend / frontend README, and writes it in that section's own
  format. The failure mode this exists for is a concept landing in the wrong README or in a section that
  file's contract does not have — "What I learned" invented inside a backend README, recruiter-facing
  prose buried in a tier file — which `readme-audit` then has to undo. It also clears the
  `*(Step N — coming soon)*` markers whose step PLANNING §15 already shows as `✅`, so a finished section
  stops advertising itself as unbuilt between one `readme-audit` gate and the next. Do NOT use it to
  restructure a README, fix a stale section's content, add screenshots, clear a marker whose step is not
  yet `✅`, or work inside the `readme-audit` / `portfolio-audit` pipelines — those own the whole file and must not be second-guessed bullet by bullet.
---

# README concept entry

**Shared failure close-out.** The write counts below describe successful and expected no-op or
ineligibility paths. If this invoked ritual cannot complete a declared step, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill cannot finish — durable friction"; do not
restate or widen that trigger here.

**Shared deviation close-out.** Every invocation ends by printing `desvíos: ninguno` or
`desvíos: SBRC-NNNN` as its report's last line, on clean runs too. If this ritual finished its work and
the text above is what made it improvise, ask a question this contract forbids, re-derive state the
trigger declared resolved, or write outside its declared writer set, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill's own text is what went wrong — the skill
breach log"; do not restate or widen that trigger here.


A concept was just applied in project code. This skill answers one question — **is it already represented
in this project's README(s), and if not, which file and which section owns it?** — and writes the entry
when the answer is "not yet".

**Read `notes/prompts/projects/readme/_internal/_readme-standard.md` before editing anything.** It only
auto-loads inside the `readme-audit` pipeline, so an inline edit without it silently breaks the file's
contract. It owns the README layout, the section list and order of each target, and the format of every
section; this skill applies that standard, it does not restate or override it.

This skill writes **one entry into an existing section**, and clears the promise markers the project has
since outgrown (step 3b). It never adds a section, reorders sections, rewrites neighbouring bullets, or
touches screenshots and the placeholders of work that genuinely has not started — those are
`readme-audit`'s, and an inline edit that "tidies while it is there" is how a ritual quietly becomes a
half-audit.

---

## 1 — Route the concept

Apply the standard's **"Which README owns a concept"** block, in the universal rules. It owns the whole
decision — the audience test, the four outcomes, the global+tier pair, and the rule that `What I learned`
exists only in the global README. Read it and follow it literally; do not re-derive it here.

Derive which READMEs exist from the **project number** (the standard's "Two project formats"), not from
which folder the code changed, and do not ask.

Two things this skill adds, because they are the inline caller's context and not the standard's:

- **Confirm on disk which targets exist** before routing. On a project whose frontend has not started, the
  tier file may not be there — that is a "not written, said so" outcome, never a reason to file the concept
  in a different README.
- A **backlog task's** concept is almost always tier-level, so **Key patterns** is the expected answer.
  A **design decision with no code change** usually lands in **Tradeoffs** — a convention deliberately kept
  is exactly what that section records.

## 2 — Check whether it is already represented

Grep the target README for the concept's key symbol, not the wording of the step or task — the README
names patterns, not fixes.

**If it is already represented:** say so, name the exact entry, and write nothing. This is a *good*
outcome and it is common. Per the standard, a README with one bullet per step, or one per bug fix, is a
**worse** README than one that names what the project taught — the bar for adding a line is that the file
would otherwise fail to name something real, not that a step happened to close.

Do not reword an existing entry to match the vocabulary of the step or task that just finished.

**If it is missing:** continue to step 3.

## 3 — Write the entry

Write it in **the format the standard gives that section**, in the section's existing voice and bullet
shape, in the position its ordering implies — not appended at the end of the file.

One rule worth restating, because it is what an inline edit breaks every time: **no explanations**. A
README entry is a recall line. If the concept is real but the honest entry would be long, shorten it to the
mechanism — and if it will not shorten, that is the signal the concept does not belong in this section at
all. **`notes/` is not where it goes**: the standard's Length rule stopped routing README depth there
(`REC-196`, 2026-09-02), the two pipelines are independent, and what fails a README rule is cut, never
relocated behind a pointer.

## 3b — Clear the markers the project has outgrown

A README carries `*(Step N — coming soon)*` and `*(planned)*` markers written when a section was still a
promise. **Nothing removes them when the step lands.** `readme-audit` would, but it is a gate that runs
rarely, so between one G5 and the next the file tells every reader that finished work is still coming.
That is worse than a missing entry: it *understates the project*, on the file a recruiter opens first,
and it is the one kind of staleness a reader cannot detect — an absent bullet looks like nothing, a
"coming soon" on shipped code looks like a fact.

So on every run that writes to a README, reconcile that file's markers against **PLANNING §15**:

1. `grep -n "coming soon\|(planned)" {target README}`.
2. For each hit, find the step it names in §15. **`✅` means the marker is false** — delete the marker and
   nothing else, leaving the heading text and the section's content exactly as they are.
3. A step that is not `✅` keeps its marker, and so does every screenshot placeholder and every
   `*(planned)*` on work that has not started. Those stay `readme-audit`'s.

This step deletes a marker; it never rewrites a section. If a section's **content** is also stale — an
endpoint table missing a status the code now returns — that is a finding to **report**, not to fix here:
fixing it is the whole-file judgment `readme-audit` owns, and this is the boundary that keeps an inline
entry from becoming a half-audit.

Run it even when step 2 wrote nothing: an already-represented concept still leaves the file open in
front of you, and the reconciliation costs one grep.

Report what you cleared, or say **"no stale markers"** — silence reads as a skipped step.

## 4 — Commit the README

**You commit it yourself**, authorized 2026-08-01 — this skill writes the entry, so the authorship
boundary puts the file on your side. **One atomic commit for the entry**, on the active branch, staging
only the README(s) this run actually changed. The standard's granularity rule is that the unit is the
change, never the file: a cross-tier concept lands in the global README *plus* the tier that implements
it, and that is still one concept, so it is still **one** commit — never one per file. Apply the hygiene
rule: `git status` immediately before the `add` and before the `commit`, so no project code file is
staged alongside it.

```
docs(readme): <what the entry names>
```

## Report

One row per concept, folded into the calling ritual's report table when there is one:

| Concept | README / section | Result |
|---|---|---|
| declarative transaction boundaries | `backend` / Key patterns | added — `@Transactional` at the service boundary |
| JWT in the filter chain | `backend` / Key patterns | already represented — "Auth flow" names it, no write |
| soft delete over hard delete | `backend` / Tradeoffs | added — keeps leave history auditable |
| role-based access control | `global` / What I learned | added — crosses tiers, implemented line in `backend` |
| `provideHttpClient` migration | `frontend` / Key patterns | not written — frontend not started, no README yet |
| *(markers)* | `backend` | cleared 7 `*(Step N — coming soon)*` on §15-`✅` steps; screenshot placeholders left for `readme-audit` |

Always include: the target you chose **and the audience argument for it** (one clause), the step-3b
marker reconciliation, and whether any README was actually modified — because "nothing written" is the expected result often enough that a silent
report reads as a skipped step.
