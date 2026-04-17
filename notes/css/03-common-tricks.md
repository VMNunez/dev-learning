# Common Tricks

## UI elements

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
