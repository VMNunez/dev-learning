# Minimum Coverage — CSS

Topics a junior must explain confidently to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from one of the Angular projects.

## Box model
- `margin`, `padding`, `border`, `content` — what each layer is and how they stack; interviewers draw the box model and ask you to label it or explain why two elements are not touching even though margin is set to 0 ✅ 01-todo-list
- `box-sizing: border-box` — makes `width` include padding and border; the default `content-box` adds them on top, causing sizing surprises; setting it globally in a reset makes layouts predictable ✅ 01-todo-list
- Collapsing margins — two adjacent vertical margins collapse into one (the larger wins, not the sum); the most common box model surprise in interviews
- CSS reset pattern — `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }` removes browser defaults and ensures consistent sizing; interviewers ask why `::before` and `::after` are included alongside `*` ✅ 01-todo-list

## Display and layout
- Normal flow — understand how block and inline boxes participate in document flow before using flex, grid, or positioning to change it
- `display: block`, `inline`, `inline-block` — a block box normally fills the available inline space and starts on a new line; inline content participates in a line box and does not accept width; inline-block flows inline while accepting dimensions ✅ 04-meal-finder
- `display: none` vs `visibility: hidden` — `none` removes the element from layout entirely (no space); `hidden` hides it but keeps its space; this pair is tested in every junior screening ✅ 05-task-manager
- Flexbox vs Grid — Flexbox for one-dimensional layout (row or column); Grid for two-dimensional layout (rows AND columns at the same time); interviewers ask "when would you choose Grid over Flexbox?" ✅ 04-meal-finder
- `table-layout: fixed` — take column widths from the first row instead of measuring every cell, which is what makes equal-width columns and predictable truncation possible in a wide data table; the default `auto` sizes columns from their content ✅ 05-task-manager

## Sizing
- `width`, `min-width`, and `max-width` — combine a preferred size with lower and upper bounds so a component can shrink and grow without becoming unusable
- `height`, `min-height`, and `max-height` — prefer content-driven height and add constraints only when the interface has a real scrolling or viewport requirement
- Intrinsic sizing — recognise `min-content`, `max-content`, and `fit-content()` as sizes derived from content rather than arbitrary fixed dimensions
- Automatic minimum size in flex and grid — use `min-width: 0` or `min-height: 0` when a flex or grid child must be allowed to shrink instead of overflowing

## Cascade and inheritance
- Cascade decision order — resolve ordinary author declarations through importance, specificity, and source order rather than assuming the last rule always wins
- Inheritance — distinguish inherited properties such as `color` and `font-family` from non-inherited layout properties, and use `inherit`, `initial`, `unset`, or `revert` deliberately
- Shorthand vs longhand declarations — understand that shorthands such as `margin`, `background`, and `border` set several longhands and can reset values that were declared earlier

## Selectors and specificity

- Fundamental selectors and selector lists — distinguish type, class, ID, and universal selectors and use comma-separated lists without unintentionally broadening a rule

- Combinators: descendant (space), child `>`, adjacent sibling `+`, general sibling `~` — how to target elements by relationship; interviewers show a selector and ask which elements it matches ✅ 01-todo-list
- Attribute selectors — target attribute presence or values without adding presentation-only classes, while avoiding selectors that accidentally match unrelated elements
- `:has()` relational selector — read and write simple parent- or sibling-state selectors while keeping a class or state attribute as the clearer option when application logic already owns the state
- Interaction pseudo-classes — style `:hover`, `:focus`, `:active`, and `:disabled` as user-interface states without relying on hover alone ✅ 01-todo-list
- Structural and functional pseudo-classes — select relationships with `:first-child`, `:last-child`, and `:nth-child()` and filter matches with functions such as `:not()`
- Pseudo-class vs pseudo-element — use `:` for a state or structural condition and `::` for a generated or selected part of an element
- `:focus` vs `:focus-visible` — `:focus` matches every focused element, while `:focus-visible` follows browser heuristics for when a visible focus indicator is needed, including typical keyboard navigation
- Pseudo-elements: `::before`, `::after` — insert CSS-generated content before or after an element; must have a `content` property (can be an empty string); used for decorative elements and Angular Material state layers ✅ 06-hr-portal
- Specificity scoring — compare inline styles, IDs, classes/attributes/pseudo-classes, and elements/pseudo-elements as separate columns; source order decides only after the relevant cascade criteria and specificity tie
- `!important` — raises a declaration into the important cascade, after which origin, layer, and
  specificity still resolve competing important declarations; use it sparingly because it makes
  overrides harder to reason about

