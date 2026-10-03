# Angular Material — Card

Official docs: https://material.angular.io/components/card/overview

## What is it?

`MatCard` is a container component that groups related content — a form, a stat block, a login panel. It gives you a surface with optional elevation and a consistent visual style.

---

## Setup

```typescript
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatCardModule]
})
```

---

## Basic structure

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Title</mat-card-title>
    <mat-card-subtitle>Subtitle</mat-card-subtitle>
  </mat-card-header>

  <mat-card-content>
    <!-- main content goes here -->
  </mat-card-content>

  <mat-card-actions>
    <button matButton>Action</button>
  </mat-card-actions>
</mat-card>
```

- `mat-card-header` — optional; holds title and subtitle
- `mat-card-title` — the card heading
- `mat-card-subtitle` — secondary heading below the title
- `mat-card-content` — main body; add padding automatically
- `mat-card-actions` — button row at the bottom

---

## Appearance

```html
<mat-card appearance="outlined">
```

| Value | Description |
|-------|-------------|
| `raised` | Default — card has a shadow (elevation) |
| `outlined` | Flat card with a border, no shadow |

Use `appearance="outlined"` in forms and panels where shadow would feel heavy. Use the default `raised` for stat cards or dashboard widgets that need to stand out.

---

## Stat card pattern

A simple card with a number and a label — no header or actions needed:

```html
<mat-card appearance="outlined">
  <mat-card-content>
    <p class="stat-value">{{ count }}</p>
    <p class="stat-label">Total employees</p>
  </mat-card-content>
</mat-card>
```

```css
.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  color: var(--mat-sys-on-surface-variant);
  font-size: 0.875rem;
}
```

---

## Login / form card pattern

Used in project 06 — a centered card that holds the login form:

```html
<div class="login-container">
  <mat-card appearance="outlined">
    <mat-card-header>
      <mat-card-title>HR Portal</mat-card-title>
      <mat-card-subtitle>Sign in to continue</mat-card-subtitle>
    </mat-card-header>

    <mat-card-content>
      <!-- form fields -->
    </mat-card-content>

    <mat-card-actions align="end">
      <button mat-flat-button type="submit">Sign in</button>
    </mat-card-actions>
  </mat-card>
</div>
```

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

mat-card {
  width: 100%;
  max-width: 400px;
}
```
