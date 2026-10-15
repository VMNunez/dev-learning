# System-check reconciliation — one file, or one cross-flow cluster

**Internal component. Not runnable.** `system/system-check-prompt.md` Step 2 dispatches one cold
`analyst` per concern with this file as its mandate: one inventory file of the flow, one paired skill,
the flow's launcher pairs together, or — on `FLOW = cross` — one cluster. You author, edit and commit
nothing. Every return is cited evidence the orchestrator gates and a cold final reviewer re-checks.

**What you rule on, and why it is cut this way.** The global method this replaced ruled every map line
against a census of the whole machinery and never finished (`REC-109`, `REC-245`). The licence below is
`_session-rules.md` → "What a read licenses a ruling on" — the rows a whole read of one file can falsify
— applied to this audit, narrowed for skills (§13 goes whole to the `day` cluster) and extended to three
kinds that table does not cover: the validator, launcher pairs and `cross` clusters. You read your file
and rule on the rows **about it**, nothing wider. What no single file can settle
is a `cross` cluster's.

## Boundary

- **Machinery only** — `system-check-prompt.md`'s `Boundaries` owns this fence and this is its dispatch
  copy, carried here because a cold concern will not follow a pointer. Do not open the active project's
  `PLANNING.md`, `PROJECT-BACKLOG.md` or `PROGRESS.md`, SQL doctrine or routes, coverage or notes-plan
  state, practice trackers, simulation specs, application/job-search state, or their debt counts — not
  even for orientation, and not even when your file names one as its own input or output. A path
  pattern, schema, ownership rule or gate **declared** by a prompt or skill is in scope as machinery; the
  live artifact governed by it is not.
- **You edit nothing** — not the maps, not a prompt, skill, standard, launcher or report. You propose
  wording; the orchestrator applies only what the final reviewer approves.
- **The machinery wins.** A disagreement between a map and its source is the map's bug. Never propose
  correcting a source to make a map look right.
- **Whole-file reads are declared.** Count lines first, read to the real EOF, and open your return with
  one `N lines, read to EOF` line per file you read whole. A read can stop short of a file's end at any
  line count — cut at the end or in the middle, by the tool's line limit or by the size of what one
  call returns, and not always with an error — so check that what each read returned runs unbroken to
  that count's last line, and read on in bounded passes until every line has been returned.

## Received input

`KIND`, both map paths (`notes/prompts/README.md`, `notes/prompts/_internal/_system-map.md`), `OUT` (your
own scratch return path) and the boundary repeated. Then `PATH` for a file concern, the flow's launcher
pairs for `KIND = launchers`, or the cluster's name for `KIND = cross`.

## The licence, by kind

| `KIND` | Rows you rule on |
|---|---|
| `prompt` (a runnable prompt) | `_system-map.md`: the §7 `Written by` / `Read by` cells for every file the prompt reads or writes, its own step in §3–§6, its §10 debt, its §11 symptom row. `README.md`: its family-catalogue row's *reads* / *generates* cells, its prerequisite as "How the prompts feed each other" states it, and its whole "Public interface index" row. Not §9 |
| `component` (a family-internal prompt, SQL branch or seed file, or `validate-practice-plan.py`) | the §7 row of a file it states it writes, **only where it states that ownership itself**, and within that same fence its own `README.md` catalogue row — what the component itself states it reads, writes and is read by |
| `standard` (a standard, rationale, `_topic-ownership.md`, or a root contract) | the §7 row for the file it governs, **only where it states that ownership itself** — never the writer *list*, which names several writers for some files and is a claim about all of them — and, within that same fence, its own `README.md` catalogue row |
| `validator` | its §7 row, and in `README.md` → "Platform adapters" every paragraph describing what the script checks, skips or reports, the `-MachineryOnly` paragraph included |
| `skill` | its `_system-map.md` §9 row **column by column**, its cells in §7, and every `README.md` → "The five hub files" `Written by` cell that names it, scope parenthetical included. **Not §13** — this audit gives §13 whole to the `day` cluster, so its counts are measured once for every row — and not a chain step, a §10 debt or a §11 row |
| `launchers` | each pair's `README.md` → "Public interface index" `Command → canonical prompt` cell, and the launcher pair itself: both files name the same canonical prompt, the command is the filename, and the `Rules` points at the prompt's commit or gate rule without restating it (`_session-rules.md` → "A launcher points at a commit or gate rule") |
| `cross` | the cluster's row in `system-check-prompt.md` → "The flows", and nothing else |

