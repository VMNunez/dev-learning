# Progress Update Prompt

Use in a **separate conversation**. No configuration needed — paste the whole prompt into a new chat.

Run this when PROGRESS.md feels out of sync: after finishing a project, after a long block of sessions, or before running the `new-project-prompt` (which uses PROGRESS.md as its main input for gap analysis). If PROGRESS.md is incomplete, the gap analysis is wrong.

What this prompt does: reads every completed project's PLANNING.md, checks the SQL exercises folder, checks the simulation tracker, and writes a complete, accurate PROGRESS.md.

---

````
## Context

I am Victor, 31 years old. I am learning Angular + Java Spring Boot for a junior developer
job at Spanish consultancies (NTT Data, Capgemini, Indra) by August 2026.

PROGRESS.md is the master record of every project completed and every concept learned.
It is the single source of truth for my history — other prompts (new-project-prompt,
roadmap-review-prompt) read it to understand where I am and what I still need to learn.
If PROGRESS.md is inaccurate or incomplete, those prompts produce wrong results.

The goal of this prompt is to make PROGRESS.md fully accurate and complete.

---

## What PROGRESS.md is — and what it is not

PROGRESS.md tracks:
- The projects table (all completed and in-progress projects)
- Per-project concept summaries (brief, one paragraph per project)
- Technology sections — the detailed list of concepts actually learned, organized by topic
  (Angular, CSS, Spring Boot, SQL, etc.)
- Simulation progress
- Complementary skills in practice

PROGRESS.md does NOT contain:
- Explanations — that is what notes/ is for
- Future learning — that is what future-learning.md files are for
- Architecture or strategy — that is what ROADMAP.md is for

**Format to maintain:** each concept entry is one line. Key syntax or API in backticks,
followed by a short dash and a one-liner explanation when needed. Examples:
- `signal()`, `signal.set()`, `signal.update()` — no explanation needed, the name is clear
- `effect()` — runs a side effect automatically when a tracked signal changes
- `@PreAuthorize("hasRole('X')")` — method-level authorization; checked after JWT is validated

Never add multi-line explanations. If a concept needs more than one line, it belongs in notes/.

---

## Step 1 — Read the current state

Read these files:

1. `PROGRESS.md` — the current version. Understand the structure, sections, and format exactly.
   Note which projects are in the table and what status they have. Treat this as a starting
   point only — actual project statuses will be verified in Step 2 by reading each PLANNING.md.
2. `CLAUDE.md` — "Current study progress" section. Use this for general orientation (which project
   is active, what phase). Do not treat it as authoritative — it is updated manually and may lag
   behind the actual state. Project statuses are confirmed in Step 2.

---

## Step 2 — Audit each project

PLANNING.md files use three different formats depending on when the project was created.
Before reading any PLANNING.md, identify which format it uses — then follow the matching
instructions below.

---

### Format A — Old format (projects 01–06)

These PLANNING.md files have a section called **"Key patterns introduced"** — a table with
two columns: `| Pattern | Where used |`. There is no numbered Section 3.

**For every project marked Done ✓ in Format A:**
1. Read the "Key patterns introduced" table. Every row is a new concept for that project.
2. Also read the "Key features" and "State management" sections — they sometimes mention
   patterns (e.g. `localStorage + effect()`, `computed()` for derived values) not listed
   in the patterns table.
3. For each concept found: check if it already appears in PROGRESS.md.
   To decide which technology section it belongs to, use this mapping:
   - Angular API (`@Component`, `signal()`, `HttpClient`, `MatTable`, guards, pipes…) → Angular section
   - CSS properties, layout techniques, animations → CSS section
   - TypeScript utility types (`Omit`, `??`, `?.`…) → TypeScript utility types (sub-section of Angular or a dedicated TypeScript section, whichever exists)
4. Note every concept present in the PLANNING.md but missing from PROGRESS.md.

---

### Format B — Transitional format (project 07 and any project without a numbered Section 3)

These PLANNING.md files have a **"Progressive learning plan"** where each step ends with
a `**Concept learned:**` line. There is no separate Section 3 table.

**For the in-progress project (⏳) in Format B:**
1. Read the PROGRESS.md project summary line for this project — it states which steps are
   done (e.g. "Step 1 ✓ Step 2 ✓ Step 3 ✓ Step 4 in progress ⏳"). This is the only
   reliable source for step completion status.
2. In the PLANNING.md, read the "Progressive learning plan". For each step marked as
   complete in PROGRESS.md, extract the concepts from its `**Concept learned:**` line.
3. For the step marked "in progress": also check if any sub-tasks are explicitly described
   as done in the PROGRESS.md technology sections. If a concept appears there, it was learned
   even if the step is not fully complete — do not re-add it.
4. For each concept extracted: check if it already appears in the relevant technology section
   of PROGRESS.md. To determine the section, use the concept itself as a signal:
   - Spring Boot annotations, beans, security, JPA → Spring Boot section
   - Pure Java language constructs (`Optional<T>`, `@Value`, `long` vs `Long`…) → Java section (create it if it does not exist)
   - Angular code → Angular section
