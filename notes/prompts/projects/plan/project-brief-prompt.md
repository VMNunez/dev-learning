# Project brief prompt — choose the next project, on one page

Choose which project Victor builds next, and record **why** — the chosen project, the gaps it closes
with their coverage bullets, the two concept lists, the alternatives rejected with reasons, the scope
ceiling, and the gaps deliberately left for the project after it. One page, dated, contestable.

This is the single decision worth more than the 24-section plan it produces: it directs a month of
study. Before this prompt existed it was made once, uncontested, inside the plan author's own context,
and the only surviving trace was a candidate line in `ROADMAP.md` marked `← selected`.

**Division of labour:** `ROADMAP.md` **proposes** — living, forward-looking, non-binding. This brief
**decides** — dated, fingerprinted, and open to a cold second opinion. `PLANNING.md` **builds**. Each
one is allowed to be wrong in its own way, and the next one catches it.

It writes exactly one file. It never edits `ROADMAP.md`, `PROGRESS.md`, or any plan: registering the
choice in the hub files is the plan's job, and happens when the plan is written.

> **▶ Run first:** `progress-update` — the brief reads which projects are done and which coverage
> bullets carry an evidence marker; a stale `PROGRESS.md` picks the wrong next project and every later
> step inherits the error.

## Configuration

```text
NUMBER    = [blank — resolves to the next number above the highest existing projects/ folder]
CANDIDATE = [blank — auto-selects | a candidate name, to force one and still justify it]
```

One execution decides exactly one project. `NUMBER = all` is unsupported.

## Runtime contract

Before dispatching any role, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Use its canonical roles and reasoning tiers. The second opinion in Step 5 is a **cold** `reviewer`:
it receives the brief, the sources, and the acceptance format — never this run's reasoning.

## Paths

- `BRIEF = projects/briefs/project-brief-{NUMBER}.md` — the output, and the only file this run writes
- `COVERAGE = notes/coverage/junior.md` — the global junior mirror: the target, and the marker state
- `PROGRESS = PROGRESS.md` → three parts only: the `## Projects` table, `Professional level by topic`,
  and `Coverage demonstrated` (including the paragraph under it about which projects are backfilled).
  **Never a per-technology concept list** — those were deleted on 2026-08-03 and PROGRESS is a status
  instrument now, not an inventory
- `ROADMAP = ROADMAP.md` → the candidate ideas section, the phase table, and the gate list
- `PROJECTS = projects/README.md` — the published projects and their domains, for the variety criterion
- `CONTEXT = notes/prompts/_internal/_shared-context.md`
- `EVIDENCE = notes/prompts/_internal/_job-market-evidence.md`
- `MARKER_STANDARD = notes/prompts/knowledge/coverage/_internal/_coverage-standard.md` → "Evidence
  markers" and its canonical digest command

`BRIEF` is a committed source of truth, read later by `notes/prompts/projects/plan/plan-audit.md` in
`MODE = new`. It is not a scratch note.

## Guards

0. **Run-start check.** Execute the check in `notes/prompts/_internal/_pipeline-self-report.md` — read
   `notes/prompts/projects/plan/_internal/_last-run-report-project-brief.md` (it may not exist yet;
   skip silently) and, if its `Status:` line says `open`, surface the finding in **one line** and
   continue. Never apply it here.
1. **Branch guard.** Run `git branch --show-current`. Study materials commit on whatever branch is
   active; if you are on `main`, stop and ask which branch to use.
2. **Resolve `NUMBER`.** List `projects/` and take the next number **above the highest existing
   folder** — never "last completed + 1", because the project in flight is normally still open and the
   completed count is one behind it.
