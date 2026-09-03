# Project 06 — HR Portal · Improvement backlog

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-16

**Overall quality:** Good — every planned pattern is present and used meaningfully, the smart/dumb
split and signal+`effect()` persistence are consistent across the app, and the persisted session is
now credential-free, calendar dates are serialized from the local clock and the unique-email rule is
enforced at the dialog's save exit, so nothing at High priority is outstanding.

---

## High

*No open High tasks.*

## Medium

- [ ] **[Medium]** `[frontend]` — Parameterize the six remaining `dialog.open` calls with their result types: `deactivate-guard.ts:16`, `department-page.ts:23`, `employee-dialog.ts:132`, `employee-page.ts:83,100,122` all leave `MatDialog.open<T, D, R>`'s `R` at its `any` default, so every `afterClosed()` yields `Observable<any>` and the `confirmed` / `data` callbacks are unchecked — a renamed field on `Employee` would compile and reach the service as `undefined`. Type each `MatDialogRef` at the dialog end too, so the contract is checked at both ends. *(Effort: Small)* *(raised 2026-09-03 while triaging the leave-request `dialog.open` task — same defect shape, six other call sites)*
- [ ] **[Medium]** `[frontend]` — Make the dashboard stat cards real links: `dashboard-page.html:9,18,32,41,104` put `routerLink` on `<mat-card>`, so they navigate on click but have no `href`, are not Tab-reachable, and announce no link role. Wrap the content in an `<a routerLink>`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Decompose `dashboard-page` into presentational children. It is the one outlier on the smart/dumb axis: every other page (`employee-page`, `department-page`, `leave-request-page`) splits into table/filters/dialog children, while the dashboard holds all markup + computed state in one component (`dashboard-page.ts:1-53`, 139-line template). Follow the convention the other three set. *(Effort: Medium)*

## Low

- [ ] **[Low]** `[frontend]` — Signal that the interceptor's token is a stub: `auth-interceptor.ts:7,12` attaches `Authorization: Bearer ${email}` — the "token" is the user's email, not a real token. Inert without a backend, but the `Bearer` naming reads as functioning auth to an interviewer. Add a comment marking it a placeholder for a real backend token. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Decide and document one add/edit mechanism: `department-page` uses a routed form (`department-form`) while `employee-page` and `leave-request-page` use a `MatDialog` for the same job. Both are defensible — the routed form is what makes the `CanDeactivate` guard demonstrable — so if it stays, note the reason in PLANNING rather than leaving it looking accidental. *(Effort: Small)*

- [ ] **[Low]** `[frontend]` — Guard the `localStorage` read in `auth.service.ts:21`: `JSON.parse(localStorage.getItem('currentUser') ?? 'null')` runs in a **field initializer**, so a corrupt or truncated value makes `JSON.parse` throw while Angular is constructing the root `AuthService` — the whole app fails to bootstrap and renders a blank page, and because the bad value stays in storage the failure survives every reload. The `?? 'null'` fallback only covers a *missing* key, never an invalid one. Wrap the parse and fall back to `null`. *(Effort: Small)* *(raised 2026-09-03 while triaging the plaintext-password task)*

- [ ] **[Low]** `[frontend]` — Fix the `How to run` path in `README.md`: it still says `cd dev-learning/angular/06-hr-portal`, a path the repository reorg removed when `angular/` became `projects/`, so the clone-and-run instructions a recruiter follows fail at the second command. *(Effort: Small)* *(raised 2026-08-31 while triaging the same defect in project 02)*

---

## Closed

### Frontend

#### High

- 2026-09-03 · **[High]** `[frontend]` — unique-email rule enforced at the dialog's save exit, not only on "Next" → README, PLANNING key patterns, coverage architecture/junior (new bullet, marked ✅ 06-hr-portal)
- 2026-09-03 · **[High]** `[frontend]` — calendar dates serialized from the local clock via a shared `toLocalDateString()` → README, PLANNING key patterns, coverage javascript/junior (already marked ✅ 03)
- 2026-09-03 · **[High]** `[frontend]` — password no longer persisted; localStorage holds a credential-free `SessionUser` → README, PLANNING, coverage security/junior

#### Medium

