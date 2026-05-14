# 06 — HR Portal

My sixth Angular project. A role-based HR management app to learn route guards, lazy loading, HTTP interceptors, and enterprise architecture patterns.

**Live demo:** —

![App preview](screenshots/preview.png)

## Features

- Simulated authentication with admin and employee roles
- Route guards — protected routes redirect unauthenticated users
- Role-based access — admin-only pages and UI elements hidden for employees
- Employee CRUD — create (multi-step form), edit, delete (admin only)
- Department CRUD — create, edit, delete with unsaved-changes warning (admin only)
- Leave requests — employees submit requests, admins approve or reject
- Role-aware dashboard — stat cards, recent employees panel, pending requests panel
- Persistent sidebar with role-filtered navigation links
- Global HTTP interceptor — adds auth token to every outgoing request
- Data persisted in localStorage via signals and `effect()`

## Architecture decisions

- **Core/Feature/Shared folder structure** → as the app grew to six feature areas, keeping everything flat would have made it impossible to find where singletons (guards, interceptors, services) lived vs. feature-specific code → `core/` holds one-instance-for-the-whole-app code, `pages/` holds feature areas, and `shared/` holds components used in more than one feature. This is the standard structure in enterprise Angular projects.

- **Lazy loading on all feature routes** → most users are employees who never visit employee or department management pages; loading those components only on navigation reduces the initial bundle so the app starts faster for the majority of users → avoids loading admin-only code for every user on every visit.

- **Stacked guards instead of one combined guard** → `authGuard` checks if the user is logged in; `adminGuard` checks the role; keeping them separate means `authGuard` can be reused on any protected route without including role logic, and `adminGuard` can be extended without touching auth → avoids a single god-guard that mixes concerns.

- **`CanDeactivate` only on the department form** → the department form has many fields and takes time to fill; a user who accidentally navigates away loses all their work; simpler actions (status update, delete confirmation) do not need a guard because the risk of accidental data loss is low and the friction is not worth it → avoids annoying the user on every navigation.

- **`MatStepper` for employee creation** → the employee form had too many fields for a single screen; splitting into "Personal info" and "Job details" steps makes each step feel manageable → avoids overwhelming the user; the trade-off is that `matStepperNext` cannot be triggered from outside the stepper, which required manual validation in `onNext()`.

- **Coordinator pattern for pages with filters and a table** → employee page and leave request page each have a filters component, a table component, and page-level state (filter signals, computed filtered list); lifting state to the page component avoids prop drilling and keeps the table and filters reusable → the page owns all state; children only receive data and emit events.

- **localStorage with signals instead of a real backend** → this project focuses on Angular patterns (guards, lazy loading, interceptors); building a Spring Boot backend at the same time would have split the focus; each service uses `signal()` + `effect()` to persist to localStorage automatically → avoids coupling the Angular learning to backend setup; the HTTP interceptor works the same way as it would with a real API, which is the important pattern to learn.

- **Role-aware dashboard with `@if(isAdmin())`** → admin and employee have very different needs on the dashboard; the admin needs a company overview (total employees, departments, pending requests) while the employee only needs their own data; using a single `isAdmin()` computed signal as the switch keeps the logic in one place → avoids two separate dashboard components that would share most of their structure.

- **`filteredNavLinks` computed in the root `App` component** → the sidebar must show different links per role; computing the filtered list in the root component means the nav is always in sync with `currentUser()` without any child component needing to know about roles → avoids duplicating role checks in every nav link.

## What I learned

### Angular
- `CanActivateFn` — functional route guard (v15+); no class, no `@Injectable`
- `adminGuard` — role-based guard that checks `currentUser().role`
- `noAuthGuard` — redirects logged-in users away from the login page
- Lazy loading — `loadComponent` with dynamic import; component code only loads on navigation
- Stacked guards — `canActivate: [authGuard, adminGuard]`; all must return true
- `HttpInterceptorFn` — functional interceptor (v15+)
- `req.clone({ setHeaders })` — HTTP requests are immutable; must clone to add headers
- `withInterceptors([fn])` in `app.config.ts` — registers functional interceptors
- `CanDeactivate` guard — warn the user before leaving a form with unsaved changes
- `markAsPristine()` — reset form dirty state after save so the guard does not trigger
- `MatStepper` — `[linear]="true"`, `[stepControl]`, `stepper.next()`, `stepper.previous()`
- `MatSnackBar` — toast notifications; `snackBar.open(message, action, { duration })`
- `MatSidenav` app shell — `mat-sidenav-container`, `mat-sidenav mode="side"`, `mat-sidenav-content`
- `routerLinkActive="active"` with `#rla` and `[activated]="rla.isActive"`
- `MatDatepicker` — calendar picker; requires `provideNativeDateAdapter()` in `app.config.ts`
- Conditional `displayColumns` with `computed()` — show or hide table columns based on role
- Query params — `[queryParams]` on `routerLink`, read with `ActivatedRoute.snapshot.queryParamMap.get()`
- `setErrors({ customKey: true })` — set a custom error on a form control for service-level validation
- Duplicate check pattern — `nameExists()` / `emailExists()` with optional `excludeId` for edit mode
- Auth persistence — `signal(JSON.parse(localStorage.getItem(...) ?? 'null'))` + `effect()` to save on every change
- Default and wildcard routes — `redirectTo` with `pathMatch: 'full'` and `path: '**'`
- Role-aware UI — `computed()` for filtered nav links and dashboard content per role

### CSS
- App shell scroll layout — `html, body { height: 100% }` + `app-root { overflow: hidden }` + `mat-sidenav-container { flex: 1; min-height: 0 }` — keeps toolbar and sidebar fixed while only the content area scrolls
- `a.active:focus:not(:hover)::before { opacity: 0 }` — hides the Material state layer on the active link after click without breaking hover
- Responsive CSS Grid — `@media (max-width: 768px)` to stack two-column layouts on mobile

## Project structure

```
src/app/
├── core/                        ← singleton logic, no UI
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
├── pages/                       ← one folder per route (feature components)
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
├── shared/                      ← reusable UI components
│   └── components/
│       └── confirm-dialog/
├── models/
│   ├── user.model.ts
│   ├── employee.model.ts
│   ├── department.model.ts
│   └── leave-request.model.ts
└── app.routes.ts
```

## Tech stack

- Angular 19
- Angular Material
- TypeScript
- CSS

## How to run the project

```
git clone https://github.com/VMNunez/dev-learning.git
```

```
cd dev-learning/angular/06-hr-portal
```

```
npm install
```

```
ng serve
```

Open your browser at `http://localhost:4200`

**Test accounts:**
- Admin: `victornunezpradas@gmail.com` / `admin123`
- Employee: `employee@hrportal.com` / `employee123`