3. **An existing brief is not overwritten silently.** If `BRIEF` exists, read it and its `Status:`
   line. `current` and still fresh (Step 4's freshness block) → report that and stop: the decision is
   made, re-deciding it is what the second opinion is for. Stale, `superseded`, or missing either
   header field (`Coverage read:` / `Coverage SHA-256`) → rewrite it, and say in the report what
   changed in the inputs since. A fresh brief a consumer rejected as defective must be rewritable here,
   or the two prompts refuse each other and the run cannot recover.
4. **`PROGRESS` freshness.** Cross-check its `## Projects` table against `projects/` and the recent git
   history. A finished project not recorded, or a step done in code and not in the table, means
   **stop and report** "run `progress-update` first" rather than deciding on bad data.
5. Read `COVERAGE` to the real end. It is the largest file in this pipeline (over 2000 lines) and the
   Read tool truncates past 2000 silently: check `wc -l` first and read in passes with `offset`. A
   truncated read drops whole topics from the gap analysis with no error and a plausible result.
6. Preserve unrelated working-tree changes.

---

## Step 1 — What an unmarked bullet means

The gap analysis keys on the **evidence markers** in `COVERAGE`, defined in `MARKER_STANDARD`. Read
that section before Step 2; the three rules below are the ones this prompt lives or dies by.

1. **Key on the project marker `✅ NN-slug` only**, in either form — pre-2026-08-01 markers carry no
   ` — {evidence}` clause and count the same. It means Victor wrote code that uses the concept in that
   project. A bullet with **no** project marker is a candidate **new** concept; a bullet carrying one is
   a candidate **review** concept, and its `NN-slug` is where "Originally demonstrated in" comes from at
   no extra cost.
2. **A drill marker is not a project marker.** A bullet whose only marker is `✅ sql:{file-slug}` was
   drilled in graded exercises, not built. It is still a new concept for a project, and saying so is
   the point of the two markers being separate.
3. **Markers record demonstration, never study.** An unmarked bullet means *not yet demonstrated*, not
   *not yet studied* — Victor may know it well from `notes/`. That is why the plan's §3 is "first
   **demonstrated** in this project" and its §4 column is "Originally **demonstrated** in": both
   statements are falsifiable against a marker, where "first learned" never was.

**The dated exception — the 07 Angular tier.** `PROGRESS`'s `Coverage demonstrated` paragraph records
which projects have been backfilled with markers. While it still says the **Angular tier of project 07
is not backfilled**, an unmarked `Angular` or `Angular Material` bullet that project 07's frontend
already touches is *not* evidence of a gap — it is evidence of a missing marker. For those two topics
only, check the claim against `projects/07-timetrack/PLANNING.md` §13/§15 and the frontend source
before listing a bullet as a gap, and say in the report that the exception was applied and to how many
bullets. **Re-read that paragraph every run**: the exception dies the day the backfill lands, and a
brief that keeps applying it afterwards under-counts Angular gaps permanently.

## Step 2 — The gap analysis

Walk `COVERAGE` topic by topic and build the unmarked set. Then filter it to what a project can
actually close:

**Keep** a bullet that: lives in the Angular, Angular Material, Spring, Spring Boot, Java,
Architecture, Security, TypeScript or SQL sections; is plausible in a junior interview at NTT Data,
Capgemini or Indra (use `EVIDENCE` for what postings actually ask, `CONTEXT` for the target); and can
be taught by building something in 2–4 weeks at 4 hours a day.

**Drop** a bullet that is: post-junior in practice (CQRS, microservices, Kubernetes, JVM tuning,
zone.js internals) — never pull middle or senior material forward to make a project look advanced; or
theory-only, with nothing a project could demonstrate.

Read `Professional level by topic` before ranking what is left. Prefer gaps whose `Next gate` asks for
project-based or unaided practical evidence, and gaps in the topics that drive the target role.

Then build the two lists the plan's §3 and §4 consume:

- **New concepts** — unmarked bullets this project will demonstrate for the first time.
- **Review concepts** — already-marked bullets worth reinforcing: learned once and not used since, or
  interview-critical enough that repetition pays (JWT flow, soft delete, coordinator pattern). Take
  "Originally demonstrated in" from each bullet's own marker. Limit to 8–12.

## Step 3 — Choose the project

Read the candidate ideas in `ROADMAP`. For each candidate, count how many of the significant Step-2
gaps it closes. Choose the one that:

1. Covers the most significant gaps from Step 2.
2. Is realistic in 2–4 weeks of full-time study (4 hours/day).
3. Is full-stack: Spring Boot + Angular + PostgreSQL (mandatory).
4. Has a domain a recruiter at NTT Data or Capgemini would immediately recognise as real enterprise
   work, not a toy app.
5. Includes meaningful business rules — not just CRUD.
6. Introduces at least one JPA relationship or pattern not already practiced in the previous project.
7. **Differs in domain from every published project** (`PROJECTS` is the list). A recruiter scanning
   the repo should see variety, not three versions of the same app. If the strongest gap-covering
   candidate shares a domain with a published one, prefer the next-best candidate that closes
   comparable gaps in a fresh domain — or justify the overlap explicitly.

If no candidate covers the important gaps well, propose a new one and say why it fits better; it must
still meet all seven. If `{CANDIDATE}` is set, use it — and still run the full justification, since a
forced choice is exactly the one whose reasons need recording.

**Every candidate you did not choose gets a row in the brief**, with the gaps it would have closed and
the reason it lost. That table is what stops the next brief re-litigating a settled question from
memory, and what lets Victor overturn the decision on evidence rather than on vibes.

## Step 4 — Write the brief

Write `BRIEF`, creating `projects/briefs/` if it does not exist. Exactly this shape:

```markdown
# Project {NUMBER} brief — {Project name}

Status: current | contested | superseded by {path}
Decided: YYYY-MM-DD
Coverage: notes/coverage/junior.md
Coverage read: {n} lines, read to EOF
Coverage SHA-256: <64 lowercase hexadecimal characters>
Project markers counted: {n}
Last completed project: {NN-slug}
Highest existing project folder: {NN-slug}
Angular backfill exception: applied to {n} bullets | not applicable (backfill complete)
Second opinion: <verdict> — YYYY-MM-DD

## The decision
One paragraph: what the app is, why this project over the others, and what it adds that the previous
project does not — the plan's §2 has no other source for its fourth bullet.

## Gaps this project closes
| Coverage bullet (verbatim) | Topic · section | Marker state | Where the project demonstrates it |

## New concepts — §3 input
| Concept | Topic | Why this project teaches it |
`Topic` is the plan standard's §3 controlled vocabulary — the `notes/` topic folder that owns the
bullet, never free text.

## Review concepts — §4 input
| Concept | Originally demonstrated in | How this project uses it again |

## Alternatives rejected
| Candidate | Gaps it would have closed | Why not this one, now |

## Scope ceiling
What this project deliberately does not include, and why. Anything the plan adds past this line is
scope the brief did not buy.

## Gaps left for the next brief
The significant bullets, verbatim, still unmarked after this project — the starting input for
project {NUMBER+1}'s brief.
```

**The verbatim bullets are a contract, not a courtesy.** `plan-audit`'s author consumes this file
*instead of* opening the 2094-line coverage mirror, so a brief that paraphrases its gaps or names them
by topic forces that file back open and the split buys nothing. Copy each bullet's concept sentence
exactly as it stands in `COVERAGE`, minus its markers, which belong in the `Marker state` column.

**Freshness — the device `notes-plan-{LEVEL}.md` uses, plus a second grade the marker state needs.**
Compute `Coverage SHA-256` over `COVERAGE`'s **scope bytes** with the canonical command in
`MARKER_STANDARD` ("Markers are excluded from the coverage digest"). Count project markers with
`grep -cE ' ✅ [0-9]{2}-[a-z0-9-]+' notes/coverage/junior.md`. That second field is what `notes-plan`
has no equivalent of, and it exists because the digest deliberately cannot see the very thing this
brief is built from. A consumer then reads staleness in two grades:

- **Hard stale — the brief is refused.** The stored digest no longer matches (the curriculum itself
  moved), or a different project is now the highest existing folder / last completed one. The decision
  was made against a repo that no longer exists; re-run this prompt.
- **Soft stale — recorded, and the run continues.** Only the marker count moved: work landed and
  marked bullets since the brief was written, so some listed gaps may already be demonstrated. Name
  the delta and re-check the specific bullets being consumed, rather than throwing the decision away —
  a brief written deliberately ahead of time ages this way by design, and refusing it would make
  thinking ahead impossible.

When this brief supersedes an earlier one for the same number, set the old file's `Status:` to
`superseded by {path}` instead of deleting it. The rejected reasoning is the evidence a later reader
needs to know whether the second choice was better.

## Step 5 — The cold second opinion

One page is cheap to contest; 24 sections are not. That asymmetry is the reason this step exists here
and not after the plan is written.

Dispatch **one cold `reviewer` subagent, `reasoning tier: deep`, `execution: foreground`**, with the
brief, `ROADMAP`'s candidate section, `PROGRESS`'s level matrix and `Coverage demonstrated` table, and
`PROJECTS`. Do not pass your reasoning or your confidence — the file has to stand on its own.

Its task, and nothing else:

> Read the brief end to end and open your report with `N lines, read to EOF`. Verify the gap table
> against `notes/coverage/junior.md` — for the topics the brief claims to close, confirm each bullet is
> quoted verbatim and genuinely unmarked (count with
> `grep -c` rather than reading the file whole; read whole only the sections in question). Then answer
> one question: **is this the best next project for Victor's junior hiring target, on this evidence?**
> Return exactly one verdict — `endorse` · `endorse-with-scope-change` · `wrong project` — with, for
> the second, the specific scope lines to change, and for the third, the candidate you would choose
> and the gaps that decide it.

Then:

- **`endorse`** — record the verdict in the header and commit.
- **`endorse-with-scope-change`** — apply the named changes to `## Scope ceiling` (and to the gap
  table where a scope change removes a gap), record the verdict, and commit. Do not widen scope beyond
  what the reviewer named.
- **`wrong project`** — **do not commit a decision two cold judgements disagree on.** Leave the brief
  in the working tree, print both cases side by side — chosen candidate versus the reviewer's, with the
  gaps that separate them — and stop. Set the file's `Status:` to `contested` before you leave it, so
  no later run can pick it up as a decision.

A reviewer report without its `N lines, read to EOF` line is treated as a skim: re-dispatch once
quoting what was missing, and if it fails again, record the gap and treat the verdict as absent —
which blocks the commit exactly as `wrong project` does.

## Step 6 — Commit

`BRIEF` is written only by this prompt and never by Victor, so it commits directly under the
authorship boundary in `notes/prompts/_internal/_session-rules.md`. Run `git status` before the add
and again before the commit, stage the one file, and confirm nothing else rode along:

```
git add projects/briefs/project-brief-{NUMBER}.md
git commit -m "docs: project {NUMBER} brief — {project name} closes {main gap}"
```

Nothing else is committed here. `ROADMAP.md` and `PROGRESS.md` are registered by `plan-audit` when the
plan lands, and `roadmap-review` resyncs ROADMAP's candidate list at the project's G8 gate.

## Report

Print, in this order: the project chosen and the one-line reason · the counts (gaps closed · new
concepts · review concepts · candidates rejected) · whether the Angular backfill exception applied and
to how many bullets · the second opinion's verdict and what it changed · the brief's path and the
commit hash, or the reason nothing was committed.

## Final step — pipeline self-report

Read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this run: write
`notes/prompts/projects/plan/_internal/_last-run-report-project-brief.md`, update the
`project-brief` cell of the chosen project's row in `notes/prompts/_internal/_run-tracker.md`, commit
the two together, and print the five bullets.
