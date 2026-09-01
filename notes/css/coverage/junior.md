# Minimum Coverage — CSS

Topics a junior must explain confidently to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from one of the Angular projects.

## Box model
- `margin`, `padding`, `border`, `content` — distinguish each box-model layer and trace how they determine visible size and spacing ✅ 01-todo-list
- `box-sizing: border-box` — makes `width` include padding and border; the default `content-box` adds them on top, causing sizing surprises; setting it globally in a reset makes layouts predictable ✅ 01-todo-list
- Collapsing margins — adjacent vertical margins may collapse into one rather than add together, so diagnose spacing from the participating margins and formatting context
- CSS reset pattern — apply sizing and baseline rules to elements and generated boxes deliberately instead of assuming browser defaults are identical ✅ 01-todo-list

## Display and layout
- Normal flow — understand how block and inline boxes participate in document flow before using flex, grid, or positioning to change it
- Floats and clearing — recognise that a floated box leaves normal block flow while inline content wraps around it, and contain or clear legacy floats with `flow-root` or `clear` instead of using float as a modern layout system
- `display: block`, `inline`, `inline-block` — a block box normally fills the available inline space and starts on a new line; inline content participates in a line box and does not accept width; inline-block flows inline while accepting dimensions ✅ 04-meal-finder
- `display: none` vs `visibility: hidden` — remove an element from layout entirely or hide it while preserving its occupied space ✅ 05-task-manager
- Flexbox vs Grid — choose one-dimensional alignment along a row or column or two-dimensional control across rows and columns ✅ 04-meal-finder
- `table-layout: fixed` — take column widths from the first row instead of measuring every cell, which is what makes equal-width columns and predictable truncation possible in a wide data table; the default `auto` sizes columns from their content ✅ 05-task-manager

## Sizing
- `width`, `min-width`, and `max-width` — combine a preferred size with lower and upper bounds so a component can shrink and grow without becoming unusable
- `height`, `min-height`, and `max-height` — prefer content-driven height and add constraints only when the interface has a real scrolling or viewport requirement
- Percentage heights — understand that `height: 100%` needs a definite containing-block height, while `min-height` with a viewport unit is often the robust choice for a page that must fill the screen
- Automatic minimum size in flex and grid — use `min-width: 0` or `min-height: 0` when a flex or grid child must be allowed to shrink instead of overflowing

## Cascade and inheritance
- Cascade decision order — resolve ordinary author declarations through importance, specificity, and source order rather than assuming the last rule always wins
- Cascade origins — distinguish user-agent, user, and author declarations and know that origin and importance are resolved before specificity, so a more specific selector does not always win
- Inheritance — distinguish inherited properties such as `color` and `font-family` from non-inherited layout properties, and use `inherit`, `initial`, `unset`, or `revert` deliberately
- Shorthand vs longhand declarations — understand that shorthands such as `margin`, `background`, and `border` set several longhands and can reset values that were declared earlier ✅ 02-weather-app — `animation-duration: 2.4s` overrides only the duration longhand of `animation: spin 0.8s linear infinite`, leaving the keyframes name and `infinite` intact

## Selectors and specificity

- Fundamental selectors and selector lists — distinguish type, class, ID, and universal selectors and use comma-separated lists without unintentionally broadening a rule

- Combinators: descendant (space), child `>`, adjacent sibling `+`, general sibling `~` — target elements through exact ancestry and sibling relationships ✅ 01-todo-list
- Attribute selectors — target attribute presence or values without adding presentation-only classes, while avoiding selectors that accidentally match unrelated elements
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
- `align-items` vs `align-content` — `align-items` positions items within a flex line, while `align-content` distributes multiple wrapped lines and has no visible effect when there is only one line
- Container properties vs item properties — `justify-content`, `align-items`, `gap` and `flex-wrap` are read only by an element whose own `display` is `flex` or `grid`, while `align-self`, `order` and the `flex` shorthand belong to its children; an alignment property declared on any other element is parsed into the computed style and then silently ignored, so a dead rule produces no error and is only caught by reading that element's `display` ✅ 01-todo-list — in `task-item.css` the alignment properties appear only on `.task-item`, the one rule that declares `display: flex`; the `.task-title` span carries none
- `margin: auto` on flex items — absorb available space on the selected side to separate an item without adding a wrapper element
- Visual order vs DOM order — flex and grid reordering can change visual placement without changing DOM, reading, or keyboard-focus order, so source order must remain meaningful

## CSS Grid
- `grid-template-columns` and `gap` — the two properties set most often on a grid container; understanding `fr` units is required to explain any Grid answer ✅ 04-meal-finder
- `repeat()` function — `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`; `repeat(auto-fill, minmax(250px, 1fr))` is the responsive card grid pattern that needs no media queries ✅ 04-meal-finder
- `minmax()` — give a grid track a lower and upper sizing limit so responsive columns remain usable while sharing available space
- `fr` unit — distributes free space after fixed columns are placed; does not include the gap in the calculation, which is why it is cleaner than percentages for equal columns ✅ 04-meal-finder
- `auto-fill` vs `auto-fit` — create as many tracks as fit while choosing whether empty tracks remain or collapse so occupied tracks can stretch
- `grid-column` and `grid-row` — placing an item across multiple tracks using grid line numbers; `grid-column: 1 / -1` spans all columns; `span 2` spans two tracks from wherever the item is placed ✅ 04-meal-finder
- Explicit vs implicit grid and auto-placement — distinguish declared tracks from rows or columns Grid creates when items have no explicit placement
- Grid alignment — distinguish aligning items inside their grid areas with `justify-items`/`align-items` from aligning the grid tracks inside the container