## Flexbox
- Flex direction and axes — use `flex-direction` to establish the main axis and recognise that the cross axis changes with it ✅ 01-todo-list
- Flex container alignment — distribute items on the main axis with `justify-content`, align them on the cross axis with `align-items`, and use `gap` for consistent space between items ✅ 01-todo-list
- `flex-wrap: wrap` — controls whether items can move onto additional flex lines; with `nowrap` they stay on one line and may shrink or overflow according to flex sizing and their automatic minimum size ✅ 06-hr-portal
- Flex sizing — explain how `flex-basis`, `flex-grow`, and `flex-shrink` negotiate an item's size and read the `flex` shorthand without assuming `flex: 1` means only “take remaining space” ✅ 01-todo-list
- Per-item alignment — override the container's cross-axis alignment for one item with `align-self`
- `margin: auto` on flex items — absorbs all available space on that side; used to push an action button to the right of a navbar without adding a wrapper element; interviewers show navbar code and ask how it works

## CSS Grid
- `grid-template-columns` and `gap` — the two properties set most often on a grid container; understanding `fr` units is required to explain any Grid answer ✅ 04-meal-finder
- `repeat()` function — `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`; `repeat(auto-fill, minmax(250px, 1fr))` is the responsive card grid pattern that needs no media queries ✅ 04-meal-finder
- `minmax()` — give a grid track a lower and upper sizing limit so responsive columns remain usable while sharing available space
- `fr` unit — distributes free space after fixed columns are placed; does not include the gap in the calculation, which is why it is cleaner than percentages for equal columns ✅ 04-meal-finder
- `auto-fill` vs `auto-fit` — both create as many columns as fit; `auto-fill` keeps empty column tracks (items stay at their minimum size); `auto-fit` collapses empty tracks (items stretch to fill the space); a confusable pair tested in interviews
- `grid-column` and `grid-row` — placing an item across multiple tracks using grid line numbers; `grid-column: 1 / -1` spans all columns; `span 2` spans two tracks from wherever the item is placed ✅ 04-meal-finder
- Explicit vs implicit grid and auto-placement — distinguish declared tracks from rows or columns Grid creates when items have no explicit placement
- Grid alignment — distinguish aligning items inside their grid areas with `justify-items`/`align-items` from aligning the grid tracks inside the container

## Position
- `static` vs `relative` positioning — keep an element in normal flow and use relative offsets without removing its original layout space
- `absolute` positioning — remove a box from normal flow and position it from its containing block rather than from where siblings would place it
- `fixed` vs `sticky` positioning — distinguish a box normally anchored to the viewport from one that remains in flow until it reaches an inset within its scroll container
- Sticky positioning conditions — supply an inset such as `top`, ensure the scroll container has room to scroll, and inspect ancestor overflow when sticky behaviour appears not to activate
- How `absolute` finds its reference point — positions relative to the nearest ancestor that
  establishes a containing block; otherwise it falls back to the initial containing block ✅ 03-expense-tracker
- `z-index` and stacking context — applies to positioned boxes and flex/grid items; properties such
  as `transform` and `opacity < 1` create a new stacking context, explaining why a large number
  cannot escape an ancestor's stacking order
- `inset: 0` — shorthand for `top: 0; right: 0; bottom: 0; left: 0`; used in modal overlays to cover the full viewport; interviewers who review your code expect you to know this shorthand

## Responsive design
- Mobile-first with `@media (min-width: ...)` — base styles for mobile, then `min-width` queries add complexity for wider screens; `max-width` (desktop-first) is less common because it starts with the complex case; interviewers ask why mobile-first is the recommended approach ✅ 03-expense-tracker
- Content-driven breakpoints — add a breakpoint where the layout or content stops working rather than memorising device widths; intrinsic Grid patterns can remove some breakpoints entirely ✅ 04-meal-finder
- Fluid images — `max-width: 100%; height: auto` on `img` prevents images from overflowing their container and keeps the aspect ratio; standard in every CSS reset; not knowing this is a recognisable beginner mistake
- `@media (prefers-color-scheme: dark)` — applies styles when the user's system uses dark mode; with CSS variables on `:root`, switching only requires updating the variable values inside the media query; asked increasingly in 2026 since dark mode support is now expected
- `prefers-reduced-motion` — remove or reduce non-essential movement for users who request it without disabling functional state feedback
- Logical properties — use `margin-inline`, `padding-block`, and logical inset or size properties when layout should follow writing direction instead of hard-coded left and right
- Responsive content testing — test narrow widths, zoom, long labels, translated text, and missing or oversized media because a layout is responsive only if real content can change without clipping

## Units
- `px` — a CSS reference pixel, useful for thin borders and other fixed details; root-relative units
  usually respect user text-size preferences more naturally for typography and scalable spacing ✅ 01-todo-list
