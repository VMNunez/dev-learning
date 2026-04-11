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

## Summary

| Tool | When to use |
|------|-------------|
| `routerLink` | Navigation in the template (links, buttons) |
| `Router.navigate()` | Navigation from TypeScript (after an action) |
| `RouterOutlet` | Where the active page component renders |
