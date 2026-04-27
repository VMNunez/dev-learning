# Angular Material — Button

Official docs: https://material.angular.io/components/button/overview

Add this to the component's imports array:

```typescript
import { MatButtonModule } from '@angular/material/button';
```

## Basic usage

```html
<button matButton>Text</button>
<button matButton="filled">Filled</button>
<button matButton="outlined">Outlined</button>
<button matButton="elevated">Elevated</button>
<button matButton="tonal">Tonal</button>
```

## Button types

| Attribute | Shape | When to use |
|-----------|-------|-------------|
| `matButton` | Rectangle | Standard actions — save, cancel, filter, search |
| `matButton="filled"` | Rectangle, solid background | Primary action on the page — the most important button |
| `matButton="outlined"` | Rectangle, border only | Secondary action — less important than filled |
| `matButton="elevated"` | Rectangle, with shadow | When the button needs to stand out from a patterned background |
| `matButton="tonal"` | Rectangle, soft color | Medium emphasis — between outlined and filled |
| `matIconButton` | Circle, icon only | Small actions inside a table row or toolbar (edit, delete, close) |
| `matFab` | Large circle, icon | The one main action of the whole page (e.g. "+" to add) |
| `matMiniFab` | Small circle, icon | Same as FAB but smaller |

## Rule of thumb

- Use `matButton="filled"` for the main action on the page (Add Task button)
- Use `matIconButton` for edit/delete buttons inside table rows — icon only, no text
- Use `matFab` when there is one dominant action for the whole screen

## Icon button example

```html
<button matIconButton aria-label="Delete task">
  <mat-icon>delete</mat-icon>
</button>
```

Always add `aria-label` to icon buttons — without text, screen readers need it to describe the action.

## Customizing button colors — the correct way (Angular Material v19+)

In Angular Material v19+, the correct way to apply a custom color to a button is to define a **context-specific theme** in `material-theme.scss`, scoped to a CSS class.

**Do NOT** override Material CSS classes directly. That is considered a hack and can break with updates.

### Pattern

**`material-theme.scss`:**
```scss
.btn-danger {
  @include mat.theme((
    color: mat.$red-palette,
  ));
}
```

**Component HTML:**
```html
<button matButton class="btn-danger" (click)="delete()">Delete</button>
```

### Why this works

`mat.theme()` outputs CSS variables. When scoped to a class, those variables only apply to elements with that class and their children. The button reads the variables automatically — no hardcoded colors needed.

### Available prebuilt palettes

Angular Material includes these palettes you can use in `mat.theme()`:

`mat.$red-palette`, `mat.$green-palette`, `mat.$blue-palette`, `mat.$yellow-palette`, `mat.$cyan-palette`, `mat.$magenta-palette`, `mat.$orange-palette`, `mat.$violet-palette`, `mat.$rose-palette`

### Alternatives from the docs

| Approach | When to use |
|----------|-------------|
| `mat.theme()` scoped to a class | Change the full color palette for a button or container |
| `mat.button-overrides()` scoped to a class | Change one specific token (e.g. only the text color) |
| `mat.theme-overrides()` scoped to a class | Change a system-level token (e.g. `primary-container`) |
| `var(--mat-sys-error)` in component CSS | Apply a single Material color without SCSS |

### The rule

- Define themed classes in `material-theme.scss`
- Reuse those classes anywhere in the app
- One definition → used everywhere