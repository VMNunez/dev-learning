---
name: readme-concept-add
description: >
  Decide whether the concepts a piece of project work applied are already represented in the project's
  README(s), and write their entries in the right file and the right section where they are not — called by the `step-complete`
  and `backlog-task-close` rituals as their README sub-step, and directly when Victor asks ("añade esto al
  README", "esto no está en el README del backend", "add a README bullet for this"). It derives the
  project's README layout from the project number, routes the concept by **audience** (recruiter vs
  technical interviewer) to the global / backend / frontend README, and writes it in that section's own
  format. It also sweeps the caller's diff for the decisions the session never named. The failure mode
  this exists for is a concept landing in the wrong
  README or in a section that file's contract does not have — "What I learned" invented inside a backend
  README, recruiter-facing prose buried in a tier file — which `readme-audit` then has to undo. It also clears the
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


A concept was just applied in project code. This skill answers two questions — **which concepts did that
work actually put in the README's reach**, and for each of them, **is it already represented in this
project's README(s), and if not, which file and which section owns it?** — and writes the entries whose
answer is "not yet". The caller names the first set; step 0 widens it from the diff.

**Read `notes/prompts/projects/readme/_internal/_readme-standard.md` before editing anything.** It only
auto-loads inside the `readme-audit` pipeline, so an inline edit without it silently breaks the file's
contract. It owns the README layout, the section list and order of each target, and the format of every
section; this skill applies that standard, it does not restate or override it.

This skill writes **entries into existing sections** — one per concept it keeps, and on the common run
that is one or none — and clears the promise markers the project has
since outgrown (step 3b). It never adds a section, reorders sections, rewrites neighbouring bullets, or
touches screenshots and the placeholders of work that genuinely has not started — those are
`readme-audit`'s, and an inline edit that "tidies while it is there" is how a ritual quietly becomes a
half-audit.

---

## 0 — The concept set: what the caller named, and what the diff shows

The concepts the caller passed are the ones the step or task **talked about**. A README is read by people
who were not in that session, and the gap between the two is lost the same way every time: a decision
taken while implementing something else — the delete that was made soft, the boundary a DTO was introduced
to hold — is never verbalised, so it never reaches this skill, and no later pass adds it. `readme-audit`
will not: it is handed the README and the plan, never the code, so a decision only the diff shows is
invisible to it. The coverage side has swept its diff since `coverage-mark` §2b, which is why the
checklist can be **ahead** of the README on the same commit.

So before routing anything, read the diff the caller's work produced — whether it is already committed or
still sitting in the working tree — and widen the set.

- **The bar is a decision, not a pattern.** Ask of the diff one thing: *does this take a choice a competent
  developer could have taken differently?* The rejected alternative is what separates a decision from an
  implementation detail — soft delete over hard delete, a DTO boundary chosen over exposing the entity, a
  filter placed ahead of the auth check. **Whether a README already names it is step 2's test, under its
  `What I learned` exception** — pre-filtering here on representation reintroduces the whole-file grep that
  `REC-200` records as this skill's own fixed defect, and it discards the concept before the step that
  knows better ever sees it.
- **This is not `coverage-mark`'s sweep.** That one asks which language constructs and standard-library
  types the diff uses — a `record`, a `Map`, a concurrent collection. Those are coverage bullets and they
  are never README entries **on their own**: a construct enters a README only as the *mechanism* of a
  decision the entry states, the way the backend's throttling entry names an immutable `record` because
  the reason is this system's concurrency. Same diff, different question: do not inherit the other bar.
- **A decision this project made, not a language idiom applied correctly.** Both have a rejected
  alternative — a private constructor on a class of static factories rejects the implicit public one — so
  the rejected-alternative test alone lets idioms through. The separator is the standard's **interviewer
  lens**: the entry has to prove something about why *this system* is built the way it is. An entry that
  would read the same in any project of this stack is coverage's, not the README's. **One exception, and
  the standard states it**: a pattern listed under *Must include* by the section it would route to — the
  tier READMEs' Key patterns, where layered architecture, the DTO boundary and the `GlobalExceptionHandler`
  are owed whether or not they are distinctive — so the sweep keeps it if the diff introduced it.
- **Scope it to the diff.** The files the change touched, plus whatever one of them names that you must
  open to see the rejected alternative — the config declaring the perimeter a new `@PreAuthorize` narrows,
  the sibling endpoint the change is now consistent with. A neighbouring file is not a project-wide read,
  and a project-wide read is `readme-audit`'s, which Victor asks for deliberately.
- **Draft before deciding.** Write the entry as it would appear, then look at it: if what comes out is a
  method name or a description of the change, it was not a decision — try once more, naming the rejected
  alternative, and drop it only if that still will not make a sentence. This turns step 3's *no
  explanations* rule into an inclusion test.
- **The high bar is the point.** Rule 9 bounds `What I learned` by three tests and no number, and
  `REC-196` measured what an adder with no subtractor does to a README. Two findings on a large step is a
  lot; zero is a normal and expected result.
- **The sweep reaches what the code *did*, never what it declined to do.** A tradeoff that exists because
  no code was written — no `GET /{id}`, no password-reset flow — has no hunk to find, and stays the
  caller's to name.

Every concept the sweep keeps goes through steps 1-3 exactly like the caller's own: routed by audience,
checked against the file, and written only where the file does not already name it — which, for most of
them, it already does.

**If there is no diff to resolve** — the inline path, where Victor names a concept with no ritual and no
commit range behind it — say **"no caller diff, sweep skipped"** and go to step 1. If there is one and it
yields no concept to route, say **"nothing further in the diff"**; if it yields concepts and step 2 then
finds every one of them already named, say **"swept, all already represented"**. An unstated sweep is
indistinguishable from a skipped one.

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

