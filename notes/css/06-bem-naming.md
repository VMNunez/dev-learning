# CSS — BEM Naming Convention

Official docs: https://getbem.com/naming/

---

## What is BEM?

BEM stands for **Block**, **Element**, **Modifier**. It is a naming convention for CSS classes that makes your code predictable, readable, and easy to maintain — especially in large projects.

The problem it solves: without a convention, CSS class names become inconsistent (`.card-title`, `.cardTitle`, `.title-card`, `.card__title` — which is correct?) and specificity grows out of control as you nest selectors.

---

## The three parts

### Block

A standalone component — meaningful on its own.

```html
<div class="card">...</div>
<nav class="navbar">...</nav>
<form class="search-form">...</form>
```

```css
.card { }
.navbar { }
.search-form { }
```

Block names: lowercase, words separated by a single hyphen.

### Element

A part of a block — has no meaning outside it. Uses **double underscore** `__`.

```
block__element
```

```html
<div class="card">
  <img class="card__image" />
  <div class="card__body">
    <h2 class="card__title">Title</h2>
    <p class="card__description">Text</p>
  </div>
  <div class="card__actions">
    <button class="card__button">Read more</button>
  </div>
</div>
```

```css
.card__image { }
.card__title { }
.card__actions { }
```

Elements are always flat — `card__body__title` does not exist. Even if `title` is inside `body`, the class is still `card__title` (child of the block, not of the element).

### Modifier

A variation of a block or element — changes appearance or state. Uses **double hyphen** `--`.

```
block--modifier
block__element--modifier
```

```html
<!-- block modifier — different card style -->
<div class="card card--featured">...</div>
<div class="card card--disabled">...</div>

<!-- element modifier — different button state -->
<button class="card__button card__button--primary">Read more</button>
<button class="card__button card__button--secondary">Cancel</button>
```

```css
.card--featured {
  border: 2px solid var(--primary);
}

.card__button--primary {
  background-color: var(--primary);
  color: #fff;
}
```

---

## Why BEM keeps specificity low

Without BEM, you nest selectors and specificity grows:

```css
/* ❌ high specificity — hard to override */
.card .body .title { font-size: 1.2rem; }  /* 0-3-0 */
```

With BEM, every rule is a single class:

```css
/* ✅ low specificity — easy to override */
.card__title { font-size: 1.2rem; }  /* 0-1-0 */
```

Single-class selectors are the easiest to override and the easiest to read.

---

## BEM in practice

```html
<form class="search-form search-form--expanded">
  <input class="search-form__input" type="text" />
  <button class="search-form__button search-form__button--primary">
    Search
  </button>
  <button class="search-form__button search-form__button--clear">
    Clear
  </button>
</form>
```

```css
.search-form { }
.search-form--expanded { }
.search-form__input { }
.search-form__button { }
.search-form__button--primary { }
.search-form__button--clear { }
```

---

## BEM and Angular

In Angular, component style encapsulation already solves the main problem BEM was invented to fix. Angular scopes component CSS automatically — `.card` in `card.component.css` cannot conflict with `.card` in another component.

**When BEM is still useful in Angular:**
- Global styles in `styles.css` — no encapsulation, so BEM prevents conflicts
- Shared components in `shared/` that are used across many contexts
- When working on a team where multiple developers touch the same global CSS

**When BEM is not needed in Angular:**
- Component CSS files — Angular's encapsulation handles isolation

---

## Quick reference

| Part | Separator | Example |
|------|-----------|---------|
| Block | — | `.card` |
| Element | `__` (double underscore) | `.card__title` |
| Modifier | `--` (double hyphen) | `.card--featured` |
| Element + modifier | both | `.card__button--primary` |
