# TimeTrack — Frontend

Angular frontend for the TimeTrack project.

*This README will be completed when the Angular frontend is built (Step 7).*

---

## Folder structure

```
src/app/
├── core/
│   ├── guards/            ← authGuard, managerGuard — route protection
│   ├── interceptors/      ← auth interceptor — attaches JWT to every request
│   └── services/          ← auth, entry, project, user, report services
├── pages/
│   ├── login/
│   ├── dashboard/         ← different content per role
│   ├── entries/           ← employee sees own, manager sees all
│   ├── projects/          ← manager only
│   ├── approvals/         ← manager only
│   ├── team/              ← manager only
│   └── reports/           ← manager only
└── shared/
    ├── components/
    │   ├── confirm-dialog/  ← reusable confirmation before any destructive action
    │   ├── reject-dialog/   ← rejection note input, used in approvals
    │   └── status-badge/    ← coloured badge used in entries, approvals and dashboard
    └── models/              ← TypeScript interfaces for all entities
```

---

## State management approach

- Signals for local component state
- Services for shared state across pages
- Coordinator pattern — page component owns all state, child components receive `input()` and emit `output()`
- `forkJoin` on the dashboard — all stat card API calls run in parallel

---

## Key patterns

*To be filled in when the frontend is complete.*

- `authGuard` + `managerGuard` — route protection per role
- HTTP interceptor — JWT attached automatically to every outgoing request
- Session expiry handled once, in the interceptor — a `401` on a request that carried a token clears the stored session and navigates to `/login`, where the page explains the session expired, so no page re-implements it; a failed login's `401` carries no token and is left to the Login page's own error
- Role-aware UI — same route (`/entries`, `/dashboard`), different data and columns per role
- The UI never offers an action the API will refuse — `/approvals` drops the approve and reject buttons on the manager's **own** submitted rows, which §8 answers with a `403` for segregation of duties, and names who will review them instead; the client learns whose rows they are from the `id` the login response carries, and the API stays the boundary either way
- Role variants of one URL through `canMatch` — `/dashboard` is declared twice and `roleMatch` lets the router load the employee or the manager page, instead of one component branching on the role and holding both variants' state
- Page titles through a custom `TitleStrategy` — each route declares only its page name and `AppTitleStrategy` appends `| TimeTrack` in one place, writing the brand alone when no route resolves a title, because the default strategy writes nothing then and the tab would keep the previous page's name
- `forkJoin` — parallel API calls on dashboard load for stat cards
- Stat cards read aggregates, never a sum of a page — hours come from `GET /api/reports/summary` and counts from `page.totalElements` on `GET /api/entries?status=…&size=1`, because the list is paged and a client-side sum would report page one as the month
- One `reload$` stream per page, flattened with `switchMap` — a filter or page change cancels the request still in flight, so a slow earlier response can never overwrite the newer table
- Server-side paging and sorting — `MatPaginator` and `MatSort` events become the `page`, `size` and `sort` params of `GET /api/entries`, with no `MatTableDataSource`, because entries is the one collection the API pages
- Dialog styles declared once in a global partial — `styles/_dialog.scss` holds the form layout, the always-present error line and the destructive confirm button that the five dialogs share, instead of a copy in each component stylesheet; a global rule carries no encapsulation attribute, so it reaches a dialog the overlay renders outside its opener's DOM, and changing the error line's reserved height is one edit rather than five
- Page and table blocks declared once — `styles/_page.scss` holds the header, the filter bar and the stat-card strip, and `styles/_table.scss` the scrolling wrapper, the loading overlay and the column rules every table shares, instead of a copy per page; the column rules sit under `.table-wrapper` because Material's table stylesheet sets `text-align: start` with a single class and reaches the page after the global one, so a one-class rule would lose the tie
- Material theming through token overrides — `mat.theme()` for the palette, density and shape, and `mat.button-overrides` / `mat.card-overrides` for what it does not reach, because Material's internal CSS classes are private and change between releases
- Typed `ApiError` + a runtime type guard — the backend's error shape is narrowed before it is read, so a failure with no `ErrorResponse` body falls back to a connection message instead of rendering `undefined`
- One runtime guard on the session, on the way in and the way out — `isAuthResponse` checks the login response before `AuthService` stores it and the stored copy on every reload, so a response the app cannot read fails on the login form with its own message instead of logging the user out one reload later, and a stored session that no longer parses ends like an expired one: removed, and explained on `/login`
- Backend `fieldErrors` mapped onto their controls — a `400` lands under its own input through `setErrors({ server })` instead of a generic toast, so a wrong current password keeps the change-password dialog open and the session intact
- Form-level error as a `role="alert"` line that is always in the DOM — the login page and both form dialogs render it empty and only change its text, because an alert inserted together with its message may never be announced
- Page-level errors as a plain `.page-error` paragraph, never a `mat-error` — a Material class is styled by the form-field component's own stylesheet, which the browser only receives once such a component renders, so an error on a page whose failure state shows no field inherited the body colour and stopped looking like an error
- Explicit `restoreFocus` target on the change-password dialog — the menu item that opens it is destroyed with its menu, so closing the dialog returns keyboard focus to the toolbar's account button instead of the page body
- A row action that survives its own write — a successful mutation re-renders the row, so the control the user just pressed must still be there afterwards: Projects uses one button whose icon and label toggle between Deactivate and Reactivate rather than two that swap, and `/entries`, where the delete takes the whole row away, hands the confirmation the header's own button as its `restoreFocus`; without either, focus falls to the page body and the next Tab restarts at the top. A move that happens when the request resolves is conditional on where focus actually is by then — unconditional, it would pull a user out of a dialog they opened while the write was in flight, past the trap and onto `aria-hidden` content
- Focus handed back when a refetch moves a row — once the Projects table can be sorted, keeping the pressed control alive is not enough: the CDK table moves a reordered row by detaching its node and inserting it again, which drops focus even though `trackBy` kept the element, so the page remembers the button a write started from and refocuses it in `afterNextRender`, only while focus is still on the page body
- A responsive duplicate read once — below 600px the Description column is hidden, and with it the only line that says why an entry was rejected, so the note is rendered a second time under the status badge; whichever copy is idle is `display: none`, which removes it from the accessibility tree as well as from the layout
- One helper owns "leave the form exactly as it was" — `confirmDiscard(dialog, form)` opens the discard question for all three form dialogs and answers the `TouchedChangeEvent` its own focus trap causes, because the CDK moves that focus asynchronously and any undo timed against the dialog's open event races it; its buttons are named after their outcome (Keep editing / Discard), the form's own Cancel sitting right underneath meaning the opposite
- Dialogs closed when the shell is destroyed — `DestroyRef.onDestroy` runs `MatDialog.closeAll()`, because the overlay outlives the component that opened it and `closeOnNavigation` ignores `router.navigate()`; a mid-session `401` lands on a clean `/login`, and `core/` auth code stays free of Material
- Change-password dialog dismissal locked around its `PATCH` — `disableClose` refuses a backdrop click for the dialog's whole life, so a stray click never discards a half-filled form, and Escape is re-admitted through `keydownEvents()` only while no save is in flight; the request is torn down with `takeUntilDestroyed(destroyRef)`, which aborts the browser's wait but not the server's write, so an Escape mid-save would otherwise hide a password change that already committed
- `OnPush` on every component, state in signals — a view is re-checked only when a signal it reads changes, so the shell's role-filtered nav re-renders on login/logout from a `computed()` with no manual `markForCheck()`
- Breakpoint-driven navigation drawer — below 1024px the sidenav switches from a fixed `side` rail to a closed `over` drawer opened from a toolbar toggle, fed by a CDK `BreakpointObserver` signal, because the 240px rail left a phone about 135px of page; the drawer closes on `NavigationEnd` and on `NavigationSkipped`, since tapping the current page's link completes no navigation
- Visibility toggle on every password input — a `matSuffix` icon button with a fixed name whose on/off state lives in `aria-pressed`, rather than a name that flips between Show and Hide; its `mousedown` default is prevented, so pressing it keeps focus in the field and never marks an empty field touched mid-typing

