# CSS — Positioning

Official docs: https://developer.mozilla.org/en-US/docs/Web/CSS/position

## The five position values

### static (default)

Every element is `position: static` by default. It follows the normal document flow — no `top`, `left`, `right`, or `bottom` properties work on it. It is also not a positioning context for `absolute` children.

```css
.element { position: static; } /* you almost never write this explicitly */
```

### relative

The element stays in the normal flow — it keeps its space. But you can offset it with `top`, `left`, `right`, `bottom`. More importantly, it becomes a **positioning context** — `absolute` children position themselves relative to it.

```css
.parent {
  position: relative; /* creates the positioning context */
}
```

You rarely offset a `relative` element visually — its main job is to anchor `absolute` children.

### absolute

The element is **removed from the normal flow** — it takes no space. It positions itself relative to the nearest ancestor with `position: relative` (or `fixed`/`absolute`). If none exists, it uses the viewport.

```css
.badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}
```

**The pattern — always together:**

```css
.card { position: relative; }  /* 1. parent creates context */

.badge {
  position: absolute;          /* 2. child positions inside parent */
  top: 0.75rem;
  right: 0.75rem;
}
```

Without `position: relative` on the parent, the badge would position itself relative to the whole page.

### fixed

The element is removed from the flow and positions itself relative to the **viewport**. It stays in place when the user scrolls.

```css
.overlay {
  position: fixed;
  inset: 0;  /* top: 0; right: 0; bottom: 0; left: 0 */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
```

Use for: modal overlays, floating action buttons, cookie banners.

`inset: 0` is shorthand for setting all four sides to 0 — it covers the entire viewport.

### sticky

The element behaves like `relative` until it reaches a scroll position, then it sticks like `fixed`. It stays inside its parent — when the parent scrolls out of view, the sticky element goes with it.

```css
.header {
  position: sticky;
  top: 0;                        /* sticks when it reaches the top */
  z-index: 100;
  background-color: var(--surface); /* always set background — content scrolls behind it */
}
```

Use for: table headers, section headers, navigation bars.

---

## top / right / bottom / left

These properties only work on `relative`, `absolute`, `fixed`, and `sticky` — not on `static`.

```css
top: 1rem;     /* offset from the top edge of the positioning context */
bottom: 0;     /* offset from the bottom edge */
left: 2rem;    /* offset from the left edge */
right: 0;      /* offset from the right edge */
```

For `absolute` and `fixed`, they define the element's position inside the context.
For `relative`, they offset the element from where it would normally sit.
For `sticky`, `top` is the threshold where it starts sticking.

### inset — shorthand

`inset` sets all four sides at once. Same pattern as `margin`/`padding`:

```css
inset: 0;              /* top: 0; right: 0; bottom: 0; left: 0 */
inset: 1rem;           /* all sides: 1rem */
inset: 1rem 2rem;      /* top/bottom: 1rem, left/right: 2rem */
```

---

## z-index — stacking order

Controls which element appears on top when elements overlap. Only works on positioned elements (not `static`).

Higher value = on top.

```css
z-index: 100;   /* navbar */
z-index: 200;   /* dropdown menus */
z-index: 1000;  /* modals */
z-index: 9999;  /* tooltips, notifications */
```

Elements with the same z-index stack in DOM order — the one that appears later in the HTML is on top.

---

## Common patterns

### Badge on a card

```css
.card { position: relative; }

.badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}
```

### Center an element horizontally and vertically (absolute)

```css
.parent { position: relative; }

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

Why `translate`: `top: 50%` moves the **top edge** to the center. `translateY(-50%)` moves the element **up** by half its own height. The result: the center of the element is at the center of the parent.

### Full-screen modal overlay

```css
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Sticky header

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--surface);
}
```

---

## Quick reference

| Value | In flow | Positions relative to | Scrolls with page |
|-------|---------|----------------------|-------------------|
| `static` | ✅ yes | — | ✅ yes |
| `relative` | ✅ yes | itself (normal position) | ✅ yes |
| `absolute` | ❌ no | nearest positioned ancestor | ✅ yes |
| `fixed` | ❌ no | viewport | ❌ no |
| `sticky` | ✅ yes | scroll container (until threshold) | depends |
