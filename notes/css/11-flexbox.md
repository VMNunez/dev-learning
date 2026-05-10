# CSS — Flexbox

Official docs: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout

## What is flexbox?

Flexbox is a one-dimensional layout system — it arranges items in a row **or** a column. The parent becomes the **flex container**, the children become **flex items**.

```css
.container {
  display: flex; /* activates flexbox */
}
```

---

## The two axes

Flexbox has two axes that flip depending on `flex-direction`:

| `flex-direction` | Main axis | Cross axis |
|------------------|-----------|------------|
| `row` (default) | horizontal → | vertical ↓ |
| `column` | vertical ↓ | horizontal → |

`justify-content` always controls the **main axis**.
`align-items` always controls the **cross axis**.

---

## Container properties

### flex-direction

Sets the direction of the main axis.

```css
flex-direction: row;          /* left to right (default) */
flex-direction: column;       /* top to bottom */
flex-direction: row-reverse;  /* right to left */
flex-direction: column-reverse; /* bottom to top */
```

### flex-wrap

Controls what happens when items overflow the container.

```css
flex-wrap: nowrap;  /* all items stay on one line, shrink if needed (default) */
flex-wrap: wrap;    /* items wrap to the next line when there is no space */
```

### justify-content — main axis alignment

```css
justify-content: flex-start;    /* items at the start (default) */
justify-content: flex-end;      /* items at the end */
justify-content: center;        /* items centered */
justify-content: space-between; /* first item at start, last at end, space between */
justify-content: space-around;  /* equal space around each item */
justify-content: space-evenly;  /* equal space between and around all items */
```

`space-between` is the most common — navbars, headers, action rows.

### align-items — cross axis alignment

```css
align-items: stretch;     /* items fill the cross axis height (default) */
align-items: flex-start;  /* items at the top (for row direction) */
align-items: flex-end;    /* items at the bottom */
align-items: center;      /* items centered vertically */
align-items: baseline;    /* items aligned by their text baseline */
```

`align-items: center` is used constantly — vertically center everything in a row.

### gap

Space between flex items. Does not add space outside the container.

```css
gap: 1rem;              /* same gap in all directions */
gap: 1rem 2rem;         /* row-gap column-gap */
row-gap: 1rem;
column-gap: 2rem;
```

---

## Item properties

### flex — the shorthand

`flex` controls how an item grows and shrinks. It is a shorthand for `flex-grow`, `flex-shrink`, and `flex-basis`.

```css
flex: 1;        /* grow to fill space, shrink if needed, start from 0 */
flex: 0;        /* do not grow, do not shrink */
flex: 0 0 auto; /* fixed size, do not grow or shrink */
```

`flex: 1` is the most common value — makes an item fill all available space. If two items both have `flex: 1`, they share the space equally.

### flex-grow

How much an item grows relative to others when there is extra space.

```css
flex-grow: 0;  /* does not grow (default) */
flex-grow: 1;  /* grows to fill available space */
flex-grow: 2;  /* grows twice as much as flex-grow: 1 items */
```

### flex-shrink

How much an item shrinks when there is not enough space.

```css
flex-shrink: 1;  /* shrinks proportionally (default) */
flex-shrink: 0;  /* does not shrink — keeps its size */
```

Use `flex-shrink: 0` on an icon or button next to an `flex: 1` input — the icon keeps its size while the input fills the rest.

### flex-basis

The initial size of the item before growing or shrinking.

```css
flex-basis: auto;   /* use the element's natural width/height (default) */
flex-basis: 200px;  /* start at 200px, then grow or shrink from there */
flex-basis: 0;      /* start from zero — all space is distributed by flex-grow */
```

### align-self

Overrides `align-items` for one specific item.

```css
.item {
  align-self: flex-end; /* this item aligns to the bottom while others are centered */
}
```

### order

Changes the visual order of items without changing the HTML.

```css
.item { order: 1; }   /* default is 0 — higher order = later in visual order */
```

### margin: auto trick

`margin: auto` on a flex item absorbs all available space on that side. Useful for pushing one item to the end.

```css
.navbar-logo { /* stays on the left */ }
.navbar-actions {
  margin-left: auto; /* pushes everything to the right */
}
```

---

## Common patterns

### Navbar

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
}
```

### Centered content (horizontal + vertical)

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

### Input + button side by side

```css
.search {
  display: flex;
  gap: 0.5rem;
}
.search input {
  flex: 1;           /* input fills remaining space */
}
.search button {
  flex-shrink: 0;    /* button keeps its size */
}
```

### Vertical stack with gap

```css
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

---

## Flexbox vs Grid

| Flexbox | Grid |
|---------|------|
| One axis at a time (row OR column) | Two axes at once (rows AND columns) |
| Content-driven — items define the layout | Layout-driven — you define the structure |
| Navbars, button rows, cards internally | Page layouts, dashboards, form grids |
| Items wrap naturally with `flex-wrap` | Full control over placement |
