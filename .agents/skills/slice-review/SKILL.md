---
name: slice-review
description: >
  Run a cold code review of exactly the slices a finished piece of project work touched — invoked by
  `step-complete` after it closes a §15 step and by `backlog-task-close` after it closes a code task, and
  directly when Victor asks ("revisa en frío lo que he tocado", "pásale el review al step", "cold review
  this fix"). It maps the work's diff onto `review-audit`'s vertical slices and dispatches, cold, the two
  per-slice reviewers already on disk — `_review-flow-prompt.md` on every touched slice but `security-infra`,
  and `_review-security-prompt.md` on every touched backend resource and on `security-infra` — then verifies each finding against the
  code and writes the survivors to `PROJECT-BACKLOG.md` as tasks. The failure mode this exists for is code
  built between two gates that no cold reviewer ever reads: the in-session check is made by the agent that
  guided the code, and `review-audit` runs only at G3/G4 — `REC-244` measured backlog-fix code that sat
  unread for six weeks. It never blocks the close that called it, never moves a `Last Reviewed` line,
  never shortens a gate run and never fixes what it finds. Do NOT use it as a gate review (that is
  `review-audit`), on a notes or machinery change, or on a close that changed no project code.
---

# Cold slice review (daily session)

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


A step or a backlog fix just closed, and its code has been read by nobody but the agent that guided it.
This ritual hands that code — and only that code — to the same cold reviewers `review-audit` uses at
the gates, so the defects are found a few at a time as each piece lands instead of piling up for the
gate. It asks nothing and blocks nothing: a finding becomes a task, and the next `backlog-task-open`
triages it.

**It reuses; it never restates** (`REC-244`). The reviewers, the sections of
`notes/prompts/projects/review/_internal/_review-standard.md` they read, the slice map and the grading
rules are all `review-audit`'s, read here by pointer — with the two slice rules §1 adds, which
`review-audit` leaves to its orchestrator's judgement and this ritual has to fix in writing. A second
review standard would drift from the first, which is the whole reason this skill is thin.

**It is not a gate pass, and the double read is deliberate.** G3 and G4 stay whole: `review-audit` still
reads every slice of the tier at its gate, as the last pass over all the code. This ritual stamps no
`**Last Reviewed — «tier»:**` line and writes no `**Overall quality:**`, so the gate's two signals still
fire after it and a gate run is never shortened.

**Its cost is paid inside the daily block** — one cold dispatch per touched slice, two for a touched
backend resource. `REC-244` measured a frontend step at five dispatches, about 440k subagent tokens and
under three minutes in parallel. `REC-054` watches that cost; a complaint about it is a
`_ritual-friction.md` row, never a reason to skip a dispatch here.

## 0 — Resolve the diff

The caller hands over the range, and this ritual never re-derives it:

- **from `step-complete`** — the base its step 3 resolved, the last §15 close's commit;
- **from `backlog-task-close`** — the parent of the fix's first commit, or `HEAD` when Victor has not
  committed the fix yet; one run, from the earliest base, when several tasks closed together;
- **directly** — the range Victor names, or, when he names none, `step-complete` step 3's command for
  "since the last §15 close".

**The range is taken against the working tree, never against `HEAD` alone** — `git diff <base> --
{PROJECT_PATH}` plus `git ls-files --others --exclude-standard -- {PROJECT_PATH}` — because Victor's own
code commit may still be pending when the close reaches this ritual (the git commands come last), and a
`<base>..HEAD` range would then skip the very code it exists to read. Each caller hands over its `<base>`.

Keep only **project source and its configuration**: the files under `backend/**/src/`, `frontend/**/src/`,
and the configuration the flow prompt's slice table names (`application.properties`/`.yml`, `data.sql`,
`docker-compose.yml`). A range holding only `PLANNING.md`, READMEs, the backlog or notes
touched no code: say **"no code touched — n/a"** and stop, with no dispatch and no write.

## 1 — Map the touched files to slices

Map with **`notes/prompts/projects/review/review-audit.md` → "Step 0 — Gate and map the slices"**,
its slice rules and not a list of your own: a backend resource per controller family, the two backend
cross-cutting slices `persistence-config` and `security-infra`, one frontend slice per feature, and
`frontend-infra`. The files each slice owns are listed by the prompt that reviews it —
`_review-flow-prompt.md` → "Step 1 — Read only your slice", and for `security-infra`
`_review-security-prompt.md` → "If `{SCOPE}` is `security-infra`". Two additions those pointers do not
settle:

- **`src/styles*`** — the design-system files are their own frontend slice, `styles-theme`, as the
  2026-09-23 G4 run mapped them; `frontend-infra` would otherwise hold the whole of §14 beside the routes.
- **A file several slices own** — a shared DTO, a shared component — touches every slice that owns it.

A slice is **touched** when any file it owns is in the range; the reviewer then reads the **whole
slice**, not the hunk, because that is the unit its trace proves. A changed file no slice owns is named
in the report as unreviewed, never forced into a slice.

Derive the **unbuilt-step exclusion** exactly as `review-audit.md` Step 0 does — every §15 step not yet
`✅`, with one line on what it would produce — and hand it to every dispatch verbatim. The testing scope
needs nothing extra: the reviewers' own "Test-quality scope" restates `_session-rules.md` → "Testing
rules".

## 2 — Dispatch, cold

For each touched slice, dispatch one subagent per reviewer, in parallel, with the role, tier and
isolation `review-audit.md` gives that slice — its tier table, never re-chosen here — and the wording of
its Step 1, 2 or 3 dispatch:

