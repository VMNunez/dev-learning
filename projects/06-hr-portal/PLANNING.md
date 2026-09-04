# Project 06 — HR Portal

An HR management portal used by two kinds of people: an **HR admin**, who manages employees and
departments and decides on leave requests, and an **employee**, who checks the company data they are
allowed to see and asks for leave. Built with role-based access, lazy loading, HTTP interceptors and a
full app shell with toolbar and sidebar navigation.

---

## Why this project

- **The domain problem:** HR work is two jobs on one dataset — an admin maintaining employees,
  departments and leave decisions, and an employee who may only see and request. A spreadsheet cannot
  keep those two views apart; an app with roles can.
- **The technical gaps it closes:** advanced Angular routing — functional guards (`CanActivateFn`,
  `CanDeactivateFn`), lazy loading per route, a functional HTTP interceptor, and role-based access
  enforced in the router rather than in the templates.
- **Why a consultancy recognises it:** role-gated modules, a guarded app shell and a token interceptor
  are the exact skeleton of the internal enterprise apps NTT Data / Capgemini staff junior Angular
  developers on.
- **What it adds over project 05:** project 05 was a single-role CRUD app with eager routes; this one
  introduces authentication, two roles, lazy-loaded feature areas and a persisted session.

---

## Key features

- Login and logout with role-based access (admin / employee)
- Admin can manage employees (full CRUD) and departments (full CRUD)
- Employees see their own leave requests on the dashboard and can request leave
- Admin can review and approve or reject leave requests
- Route guards protect every page — unauthenticated users are redirected to login
- Admin-only routes are blocked for employees
- `CanDeactivate` guard warns before leaving a form with unsaved changes
- HTTP interceptor attaches the auth token to every request
- Sidebar navigation shows only the links the current role can access
- Role-aware dashboard with different content per role

---

## Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Framework and UI | Angular + Angular Material v19 | Standalone components; Material supplies every control, table and dialog |
| Application structure | Core/Feature/Shared architecture | Singleton logic (guards, interceptors, `AuthService`) is instantiated once in `core/`, feature areas own their own pages under `pages/`, and only genuinely reused UI lives in `shared/`, so a feature can be deleted without touching the other two folders. Domain interfaces sit in a top-level `models/` folder shared by all three |
| Routing | Lazy loading for all feature routes | Admin-only code (employees, departments) is never downloaded by an employee session, so the initial bundle carries only login and the shell |
| Access control | Functional guards (`CanActivateFn`, `CanDeactivateFn`) | A guard is a function that can `inject()` its dependencies, so authentication and authorisation stay two composable guards stacked on a route instead of one class that has to know about both |
| HTTP | Functional interceptor (`HttpInterceptorFn`) | The token is attached in one place, so no service can forget it and no service has to know how the session is stored |
| State and persistence | Signals + `effect()` over localStorage | There is no backend in this project, and the `effect()` keeps the stored copy a consequence of the signal rather than a second source of truth that every writer has to remember to update |

---

