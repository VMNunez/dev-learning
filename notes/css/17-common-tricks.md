# Common Tricks

## UI elements

### Inline element with vertical margin

`<a>`, `<span>` are inline — `margin-top` and `margin-bottom` don't work on them.
Fix: add `display: inline-block` to enable vertical spacing.

```css
a {
  display: inline-block;
  margin-bottom: 1rem;
}
```

### Image inside a rounded container

```css
.card {
  border-radius: 8px;
  overflow: hidden; /* clips image corners */
}

img {
  width: 100%;
  display: block; /* removes gap below image */
}
```

### CSS spinner

A circular loading indicator made with pure CSS — no image or library needed.

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);        /* full circle, light color */
  border-top-color: var(--primary);       /* one segment in accent color */
  border-radius: 50%;                     /* makes it a circle */
  animation: spin 0.8s linear infinite;  /* rotates forever */
}
```

How it works: the element is a full circle with a light border. Only the top segment uses the accent color. As it rotates, that colored segment looks like it's spinning.

### Scrollable container

Makes a container scrollable when its content overflows. Requires a fixed height.

```css
.instructions {
  max-height: 300px;
  overflow-y: auto; /* scrollbar appears only when content exceeds max-height */
}
```

- `overflow-y: auto` — scrollbar appears only when needed
- `overflow-y: scroll` — scrollbar always visible even if not needed

### Input focus style

```css
input {
  border: 1px solid var(--border);
  outline: none;
}

input:focus {
  border-color: var(--primary);
}
```

### Button base

```css
button {
  padding: 0.6rem 1.2rem;
  background-color: var(--primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

button:hover { opacity: 0.85; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
```

## Positioning tricks

### Badge on a card

The parent needs `position: relative` so the badge knows where to position itself.

```css
.card { position: relative; }

.badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}
```

### Vertically center an absolute element

```css
.parent { position: relative; }

.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

Why it works:
- `top: 50%` moves the **top edge** of the element to the middle of the parent
- `translateY(-50%)` moves the element **up** by 50% of **its own height**
- Result: the center of the element sits at the center of the parent

For both axes at the same time:
```css
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
```

### Full-screen overlay (modal background)

The dark transparent layer that covers the whole screen when a modal opens.
The modal must be a **child** of `.overlay` — this is what centers it and keeps it visible above the dark background.

```
┌─────────────────────────────────┐
│                                 │  ← .overlay (covers everything)
│   ┌─────────────────────┐       │
│   │  Are you sure?      │       │  ← .modal (child of overlay)
│   │  [Yes]  [No]        │       │
│   └─────────────────────┘       │
└─────────────────────────────────┘
```

```css
.overlay {
  position: fixed;
  inset: 0;                          /* top:0; right:0; bottom:0; left:0 */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Sticky header

The header scrolls with the page normally, but sticks to the top when it reaches it.
Without `background-color`, the content scrolling behind it would show through.

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--surface);
}
```

### z-index scale

```css
z-index: 100;   /* navbar */
z-index: 200;   /* dropdown menus */
z-index: 1000;  /* modals */
z-index: 9999;  /* tooltips, notifications */
```

---

## Text tricks

### Capitalize first letter

`text-transform: capitalize` makes the first letter of each word uppercase without changing the underlying data. Useful for status or priority labels stored as lowercase strings.

```css
.badge {
  text-transform: capitalize; /* 'active' → 'Active' */
}
```

### Truncate text with ellipsis

See typography notes — requires `white-space: nowrap`, `overflow: hidden`, and `text-overflow: ellipsis` together.

---

## Table tricks

### Equal-width columns

By default, table columns resize based on content. `table-layout: fixed` makes all columns equal width and requires `width: 100%` on the table.

```css
table {
  table-layout: fixed;
  width: 100%;
}
```

### Control one column's width — `.mat-column-*`

Angular Material generates a CSS class for each column automatically — `mat-column-name`, `mat-column-status`, etc. Use it to set a specific width without touching the table itself.

```css
.mat-column-actions {
  width: 120px;
  text-align: right;
}
```

### `td.class` vs `.class td`

These two selectors look similar but target different things:

| Selector | What it targets |
|----------|----------------|
| `td.active` | A `<td>` that **has** the class `active` |
| `.active td` | A `<td>` that is **inside** an element with class `active` |

Angular Material table rows get the row class, not the cells — so to style a cell inside an active row, use `.active td`, not `td.active`.
