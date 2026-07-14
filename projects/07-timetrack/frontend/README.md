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

---

## How to run alone

*Angular project setup coming in Step 7.*

```
cd projects/07-timetrack/frontend
npm install
ng serve
```

Open your browser at `http://localhost:4200`
