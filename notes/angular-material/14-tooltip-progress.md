# Angular Material — Tooltip and Progress Indicators

Official docs: https://material.angular.io/components/tooltip/overview

This file groups three small but constantly-used pieces: the hover tooltip, and the two loading indicators (spinner and bar). They show up in every enterprise app — a tooltip on an icon button, a spinner while an HTTP call is in flight.

```typescript
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
```

## matTooltip — a hint on hover or focus

Docs: https://material.angular.io/components/tooltip/overview — read: "Positioning"

`matTooltip` is a directive you drop onto any element. It shows a short text hint when the user hovers with the mouse or focuses with the keyboard.

```html
<button matIconButton aria-label="Delete task" matTooltip="Delete task">
  <mat-icon>delete</mat-icon>
</button>
```

> **Why add `matTooltip` to an icon button that already has `aria-label`?** They serve different users. `aria-label` is read by screen readers (blind users); `matTooltip` is a visible hint for sighted users who hover and wonder what the icon does. An icon-only button should usually have both.

Control where it appears with `matTooltipPosition`:

```html
<button matIconButton matTooltip="Edit" matTooltipPosition="above">
  <mat-icon>edit</mat-icon>
</button>
```

Positions: `above`, `below`, `left`, `right`, plus `before` / `after` (which flip for right-to-left languages). You rarely need to set it — the default `below` is fine most of the time.

## mat-progress-spinner — circular loading indicator

Docs: https://material.angular.io/components/progress-spinner/overview — read: "Modes"

The circular spinner plays the same role as the hand-made CSS `.spinner` div from the earlier Angular projects (see [06-http-rxjs.md](../angular/06-http-rxjs.md)) — show it while you wait for an HTTP response, then hide it when the data arrives.

```html
@if (isLoading()) {
  <mat-progress-spinner mode="indeterminate" diameter="40" />
} @else {
  <!-- show the data -->
}
```

`mode="indeterminate"` means "I don't know how long this will take" — the spinner just rotates. That is the right mode for an HTTP call, because you can't know the progress percentage.

## mat-progress-bar — horizontal loading indicator

Docs: https://material.angular.io/components/progress-bar/overview — read: "Progress mode"

A horizontal bar. Same idea as the spinner but a different shape — common at the top of a page or inside a card.

```html
<!-- unknown duration — the bar animates back and forth -->
<mat-progress-bar mode="indeterminate" />

<!-- known percentage — the bar fills to [value] (0–100) -->
<mat-progress-bar mode="determinate" [value]="uploadPercent()" />
```

| Mode | When to use |
|---|---|
| `indeterminate` | You don't know how long it takes — an HTTP request, a save |
| `determinate` + `[value]` | You can measure progress — a file upload, a multi-step import |

## Loading-state pattern with Material

The standard way to handle a form submit that calls an API: disable the submit button and show a spinner while an `isLoading()` signal is `true`. This is what prevents a **double submission** — the user cannot click Save twice while the first request is still in flight.

```html
<button matButton="filled" type="submit" [disabled]="isLoading()">
  @if (isLoading()) {
    <mat-progress-spinner mode="indeterminate" diameter="20" />
  } @else {
    Save
  }
</button>
```

```typescript
isLoading = signal(false);

onSubmit() {
  if (this.form.invalid) return;
  this.isLoading.set(true);
  this.service.save(this.form.value)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false),
    });
}
```

The key is `[disabled]="isLoading()"` — while the request runs, the button is dead, so no second request can fire. Always reset `isLoading` in **both** `next` and `error`, or the button stays disabled forever after a failure.
