# CSS — Specificity and the Cascade

Official docs: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

## What is specificity?

When two CSS rules target the same element, the browser uses **specificity** to decide which one wins. The more specific selector wins — not the one that appears last (though order matters when specificity is equal).

---

## The specificity scale

Specificity is calculated in three categories:

| Category | What counts | Points |
|----------|-------------|--------|
| **ID** | `#id` | 100 |
| **Class / attribute / pseudo-class** | `.class`, `[attr]`, `:hover`, `:focus` | 10 |
| **Element / pseudo-element** | `div`, `p`, `::before` | 1 |

Higher total wins. Think of it as a score: `(IDs, classes, elements)`.

### Examples

| Selector | Score |
|----------|-------|
| `p` | 0-0-1 |
| `.card` | 0-1-0 |
| `p.card` | 0-1-1 |
| `#header` | 1-0-0 |
| `#header .title` | 1-1-0 |

```css
p { color: blue; }          /* 0-0-1 */
.text { color: red; }       /* 0-1-0 → wins — red */
```

```css
.card p { color: blue; }    /* 0-1-1 */
.card .text { color: red; } /* 0-2-0 → wins — red */
```

---

## The cascade — when specificity is equal

If two rules have the same specificity, the one that appears **later in the file** wins.

```css
.card { color: blue; }
.card { color: red; }  /* same specificity, last one wins → red */
```

---

## `!important` — override everything

`!important` overrides all specificity rules. The property always wins, regardless of selector.

```css
p { color: blue !important; }  /* wins even against #id selectors */
```

Avoid it. It makes debugging very hard because you can no longer predict which rule wins. The only acceptable use is overriding third-party library styles (like Angular Material) when you cannot change the selector.

---

## Inline styles

Inline styles (`style="color: red"` on an HTML element) beat all class and ID selectors. Only `!important` can override them.

| Priority (highest first) |
|--------------------------|
| `!important` |
| Inline styles |
| ID selectors |
| Class / attribute / pseudo-class |
| Element selectors |

---

## Practical rules

- **Keep specificity low** — prefer classes over IDs in CSS; IDs are hard to override
- **Never use `!important`** except to fight third-party styles
- **Order matters when in doubt** — put more specific rules later in the file
- If a style is not applying, open DevTools → inspect the element → check which rule is winning and why