**One exception, and it is narrow: the global README's `What I learned`.** Rule 9 states outright that a
concept named in `Architecture decisions` or `Tradeoffs` **and** again as a recall line here is not a
duplicate — the two sections are read differently and the repeat is the section's shape. A whole-file
grep collapses that: it finds `HttpParams` upstairs, reports "already represented", and the recall line
rule 9 wants is never written. So **when the concept routes to `What I learned`, search that section
only**; a hit anywhere else in the file is not representation for this purpose.

**Everywhere else the whole-file grep stands, and it is what keeps the file honest.** Two sections of a
tier README are not two altitudes: a concept named in the backend's `Auth flow` **is** represented in
that README, and writing it again under `Key patterns` states it twice in one file. The two-altitude
licence is rule 9's alone.

**If it is already represented:** say so, name the exact entry, and write nothing. This is a *good*
outcome and it is common. Per the standard, a README with one bullet per step, or one per bug fix, is a
**worse** README than one that names what the project taught — the bar for adding a line is that the file
would otherwise fail to name something real, not that a step happened to close.

Do not reword an existing entry to match the vocabulary of the step or task that just finished.

**If it is missing:** continue to step 3.

## 3 — Write the entry

Write it in **the format the standard gives that section**, in the section's existing voice and bullet
shape, in the position its ordering implies — not appended at the end of the file.

**In `What I learned` that position is a rule, not a preference.** Rule 9 orders the section by what the
project exists to teach — Angular then TypeScript on `01`–`06`, `### Backend` before `### Frontend` on
`07+` — with HTML, CSS and accessibility last. Appending to the end of the list is only correct when the
concept genuinely belongs last.

**On a full-stack project, place the entry inside the matching `###` subsection *if it is there*.** A
project whose section is still a flat list, or whose second tier is not built, does not gain a heading
from this skill: that restructure is `readme-audit`'s, and adding a section is on this skill's forbidden
list above. Write the entry where the ordering rule puts it in the list as it stands, and **report** that
the section is still flat.

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

So reconcile the markers of **every README this run routed a concept to** — written to or not — against
**PLANNING §15**:

1. `grep -n "coming soon\|(planned)" {target README}`.
2. For each hit, find the step it names in §15. **`✅` means the marker is false** — delete the marker and
   nothing else, leaving the heading text and the section's content exactly as they are.
3. A step that is not `✅` keeps its marker, and so does every screenshot placeholder and every
   `*(planned)*` on work that has not started. Those stay `readme-audit`'s.

This step deletes a marker; it never rewrites a section. If a section's **content** is also stale — an
endpoint table missing a status the code now returns — that is a finding to **report**, not to fix here:
fixing it is the whole-file judgment `readme-audit` owns, and this is the boundary that keeps an inline
entry from becoming a half-audit.

Run it even when step 2 wrote nothing for any concept in the set: an already-represented concept still
leaves the file open in front of you, and the reconciliation costs one grep. **Once per target README,
not once per concept** — the set widened by step 0 can put several concepts in the same file, and the
markers of a file already reconciled on this run are not reconciled again.

Report what you cleared, or say **"no stale markers"** — silence reads as a skipped step.

## 4 — Commit the README

**You commit it yourself**, authorized 2026-08-01 — this skill writes the entries, so the authorship
boundary puts the file on your side. **One atomic commit for everything this invocation wrote**, on the
active branch, staging only the README(s) this run actually changed. The standard's granularity rule is
that the unit is the change, never the file: a cross-tier concept lands in the global README *plus* the
tier that implements it, and that is still one concept, so it is still **one** commit — never one per
file, and never one per concept when the caller's set or step 0's sweep produced several. Apply the
hygiene rule: `git status` immediately before the `add` and before the `commit`, so no project code file
is staged alongside it.

```
docs(readme): <what the entries name>
```

A run that wrote nothing commits nothing — clearing a stale marker in step 3b is itself a write, and it
travels in this same commit.

## Report

One row per concept, folded into the calling ritual's report table when there is one:

| Concept | README / section | Result |
|---|---|---|
| declarative transaction boundaries | `backend` / Key patterns | added — `@Transactional` at the service boundary |
| JWT in the filter chain | `backend` / Key patterns | already represented — "Auth flow" names it, no write |
| soft delete over hard delete | `backend` / Tradeoffs | added — keeps leave history auditable |
| role-based access control | `global` / What I learned | added — crosses tiers, implemented line in `backend` |
| `provideHttpClient` migration | `frontend` / Key patterns | not written — frontend not started, no README yet |
| *(swept)* id tie-breaker on a paged sort | `backend` / Key patterns | added — the caller never named it; a non-unique sort column repeats rows across pages |
| *(markers)* | `backend` | cleared 7 `*(Step N — coming soon)*` on §15-`✅` steps; screenshot placeholders left for `readme-audit` |

**Label every row step 0 found `*(swept)*` in its Concept cell**, exactly as `coverage-mark` does. That
visibility is the point: a run that silently found a decision the session never named teaches the caller
nothing about what it keeps failing to notice.

Always include: the target you chose **and the audience argument for it** (one clause), the step-3b
marker reconciliation, and whether any README was actually modified — because "nothing written" is the expected result often enough that a silent
report reads as a skipped step. Include the sweep's own line on every run, for the same reason — one of
**"no caller diff, sweep skipped"**, **"nothing further in the diff"**, **"swept, all already
represented"**, or the `*(swept)*` rows themselves when it wrote.
