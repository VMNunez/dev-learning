# Angular Material — Menu

Official docs: https://material.angular.io/components/menu/overview

A `mat-menu` is a dropdown list of actions that opens from a trigger button. The classic use is the three-dots "more actions" button at the end of a table row — when a row has too many actions to show as inline icon buttons, you collapse them into one menu.

```typescript
import { MatMenuModule } from '@angular/material/menu';
```

## The two pieces — trigger and menu

Docs: https://material.angular.io/components/menu/overview — read: "Toggling the menu programmatically"

A menu is always two parts wired together by a **template reference variable**: the trigger button that opens it, and the `<mat-menu>` panel itself.

```html
<!-- the trigger button -->
<button matIconButton [matMenuTriggerFor]="rowMenu" aria-label="More actions">
  <mat-icon>more_vert</mat-icon>
</button>

<!-- the menu panel -->
<mat-menu #rowMenu="matMenu">
  <button mat-menu-item (click)="onEdit(task)">
    <mat-icon>edit</mat-icon>
    <span>Edit</span>
  </button>
  <button mat-menu-item (click)="onDelete(task.id)">
    <mat-icon>delete</mat-icon>
    <span>Delete</span>
  </button>
</mat-menu>
```

- `[matMenuTriggerFor]="rowMenu"` connects the button to the menu via the `#rowMenu` reference
- `#rowMenu="matMenu"` exports the menu so the trigger can find it
- `mat-menu-item` is each clickable row — it behaves like a button, so you call methods straight from `(click)`

## One menu per row — the gotcha

> When you have a menu in every row of a table, each row needs its **own** `#ref`, or every trigger opens the same menu. Declare the `<mat-menu>` inside the row template (or give each a unique reference) so the trigger and panel are paired per row. A single shared `#menu` reference across many rows is a common mistake — the wrong row's actions fire.

## When to use a menu vs inline icon buttons

| Situation | Use |
|---|---|
| 1–2 actions per row | Inline `matIconButton` (edit, delete) — see [02-button.md](./02-button.md) |
| 3+ actions, or actions that need text labels | `mat-menu` behind a `more_vert` button |
| Page-level actions that don't fit the toolbar | `mat-menu` from a toolbar button |

The interview version: reach for a menu when showing every action inline would clutter the row, or when the actions need words to be clear (not just an icon). It keeps the table tidy and groups related actions in one place.
