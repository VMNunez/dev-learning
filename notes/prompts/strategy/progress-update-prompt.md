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
   Note which projects are in the table and what status they have.
2. `CLAUDE.md` — "Current study progress" section. This is the authoritative source for which
   project is active and what phase it is in.

---

## Step 2 — Audit each completed project

For every project marked Done ✓ in the projects table:

1. Read `{project-path}/PLANNING.md`. Find Section 3 ("New concepts") — the table of concepts
   this project was supposed to teach for the first time.
2. For each concept in Section 3: check if it already appears in the relevant technology section
   of PROGRESS.md (e.g. an Angular concept should be in the Angular section).
3. Note every concept that is in PLANNING.md Section 3 but NOT in PROGRESS.md.

For the in-progress project (⏳):
1. Read its `PLANNING.md`. Find which steps in Section 15 (the learning plan) are marked as complete.
2. For each completed step in Section 15, read the "New concepts introduced" list inside that step —
   each item references a specific concept from Section 3. Use the "Topic" column in Section 3 to
   determine which technology section in PROGRESS.md the concept belongs to (e.g. Topic = "Spring Boot"
   → Spring Boot section in PROGRESS.md).
3. Apply the same check: concept listed in a completed step but not yet in PROGRESS.md → add it.

Project paths to check (in order):
- Angular projects: angular/01-todo-list, angular/02-weather-app, angular/03-expense-tracker,
  angular/04-meal-finder, angular/05-task-manager, angular/06-hr-portal
- Full-stack projects: projects/07-timetrack (and any later ones in PROGRESS.md)

---

## Step 3 — Audit SQL exercises

Read the sql/ folder. Check what subfolders exist and what exercise files are inside them.

Cross-check against the SQL section in PROGRESS.md:
- Is the exercises-completed line accurate? (count and topic description)
- Are there topic sections in sql/ that are not mentioned in PROGRESS.md yet?

Do not add topic detail to PROGRESS.md — just update the "Exercises completed" summary line
to reflect what is actually in the sql/ folder.

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
- Keep existing content — do not remove anything unless it is factually wrong
- Do not reformat entries that are already correct
- Do not add explanations or expand entries — one line per concept maximum
- Update the projects table: fix any status markers that do not match CLAUDE.md

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
