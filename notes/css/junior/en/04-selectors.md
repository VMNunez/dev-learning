# CSS — Selectors

Official docs: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors

---

## Basic selectors

```css
*        { }  /* universal — every element */
p        { }  /* type — all <p> elements */
.card    { }  /* class — all elements with class="card" */
#header  { }  /* ID — the element with id="header" */
```

---

## Combinators — how elements relate

### Descendant (space)

Targets an element **anywhere inside** another, no matter how deep.

```css
.card p { color: red; }
/* matches <p> at any depth inside .card */
```

### Direct child (`>`)

Targets only **immediate children** — not grandchildren.

```css
.card > p { color: red; }
/* matches <p> directly inside .card, not nested further */
```

### Adjacent sibling (`+`)

Targets the element **immediately after** a specific element.

```css
h2 + p { margin-top: 0; }
/* matches only the first <p> right after an <h2> */
```

### General sibling (`~`)

Targets all elements that come **after** a specific element, at the same level.

```css
h2 ~ p { color: gray; }
/* matches all <p> elements after an <h2>, at the same level */
```

### The `td.class` vs `.class td` pattern

```css
td.active { }   /* a <td> that HAS the class "active" */
.active td { }  /* a <td> INSIDE an element with class "active" */
```

---

## Pseudo-classes — element state

Pseudo-classes target elements based on their **state** or **position**.

### User interaction

```css
a:hover  { }  /* mouse is over the element */
a:focus  { }  /* element is focused (keyboard or click) */
a:active { }  /* element is being clicked */
```

### Form state

```css
input:disabled  { opacity: 0.5; }  /* input is disabled */
input:checked   { }                /* checkbox or radio is checked */
input:valid     { }                /* passes HTML5 validation */
input:invalid   { }                /* fails HTML5 validation */
```

### Position in parent

```css
li:first-child  { }   /* first child of its parent */
li:last-child   { }   /* last child of its parent */
li:nth-child(2) { }   /* second child */
li:nth-child(odd)  { }  /* 1st, 3rd, 5th... */
li:nth-child(even) { }  /* 2nd, 4th, 6th... */
```

### Negation

```css
p:not(.special) { color: gray; }
/* all <p> elements that do NOT have class "special" */
```

---

## Pseudo-elements — parts of an element

Pseudo-elements target a **part** of an element, not the whole thing. They use `::` (double colon).

### `::before` and `::after`

Inserts content before or after an element's actual content. Must have `content` property (can be empty string).

```css
.required::after {
  content: ' *';
  color: red;
}
```

```css
/* decorative line before a heading */
h2::before {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background-color: var(--primary);
  margin-bottom: 0.5rem;
}
```

### `::placeholder`

Styles the placeholder text inside an input.

```css
input::placeholder {
  color: var(--text-muted);
  font-style: italic;
}
```

### `::selection`

Styles the text the user has highlighted.

```css
::selection {
  background-color: var(--primary);
  color: white;
}
```

---

## Attribute selectors

Target elements based on their HTML attributes.

```css
input[type="text"]     { }  /* inputs of type text */
input[type="password"] { }  /* inputs of type password */
a[href]                { }  /* links that have an href */
a[target="_blank"]     { }  /* links that open in a new tab */
```

---

## Quick reference

| Selector | Example | What it matches |
|----------|---------|-----------------|
| Type | `p` | All `<p>` elements |
| Class | `.card` | Elements with `class="card"` |
| ID | `#header` | Element with `id="header"` |
| Descendant | `.card p` | `<p>` anywhere inside `.card` |
| Child | `.card > p` | `<p>` directly inside `.card` |
| Adjacent sibling | `h2 + p` | `<p>` immediately after `<h2>` |
| General sibling | `h2 ~ p` | All `<p>` after `<h2>` at same level |
| Pseudo-class | `a:hover` | `<a>` when hovered |
| Pseudo-element | `p::before` | Content inserted before `<p>` |
| Attribute | `input[type="text"]` | `<input>` with `type="text"` |
