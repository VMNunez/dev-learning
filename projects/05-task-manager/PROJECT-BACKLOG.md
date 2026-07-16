# Project 05 — Task Manager · Backlog

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-16

**Overall quality:** Good — clean coordinator architecture with signals/`computed()` used consistently and 20 of 21 planned patterns fully demonstrated; held back by one timezone bug and a few polish gaps.

---

## Tasks

- [ ] **[High]** `[frontend]` — Fix the UTC date bug when creating a task: `task-dialog.ts` builds `createdAt` with `new Date().toISOString().split('T')[0]`, which returns the **UTC** date. Between local midnight and 1–2am in Spain (UTC+1/+2) a task created "today" is stamped with yesterday's date. Build the date from local components (`getFullYear`/`getMonth`/`getDate`) or a date library instead. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Replace `Date.now()` as the task id in `task-dialog.ts` with `crypto.randomUUID()` (or an incrementing counter). Two tasks added within the same millisecond (fast double-click / two tabs) collide on id, and later `editTask`/`deleteTask` then match both rows. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Define the `.btn-danger` rule used by the delete buttons (`task-table.html:41`, `confirm-dialog.html:7`). No CSS in the project defines it (`confirm-dialog.css` is empty), so the destructive action never gets its danger colour. Source the colour from a theme token (e.g. `var(--mat-sys-error)`). *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Reconcile the theme palette: PLANNING.md's "Key patterns introduced" documents `mat.$violet-palette`, but `material-theme.scss` uses `mat.$blue-palette` for primary and tertiary. Either switch the code to the violet palette or update PLANNING.md to match the code. (Also the one ⚠️ Shallow item in the learning-objectives pass.) *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Use a consistent token for "secondary text": `task-page.css:76` (`.filter-text`) uses `var(--text-secondary)`, while the same role elsewhere (`task-page.css:22`, `task-table.css:63`) uses `var(--mat-sys-on-surface-variant)`. Align `.filter-text` to the majority token. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Type and guard the localStorage read in `task.service.ts:9`: `JSON.parse(localStorage.getItem('tasks') ?? '[]')` is an implicit `any` assigned into `signal<Task[]>` with no validation. Type the result and wrap it in a try/catch with a `[]` fallback so corrupted storage can't silently break the shape. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Remove the leftover CLI-scaffold `title` signal in `app.ts:10-11` (and its `signal` import); `app.html` renders only `<router-outlet />`, so it is dead code. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Improve keyboard support on the stat-card filters in `task-page.html`: they are `<div role="button" tabindex="0" (click) (keydown.enter)>`, reachable via Enter but not Space. Use a real `<button>` styled as a card, or also handle `keydown.space`. *(Effort: Small)*
