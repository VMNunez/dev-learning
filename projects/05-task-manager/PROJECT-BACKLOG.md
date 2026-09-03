# Project 05 — Task Manager · Backlog

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-16

**Overall quality:** Good — clean coordinator architecture with signals/`computed()` used consistently and 20 of 21 planned patterns fully demonstrated; held back by one timezone bug and a few polish gaps.

---

## Tasks

- [ ] **[Medium]** `[frontend]` — Replace `Date.now()` as the task id in `task-dialog.ts` with `crypto.randomUUID()` (or an incrementing counter). Two tasks added within the same millisecond (fast double-click / two tabs) collide on id, and later `editTask`/`deleteTask` then match both rows. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Reconcile the theme palette: PLANNING.md's "Key patterns introduced" documents `mat.$violet-palette`, but `material-theme.scss` uses `mat.$blue-palette` for primary and tertiary. Either switch the code to the violet palette or update PLANNING.md to match the code. (Also the one ⚠️ Shallow item in the learning-objectives pass.) *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Use a consistent token for "secondary text": `task-page.css:76` (`.filter-text`) uses `var(--text-secondary)`, while the same role elsewhere (`task-page.css:22`, `task-table.css:63`) uses `var(--mat-sys-on-surface-variant)`. Align `.filter-text` to the majority token. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Type and guard the localStorage read in `task.service.ts:9`: `JSON.parse(localStorage.getItem('tasks') ?? '[]')` is an implicit `any` assigned into `signal<Task[]>` with no validation. Type the result and wrap it in a try/catch with a `[]` fallback so corrupted storage can't silently break the shape. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Remove the leftover CLI-scaffold `title` signal in `app.ts:10-11` (and its `signal` import); `app.html` renders only `<router-outlet />`, so it is dead code. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Improve keyboard support on the stat-card filters in `task-page.html`: they are `<div role="button" tabindex="0" (click) (keydown.enter)>`, reachable via Enter but not Space. Use a real `<button>` styled as a card, or also handle `keydown.space`. *(Effort: Small)*

- [ ] **[Low]** `[frontend]` — Fix the `How to run` path in `README.md`: it still says `cd dev-learning/angular/05-task-manager`, a path the repository reorg removed when `angular/` became `projects/`, so the clone-and-run instructions a recruiter follows fail at the second command. *(Effort: Small)* *(raised 2026-08-31 while triaging the same defect in project 02)*

---

## Closed

### Backend

*No backend tasks — Angular-only project.*

### Frontend

#### High

- 2026-09-03 · **[High]** `[frontend]` — `createdAt` built from the local clock instead of `toISOString()` → README "What I learned", coverage javascript/junior (already marked 03-expense-tracker)

#### Medium

*No medium tasks closed yet.*

#### Low

*No low tasks closed yet.*
