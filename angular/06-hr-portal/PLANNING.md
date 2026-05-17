# Project 06 — HR Portal

An HR management portal with role-based access, lazy loading, HTTP interceptors,
and a full app shell with toolbar and sidebar navigation.

---

## Why this project

- **Learning objective:** Learn advanced Angular routing — guards, lazy loading, interceptors, role-based access
- **Portfolio value:** Shows production-ready Angular knowledge — the patterns used in real enterprise apps

---

## Key features

- Login and logout with role-based access (admin / employee)
- Admin can manage employees (full CRUD) and departments (full CRUD)
- Employees can view their own profile and request leave
- Admin can review and approve or reject leave requests
- Route guards protect every page — unauthenticated users are redirected to login
- Admin-only routes are blocked for employees
- `CanDeactivate` guard warns before leaving a form with unsaved changes
- HTTP interceptor attaches the auth token to every request
- Sidebar navigation shows only the links the current role can access
- Role-aware dashboard with different content per role

---

## Tech stack

- Angular + Angular Material v19
- Core/Feature/Shared architecture
- Lazy loading for all feature routes
- Functional guards (`CanActivateFn`, `CanDeactivateFn`)
- Functional interceptor (`HttpInterceptorFn`)
- Auth persisted in localStorage via signal + `effect()`

---

## Folder structure

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts          ← redirect to login if not authenticated
│   │   └── admin.guard.ts         ← redirect if not admin
│   ├── interceptors/
│   │   └── auth.interceptor.ts    ← attach Bearer token to every request
│   └── services/
│       └── auth.service.ts        ← currentUser signal + login/logout
├── pages/
│   ├── login/
│   ├── dashboard/                 ← role-aware: different content per role
│   ├── employees/                 ← admin only (CRUD + MatStepper for creation)
│   ├── departments/               ← admin only (CRUD)
│   ├── leave-requests/            ← admin sees all; employee sees own requests
│   └── profile/                  ← employee only
└── shared/
    ├── components/
    │   └── confirm-dialog/
    └── models/
        ├── user.model.ts
        ├── employee.model.ts
        ├── department.model.ts
        └── leave-request.model.ts
```

---

## State management

- `signal<User | null>` in `AuthService`, synced to localStorage with `effect()`
- `signal<Employee[]>` in `EmployeeService`, `signal<Department[]>` in `DepartmentService`
- `computed()` for filtered lists, role checks (`isAdmin`), and filtered nav links
- All signals stored as references (no `()`) in child components to stay reactive

---

## Key patterns introduced

| Pattern | Where used |
|---|---|
| `CanActivateFn` | `auth.guard.ts` and `admin.guard.ts` |
| `router.createUrlTree(['/login'])` | Redirect from a guard |
| `canActivate: [authGuard, adminGuard]` | Stack multiple guards on one route |
| `loadComponent:` with dynamic import | Lazy loading — each page loads on demand |
| `CanDeactivateFn<Component>` | Warn before leaving a dirty form |
| `markAsPristine()` | Reset dirty state after successful save |
| `HttpInterceptorFn` | Attach auth token to every request |
| `req.clone({ setHeaders: { ... } })` | HTTP requests are immutable — must clone |
| `withInterceptors([fn])` | Register functional interceptors in `app.config.ts` |
| Auth persistence pattern | `signal(JSON.parse(localStorage.getItem(...) ?? 'null'))` + `effect()` |
| `??` nullish coalescing | Safe fallback when localStorage value is null |
| Dual-mode dialog | Same dialog handles add and edit via `MAT_DIALOG_DATA` check |
| `inject<Type \| undefined>(MAT_DIALOG_DATA)` | Optional dialog data injection |
| `dialogRef.close(true)` | Return boolean from confirmation dialog |
| Multiple filter signals + `computed()` | Chain filters with `&&`; `'all'` as no-filter default |
| `MatDatepicker` + `provideNativeDateAdapter()` | Date input with calendar popup |
| Conditional `displayColumns` with `computed()` | Change columns based on role — never use `@if` on `ng-container matColumnDef` |
| `ActivatedRoute.snapshot.queryParamMap.get()` | Read query params on load |
| `[queryParams]` on `routerLink` | Pre-apply a filter when navigating |
| `MatSidenav` app shell | Fixed toolbar + sidebar + scrollable content area |
| `routerLinkActive="active"` + `#rla` | Highlight the active nav link |
| Active link focus fix | `a.active:focus:not(:hover)::before { opacity: 0 }` |
| App shell scroll fix | `html, body { height: 100% }` + `app-root { overflow: hidden }` |
| `filteredNavLinks = computed()` | Show only links the current role can access |
| `isAdmin = computed()` | Single source of truth for role checks |
| Signal reference vs snapshot | Store `service.signal` (no `()`), not `service.signal()` |
| `MatSnackBar` | Feedback after every CRUD action |
| `MatStepper` with `[stepControl]` | Multi-step employee creation form |

---

## Learning steps

1. Set up Core/Feature/Shared folder structure and routing skeleton
2. Build login page with `AuthService` and localStorage persistence
3. Add `auth.guard.ts` — redirect unauthenticated users to login
4. Add lazy loading — `loadComponent:` for every page
5. Add `admin.guard.ts` — stack with `authGuard` on admin routes
6. Add `auth.interceptor.ts` — attach token to every request
7. Build Employee CRUD — table, add/edit dialog, delete confirmation
8. Build Department CRUD — same patterns as employees
9. Add `CanDeactivate` guard on the employee form
10. Build Leave Requests — dual view (admin sees all, employee sees own)
11. Build the `MatSidenav` app shell with toolbar and reactive nav links
12. Add role-aware dashboard with `isAdmin = computed()`
13. Add `MatSnackBar` on all key actions
14. Add `MatStepper` for the employee creation flow
