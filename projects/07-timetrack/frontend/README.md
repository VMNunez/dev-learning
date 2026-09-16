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
- Page titles through a custom `TitleStrategy` — each route declares only its page name and `AppTitleStrategy` appends `| TimeTrack` in one place, writing the brand alone when no route resolves a title, because the default strategy writes nothing then and the tab would keep the previous page's name
- `forkJoin` — parallel API calls on dashboard load for stat cards
- Material theming through token overrides — `mat.theme()` for the palette, density and shape, and `mat.button-overrides` / `mat.card-overrides` for what it does not reach, because Material's internal CSS classes are private and change between releases
- Typed `ApiError` + a runtime type guard — the backend's error shape is narrowed before it is read, so a failure with no `ErrorResponse` body falls back to a connection message instead of rendering `undefined`
- Backend `fieldErrors` mapped onto their controls — a `400` lands under its own input through `setErrors({ server })` instead of a generic toast, so a wrong current password keeps the change-password dialog open and the session intact
- Explicit `restoreFocus` target on the change-password dialog — the menu item that opens it is destroyed with its menu, so closing the dialog returns keyboard focus to the toolbar's account button instead of the page body
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

---

## How to run alone

*Angular project setup coming in Step 7.*

```
cd projects/07-timetrack/frontend
npm install
ng serve
```

Open your browser at `http://localhost:4200`
