# Project plan write prompt — the AUTHOR component

**Internal component.** This is the **author** in the project-plan pipeline. You normally don't launch
it — `plan-audit.md` dispatches it as a cold subagent in `new` mode, then hands its output to
`_plan-review-prompt.md` (the reviewer) for a second pass and the commit. It is documented here
so the audit prompt can point a subagent at it; you can also run it standalone to draft one PLANNING.md.

**What it does.** Designs every part of the project the **brief** already chose and writes a complete
`PLANNING.md` to the contract in `_planning-standard.md` — plus the two small ROADMAP.md / PROGRESS.md
edits that register the choice. It does **not** commit: the reviewer audits the plan first and owns the
atomic commit.

**What it no longer does.** It does not choose the project and does not run the gap analysis. Both
belong to `notes/prompts/projects/plan/project-brief-prompt.md`, whose one-page brief is committed,
dated, fingerprinted and contested by a cold second opinion **before** any section is designed against
it. That split is why this prompt never loads `notes/coverage/junior.md` (2094 lines) into context: the
brief carries the gap bullets verbatim, so re-reading the mirror here would buy nothing and risk a
truncated read. Step 2 still digests it and greps three bullets out of it — that is a check on the
brief, not a second gap analysis.

**Why the format lives elsewhere.** The exact section-by-section contract (what §7 must contain, the
done-condition formats, the implementation order, the branch rules) is in `_planning-standard.md`, read
by both this prompt and the reviewer. This prompt owns the **design thinking**; the standard owns the
**output shape**. Never re-specify the section format here — point at the standard.

---

## Configuration — edit only this block

BRIEF = [projects/briefs/project-brief-{NUMBER}.md — the committed brief that chose this project]

Use BRIEF wherever the prompt refers to {BRIEF}. The project's number, folder name and scope all come
from it; there is nothing else to configure.

---

## Context

My profile, the Spanish job market, and what consultancies look for are in
`notes/prompts/_internal/_shared-context.md`. The goal is not just to build something — it is to be able to
explain every line and every decision in an interview.

**Do NOT commit and do NOT edit any worklist.** Leave everything in the working tree. Report the files
you touched and the one-line commit message you'd use — the specialist reviewers run next and **the
orchestrator** owns the commit; no reviewer in this flow commits, dispatched or standalone.

---

## Step 1 — Read the source files

Read these in order. They are the inputs to every decision this prompt makes.

1. `notes/prompts/projects/plan/_internal/_planning-standard.md` — **the output contract.** The 24-section template,
   done-condition formats, HTTP status conventions, professional implementation order, branch-strategy
   rules, and consistency invariants. Everything you write must conform to it.
2. `notes/prompts/_internal/_session-rules.md` — only the sections that feed a plan: "Current study progress", "Java/Spring Boot",
   "Testing rules", and "Git workflow". Skip the rest — session and notes rules do not shape a
   PLANNING.md.
3. `{BRIEF}` — **the decision, read end to end.** It names the project, the gaps it closes with their
   coverage bullets quoted verbatim, both concept lists, the alternatives that lost, the scope ceiling,
   and the gaps deliberately left for the next project. It is the authority for §2, §3 and §4, and its
   scope ceiling binds §15: anything you add past that line is scope the brief did not buy.
4. `PROGRESS.md` — **the `## Projects` table and `Professional level by topic` only.** It is a status
   instrument, not an inventory: the per-technology concept lists were deleted on 2026-08-03 and what
   replaced them is the marker state in the coverage files, which the brief already resolved. You read
   it to know the project history and the open gates, never to re-derive a gap.
5. `ROADMAP.md` — the career plan: phase table and the "What 'ready' means" gate list. The candidate
   ideas are the brief's input, not yours; the choice is settled.
6. The **highest-numbered existing** `projects/0X-name/PLANNING.md` — in progress counts, completed is
   not the test. This is the reference for depth and structure, and only a plan written to the current
   24-section standard can serve as one; the last *completed* project may well be an Angular-only plan
   that predates it. Match its depth (it is ~1800 lines: budget the read accordingly).
7. **The §14 of every other published project** — read only that section (grep the "UI design" heading
   and read to the next one; do not load whole plans). You need the palette, density, shape, typography
   and layout skeleton each one already used, because 3g must differ from **all** of them, not just the
   last. Note them in a short table you keep for 3g. Projects 01–06 have no numbered sections — read
   whatever design/palette part their legacy plan has, and if one has none, look at its README
   screenshots or its theme file instead.

