# Angular — Routing

Official docs: https://angular.dev/guide/routing

## What is routing?

Routing lets you navigate between pages without reloading the browser. Each URL shows a different component.

## Define routes

> Route paths do NOT start with `/` in `app.routes.ts` — Angular adds the slash automatically when it matches a URL.

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'add', component: AddTransactionPage },
];
```

### Default route and wildcard — always add these

Every app needs two extra routes:

**Default route** — what to show when the user visits `/` (the root URL). Use `redirectTo` to send them to a specific page.

```typescript
{ path: '', redirectTo: 'login', pathMatch: 'full' }
```

**Why `pathMatch: 'full'`?** By default, Angular matches routes by prefix — it checks if the URL *starts with* the path. An empty string `''` is a prefix of every URL, so without `pathMatch: 'full'`, `path: ''` would match `/dashboard`, `/login`, and everything else, redirecting the user to login no matter what page they visit.

`pathMatch: 'full'` tells Angular to only match when the entire URL is exactly `''`.

| URL          | without `pathMatch: 'full'` | with `pathMatch: 'full'` |
| ------------ | --------------------------- | ------------------------ |
| `/`          | matches ✓                   | matches ✓                |
| `/dashboard` | matches ✓ (wrong!)          | does not match ✓         |
| `/login`     | matches ✓ (wrong!)          | does not match ✓         |

You only need `pathMatch: 'full'` on `path: ''`. All other routes are specific enough that prefix matching works correctly.

**Wildcard route** — catches any URL that does not match any route (e.g. `/xyz`). Without it, Angular shows a blank page for unknown URLs.

```typescript
{ path: '**', redirectTo: 'login' }
```

> The wildcard `**` must always be **last** in the array. Angular checks routes in order — if `**` were first, it would match everything and no other route would ever load.

A complete routes file looks like this:

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // default → redirect
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardPage },
  { path: '**', redirectTo: 'login' },                   // unknown URL → redirect
];
```

## RouterOutlet — where Angular renders the active page

```html
<!-- app.html -->
<router-outlet />
```

## routerLink — navigate declaratively in the template

Use `routerLink` on any element to navigate when the user clicks it. It does not reload the browser — Angular handles the navigation internally.

### Import in the component first

```typescript
imports: [RouterLink];
```

### Static route

```html
<a routerLink="/">Dashboard</a>
<a routerLink="/add">Add transaction</a>

<!-- also works on divs, buttons, etc -->
<button routerLink="/add">Add</button>
```

### Dynamic route — with a parameter

First, define the route parameter in `app.routes.ts`:

```typescript
{ path: 'detail/:id', component: MealDetailPage }
```

Then, navigate to it with `[routerLink]`:

> When using `[routerLink]` with an array, the first item IS the path and it DOES need `/`. This is different from `app.routes.ts` where you never add `/`.

```html
<!-- navigates to /detail/52772 -->
<div [routerLink]="['/detail', meal.idMeal]">{{ meal.strMeal }}</div>
```

First item is the path, second is the value for `:id`.

`routerLink` — static path, written as a string

`[routerLink]` — dynamic path, written as an array with property binding

## Router service — navigate programmatically from TypeScript

```typescript
private router = inject(Router);

onSubmit() {
  // after saving, go back to the dashboard
  this.router.navigate(['/']);
}
```

Use this when you need to navigate after an action (form submit, delete, etc).

### Programmatic vs declarative navigation

Both do the same thing — navigate to a URL. The difference is WHERE you call them.

| Approach             | Where                     | When to use                                                |
| -------------------- | ------------------------- | ---------------------------------------------------------- |
| `routerLink`         | Template (HTML)           | Links and buttons that always navigate to the same place   |
| `Router.navigate()`  | TypeScript (component)    | After an action — submit a form, delete a record, log in  |

### Location.back() — go to the previous page

`Location` (from `@angular/common`) lets you navigate to the previous page in the browser history — the same as clicking the browser back button.

```typescript
import { Location } from '@angular/common';

private location = inject(Location);

goBack() {
  this.location.back();
}
```

```html
<button (click)="goBack()">Back</button>
```

Use `Location.back()` when you want a back button inside your app (for example, on a detail page).

---

## Route parameters — dynamic segments

You have already seen route parameters briefly in the `routerLink` section. Here they are explained in more detail — how to define them, and how to read them inside a component.

A route parameter is a part of the URL that changes. Define it with `:` in `app.routes.ts`:

```typescript
{ path: 'detail/:id', component: MealDetailPage }
```

`/detail/52772` and `/detail/53049` both match this route. `52772` becomes the value of `id`.

Route parameters always come as `string` — even if the value looks like a number. Keep your service methods typed as `string`.

### Route params vs query params

|         | Route param                     | Query param                   |
| ------- | ------------------------------- | ----------------------------- |
| URL     | `/detail/52772`                 | `/detail?id=52772`            |
| Use for | Identity — which specific item  | Filters, pagination, sorting  |
| Example | `/users/victor`, `/products/42` | `/products?page=2&sort=price` |

### Dynamic routerLink

When the route has a parameter, use an array in `routerLink`:

```html
<div [routerLink]="['/detail', meal.idMeal]">...</div>
```

First item is the path, second is the value for `:id`.

### Read the parameter — ActivatedRoute

To read a route parameter inside a component, you need three things:

1. Inject `ActivatedRoute` — the service that gives you access to the current URL
2. Read the param in `ngOnInit` — route params are only available after the component is created, not in the constructor
3. Call a method with the param — keeps `ngOnInit` clean, one method per job

**Why `ngOnInit` and not the constructor?**
The constructor runs when Angular creates the class — at that point, the routing system has not yet attached the URL data to the component. `ngOnInit` runs after Angular finishes setting up the component, including injecting the route. That is why route params are always read in `ngOnInit`.

