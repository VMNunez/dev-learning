# Angular Material — Sidenav

Official docs: https://material.angular.io/components/sidenav/overview

## What is it?

`MatSidenav` adds a collapsible side panel to your app. It is typically used for navigation menus in full-screen apps.

---

## Setup

Add `MatSidenavModule` and `MatListModule` to the component's `imports` array:

```typescript
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  imports: [MatSidenavModule, MatListModule, ...]
})
```

Also add `RouterLink` and `RouterLinkActive` from `@angular/router` for the nav links inside the sidebar.

---

## Basic structure

Three elements always work together:

```html
<mat-sidenav-container>
  <mat-sidenav>Side content</mat-sidenav>
  <mat-sidenav-content>Main content</mat-sidenav-content>
</mat-sidenav-container>
```

- `mat-sidenav-container` — the wrapper; takes the full page
- `mat-sidenav` — the sidebar panel (left by default)
- `mat-sidenav-content` — the main area (toolbar + router-outlet go here)

---

## Mode

The `mode` property controls how the sidebar behaves:

| Mode   | Description |
|--------|-------------|
| `over` | Floats over the content with a backdrop (default) |
| `push` | Pushes the content to the side with a backdrop |
| `side` | Appears side-by-side with the content, no backdrop |

For a persistent app shell navigation, always use `mode="side"`.

---

## Controlling open state with a signal

Use `[opened]` with a boolean expression to open or close the sidenav reactively:

```html
<mat-sidenav mode="side" [opened]="!!isLoggedIn()">
```

`[opened]` expects a `BooleanInput` — a real `boolean`. If your signal returns `User | null`, you must convert it with `!!`:

```typescript
// signal returns User | null — not a boolean
isLoggedIn = this.authService.currentUser;
```

### Toggleable drawer with a signal

For a drawer that the user can open and close with a button, add a signal for the open state and a method to toggle it:

```typescript
isDrawerOpen = signal(true); // true = open on load

onChangeDrawer() {
  this.isDrawerOpen.update(state => !state);
}
```

In the template, combine both conditions — the drawer is only open when the user is logged in AND the signal is true:

```html
<mat-drawer mode="side" [opened]="!!isLoggedIn() && isDrawerOpen()">

<!-- toggle button in the toolbar -->
<button mat-icon-button (click)="onChangeDrawer()">
  <mat-icon>menu</mat-icon>
</button>
```

- `signal(true)` — drawer starts open by default
- `!!isLoggedIn() && isDrawerOpen()` — drawer hides on login page and respects the toggle
- Extract the toggle logic into a method instead of writing `.update(v => !v)` inline in the template — keeps the template readable

```html
<!-- [opened]="isLoggedIn()"   → type error: User | null is not BooleanInput -->
<!-- [opened]="!!isLoggedIn()" → correct: converts to true | false -->
```

---

## Navigation links with mat-nav-list

Use `mat-nav-list` inside the sidenav for navigation links. Each link is an `<a>` with `mat-list-item`:

```html
<mat-sidenav mode="side" opened>
  <mat-nav-list>
    <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
    <a mat-list-item routerLink="/employees" routerLinkActive="active-link">Employees</a>
  </mat-nav-list>
</mat-sidenav>
```

- `mat-nav-list` — Material list styled for navigation
- `mat-list-item` — directive that styles each `<a>` as a Material list item
- `routerLinkActive="active-link"` — adds the CSS class when the link matches the current URL

---

## Setting the width

Set the width via CSS — do not use percent:

```css
mat-sidenav {
  width: 220px;
}
```

---

## Full app shell layout

`mat-sidenav-container` must always be in the DOM — if you wrap the whole container in `@if`, the `router-outlet` inside disappears when the user is logged out and the login page has nowhere to render.

The correct pattern: keep the container at the root level, use `[opened]` to show or hide the sidenav, and put `@if` only around the toolbar:

```html
<mat-sidenav-container>
  <mat-sidenav mode="side" [opened]="!!isLoggedIn()">
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
      <a mat-list-item routerLink="/employees" routerLinkActive="active-link">Employees</a>
      <a mat-list-item routerLink="/departments" routerLinkActive="active-link">Departments</a>
      <a mat-list-item routerLink="/leave-requests" routerLinkActive="active-link">Leave Requests</a>
    </mat-nav-list>
  </mat-sidenav>

  <mat-sidenav-content>
    @if (isLoggedIn()) {
      <mat-toolbar>
        <span class="app-title">HR Portal</span>
        <button matButton (click)="logout()">Log out</button>
      </mat-toolbar>
    }
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```

- `mat-sidenav-container` — always present so `router-outlet` is always available
- `[opened]="!!isLoggedIn()"` — sidenav opens on login, closes on logout
- `@if` only on the toolbar — hides the app shell header on the login page
- `router-outlet` — always rendered inside `mat-sidenav-content`

---

## Active link styling

### What routerLinkActive does

`routerLinkActive` is a directive with two jobs:

1. **Track the URL** — it always knows if this link's route is active or not
2. **Add a CSS class** — only if you give it a name

When you write `routerLinkActive="active-link"`, you do both jobs at once:

```html
<!-- tracks the URL + adds "active-link" class when active -->
<a routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
```

When you write just `routerLinkActive` with no value, you only do job 1:

```html
<!-- tracks the URL — but adds no class -->
<a routerLink="/dashboard" routerLinkActive>Dashboard</a>
```

The directive is still running. It still knows if the route is active. It just adds no CSS class because you gave it no name.

`isActive` is a boolean property on the directive — not a CSS class. It is `true` when the route matches, `false` when it does not. To read it from the template you need a template reference variable.

### Option A — routerLinkActive + your own CSS class

```html
<a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
```

```css
.active-link {
  background-color: var(--mat-sys-primary-container);
  color: var(--mat-sys-on-primary-container);
}
```

### Option B — routerLinkActive + [activated] (Material handles the style)

`[activated]` is a Material input on `mat-list-item`. Pass it a boolean and Material applies its built-in active style — no custom CSS needed.

To get that boolean, use a template reference (`#rla`) to access the directive's `isActive` property:

```html
<a mat-list-item
   routerLink="/dashboard"
   routerLinkActive
   #rla="routerLinkActive"
   [activated]="rla.isActive">
  Dashboard
</a>
```

- `routerLinkActive` — the directive runs and tracks the URL (no class name needed)
- `#rla="routerLinkActive"` — gives you access to the directive from inside the template
- `rla.isActive` — `true` when the route matches the current URL, `false` otherwise
- `[activated]="rla.isActive"` — passes that boolean to Material's built-in active style

`[activated]` alone does nothing — it needs a boolean from outside. `routerLinkActive` is what provides that boolean.

You can also combine both options — track the URL, add your own class, and apply Material's style at the same time:

```html
<a mat-list-item
   routerLink="/dashboard"
   routerLinkActive="active-link"
   #rla="routerLinkActive"
   [activated]="rla.isActive">
  Dashboard
</a>
```

| | Option A | Option B |
|---|---|---|
| You write CSS | Yes | No |
| Style source | Your `.active-link {}` | Material design tokens |
| More control | Yes | Less |
| Less code | No | Yes |

### Known issue: active link shows gray on click instead of the active color

When you click a nav link, the browser gives it focus. Material has a hidden `::before` pseudo-element (the **state layer**) whose opacity increases on focus — this gray overlay shows on top of the blue active color until you click elsewhere.

**The fix:**

First, make sure `routerLinkActive` has a class name — `routerLinkActive` alone adds no class:

```html
<a mat-list-item
   routerLink="/dashboard"
   routerLinkActive="active"
   #rla="routerLinkActive"
   [activated]="rla.isActive">
  Dashboard
</a>
```