---

## Step 2 — Consume the brief

The two concept lists §3 and §4 need are already written, in the brief's `## New concepts` and
`## Review concepts` tables, and the gap bullets behind them are quoted verbatim in
`## Gaps this project closes`. Take them as given and keep them for Step 4. **Do not re-derive them**:
re-deriving is what the split removed, and a second gap analysis in this context would be built on a
partial read of the file the brief already read whole.

Two checks, not a re-decision:

- **Is the brief still current?** Its header carries a `Coverage SHA-256`, the last completed project
  and the highest existing project folder. If the digest no longer matches — recompute it with the
  canonical command in "Evidence markers" in
  `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`, never a plain `sha256sum`, which
  would include the evidence markers that command strips — or a different project is now the highest
  existing folder or the last completed one, **stop and report** "the brief is stale — re-run
  `project-brief`". A plan written against a superseded decision is worse than no plan.
- **Does the brief carry its bullets verbatim?** Spot-check three of them against the coverage mirror,
  the sections only. If they are paraphrased or missing, **stop and report** it as a brief defect
  rather than reconstructing them here.

If the brief's second opinion was `endorse-with-scope-change`, the scope ceiling as written is binding:
it already absorbed the reviewer's cut.

---

## Step 3 — Design the project

The main step. Design every part before writing anything. Work through each area in order — do not
skip any. The **output format for each area lives in `_planning-standard.md`**; here you make the
design decisions that fill it.

**3a — Domain and business rules.** Choose a domain immediately recognisable to a Spanish consultancy
interviewer, with a realistic workflow (approval steps, role restrictions, state transitions). Define
every business rule: for each entity and action, ask who can do it (role), under what conditions
(state), and what happens on failure (validation). If there is a natural state machine (Draft →
Submitted → Approved), define it explicitly — one of the most valuable patterns in a junior portfolio.

**3b — Entities and data model.** Design every entity with every field: name, Java type, SQL type,
constraints, and why the field exists. Define every relationship: FK owner, fetch type and why,
cascade behaviour and why. Design the seed data — what must exist before a user can log in (first
admin/manager account `data.sql`).

**3c — REST API.** Define every endpoint: method, path (plural nouns, no verbs), role, one-line
description, request body (DTO fields), query params, response (status + body). Use the HTTP status
conventions in the standard.

**3d — Security design.** Endpoint access (public / valid-JWT / specific role via `@PreAuthorize`),
how the first admin is created (data.sql seed, no public register), CORS origins. Input validation
strategy (which DTO fields need `@NotBlank`/`@NotNull`/`@Positive`, validation at DTO level only, the
error-response shape). GlobalExceptionHandler design (custom exceptions, which maps to which status,
`{ "error": "message" }` shape used consistently). JWT config (expiration + reason, `${JWT_SECRET}`
from env never hardcoded, which claims and why).

