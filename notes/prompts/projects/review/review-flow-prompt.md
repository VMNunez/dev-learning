# Review flow prompt — the per-slice functional reviewer

**Internal component.** This is the functional reviewer in the review pipeline. `review-audit.md`
dispatches it **once per vertical slice** — one backend resource's full flow, one frontend feature, or
one cross-cutting area — never the whole codebase. It reads only that slice and returns a **findings
table** for the orchestrator to merge into the backlog. It does **not** edit any file and does **not**
commit — Victor fixes everything himself to learn. (Security is a separate reviewer,
`review-security-prompt.md`.)

**Why per slice.** A subagent handed the whole project skims the last files; one handed a single
resource's `model → repository → service → controller → DTO → tests` flow has a small, closed surface
it cannot leave half-reviewed. So each run is one slice, and it runs the **three functional lenses**
on it at once — quality, correctness, and tests — because all three come from the same read of that
slice's code.

---

## Configuration — edit only this block

PROJECT_PATH = [angular/06-hr-portal | projects/07-timetrack | ...]
TIER         = [backend | frontend]
SCOPE        = [a resource/feature name, or a cross-cutting area]
               → backend resource:  e.g. `time-entries`, `auth`, `users`, `projects`
               → backend cross-cutting: `persistence-config`
               → frontend feature:  e.g. `dashboard`, `login`, `entry-form`
               → frontend cross-cutting: `frontend-infra`

Use PROJECT_PATH, TIER, and SCOPE wherever the prompt refers to {PROJECT_PATH}, {TIER}, {SCOPE}. Derive
the project type from the path prefix (`angular/` vs `projects/`).

---

You review **one slice** of a built project against the contract its own PLANNING.md set. Before
starting, read:
- `notes/prompts/projects/review/_review-standard.md` — the **Code-quality checklist**, the
  **Correctness scope**, the **Test-quality scope**, the scope limit, and the priority rules. This is
  your bar; apply only the parts that touch your slice.
- `CLAUDE.md` — teaching rules and folder structure.
- `{PROJECT_PATH}/PLANNING.md` — the source of truth. Extract (by heading, not number) the business
  rules and state machine (§8), entities (§7), API (§10), and testing plan (§16) **for your slice**.

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
   slice). Use the standard's bad-vs-good examples as the bar.
2. **Correctness** (Correctness scope — the bug hunt) — trace realistic inputs and states through this
   slice: null/`Optional` mishandling, edge cases (empty/first/last/zero/negative/boundary date),
   inverted or off-by-one conditions, **state-machine violations** and business rules enforced with the
   wrong comparison, lifecycle/ordering bugs, numeric/date errors, swallowed or unshown errors. Name a
   concrete **trigger** and the **wrong result** for each — no trigger, no bug.
3. **Tests** (Test-quality scope) — this slice's tests vs its behaviour and §16/§8: every service/rule
   in this slice has a test that proves enforcement; edge cases covered, not just the happy path;
   assertions check real behaviour (not a bare `verify(...save(any()))`); Mockito hygiene; clear
   arrange/act/assert and honest names.

Judge against what the code actually does — do not invent findings to fill space; if a lens is clean
for this slice, say so.

## Output — findings table + trace (no edits, no commit)

Return, for **this slice only**:

**1. Findings** — one table, most severe first, each row tagged with its lens:
`| Priority (High/Medium/Low) | Lens (quality/correctness/tests) | File | Finding (trigger+wrong result for correctness) | Fix | Why it matters |`
Apply the standard's priority rules (unenforced/mis-enforced business rule = High; missing planned test
or untested §8 rule = High; leftover `console.log` = High; polish = Low). If a lens is clean, say
"clean" for it in one line.

**2. Trace** — list every file you read in this slice with a one-line note (reviewed / clean / N
findings), as proof you covered the whole slice, not just the first file. **Do not edit any file.**