- **`_review-flow-prompt.md`** on every touched slice except `security-infra`, which `review-audit`
  reviews for security only — `TIER` and `SCOPE` set to that slice;
- **`_review-security-prompt.md`** on every touched backend resource, and on `security-infra` when it is
  touched. Frontend slices get no security dispatch — the flow reviewer's frontend-security greps are
  that lens, as at the gates.

**Cold means cold** (`notes/prompts/_internal/_agent-runtime-standard.md` → "Dispatch contract"): pass the
reviewer prompt's path, its configuration, the exclusion list and a scratch path, and nothing else —
never the session's reasoning, the step's history, the backlog, or what you suspect is wrong. The agent
that guided the code is the one reader this ritual exists to replace.

**Check every trace** under `review-audit.md` → "Step 5"'s trace rule — a row per file read, with its
line count and its last real line. A reviewer whose trace fails gets **one** re-dispatch; one that fails
again leaves that slice **unreviewed**, said in the report and written as a `FRIC-NNNN` row under the
failure close-out above.

## 3 — Verify, deduplicate and grade

This ritual is the orchestrator of its own dispatches, so it owns the half of `review-audit.md` Step 5
that turns a slice table into tasks — and only that half:

1. **Read the lines each finding cites.** A finding the code does not show is dropped and named in the
   report.
2. **A claim about a run's outcome is raised only with that run's output.** A test or build said to
   fail, a spec said to fail at runtime, or anything said to be absent from a run is raised only when
   output already in hand proves it — the run evidence the step's done condition or the fix's
   verification produced in this session — and the task line then records that proof, as
   `backlog-task-close` → "Incidental findings — write them, do not mention them" requires (`REC-185`).
   This ritual runs no command to get it. Without that output the finding is listed in the report as
   **unverified — `{command}` settles it**, and not raised. A spec the cited lines themselves prove
   broken — it imports a deleted symbol, or asserts an element the template no longer has — is a quoted
   hit, graded under item 1. Both "broken spec" Mediums `REC-244`'s measurement produced were run claims
   the reviewers could not back, and `ng test` was green.
3. **Deduplicate and reconcile** — across slices first, under `review-audit.md` Step 5's dedup and
   cross-slice-contradiction bullets (one task per defect; a "missing X" one slice reports while another
   reports X working is settled against the code before anything is written), then against
   `PROJECT-BACKLOG.md`'s open `## Tasks`, `## Beyond the current gate` and `## Closed`: a finding an
   open task already carries is not filed twice, and one a `## Closed` line closes — a
   `DECISION, no code change` above all — is never re-raised.
4. **Grade by the standard**: a security row, and a frontend-security storage row, by
   `_review-standard.md` → "What 'confirmed' means", after searching `PLANNING.md` for the issue as
   `review-audit.md` Step 5 does, so a silent plan files the
   Medium *"decide and document"* naming the section that should record the answer; a flow row by that
   standard's priority rules; and every task by its "Level fit" section. A finding **above level and not
   necessary** is not a task, and this ritual does not write `## Beyond the current gate` — that section's
   only writer is `review-audit` — so it is named in the report instead.
5. A reviewer's "beyond junior scope" line goes to the report, never the backlog.

## 4 — Write the tasks

Every surviving finding goes into `{PROJECT_PATH}/PROJECT-BACKLOG.md` → `## Tasks`, at its tier and
priority, in the standard's task format, carrying its provenance:

```
*(raised 2026-10-11 by `slice-review` of Step 7a — cold flow pass on `shell-account`; not yet triaged)*
```

Then correct **every statement of the open-task count in `PLANNING.md`** in the same edit, under
`backlog-task-close` → "Incidental findings — write them, do not mention them": the number, the priority
breakdown and any clause the new number falsifies, never a route cell. That includes `Next gate`'s
qualifier: a new open **High** on the tier of a gate the qualifier calls `signable` turns it into
`blocked — open High raised by slice-review`; which gate the cell names stays derived and untouched.

Never write a `Last Reviewed` line, the `**Overall quality:**` sentence, `## Beyond the current gate`, a
`## Closed` line or project code. Never fix a finding and never triage one — that is `backlog-task-open`'s
— and never block or reopen the close that invoked this ritual: the step keeps its `✅` and the task its
ledger line, whatever this pass finds.

**Commit.** `PROJECT-BACKLOG.md` with the `PLANNING.md` count, one commit —
`docs(backlog): raise the cold slice-review findings of «Step N | task»` — with `git status` immediately
before the `add` and before the `commit`, staging those two paths by name. No surviving finding means no
write and no commit. The callers invoke this ritual **after** their own commits, so it always starts on a
tree holding nothing of theirs.

## Report back

| Target | Result |
|---|---|
| Range | `git diff a1b2c3d -- projects/07-timetrack` plus untracked — 41 code files (or: no code touched — n/a) |
| Slices | `login`, `shell-account`, `frontend-infra`, `styles-theme` (flow) · `auth` (flow + security) · unowned: none |
| Dispatches | 6 run, 6 traces valid (or: `shell-account` re-dispatched once; `auth` security left unreviewed — `FRIC-NNNN`) |
| Dropped | 2 — the code does not show it (`login.ts:81`); already closed (`## Closed` 2026-09-16) |
| Unverified | 1 — "`auth-service.spec.ts` is broken" — `ng test` settles it |
| Not filed | 1 above level and not necessary — `security/middle`, CSP header |
| Raised | 2 Medium `[backend]`, 3 Low `[frontend]` — PLANNING §22 count corrected (or: 1 High — `Next gate` qualifier set to blocked; or: none) |
| Beyond junior | reported only — proxy-aware client IP for the throttle |

desvíos: ninguno
