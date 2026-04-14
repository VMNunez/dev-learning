# Angular — Routing

## What is routing?

Routing lets you navigate between pages without reloading the browser. Each URL shows a different component.

## Define routes

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'add', component: AddTransactionPage },
];
```

## RouterOutlet — where Angular renders the active page

```html
<!-- app.html -->
<router-outlet />
```

## routerLink — navigate declaratively in the template

```html
<a routerLink="/">Dashboard</a>
<a routerLink="/add">Add transaction</a>
```

Import `RouterLink` in the component:
```typescript
imports: [RouterLink]
```

## Router service — navigate programmatically from TypeScript

```typescript
private router = inject(Router);

onSubmit() {
  // after saving, go back to the dashboard
  this.router.navigate(['/']);
}
```

Use this when you need to navigate after an action (form submit, delete, etc).

---

## Route parameters — dynamic segments

A route parameter is a part of the URL that changes. Define it with `:` in `app.routes.ts`:

```typescript
{ path: 'detail/:id', component: MealDetailPage }
```

`/detail/52772` and `/detail/53049` both match this route. `52772` becomes the value of `id`.

### Route params vs query params

| | Route param | Query param |
|--|-------------|-------------|
| URL | `/detail/52772` | `/detail?id=52772` |
| Use for | Identity — which specific item | Filters, pagination, sorting |
| Example | `/users/victor`, `/products/42` | `/products?page=2&sort=price` |

### Dynamic routerLink

When the route has a parameter, use an array in `routerLink`:

```html
<div [routerLink]="['/detail', meal.idMeal]">...</div>
```

First item is the path, second is the value for `:id`.

### Read the parameter — ActivatedRoute

In the detail component, inject `ActivatedRoute` to read the `:id` from the URL:

```typescript
import { ActivatedRoute } from '@angular/router';

private route = inject(ActivatedRoute);

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  // id is '52772' — always a string
}
```

`snapshot` — the current state of the route at the moment the component loads.
`paramMap.get('id')` — reads the value of `:id` from the URL.

---

## Summary

| Tool | When to use |
|------|-------------|
| `routerLink` | Navigation in the template (links, buttons) |
| `[routerLink]="['/path', id]"` | Dynamic navigation with a parameter |
| `Router.navigate()` | Navigation from TypeScript (after an action) |
| `RouterOutlet` | Where the active page component renders |
| `ActivatedRoute` | Read route parameters inside a component |
