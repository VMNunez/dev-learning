# Review code prompt — the code-quality + learning-objectives reviewer

**Internal component.** This is one of the two cold reviewers in the review pipeline. `review-audit.md`
dispatches it as a subagent; it reads the project source **once** and returns two things — a
code-quality **findings table** and the **learning-objectives verdict** — for the orchestrator to merge
into the backlog. It does **not** write the backlog and does **not** commit. (The security pass is a
separate subagent, `review-security-prompt.md`.)

Both outputs come from the same read of the code, which is why they live in one subagent — no point
reading every file twice.

---

## Configuration — edit only this block

PROJECT_PATH = [angular/06-hr-portal | projects/07-timetrack | ...]

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}. Derive the project type from the path
prefix (`angular/` vs `projects/`).

---

You review a **built** project against the contract its own PLANNING.md set. Before starting, read:
- `notes/prompts/projects/review/_review-standard.md` — the code-quality checklist, the scope limit,
  and the learning-objectives rubric. This is your bar.
- `CLAUDE.md` — teaching rules, learning objectives, folder structure.
- `{PROJECT_PATH}/PLANNING.md` — the single source of truth. Extract (by heading, not number): current
  step (§0), new concepts (§3), review concepts (§4), business rules, testing plan, architecture
  decisions.

**Apply the scope limit** from the standard: only review code belonging to completed steps.

## Step 1 — Read the source

**ANGULAR:** `app.routes.ts` (or `app-routing.module.ts`), `app.config.ts`, the page/feature components
(`pages/` or `features/`), the services folder, the shared-components folder if present.

**FULLSTACK:** also `backend/src/main/java` (controller, service, repository, model, dto, security),
`backend/src/main/resources/application.properties` (or `.yml`), and `docker-compose.yml` if present,
plus the frontend files above.

## Step 2 — Code-quality review

Run the **full code-quality checklist** from the standard against the real code: patterns, pattern
consistency, TypeScript, error handling, cleanliness, Angular-specific, and (full-stack) backend
architecture / security quick checklist / application.properties / HTTP verbs / business rules / seed
data / docker. **The tests are audited by the dedicated test reviewer, not by you** — you may note a
glaring gap in passing, but do not do the full test audit. Use the bad-vs-good examples in the standard
as the bar for what counts as a finding. Judge against what the
code actually does — do not invent issues to fill space; if an area is clean, say so.

## Step 3 — Learning-objectives check

For every concept in PLANNING.md §3 and §4, check the code and mark ✅ Demonstrated / ⚠️ Shallow /
❌ Missing per the standard's rubric.

## Output — report only (no backlog, no commit)

Return exactly two blocks and nothing else:

**1. Code-quality findings** — a table, most severe first:
`| Priority (High/Medium/Low) | File | Finding | Fix | Why it matters |`
Apply the standard's priority rules (e.g. an unenforced business rule = High; a leftover `console.log`
= High; a Low-value polish = Low). If an area is genuinely clean, note "clean" in one line under the
table — do not pad. Do **not** edit any file.

**2. Learning objectives** — one row per §3/§4 concept: `| Concept | ✅/⚠️/❌ | Note |`, plus the tally
(how many ✅ / ⚠️ / ❌).

Then a one-line **overall quality** read: Strong / Good / Needs work — and why, in a sentence.
