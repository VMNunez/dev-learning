# Project 05 — Task Manager · Backlog

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-16

**Overall quality:** Good — clean coordinator architecture with signals/`computed()` used consistently and 20 of 21 planned patterns fully demonstrated; held back by one timezone bug and a few polish gaps.

---

## Tasks

- [ ] **[Low]** `[frontend]` — Remove the leftover CLI-scaffold `title` signal in `app.ts:10-11` (and its `signal` import); `app.html` renders only `<router-outlet />`, so it is dead code. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Improve keyboard support on the stat-card filters in `task-page.html`: they are `<div role="button" tabindex="0" (click) (keydown.enter)>`, reachable via Enter but not Space. Use a real `<button>` styled as a card, or also handle `keydown.space`. *(Effort: Small)*

---

## Closed

### Backend

*No backend tasks — Angular-only project.*

### Frontend

#### High

- 2026-09-03 · **[High]** `[frontend]` — `createdAt` built from the local clock instead of `toISOString()` → README "What I learned", coverage javascript/junior (already marked 03-expense-tracker)

#### Medium

- 2026-09-03 · **[Medium]** `[frontend]` — `.filter-text` reads `--mat-sys-on-surface-variant`; dead `--text-secondary` removed → README "What I learned", coverage angular-material/junior (new bullet)
- 2026-09-03 · **[Medium]** `[frontend]` — PLANNING palette references aligned to the shipped `mat.$blue-palette` → PLANNING (features, patterns, steps), 07 PLANNING §design, junior Angular Q&A
- 2026-09-03 · **[Medium]** `[frontend]` — task ids from `crypto.randomUUID()`, `Task.id` widened to `string` across 6 sites → README "What I learned", coverage typescript/junior (new bullet), javascript/junior

#### Low

- 2026-09-03 · **[Low]** `[frontend]` — `How to run` clone path corrected from `angular/` to `projects/` → README
- 2026-09-03 · **[Low]** `[frontend]` — `localStorage` read parsed in `try`/`catch` and shape-checked with `Array.isArray` → README "What I learned", PLANNING key patterns (coverage javascript/typescript junior already marked)
