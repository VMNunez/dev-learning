# Project plan write prompt — the AUTHOR component

**Internal component.** This is the **author** in the project-plan pipeline. You normally don't launch
it — `plan-audit.md` dispatches it as a cold subagent in `new` mode, then hands its output to
`plan-review-prompt.md` (the reviewer) for a second pass and the commit. It is documented here
so the audit prompt can point a subagent at it; you can also run it standalone to draft one PLANNING.md.

**What it does.** Picks the next project from the gap analysis, designs every part of it, and writes a
complete `PLANNING.md` to the contract in `_planning-standard.md` — plus the two small ROADMAP.md /
PROGRESS.md edits that register the choice. It does **not** commit: the reviewer audits the plan first
and owns the atomic commit.

**Why the format lives elsewhere.** The exact section-by-section contract (what §7 must contain, the
done-condition formats, the implementation order, the branch rules) is in `_planning-standard.md`, read
by both this prompt and the reviewer. This prompt owns the **design thinking**; the standard owns the
**output shape**. Never re-specify the section format here — point at the standard.

---

## Configuration — edit only this block

PROJECT = [blank — new mode auto-detects the next project from PROGRESS.md; only set it if you are
           deliberately overriding the auto-detected choice]

Use PROJECT wherever the prompt refers to {PROJECT}.

---

## Context

My profile, the Spanish job market, and what consultancies look for are in
`notes/prompts/_shared-context.md`. The goal is not just to build something — it is to be able to
explain every line and every decision in an interview.

**Do NOT commit and do NOT edit any worklist.** Leave everything in the working tree. Report the files
you touched and the one-line commit message you'd use — the reviewer runs next and owns the commit.

---

## Step 1 — Read the source files

Read these in order. They are the inputs to every decision this prompt makes.

1. `notes/prompts/projects/plan/_planning-standard.md` — **the output contract.** The 24-section template,
   done-condition formats, HTTP status conventions, professional implementation order, branch-strategy
   rules, and consistency invariants. Everything you write must conform to it.
2. `CLAUDE.md` — only the sections that feed a plan: "Current study progress", "Java/Spring Boot",
   "Testing rules", and "Git workflow". Skip the rest — session and notes rules do not shape a
   PLANNING.md.
3. `PROGRESS.md` — the master record of every project completed and concept learned. The single source
   of truth for project history — do not infer it from CLAUDE.md or ROADMAP.md. Read the full Angular,
   Spring Boot, and SQL sections.
4. `notes/coverage.md` — the target: every concept Victor must know before applying. Every item not in
   PROGRESS.md is a gap. **This is the largest file this pipeline reads (1600+ lines and growing) and
   the gap analysis needs all of it** — the Read tool truncates at 2000 lines silently, so check
   `wc -l` first and, if near or over 2000, read in passes with `offset` to the real end; a truncated
   read silently drops the later topics from the gap analysis.
5. `ROADMAP.md` — the career plan: phase table, candidate project ideas for the next project, and the
   "What 'ready' means" gate list.
6. The last completed project's `PLANNING.md` (check PROGRESS.md for the number, then read
   `projects/0X-name/PLANNING.md`). This is the reference for depth and structure — match it.

---

## Step 2 — Gap analysis

**First, confirm PROGRESS.md is fresh.** The whole gap analysis rests on it; a stale PROGRESS picks the
wrong next project and every later step inherits the error. Cross-check the last project marked done in
PROGRESS.md against the most recent project work in the repo (the latest `projects/0X-*` folder and the
git history). If PROGRESS looks behind — a finished project not recorded, a step done in code but not in
the table — **stop and report** "PROGRESS.md looks stale — run `progress-update` first", rather than
planning on bad data.

Compare `notes/coverage.md` against `PROGRESS.md` to find what is not yet learned.

**Filter the gaps to what matters.** Keep only concepts that: appear in the Angular, Spring Boot, Java,
Architecture, or SQL sections of coverage.md; are likely in a junior interview at NTT Data, Capgemini,
or Indra; can realistically be taught through a 2–4 week full-stack project.

**Skip** concepts that are: already in PROGRESS.md; post-junior scope (CQRS, microservices, Kubernetes,
JVM tuning, zone.js internals); or theory-only (cannot be demonstrated through a project).

**Identify review concepts** — already in PROGRESS.md but worth reinforcing because they were learned
once and not used since, or are important enough for interviews that repetition helps (JWT flow, soft
delete, coordinator pattern).

**Build two lists** and keep them for Step 5:
- **New concepts** — not yet in PROGRESS.md, learned for the first time.
- **Review concepts** — already in PROGRESS.md, reinforced through the new project.

---

## Step 3 — Choose the project

Read the candidate ideas section in ROADMAP.md. For each candidate, count how many of the significant
Step-2 gaps it covers. Choose the one that:

1. Covers the most significant gaps from Step 2.
2. Is realistic in 2–4 weeks of full-time study (4 hours/day).
3. Is full-stack: Spring Boot + Angular + PostgreSQL (mandatory).
4. Has a domain a recruiter at NTT Data or Capgemini would immediately recognise as realistic
   enterprise work (not a toy app).
