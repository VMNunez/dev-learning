# Layout Patterns

## Container — always the same

```css
.container {
  max-width: 1100px;  /* 900 narrow / 1100 cards / 1200 dashboard */
  margin: 0 auto;
  padding: 2rem 1rem;
}
```

## Responsive card grid — mobile first

Start with the mobile layout, then add columns at each breakpoint:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
```

### Useful grid properties

```css
/* place a child in a specific column */
.item { grid-column: 2; }       /* column 2 */
.item { grid-column: 1 / 3; }   /* from column 1 to 3 */
.item { grid-column: span 2; }  /* spans 2 columns */
.item { grid-column: 1 / -1; }  /* spans ALL columns */

/* same for rows */
.item { grid-row: span 2; }

/* auto-fill — responsive without media queries
   creates as many columns as fit, each at least 250px wide
   wide screen → 4 columns, tablet → 2-3, mobile → 1
   no @media needed

   example with 800px available:
   - 4 columns × 250px = 1000px → does not fit
   - 3 columns fit → each gets 800 ÷ 3 = ~266px (the 1fr stretches them to fill the space)
*/
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* sidebar + content */
grid-template-columns: 250px 1fr;
```

## Card

```css
.card {
  background-color: var(--surface);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow);
  overflow: hidden; /* ⚠️ always add this when the card has an image — without it the image corners break out of the border-radius */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px var(--shadow);
}
```

## Header with centered title and right action

Common pattern: title in the center, a link or button on the right.
Use a 3-column grid — the left `1fr` balances the right element so the title stays visually centered.

```css
.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.header-action {
  justify-self: end; /* pushes the link/button to the right */
}
```

```html
<div class="header">
  <div></div>                                   <!-- empty — balances the right side -->
  <h1>Page Title</h1>                           <!-- auto width, visually centered -->
  <a class="header-action" routerLink="/">Link</a>
</div>
```

## Navbar

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}
```

## Search bar (input + button)

```css
.search {
  display: flex;
  gap: 0.75rem;
  max-width: 600px;
  margin: 0 auto;
}

.search input {
  flex: 1; /* input takes all remaining space */
}
```

## Breakpoints

```css
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```