- 2026-09-03 · **[Medium]** `[frontend]` — login fake latency is `timer()` + `takeUntilDestroyed(destroyRef)`, so an orphan callback can no longer log the user in → README What I learned, PLANNING key patterns (new row), coverage angular/junior (new *injection context* bullet, marked ✅ 06-hr-portal)
- 2026-09-03 · **[Medium]** `[frontend]` — leave-request `dialog.open` parameterized with a `LeaveRequestFormResult` derived from the model, typed at both ends → README What I learned, PLANNING key patterns (new row), coverage typescript/junior (already covered and marked)
- 2026-09-03 · **[Medium]** `[frontend]` — leave-request date controls typed `FormControl<Date | null>`, both double casts and both `!` gone → README What I learned, PLANNING key patterns (new row), coverage angular/junior + typescript/junior (all already covered and marked)
- 2026-09-03 · **[Medium]** `[frontend]` — employee dialog email errors gated on `touched` like every sibling field → README What I learned, PLANNING validation rules (new row), coverage angular/junior (already covered + already marked ✅ 03)
- 2026-09-03 · **[Medium]** `[frontend]` — employee `status` query param validated too, and the union carried into the filter child's `input()`/`output()` → README architecture decisions, PLANNING validation rules + key patterns (new row), coverage angular/junior (new bullet, marked ✅ 06-hr-portal) and javascript/junior (marked ✅ 06-hr-portal)
- 2026-09-03 · **[Medium]** `[frontend]` — `status` query param validated by a type predicate over an `as const` list → README What I learned + architecture decisions, PLANNING validation rules + key patterns, coverage angular/junior (new bullet, marked ✅ 06-hr-portal) and typescript/junior (new bullet + 3 marked ✅ 06-hr-portal)
- 2026-09-03 · **[Medium]** `[frontend]` — app-shell scroll fix already complete — DECISION, no code change → `html { height: 100% }` lives in `material-theme.scss:8`, loaded before `styles.css` per `angular.json:27`
- 2026-09-03 · **[Medium]** `[frontend]` — leave-request transitions guarded in the service, refusal reported to the caller → README architecture decisions + What I learned, PLANNING business rules + key patterns, coverage architecture/junior (2 new bullets, marked ✅ 06-hr-portal)
- 2026-09-03 · **[Medium]** `[frontend]` — entity ids generated by `crypto.randomUUID()` inside the owning service, `Department.id` now a `string` → README architecture decisions + What I learned, PLANNING key patterns, coverage architecture/junior (new bullet, marked ✅ 06-hr-portal) and angular/junior (new bullet, marked ✅ 06-hr-portal)

#### Low

- 2026-09-03 · **[Low]** `[frontend]` — login controls declared `nonNullable` and read with `getRawValue()`, both `!` gone → coverage angular/junior + typescript/junior (already covered and marked); README and PLANNING already represent it via the typed-control entries
- 2026-09-03 · **[Low]** `[frontend]` — `editId !== null` replaces the truthiness test in `department-form.ts` → closed inside the `crypto.randomUUID()` task, coverage typescript/junior (marked ✅ 06-hr-portal)

### Backend

*n/a — Angular-only project.*

---

## Learning objectives

Against PLANNING's "Key patterns introduced" table (34 concepts):

**34 ✅ Demonstrated · 0 ⚠️ Shallow · 0 ❌ Missing**

Notes on two concepts that look like gaps but are not:
- `CanDeactivateFn` is wired only on the department-form routes (`app.routes.ts:37-38, 46-47`). The employee create/edit flow is dialog-based, so a route guard structurally does not apply there — the concept is demonstrated where it can be.
- Multiple filter signals + `computed()` chained with `&&` uses `''` as the no-filter default rather than the literal `'all'` the table names — same pattern, different sentinel.

## Verified clean (not findings)

- `innerHTML` / `[innerHTML]` and `bypassSecurityTrust*` — zero hits across `src/app`.
- `localStorage` in the four domain services — stores the app's own employee/department/leave data. Fine per the standard; only the `auth.service.ts` password (High, above) is sensitive.
- Styling tokens — every component sources colour from `var(--token)`. The raw hex in `styles.css:6-13` is the `:root` token *definition*, which is where hex belongs.
- Empty states — every `mat-table` has `*matNoDataRow`; the dashboard's non-table lists use `@empty`.
- Tests — out of scope for this project (testing enters the roadmap at project 07).
