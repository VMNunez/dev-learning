# CSS — Future Learning Roadmap

Topics to study once the current 17 files are solid. Nothing here is needed for the first interview — needed to keep up with modern CSS and write more maintainable styles in professional projects.

---

## Phase 1 — After landing the first job

### CSS cascade layers — `@layer`

A new way to manage the cascade without fighting specificity. Layers have an explicit priority order, and all rules inside a lower-priority layer lose to all rules in a higher-priority layer — regardless of selector specificity.

```css
@layer reset, base, components, utilities;

@layer base {
  a { color: blue; }
}

@layer utilities {
  .text-red { color: red; }  /* wins over @layer base, even with lower specificity */
}
```

This makes large stylesheets much easier to reason about. You will see `@layer` in Angular Material and modern CSS frameworks.

### `:has()` — the parent selector

Select a parent based on what it contains:

```css
/* Style a card differently if it contains an image */
.card:has(img) {
  padding: 0;
}

/* Style a form field if its input is invalid */
.form-field:has(input:invalid) {
  border-color: red;
}
```

Before `:has()`, targeting a parent based on its children was impossible in pure CSS and required JavaScript. It is now supported in all modern browsers.

### CSS nesting (native)

Nesting rules inside parent rules — no Sass required:

```css
.card {
  padding: 1rem;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .card__title {
    font-size: 1.25rem;
  }
}
```

Supported in all modern browsers since 2023. Makes component styles easier to read without a preprocessor.

### Dark mode — `@prefers-color-scheme`

Respond to the user's system dark mode preference:

```css
:root {
  --background: #ffffff;
  --text: #1a1a1a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #1a1a1a;
    --text: #f0f0f0;
  }
}
```

When you use CSS variables throughout the design, switching to dark mode is only a few lines. Companies increasingly ask about this in interviews.

---

## Phase 2 — After 6–12 months

### Container queries — `@container`

Apply styles based on the size of the parent container, not the viewport:

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}
```

More powerful than media queries for component-level responsiveness — the card adapts to wherever it is placed, not to the viewport. Useful in design systems where a component can appear in a sidebar or full-width.

### Subgrid

Lets a child element participate in the parent grid's column or row tracks:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.card {
  display: grid;
  grid-column: span 1;
  grid-template-rows: subgrid;  /* uses parent rows */
}
```

Solves the alignment problem in card grids where titles, images, and actions are different heights in different cards. Used in Angular Material card layouts.

### `@property` — typed CSS variables

Declare the type, initial value, and inheritance of a custom property:

```css
@property --rotation {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { --rotation: 360deg; }
}
```

Allows CSS variables to be animated (normally they cannot be). Also enables better tooling support and type validation.

---

## Phase 3 — Mid-level

### Scroll-driven animations

Trigger animations based on scroll position without JavaScript:

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.section {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

Replaces many use cases for `IntersectionObserver` and scroll-based JavaScript animations. Clean and performant.

### CSS Houdini — Paint and Layout APIs

Low-level APIs that let you extend CSS with JavaScript — write custom paint functions that CSS can call, or custom layout algorithms. Very advanced; only relevant if you are building a CSS framework or a component library from scratch.

---

## What NOT to study prematurely

- **Sass/SCSS** — a CSS preprocessor with variables, nesting, and mixins. Now that native CSS has variables and nesting, Sass is less essential. Learn it only if a project requires it.
- **CSS-in-JS** — writing CSS as JavaScript objects (styled-components, Emotion). Not used in Angular. Only relevant if you move to React.
- **CSS Modules** — scoped CSS via import hashes. Angular handles this with component encapsulation — you do not need CSS Modules.
- **PostCSS** — a build tool that transforms CSS. You will encounter it indirectly (Angular uses it internally), but you do not need to configure it yourself.
