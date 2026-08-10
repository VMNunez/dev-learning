---
name: map-sync
description: >
  Keep `notes/prompts/README.md` and `_internal/_system-map.md` true, on BOTH of their triggers.
  **Trigger 1 — a change:** any edit to the machinery, the moment it lands — a prompt or `SKILL.md`
  written, changed or retired, a ledger item applied, a ritual's steps moved, a writer reassigned, a
  gate added. **Trigger 2 — a whole read:** any prompt, `SKILL.md`, standard or other `_internal/` file
  read end to end, in any session, for any reason, which is the only thing that catches the cell that was
  true the day it was written and rotted with nothing being edited. The maps are hand-written and nothing
  regenerates them, so the failure mode this exists for is a map that is confidently wrong — read
  *instead of* the file it describes. Partial compliance is the specific defect: §7 gets updated and the
  §9 row, the chain step and the §11 symptom row keep the old story. It rules only on the rows about the
  file in front of it — never a chain's order, §8's ownership or §1's properties, **except where the file
  read positively contradicts one** — and it never edits a prompt to match a map. **A read of any
  depth fires it on a positive contradiction; only a whole read fires it on an absence.** Do NOT trigger
  on edits to project code, notes prose or `PLANNING.md`, or inside a prompt pipeline run — those carry
  both map tests in their own self-report contract.
---

# Map sync — the two maps follow the machinery

**Shared failure close-out.** The write counts below describe successful and expected no-op or
ineligibility paths. If this invoked ritual cannot complete a declared step, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill cannot finish — durable friction"; do not
restate or widen that trigger here.


`notes/prompts/README.md` (the catalogue) and `notes/prompts/_internal/_system-map.md` (the wiring)
describe the system from the outside, and **nothing regenerates them**. `_session-rules.md` → "The two
maps follow every change to the machinery" and "The map is also verified on read, not only on write" are
the source of truth; this ritual is the walk, so that compliance is not partial.

**Both maps are derived. The machinery always wins.** A disagreement is the map's bug, every time. Never
edit a prompt or a skill to match what a map says, and never reconcile the two into a third thing
neither of them claimed. Fix the machinery first, then describe it.

## 0 — Which trigger fired

They license different scopes, so name the trigger out loud before touching anything.

- **A change** — something in the machinery was just edited. Go to step 1. The map edit lands **in the
  same commit as the change**, so this runs *before* that commit, not after it.
- **A whole read** — a prompt, `SKILL.md`, standard or other `_internal/` file was read end to end for
  some other reason. Go to step 2, whose table licenses all three kinds. The correction lands in **its
  own commit**, never folded into the work that found it.

**A read of any depth rules on a contradiction; only a whole read rules on an absence.** If the section
in front of you says the prompt writes a file the map does not list, the map is wrong and you fix it — a
positive contradiction survives any slice, **including against §8 and §1**, which a whole read may not
touch. Not having *seen* the write is evidence of nothing: an absence is a finding only after a read to
EOF, and only inside the rows step 2 licenses.

## 1 — Change path: run the test, then walk the rows

**The test is one question:** *did this change what a file contains, who writes it, when something runs,
or which prompts and skills exist?*

**No → say `maps unaffected` out loud**, in the same breath as reporting the change, and stop. A silent
skip and a genuine no-op are indistinguishable afterwards, and only one of the two is fine.

**Yes → which map:**

| What changed | Which map |
|---|---|
| a prompt added, renamed or retired; its reads/generates; batch mode; run order; launcher parity | `README.md` |
| a skill's trigger, what it writes, or what it hands off to · a file gaining or losing a writer · a chain's order · a gate · a new debt or flag | `_system-map.md` |
| a new prompt or a new skill · a ritual moving between the two · anything that changes both a prompt's outputs and who consumes them | **both** |

**Then walk every row that mentions the thing you changed — not the first one you think of.** This is
the whole reason the ritual exists: a skill lives in `_system-map.md` §9 *and* §7 *and* possibly a chain
step in §3–§6, a §10 debt and a §11 symptom row. Updating §7 and leaving §9 telling the old story is the
common failure, and it is worse than not updating at all, because the map now contradicts itself and a
reader has no way to tell which half is current.