- `%` — relative to the parent's value on the same axis; for vertical `padding` and `margin`, `%` is relative to the parent's **width**, not height — a common surprise in interviews
- `em` — usually resolves from the element's computed font size, while `font-size` itself uses the inherited parent size; nested font sizing can therefore compound
- `rem` — relative to the root element's computed font size, commonly but not guaranteed to start at `16px`; it avoids nested compounding ✅ 01-todo-list
- Viewport units — use `vw`/`vh` for the default viewport and recognise `svh`, `lvh`, and `dvh` when mobile browser chrome makes `100vh` unsuitable ✅ 01-todo-list

## Transitions and animations
- `transition` — smooth change for a specific property on state change; always place it on the base element, not on `:hover`, so it runs in both directions; putting it on `:hover` makes the exit instant — a classic interview trap ✅ 04-meal-finder
- `transform` — `translateX/Y`, `scale`, and `rotate` change visual appearance without changing
  normal-flow geometry; browsers can often composite transforms efficiently, but GPU promotion is
  not guaranteed ✅ 02-weather-app
- `transform` vs `top/left` for movement — transforms commonly avoid layout while positional changes
  can trigger it; profile when performance matters instead of treating either rendering path as an
  unconditional guarantee
- `@keyframes` and `animation` — multi-step animations; `animation-iteration-count: infinite` for loading spinners; `animation-fill-mode: forwards` keeps the final state after the animation ends instead of snapping back ✅ 02-weather-app

## Typography
- `font-size` with `rem` — `rem` follows the root size and composes consistently with user settings;
  fixed pixels are not automatically inaccessible, but a scalable type system is easier to zoom and
  maintain ✅ 01-todo-list
- `font-weight` numeric values — `400` (normal), `600` (semibold), `700` (bold); interviewers ask why numeric values are used instead of the keyword `bold`, and whether every font supports every weight ✅ 04-meal-finder
- `line-height` unitless value — `1.5` means 1.5× the current font size; a unitless value scales correctly when font size changes; `line-height: 24px` breaks as soon as the font size changes ✅ 04-meal-finder
- Text truncation — `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` must all be present; interviewers ask why removing any one of them breaks the effect and what each one does individually ✅ 06-hr-portal
- `text-transform` — `capitalize` displays stored lowercase values (`'active'`) as `'Active'` without changing the data; `uppercase` for labels and badges; tested in code review questions about status display ✅ 02-weather-app
- `font-family` fallback stack — listing several fonts (`'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`) so the browser falls back if the first font is not installed; the last value should always be a generic family (`sans-serif`, `serif`, `monospace`); interviewers ask why you never list just one font name ✅ 01-todo-list

## CSS variables
- `--variable-name` and `var()` — define a value once and reuse it everywhere; Angular Material uses CSS variables for its theme colours; change one variable and the whole UI updates ✅ 01-todo-list
- `:root` vs component scope — declaring on `:root` makes the variable globally available; scoping to a specific selector limits it to that element's subtree; interviewers ask why Angular Material theming variables are declared on `:root` ✅ 01-todo-list
- CSS variables participate in the runtime cascade — their values can change through selector state, media queries, inheritance, or an inline style without recompiling the stylesheet
- `var()` with a fallback — `var(--primary, #e8572a)` uses the second argument when the variable is not defined; provides a safety net when customising Angular Material where some variables may not be set

## Sass and maintainable authoring
- Sass vs native CSS — use Sass for build-time authoring features and CSS custom properties for values that must participate in the runtime cascade or change without recompiling
- Sass nesting — keep nesting shallow and use `&` for a component's states or modifiers without recreating the DOM tree as a high-specificity selector chain
- Sass variables — use build-time constants when runtime cascade and inheritance are not required
- Sass mixins — reuse a parameterised declaration group only when it removes meaningful repetition rather than hiding ordinary CSS
- Sass modules and partials — split styles by concern and load explicit members without returning to global `@import` coupling
- Reusable low-specificity selectors — prefer stable class selectors and a consistent naming convention so existing styles can be extended without specificity escalation