## Folder structure

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth-guard.ts            ← redirect to login if not authenticated
│   │   ├── admin-guard.ts           ← redirect to dashboard if not admin
│   │   ├── no-auth-guard.ts         ← keep an authenticated user out of /login
│   │   └── deactivate-guard.ts      ← confirm before leaving a dirty form
│   ├── interceptors/
│   │   └── auth-interceptor.ts      ← attach the Bearer header to every request (placeholder value, no backend issues a token)
│   └── services/
│       ├── auth.service.ts          ← currentUser signal + login/logout, persisted to localStorage
│       ├── employee.service.ts      ← employees signal + CRUD, persisted to localStorage
│       ├── department.service.ts    ← departments signal + CRUD, persisted to localStorage
│       └── leave-request.service.ts ← leaveRequests signal + add/updateStatus, persisted
├── models/
│   ├── user.model.ts                ← User + credential-free SessionUser + role union
│   ├── employee.model.ts            ← Employee shape and status union
│   ├── department.model.ts          ← Department shape
│   └── leave-request.model.ts       ← LeaveRequest shape and status union
├── pages/
│   ├── login-page/                  ← credential form, writes the session
│   ├── dashboard-page/              ← role-aware: admin totals vs the employee's own requests
│   │   └── components/
│   │       ├── stat-card/           ← presentational linked metric card
│   │       ├── dashboard-panel/     ← presentational card shell, rows projected with ng-content
│   │       └── panel-item/          ← presentational row, optional status badge
│   ├── employee-page/               ← admin only: coordinator owning filters + employee state
│   │   └── components/
│   │       ├── employee-filters/    ← presentational filter inputs
│   │       ├── employee-table/      ← presentational table, role-aware columns
│   │       └── employee-dialog/     ← dual-mode add/edit dialog with MatStepper
│   ├── department-page/             ← admin only: coordinator owning department state
│   │   ├── components/
│   │   │   └── department-list/     ← presentational list
│   │   └── department-form/         ← routed create/edit form, guarded by deactivate-guard
│   └── leave-request-page/          ← shared route: admin reviews all, employee sees own
│       └── components/
│           ├── leave-request-filters/ ← presentational filter inputs
│           ├── leave-request-table/   ← presentational table, role-aware columns and actions
│           └── leave-request-dialog/  ← employee's new-request form
└── shared/
    ├── components/
    │   └── confirm-dialog/          ← reusable yes/no dialog, returns a boolean
    └── utils/
        └── date.util.ts             ← local-clock YYYY-MM-DD serialization
```

### Routes

| Path | Guards | Access |
|---|---|---|
| `''` | — | redirects to `login` |
| `login` | `noAuthGuard` | public (an authenticated user is bounced to the dashboard) |
| `dashboard` | `authGuard` | shared — content differs by role |
| `employees` | `authGuard`, `adminGuard` | admin only |
| `departments` | `authGuard`, `adminGuard` | admin only |
| `departments/new` | `authGuard`, `adminGuard`, `deactivateGuard` | admin only |
| `departments/edit/:id` | `authGuard`, `adminGuard`, `deactivateGuard` | admin only |
| `leave-requests` | `authGuard` | shared — admin reviews all, employee sees own |
| `**` | — | redirects to `login` |

Every page folder in the tree above has exactly one route here, and every route loads a page that
exists; the dialogs and tables under `components/` are rendered by their page, never routed to.

---

## Business rules

There is no backend: every rule below is enforced in the Angular app — guards for access, reactive-form
validators for input, and the owning service for state transitions. That is the honest limit of a
localStorage session and is stated here rather than left to be discovered.

### Access rules

| Rule | Enforced by |
|---|---|
| Only an authenticated session may reach any page except `login` | `authGuard` on every route |
| An authenticated user may not reach `login` again | `noAuthGuard` on `login` |
| Only `admin` may reach `employees`, `departments`, `departments/new`, `departments/edit/:id` | `adminGuard` stacked after `authGuard` |
| Only `admin` may create, edit or delete an employee or a department | those routes are admin-only; no employee-reachable page renders those actions |
| Only `admin` may approve or reject a leave request | the approve/reject actions render only when `role() === 'admin'`, and the `actions` column is absent from the employee `displayColumns` |
| An `employee` sees only their own leave requests | the page `computed()`s `employeeEmail === currentUser().email`; the admin branch returns the unfiltered list |
| An `employee` may create a leave request only for themselves | the page sets `employeeEmail` from `currentUser()`, never from a form field |
| The sidebar shows only the links the current role can reach | `filteredNavLinks = computed()` over the same `isAdmin` check the guards use |

**Ownership note.** An employee never mutates another user's data: the only write an employee session
can reach is creating their own leave request, and its owner field is taken from the session rather
than from input. The status transition — the one write over a record the employee owns — is admin-only.

### Validation rules

| Entity | Rule |
|---|---|
| Login | email and password both required; a pair matching no seeded user fails the login and leaves the session `null` |
| Employee | `firstName`, `lastName`, `department`, `position`, `status` required; `email` required and a valid email address |
| Employee | `email` unique across employees — checked at the form's **save exit**, not in the `Next` handler, because a linear stepper can re-enter a completed step from its header; a duplicate sets `duplicateEmail` on the control |
| Department | `name` and `description` required |
| Leave request | `startDate`, `endDate` and `reason` required; dates serialized from the local clock as `YYYY-MM-DD` |
| Any form field | its `mat-error` renders only once the control is `touched` — a `required` validator fails from construction, so a message gated on validity alone accuses the user before the field has been reached |
| Any dirty routed form | leaving it must be confirmed — `deactivateGuard` on the department form |
| The persisted session | it is read back through a shape check, not an `as` assertion — the parse runs in the root service's field initializer, so a truncated entry throws out of bootstrap and a valid value of the wrong shape yields a session with no role that the guards read as logged in |
| Any status filter read from the URL | the value is checked against the permitted list before it is applied and the filter falls back to its no-filter default otherwise (`all` on leave requests, `''` on employees) — a query param is outside input the app controls, so it is validated at the read rather than asserted into the union |

### Leave request state machine

A new request is always created as `pending`; the creator cannot choose its status.

```
          ┌──────────────┐
          │   pending    │   ← created by the employee
          └──────┬───────┘
                 │  admin decides (approve / reject)
        ┌────────┴────────┐
        ▼                 ▼
  ┌───────────┐     ┌───────────┐
  │ approved  │     │ rejected  │
  └───────────┘     └───────────┘
       (terminal)        (terminal)
