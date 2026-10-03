# Angular — Component Styles and View Encapsulation

Official docs: https://angular.dev/guide/components/styling

## What is view encapsulation?

Angular adds a unique attribute (e.g. `_ngcontent-abc-123`) to every element in a component's template. It also transforms the component's CSS selectors to only match elements with that attribute.

This means styles in `component.css` are **scoped** — they only apply to elements inside that component's own template. They cannot accidentally affect other components.

## The rule

| What you are targeting                       | Where to put the CSS          |
| -------------------------------------------- | ----------------------------- |
| Elements you wrote in your own template       | `component.css` ✅            |
| Internal elements rendered by a directive / Material component | `styles.css` (global) ✅ |

## What works in component CSS

Any element you placed in your own template — including Angular Material custom elements — gets the scoping attribute and responds to your component CSS.

```css
/* login-page.css */

form {
  display: flex;
  flex-direction: column; /* ✅ — <form> is in your template */
}

mat-form-field {
  width: 100%; /* ✅ — <mat-form-field> is in your template */
}

mat-card {
  max-width: 400px; /* ✅ — <mat-card> is in your template */
}
```

## What does NOT work in component CSS

Angular Material components render their own internal HTML. Those internal elements do NOT get your component's attribute — so your scoped CSS cannot reach them.

```css
/* login-page.css */

.mat-mdc-form-field-infix {
  padding: 0; /* ❌ — this is inside mat-form-field, not in your template */
}

.mat-sort-header-container {
  justify-content: center; /* ❌ — rendered internally by mat-sort-header */
}
```

For these, put the rule in **`styles.css`** (no encapsulation — applies everywhere):

```css
/* styles.css */

.mat-sort-header-container {
  justify-content: center; /* ✅ — global styles reach internal Material elements */
}
```

## Summary

- **Component CSS** → for elements you wrote in your own template
- **Global `styles.css`** → for internal elements created by Material directives or other components
- When a style does not work in component CSS, move it to `styles.css` and it will work

---

## :host — target the component's own element

`:host` targets the element Angular inserts for your component — the `<app-card>` tag itself, not anything inside it.

```css
/* employee-card.css */
:host {
  display: block;   /* custom elements are inline by default — this fixes it */
  margin-bottom: 1rem;
}
```

Without `:host`, you cannot style the outer wrapper from inside the component CSS — you would have to do it from the parent, which breaks encapsulation.

### Conditional :host

Apply a CSS class to the host element itself from the parent, then read it inside the component:

```css
/* the parent adds class="featured" to <app-card> */
:host(.featured) {
  border-left: 4px solid var(--mat-sys-primary);
}
```

This is the correct way to make a component look different based on context without breaking encapsulation.

---

## ViewEncapsulation options

Angular has three modes. You set them in the `@Component` decorator.

```typescript
import { ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.Emulated,  // default — not needed, shown for clarity
})
```

| Mode | What it does | When to use |
|---|---|---|
| `Emulated` (default) | Adds unique attributes — CSS is scoped to the component | Always — this is the correct default |
| `ShadowDom` | Uses the browser's native Shadow DOM | Rarely — only for web components that must be truly isolated |
| `None` | No scoping — component CSS becomes global | Only when you have no other option |

### ViewEncapsulation.None — why it is dangerous

With `None`, every CSS rule in the component leaks into the global scope. It will affect elements in other components that happen to match the selector.

```typescript
// ❌ dangerous — avoid unless you have no other option
@Component({
  encapsulation: ViewEncapsulation.None,
})
```

When you are tempted to use `None` to reach Material internals, put the rule in `styles.css` instead — same effect, no leakage risk.

---

## ::ng-deep — deprecated, still seen in legacy code

`::ng-deep` was a CSS combinator that made a rule ignore encapsulation — it reached into child components and Material internals from inside a component's CSS file.

```css
/* OLD — deprecated, do not write new code like this */
::ng-deep .mat-mdc-form-field-infix {
  padding: 0;
}
```

It still works in browsers but Angular officially deprecated it because it breaks the contract of encapsulated components — the rule leaks globally just like `ViewEncapsulation.None`.

**What to do instead:**

```css
/* styles.css — correct approach for Material internals */
.mat-mdc-form-field-infix {
  padding: 0;
}
```

You will see `::ng-deep` in almost every enterprise Angular codebase built before 2022. When you see it: leave it if it is working and not causing problems. When you write new code: use `styles.css` for global Material overrides.
