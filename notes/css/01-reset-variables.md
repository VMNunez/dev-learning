# Reset and Variables

## The box model

Every HTML element is a rectangular box made of four layers, from inside to outside:

```
┌─────────────────────────────┐
│           margin            │  ← space outside the border (transparent)
│  ┌───────────────────────┐  │
│  │        border         │  │  ← the visible border line
│  │  ┌─────────────────┐  │  │
│  │  │     padding     │  │  │  ← space inside the border (same bg color)
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │  ← text, images, child elements
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

- **content** — the actual element (text, image)
- **padding** — space between the content and the border; has the same background color as the element
- **border** — the line around the element
- **margin** — space outside the border; always transparent

### box-sizing

By default (`content-box`), `width` only sets the content area. Padding and border are added on top:

```
width: 200px + padding: 20px + border: 1px = 242px total ← confusing
```

`border-box` makes `width` include padding and border:

```
width: 200px total, padding and border eat into that space ← predictable
```

Always use `border-box`. Set it once in the reset and forget about it.

---

## Reset and global base styles

These go at the top of `styles.css` in every project. Each line has a reason.

```css
/* ── Reset ─────────────────────────────────── */

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

- `*, *::before, *::after` — includes pseudo-elements so they also get `border-box`
- `margin: 0; padding: 0` — removes browser defaults (headings have margin, lists have padding, etc.)
- `box-sizing: border-box` — see section above

```css
/* ── HTML ───────────────────────────────────── */

html {
  scroll-behavior: smooth;
}
```

- `scroll-behavior: smooth` — anchor links and `scrollIntoView()` animate instead of jumping

```css
/* ── Body ───────────────────────────────────── */

body {
  min-height: 100vh;
  line-height: 1.5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background);
  color: var(--text);
}
```

- `min-height: 100vh` — body always covers the full screen even with little content; grows with more content (safer than `height: 100vh` which clips)
- `line-height: 1.5` — comfortable reading spacing for all text
- `font-family` — sets a readable sans-serif stack for the whole page
- `background-color` and `color` — set from CSS variables so one change updates the whole app

```css
/* ── Images ─────────────────────────────────── */

img {
  display: block;
  max-width: 100%;
}
```

- `display: block` — removes the small gap below images (inline elements sit on a text baseline, leaving a gap)
- `max-width: 100%` — images never overflow their container, even if the container is smaller than the image's natural size

```css
/* ── Links ──────────────────────────────────── */

a {
  text-decoration: none;
  color: inherit;
}
```

- `text-decoration: none` — removes the default underline; add it back only where you want it
- `color: inherit` — links inherit the parent's text color instead of the browser's default blue

```css
/* ── Lists ──────────────────────────────────── */

ul, ol {
  list-style: none;
}
```

- `list-style: none` — removes bullets and numbers; most UI lists (nav menus, card grids) are styled differently

```css
/* ── Form elements ──────────────────────────── */

button {
  cursor: pointer;
  font: inherit;
}

input,
textarea,
select {
  font: inherit;
}
```

- `cursor: pointer` on button — browsers show the default arrow cursor on buttons; `pointer` is the hand, which signals "clickable"
- `font: inherit` on button/input/textarea/select — form elements do NOT inherit the page font by default in all browsers; this forces them to use the same font as the rest of the app

---

### Complete template

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  line-height: 1.5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background);
  color: var(--text);
}

img {
  display: block;
  max-width: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

ul, ol {
  list-style: none;
}

button {
  cursor: pointer;
  font: inherit;
}

input,
textarea,
select {
  font: inherit;
}
```

## CSS Variables — always in :root

```css
:root {
  --primary: #e8572a;
  --background: #f9f5f0;
  --surface: #ffffff;
  --text: #1a1a1a;
  --text-muted: #6b6b6b;
  --border: #e8e0d8;
  --shadow: rgba(0, 0, 0, 0.08);
}
```

Standard variable names to reuse across projects:
- `--primary` — accent colour (buttons, links)
- `--background` — page background
- `--surface` — card/panel background (usually white)
- `--text` — main text
- `--text-muted` — secondary text (labels, hints)
- `--border` — input and card borders
- `--shadow` — box shadow colour (always low opacity)