Then in the component CSS, hide the state layer when the link is active and focused — but not when hovering, because `:focus` and `:hover` are both true at the same time after a click:

```css
a.active:focus:not(:hover)::before {
  opacity: 0;
}
```

| Part | Why |
|------|-----|
| `a.active` | Only applies when the route is active |
| `:focus` | Only applies right after a click (browser focus) |
| `:not(:hover)` | Keeps the hover effect working on the active link |
| `::before` | Targets Material's state layer, not the element itself |
| `opacity: 0` | Hides the gray layer so the blue active style shows through |

---

## Full height app shell layout

The goal: toolbar fixed at the top (full width), sidebar fixed on the left, only the main content area scrolls. This is the standard pattern for enterprise apps.

```
┌─────────────────────────────────────┐
│  mat-toolbar (full width, fixed)    │
├──────────┬──────────────────────────┤
│          │                          │
│ sidenav  │  mat-sidenav-content     │
│ (fixed)  │  (scrolls here only)     │
│          │                          │
└──────────┴──────────────────────────┘
```

### The working CSS

**`styles.css`** (global):

```css
html, body {
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
}

app-root {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
```

**`app.css`** (App component):

```css
mat-sidenav-container {
  flex: 1;
  min-height: 0;
}
```

### Why each piece is needed

| Rule | Why |
|------|-----|
| `html, body { height: 100% }` | Gives the page a fixed height equal to the viewport. Without `html`, `body { height: 100% }` resolves to `auto` and the chain breaks |
| `body { display: flex; flex-direction: column }` | Stacks toolbar and sidenav-container vertically |
| `app-root { flex: 1 }` | Makes app-root fill the full body height |
| `app-root { overflow: hidden }` | **The key fix.** Without this, flex items with `min-height: auto` can grow beyond their allocated height when content is tall — the whole page scrolls. `overflow: hidden` clips the boundary and stops app-root from growing |
| `mat-sidenav-container { flex: 1 }` | Fills remaining height after the toolbar |
| `mat-sidenav-container { min-height: 0 }` | Allows the container to shrink to its flex-allocated height. Without this, `min-height: auto` can still cause overflow |

Material automatically applies `height: 100%; overflow: auto` to `mat-sidenav-content` — once the container has a constrained height, the content scrolls correctly with no extra CSS needed.

### The height chain

```
html (height: 100% = viewport)
  body (height: 100%, flex column)
    app-root (flex: 1, overflow: hidden)  ← never grows beyond viewport
      mat-toolbar                          ← natural height (~64px)
      mat-sidenav-container (flex: 1, min-height: 0)  ← fills remaining space
        mat-sidenav-content (height: 100%, overflow: auto)  ← scrolls here
```

### Why the page was scrolling without `overflow: hidden`

Even with `flex: 1` on `app-root`, the page was scrolling. This is the chain that caused it:

1. The page content was taller than the viewport
2. `mat-sidenav-container` grew to fit the content (flex items have `min-height: auto` by default)
3. `app-root` grew to fit `mat-sidenav-container`
4. `body` grew to fit `app-root`
5. The whole page scrolled — toolbar and sidebar scrolled with it

`overflow: hidden` on `app-root` cuts the chain at step 3. `app-root` can no longer grow, so `body` stays at viewport height, and the scroll is forced to stay inside `mat-sidenav-content`.

### Common mistakes

| Mistake | Result |
|---------|--------|
| `min-height: 100vh` on body instead of `height: 100%` | Body can grow beyond viewport — page scrolls |
| Missing `overflow: hidden` on `app-root` | Flex item grows with content — toolbar and sidebar scroll away |
| Missing `min-height: 0` on `mat-sidenav-container` | Container doesn't shrink — scroll doesn't trigger inside sidenav-content |
| `overflow: hidden` on `html` and `body` | Blocks ALL scroll including inside `mat-sidenav-content` |