## Colors and transparency
- Color notation — read hex, RGB, and HSL representations and follow a consistent project convention rather than treating one notation as universally superior ✅ 01-todo-list
- Alpha-channel colour — apply transparency to one colour with modern RGB/HSL, hex alpha, or legacy `rgba()` syntax instead of fading the entire element
- `opacity` vs `rgba` transparency — `opacity` affects the element AND all its children; `rgba` only affects the specific property it is applied to; classic interview question: "why does `opacity: 0.5` on a card fade the text too, but `background: rgba(0,0,0,0.5)` does not?"
- `visibility: hidden` vs `opacity: 0` — both preserve layout space, but visibility changes painting and interaction semantics while zero opacity can leave an invisible element hit-testable and focusable
- `rgba` for overlays and shadows — `rgba(0, 0, 0, 0.5)` for modal backgrounds, `rgba(0, 0, 0, 0.08)` for card shadows; `rgba` allows the shadow to blend with whatever background colour is beneath it, unlike a hex value ✅ 02-weather-app
- `currentColor` — a keyword that resolves to the element's current `color` value; used to keep borders, icons, and SVG fills in sync with the text color without repeating the value

## Borders, shadows, and backgrounds
- `box-shadow` syntax: `offset-x offset-y blur spread color` — spread is optional, and transparent
  colour can use modern `rgb(... / alpha)`, hex alpha, HSL, `rgba()`, or a design token ✅ 02-weather-app
- `border-radius: 50%` — makes a circle only when the element is square, which is why it works for avatars and loading spinners and produces an ellipse on any other aspect ratio ✅ 02-weather-app
- `border-radius: 9999px` — creates a pill shape at any aspect ratio, which is why badges and chips use it; `50%` vs `9999px` is a confusable pair interviewers test with avatar vs badge ✅ 05-task-manager
- `background-size: cover` vs `background-size: contain` — `cover` fills the element completely and may crop the image; `contain` fits the whole image and may leave empty space; `cover` is standard for hero sections and card backgrounds
- `object-fit: cover` — same fill-and-crop behaviour as `background-size: cover`, but applies to `<img>` elements in a fixed-size container; `background-size` is for background images, `object-fit` is for `<img>` tags — a confusable pair ✅ 04-meal-finder
- `outline` vs `border` — `outline` sits outside the border and does not take up layout space; never remove the browser's default focus outline without adding a visible custom replacement; `button:focus-visible` is the accessible way to style it ✅ 01-todo-list
- `aspect-ratio` — locks an element's width-to-height ratio (`aspect-ratio: 16 / 9`) so it scales without distortion when only one dimension is known; replaces the older padding-percentage hack for responsive video and image containers; interviewers ask how you reserve space for an image before it loads to avoid layout shift

## Overflow
- `overflow: visible`, `hidden`, `scroll`, `auto` — `hidden` clips content; used to prevent images from breaking out of a `border-radius` card container; `scroll` always shows scrollbars; `auto` only shows them when content overflows ✅ 04-meal-finder
- `overflow-x` and `overflow-y` — control each axis independently; `overflow-x: hidden` prevents a horizontal scrollbar on mobile when an element slightly overflows the viewport ✅ 06-hr-portal
- Scrollable container pattern — combine `overflow-y: auto` with a meaningful height constraint so overflowing content scrolls inside the component rather than extending the page ✅ 04-meal-finder
- Long-word wrapping — use `overflow-wrap` to let long URLs, identifiers, or translations break before they force a component wider than its container

## CSS functions
- `calc()` — mixes different units in one expression; `calc(100% - 64px)` subtracts a fixed header height from the full viewport; spaces around `+` and `-` are required; interviewers ask when `calc()` is necessary and why neither pure percentage nor pure `px` can solve the same problem ✅ 05-task-manager
- `clamp(min, preferred, max)` — creates a value that scales fluidly between limits; `font-size: clamp(1rem, 2.5vw, 2rem)` replaces multiple breakpoint overrides for font size; tested because it signals modern CSS knowledge
- `min()` and `max()` — select the smaller or larger computed value from mixed units while remembering that intrinsic sizing and `box-sizing` can make the result differ from a separate width plus max-width declaration

## BEM naming
- Block, element (`__`), modifier (`--`) — `.card`, `.card__title`, `.card--featured`; a naming convention that makes class names predictable in global stylesheets; interviewers at consultancies ask about CSS organisation because shared CSS becomes unmaintainable without a convention
- Why BEM keeps specificity low — each rule is a single class selector (`0-1-0`); nested selectors like `.card .card__title` raise specificity and become hard to override; BEM avoids nesting in the CSS file
- BEM alongside component scoping — treat BEM as one optional naming convention for predictable classes, especially in global CSS, rather than as a requirement imposed by Angular components

## Browser debugging and compatibility
- DevTools computed styles — inspect the matched rules, crossed-out declarations, inherited values, and final computed value before changing a selector blindly
- DevTools box and layout inspection — use the box-model, flex, and grid overlays to diagnose spacing, alignment, track, and overflow problems from the browser's actual layout
- CSS support and progressive enhancement — check current browser support for newer features, provide a usable baseline when necessary, and use `@supports` when conditional enhancement is clearer than browser-specific hacks
