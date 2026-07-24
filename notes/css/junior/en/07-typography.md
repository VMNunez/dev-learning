# CSS — Typography

Official docs: https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals

---

## Why typography matters in CSS

Typography is not just picking a font size. It controls readability, visual hierarchy, and how professional the app looks. A page with inconsistent font sizes, bad line spacing, or hard-coded `px` values everywhere is immediately recognisable as a beginner project. You use a consistent scale and relative units so everything feels intentional.

---

## Font sizes — the rem scale

You use `rem` for all font sizes — not `px`. This is important: `px` ignores the user's browser font size preference (which breaks accessibility), while `rem` scales with it. `1rem` = the browser's base font size, which is `16px` by default.

This scale covers everything you need in a typical app:

```css
0.75rem  /* 12px — small labels, helper text */
0.875rem /* 14px — secondary text, table cells */
1rem     /* 16px — body text (the base, do not change this) */
1.25rem  /* 20px — card titles, section subheadings */
1.5rem   /* 24px — h3 */
2rem     /* 32px — h1, page title */
3rem     /* 48px — hero heading */
```

> Tip: stick to this scale. If something looks "almost right" with `1.1rem`, use `1.25rem` — the scale gives visual rhythm.

---

## Font weights

CSS uses numeric values for font weight. The names (`bold`, `normal`) are less precise — use numbers so you control exactly what you get.

```css
font-weight: 400; /* normal — body text */
font-weight: 500; /* medium — slightly emphasised, card subtitles */
font-weight: 600; /* semibold — card titles, form labels */
font-weight: 700; /* bold — headings, important labels */
```

> Not all fonts have all weights. If the font only has 400 and 700, the browser rounds to the nearest available weight.

---

## Line height

Line height controls the vertical space between lines of text. Without it, text feels cramped and hard to read.

```css
body { line-height: 1.5; } /* standard for reading — comfortable for paragraphs */
h1, h2 { line-height: 1.2; } /* tighter for headings — less space looks intentional */
```

`1.5` is a unitless value — it means 1.5 × the font size. This is better than `line-height: 24px` because it scales correctly when font size changes.

---

## Text colours

You always use CSS variables, not hardcoded hex values:

```css
color: var(--text);        /* main content — dark, high contrast */
color: var(--text-muted);  /* labels, hints, metadata — softer */
color: var(--primary);     /* links, highlights, active states */
```

---

## Text truncation — one line

The most common pattern for card titles or table cells where text might be too long. All three properties are required — missing one and it breaks.

```css
.title {
  white-space: nowrap;      /* forces text onto one line */
  overflow: hidden;         /* hides the overflow */
  text-overflow: ellipsis;  /* shows ... where the text was cut */
  /* the container must also have a max-width or fixed width */
}
```

Result: `"Chicken Tikka Masala with..."` instead of text that overflows or wraps.

> Why all three? `text-overflow: ellipsis` only draws the `...` — it does not do the clipping itself. `overflow: hidden` does the actual clipping. `white-space: nowrap` is what prevents the text from wrapping first. Remove any one of them and the effect breaks.

I use this constantly in project 04 (meal names) and project 05 (task names in the table).

---

## Text truncation — two lines

For cards where you want to allow one or two lines but cut after that:

```css
.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

The `-webkit-` prefix looks old but this is now the standard way to do multi-line clamp — it works in all modern browsers.

---

## text-transform

Changes the visual case of text without changing the data:

```css
text-transform: uppercase;   /* ALL CAPS — labels, badges */
text-transform: capitalize;  /* First Letter Capitalised — status values */
text-transform: lowercase;   /* all lowercase */
text-transform: none;        /* reset to the actual value (default) */
```

`capitalize` is useful when you store status values as lowercase strings (`'active'`, `'pending'`) and want them to look like `'Active'`, `'Pending'` in the UI — no data change needed. I use this in project 05 for the task status badges.

---

## letter-spacing

Adds space between individual characters:

```css
letter-spacing: 0.05em; /* slightly open — readable for body text */
letter-spacing: 0.1em;  /* noticeable spacing — good for labels, badges */
letter-spacing: -0.02em; /* tighter — sometimes used for large headings */
```

---

## Quick reference

| Property | Common values | When |
|----------|---------------|------|
| `font-size` | `rem` scale: `0.75` to `3rem` | All font sizes |
| `font-weight` | `400`, `500`, `600`, `700` | Body, card titles, headings |
| `line-height` | `1.5` body, `1.2` headings | All text blocks |
| `color` | CSS variables | All text |
| `white-space` | `nowrap` | Truncation |
| `overflow` | `hidden` | Truncation + card images |
| `text-overflow` | `ellipsis` | Truncation `...` |
| `text-transform` | `capitalize`, `uppercase` | Status labels, badges |
| `letter-spacing` | `0.05em`, `0.1em` | Labels, headings |
