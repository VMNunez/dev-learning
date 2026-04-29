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