**3e — Spring Boot folder structure.** The complete backend tree, one-line comment per file (per the
standard's §12 layout).

**3f — Angular folder structure.** The complete frontend tree, one-line comment per file (per §13) —
held to the same annotation bar as the backend tree in 3e, not a list of folder names — plus the routes
(path per page, guards per route, employee-only / manager-only / shared) and, per §13, one ownership
line for every endpoint that more than one page consumes.

**3g — Visual identity.** Do this **before** picking a single hex. Read the visual-identity rules in the
standard's §14, then decide what this app should *feel* like given its domain, and choose the axes that
carry it — palette, density and rhythm, shape, typography, layout skeleton, dominant data surface. At
least three must differ from **every** published project (Step 1 gave you their §14 tables): name the
axis, what the earlier projects did, and what this one does instead. Two constraints shape the choice:
it must be reachable by **configuring Angular Material**, not by fighting it with CSS; and each axis
should teach something — a different layout skeleton or a different dominant surface means a Material
layout Victor has not built yet, while reusing the last project's means a step of copying.

**3h — UI design.** Fill the rest of §14 in the standard's order, every block, each one a decision the
identity from 3g already implies:
- **Palette** (role/status · hex · usage), Material-friendly and consistent with the identity.
- **Design system** — theming mechanism in one named file, palette intent vs generated ramp, status
  colours as named tokens, the type scale mapped to roles, the spacing grid and its allowed values,
  elevation/shape/density, and an explicit dark-mode ruling with a reason. Every row must say **where
  the value is defined and who consumes it** — a row that only names a value is not a decision.
- **Material components** — component → page(s).
- **Wireframes** — one per page, each covering the **three states** (loading, error, empty), key
  interactive elements, and role variations.
- **Motion and accessibility** — transitions on state change only, `prefers-reduced-motion` honoured,
  animated skeletons; icon-only buttons labelled, status never colour alone, contrast checked at the
  rendered size, focus visible, everything keyboard-reachable.
- **Inspiration** — 2–3 real products in this domain, each row naming **the one concrete element** to
  take from it, with at least one §14 decision traced back to a named row.
- **Visual QA checklist** — the finish bar run over every page in one sitting; the last frontend step in
  §15 must name it in its done condition.
- The responsive intent line (or an explicit §20 tradeoff).

**3i — Component composition.** Per page: name + route, what the smart component does vs the dumb
children, which components open dialogs and their contents. (The Material component → page mapping is
already in 3h; this is the composition layer on top of it.)

**3j — Implementation order.** Map the build to the **professional implementation order in the
standard**. Every §15 step must trace to one or more items in that sequence; if two are combined,
explain why.

**3k — Git branch strategy.** Group the implementation steps into coherent feature branches per the
**branch rules in the standard** (never one branch per step). For each branch: name, covers, opens,
closes. Confirm the project branch stays open for the whole project.

**3l — Test plan.** Design the test plan per the standard's §16 before writing it: for each service, the
methods and the edge cases to test; which business rules from §8 need a test that proves enforcement;
the one slice test type this project introduces (`@WebMvcTest` and/or `@DataJpaTest`) and what it
asserts; the Angular service and (from 08) component tests. Keep it level-appropriate — mostly unit, a
few slice tests, no e2e. This is a design decision, not boilerplate: a project whose test plan only
lists "test the services" has no test plan.

---

## Step 4 — Write PLANNING.md

Write the file at `projects/0X-projectname/PLANNING.md`. **The number is the brief's**, which resolved
it as the next one above the highest existing folder — never "last *completed* + 1", since the project
in flight is normally still open and the completed count is one behind it. Confirm that against
`projects/` anyway (the brief may predate a folder), pick a short folder name (`0X-projectname`, e.g.
`08-invoice-manager`), and before writing confirm the path is free: if `projects/0X-*/` or its
`PLANNING.md` already exists, **stop and report** rather than write. `projects/briefs/` is not a project
folder and never blocks this check. This prompt only ever creates a new plan; editing an existing one is
`MODE = review`.

Write **all 24 sections in the exact order and to the contract defined in `_planning-standard.md`** —
§0 through §23. Do not restate the contract here; follow it. Fold in every design decision from Step 3
and both concept lists from the brief. Every done condition (in §0 and §15) must use one of the four
valid formats from the standard. Match the depth and structure of the highest-numbered existing plan —
the same one Step 1.6 named, never the last *completed* project's, which predates this standard.

---

## Step 5 — Update ROADMAP.md and PROGRESS.md

Two small edits (leave them uncommitted for the reviewer):

**ROADMAP.md** — in the candidate ideas section, mark the chosen project selected:
`- **[Project Name]** ← selected — PLANNING.md written at projects/0X-projectname/PLANNING.md`
Leave the other candidates unchanged.

**PROGRESS.md** — add one row to the projects table (columns `# | Project | Key concepts | Status |
Live`): `| 0X | [Project name] | [main concepts introduced] | Not started 🔜 | — |`.

---

## Output — report (no commit)

Do **not** commit and do **not** mark any worklist. Leave PLANNING.md, ROADMAP.md, and PROGRESS.md in
the working tree. Print:

**Brief consumed:** `{BRIEF}` — its `Coverage SHA-256`, and confirmation you read it end to end. State
this **first**: it is what says the plan was designed against the committed decision rather than a
reconstruction of one, and the orchestrator's acceptance check reads this line.

**Project:** [name] — one sentence on what it is, taken from the brief's decision paragraph.

**Counts:** X new concepts (§3) · X review concepts (§4) · X steps in the learning plan (§15) — the
first two must match the brief's two tables exactly; say so, or say which row you could not place and
why. The gaps closed and the gaps left over are the brief's own sections and are not repeated here.

**Files touched:** the three paths.

**Suggested commit message** (the reviewer will use or refine it):
`docs: add PLANNING.md for project 0X [project-name] — closes [main gap], introduces [key new concept]`
