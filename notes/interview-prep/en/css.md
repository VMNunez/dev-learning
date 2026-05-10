# CSS — Interview Questions

## Box model

**What is `box-sizing: border-box` and why do you always add it at the top?**
By default, `width` in CSS does not include padding or border — so a `width: 200px` element with `padding: 20px` ends up 240px wide, which is confusing. `border-box` changes the calculation so padding and border are included inside the width. I always add it in the reset at the top of `styles.css` so every element behaves predictably.

**What is a CSS reset and what does it fix?**
Browsers apply their own default styles — margins on headings, padding on lists, different font sizes. A reset removes them so the app looks the same in every browser. I always use `margin: 0; padding: 0; box-sizing: border-box` on `*` at the top of `styles.css`.

---

## CSS variables

**What are CSS custom properties and why do you use them?**
Variables you define once and reuse anywhere — `--primary: #e8572a` in `:root`, then `color: var(--primary)` everywhere. If the design changes, you update one line. I use them in every project for colors, spacing, and shadows so I never have magic numbers scattered across the file.

**What is `:root` and why do you declare variables there?**
`:root` is the highest-level element in the page — equivalent to `html` but with higher specificity. Variables declared there are global and available to every element. If you declare them inside a component or class, they only work inside that scope.

---

## Flexbox

**What is the difference between `justify-content` and `align-items`?**
`justify-content` controls alignment on the main axis — horizontal by default. `align-items` controls the cross axis — vertical by default. The axes flip when you use `flex-direction: column`. I use `justify-content: space-between` in navbars to push items to each side, and `align-items: center` almost everywhere to vertically center content.

**What does `flex: 1` do?**
It tells the element to grow and fill all available space in the flex container. In a search bar with an input and a button side by side, `flex: 1` on the input makes it fill the remaining space after the button takes its natural width.

**When do you choose flexbox instead of grid?**
Flexbox is for one-dimensional layouts — a row of buttons, a navbar, a search bar, a card's internal layout. Grid is for two-dimensional layouts — a grid of cards, a page with sidebar and content, a form with two columns. If everything sits in a single row or column, flexbox is simpler.

---

## CSS Grid

**What does `grid-template-columns: 1fr 1fr` do?**
It creates two columns that each take an equal share of the available space. `1fr` means "one fraction of the free space". I use it for two-column form layouts inside dialogs — two fields side by side.

**What does `grid-column: 1 / -1` do?**
It makes an element span from the first column to the last, regardless of how many columns there are. I use it on the description field in a two-column form so it takes the full width, and on the action buttons row.

**What is `repeat(auto-fill, minmax(250px, 1fr))` and why is it useful?**
It creates as many columns as fit in the container, each at least 250px wide. On a wide screen you get 4 columns; on a tablet 2 or 3; on mobile just 1 — with no media queries needed. It is the simplest way to build a responsive card grid.

**When do you choose grid instead of flexbox?**
When you need control over both rows and columns at the same time. A card grid, a dashboard with panels, or a form where fields align both horizontally and vertically — grid handles all of those cleanly. Flexbox would require nesting and workarounds.

---

## Positioning

**What is the difference between `position: relative` and `position: absolute`?**
`relative` keeps the element in the normal flow but lets you offset it with `top`, `left`, etc. `absolute` removes the element from the flow and positions it relative to its nearest ancestor with `position: relative`. I use this pattern for badges — the card gets `position: relative`, the badge gets `position: absolute; top: 0.75rem; right: 0.75rem`.

**What is `position: fixed` and when do you use it?**
It fixes the element to the viewport — it does not scroll with the page. I use it for modal overlays: `position: fixed; inset: 0` covers the entire screen and stays there while the user scrolls.

**What is `position: sticky` and when is it useful?**
The element scrolls normally until it reaches a set position, then sticks there. I use it for headers — `position: sticky; top: 0` so the header stays visible as the user scrolls down.

**What is `z-index` and when do you need it?**
It controls which element appears on top when elements overlap. Higher value = on top. It only works on elements with a `position` other than `static`. I use a scale: 100 for navbars, 200 for dropdowns, 1000 for modals, 9999 for tooltips.

---

## Responsive design

**What is mobile-first and why is it the recommended approach?**
You write the base styles for mobile first, then add media queries with `@media (min-width)` to adjust the layout for larger screens. It is recommended because it forces you to start with the essential layout and add complexity only when there is space for it — the result is cleaner and loads faster on mobile.