Grep the name across both maps and account for every hit:

```
rg -n "skill-or-prompt-name" notes/prompts/README.md notes/prompts/_internal/_system-map.md
```

**A new skill or prompt also changes the counts.** `_system-map.md` §9 opens with a literal number of
skills, `README.md` states the runnable-prompt count and the launcher parity in several places, and both
go stale the moment one is added or retired. A new runnable prompt additionally needs its launcher in
**both** `.claude/commands/` and `.codex/commands/`, in the same commit.

## 2 — Read path: verify the rows about that file, and nothing past it

Reading the file end to end is the entire cost of verifying what the maps claim about it, and by the
time this fires it is already paid for. What is left is one comparison.

| Read whole | May rule on |
|---|---|
| `{name}-prompt.md` | §7 `Written by` / `Read by` for every file it touches · its step in §3–§6 · its §10 debt · its §11 symptom row · **and in `README.md`**, its catalogue row's *reads* / *generates* cells and its prerequisite as "How the prompts feed each other" states it. **Not §9** — that section is skills only |
| a `SKILL.md` | its §9 row end to end (fires when · what it writes · hands off to) · its cells in §7. **Not a chain step, not a §10 debt, not a §11 row** |
| a standard or other `_internal/` file | the §7 row for the file it governs, **only where the standard states that ownership itself** (the way `notes-plan-{LEVEL}.md` is declared `/notes-plan`'s alone) — never the writer *list*, which names five writers for some files and is therefore a claim about all of them |

**Never the rest of the map.** A chain's *order*, §8's `PROGRESS.md` ownership section by section, and
§1's two-engine properties are claims about several files at once, and one file cannot falsify them.
Finding those wrong is a sweep's job, not this one's — leave them and say so.

**Check the cell against what the file actually does, not against what its own summary claims.** A
prompt's header and its steps disagree often enough that the header is not evidence.

## 3 — Commits

- **Change path** — the map edit rides in the **same commit as the change**. Not a follow-up, not a note
  for later: the commit that changes the behaviour is the only moment the correct wording is known, and
  a map update deferred to "the next session" is the one that never happens.
- **Read path** — **its own commit**, never folded into the work that found it. A map fix buried inside a
  ledger item's commit hides both, and makes the item look more expensive than it was. Message names the
  falsified claim, not the file: *what the row said, and what the machinery does*.

Both maps are under the standing `notes/prompts/` authorization, so commit them directly. `git status`
immediately before the `add` and before the `commit`, so nothing else is staged alongside.

## 4 — Report back

Always close with the verdict, in this vocabulary — it is what makes a skip visible afterwards:

- `maps unaffected` — the change did not pass the test.
- `map: verified — {rows}` — checked against what was read, and correct.
- `map: corrected — {row}` — fixed, with the commit.
- `map: not verified — partial read` — the honest default, and not a failure.

| Target | Result |
|---|---|
| Trigger | whole read of `.claude/skills/step-complete/SKILL.md` |
| Rows checked | `_system-map.md` §9 row, §7 `PLANNING.md` + `PROGRESS.md` rows |
| Verdict | `map: corrected` — §9 said `PROGRESS.md` Projects row; the skill also writes the `Professional level by topic` evidence cell |
| Out of scope | §8's ownership table — not falsifiable from one skill |
| Commit | `<hash>` |

## What this ritual cannot do

**It never sweeps.** It only ever reaches the files a session happened to open or edit, so rows about
prompts nobody runs stay unverified — and it cannot tell you which ones those are. `/system-check` is the
separate explicit sweep: Victor launches it after substantial machinery changes, never per commit or as
an automatic extension of this ritual. `REC-054` remains the different question of whether the
machinery adds up to a workable day — a verdict that accrues from use, never a scheduled review. A local `map: verified` still means only the licensed rows
were checked; it is never a freshness guarantee for the whole map.

**It never blocks.** A verification that stops the work stops being run — the zero-questions rule every
skill is built on, applied to the maps. A row you cannot rule on is reported and left alone.
