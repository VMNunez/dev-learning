# CSS — Functions

Official docs: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Functions

---

## calc()

Calculates a value using math. The key feature: you can mix different units.

```css
calc(expression)
```

```css
width: calc(100% - 2rem);      /* full width minus 2rem padding */
height: calc(100vh - 60px);    /* full viewport minus header height */
padding: calc(1rem + 4px);
font-size: calc(1rem + 0.5vw);
```

**Rules:**
- Must have spaces around `+` and `-`: `calc(100% - 20px)` ✅ — `calc(100%-20px)` ❌
- `*` and `/` do not need spaces but it is clearer to add them

### Common use cases

```css
/* Content area that leaves space for a fixed sidebar */
.content {
  width: calc(100% - 250px);
  margin-left: 250px;
}

/* Full height minus the toolbar */
.page {
  min-height: calc(100vh - 64px);
}

/* Equal columns with gap */
.col {
  width: calc(50% - 0.5rem); /* two columns with 1rem gap between them */
}
```

---

## clamp()

Clamps a value between a minimum and a maximum. The middle value is the preferred (usually fluid).

```css
clamp(min, preferred, max)
```

The browser uses the `preferred` value, but never goes below `min` or above `max`.

```css
font-size: clamp(1rem, 2.5vw, 2rem);
/* minimum: 1rem | preferred: 2.5vw (grows with viewport) | maximum: 2rem */
```

### Fluid typography without @media

```css
h1 { font-size: clamp(1.5rem, 5vw, 3rem); }
/* mobile (320px): 5vw = 16px → uses 1.5rem */
/* desktop (1200px): 5vw = 60px → uses 3rem (clamped) */
/* tablet: somewhere in between, scales smoothly */

p { font-size: clamp(1rem, 1.5vw, 1.25rem); }
```

### Fluid spacing

```css
.container {
  padding: clamp(1rem, 5vw, 3rem);  /* grows with viewport, within limits */
}
```

---

## min()

Returns the **smallest** of the given values. The browser picks whichever is smaller.

```css
width: min(100%, 600px);
/* on small screens: 100% (smaller than 600px)  */
/* on large screens: 600px (smaller than 100%) */
```

Useful for making an element fluid on mobile but capped on desktop — without `max-width`:

```css
/* These two are equivalent */
.card { width: min(100%, 400px); }
.card { max-width: 400px; width: 100%; }
```

---

## max()

Returns the **largest** of the given values. The browser picks whichever is larger.

```css
padding: max(1rem, 5%);
/* on small screens: 5% may be less than 1rem → uses 1rem */
/* on large screens: 5% is more than 1rem → uses 5% */
```

Useful to ensure a minimum value even when using relative units.

---

## var()

Reads a CSS custom property (variable). Already covered in `01-reset-variables.md`.

```css
color: var(--primary);
color: var(--text, #1a1a1a);  /* second argument is the fallback */
```

---

## Quick reference

| Function | What it does | Example |
|----------|-------------|---------|
| `calc()` | Math with mixed units | `calc(100% - 2rem)` |
| `clamp(min, val, max)` | Fluid value with limits | `clamp(1rem, 2.5vw, 2rem)` |
| `min(a, b)` | Picks the smaller value | `min(100%, 600px)` |
| `max(a, b)` | Picks the larger value | `max(1rem, 5%)` |
| `var(--name)` | Reads a CSS variable | `var(--primary)` |