5. Note every concept that should be in PROGRESS.md but is not.

**For a project marked Done ✓ in Format B:**
All steps are complete. Apply the same extraction to every step in the learning plan,
then follow the same check as above.

---

### Format C — New format (projects 08 and later, created by new-project-prompt)

These PLANNING.md files have a numbered **Section 3 ("New concepts")** — a table with
columns `| Concept | Topic | Why this project teaches it |` — and a **Section 15**
("Progressive learning plan") where each step explicitly lists which Section 3 concepts
it introduces.

**For every project marked Done ✓ in Format C:**
1. Read Section 3. Every row is a new concept. Use the "Topic" column to determine which
   technology section in PROGRESS.md it belongs to.
2. For each concept: check if it already appears in PROGRESS.md.
3. Note every concept in Section 3 but missing from PROGRESS.md.

**For the in-progress project (⏳) in Format C:**
1. Read Section 15. Find which steps are marked as complete (✅).
2. For each completed step, read its "New concepts introduced" list — these reference
   specific items from Section 3. Use the "Topic" column in Section 3 to determine the
   correct PROGRESS.md section.
3. Apply the same check: concept in a completed step but not in PROGRESS.md → add it.

---

Project paths to check (in order):
- Angular projects (Format A): angular/01-todo-list, angular/02-weather-app,
  angular/03-expense-tracker, angular/04-meal-finder, angular/05-task-manager,
  angular/06-hr-portal
- Full-stack projects: projects/07-timetrack (Format B) and any later ones in PROGRESS.md
  (use Format C if they have a numbered Section 3, Format B if they do not)

---

## Step 3 — Audit SQL exercises

Read the sql/ folder. Check what subfolders exist and what exercise files are inside them.

Cross-check against the SQL section in PROGRESS.md:
- Is the exercises-completed line accurate? (count and topic description)
- Are there topic sections in sql/ that are not mentioned in PROGRESS.md yet?

Update the SQL section in PROGRESS.md to reflect what is actually in sql/. Use this format:

```
## SQL

Exercises completed: X exercises across Y topics (joins, group-by, ...)

Topics covered:
- joins — solid ✅
- group-by — in progress ⏳
- subqueries — not started 🔜
```

Only list topics that have a folder in sql/. For topic status:
- Keep any topic already marked solid ✅ in the current PROGRESS.md — do not downgrade it.
- For topics that appear in sql/ but are not yet in PROGRESS.md, mark them as in progress ⏳.
  Victor manually upgrades a topic to solid ✅ after reviewing his scores in a sql-exercises-prompt session.
If a SQL section already exists in PROGRESS.md, keep its format — only update the counts
and topic statuses that have changed.

---

## Step 4 — Audit simulations

Read simulations/TRACKER.md. Count:
- Total simulations completed (✅ Pass or ⚠️ Borderline count as completed)
- Split by type: Angular / Spring Boot / SQL

If PROGRESS.md has a simulations section, update the counts.
If PROGRESS.md has no simulations section yet, add one:

```
## Simulations

- Angular: X completed (X Pass, X Borderline, X Fail)
- Spring Boot: X completed (X Pass, X Borderline, X Fail)
- SQL: X completed (X Pass, X Borderline, X Fail)
- Total: X / 15 minimum target
```

If TRACKER.md does not exist yet or shows 0 simulations: add the section with all zeros.
This makes it visible that the simulation block has not started yet.

---

## Step 5 — Write the updated PROGRESS.md

Write the complete updated PROGRESS.md.

Rules:
- Keep the exact same structure and section order as the current PROGRESS.md
- Add missing concepts to the correct technology section (Angular concept → Angular section)
- If a technology section does not yet exist in PROGRESS.md and concepts need to be added to it,
  create it following the same format as the existing sections (heading + one-line bullet list)
- Keep existing content — do not remove anything unless it is factually wrong
- Do not reformat entries that are already correct
- Do not add explanations or expand entries — one line per concept maximum
- Update the projects table: fix any status markers that do not match what Step 2 found.
  A project is Done ✓ when all its learning steps are complete (all steps in the learning
  plan for Format A/B, or all Section 15 steps for Format C). It is ⏳ if at least one
  step is still in progress. It is 🔜 if it has not started.

After writing, print a short diff summary:

**Changes made:**
| Section | Added | Corrected | Removed |
|---------|-------|-----------|---------|
| Projects table | | | |
| Angular | | | |
| Java | | | |
| Spring Boot | | | |
| CSS | | | |
| TypeScript | | | |
| Architecture | | | |
| Security | | | |
| General | | | |
| SQL | | | |
| Simulations | | | |

"Added" = concepts that were in PLANNING.md but missing from PROGRESS.md
"Corrected" = entries that were wrong (e.g. wrong project number, stale status)
"Removed" = entries that were duplicates or factually wrong

If nothing changed in a section: write "—". Skip rows for sections that do not yet exist in PROGRESS.md.

---

## Step 6 — Show the commit message

```
git add PROGRESS.md
```

```
git commit -m "docs: refresh PROGRESS.md — [main change, e.g. 'add project 07 Spring Boot concepts, fix projects table']"
```
````
