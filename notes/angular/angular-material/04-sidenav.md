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

## Always open

Add `opened` to keep the sidenav visible without a toggle button:

```html
<mat-sidenav mode="side" opened>
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

When the sidenav is used as the app shell, wrap everything in `@if (isLoggedIn())` and provide a fallback `<router-outlet>` for the login page:

```html
@if (isLoggedIn()) {
  <mat-sidenav-container>
    <mat-sidenav mode="side" opened role="navigation">
      <mat-nav-list>
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-list-item routerLink="/employees" routerLinkActive="active-link">Employees</a>
        <a mat-list-item routerLink="/departments" routerLinkActive="active-link">Departments</a>
        <a mat-list-item routerLink="/leave-requests" routerLinkActive="active-link">Leave Requests</a>
      </mat-nav-list>
    </mat-sidenav>

    <mat-sidenav-content>
      <mat-toolbar>
        <span class="app-title">HR Portal</span>
        <button matButton (click)="logout()">Log out</button>
      </mat-toolbar>
      <router-outlet />
    </mat-sidenav-content>
  </mat-sidenav-container>
} @else {
  <router-outlet />
}
```

- `role="navigation"` — accessibility attribute; tells screen readers this is a nav region
- The `@else` branch renders the login page without any shell UI

---

## Active link styling

`routerLinkActive` adds a class to the link when its route is active. Style it in the component CSS:

```css
.active-link {
  background-color: var(--mat-sys-primary-container);
  color: var(--mat-sys-on-primary-container);
}
```

---

## Full height layout

`mat-sidenav-container` needs an explicit height to fill the viewport. Set it in the global `styles.css` or in the component:

```css
mat-sidenav-container {
  height: 100vh;
}
```
