# CSS — Borders and Shadows

Official docs:
- Border: https://developer.mozilla.org/en-US/docs/Web/CSS/border
- Box-shadow: https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow

---

## border

### Shorthand

```css
border: width style color;

border: 1px solid #ccc;
border: 2px dashed var(--primary);
border: none;   /* remove border */
```

The `style` value is required — without it, the border does not appear:

| Style | Looks like |
|-------|-----------|
| `solid` | ─────── |
| `dashed` | - - - - |
| `dotted` | · · · · |
| `none` | no border |

### Individual sides

```css
border-top: 2px solid var(--primary);
border-bottom: 1px solid var(--border);
border-left: none;
border-right: 1px solid var(--border);
```

### border-color, border-width, border-style

```css
border-color: var(--border);
border-width: 1px;
border-style: solid;
```

---

## border-radius

Rounds the corners of an element.

```css
border-radius: 4px;     /* subtle rounding */
border-radius: 8px;     /* standard card radius */
border-radius: 12px;    /* more rounded */
border-radius: 50%;     /* circle — only works on equal width and height */
border-radius: 9999px;  /* pill shape — works on any aspect ratio */
```

### Individual corners

```css
border-radius: 8px 8px 0 0;  /* top-left  top-right  bottom-right  bottom-left */
```

Useful for elements that attach to a bottom bar — round only the top corners.

### Circle vs pill

```css
/* Circle — element must be square */
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

/* Pill — works on any size */
.badge {
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
}
```

---

## outline

`outline` is similar to `border` but it sits **outside** the border and does not take up space in the layout. It does not affect the element's size.

```css
outline: 2px solid var(--primary);
outline-offset: 2px;  /* gap between the element and the outline */
outline: none;        /* removes the default browser focus ring */
```

**Important:** browsers add a default `outline` to focused elements for accessibility. If you remove it, always add a visible custom focus style:

```css
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

---

## box-shadow

Adds a shadow behind an element.

### Syntax

```css
box-shadow: offset-x  offset-y  blur  spread  color;
```

| Part | What it does |
|------|-------------|
| `offset-x` | Horizontal shadow — positive = right, negative = left |
| `offset-y` | Vertical shadow — positive = down, negative = up |
| `blur` | Softness — 0 is sharp, higher = softer |
| `spread` | Size — positive = larger, negative = smaller (optional) |
| `color` | Shadow color — always use `rgba` for transparency |

```css
/* Subtle card shadow */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

/* Medium shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

/* Lifted card (hover) */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);

/* Sharp shadow (no blur) */
box-shadow: 4px 4px 0 #1a1a1a;

/* No shadow */
box-shadow: none;
```

### Multiple shadows

```css
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.06),
  0 4px 12px rgba(0, 0, 0, 0.10);
```

### inset shadow

`inset` makes the shadow appear inside the element.

```css
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);  /* pressed/sunken effect */
```

---

## Common patterns

### Card

```css
.card {
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow);
}

.card:hover {
  box-shadow: 0 8px 24px var(--shadow);
}
```

### Input field

```css
input {
  border: 1px solid var(--border);
  border-radius: 6px;
  outline: none;
}

input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(232, 87, 42, 0.15);  /* focus ring */
}
```

### Button

```css
button {
  border: none;
  border-radius: 6px;
}

button.outline {
  border: 1px solid var(--primary);
  background: transparent;
}
```
