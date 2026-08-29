---
name: skill-refine
description: >
  Refine one `SKILL.md` from the evidence a real run left behind, WHENEVER a skill's close-out reports
  that its breach log has cleared the bar — handed off by the skill that just crossed it, and directly
  when Victor asks ("refina ese skill", "arregla el texto del skill", "refine that skill"). It also
  executes the `REC-054` (c) ruling on a ritual whose `_ritual-friction.md` rows have reached three. The
  prompts have refined themselves since `_pipeline-self-report.md` gained its at-end refinement step; the
  skills never could, because a skill has no self-report and its two older sinks only record a ritual
  that **broke** or one that **was not worth it** — never one whose own text is what made the run work
  around something. The failure mode this exists for is a `SKILL.md` that is quietly wrong for months: it
  never fails, never costs too much, and every run pays a small tax nothing records. It drafts, submits
  the draft to one cold reviewer that reads the whole file, applies only what is approved, and writes
  both adapter mirrors in one commit. Do NOT use it to write a new skill, to fix a skill's behaviour on a
  hunch with no `SBRC` row behind it, to edit a shared contract a skill merely executes (that routes to
  `_recommendation-ledger.md`), to delete a ritual, or inside the `/system-check` audit — that pass owns
  the whole inventory and must not be second-guessed one file at a time.
---

# Skill refine — the skills refine themselves from their own runs

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


`_session-rules.md` → "When a skill's own text is what went wrong — the skill breach log" is the source
of truth for when evidence is written and when it has earned a fix. This ritual is what happens *after*
that: it owns the draft, the gate and the edit, and nothing else in the system may edit a `SKILL.md` from
`SBRC` evidence.

**The bar is not this file's to restate.** `_pipeline-self-report.md` → "The bar" states the four
conditions, and they are quoted nowhere here on purpose — a second copy is a second thing to rot. Read
them there, apply them here, and name the failed condition out loud when you reject a finding so the same
zombie is not re-proposed.

## 0 — Which route fired

Two routes reach this skill and they license different acts. Name the route out loud before anything else.

- **Breach route** — a skill's close-out reported that `_skill-breach-log.md` cleared the bar for a
  `Scope: own` row. Go to step 1.
- **Ruling route** — a skill's close-out reported a third `open` row in `_ritual-friction.md` naming one
  ritual, or Victor called the ruling early. Go to step 6.

**One refinement per session, hard cap** (`_session-rules.md`, the section above). If a refinement has
already run this session, stop and say so: the crossing stays `open` and is picked up next session. This
is a gate, not a failure — no `FRIC` row.

**Never refine on the run that wrote the evidence's last row when that row names `skill-refine` itself.**
A row naming this skill is `Scope: own` and is fixed like any other, but never by the invocation that
recorded it — the same reason `_pipeline-self-report.md` gives for refining at the end and not the
start: a human has to sit between the edit and its next use.

## 1 — Breach route: resolve, then test the bar

1a. Read `_skill-breach-log.md`. Resolve the target skill and the exact `Breached step` string that
crossed. **Count by exact string match**, never by what the rows appear to be about.

1b. **Refuse and stop if any of these hold**, leaving every row `open`:

- `Scope` is `shared` — the step is written in a contract this skill merely executes, and
  `_session-rules.md` → "Who writes a standard or a shared contract" bars editing it from here. At two
  rows it goes to `_recommendation-ledger.md` as a `REC-NNN`; below two it stays `open`. Say which.
- One row only, and its defect is a **clearly stated rule breached anyway**. That is a discipline lapse,
  not a text defect, until a second row proves otherwise. Condition 2 decides this, not you.
- The rows carry no falsifiable `Evidence` clause.

1c. Read the target `SKILL.md` **end to end**, in `.claude/skills/`. State `N lines, read to EOF`. The
Read tool truncates past 2000 lines in silence, and every judgement below depends on having the whole
file — condition 4 in particular cannot be answered from an excerpt.

## 2 — Draft the edit

Draft against the section the `Breached step` names, and prefer **tightening an existing line to adding
a new one**. The defect decides the shape:

- **Silent** — the text never covered the case the run hit. The edit says what to do, in the step that
  should have said it.
- **Ambiguous** — the text covered it two ways. The edit removes one reading; it does not add a third.
- **Mis-placed** — the rule is stated, correctly, somewhere the run had no reason to look. **Move it; do
  not repeat it.** A rule stated twice is the defect that produced half this system's ledger.
- **Repeatedly breached though clear** (two rows) — treat as mis-placed or mis-worded by the count alone.

Do not apply anything yet.

## 3 — The gate: one cold reviewer, never your own judgement

Dispatch **one `reviewer`, `reasoning tier: deep`**, per `_agent-runtime-standard.md` — cold, so it gets
the target and the sources and none of your reasoning or your verdict. Five inputs, and the last is not
optional:

1. The finding as the rows state it.
2. The current section the edit targets.
3. The drafted replacement.
4. The scratch path it persists findings and verdict to as it works.
5. **The whole `SKILL.md`, to be read end to end.** Condition 4 asks whether the text already handles
   this somewhere the run failed to look, and no excerpt can answer that. A reviewer given slices
   approves near-duplicates and contradictions it had no way to see.

It returns one verdict — **approve / approve-with-tightening / reject** — answering: does the edit clear
all four bar conditions; is every fact in it correct; is this already stated elsewhere in the file, or
does it contradict something there; can the same fix be made by tightening an existing line; and does
applying it make any now-stale text removable.

**Its return must open with `N lines, read to EOF` for the `SKILL.md`.** Without that line you cannot
tell a whole-file judgement from a skim — treat the verdict as a reject. If it rejects, or cannot be
dispatched as `_agent-runtime-standard.md` defines that (a death is not a failed dispatch until its
ladder is exhausted), the rows stay `open`. **The tie always goes to `open`.** A postponed finding is
recoverable from its `Disposition`; a self-approved bad edit is not.

## 4 — Apply, and pay the budget

4a. Apply **only what was approved, in the form it was approved**, to `.claude/skills/{name}/SKILL.md`
**and** `.agents/skills/{name}/SKILL.md`. The mirror invariant is not a follow-up task: both files are
written before anything is staged, and `diff` proves it.

4b. **The growth brake.** `_system-map.md` §13 measures `Declared steps · contract size` per block, and
that is the skills' health budget — the prompts' `~500 lines` proxy has no skill equivalent, but the
instrument does. Recount the edited skill's block cell and write it. **If the edit made the file longer,
the reviewer must have named what comes out** — a stale caveat, a duplicated instruction, a spent
incident. One-in-one-out above the line, exactly as `_pipeline-self-report.md` sets it. A bucket that
only fills is how a ritual stops being executable.

4c. Invoke `map-sync` (trigger: a change) for the rows this edit moves. Its verdict rides in this same
commit, `maps unaffected` included.

## 5 — Dispositions, commit, report

5a. Set `Disposition` to `fixed in <hash>` on every row that fed the edit. Rows are otherwise immutable.

5b. One commit, fixed prefix so the whole loop is auditable and reversible by one grep:

```
refactor(skills): auto-refine {skill} — {breached step}
```

It stages both mirrors, `_skill-breach-log.md`, and whatever `map-sync` touched. Run `git status`
immediately before staging and immediately before committing; unstage anything else. **If either mirror
or the map cannot be written, commit nothing** — leave the rows `open` and report it. A half-applied
refinement is worse than none: it puts the two adapters out of sync, which nothing announces.

5c. Record the gate in the report, one line: `cold reviewer: approve | approve-with-tightening | reject`.
It is the only trace the gate ran at all. An applied edit with no such line is indistinguishable on disk
from a self-approval, and a later reader must treat it as one.

## 6 — Ruling route: `REC-054` (c), bounded by its own verdict

The input is the `open` rows of `_ritual-friction.md` naming one ritual, and nothing else — not a fresh
measurement pass, which is what `REC-070` (b) was and why that row is gone.

**First, scope.** If the named ritual is a **prompt** or a step of the daily loop, this skill does not
rule: report it and route it to that prompt's own refinement path. Automatic rulings reach skills only.

Rule on the **ritual**, never on a row, and take one of three verdicts:

| Verdict | What it licenses |
|---|---|
| `kept` | Write `ruled YYYY-MM-DD — kept` to **every** row naming that ritual at once. No edit. |
| `thinned` | Cut the step that costs and does not give. It is an edit like any other: steps 2–5 in full, cold reviewer included, both mirrors, `map-sync`, §13 recounted. `Status` becomes `ruled YYYY-MM-DD — thinned: {what was cut}` on every row naming it. |
| `deleted` | **Stop and report.** Removing a ritual outright is what `REC-054` reserves, and it stays Victor's. Rows stay `open`. |

**What is not being judged.** The rows record what Victor observed; whether the complaint is justified is
not reopened here, and no reviewer is ever dispatched to decide that — `REC-054` (b). The reviewer in a
`thinned` ruling judges the drafted edit, which is the act (c) was always licensed to perform.

## Report back

Four lines at most. No preamble.

```
skill-refine · {skill} · {breached step}
cold reviewer: approve-with-tightening
aplicado en los dos adaptadores · §13 recontada · maps unaffected
SBRC-0003, SBRC-0007 → fixed in a1b2c3d4
desvíos: ninguno
```

A run that refused states the reason in one line instead — the failed bar condition, the `shared` scope,
the session cap, or the reject — and says the rows stay `open`. The `desvíos:` line is printed on every
route, including a refusal.