```

`pending` is the only state with outgoing transitions, and both `approved` and `rejected` are
deliberately terminal — a decided request is history, so there is no re-open path. The rule is enforced
in `LeaveRequestService.updateStatus()`, which refuses any move out of a non-`pending` state and any
move back into `pending`, and reports the refusal to its caller; the approve / reject buttons rendering
only while `status === 'pending'` is presentation of that rule, not the rule itself.

### Employee status

`active` and `inactive` are set directly by the admin on the employee form — a field, not a workflow —
so there is no state machine to diagram: either value may be chosen at creation and changed at any edit.

---

## State management

- `signal<SessionUser | null>` in `AuthService` — the credential-free shape — synced to localStorage with `effect()`
- `signal<Employee[]>` in `EmployeeService`, `signal<Department[]>` in `DepartmentService`,
  `signal<LeaveRequest[]>` in `LeaveRequestService` — each synced to localStorage with `effect()`
- `computed()` for filtered lists, role checks (`isAdmin`), and filtered nav links
- All signals stored as references (no `()`) in child components to stay reactive

### Shared state — who owns what

There is no backend, so the four root services are the single source of truth for the data every page
reads. Each collection read by more than one page is owned by exactly one service; pages read its
signal and never copy it into local state:

| Data | Owner | Read by | Ruling |
|---|---|---|---|
| Session user | `AuthService` (`currentUser` signal) | app shell, every guard, dashboard, leave-requests | One owner: the session is what the guards and the role-aware UI both branch on, so a second copy would let the sidebar and the router disagree. |
| Employees | `EmployeeService` (`employees` signal) | employees page, dashboard, employee dialog | One owner: the dashboard's totals must move the moment the employees page edits a row, which independent fetching cannot guarantee. |
| Departments | `DepartmentService` (`departments` signal) | departments page, department form, dashboard, employee dialog | One owner: the employee dialog's department picker must offer exactly the departments the departments page last saved. |
| Leave requests | `LeaveRequestService` (`leaveRequests` signal) | leave-requests page (both roles), dashboard | One owner, **not one signal per role**: the page filters the same signal — an admin sees every request, an employee `computed()`s its own by email — so approving a request updates the employee's view and the dashboard's pending count without a refetch. |

Role is a **filter over shared state, not a second store**: the leave-requests page and the dashboard
derive their role-specific views with `computed()` from the owning service's signal.

---

## Design system

Recorded after the fact from the built app — projects 01–05 carry no design section, so no
cross-project identity contrast is on record to compare against.

| Decision | Value | Where it lives | Consumed by |
|---|---|---|---|
| Theming mechanism | `mat.theme()` on `html`, Material 3 system variables — never CSS overrides of component internals | `src/material-theme.scss` | every Material component |
| Palette | `mat.$azure-palette` primary, `mat.$blue-palette` tertiary — cool blue, light-neutral surface | `src/material-theme.scss` | toolbar, sidenav, buttons, form fields |
| Typography | `Roboto` through the Material type scale | `src/material-theme.scss` | all text roles |
| Density | `density: 0` — Material's default, chosen so the CRUD tables keep comfortable row height | `src/material-theme.scss` | tables, form fields, buttons |
| Status tokens | `--color-active-*`, `--color-inactive-*`, `--color-pending-*`, `--color-rejected-*` bg/text pairs, declared once | `src/styles.css` `:root` | employee table, leave-request table, dashboard cards |
| Neutral tokens | `--color-tr-hover`, `--color-link`, `--text-secondary`, `--color-card-hover`, each aliasing a `--mat-sys-*` variable | `src/styles.css` `:root` | tables, cards, secondary text |
| Elevation and shape | Material defaults; the app shell is the only hand-written layout (`app-root { overflow: hidden }`) | `src/styles.css`, `src/app/app.css` | app shell |
| Dark mode | **Out** — `color-scheme: light` is pinned in `material-theme.scss`. The demo targets one light theme so the status token pairs need only one contrast pass | `src/material-theme.scss` | whole app |

**Accessibility floor:** every status is text **and** colour (the badge prints `Active` / `Pending`,
the token pair only tints it), so no meaning is carried by colour alone; there are no icon-only buttons
in the app, so no icon needs a label; focus is Material's default ring, kept visible by the app-shell
override `a.active:focus:not(:hover)::before { opacity: 0 }`, which suppresses the *hover* wash and not
the focus ring — except the dashboard stat cards, whose wrapping anchor has no Material ring of its own
and declares a `:focus-visible` outline in `stat-card.css`. Every navigating surface is an `<a>`, so
each one is reachable with Tab and announced as a link.

**Motion:** none beyond Material's own component transitions — nothing loops, so there is no motion
budget to honour and no `prefers-reduced-motion` block to write.

**Known deviation:** component stylesheets still set their own `font-size` (dashboard, forms, lists)
instead of mapping to the Material type scale. The tokens above are centralised; the type scale is not.

### Per-page UI

| Page | Dominant surface | Material components | Empty state | Role variation |
|---|---|---|---|---|
| `login` | Centred card | `mat-card`, `mat-form-field`, `mat-error`, `matInput`, `matButton` | — (form) | none |
| `dashboard` | Card grid | `mat-card`, `mat-icon` | "no data" block in the template | admin totals vs the employee's own requests |
| `employees` | Data table | `matSort`, `mat-paginator`, `mat-stepper`, `mat-select`, dialog | `matNoDataRow` | admin only; role-aware `displayColumns` |
| `departments` (+ `new` / `edit/:id`) | Data table + routed form | `matSort`, `mat-paginator`, `mat-form-field` | `matNoDataRow`, empty-list icon | admin only |
| `leave-requests` | Data table | `matSort`, `mat-paginator`, `mat-datepicker`, `mat-select`, dialog | `matNoDataRow` | admin reviews all, employee sees own |

There is no backend, so no page has a network loading or error state; failures surface as form
validation and `MatSnackBar` feedback instead.

**Two add/edit surfaces, on purpose.** Departments create and edit through a routed form while
employees and leave requests use a `MatDialog` for the same job. A dialog has no route, and
`CanDeactivateFn` is a *route* guard, so the unsaved-changes confirmation cannot be attached to one:
the routed form is the only surface in this project where that concept is demonstrable. Departments
carry the fewest fields, so they pay the least for the extra navigation, and the two dialog flows keep
the user on the table they were reading. Making all three the same would cost the project either the
guard or the dialog pattern.

**Responsive intent:** the dashboard card grid collapses at 1024px and 768px; the data tables and the
`MatSidenav` shell target desktop and are not reflowed — a deliberate scope limit for a demo.

---

## Key patterns introduced

| Pattern | Where used |
|---|---|
| Core/Feature/Shared layering | `core/` singletons, `pages/` features, `shared/` reusable UI, top-level `models/` for the domain interfaces |
| Coordinator page component | Filter + table pages own the state; the table and dialog stay presentational |
| `ng-content` over a configuration input | The dashboard's panel wrapper receives its rows as projected markup, so three panels listing different entities share one shell instead of the wrapper growing an input per entity shape |
| Workflow invariant in the owning service | `LeaveRequestService.updateStatus()` refuses a transition out of a decided request and returns whether it applied, so the page's snackbar reports the real outcome |
| Closed value set declared once | `LEAVE_REQUEST_FILTERS`, `EMPLOYEE_STATUS_FILTERS` and `ROLES` are `as const` lists; each union is derived from its list and its members feed the guard and the filter dropdown, so the runtime allow-list and the type cannot drift apart |
| The domain union reaches the presentational child | a filter child's `input()`/`output()` are typed to the union, not to `string`, so a value validated at the query-param read cannot re-widen at the component boundary |
| `CanActivateFn` | `auth-guard.ts` and `admin-guard.ts` |
| Guest guard (`CanActivateFn` inverted) | `no-auth-guard.ts` on `login` — bounces an already-authenticated session to `/dashboard` |
| `router.createUrlTree(['/login'])` | Redirect from a guard |
| `canActivate: [authGuard, adminGuard]` | Stack multiple guards on one route |
| `loadComponent:` with dynamic import | Lazy loading — each page loads on demand |
| `CanDeactivateFn<Component>` | Warn before leaving a dirty form |
| `markAsPristine()` | Reset dirty state after successful save |
| `HttpInterceptorFn` | Attach auth token to every request |
| `req.clone({ setHeaders: { ... } })` | HTTP requests are immutable — must clone |
| `withInterceptors([fn])` | Register functional interceptors in `app.config.ts` |
| Auth persistence pattern | A credential-free `SessionUser` read back through a private parser + `effect()`, the parser validating the stored value's shape before the signal trusts it |
| `??` nullish coalescing | Safe fallback when localStorage value is null |
| Dual-mode dialog | Same dialog handles add and edit via `MAT_DIALOG_DATA` check |
| `inject<Type \| undefined>(MAT_DIALOG_DATA)` | Optional dialog data injection |
| `dialogRef.close(true)` | Return boolean from confirmation dialog |
| `dialog.open<T, D, R>` parameterized | The dialog's result type is named at the call site and on the dialog's own `MatDialogRef`, so `afterClosed()` is checked instead of yielding `any` |
| Multiple filter signals + `computed()` | Chain filters with `&&`; `'all'` as no-filter default |
| `MatDatepicker` + `provideNativeDateAdapter()` | Date input with calendar popup |
| Control typed to what its accessor writes | `startDate` and `endDate` are `FormControl<Date \| null>`, the type `MatDatepickerInput` actually sets, so the submit reads them without an `as unknown as Date` |
| Local-clock date serialization | `toISOString()` returns the UTC day — build `YYYY-MM-DD` from `getFullYear`/`getMonth`/`getDate` |
| Conditional `displayColumns` with `computed()` | Change columns based on role — never use `@if` on `ng-container matColumnDef` |
| `ActivatedRoute.snapshot.queryParamMap.get()` | Read query params on load |
| `[queryParams]` on `routerLink` | Pre-apply a filter when navigating |
| A navigating surface is an `<a>` | `routerLink` writes an `href` only on an anchor, so the dashboard stat cards wrap their `mat-card` in `<a class="stat-card-link">` — the tab stop, the `link` role and the context menu all follow from the `href`, never from the click handler |
| `MatSidenav` app shell | Fixed toolbar + sidebar + scrollable content area |
| `routerLinkActive="active"` + `#rla` | Highlight the active nav link |
| Active link focus fix | `a.active:focus:not(:hover)::before { opacity: 0 }` |
| App shell scroll fix | `html, body { height: 100% }` + `app-root { overflow: hidden }` |
| `filteredNavLinks = computed()` | Show only links the current role can access |
| `isAdmin = computed()` | Single source of truth for role checks |
| Signal reference vs snapshot | Store `service.signal` (no `()`), not `service.signal()` |
| `takeUntilDestroyed(destroyRef)` | Work a page starts is cancelled when the page is destroyed, so a login left in flight cannot navigate an app that already moved on; the `DestroyRef` is passed explicitly because a method is not an injection context |
| `MatSnackBar` | Feedback after every CRUD action |
| `MatStepper` with `[stepControl]` | Multi-step employee creation form |
| Validation at the form's save exit | A linear stepper re-enters a completed step from its header, so a rule checked only in the `Next` handler never runs |
| Service-owned id generation | The owning service takes the entity without its id and stamps `crypto.randomUUID()` — a clock reading collides inside one millisecond, and a caller-built entity spreads the rule across every caller |

