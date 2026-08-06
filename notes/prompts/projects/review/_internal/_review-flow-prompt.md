# Review flow prompt — the per-slice functional reviewer

**Internal component.** This is the functional reviewer in the review pipeline. `review-audit.md`
dispatches it **once per vertical slice** — one backend resource's full flow, one frontend feature, or
one cross-cutting area — never the whole codebase. It reads only that slice and returns a **findings
table** for the orchestrator to merge into the backlog. It does **not** edit any file and does **not**
commit — Victor fixes everything himself to learn. (Security is a separate reviewer,
`_review-security-prompt.md`.)

**Why per slice.** A subagent handed the whole project skims the last files; one handed a single
resource's `model → repository → service → controller → DTO → tests` flow has a small, closed surface
it cannot leave half-reviewed. So each run is one slice, and it runs the **three functional lenses**
on it at once — quality, correctness, and tests — because all three come from the same read of that
slice's code.

---

## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | ...]
TIER         = [backend | frontend]
SCOPE        = [a resource/feature name, or a cross-cutting area]
               → backend resource:  e.g. `time-entries`, `auth`, `users`, `projects`
               → backend cross-cutting: `persistence-config`
               → frontend feature:  e.g. `dashboard`, `login`, `entry-form`
               → frontend cross-cutting: `frontend-infra`

Use PROJECT_PATH, TIER, and SCOPE wherever the prompt refers to {PROJECT_PATH}, {TIER}, {SCOPE}. Derive
the project type from the project number (01–06 Angular-only, 07+ full-stack).

---

You review **one slice** of a built project against the contract its own PLANNING.md set. Before
starting, read **only these sections** — keep your context for the slice's code, not for machinery:
- `notes/prompts/projects/review/_internal/_review-standard.md` — **only** the sections "Scope limit",
  "Code-quality checklist", "Correctness scope", "Test-quality scope", and the priority rules in
  "Improvement-task + backlog format". Skip "Security scope" (a different reviewer's job), the
  learning-objectives rubric, and the gate/backlog machinery — the orchestrator owns those.
- `{PROJECT_PATH}/PLANNING.md` — the source of truth, but **do not read it end to end**. First list its
  headings (grep `^#`), then read only the sections your slice needs: current step (§0), business rules
  and state machine (§8), entities (§7), API (§10), testing plan (§16), and — **frontend slices only** —
  UI design (§14, the palette / wireframes / empty-loading-error states the design-guide check compares
  against) — matched by heading text, not number, and only the parts that touch **your slice**.

**Apply the scope limit** from the standard: only review code belonging to completed steps.

## Step 1 — Read only your slice

Read exactly the files your `{TIER}` + `{SCOPE}` owns — no more, no less:

| {TIER} · {SCOPE} | Files |
|---|---|
| backend · «resource» | `controller/«Resource»Controller.java`, `service/«Resource»Service.java`, `repository/«Resource»Repository.java`, `model/«Resource».java`, the resource's `dto/*`, the exceptions it throws, and its tests in `src/test/java/**/«Resource»*Test.java` |
| backend · `persistence-config` | `application.properties`/`.yml`, any `@Configuration`/datasource/transaction config, `data.sql` if present, `docker-compose.yml` if present — and the cross-resource persistence *patterns* (fetch strategy / N+1, `ddl-auto`, transaction boundaries) |
| frontend · «feature» | that feature's component(s), its service, and its `*.spec.ts` |
| frontend · `frontend-infra` | `app.routes.ts`/`app-routing`, `app.config.ts`, guards, interceptors, and the auth/token service |

Read the code **and** its tests together — you cannot judge an assertion without knowing what the
method does. For a backend resource, **trace the full vertical flow**: follow one request from the
controller down through the service and repository to the entity/DTO and back.

## Step 2 — Run the three functional lenses on this slice

Apply, to your slice only, the matching parts of the standard:

1. **Quality** (Code-quality checklist) — layering (logic in the service, controller thin, entity never
   returned), DTOs at the boundary, `@Valid`, uniform error handling, naming, TypeScript `any`, state
   signals, subscription cleanup, `forkJoin`, HTTP verbs, `application.properties` hygiene (config
   slice). For a frontend slice, also run: the standard's **design-guide adherence** check (components
   vs PLANNING.md §14's palette, wireframes, planned empty/loading/error states — on **01–06 there is no
   §14**, so apply the degraded form the standard describes: hardcoded hex vs theme token, and whether
   every page that can be empty or fail renders that state); its **accessibility** block (labels on
   inputs, accessible names on icon-only buttons, errors tied to their field, no `<div (click)>`); and —
   on **every** frontend slice, 01–06 and 07+ alike, because the cold security pass audits only the
   backend — its **frontend security** greps (`[innerHTML]`, `bypassSecurityTrust*`, sensitive data in
   `localStorage`), reporting a clean grep as an explicit one-line "no findings". On a full-stack
   project the live case is the JWT the auth service persists, and the standard says how to grade it
   (High only where PLANNING promised otherwise, else Medium "decide and document"). Use the standard's
   bad-vs-good examples as the bar.
   **Skip the standard's "Pattern consistency across the project" block** — consistency is a between-slice
   property and you hold one slice; a separate cross-slice reviewer owns it. Judge your slice on its own
   merits and do not speculate about how the others do it.
