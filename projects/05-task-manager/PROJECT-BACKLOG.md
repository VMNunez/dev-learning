# Project 05 — Task Manager · Backlog

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-16

**Overall quality:** Good — clean coordinator architecture with signals/`computed()` used consistently and 20 of 21 planned patterns fully demonstrated; held back by one timezone bug and a few polish gaps.

---

## Tasks

- [ ] **[Low]** `[frontend]` — PLANNING § *Pages and components* still describes the pre-Angular-20 file layout: `tasks-page` for the shipped `task-page`, and `*.component` suffixes the CLI no longer generates. Align the tree with the files on disk. *(Effort: Small)* *(raised 2026-09-03 while closing the leftover `title` signal task)*

---

## Closed

### Backend

*No backend tasks — Angular-only project.*

### Frontend

#### High

- 2026-09-03 · **[High]** `[frontend]` — `createdAt` built from the local clock instead of `toISOString()` → README "What I learned", coverage javascript/junior (already marked 03-expense-tracker)

#### Medium

- 2026-09-03 · **[Medium]** `[frontend]` — dialog specs provide `MatDialogRef` and `MAT_DIALOG_DATA` as `useValue` doubles → README "What I learned", coverage angular/junior (new bullet + 3 marked)
- 2026-09-03 · **[Medium]** `[frontend]` — `.filter-text` reads `--mat-sys-on-surface-variant`; dead `--text-secondary` removed → README "What I learned", coverage angular-material/junior (new bullet)
- 2026-09-03 · **[Medium]** `[frontend]` — PLANNING palette references aligned to the shipped `mat.$blue-palette` → PLANNING (features, patterns, steps), 07 PLANNING §design, junior Angular Q&A
- 2026-09-03 · **[Medium]** `[frontend]` — task ids from `crypto.randomUUID()`, `Task.id` widened to `string` across 6 sites → README "What I learned", coverage typescript/junior (new bullet), javascript/junior

#### Low

- 2026-09-03 · **[Low]** `[frontend]` — stat-card filters are native `<button>` toggles with `aria-pressed`, not `role="button"` divs → README "What I learned", `_cross-topic-inbox.md` HTML proposal (marker owed), css/junior already marked
- 2026-09-03 · **[Low]** `[frontend]` — CLI-scaffold `title` signal and its stale `should render title` spec removed → coverage architecture/junior (new bullet, marked), PLANNING component tree
- 2026-09-03 · **[Low]** `[frontend]` — `How to run` clone path corrected from `angular/` to `projects/` → README
- 2026-09-03 · **[Low]** `[frontend]` — `localStorage` read parsed in `try`/`catch` and shape-checked with `Array.isArray` → README "What I learned", PLANNING key patterns (coverage javascript/typescript junior already marked)