---

## Learning steps

All 14 steps are complete — the project is built, merged and deployed.

1. ✅ Set up Core/Feature/Shared folder structure and routing skeleton
   - Done: `Browser:` the app boots at `/` and redirects to `/login`, and an unknown path such as
     `/nope` falls through the `**` route back to `/login`
2. ✅ Build login page with `AuthService` and localStorage persistence
   - Done: `Browser:` valid credentials at `/login` land on `/dashboard` and survive a page reload;
     wrong credentials keep the page and show the error message instead of navigating
3. ✅ Add `auth-guard.ts` and `no-auth-guard.ts` — redirect unauthenticated users to login, and
   already-authenticated users away from it
   - Done: `Browser:` `/dashboard` typed in the URL bar while logged out shows `/login`, and `/login`
     typed while logged in shows `/dashboard`
4. ✅ Add lazy loading — `loadComponent:` for every page
   - Done: `Browser:` the Network tab shows no page chunk on first load, and requests exactly one new
     chunk when `/dashboard` is opened for the first time
5. ✅ Add `admin-guard.ts` — stack with `authGuard` on admin routes
   - Done: `Browser:` `/employees` renders the table for an admin session and redirects an employee
     session away from the page
6. ✅ Add `auth-interceptor.ts` — attach token to every request
   - Done: `Browser:` the Network tab shows the `Authorization` header on a request fired from
     `/employees`, and no header on the login request itself
