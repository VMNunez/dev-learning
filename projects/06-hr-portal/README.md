# HR Portal

My 6th learning project — HR management app where admins manage employees and leave requests, and employees track their own requests, with role-based access throughout.

---

## Why this project

Most production Angular apps have protected routes, role-based views, and HTTP layers that attach credentials automatically. I built this project to understand how those patterns work in practice — guards, interceptors, lazy loading — before applying them in a real codebase.

---

## Live demo

https://06-hr-portal.netlify.app

**Test accounts:**
- Admin: `admin@hrportal.com` / `admin123`
- Employee: `employee@hrportal.com` / `employee123`

---

## Screenshots

**Login**

![Login](screenshots/login.png)

**Admin dashboard**

![Admin dashboard](screenshots/dashboard-admin.png)

**Employee management**

![Employees](screenshots/employees.png)

**Leave requests**

![Leave requests](screenshots/leave-requests.png)

---

## Features

- Protected routes redirect unauthenticated users to login
- Admin and employee roles see different pages, sidebar links and dashboard content
- Employee CRUD — multi-step creation form, edit dialog, soft delete
- Department CRUD — unsaved-changes warning when navigating away mid-form
- Leave requests — employees submit, admins approve or reject
- Auth token attached automatically to every outgoing HTTP request

---

## Architecture decisions

- Core/Feature/Shared structure to separate singleton logic, feature areas and reusable UI
- Lazy loading on all feature routes to avoid loading admin-only code for every user on every visit
- Stacked guards (`authGuard` + `adminGuard`) to keep authentication and authorisation as separate concerns
- Coordinator pattern on pages with filters and a table to centralise state and keep children reusable
- `MatStepper` for employee creation to split a long form into manageable steps
- `CanDeactivate` only on the department form — the only place where accidental data loss is a real risk
- `filteredNavLinks computed()` in the root component to keep sidebar links in sync with the current user without duplicating role checks in children
- localStorage with signals and `effect()` to decouple data persistence from the Angular patterns being practised
- A credential-free session shape in localStorage — only the email and role the app reads back, re-projected on read so an entry saved by an older build drops its password

---

## Tradeoffs

- localStorage over a real backend — the focus of this project was Angular patterns, not data persistence
- Single `isAdmin()` computed signal over role checks scattered across components — one place to change if the role logic evolves
- Functional guards (`CanActivateFn`) over class-based guards — Angular v15+ convention, less boilerplate

---

## Future improvements

- Replace localStorage with a real REST API backend
- Email notifications when leave requests are approved or rejected
- Export leave request history to PDF or CSV

---

## What I learned

- `CanActivateFn` — functional route guard; no class, no `@Injectable`
- `canActivate: [authGuard, adminGuard]` — stacked guards; all must pass for the route to activate
- `noAuthGuard` — redirects already-logged-in users away from the login page
- `loadComponent` with dynamic import — lazy loading; component code only loads on navigation
- `HttpInterceptorFn` — functional interceptor; clones the request to add the auth header
- `CanDeactivateFn` — warns the user before leaving a form with unsaved changes
- `MatStepper` — multi-step form with `[linear]="true"` and per-step form group validation
- `MatSnackBar` — toast notifications after every key action
- `MatSidenav` app shell — persistent sidebar with role-filtered navigation links
- `MatDatepicker` — calendar picker with `provideNativeDateAdapter()`
- Local-clock date serialization — `toISOString()` shifts a picked date to UTC, so `YYYY-MM-DD` is built from `getFullYear`/`getMonth`/`getDate`
- Conditional `displayColumns` with `computed()` — show or hide table columns based on role
- Query params — `[queryParams]` on `routerLink`, read with `ActivatedRoute.snapshot.queryParamMap`
- Auth persistence — `signal()` initialised from localStorage + `effect()` to save on every change
- App shell scroll layout — `overflow: hidden` on `app-root` keeps toolbar and sidebar fixed

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| UI library | Angular Material 21 |
| Language | TypeScript |
| Styles | CSS |

---

## Project structure

```
src/app/
├── core/                        ← singleton logic — one instance for the whole app
│   ├── guards/                  ← auth, admin, no-auth, deactivate guards
│   ├── interceptors/            ← auth interceptor — attaches token to every request
│   └── services/                ← auth, employee, department, leave-request services
├── pages/                       ← one folder per route
│   ├── login-page/
│   ├── dashboard-page/
│   ├── employee-page/
│   │   └── components/          ← dialog, filters, table
│   ├── department-page/
│   │   └── components/
│   └── leave-request-page/
│       └── components/
├── shared/                      ← reusable UI used in more than one feature
│   └── components/
│       └── confirm-dialog/
└── models/                      ← TypeScript interfaces
```

---

## How to run

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
npm start
```

Open your browser at `http://localhost:4200`
