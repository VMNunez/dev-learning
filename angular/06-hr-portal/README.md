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
- `MatSnackBar` — toast notifications after user actions
- `MatStepper` — multi-step forms
- `CanDeactivate` guard — warn the user before leaving a form with unsaved changes
- Core/Feature/Shared architecture — enterprise Angular folder structure

### CSS
- —

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