The full pattern:

```typescript
private route = inject(ActivatedRoute);
private mealService = inject(MealService);
meal = signal<Meal | null>(null); // signal because the template needs to react when data arrives

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id'); // plain const — not a signal, the user cannot change the id while on this page
  this.loadMeal(id as string);
}

loadMeal(id: string): void { // separate method to keep ngOnInit clean
  this.mealService.getMealById(id).subscribe({
    next: (response) => {
      this.meal.set(response.meals[0]);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
```

- `id` is a plain `const` — not a signal. The user cannot change the id while on this page because navigating to a different id creates a new component instance. If you had a "next/previous" button that changed the id without leaving the page, then you would need a signal or subscribe to `paramMap` instead of using `snapshot`.
- `loadMeal()` is a separate method — keeps `ngOnInit` clean, one method per job

---

### `snapshot` vs `subscribe`

Two ways to read a route parameter:

**`snapshot` — read once when the component loads**

```typescript
const id = this.route.snapshot.paramMap.get('id');
```

Use this when the component is destroyed when the user navigates away — which is the standard case.

**`subscribe` — react every time the param changes**

```typescript
this.route.paramMap.subscribe((params) => {
  const id = params.get('id');
  this.loadMeal(id as string);
});
```

Use this when the component stays alive and the param can change — for example a "next / previous" button that changes the id without leaving the page.

In most cases `snapshot` is correct.

---

### `.params` vs `.paramMap`

|                 | `.params`                      | `.paramMap`                           |
| --------------- | ------------------------------ | ------------------------------------- |
| Returns         | Plain object `{ id: '52772' }` | `ParamMap` object with helper methods |
| Read value      | `params['id']`                 | `params.get('id')`                    |
| Check if exists | Manual                         | `params.has('id')`                    |
| Recommended     | No — older API                 | Yes — use this                        |

---

---

## Route guards — protect routes

A route guard is a function that runs before Angular loads a route. It decides if the user is allowed to enter.

Official docs: https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access

### When to use

- User tries to visit `/dashboard` without being logged in → redirect to `/login`
- User tries to visit `/admin` without the admin role → redirect to `/dashboard`

### The modern pattern — `CanActivateFn`

Angular v15+ uses plain functions instead of classes. No `@Injectable`, no class — just a function.

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

- `inject()` works inside guard functions — same as in components
- Return `true` — route loads normally
- Return `router.createUrlTree(['/login'])` — redirects the user
- Do not use `return false` alone — it blocks the route but shows a blank page

### Apply the guard to a route

```typescript
// app.routes.ts
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
];
```

`canActivate` takes an array — you can stack multiple guards on the same route.

### `CanActivateFn` vs `CanActivate` (class-based — old)

| | `CanActivateFn` (modern) | `CanActivate` (old) |
|---|---|---|
| Angular version | v15+ | Before v15 |
| Style | Plain function | Class with interface |
| Needs `@Injectable` | No | Yes |
| Recommended | Yes | No — deprecated |

### Role-based guard

A second type of guard — checks not just *if* the user is logged in, but *what role* they have.

```typescript
// core/guards/admin-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserRole() === 'admin'
    ? true
    : router.createUrlTree(['/dashboard']);
};
```

Stack multiple guards on the same route — Angular runs them in order:

```typescript
{ path: 'admin', canActivate: [authGuard, adminGuard], loadComponent: ... }
```

`authGuard` runs first (is the user logged in?), then `adminGuard` (is the user an admin?). If either fails, the user is redirected.

### Unused parameters in guards

The CLI generates guards with `(route, state)` parameters. If you do not use them, remove them — unused parameters add noise:

```typescript
// generated
export const adminGuard: CanActivateFn = (route, state) => { ... }

// cleaned up
export const adminGuard: CanActivateFn = () => { ... }
```

If you only use one, prefix the unused one with `_` to signal it is intentionally ignored:

```typescript
export const adminGuard: CanActivateFn = (_, state) => { ... }
```

---

## Lazy loading

By default, Angular loads all route components at startup — even pages the user may never visit. Lazy loading fixes that: a component only loads when the user navigates to its route.

Use `loadComponent:` instead of `component:`:

```typescript
// component: — loads at startup (avoid in large apps)
{ path: 'login', component: LoginPage }

// loadComponent: — loads only when the user visits /login
{ path: 'login', loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage) }
```

The arrow function is a **dynamic import** — Angular calls it only when needed.

When you switch to `loadComponent:`, remove the static import at the top of the file. The whole point is that Angular handles the import itself — keeping a static import defeats the purpose.

```typescript
// remove these when using loadComponent:
import { LoginPage } from './pages/login-page/login-page';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
```

Guards like `authGuard` stay as static imports — Angular needs them at startup to know which routes to protect.

A complete lazy-loaded routes file:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard-page/dashboard-page').then(m => m.DashboardPage),
  },
  { path: '**', redirectTo: 'login' },
];
```

---

## Summary

| Tool                           | When to use                                  |
| ------------------------------ | -------------------------------------------- |
| `routerLink`                   | Navigation in the template (links, buttons)  |
| `[routerLink]="['/path', id]"` | Dynamic navigation with a parameter          |
| `Router.navigate()`            | Navigation from TypeScript (after an action) |
| `Location.back()`              | Go back to the previous page                 |
| `RouterOutlet`                 | Where the active page component renders      |
| `ActivatedRoute`               | Read route parameters inside a component     |
| `CanActivateFn`                | Protect a route — run logic before it loads  |
| `canActivate: [g1, g2]`        | Stack multiple guards — run in order         |
| `loadComponent:`               | Lazy load a component — only when needed     |
