# 06 — HR Portal

My sixth Angular project. A role-based HR management app to learn route guards, lazy loading, HTTP interceptors, and enterprise architecture patterns.

**Live demo:** —

## Features

- Simulated authentication with admin and employee roles
- Route guards — protected routes redirect to login if not authenticated
- Role-based access — admin-only sections blocked for employees
- Employee management — create, edit, delete employees (admin)
- Department management (admin)
- Leave requests — submit and approve/reject time off
- Global HTTP interceptor — adds auth token to every request
- Fake REST API with json-server

## Architecture decisions

- **Core/Feature/Shared folder structure** — as the app grew to six feature areas, keeping everything flat would have made it impossible to find where singletons (guards, interceptors, services) lived vs. feature-specific code. `core/` holds one-instance-for-the-whole-app code, `pages/` holds feature areas, and `shared/` holds components used in more than one feature. This is the standard structure in enterprise Angular projects.

- **Lazy loading on admin and department routes** — most users are employees who never visit admin or department management pages. Loading those components only on navigation reduces the initial bundle so the app starts faster for the majority of users.

- **Stacked guards instead of one combined guard** — `authGuard` checks if the user is logged in; `adminGuard` checks the role. Keeping them separate means `authGuard` can be reused on any protected route without including role logic, and `adminGuard` can be swapped or extended without touching auth.

- **`CanDeactivate` only on forms with many fields** — the department form takes significant time to fill. A user who accidentally navigates away loses all their work. Simpler actions (status update, delete confirmation) do not need a guard because the risk of accidental data loss is low and the friction is not worth it.

- **`MatStepper` for the employee creation dialog** — the employee form had too many fields for a single screen. Splitting into "Personal info" and "Job details" steps makes each step feel manageable and prevents the user from being overwhelmed. The trade-off is that the stepper buttons cannot use `matStepperNext` from outside the stepper, which required manual validation in `onNext()`.

- **`json-server` instead of a real backend** — this project focuses on Angular patterns (guards, lazy loading, interceptors). Building a Spring Boot backend at the same time would have split the focus. `json-server` provides a realistic REST API in minutes and the HTTP interceptor works exactly the same way as it would with a real backend. The auth is simulated and would not be production-safe.

## What I learned

### Angular
- Route guards (`CanActivate`) — protect routes and redirect unauthenticated users
- Role-based guards — check user role before allowing access to a route
- Lazy loading — load feature routes only when the user navigates to them
- HTTP interceptors — run logic before every HTTP request (auth token, loading state)
- `Location.back()` — navigate to the previous page using browser history
- `MatPaginator` — pagination for Material tables
- `MatDatepicker` — calendar date picker with `provideNativeDateAdapter()`
- Conditional `displayColumns` with `computed()` — show or hide table columns based on user role
- Query params — `[queryParams]` on `routerLink`, read with `ActivatedRoute.snapshot.queryParamMap.get()`
- `MatSnackBar` — toast notifications after user actions; inject as a service, call `snackBar.open(message, action, { duration })` from the page coordinator
- `MatStepper` — multi-step forms with `[linear]="true"`, `[stepControl]` per step, `stepper.next()` / `stepper.previous()` for navigation, `stepper.selectedIndex` to show different buttons per step
- `MatToolbar` — persistent app shell header with title and logout button; `justify-content: space-between` to push items to each side; hidden when not logged in via `@if` on a signal
- `CanDeactivate` guard — warn the user before leaving a form with unsaved changes
- `markAsPristine()` — reset form dirty state after a successful save so the guard does not interrupt navigation
- Core/Feature/Shared architecture — enterprise Angular folder structure
- `setErrors({ customKey: true })` — set a custom error on a form control for service-level validation (e.g. duplicate check)
- Duplicate check pattern — `nameExists()` / `emailExists()` in the service with optional `excludeId` for edit mode; `setErrors()` + `return` in `onSubmit()`

### CSS
- App shell layout — `html, body { height: 100% }` + `app-root { overflow: hidden }` + `mat-sidenav-container { flex: 1; min-height: 0 }` — keeps toolbar and sidebar fixed while only the content area scrolls
- Material state layer — `::before` pseudo-element with `opacity: 0`; raised on focus/hover/press to show gray overlay
- `a.active:focus:not(:hover)::before { opacity: 0 }` — hides the gray focus overlay on the active nav link without breaking hover
- `:not()` pseudo-class — negate a selector to exclude a specific state

## Project structure

```
src/app/
├── core/                        ← singleton logic, no UI
│   ├── guards/
│   │   ├── auth-guard.ts
│   │   └── admin-guard.ts
│   ├── interceptors/
│   │   └── auth-interceptor.ts
│   └── services/
│       ├── auth.service.ts
│       ├── employee.service.ts
│       └── department.service.ts
├── pages/                       ← one folder per route (feature components)
│   ├── login-page/
│   ├── dashboard-page/
│   ├── admin-page/
│   ├── employee-page/
│   │   └── components/
│   │       ├── employee-dialog/
│   │       ├── employee-filters/
│   │       └── employee-table/
│   └── department-page/
│       ├── components/
│       │   └── department-list/
│       └── department-form/
├── shared/                      ← reusable UI components used across features
│   └── components/
│       └── confirm-dialog/
├── models/                      ← TypeScript interfaces
│   ├── user.model.ts
│   ├── employee.model.ts
│   └── department.model.ts
└── app.routes.ts
```

## Tech stack

- Angular 21
- Angular Material
- TypeScript
- CSS
- json-server (fake REST API)

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
npm run api
```

```
ng serve
```

Open your browser at `http://localhost:4200`
