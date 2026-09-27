# TimeTrack — Frontend

Angular 21 frontend for the TimeTrack project — standalone components (`bootstrapApplication`, no `NgModule`), zoneless change detection (no `zone.js`), `OnPush` and signals throughout.

[Overview and demo](../README.md) · [State](#state-management-approach) · [Patterns and source](#key-patterns) · [Tradeoffs](#tradeoffs) · [Run](#how-to-run-alone) · [Tests](#tests)

**Testing status:** two route guards (`roleMatch`, `oneTimeSecretGuard`) and the error and date helpers have behaviour tests; the HTTP service and `PendingApprovals` tests are planned.

---

## Folder structure

```
timetrack/src/
├── app/
│   ├── app.config.ts            ← providers: router + title strategy, HttpClient + auth interceptor, Material defaults
│   ├── app.routes.ts            ← the route table, with its guards and per-route titles
│   ├── layout/
│   │   └── shell/               ← MatSidenav + toolbar around the guarded routes; /login renders outside it
│   ├── core/
│   │   ├── guards/              ← authGuard, managerGuard, noAuthGuard, roleMatch (CanMatchFn), oneTimeSecretGuard (CanDeactivateFn)
│   │   ├── interceptors/        ← attaches the Bearer token; a token-bearing 401 ends the session
│   │   ├── services/            ← one stateless HTTP service per API resource: auth, entry, project, user, report
│   │   ├── state/               ← PendingApprovals — the sidebar badge's count, the one app-wide number besides the session
│   │   └── strategies/          ← AppTitleStrategy — appends the brand to every page title
│   ├── pages/
│   │   ├── login/               ← the one page rendered outside the shell; shows the session-expired notice and focuses the email field on load
│   │   ├── dashboard/           ← employee-dashboard/ and manager-dashboard/, two variants of /dashboard
│   │   ├── entries/             ← the page, plus entry-list/ (sortable table) and entry-dialog/ (create / edit)
│   │   ├── projects/            ← manager only, plus project-dialog/
│   │   ├── approvals/           ← manager only — the SUBMITTED queue
│   │   ├── team/                ← manager only, plus user-dialog/ and generated-password-dialog/
│   │   └── reports/             ← manager only — monthly summary and two hours tables
│   └── shared/
│       ├── components/          ← used by more than one page — see Shared components below
│       ├── models/              ← interfaces mirroring the backend DTOs, plus the runtime guards isAuthResponse, isRole and isApiError
│       └── busy-ids.ts · dates.ts · focus.ts · validators.ts ← small helpers several pages import (in-flight ids, dates, focus hand-back, notBlank)
├── environments/                ← apiUrl — localhost for ng serve, the hosted API for the production build
└── styles/                      ← material-theme.scss plus the _dialog, _page and _table partials every page shares
```

---

## State management approach

- **Signals for local state** — the page component under `pages/` owns every signal for its route and fetches on its own load, so there is no cross-page cache to go stale.
- **Services for shared state, and only two of them hold any** — `core/services/` issue the call and map the response but store nothing; `AuthService` keeps the session in a signal written to `localStorage` on login and logout, and `PendingApprovals` keeps the badge count, because both outlive every route.
- **Coordinator pattern for page orchestration** — the page holds the state and passes it down through `input()`, children emit `output()` events it acts on, and a form dialog owns its own save while the page refetches when it closes.

---

## Key patterns

The [route table](timetrack/src/app/app.routes.ts), [Entries page](timetrack/src/app/pages/entries/entries.ts) and [shared state holder](timetrack/src/app/core/state/pending-approvals.ts) show the main boundaries: routes select access, pages own their requests, and only state shared across routes lives at the root.

### Session and role boundaries

- **Guards and interceptor** — `authGuard` and `managerGuard` protect routes; the interceptor attaches the token and handles a token-bearing `401` once, while login failures stay on the form.
- **Role-aware pages** — Entries shows employees their own actionable rows and managers the company list; the sidebar exposes the routes each role can use.
- **Self-review excluded** — Approvals hides actions on the manager's own rows using the login response's `id`; the API independently enforces the refusal.
- **Role-based route matching** — two `/dashboard` declarations use `roleMatch`, keeping each dashboard's state and template in its own component.
- **Runtime session validation** — `isAuthResponse` checks both the login payload and stored session before use; malformed storage is removed and the login screen explains the ended session.
- **Overlay cleanup** — the shell closes Material dialogs on destruction, so an expired session returns to a clean login screen without importing Material into auth services.

### Loading, state and tables

- **Coordinated loads** — `forkJoin` combines dependent page data into one success or error outcome, preventing half-loaded dashboards.
- **Latest request wins** — each page's `reload$` uses `switchMap`, so a slow response cannot overwrite a newer filter or page selection.
- **Server paging and sorting** — paginator and sort events become API parameters; aggregate cards use report queries or `totalElements`, never a sum of one page.
- **Page recovery after writes** — Entries and Approvals request the last valid page when a mutation empties the current one, always moving the index down to avoid a retry loop.
- **Concurrent row actions** — `ReadonlySet` helpers track every busy id and return a new set for signal notification; each handler refuses a second press while its row is saving.
- **Shared pending count** — `PendingApprovals` exposes a readonly signal refreshed after reviews, so the queue and sidebar use the same count.
- **Signals with OnPush** — templates consume signals and the shell derives role navigation with `computed()`, keeping state changes explicit.

### Forms and one-time credentials

- **Dialogs own their save** — the form stays open for API errors and closes with an outcome such as `'saved'` or `'submitted'`; the page refetches and announces that outcome.
- **Typed error handling** — the `ApiError` guard provides a fallback for non-API failures, and `fieldErrors` maps server messages onto controls through `setErrors()`.
- **Matching blank validation** — `notBlank` complements `Validators.required` where whitespace is invalid; login and current-password fields follow their credential-verification rules.
- **Saving and dismissal** — form dialogs disable fields during a write; `refocusAfterFailedSave()` returns focus to the first invalid field or error line, and the change-password dialog blocks backdrop dismissal and Escape during its request.
- **Discard confirmation** — `confirmDiscard()` preserves the original touched state around the confirmation dialog's asynchronous focus changes, using explicit Keep editing / Discard actions.
- **One-time secret navigation guard** — `oneTimeSecretGuard` protects Team from request dispatch until the password dialog closes; those dialogs opt out of navigation closure, and a canceled Back restores history with `canceledNavigationResolution: 'computed'`.

### Accessibility and presentation

<details>
<summary>Focus recovery, responsive tables, shared styles and accessible feedback</summary>

- **Stable alert regions** — login and form dialogs keep their `role="alert"` line mounted and change its text; page-level errors use a plain `.page-error` paragraph independent of form-field styles.
- **Explicit focus return** — the change-password dialog returns to the account button after its menu disappears; entry deletion returns to a surviving header control.
- **Focus after row movement** — Projects keeps one toggle action, then uses `afterNextRender` to recover focus after sorting moves its row, only if focus was lost to the body.
- **Focus on failed reloads** — page `catchError` paths focus the heading when a retry or post-write refetch replaces the pressed control with an error state.
- **Keyboard-scrollable tables** — read-only report and recent-entry wrappers use `tabindex="0"`, `role="group"` and a heading-based accessible name.
- **Rejection notes on narrow screens** — a responsive second copy appears below the status; `display: none` removes the inactive copy from both layout and the accessibility tree.
- **Shared style boundaries** — global `_dialog`, `_page` and `_table` partials keep repeated layouts consistent, including overlays rendered outside their opener's DOM.
- **Pinned actions** — `stickyEnd` keeps table actions reachable while descriptive columns scroll.
- **Material tokens** — theme and component overrides avoid coupling styles to private internal CSS classes.
- **Route titles** — `AppTitleStrategy` appends the brand once and supplies a fallback title when no route title resolves.
- **Responsive drawer** — `BreakpointObserver` switches between the side rail and overlay drawer; navigation completion or a skipped same-route navigation closes it.
- **Password visibility controls** — a fixed accessible name and `aria-pressed` expose the toggle state, while preventing the mouse default keeps typing focus in the input.

</details>

---

## Shared components

| Component | Why it is shared, not in a feature folder |
|---|---|
| `status-badge` | Entries, Approvals and the employee dashboard draw an entry's status, so one component owns the four status colours and their contrast |
| `confirm-dialog` | Deleting an entry, deactivating a project or a member and resetting a password all ask the same yes/no question; `confirm-discard.ts` reuses it for the three form dialogs' "discard changes?" |
| `reject-dialog` | Approvals and the manager dashboard's pending list both reject an entry, and both need the same mandatory rejection note |
| `change-password-dialog` | Opened from the shell's user menu by either role, on any page — an action on the logged-in user, not a route, so no page folder owns it |
| `logo` | Login page (branding panel and card) and the shell toolbar — one SVG sized by each host's own class through `:host`, instead of a copy per page |
| `stat-card` | Both dashboards, Projects, Team and Reports — one outlined card with its own pulsing skeleton, so a real `0` and "not loaded yet" never look the same on any page |

---

## Tradeoffs

- **Signals over NgRx** — page-owned state and two shared values do not need a central store; given up: an action log and replayable DevTools timeline.
- **Angular Material over custom components** — shared interaction and accessibility primitives reduce bespoke UI work; given up: unrestricted styling beyond supported tokens and overrides.
- **Self-saving dialogs over returning form values to the page** — API field errors stay under the open form; given up: dialogs depend on HTTP services and the page must refetch after success.
- **A persistent password dialog over a snackbar** — a generated secret cannot vanish on a timeout; given up: an explicit Done step before leaving Team.
- **Local table sorting over new API sort parameters** — Projects and Team already receive complete collections; given up: client work as those lists grow, plus possible collation differences for Team's locale-aware name sort.
- **A full pending queue over a current-month default** — managers see older submissions immediately; given up: the first queue query is not restricted by month.
- **Active-project filters over a catalogue reconstructed from entries** — the API supplies the allowed projects and entries are paged; given up: employees cannot filter directly to a project archived since their work, though month/status filters still reach those rows.

<details>
<summary>Further interaction, layout and loading tradeoffs</summary>

- `disabledInteractive` on Login over disabling its form — focus stays usable after failure; the handler must prevent duplicate submission.
- A fixed mobile login offset over vertical centring — opening the keyboard does not recenter the form; tall phones retain empty space below.
- A read-once expiry flag over a login query parameter — reloads do not replay the notice; it cannot survive a full page reload or be linked.
- Back closing Change password over disabling navigation closure — browser navigation keeps its normal dismissal behaviour; leaving mid-save can lose confirmation of a change the server completed.
- Ellipsis on the account name over hiding it — the visible trigger keeps its accessible name; long names are visually truncated on phones.
- Compact dialog cards over a separate full-screen layout — one form layout serves all sizes; longer forms scroll inside the card.
- Monthly cards over a weekly total — the API's aggregate is authoritative; the dashboard offers no weekly figure.
- Disabling Log hours until projects load over opening with an empty catalogue — the dialog gets a complete snapshot; loading feedback must explain the unavailable action.
- A separate recent-entry table over reusing `EntryList` — the dashboard avoids irrelevant sorting/actions; common cell templates are repeated.
- Dimming existing figures over skeletons on every write — repeated approvals preserve visual continuity; previous numbers stay visible under `aria-busy` until refreshed.
- Keeping report rows but resetting summary cards over one loading treatment — detail remains readable while totals show loading; tables and cards deliberately present different intermediate states.
- Container queries over viewport-only card layouts — the sidenav's width is accounted for; the container cannot size itself from its contents.
- Wrapping fixed-width filters over shrinking their fields — selected values stay readable; narrow screens use multiple rows.
- Word-aware table columns with a cap over fixed minimum widths — short values waste less room; a browser ignoring the cell cap can still let a long unbroken name widen the table.
- `en-GB` dates over the default US order — day-first input matches the intended users; the date-fns adapter adds dependencies.
- Page-local paginator defaults over root providers — the measured initial bundle fell from 665 kB to 448 kB; another paginated page repeats the defaults.
- Hiding Approvals descriptions on narrow layouts over showing every column — review actions stay usable; descriptions are absent there, while rejection notes remain under status.
- Hours beside the employee over the wireframe's column order — the quantity being reviewed stays visible on phones; project and date may require horizontal scrolling.
- Current-month Entries over all months — the timesheet opens on bounded, relevant work; a new month can be empty and offers Show all months.
- A teal pending badge over error red — pending work is distinct from rejection; it attracts less attention.
- Year-bearing recent-entry dates over `d MMM` — an unbounded recent list cannot imply the current year; its date column needs more space.
- Exempting login/current credentials from the client blank check over applying it everywhere — verification reaches the server's rules; the client may need a server response to explain a refusal.

</details>

---

## How to run alone

Start the backend first — `ng serve` builds the development configuration, whose `environment.development.ts` points `apiUrl` at `http://localhost:8080/api`, and the API already allows the `http://localhost:4200` origin. See [backend/README.md → How to run alone](../backend/README.md#how-to-run-alone). No environment variable is needed: the production build swaps in `environment.ts`, which points at the hosted API.

```bash
cd projects/07-timetrack/frontend/timetrack
```

```bash
npm install
```

```bash
ng serve
```

Open `http://localhost:4200` and log in with a seeded account.

---

## Tests

Vitest + TestBed, run from `timetrack/` with `npm test -- --watch=false`. The six files below hold the CLI's generated creation tests; their HTTP request/response/error and state assertions are planned, the HTTP suites with `provideHttpClientTesting()` + `HttpTestingController`:

- `AuthService` *(planned)*
- `EntryService` *(planned)*
- `ProjectService` *(planned)*
- `UserService` *(planned)*
- `ReportService` *(planned)*
- `PendingApprovals` *(planned)*

Implemented behaviour tests, outside the services:

- `roleMatch` — matches only a session holding the given role, and nothing without a session
- `oneTimeSecretGuard` — keeps `/team` while a generated password is on screen, and always lets an ended session leave for `/login`
- `apiErrorMessage` / `placeFieldErrors` — the server's message or the fallback, and each `fieldErrors` entry placed under its own control
- `dates` — a local `YYYY-MM-DD` that never shifts a day through UTC, and the month options crossing a year boundary
