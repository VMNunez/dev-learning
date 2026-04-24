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