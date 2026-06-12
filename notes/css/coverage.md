# Minimum Coverage — CSS

CSS as used in Angular projects with Tailwind. Focus on concepts that appear in real UI work.

## Box model
- [ ] `margin`, `padding`, `border`, `content` — what each layer is
- [ ] `box-sizing: border-box` — why it is always set globally
- [ ] Collapsing margins — the most common box model surprise

## Display and layout
- [ ] `display: block`, `inline`, `inline-block` — the difference and when each is used
- [ ] `display: none` vs `visibility: hidden` — what each hides

## Flexbox
- [ ] Container properties: `display: flex`, `flex-direction`, `justify-content`, `align-items`, `gap`
- [ ] Item properties: `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`
- [ ] The main axis and cross axis — the mental model that explains everything

## CSS Grid
- [ ] `grid-template-columns`, `grid-template-rows`, `gap`
- [ ] `fr` unit — fractional space
- [ ] `grid-column` and `grid-row` — placing items manually

## Position
- [ ] `static`, `relative`, `absolute`, `fixed`, `sticky` — what each means in context
- [ ] How `absolute` is relative to the nearest `position: relative` parent
- [ ] `z-index` and stacking context — why z-index sometimes has no effect

## Units
- [ ] `px` — absolute, predictable
- [ ] `%` — relative to the parent
- [ ] `em` — relative to the element's own font size
- [ ] `rem` — relative to the root font size, the safer choice
- [ ] `vw`, `vh` — relative to the viewport
- [ ] `calc()` — mixing units: `calc(100% - 64px)` — used constantly in real layouts

## Responsive design
- [ ] Media queries: `@media (max-width: ...)` — mobile-first vs desktop-first
- [ ] Breakpoints: when to use them and the common values

## CSS variables
- [ ] `--variable-name` and `var()` — defining and using custom properties
- [ ] Why they are useful for theming (Angular Material uses them)

## Selectors and specificity
- [ ] Combinators: descendant ` `, child `>`, sibling `~`, adjacent `+`
- [ ] Pseudo-classes: `:hover`, `:focus`, `:nth-child`, `:first-child`, `:last-child`
- [ ] `:not()` — excluding elements from a rule: `li:not(:last-child) { border-bottom: 1px solid; }`
- [ ] Pseudo-elements: `::before`, `::after` — what they create and why
- [ ] Specificity rules — why a style is not being applied

## Transitions and animations
- [ ] `transition` — which property, duration, timing function
- [ ] `@keyframes` and `animation` — when to use over transition

## Overflow
- [ ] `overflow: visible`, `hidden`, `scroll`, `auto` — when each is needed