5. Includes meaningful business rules — not just CRUD.
6. Introduces at least one JPA relationship or pattern NOT already practiced in the previous project.
7. **Differs in domain from the projects already in the portfolio** — a recruiter scanning the repo
   list should see variety, not three variations of the same app. If the strongest gap-covering
   candidate shares a domain with a published project (e.g. another HR/leave app), prefer the next-best
   candidate that closes comparable gaps in a fresh domain, or justify why the overlap is worth it.

If none covers the most important gaps well, propose a new candidate and explain why it fits better —
it must still meet all criteria. Write a one-paragraph justification: why this project over the others,
which specific gaps it closes, what it demonstrates to a recruiter or interviewer.

If `{PROJECT}` is set, use it instead of auto-detecting, but still run the justification.

---

## Step 4 — Design the project

The main step. Design every part before writing anything. Work through each area in order — do not
skip any. The **output format for each area lives in `_planning-standard.md`**; here you make the
design decisions that fill it.

**4a — Domain and business rules.** Choose a domain immediately recognisable to a Spanish consultancy
interviewer, with a realistic workflow (approval steps, role restrictions, state transitions). Define
every business rule: for each entity and action, ask who can do it (role), under what conditions
(state), and what happens on failure (validation). If there is a natural state machine (Draft →
Submitted → Approved), define it explicitly — one of the most valuable patterns in a junior portfolio.

**4b — Entities and data model.** Design every entity with every field: name, Java type, SQL type,
constraints, and why the field exists. Define every relationship: FK owner, fetch type and why,
cascade behaviour and why. Design the seed data — what must exist before a user can log in (first
admin/manager account `data.sql`).

**4c — REST API.** Define every endpoint: method, path (plural nouns, no verbs), role, one-line
description, request body (DTO fields), query params, response (status + body). Use the HTTP status
conventions in the standard.

**4d — Security design.** Endpoint access (public / valid-JWT / specific role via `@PreAuthorize`),
how the first admin is created (data.sql seed, no public register), CORS origins. Input validation
strategy (which DTO fields need `@NotBlank`/`@NotNull`/`@Positive`, validation at DTO level only, the
error-response shape). GlobalExceptionHandler design (custom exceptions, which maps to which status,
`{ "error": "message" }` shape used consistently). JWT config (expiration + reason, `${JWT_SECRET}`
from env never hardcoded, which claims and why).

**4e — Spring Boot folder structure.** The complete backend tree, one-line comment per file (per the
standard's §12 layout).

**4f — Angular folder structure.** The complete frontend tree, one-line comment per file (per §13),
plus the routes: path per page, guards per route, employee-only / manager-only / shared.

**4g — UI design.** Color palette (role/status · hex · usage — Material-friendly, primary + accent
different from the previous project), Material components (component → page), a wireframe for **every**
page (layout, interactive elements, empty states, role variations), and 2–3 real apps for inspiration.

**4h — Angular Material component list.** Per page: name + route, which Material components appear,
what the smart component does vs the dumb children, which components open dialogs and their contents.

**4i — Implementation order.** Map the build to the **professional implementation order in the
standard**. Every §15 step must trace to one or more items in that sequence; if two are combined,
explain why.

**4j — Git branch strategy.** Group the implementation steps into coherent feature branches per the
**branch rules in the standard** (never one branch per step). For each branch: name, covers, opens,
closes. Confirm the project branch stays open for the whole project.

**4k — Test plan.** Design the test plan per the standard's §16 before writing it: for each service, the
methods and the edge cases to test; which business rules from §8 need a test that proves enforcement;
the one slice test type this project introduces (`@WebMvcTest` and/or `@DataJpaTest`) and what it
asserts; the Angular service and (from 08) component tests. Keep it level-appropriate — mostly unit, a
few slice tests, no e2e. This is a design decision, not boilerplate: a project whose test plan only
lists "test the services" has no test plan.

---

## Step 5 — Write PLANNING.md

Write the file at `projects/0X-projectname/PLANNING.md`. Determine the project number from PROGRESS.md
(last completed + 1) and a short folder name (`0X-projectname`, e.g. `08-invoice-manager`).

Write **all 24 sections in the exact order and to the contract defined in `_planning-standard.md`** —
§0 through §23. Do not restate the contract here; follow it. Fold in every design decision from Step 4
and both concept lists from Step 2. Every done condition (in §0 and §15) must use one of the four valid
formats from the standard. Match the depth and structure of the last project's PLANNING.md.

---

## Step 6 — Update ROADMAP.md and PROGRESS.md

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

**Project chosen:** [name] — one sentence on what it is and why it was chosen.

**Gaps closed by this project:** the specific Step-2 concepts it addresses.

**Gaps NOT closed:** important gaps that remain (input for the next project).

**Counts:** X new concepts (§3) · X review concepts (§4) · X steps in the learning plan (§15).

**Files touched:** the three paths.

**Suggested commit message** (the reviewer will use or refine it):
`docs: add PLANNING.md for project 0X [project-name] — closes [main gap], introduces [key new concept]`
