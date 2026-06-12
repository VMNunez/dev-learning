# Minimum Coverage — CSS

CSS as used in Angular projects. Focus on concepts that appear in real UI work and interviews.

## Box model
- `margin`, `padding`, `border`, `content` — what each layer is and how they stack; interviewers draw the box model and ask you to label it
- `box-sizing: border-box` — makes `width` include padding and border; set globally so layouts are predictable; the default `content-box` causes sizing surprises
- Collapsing margins — two adjacent vertical margins collapse into one; the most common box model surprise

## Display and layout
- `display: block`, `inline`, `inline-block` — block takes full width and starts on a new line; inline flows with text; inline-block is both; interviewers ask why a `<span>` cannot have width
- `display: none` vs `visibility: hidden` — `none` removes the element from the layout completely; `hidden` hides it but keeps its space

## Flexbox
- Container properties: `flex-direction`, `justify-content`, `align-items`, `gap` — the four you set on almost every flex container
- Item properties: `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self` — controlling how items grow, shrink, and align individually
- The main axis and cross axis — `justify-content` works on the main axis, `align-items` on the cross axis; the axis flips with `flex-direction: column`; this mental model explains everything

## CSS Grid
- `grid-template-columns`, `gap` — the two properties you set most often on a grid container
- `fr` unit — fractional space; `1fr 1fr` makes two equal columns; cleaner than percentages
- `grid-column` and `grid-row` — placing an item across multiple columns or rows manually; `grid-column: 1 / -1` spans the full width

## Position
- `static`, `relative`, `absolute`, `fixed`, `sticky` — `static` is the default; `relative` is the anchor for `absolute` children; `fixed` is relative to the viewport; `sticky` is a mix
- How `absolute` is relative to the nearest `position: relative` parent — if no parent has `position`, the element is positioned relative to the page; a very common layout bug
- `z-index` and stacking context — why `z-index` sometimes has no effect: the element must have a `position` other than `static`; certain CSS properties create a new stacking context

## Units
- `px` — absolute and predictable; the most common unit for spacing, borders, and font size
- `%` — relative to the parent's size on the same axis
- `em` — relative to the element's own font size; useful for spacing that should scale with text
- `rem` — relative to the root font size; safer than `em` because it does not compound through nesting
- `vw`, `vh` — relative to the viewport width and height; used for full-screen layouts
- `calc()` — mixing units: `calc(100% - 64px)`; used constantly when a toolbar or sidebar takes fixed space

## Responsive design
- Media queries: `@media (max-width: ...)` — applying styles only below a breakpoint; mobile-first means writing base styles for mobile and adding complexity for wider screens
- Breakpoints: `768px` (tablet), `1024px` (desktop) — the most common values in real Angular projects

## CSS variables
- `--variable-name` and `var()` — defining a value once and reusing it everywhere; Angular Material uses CSS variables for its theme colours
- Why they are useful for theming — change one variable and the whole component updates; not possible with hardcoded values

## Selectors and specificity
- Combinators: descendant ` `, child `>`, sibling `~`, adjacent `+` — how to target elements based on their relationship to others
- Pseudo-classes: `:hover`, `:focus`, `:nth-child`, `:first-child`, `:last-child`, `:not()` — `:not()` is used to exclude elements from a rule
- Pseudo-elements: `::before`, `::after` — CSS-generated content; used for decorative elements and Angular Material state layers
- Specificity rules — inline styles beat IDs beat classes beat elements; why your style is being overridden and how to fix it without `!important`

## Transitions and animations
- `transition` — smooth change for a specific property when state changes; always put it on the base state, not the `:hover` state, so it also runs on mouse-out
- `@keyframes` and `animation` — for complex multi-step animations; used for loading spinners and entrance effects

## Overflow
- `overflow: visible`, `hidden`, `scroll`, `auto` — `hidden` clips content and is the key to the Angular app shell scroll pattern; `auto` shows scrollbars only when needed