## Position
- `static` vs `relative` positioning — keep an element in normal flow and use relative offsets without removing its original layout space
- `absolute` positioning — remove a box from normal flow and position it from its containing block rather than from where siblings would place it ✅ 04-meal-finder — the visually hidden search label sits inside the flex `.search-container` without taking a slot in the row
- `fixed` vs `sticky` positioning — distinguish a box normally anchored to the viewport from one that remains in flow until it reaches an inset within its scroll container
- Sticky positioning conditions — supply an inset such as `top`, ensure the scroll container has room to scroll, and inspect ancestor overflow when sticky behaviour appears not to activate
- How `absolute` finds its reference point — positions relative to the nearest ancestor that
  establishes a containing block; otherwise it falls back to the initial containing block ✅ 03-expense-tracker
- `z-index` and stacking context — applies to positioned boxes and flex/grid items; properties such
  as `transform` and `opacity < 1` create a new stacking context, explaining why a large number
  cannot escape an ancestor's stacking order
- `inset: 0` — set all four positioning offsets to zero with one shorthand, as in a viewport-covering overlay

## Responsive design
- Mobile-first with `@media (min-width: ...)` — start from the constrained layout and add capabilities for wider viewports instead of undoing a complex desktop layout ✅ 03-expense-tracker
- Content-driven breakpoints — add a breakpoint where the layout or content stops working rather than memorising device widths; intrinsic Grid patterns can remove some breakpoints entirely ✅ 04-meal-finder
- Fluid images — constrain an image to its container while preserving its intrinsic aspect ratio
- `@media (prefers-color-scheme: dark)` — applies styles when the user's system uses dark mode; with CSS variables on `:root`, switching only requires updating the variable values inside the media query; asked increasingly in 2026 since dark mode support is now expected
- `prefers-reduced-motion` — remove or reduce non-essential movement for users who request it without disabling functional state feedback ✅ 02-weather-app — the decorative card hover is dropped under a `reduce` query while the loading spinner is only slowed from 0.8s to 2.4s
- Logical properties — use `margin-inline`, `padding-block`, and logical inset or size properties when layout should follow writing direction instead of hard-coded left and right
- Responsive content testing — test narrow widths, zoom, long labels, translated text, and missing or oversized media because a layout is responsive only if real content can change without clipping

## Units
- `px` — a CSS reference pixel, useful for thin borders and other fixed details; root-relative units
  usually respect user text-size preferences more naturally for typography and scalable spacing ✅ 01-todo-list
- `%` — resolve against the relevant containing-block dimension, noting that percentage margins and padding use its inline size even on the vertical axis
- `em` — usually resolves from the element's computed font size, while `font-size` itself uses the inherited parent size; nested font sizing can therefore compound
- `rem` — relative to the root element's computed font size, commonly but not guaranteed to start at `16px`; it avoids nested compounding ✅ 01-todo-list
- Viewport units — use `vw`/`vh` for the default viewport and recognise `svh`, `lvh`, and `dvh` when mobile browser chrome makes `100vh` unsuitable ✅ 01-todo-list

## Transitions and animations
- `transition` — declare the animated property and timing on the base element so state changes animate in both directions ✅ 04-meal-finder
- `transform` — `translateX/Y`, `scale`, and `rotate` change visual appearance without changing
  normal-flow geometry; browsers can often composite transforms efficiently, but GPU promotion is
  not guaranteed ✅ 02-weather-app
- `transform` vs `top/left` for movement — transforms commonly avoid layout while positional changes
  can trigger it; profile when performance matters instead of treating either rendering path as an
  unconditional guarantee
- Interpolated vs discrete properties — properties such as `opacity` and `transform` can interpolate smoothly, while `display` changes discretely and should not be treated as an ordinary fade transition
- `@keyframes` and `animation` — multi-step animations; `animation-iteration-count: infinite` for loading spinners; `animation-fill-mode: forwards` keeps the final state after the animation ends instead of snapping back ✅ 02-weather-app

## Typography
- `font-size` with `rem` — `rem` follows the root size and composes consistently with user settings;
  fixed pixels are not automatically inaccessible, but a scalable type system is easier to zoom and
  maintain ✅ 01-todo-list