**What is a media query?**
A block of CSS that only applies when a condition is true — usually the screen width. `@media (min-width: 768px)` targets tablets and above. I use two main breakpoints: `768px` for tablet, `1024px` for desktop.

---

## Animations and transitions

**What is the difference between `transition` and `@keyframes animation`?**
`transition` is for simple state changes — hover effects, showing/hiding an element. You define start and end, CSS handles the movement. `@keyframes` is for more complex animations that loop or have multiple steps — like a loading spinner. I use `transition` for card hover effects and `@keyframes` for the CSS spinner.

**Why do you put `transition` on the base element and not on `:hover`?**
If you put it on `:hover`, the animation only plays when entering the hover state — the reverse (leaving) is instant. If you put it on the base element, the transition plays in both directions smoothly.

---

## Typography

**What is the difference between `rem` and `px`?**
`px` is a fixed size. `rem` is relative to the root font size — by default `1rem = 16px`. Using `rem` for font sizes respects the user's browser font size preference, which matters for accessibility. I use `rem` for everything: `1rem` for body text, `1.5rem` for headings, `0.875rem` for small labels.

**How do you cut long text with `...` in CSS?**
Three properties together: `white-space: nowrap` to keep text on one line, `overflow: hidden` to hide what goes outside the container, and `text-overflow: ellipsis` to add the `...`. The container also needs a fixed or maximum width — otherwise there is nothing to overflow.

---

## Units

**What is the difference between `rem` and `em`?**
`rem` is always relative to the root font size (`1rem = 16px` by default) — it is consistent and predictable. `em` is relative to the parent's font size, which compounds through nesting and becomes hard to track. I use `rem` for everything: font sizes, padding, gap. `em` is rarely needed.

**When do you use `vh` and `vw`?**
When you need a size relative to the viewport, not the parent. `100vh` fills the full screen height — I use it on full-page layouts like the login page and the sidenav container. `vw` is less common but useful with `clamp()` for fluid font sizes.

**What is `fr` and where does it only work?**
`fr` means "fraction of the available free space" and only works inside CSS Grid. `1fr 1fr` creates two equal columns; `250px 1fr` creates a fixed sidebar with a fluid content area. Outside of `grid-template-columns` or `grid-template-rows`, `fr` does nothing.

---

## Colors and opacity

**What is the difference between `opacity` and `rgba`?**
`opacity` makes the entire element transparent — the element, its text, its borders, and all its children fade together. `rgba` only makes the background color transparent — the text inside stays fully opaque. I use `rgba` for overlays and shadows, and `opacity` for disabled states where I want everything to fade.

**What is `currentColor`?**
A CSS keyword that refers to the element's own `color` value. Useful when you want a border or icon to automatically match the text color — `border: 1px solid currentColor` updates itself whenever `color` changes.

---

## Selectors

**What is the difference between `.parent .child` and `.parent > .child`?**
`.parent .child` (descendant) matches any `.child` at any depth inside `.parent`. `.parent > .child` (direct child) only matches `.child` elements that are immediately inside `.parent`, not grandchildren. I use the direct child selector when I want to avoid accidentally styling nested components.

**What is the difference between a pseudo-class and a pseudo-element?**
Pseudo-classes (single colon: `:hover`, `:focus`, `:nth-child`) target an element based on its state or position. Pseudo-elements (double colon: `::before`, `::after`, `::placeholder`) target a specific part of an element or insert generated content. The double colon is the modern convention — it distinguishes the two clearly.

---

## Specificity

**How does CSS decide which rule wins when two rules target the same element?**
By specificity score: ID selectors score 100, class/attribute/pseudo-class selectors score 10, and element selectors score 1. The rule with the highest total wins. If scores are equal, the one that appears later in the file wins. In practice: a class beats an element, an ID beats a class.

**Why should you avoid `!important`?**
It overrides all specificity rules, which makes the CSS impossible to reason about — you cannot predict which rule wins by reading the code. Once you use it, the only way to override it is another `!important`. I only use it to fight third-party library styles that I cannot reach any other way.

---

## BEM

**What is BEM and what problem does it solve?**
A naming convention — Block, Element, Modifier. Blocks are standalone components (`.card`), elements are parts of a block (`.card__title`), and modifiers are variations (`.card--featured`). It solves specificity and naming inconsistency — every rule is a single class, so specificity stays at `0-1-0` everywhere and class names are predictable.

