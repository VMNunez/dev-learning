# Angular — Folder Structure (Core / Feature / Shared)

Official docs: https://angular.dev/style-guide#overall-structural-guidelines

## Why structure matters

In small apps one flat folder works fine. When an app has six or more feature areas, keeping everything flat makes it impossible to know where singletons (guards, interceptors, services) live vs feature-specific code. A standard structure solves this.

---

## The three folders

### `core/`

Singleton logic — things that exist once for the whole app. No UI components.

```
core/
├── guards/
│   ├── auth-guard.ts
│   └── admin-guard.ts
├── interceptors/
│   └── auth-interceptor.ts
└── services/
    ├── auth.service.ts
    └── employee.service.ts
```

- Route guards go here — they apply globally, not to one feature
- HTTP interceptors go here — they run on every request
- Singleton services go here — one instance for the whole app
- Nothing in `core/` has its own template

### `pages/` (or `features/`)

One folder per route. Each folder is self-contained — it can have its own components, services, and sub-routes.

```
pages/
├── login-page/
├── dashboard-page/
├── employee-page/
│   └── components/
│       ├── employee-dialog/
│       ├── employee-filters/
│       └── employee-table/
└── department-page/
    ├── components/
    │   └── department-list/
    └── department-form/
```

- The page component is the coordinator — it owns state and handles events
- Child components go in `components/` inside the feature folder
- Feature-specific services can also live here (not in `core/`)

### `shared/`

Reusable UI components used in more than one feature. Not page-specific.

```
shared/
└── components/
    └── confirm-dialog/
```

- A component only goes in `shared/` when two or more features use it
- If only one feature uses it, it stays inside that feature's folder

---

## Where things go — quick reference

| Thing | Where |
|-------|-------|
| Route guard | `core/guards/` |
| HTTP interceptor | `core/interceptors/` |
| Global service (auth, employees) | `core/services/` |
| Page / routed component | `pages/feature-name/` |
| Child of a page | `pages/feature-name/components/` |
| Reused across pages | `shared/components/` |
| TypeScript interfaces | `models/` (root level) |

---

## Full example — project 06

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth-guard.ts
│   │   ├── admin-guard.ts
│   │   ├── no-auth-guard.ts
│   │   └── deactivate-guard.ts
│   ├── interceptors/
│   │   └── auth-interceptor.ts
│   └── services/
│       ├── auth.service.ts
│       ├── employee.service.ts
│       ├── department.service.ts
│       └── leave-request.service.ts
├── pages/
│   ├── login-page/
│   ├── dashboard-page/
│   ├── employee-page/
│   │   └── components/
│   │       ├── employee-dialog/
│   │       ├── employee-filters/
│   │       └── employee-table/
│   ├── department-page/
│   │   ├── components/
│   │   │   └── department-list/
│   │   └── department-form/
│   └── leave-request-page/
│       └── components/
│           ├── leave-request-dialog/
│           ├── leave-request-filters/
│           └── leave-request-table/
├── shared/
│   └── components/
│       └── confirm-dialog/
├── models/
│   ├── user.model.ts
│   ├── employee.model.ts
│   ├── department.model.ts
│   └── leave-request.model.ts
└── app.routes.ts
```

---

## Why this structure?

- **`core/` prevents duplication** — guards and interceptors are defined once, not reimported per feature
- **`pages/` keeps features isolated** — you can delete a whole feature folder without touching anything else
- **`shared/` avoids copy-paste** — the confirm dialog works the same way on the employee page, the department page, and leave requests
- This is the structure used in real Angular projects at NTT Data, Capgemini, and similar consultancies
