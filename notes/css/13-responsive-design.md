# CSS — Responsive Design

Official docs: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design

---

## What is responsive design?

A responsive design adapts to the screen size — the same HTML works on mobile, tablet, and desktop. The layout, font sizes, and spacing adjust to give the best experience on each device.

---

## Mobile-first

Write the base styles for **mobile first**, then add rules for larger screens. This is the recommended approach.

```css
/* Base — mobile */
.grid {
  display: grid;
  grid-template-columns: 1fr;  /* one column on mobile */
  gap: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .grid { grid-template-columns: 1fr 1fr; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

**Why mobile-first?**
- Forces you to start with the essentials — the mobile layout has only what matters
- CSS is additive — you add complexity as screen size grows, not remove it
- Mobile traffic is the majority — the default state should be optimized for mobile
- `min-width` queries are simpler to reason about than `max-width`

---

## Media queries

```css
@media (condition) {
  /* CSS that only applies when the condition is true */
}
```

### min-width — mobile-first

Applies when the screen is **at least** that wide.

```css
@media (min-width: 768px) { /* tablet and up */ }
@media (min-width: 1024px) { /* desktop and up */ }
@media (min-width: 1280px) { /* wide desktop and up */ }
```

### max-width — desktop-first (avoid)

Applies when the screen is **at most** that wide. Less clean — you write the desktop layout first and override for smaller screens.

```css
@media (max-width: 767px) { /* mobile only */ }
```

### Combining conditions

```css
/* Only on tablet — not mobile, not desktop */
@media (min-width: 768px) and (max-width: 1023px) { }
```

---

## Standard breakpoints

| Name | Value | Targets |
|------|-------|---------|
| Mobile | — | default (no @media) |
| Tablet | `768px` | iPad, large phones landscape |
| Desktop | `1024px` | laptops, small monitors |
| Wide | `1280px` | large monitors |

You do not need all four in every project. Most projects only need `768px` and `1024px`.

---

## Responsive patterns

### Show/hide elements

```css
.mobile-menu {
  display: block;  /* visible on mobile */
}

@media (min-width: 1024px) {
  .mobile-menu { display: none; }  /* hide on desktop */
  .desktop-nav { display: flex; }
}
```

### Responsive font sizes

```css
h1 { font-size: 1.5rem; }  /* mobile */

@media (min-width: 768px) {
  h1 { font-size: 2rem; }  /* tablet */
}

@media (min-width: 1024px) {
  h1 { font-size: 2.5rem; }  /* desktop */
}
```

Or use `clamp()` for fluid sizing without media queries — see `16-css-functions.md`.

### Responsive padding/spacing

```css
.container {
  padding: 1rem;  /* mobile */
}

@media (min-width: 768px) {
  .container { padding: 2rem; }
}
```

### Stack on mobile, side by side on desktop

```css
.layout {
  display: flex;
  flex-direction: column;  /* stacked on mobile */
  gap: 1rem;
}

@media (min-width: 768px) {
  .layout { flex-direction: row; }  /* side by side on desktop */
}
```

---

## Fluid design — no @media needed

### Flexible containers

Use `%` and `max-width` instead of fixed `px` widths:

```css
.container {
  width: 90%;       /* 90% of the parent */
  max-width: 1100px; /* but never wider than 1100px */
  margin: 0 auto;
}
```

### Auto-fill grid

Creates as many columns as fit — responsive without any @media:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

### Fluid images

```css
img {
  max-width: 100%;  /* never wider than the container */
  height: auto;     /* keeps aspect ratio */
}
```

---

## Testing responsive design

In Chrome DevTools:
1. `F12` → click the device icon (top left of DevTools)
2. Select a device or set a custom width
3. Or drag the browser window edge to resize

Keyboard shortcut: `Ctrl + Shift + M` (toggle device toolbar).