**A positive contradiction is ruled wherever you see it; an absence only inside your licence.** If a map
row outside your licence states something your file positively contradicts, rule it `incorrect` — a
contradiction survives any slice. A claim the map **omits** is a finding only in a row your licence names,
and only after your whole read.

**Read the fences before ruling any absence.** Four sites say that an absence in them is delegation, not a
defect, and each states its own exceptions: the "Public interface index" `Run-first / handoff / explicit
boundary` column (`README.md`, the paragraph opening "But an absence in the `handoff`"); the `Reads`
column of the five family catalogues (`README.md` → "The prompts — what each one reads and generates",
its two opening paragraphs); and §9's `Handoffs, gates + explicit exclusions` and `Primary reads` cells
(`_system-map.md`, the two paragraphs above its table). An absence a fence covers is `fenced`, citing the
fence.

## Steps — a file concern

1. Count `PATH`'s lines, read it to EOF, and declare it. For a skill, read the `.claude/skills/` copy.
2. List the facts your licence's rows own, each with its source line: for a prompt every configuration
   key, prerequisite, dispatched role, read, write, commit owner, gate and exclusion; for a skill its
   trigger, received input, reads, writes/returns, commit owner and isolation, handoffs and exclusions;
   for a component or standard what it states it is read by, reads, writes and owns.
3. Find every row your licence names: `grep -n` both maps for the file's name, its command (`/name`) and
   bare name, and for every path in step 2's reads and writes; open each hit with enough context to read
   the whole row or paragraph.
4. Rule every licensed cell — and every row outside the licence your file positively contradicts — with
   one disposition. **A rule the other map owns, restated in a cell instead of linked, is `incorrect`**,
   with a link to its owner as the proposed wording (`REC-064` — a rule restated is a rule forked).
   **A cell asserting exclusivity, completeness or a count over several files** — "only", "every",
   "never", a writer list called exhaustive — is ruled by you for your own file's membership alone (is
   your file in it, and should it be); whether the whole set is right is the `catalogue` cluster's, so
   say `whole-population half: catalogue` beside your disposition.

## Steps — a `cross` cluster

1. Read both maps to EOF and declare them; rule only the content your cluster names.
2. Split that content into atomic claims, one fact each, cited by map and line.
3. Settle each claim from source: open to EOF, and declare, every inventory file a claim names; settle a
   count, exclusivity or completeness claim — "only", "every", "never", a total — over the whole
   inventory by grep, state the command, and list every file it matched as opened. A claim settled
   wholly or partly by an **absence** of matches — every count, exclusivity or completeness claim — is
   marked `path-set-level` in your row, since no file list can hold it. On the `day` cluster, re-measure every `Declared steps ·
   contract size` cell in one pass by the rule §13 states under its table, and report each row's old and
   new value.
4. Rule every claim with one disposition, ruling a restated rule the other map owns `incorrect` exactly
   as a file concern does.

## Dispositions

- `correct` — the source positively supports the cell as written.
- `incorrect` — the source contradicts it. Quote the source line and give the exact replacement wording,
  no broader than that line proves, and name every other occurrence of the claim you saw.
- `missing` — a fact your licence's row owes is absent. Name the map, the row and the wording it would
  take, and quote the source line.
- `fenced` — an absence a fence covers. Cite the fence.
- `source-contradiction` — your file states two mutually exclusive clauses, so no wording can be true.
  Quote both, with their lines, and name the file. It is a machinery defect for the ledger, never a map
  correction.

## Return contract

- Open with your `N lines, read to EOF` declarations.
- **Write every row to `OUT` as you reach it**, never holding the return in context to the end: a role
  that dies mid-flight is read from its scratch path (`_agent-runtime-standard.md`).
- One row per ruled cell: `map · section or row · column · disposition · source line · proposed wording`.
  For `incorrect`, `missing` and `source-contradiction`, `source line` is the source's own words in
  quotation marks beside their line number: a line number or a paraphrase alone fails the
  orchestrator's acceptance gate.
- Close with the counts: rows ruled, then per disposition.
- End with the line the orchestrator gates on: `concern complete — <PATH or cluster> · <counts>`, or
  `concern incomplete — <what is missing>`. An incomplete return is re-dispatched cold and never merged in
  part.
