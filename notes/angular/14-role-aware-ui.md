# 14 — Role-aware UI

## What it is

Role-aware UI means showing or hiding elements based on the logged-in user's role.

It is different from route guards:

| | What it does |
|---|---|
| **Route guard** | Blocks the route — user cannot load the page |
| **Role-aware UI** | Hides elements — user sees a cleaner interface |

Both work together. Guards are security. Role-aware UI is UX.

---

## The base pattern — `isAdmin` computed signal

In the component, derive a boolean from the auth service:

```typescript
isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');
```

Then use it in the template:

```html
@if (isAdmin()) {
  <button>Add Employee</button>
}
```

Key point: `isAdmin` is a `computed()` — it updates automatically when `currentUser` changes (e.g. after logout).

---

## Filtering an array based on role

When you have a list with some items that are admin-only, filter in TypeScript — not in the template.

### Step 1 — mark items with a flag

```typescript
navLinks = [
  { label: 'Dashboard', path: '/dashboard', adminOnly: false },
  { label: 'Employees', path: '/employees', adminOnly: true },
  { label: 'Leave Requests', path: '/leave-requests', adminOnly: false },
];
```

### Step 2 — create a computed that filters

```typescript
filteredNavLinks = computed(() =>
  this.isAdmin() ? this.navLinks : this.navLinks.filter((link) => !link.adminOnly)
);
```

Read it as: "if admin, return everything — otherwise, return only the non-restricted items."

### Step 3 — use the computed in the template

```html
@for (link of filteredNavLinks(); track link.path) {
  <a [routerLink]="link.path">{{ link.label }}</a>
}
```

No `@if` inside the loop. The template just renders what TypeScript already decided.

---

## Why filter in TypeScript, not in the template?

**Bad — logic in the template:**
```html
@for (link of navLinks; track link.path) {
  @if (isAdmin() || !link.adminOnly) {
    <a [routerLink]="link.path">{{ link.label }}</a>
  }
}
```

**Problems:**
- The condition is evaluated on every iteration
- If the link markup changes, you may need to duplicate it across `@if`/`@else` branches
- Templates should describe *what* to render, not *when* to include something

**Good — logic in TypeScript, clean template:**
```typescript
filteredNavLinks = computed(() => ...);
```
```html
@for (link of filteredNavLinks(); track link.path) { ... }
```

---

## Hiding columns in a table

When a whole column should be hidden (e.g. the `actions` column for employees), make `displayedColumns` a `computed()` that depends on `isAdmin`:

```typescript
isAdmin = input<boolean>(false);

displayedColumns = computed(() => {
  const base = ['firstName', 'lastName', 'email', 'status'];
  return this.isAdmin() ? [...base, 'actions'] : base;
});
```

The table automatically re-renders with or without the column.

---

## Real example — HR Portal sidebar (Project 06)

```typescript
// app.ts
isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

navLinks = [
  { label: 'Dashboard', path: '/dashboard', adminOnly: false },
  { label: 'Employees', path: '/employees', adminOnly: true },
  { label: 'Departments', path: '/departments', adminOnly: true },
  { label: 'Leave Requests', path: '/leave-requests', adminOnly: false },
];

filteredNavLinks = computed(() =>
  this.isAdmin() ? this.navLinks : this.navLinks.filter((link) => !link.adminOnly)
);
```

```html
<!-- app.html -->
@for (link of filteredNavLinks(); track link.path) {
  <a mat-list-item [routerLink]="link.path" routerLinkActive="active">
    {{ link.label }}
  </a>
}
```
