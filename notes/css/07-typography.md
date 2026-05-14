# Typography

## Font sizes — rem scale

```css
0.75rem  /* 12px — small labels */
0.875rem /* 14px — secondary text */
1rem     /* 16px — body text (default) */
1.25rem  /* 20px — small heading */
1.5rem   /* 24px — h3 */
2rem     /* 32px — h1, page title */
```

## Font weights

```css
font-weight: 400; /* normal */
font-weight: 500; /* medium */
font-weight: 600; /* semibold — card titles */
font-weight: 700; /* bold — headings */
```

## Line height

```css
body { line-height: 1.5; } /* standard for reading */
```

## Text colours

```css
color: var(--text);        /* main content */
color: var(--text-muted);  /* labels, hints */
color: var(--primary);     /* links, highlights */
```

## Truncate — one line

Cuts long text with `...` instead of wrapping to a second line. Only works when the container has a fixed or limited width.

```css
.title {
  white-space: nowrap;      /* forces text to stay on one line */
  overflow: hidden;         /* hides the part that goes outside */
  text-overflow: ellipsis;  /* shows ... where the text was cut */
}
```

Result: `"Chicken Tikka Masala with Basmati Rice and..."`

## Truncate — two lines

```css
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
```