7. ✅ Build Employee CRUD — table, add/edit dialog, delete confirmation
   - Done: `Browser:` at `/employees` a created employee appears in the table, an edit persists after
     reload, a delete asks for confirmation before removing the row, and the table shows its empty
     state when every employee is filtered out
8. ✅ Build Department CRUD — same patterns as employees
   - Done: `Browser:` at `/departments` a created department appears in the table, an edit persists
     after reload, and the table shows its empty state before the first department exists
9. ✅ Add `deactivate-guard.ts` on the department form
   - Done: `Browser:` leaving `/departments/new` with a dirty form opens the confirm dialog and
     staying keeps the typed values; saving first leaves the route with no dialog
10. ✅ Build Leave Requests — dual view (admin sees all, employee sees own)
    - Done: `Browser:` at `/leave-requests` an admin sees every request with approve/reject actions,
      an employee sees only their own with no actions, and a fresh employee account sees the empty state
11. ✅ Build the `MatSidenav` app shell with toolbar and reactive nav links
    - Done: `Browser:` the toolbar and sidebar stay fixed while the content area scrolls, and the
      sidebar of an employee session lists no admin link
12. ✅ Add role-aware dashboard with `isAdmin = computed()`
    - Done: `Browser:` `/dashboard` shows the admin cards for an admin session and the employee cards
      for an employee session, and a card link pre-applies its filter via `[queryParams]`
13. ✅ Add `MatSnackBar` on all key actions
    - Done: `Browser:` a create, an edit and a delete each raise a snackbar naming the action, and a
      rejected save raises the error snackbar instead
14. ✅ Add `MatStepper` for the employee creation flow
    - Done: `Browser:` the stepper at `/employees` blocks `Next` until the current step's controls are
      valid, and re-entering a completed step from its header still blocks the save when the email
      duplicates an existing employee

**Testing:** none — automated tests enter the roadmap at project 07 per the shared session rules'
"Testing rules" table, so this plan carries no testing steps by design.
