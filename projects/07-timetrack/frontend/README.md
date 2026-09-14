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
- Role-aware UI — same route (`/entries`, `/dashboard`), different data and columns per role
- `forkJoin` — parallel API calls on dashboard load for stat cards
- Material theming through token overrides — `mat.theme()` for the palette, density and shape, and `mat.button-overrides` / `mat.card-overrides` for what it does not reach, because Material's internal CSS classes are private and change between releases
- Typed `ApiError` + a runtime type guard — the backend's error shape is narrowed before it is read, so a failure with no `ErrorResponse` body falls back to a connection message instead of rendering `undefined`
- Backend `fieldErrors` mapped onto their controls — a `400` lands under its own input through `setErrors({ server })` instead of a generic toast, so a wrong current password keeps the change-password dialog open and the session intact
- Explicit `restoreFocus` target on the change-password dialog — the menu item that opens it is destroyed with its menu, so closing the dialog returns keyboard focus to the toolbar's account button instead of the page body
- `disableClose` held while the change-password `PATCH` is in flight — the request is torn down with `takeUntilDestroyed(destroyRef)`, which aborts the browser's wait but not the server's write, so an Escape or backdrop click mid-save would otherwise hide a password change that already committed
- `OnPush` on every component, state in signals — a view is re-checked only when a signal it reads changes, so the shell's role-filtered nav re-renders on login/logout from a `computed()` with no manual `markForCheck()`

---

## Shared components

| Component | Where it is used |
|---|---|
| `status-badge` | Entries page, Approvals page, Dashboard |
| `confirm-dialog` | Delete entry, deactivate user, deactivate project |
| `reject-dialog` | Approvals page — manager enters the rejection note |

---

## Tradeoffs

- Signals over NgRx — app complexity did not justify a full state management library
- Angular Material over custom CSS — enterprise UI library, matches what consultancies use in production
- `disabledInteractive` on the login button over disabling the form during the call — focus stays on the button after a failed attempt instead of dropping to the page body; in exchange the component blocks a double submit itself with its `loading()` guard
- Browser Back closing the change-password dialog even mid-save over `closeOnNavigation: false` — the flag is read only when the dialog opens, so it would stop Back closing the dialog at all; in exchange a user who navigates away mid-save loses the confirmation while the server still commits the change

---

## How to run alone

*Angular project setup coming in Step 7.*

```
cd projects/07-timetrack/frontend
npm install
ng serve
```

Open your browser at `http://localhost:4200`