- `font-weight` numeric values — request standard weight positions while recognising that the selected font may not provide every intermediate weight ✅ 04-meal-finder
- `line-height` unitless value — `1.5` means 1.5× the current font size; a unitless value scales correctly when font size changes; `line-height: 24px` breaks as soon as the font size changes ✅ 04-meal-finder
- Text truncation — combine a non-wrapping line, clipped overflow, and ellipsis signalling because each property controls a different part of the effect ✅ 06-hr-portal
- `text-transform` — change displayed casing for labels and badges without mutating the stored text ✅ 02-weather-app
- `font-family` fallback stack — list compatible alternatives ending in a generic family so text remains usable when a preferred font is unavailable ✅ 01-todo-list

## CSS variables
- `--variable-name` and `var()` — define a value once and reuse it everywhere; Angular Material uses CSS variables for its theme colours; change one variable and the whole UI updates ✅ 01-todo-list
- `:root` vs component scope — expose a custom property globally or restrict it to one element subtree according to who owns the design token ✅ 01-todo-list
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
- `opacity` vs alpha-channel colour — fade the whole rendered element subtree or only the colour of one painted property
- `visibility: hidden` vs `opacity: 0` — both preserve layout space, but visibility changes painting and interaction semantics while zero opacity can leave an invisible element hit-testable and focusable
- `rgba` for overlays and shadows — `rgba(0, 0, 0, 0.5)` for modal backgrounds, `rgba(0, 0, 0, 0.08)` for card shadows; `rgba` allows the shadow to blend with whatever background colour is beneath it, unlike a hex value ✅ 02-weather-app
- `currentColor` — a keyword that resolves to the element's current `color` value; used to keep borders, icons, and SVG fills in sync with the text color without repeating the value
- Contrast ratios — meet at least 4.5:1 for normal text and 3:1 for large text and meaningful user-interface graphics so content remains readable against its background
- Non-colour cues — never make colour the only signal for status, validation, links, or interaction state; add text, an icon, shape, or another visible distinction

## Borders, shadows, and backgrounds
- `box-shadow` syntax: `offset-x offset-y blur spread color` — spread is optional, and transparent
  colour can use modern `rgb(... / alpha)`, hex alpha, HSL, `rgba()`, or a design token ✅ 02-weather-app
- `border-radius: 50%` — makes a circle only when the element is square, which is why it works for avatars and loading spinners and produces an ellipse on any other aspect ratio ✅ 02-weather-app
- `border-radius: 9999px` — create pill ends across changing aspect ratios while reserving `50%` for shapes derived from each axis ✅ 05-task-manager
- `background-size: cover` vs `background-size: contain` — `cover` fills the element completely and may crop the image; `contain` fits the whole image and may leave empty space; `cover` is standard for hero sections and card backgrounds
- `object-fit: cover` — same fill-and-crop behaviour as `background-size: cover`, but applies to `<img>` elements in a fixed-size container; `background-size` is for background images, `object-fit` is for `<img>` tags — a confusable pair ✅ 04-meal-finder
- `outline` vs `border` — `outline` sits outside the border and does not take up layout space; never remove the browser's default focus outline without adding a visible custom replacement; `button:focus-visible` is the accessible way to style it ✅ 01-todo-list
- `aspect-ratio` — preserve a width-to-height ratio when one dimension is resolved and reserve predictable media space before content loads

## Overflow
- `overflow: visible`, `hidden`, `scroll`, `auto` — `hidden` clips content; used to prevent images from breaking out of a `border-radius` card container; `scroll` always shows scrollbars; `auto` only shows them when content overflows ✅ 04-meal-finder
- `overflow-x` and `overflow-y` — control each axis independently; `overflow-x: hidden` prevents a horizontal scrollbar on mobile when an element slightly overflows the viewport ✅ 06-hr-portal
- Scrollable container pattern — combine `overflow-y: auto` with a meaningful height constraint so overflowing content scrolls inside the component rather than extending the page ✅ 04-meal-finder
- Long-word wrapping — use `overflow-wrap` to let long URLs, identifiers, or translations break before they force a component wider than its container

## CSS functions
- `calc()` — combine compatible values and units in one expression when neither a purely relative nor fixed size represents the constraint ✅ 05-task-manager
- `clamp(min, preferred, max)` — scale a preferred value fluidly while enforcing explicit lower and upper bounds
- `min()` and `max()` — select the smaller or larger computed value from mixed units while remembering that intrinsic sizing and `box-sizing` can make the result differ from a separate width plus max-width declaration

## BEM naming
- Block, element (`__`), modifier (`--`) — use predictable class roles in a global stylesheet while keeping names independent of DOM depth
- Why BEM keeps specificity low — each rule is a single class selector (`0-1-0`); nested selectors like `.card .card__title` raise specificity and become hard to override; BEM avoids nesting in the CSS file
- BEM alongside component scoping — treat BEM as one optional naming convention for predictable classes, especially in global CSS, rather than as a requirement imposed by Angular components

## Browser debugging and compatibility
- DevTools computed styles — inspect the matched rules, crossed-out declarations, inherited values, and final computed value before changing a selector blindly
- DevTools box and layout inspection — use the box-model, flex, and grid overlays to diagnose spacing, alignment, track, and overflow problems from the browser's actual layout
- CSS support and progressive enhancement — check current browser support for newer features, provide a usable baseline when necessary, and use `@supports` when conditional enhancement is clearer than browser-specific hacks
