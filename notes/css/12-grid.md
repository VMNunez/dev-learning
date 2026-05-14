# CSS — Grid

Official docs: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

## What is CSS Grid?

Grid is a two-dimensional layout system — it controls both rows and columns at the same time. The parent becomes the **grid container**, the children become **grid items**.

```css
.container {
  display: grid;
}
```

---

## Container properties

### grid-template-columns

Defines the number and size of columns.

```css
grid-template-columns: 200px 200px 200px;    /* 3 fixed columns */
grid-template-columns: 1fr 1fr 1fr;          /* 3 equal columns */
grid-template-columns: 1fr 2fr 1fr;          /* middle is twice as wide */
grid-template-columns: 250px 1fr;            /* fixed sidebar + fluid content */
grid-template-columns: repeat(3, 1fr);       /* shorthand for 1fr 1fr 1fr */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* responsive, no @media needed */
```

### grid-template-rows

Defines the height of rows. Usually left unset — rows grow with content.

```css
grid-template-rows: 60px 1fr 40px;  /* header + content + footer */
grid-template-rows: auto;           /* rows grow with their content (default) */
```

### gap

Space between grid cells. Does not add space outside the container.

```css
gap: 1.5rem;         /* same gap in all directions */
gap: 1rem 2rem;      /* row-gap  column-gap */
row-gap: 1rem;
column-gap: 2rem;
```

### align-items / justify-items

Controls how items align **inside their cell**.

```css
justify-items: stretch;   /* fills cell width (default) */
justify-items: start;
justify-items: end;
justify-items: center;

align-items: stretch;     /* fills cell height (default) */
align-items: start;
align-items: end;
align-items: center;
```

### align-content / justify-content

Controls how the **whole grid** aligns inside the container (only matters when the grid is smaller than the container).

```css
justify-content: start;
justify-content: center;
justify-content: space-between;
```

---

## Item properties

### grid-column

Controls which columns an item occupies. Uses **grid lines** (not column numbers — there is always one more line than columns).

```css
grid-column: 1;         /* occupies column 1 */
grid-column: 1 / 3;     /* from line 1 to line 3 = columns 1 and 2 */
grid-column: 1 / -1;    /* from line 1 to the last line = all columns */
grid-column: span 2;    /* spans 2 columns from wherever it starts */
```

```
Lines:    1    2    3    4
          |    |    |    |
Column:   [ col 1 ][ col 2 ][ col 3 ]

grid-column: 1 / 3  → covers columns 1 and 2
grid-column: 1 / -1 → covers all columns
```

### grid-row

Same as `grid-column` but for rows.

```css
grid-row: 1 / 3;   /* spans 2 rows */
grid-row: span 2;  /* spans 2 rows from current position */
```

### align-self / justify-self

Overrides `align-items` / `justify-items` for one specific item.

```css
.item {
  justify-self: end;   /* pushes this item to the right of its cell */
  align-self: center;  /* centers this item vertically in its cell */
}
```

---

## auto-fill vs auto-fit

Both create as many columns as fit. The difference shows when there are fewer items than columns:

```css
/* auto-fill — keeps empty columns, items keep their min size */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* auto-fit — collapses empty columns, items stretch to fill */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

In practice, `auto-fill` is safer for card grids — items stay at a predictable size.

---

## Common patterns

### Responsive card grid (no @media needed)

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

### Sidebar + content

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  min-height: 100vh;
}
```

### Two-column form

```css
.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form .full-width {
  grid-column: 1 / -1; /* spans both columns */
}
```

### Page layout — header, content, footer

```css
.page {
  display: grid;
  grid-template-rows: 60px 1fr auto;
  min-height: 100vh;
}
```

### Centered title with right action

```css
.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.header-action {
  justify-self: end;
}
```

---

## Grid vs Flexbox

| Grid | Flexbox |
|------|---------|
| Two axes at once (rows AND columns) | One axis at a time (row OR column) |
| Layout-driven — you define the structure first | Content-driven — items define the layout |
| Page layouts, dashboards, form grids | Navbars, button rows, card internals |
| Full control over placement | Items wrap and flow naturally |