---

## Shared components

| Component | Where it is used |
|---|---|
| `status-badge` | Entries page, Approvals page, Dashboard |
| `confirm-dialog` | Delete entry, deactivate user, deactivate project |
| `reject-dialog` | Approvals page — manager enters the rejection note |
| `logo` | Login page (branding panel and card) and the shell toolbar — one SVG sized by each host's own class through `:host`, instead of a copy per page |
| `stat-card` | Employee dashboard, and next the manager dashboard and Reports — one outlined card with its own pulsing skeleton, so a real `0` and "not loaded yet" never look the same on any page |

---

## Tradeoffs

- Signals over NgRx — app complexity did not justify a full state management library
- Angular Material over custom CSS — enterprise UI library, matches what consultancies use in production
- `disabledInteractive` on the login button over disabling the form during the call — focus stays on the button after a failed attempt instead of dropping to the page body; in exchange the component blocks a double submit itself with its `loading()` guard
- Login form at a fixed top offset on phones over vertical centring — the virtual keyboard shrinks `100dvh`, so a centred form would jump as the user starts typing; in exchange a tall phone leaves empty space below the form
- A read-once expiry flag on `AuthService` over a `?expired` query param on `/login` — the reason is an event, so a reload or a bookmark never replays "Your session has expired"; in exchange the notice cannot be linked to or survive a full page reload
- A form dialog that saves itself over one that returns its values for the page to save — a `400`'s `fieldErrors` land under inputs that are still open, and the dialog owns the spinner and the dismissal lock of its own request; in exchange the dialog injects a `core/services/` service, the one component outside `pages/` allowed to, and its page refetches after `afterClosed()`
- Browser Back closing the change-password dialog even mid-save over `closeOnNavigation: false` — the flag is read only when the dialog opens, so it would stop Back closing the dialog at all; in exchange a user who navigates away mid-save loses the confirmation while the server still commits the change
- Truncating the toolbar's account name with an ellipsis on phones over hiding it — the visible name stays the trigger's whole accessible name, so no phone-only `aria-label` is needed; in exchange a long name shows cut off below 600px
- Material's compact card for dialogs on phones over full-screen dialogs — a Material 3 full-screen dialog needs its own layout, a top bar with close and confirm actions, and stretching the standard dialog only spread its fields and buttons apart; in exchange a long form dialog scrolls inside a card with the page dimmed around it
- Four monthly stat cards over a "this week" hours card — the API aggregates by month only, and summing a week of entries in the browser would break the no-client-side-sum rule; in exchange the employee dashboard shows no weekly figure
- Disabling the entry dialog's fields while it saves over leaving them editable like the login form — a value typed during the request would sit on screen against a record that saved the old one; in exchange focus leaves the field for the length of the save
- Disabling "Log hours" until the project list has loaded over hiding it or opening the dialog with an empty list — the dialog reads its projects once, at open, so a `null` list is refused rather than passed on as `[]`, and the header does not shift when the load ends; in exchange the disabled button explains nothing itself and leaves that to the spinner or the error below it
- The `/entries` Project filter listing what `GET /api/projects` returns over a list built from the caller's own entries — an employee receives active projects only, and the entries list is paged, so the browser cannot see every project those entries name; in exchange an employee cannot isolate their entries on a project deactivated since, which month and status still reach
- An illustration on the first-use empty state only, over one on every empty state — a new user's blank dashboard is a welcome and reads as unfinished without one, while a filter that matches nothing is a notice inside a page that still works; in exchange the two empty states no longer share one look
- An inline read-only table for the dashboard's recent entries over reusing `EntryList` — that component's sortable headers and row actions belong to `/entries`, and on a dashboard its sort arrows would respond to nothing; in exchange the two tables repeat their shared cell templates
- Container queries on the dashboard's own width over viewport media queries or `auto-fit` for the stat cards — the 15rem sidenav rail narrows the page from 1024px up, so the window's width misjudges the room, and `auto-fit` left four cards as 3 + 1; in exchange the page's `:host` becomes an `inline-size` container, so its width can never come from its content
- Filter fields fixed at 12rem that change the bar's shape over fields that shrink to fit — a narrower field truncates a selected "September 2026" in its trigger; in exchange a four-field bar takes two rows, 2 + 2, below a 51rem page and a three-field one stacks below 38rem, measured on the page's own width as the stat cards are
- Day-first `en-GB` dates over Angular's `en-US` default — the users are Spanish teams, who read `9/19/2026` backwards; in exchange the datepicker needs the date-fns adapter (two dependencies), because `NativeDateAdapter` parses typed input with `Date.parse` and rejects `19/09/2026`
- The paginator's defaults provided by the Entries page over app-wide in `app.config.ts` — importing even its options token at bootstrap pulled the paginator, select, form field and tooltip into the initial bundle (665 kB against a 500 kB budget, 448 kB after); in exchange a second paginated page must provide the same defaults again
- The approvals queue opening on every pending month over the current one like `/entries` — a timesheet is authored by month, but a queue is worked by age, and a month default would hide older submissions behind a filter nobody set while the shell's badge kept counting them; in exchange the queue's first load is not bounded by month
- `/entries` opening on the current month over all months — a timesheet is worked and reviewed by month and the query stays bounded; in exchange the first days of a month open on an empty table, so the empty state offers "Show all months" while a month is selected
- Sorting the Projects table in the browser over sending `sort` to the API as `/entries` does — `GET /api/projects` returns every project in one unpaged response, so the browser holds the whole set and orders all of it, and the name order reuses the API's own, reversed for descending, to keep the database's collation; in exchange a very long project list is sorted and scrolled client-side, with no paginator and no Description column on phones
- A project's own `--project-active` token over reusing the APPROVED status colour — the two share a value and its measured contrast, but a project's state and a time entry's status mean different things and must be free to move apart; in exchange the palette carries two greens that look identical today

---

## How to run alone

*Angular project setup coming in Step 7.*

```
cd projects/07-timetrack/frontend
npm install
ng serve
```

Open your browser at `http://localhost:4200`
