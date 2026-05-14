# CSS — Transitions and Animations

Official docs:
- Transitions: https://developer.mozilla.org/en-US/docs/Web/CSS/transition
- Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/animation
- Transform: https://developer.mozilla.org/en-US/docs/Web/CSS/transform

---

## transition — animate a state change

`transition` plays an animation when a CSS property changes value — for example on `:hover`.

### Syntax

```css
transition: property duration timing-function delay;
```

| Part | Example | What it does |
|------|---------|--------------|
| `property` | `transform`, `opacity`, `all` | Which property to animate |
| `duration` | `0.2s`, `300ms` | How long the animation takes |
| `timing-function` | `ease`, `linear` | Speed curve |
| `delay` | `0s`, `0.1s` | Wait before starting (optional) |

```css
/* Animate only transform, over 0.2s, with ease timing */
transition: transform 0.2s ease;

/* Animate multiple properties */
transition: transform 0.2s ease, box-shadow 0.2s ease;

/* Animate everything — convenient but less performant */
transition: all 0.2s ease;
```

### Timing functions

| Value | Effect |
|-------|--------|
| `ease` | Starts fast, slows down (default) |
| `linear` | Constant speed — good for spinners |
| `ease-in` | Starts slow, ends fast |
| `ease-out` | Starts fast, ends slow — good for dropdowns appearing |
| `ease-in-out` | Slow start and end — good for modals |

### Put transition on the base element, NOT on :hover

```css
/* ✅ Correct — animates in both directions */
.card {
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}

/* ❌ Wrong — only animates when entering hover, instant when leaving */
.card:hover {
  transition: transform 0.2s ease;
  transform: translateY(-4px);
}
```

### What to animate (and what not to)

Animating `transform` and `opacity` is fast — the browser handles them on the GPU without recalculating layout.

Animating `width`, `height`, `margin`, `padding`, `top`, `left` forces the browser to recalculate the layout on every frame — slow.

```css
/* ✅ Fast */
transition: transform 0.2s ease, opacity 0.2s ease;

/* ⚠️ Slow on large pages */
transition: width 0.2s ease;
```

---

## transform — move, scale, rotate

`transform` changes an element's visual appearance without affecting the layout (other elements do not shift).

### Common functions

```css
/* Move */
transform: translateX(20px);   /* move right */
transform: translateY(-10px);  /* move up */
transform: translate(20px, -10px); /* move right and up */

/* Scale */
transform: scale(1.05);        /* 5% bigger */
transform: scale(0.95);        /* 5% smaller */

/* Rotate */
transform: rotate(45deg);      /* rotate clockwise */
transform: rotate(-45deg);     /* rotate counter-clockwise */
transform: rotate(360deg);     /* full rotation (used in spinners) */
```

### Combine transforms

```css
transform: translateY(-4px) scale(1.02);
```

### Typical hover effects

```css
/* Card lift */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px var(--shadow);
}

/* Button scale */
button:hover {
  transform: scale(1.03);
}

/* Icon rotate */
.arrow.open {
  transform: rotate(180deg);
}
```

---

## @keyframes — multi-step animations

`@keyframes` defines an animation with multiple steps. Use it when `transition` is not enough — looping animations, loading spinners, entrance effects.

### Syntax

```css
@keyframes animation-name {
  from { /* start state */ }
  to   { /* end state */   }
}

/* Or with percentages for multiple steps */
@keyframes animation-name {
  0%   { /* start */ }
  50%  { /* middle */ }
  100% { /* end */ }
}
```

### Apply with animation

```css
animation: name duration timing-function delay iteration-count direction fill-mode;
```

Most common usage:

```css
.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```

### animation properties

| Property | Common values | What it does |
|----------|---------------|--------------|
| `animation-duration` | `0.8s`, `300ms` | How long one cycle takes |
| `animation-timing-function` | `linear`, `ease` | Speed curve |
| `animation-iteration-count` | `infinite`, `1`, `3` | How many times to play |
| `animation-direction` | `normal`, `reverse`, `alternate` | Direction each cycle |
| `animation-fill-mode` | `forwards`, `backwards`, `both` | State when animation ends |

`animation-fill-mode: forwards` — keeps the final state after the animation ends instead of snapping back to the original.

### Entrance animation example

```css
.modal {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## transition vs @keyframes — when to use each

| Situation | Use |
|-----------|-----|
| Hover effects, state changes | `transition` |
| Loading spinner (loops forever) | `@keyframes` |
| Entrance / exit animation | `@keyframes` |
| Simple show/hide | `transition` on `opacity` |
| Complex multi-step animation | `@keyframes` |
