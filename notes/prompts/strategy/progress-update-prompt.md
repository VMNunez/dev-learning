# Progress Update Prompt

Use in a **separate conversation**. No configuration needed — paste the whole prompt into a new chat.

Run this when PROGRESS.md feels out of sync: after finishing a project, after a long block of sessions, or before running the `new-project-prompt` (which uses PROGRESS.md as its main input for gap analysis). If PROGRESS.md is incomplete, the gap analysis is wrong.

What this prompt does: reads every completed project's PLANNING.md, checks the SQL exercises folder, checks the simulation tracker, and writes a complete, accurate PROGRESS.md.

**This prompt does NOT read `notes/coverage.md`.** Coverage tracks what Victor must learn — PROGRESS.md tracks what he has already learned. A stale or incomplete `notes/coverage.md` does not affect this prompt's results.

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
1. Read the PLANNING.md "Progressive learning plan". Look for step headings marked with ✅
   (e.g. `### Step 3 — Spring Security + JWT ✅`).
   - If NO step has a ✅ marker anywhere in the file: fall back to the PROGRESS.md project
     summary line. The format of this line may vary — examples: "Steps 1–3 done, Step 4 in
     progress" or "Step 1 ✓ Step 2 ✓ Step 3 ✓ Step 4 in progress ⏳". Parse it flexibly
     to extract which steps are complete and which are in progress.
   - If AT LEAST ONE step has a ✅ marker: use the ✅ markers as the primary source. Steps
     without ✅ are treated as not complete. However, also check the PROGRESS.md summary
     line — if PROGRESS.md shows MORE steps as done than the ✅ markers indicate (e.g.
     PLANNING.md has ✅ on Steps 1–2 only but PROGRESS.md says Steps 1–3 are done), prefer
     the higher count. In-session updates may have added concepts to PROGRESS.md without
     the corresponding ✅ being added to PLANNING.md.
2. In the PLANNING.md, read the "Progressive learning plan". For each step confirmed as
   complete, extract the concepts from its `**Concept learned:**` line.
3. For the step marked "in progress": do NOT add its concepts — they will be added when
   the step is fully complete. The only exception is if a concept from that step already
   appears in the PROGRESS.md technology sections (it was learned early) — in that case
   leave it as-is, do not remove it.
4. For each concept extracted from completed steps: check if it already appears in the
   relevant technology section of PROGRESS.md. To determine the section, use the concept:
   - Spring Boot annotations, beans, security, JPA → Spring Boot section. This includes
     Spring-specific annotations like `@Value`, `@Component`, `@Configuration`, `@Bean`.
   - Pure Java language constructs (`Optional<T>`, `long` vs `Long`, wrapper classes,
     `try/catch`, access modifiers…) → Java section (create it if it does not exist).
     A concept is "pure Java" if it exists in Java regardless of Spring — not if it is
     a Spring annotation that happens to appear in a Java file.
   - Angular code → Angular section
   - Docker, containerisation, `docker-compose` → General section (create it if it does
     not exist, using the same heading + bullet format as other sections)
5. Note every concept from completed steps that is missing from PROGRESS.md.

**Important — `**Concept learned:**` lines are high-level summaries.** PROGRESS.md typically
has more granular entries than these lines (e.g. the line says "JWT flow" but PROGRESS.md
already has 10+ detailed bullets covering JWT internals). Before adding a concept:
- If the `**Concept learned:**` line contains a summary label (e.g. "JWT flow", "layered
  architecture") and PROGRESS.md already has detailed bullets that cover that topic,
  treat the summary as already accounted for — do NOT add it as a new one-line bullet.
- Only add an entry if a specific, concrete concept from the step is genuinely absent from
  PROGRESS.md with no equivalent entry.

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

Read the sql/ folder. Two file formats may exist — check for both:

- **Flat file** (e.g. `sql/01-basics.sql`): a `.sql` file directly in the `sql/` folder
- **Subfolder** (e.g. `sql/02-joins/exercises.sql`): a folder containing an `exercises.sql` file

For every file found in either format, count the exercises by counting comment headers of the
form `-- Exercise N:`. This gives the accurate exercise count per topic — do not estimate.

The SQL section in PROGRESS.md has two distinct parts — keep both:

**Part A — SQL concepts learned** (bullets like `SELECT DISTINCT`, `ORDER BY`, `IS NULL`…)
These come from actual SQL knowledge practiced, not from the exercises folder. Do not touch
this sub-section in Step 3 — it is audited only if a project's PLANNING.md introduced SQL
concepts (Step 2). Leave it exactly as it is.

**Part B — Exercises tracker**
This is what Step 3 updates. Find the exercises sub-section in PROGRESS.md (usually under
a heading like `### Exercises completed` or similar) and update it using this format:

```
### Exercises completed

X total exercises across Y topics

| Topic | Folder | Exercises | Status |
|-------|--------|-----------|--------|
| basics / SELECT | sql/01-basics.sql | N | solid ✅ |
| joins | sql/02-joins/ | N | in progress ⏳ |
| group-by | sql/03-group-by/ | N | in progress ⏳ |
```

Use the actual path in the Folder column: `sql/01-basics.sql` for flat files,
`sql/02-joins/` for subfolders.

Only list topics that have a file or folder in sql/. Their existence means exercises have
been generated — "not started" never applies here. For each topic:
- Count: read the file and count `-- Exercise N:` headers
- Status rules:
  - Keep any topic already marked solid ✅ in the current PROGRESS.md — do not downgrade it
  - Any topic with a file or folder not yet in PROGRESS.md gets in progress ⏳
  - Victor upgrades a topic to solid ✅ manually after a sql-exercises-prompt review scores above 80%

If the exercises sub-section does not exist yet in PROGRESS.md, create it with the table above.
If it already exists in a different format, rewrite it using the table format above — this is
one of the cases where reformatting is allowed.

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
- Update each project's summary entry (the `### Project XX` section in PROGRESS.md):
  - Completed projects: only touch if the heading or `**New concepts:**` line is factually
    wrong (e.g. wrong step count, a concept missing that all steps clearly show).
  - In-progress project: update the heading to reflect the actual step status found in
    Step 2 (e.g. "Steps 1–3 done, Step 4 in progress"), and verify that the `**New
    concepts:**` line includes every concept extracted from completed steps.

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

"Added" = anything added to PROGRESS.md that was not there before — missing concepts from PLANNING.md, updated SQL exercise counts, updated simulation counts, new per-project summary data
"Corrected" = entries that were wrong (e.g. wrong project number, stale step status)
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
