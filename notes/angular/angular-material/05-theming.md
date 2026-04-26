# Angular Material — Theming

Official docs:
- https://material.angular.dev/guide/theming
- https://material.angular.dev/guide/theming-your-components

---

## How the theming system works

Angular Material uses a file called `material-theme.scss` where you call `mat.theme()`. This mixin outputs CSS variables (`--mat-sys-*`) that all Material components read automatically.

You never style Material components with direct CSS. You control them through the theme system.

---

## ★ The main theme — `mat.theme()`

> **You write this once per project. Already done in your setup.**

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: mat.$violet-palette,
    typography: Roboto,
    density: 0,
  ));
}
```

The map accepts three keys:

| Key | What it controls |
|-----|-----------------|
| `color` | All component colors (buttons, checkboxes, inputs...) |
| `typography` | Font family used in all components |
| `density` | Spacing and height of components (0 = default, -5 = most compact) |

---

## Prebuilt color palettes

Reference only — use one of these inside `mat.theme()`:

`mat.$red-palette` `mat.$green-palette` `mat.$blue-palette` `mat.$yellow-palette`
`mat.$cyan-palette` `mat.$magenta-palette` `mat.$orange-palette` `mat.$violet-palette`
`mat.$rose-palette` `mat.$chartreuse-palette` `mat.$spring-green-palette` `mat.$azure-palette`

---

## ★★ Context-specific themes — USE THIS to color components

> **This is the pattern you will use most. Learn it well.**
>
> Define a class in `material-theme.scss`. Apply it in HTML wherever you need it.

```scss
// material-theme.scss

.btn-danger {
  @include mat.theme((
    color: mat.$red-palette,
  ));
}
```

```html
<button matButton class="btn-danger" (click)="delete()">Delete</button>
```

One definition → reused anywhere in the app. This is the correct Angular Material way to make a component a different color.

---

## ★★ Using Material colors in your own CSS — USE THIS constantly

> **Every time you style your own components, use these variables instead of hardcoded colors.**
> This way your styles always match the theme and support light/dark mode automatically.

```css
.my-card {
  background-color: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface);
  border: 1px solid var(--mat-sys-outline);
}
```

Most useful variables:

| Variable | What it is |
|----------|-----------|
| `--mat-sys-primary` | Main theme color |
| `--mat-sys-on-primary` | Text color on primary background |
| `--mat-sys-surface` | Default background color |
| `--mat-sys-on-surface` | Text on surface |
| `--mat-sys-error` | Red/danger color |
| `--mat-sys-outline` | Border color |
| `--mat-sys-surface-container` | Slightly elevated surface (cards, menus) |

---

## Light and dark mode

```scss
html {
  color-scheme: light dark; /* follows the user's system preference */
  @include mat.theme((...));
}
```

To force one mode:
```scss
color-scheme: light;
color-scheme: dark;
```

---

## Fine-grained overrides — rarely needed

If you need to change **one specific property** of a component (not the whole palette):

```scss
.btn-custom {
  @include mat.button-overrides((
    text-label-text-color: #5a5a5a,
  ));
}
```

In practice, you will rarely need this as a junior developer.

---

## Where to put what

| File | What goes there |
|------|----------------|
| `material-theme.scss` | `mat.theme()`, context-specific classes (`.btn-danger`), overrides |
| Component CSS (e.g. `task-table.css`) | `var(--mat-sys-*)` for your own components |
| `styles.css` | Global layout styles, font imports |

---

## Summary — the three tools

| Tool | Use case | How often |
|------|---------|-----------|
| `mat.theme(color: mat.$red-palette)` scoped to a class | Give a component a different color scheme | Often |
| `var(--mat-sys-*)` in component CSS | Apply Material colors to your own components | Very often |
| `mat.button-overrides(token: value)` scoped to a class | Change one specific token of a button | Rarely |
