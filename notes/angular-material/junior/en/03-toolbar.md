# Angular Material — Toolbar

Official docs: https://material.angular.io/components/toolbar/overview

## What is it?

`mat-toolbar` is a container for headers, titles, and actions. It is typically placed at the top of the app as a navigation bar.

---

## Setup

Add `MatToolbarModule` to the component's `imports` array:

```typescript
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  imports: [MatToolbarModule, ...]
})
```

---

## Basic usage

```html
<mat-toolbar>
  <span>HR Portal</span>
</mat-toolbar>
```

---

## Title on the left, actions on the right

The toolbar does not position its content automatically. Use flexbox to push content to each side.

The trick is a spacer element with `flex: 1 1 auto` — it expands to fill all available space, pushing everything after it to the right:

```html
<mat-toolbar>
  <span>HR Portal</span>
  <span class="spacer"></span>
  <button matButton (click)="logout()">Logout</button>
</mat-toolbar>
```

```css
.spacer {
  flex: 1 1 auto;
}
```

---

## Show only when logged in

In `app.html`, wrap the toolbar in an `@if` so it only appears when the user is authenticated:

```html
@if (currentUser()) {
  <mat-toolbar>
    <span>HR Portal</span>
    <span class="spacer"></span>
    <button matButton (click)="logout()">Logout</button>
  </mat-toolbar>
}
<router-outlet />
```

Use `currentUser` signal from `AuthService` — not a plain `isLoggedIn()` method. A signal updates the template reactively; a plain method does not.

```typescript
// app.ts
private authService = inject(AuthService);
currentUser = this.authService.currentUser;

logout() {
  this.authService.logout();
}
```

---

## Multiple rows

If you need more than one row, use `<mat-toolbar-row>` inside `<mat-toolbar>`:

```html
<mat-toolbar>
  <mat-toolbar-row>
    <span>First row</span>
  </mat-toolbar-row>
  <mat-toolbar-row>
    <span>Second row</span>
  </mat-toolbar-row>
</mat-toolbar>
```

> Do not mix content inside and outside `<mat-toolbar-row>` when using multiple rows.

---

## Color

Apply a theme color with the `color` attribute:

```html
<mat-toolbar color="primary">...</mat-toolbar>
```

Common values: `primary`, `accent`, `warn`.
