# CSS — Units

Official docs: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units

## Absolute units

### px — pixels

Fixed size — always the same regardless of screen or user settings.

```css
border: 1px solid var(--border);
border-radius: 8px;
```

Use for: borders, border-radius, box-shadow blur. Avoid for font sizes — it ignores the user's browser font size preference.

---

## Relative units

### rem — relative to root

`1rem` = the root font size (browser default: `16px`).

```css
font-size: 1rem;    /* 16px */
font-size: 1.5rem;  /* 24px */
padding: 1rem;      /* 16px */
gap: 0.5rem;        /* 8px */
```

Use for: font sizes, padding, margin, gap. Respects the user's browser font size setting — good for accessibility.

### em — relative to parent

`1em` = the font size of the **parent** element. Compounds through nesting, which makes it hard to predict.

```css
/* parent has font-size: 16px */
.child { font-size: 1.5em; }  /* 24px */

/* if child has a child: */
.grandchild { font-size: 1.5em; }  /* 36px — compounded! */
```

Use for: component-scoped spacing that should scale with the component's font size. In practice, `rem` is safer and more predictable — prefer `rem` by default.

### % — relative to parent's value

For width: relative to parent's width. For padding/margin: also relative to parent's **width** (even for top/bottom).

```css
width: 100%;          /* fills parent's width */
max-width: 80%;
margin: 0 auto;       /* centers a block element */
```

Use for: widths in fluid layouts, `margin: 0 auto` to center.

### vh / vw — relative to viewport

`1vh` = 1% of the viewport height. `1vw` = 1% of the viewport width.

```css
height: 100vh;   /* full screen height */
width: 100vw;    /* full screen width */
min-height: 100vh;  /* at least full screen, grows with content */
```

Use for: full-page layouts, login pages, hero sections, sidenav containers.

`min-height: 100vh` is safer than `height: 100vh` for pages with variable content — it grows instead of overflowing.

### fr — fraction of grid space

Only works inside CSS Grid. `1fr` = one fraction of the available free space after fixed columns are placed.

```css
grid-template-columns: 250px 1fr;        /* sidebar + content */
grid-template-columns: 1fr 1fr;          /* two equal columns */
grid-template-columns: 1fr 2fr 1fr;      /* middle takes twice as much */
```

Use for: defining grid column sizes.

---

## When to use which unit

| What | Unit | Why |
|------|------|-----|
| Font sizes | `rem` | Respects user settings |
| Padding, margin, gap | `rem` | Consistent scale |
| Border, border-radius | `px` | Always the same visual weight |
| Width of containers | `%` or `max-width` in `px`/`rem` | Fluid but controlled |
| Full-height layouts | `vh` | Fills the viewport |
| Grid columns | `fr` or `px` | Fraction of space or fixed sidebar |
| Box-shadow blur | `px` | Fixed visual effect |
| Animation timing | `s` or `ms` | `0.2s`, `300ms` |

---

## Shorthand values — the pattern

Many CSS properties accept multiple values in one line. The pattern is always consistent:

```css
/* 1 value → all sides */
margin: 1rem;

/* 2 values → top/bottom  left/right */
margin: 1rem 2rem;

/* 4 values → top  right  bottom  left (clockwise) */
margin: 1rem 2rem 0.5rem 0;
```

This pattern applies to `margin`, `padding`, and `border-radius`.