**Why is BEM less necessary in Angular?**
Angular's component encapsulation scopes CSS automatically — `.card` in one component cannot affect `.card` in another. BEM was invented to solve the global-scope problem that Angular already handles. I still use BEM conventions in global `styles.css` and shared components where there is no encapsulation.

---

## Borders and shadows

**What is the difference between `border` and `outline`?**
`border` is part of the box model — it takes up space and affects layout. `outline` sits outside the border and takes no space. Browsers add a default `outline` on focused elements for accessibility — if you remove it with `outline: none`, you must add a visible custom focus style, otherwise keyboard users cannot see where they are.

**What does `box-shadow` look like and what are the key values?**
`box-shadow: offset-x offset-y blur spread color`. For example: `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` — no horizontal offset, 4px down, 12px soft blur, semi-transparent black. I always use `rgba` for the color so the shadow is transparent. Adding `inset` makes the shadow appear inside the element.

---

## Backgrounds

**What is the difference between `background-size: cover` and `contain`?**
`cover` fills the container completely — the image may be cropped but there are no empty spaces. `contain` fits the whole image inside the container — no cropping but may leave empty space on the sides. I use `cover` for card images and hero sections where a cropped image is better than empty space.

**What is `object-fit` and when do you use it?**
It controls how an `<img>` fills its container when the image and container have different aspect ratios. `object-fit: cover` fills the container and crops if needed — the same behaviour as `background-size: cover` but for `<img>` elements. I use it on card images with a fixed height: the image always fills the space without stretching.

---

## CSS functions

**What does `calc()` do and why is it useful?**
It calculates a CSS value using math — and crucially, you can mix different units. `width: calc(100% - 250px)` means "full width minus the sidebar". Without `calc()`, you cannot subtract pixels from a percentage in CSS.

**What does `clamp()` do?**
It locks a value between a minimum and maximum, with a fluid preferred value in the middle — `clamp(1rem, 2.5vw, 2rem)`. The value grows with the viewport but never goes below `1rem` or above `2rem`. I use it for fluid typography and spacing without needing media queries.

---

## Display and layout

**What is the difference between `inline`, `block`, and `inline-block`?**
`block` takes the full width of the container and always starts on a new line — `<div>`, `<p>`, `<h1>`. `inline` sits in line with text and only takes as much width as its content — `<span>`, `<a>`. Inline elements ignore `width`, `height`, and vertical `margin`. `inline-block` is a hybrid — it sits in the text flow but respects width, height, and vertical margin. I use it on `<a>` or `<span>` when I need vertical padding on an inline element.

**What is the difference between `display: none` and `visibility: hidden`?**
Both hide the element visually, but `display: none` removes it from layout entirely — the space it occupied collapses and other elements move to fill it. `visibility: hidden` keeps the space reserved — the element is invisible but other elements stay in place. I use `visibility: hidden` when I want to hide an action button on hover without shifting the row height.

**How do you center an element both vertically and horizontally?**
Two common approaches. With flexbox: `display: flex; align-items: center; justify-content: center` on the parent — the simplest option for most layouts. With absolute positioning: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`. The `top: 50%` moves the element's top edge to the middle of the parent, then `translate(-50%, -50%)` moves it back by half its own size so the center aligns with the parent's center.

---

## Pressure

**What CSS mistake have you made and how did you fix it?**
What they really want to know: Can you debug CSS and learn from it, or do you just trial-and-error until something works?
A: In the task manager I added a style targeting a Material component's internal element inside the component CSS and it had no effect. I spent time looking in the wrong place. Then I remembered Angular's view encapsulation — component CSS cannot reach inside Material components because those elements do not get the scoping attribute. I moved the rule to `styles.css` and it worked immediately. Now I always check whether the element is in my own template or rendered internally before deciding where to put the CSS.
Red flag answer: "I always check the browser until it works." — That is not debugging, that is guessing. The interviewer wants to see that you understand why something fails, not just that you found a fix by accident.

---

## Angular-specific

**How does Angular component style encapsulation work?**
By default, Angular adds a unique attribute to every element in a component and scopes the component CSS to only match those attributes. Styles in `task-list.component.css` only apply inside that component — they cannot leak into other components. This prevents style conflicts in large apps.

**When do you use `styles.css` instead of the component CSS?**
For styles that must apply globally — the reset, CSS variables in `:root`, font imports, Material theme overrides. Also for Angular Material directive internals — Angular's encapsulation stops component CSS from reaching inside Material components, so those overrides must go in `styles.css`.
