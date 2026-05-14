# CSS — Colors and Opacity

Official docs: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

---

## Color formats

### Hex

The most common format. `#RRGGBB` — two digits per channel (red, green, blue) in hexadecimal (00–FF).

```css
color: #1a1a1a;   /* dark text */
color: #ffffff;   /* white */
color: #e8572a;   /* orange */
```

Shorthand — `#RGB` when both digits are the same:

```css
color: #fff;   /* same as #ffffff */
color: #000;   /* same as #000000 */
```

Add two more digits for alpha (transparency): `#RRGGBBAA`

```css
color: #e8572a80;  /* orange at ~50% opacity */
```

### rgb() and rgba()

More readable when you need transparency. Values: red (0–255), green (0–255), blue (0–255), alpha (0–1).

```css
color: rgb(26, 26, 26);           /* dark text */
background-color: rgba(0, 0, 0, 0.5);  /* black at 50% opacity */
background-color: rgba(0, 0, 0, 0.08); /* very light shadow */
```

Modern syntax — you can also write it without commas:

```css
background-color: rgb(0 0 0 / 0.5);   /* same as rgba(0,0,0,0.5) */
```

### hsl() and hsla()

Hue (0–360°), Saturation (0%–100%), Lightness (0%–100%). Easier to reason about — to make a color lighter, increase L. To make it less saturated, decrease S.

```css
color: hsl(16, 78%, 55%);              /* orange */
color: hsla(16, 78%, 55%, 0.8);        /* orange at 80% opacity */

/* Easy to create variations */
background: hsl(220, 70%, 50%);        /* base blue */
background: hsl(220, 70%, 40%);        /* darker blue — just change L */
background: hsl(220, 70%, 60%);        /* lighter blue */
```

---

## opacity vs rgba

Both make an element transparent, but they work differently:

```css
/* opacity — affects the element AND all its children */
.card {
  opacity: 0.5;  /* text, images, borders — everything fades */
}

/* rgba — affects only the background color */
.card {
  background-color: rgba(0, 0, 0, 0.5);  /* only the background is transparent */
  color: #fff;                            /* text stays fully opaque */
}
```

**Rule:** Use `rgba` when you only want the background to be transparent. Use `opacity` when you want the whole element (including content) to fade — for example, a disabled button.

```css
button:disabled {
  opacity: 0.5;  /* fades button text, background, and border together */
  cursor: not-allowed;
}
```

---

## currentColor

A keyword that refers to the element's current `color` value. Useful to keep borders, icons, and decorations in sync with the text color.

```css
.icon {
  color: var(--primary);
  border: 1px solid currentColor;  /* border uses the same color as the text */
}
```

---

## CSS variables for colors

Always define colors as variables in `:root` — change one value to update the whole app. See `01-reset-variables.md` for the full pattern.

```css
:root {
  --primary: #e8572a;
  --text: #1a1a1a;
  --text-muted: #6b6b6b;
  --surface: #ffffff;
  --background: #f9f5f0;
  --border: #e8e0d8;
  --shadow: rgba(0, 0, 0, 0.08);
}
```

---

## Common color values reference

```css
/* Transparent */
background-color: transparent;
background-color: rgba(0, 0, 0, 0);

/* Overlays */
background-color: rgba(0, 0, 0, 0.3);  /* light overlay */
background-color: rgba(0, 0, 0, 0.5);  /* medium overlay */
background-color: rgba(0, 0, 0, 0.8);  /* heavy overlay */

/* White with opacity */
background-color: rgba(255, 255, 255, 0.1);  /* frosted glass effect */
```
