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

## Summary

| Tool                           | When to use                                  |
| ------------------------------ | -------------------------------------------- |
| `routerLink`                   | Navigation in the template (links, buttons)  |
| `[routerLink]="['/path', id]"` | Dynamic navigation with a parameter          |
| `Router.navigate()`            | Navigation from TypeScript (after an action) |
| `Location.back()`              | Go back to the previous page                 |
| `RouterOutlet`                 | Where the active page component renders      |
| `ActivatedRoute`               | Read route parameters inside a component     |