2. **Correctness** (Correctness scope — the bug hunt) — trace realistic inputs and states through this
   slice: null/`Optional` mishandling, edge cases (empty/first/last/zero/negative/boundary date),
   inverted or off-by-one conditions, **state-machine violations** and business rules enforced with the
   wrong comparison, lifecycle/ordering bugs, numeric/date errors, swallowed or unshown errors. Name a
   concrete **trigger** and the **wrong result** for each — no trigger, no bug. Include the standard's
   **data-representation** checks — money held in a floating-point `number` and aggregated, a "today"
   default built from `toISOString()` (UTC, not local), `Date.now()` used as a unique id — these break no
   business rule, so no other lens hunts them.
3. **Tests** (Test-quality scope) — this slice's tests vs its behaviour and §16/§8: every service/rule
   in this slice has a test that proves enforcement; edge cases covered, not just the happy path;
   assertions check real behaviour (not a bare `verify(...save(any()))`); Mockito hygiene; clear
   arrange/act/assert and honest names.

Judge against what the code actually does — do not invent findings to fill space; if a lens is clean
for this slice, say so.

**Any finding about a config file must quote the offending line verbatim.** For anything you report in
`application.properties` / `.yml` / `data.sql` / `docker-compose.yml` (hardcoded secret, `ddl-auto`,
`show-sql`, a credential, a missing env var), put the exact line — value included — in the Finding cell,
e.g. `app.jwt.secret=my-secret-key` **not** "the JWT secret is hardcoded". If you cannot quote the line,
you have not read it and the finding does not exist. Config findings are the easiest to assert from
memory of what such files *usually* look like, and a false one lands straight in the backlog as a High.

> **Why this rule is here.** On 2026-07-14 a reviewer reported "hardcoded JWT secret — High" against a
> file whose actual line was `app.jwt.secret=${JWT_SECRET}` — correctly externalised. It was caught only
> because a second slice happened to read the same file and contradicted it. Quoting the line makes the
> mistake impossible to make without it being visible.

## Output — findings table + trace (no edits, no commit)

Return, for **this slice only**:

**1. Findings** — one table, most severe first, each row tagged with its lens:
`| Priority (High/Medium/Low) | Lens (quality/correctness/tests) | File | Finding (trigger+wrong result for correctness) | Fix | Why it matters |`
Apply the standard's priority rules (unenforced/mis-enforced business rule = High; missing planned test
or untested §8 rule = High; leftover `console.log` = High; polish = Low). If a lens is clean, say
"clean" for it in one line.

**2. Trace** — list every file you read in this slice with a one-line note (reviewed / clean / N
findings), **plus proof you read it to the end**: its line count and a short quote of its **last real
line** (the closing method, selector, rule, or export — not a blank line or `}`). Format each row as
`file (N lines, ends: «…last line…») — note`. This is the same principle as the config-line rule above,
applied to coverage: a trace row you can only write after reaching the bottom of the file cannot be
faked from the first screen. A row without the line count + closing quote does not count as read — the
orchestrator treats that slice as not covered. **Do not edit any file.**

**Keep the report bounded** — your output lands in the orchestrator's context alongside every other
slice's. No code excerpts (a `File.java:42` reference in the Finding cell is enough), one row per
finding, one line per cell, no narrative outside the two blocks above. The table and the trace are the
whole report.

**Never transcribe the value of a secret.** If you come across an API key, password, token, or
connection string, cite it **by location and kind only** — `environment.ts:3 (OpenWeatherMap API key)`
— never by value, not even partially masked (a `7b6aec…` prefix still leaks material and confirms which
key it is). This holds in all three places it is tempting: the Finding cell, the trace, and the line
where you explain why something is **not** a finding — "the key at `environment.ts:3` is gitignored and
untracked" is the complete argument; the value adds nothing to it. It holds whether or not the secret is
committed: your report feeds a `PROJECT-BACKLOG.md` that **is** committed, so a value copied here is one
step from being the leak it was reporting. A secret that is genuinely exposed (committed, or hardcoded
where an env var belongs) is still a finding — you are changing how you cite it, never whether you
raise it.
