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
- `CanDeactivate` guard — warn the user before leaving a form with unsaved changes
- `markAsPristine()` — reset form dirty state after a successful save so the guard does not interrupt navigation
- Core/Feature/Shared architecture — enterprise Angular folder structure
- `setErrors({ customKey: true })` — set a custom error on a form control for service-level validation (e.g. duplicate check)
- Duplicate check pattern — `nameExists()` / `emailExists()` in the service with optional `excludeId` for edit mode; `setErrors()` + `return` in `onSubmit()`

### CSS
- —

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
