# Minimum Coverage — CSS

Topics a junior must explain confidently to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from one of the Angular projects.

## The cascade and value resolution
- The cascade resolution order — origin and importance first, then specificity, then source order; interviewers give a snippet where a *less* specific rule wins and expect the candidate to name the step that decided it, not just recite specificity numbers
- Source order as the tiebreak — when two rules have identical specificity the last one declared wins; the "which colour renders?" snippet always includes one equal-specificity pair to see if the candidate reaches for it
- Inline `!important` vs author `!important` — an inline `!important` beats an `!important` in a stylesheet; interviewers use this as the top of the "which rule wins" ladder
- `!important` vs `!important` — between two important declarations, normal specificity and source order decide; a pressure question that exposes people who think `!important` is a single on/off switch
- Inherited vs non-inherited properties — `color`, `font-*`, `line-height`, `visibility` and `cursor` pass down to children; `border`, `padding`, `margin`, `background` and `display` do not; interviewers ask why setting `font-family` on `body` styles the whole page but setting `border` on `body` does not
- Inheritance loses to any matching declaration — a browser default rule on `<a>` or `<button>` beats a colour inherited from `body`; the canned puzzle is "I set `body { color: white }`, why is the link still blue?"
- `inherit`, `initial`, `unset` and `revert` — `unset` means `inherit` on inherited properties and `initial` on the rest, `revert` goes back to the browser default; interviewers ask which one resets a button to look like plain text, or how you undo a rule in a shared stylesheet you cannot delete
- Computed value vs used value — `width: 50%` computes to a percentage and is only resolved to pixels at layout time; explains why `getComputedStyle` returns pixels for some properties and the authored value for others
- An invalid value drops only its own declaration — a typo like `widht` or `margin: 10 px` makes the browser discard that one line with no error anywhere, leaving the rest of the block working; the number-one "my CSS is not applying" cause that has nothing to do with specificity
- An invalid selector invalidates the whole rule — unlike a bad declaration, a malformed selector kills every declaration in the block; interviewers ask why one line is ignored in one case and the entire rule in the other

## Selectors and specificity
- Combinators: descendant (space), child `>`, adjacent sibling `+`, general sibling `~` — how to target elements by relationship; interviewers show a selector and ask which elements it matches
- Pseudo-classes: `:hover`, `:focus`, `:nth-child`, `:first-child`, `:last-child`, `:not()` — `:not()` excludes elements from a rule; `:focus` is essential for keyboard accessibility; tested in code review questions
- `:focus` vs `:focus-visible` — `:focus` triggers on every way of focusing an element, including a mouse click; `:focus-visible` only shows the ring when the browser decides keyboard navigation is likely (Tab key); interviewers ask why a button gets an ugly focus ring on click and how `:focus-visible` fixes it without removing accessibility for keyboard users
- Pseudo-elements: `::before`, `::after` — insert CSS-generated content before or after an element; must have a `content` property (can be an empty string); used for decorative elements and Angular Material state layers
- Specificity scoring — inline styles beat IDs (`1-0-0`) beat classes (`0-1-0`) beat elements (`0-0-1`); the rule with the highest score wins, not the one that appears last; interviewers give two rules and ask which one applies
- Specificity columns are not additive — ten chained classes still lose to one ID; interviewers ask candidates to score `#nav .item a` against `.nav .item .link.active` and watch for the ones who add the numbers up
- The universal selector and combinators add no specificity — `*`, `>`, `+` and `~` all score `0-0-0`, so `div > p` is no more specific than `p`; a junior who assumes otherwise mis-predicts the snippet
- `:is()` and `:where()` — both group selectors, but `:is()` takes the specificity of its most specific argument while `:where()` always scores zero; `:where()` is the modern way to ship overridable base styles instead of reaching for `!important` — a confusable pair
- Over-qualified selectors — `div.card` or `.page .card .card__title` raise specificity for no benefit and force the next developer into `!important`; the concrete defect a reviewer flags in a BEM codebase

## Box model
- `margin`, `padding`, `border`, `content` — what each layer is and how they stack; interviewers draw the box model and ask you to label it or explain why two elements are not touching even though margin is set to 0
- `box-sizing: border-box` — makes `width` include padding and border; the default `content-box` adds them on top, causing sizing surprises; setting it globally in a reset makes layouts predictable
- The box-width arithmetic puzzle — `width: 100px; padding: 20px; border: 5px` renders 150px wide under `content-box` and 100px under `border-box`; the single most reused canned CSS screening question
- Collapsing margins — two adjacent vertical margins collapse into one (the larger wins, not the sum); the most common box model surprise in interviews
- What stops margin collapsing — padding, a border, an `overflow` other than `visible`, or a flex/grid parent between the two margins; interviewers follow the collapsing question with "so how would you prevent it?"
- Margin on the child vs padding on the parent — a child's margin escapes a parent that has no border or padding, so the spacing appears outside the card instead of inside it; the reviewer's fix is padding on the parent
- CSS reset pattern — `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }` removes browser defaults and ensures consistent sizing; interviewers ask why `::before` and `::after` are included alongside `*`

## Display and layout
- `display: block`, `inline`, `inline-block` — block takes full width and starts on a new line; inline flows with text and ignores width and vertical margin; `inline-block` is both; interviewers ask why a `<span>` cannot have width
- Which declarations an inline box ignores — `width`, `height` and vertical margins have no effect, while horizontal margins and padding do apply; interviewers give a styled `<span>` and ask which lines actually render
- `display: none` vs `visibility: hidden` — `none` removes the element from layout entirely (no space); `hidden` hides it but keeps its space; this pair is tested in every junior screening
- Flexbox vs Grid — Flexbox for one-dimensional layout (row or column); Grid for two-dimensional layout (rows AND columns at the same time); interviewers ask "when would you choose Grid over Flexbox?"
- Flexbox vs Grid for a wrapping card list — with `flex-wrap` each line sizes independently so the last row's items stretch or misalign, while Grid keeps every column aligned across rows; interviewers ask which you would pick and why the Flexbox version "looks wrong on the last row"
- Layout properties on the wrong side — `justify-content` or `gap` on an element that is not `display: flex`/`grid` does nothing, and `flex-direction` on an item rather than the container is equally inert; interviewers paste a "centering doesn't work" snippet where the parent is still `display: block`
- When NOT to reach for Flexbox or Grid — normal document flow already stacks block elements, so wrapping a plain vertical stack in a flex container is over-engineering; interviewers probe it with "why is this `display: flex` here?"
- The whitespace gap between `inline-block` items — HTML whitespace renders as a real space character, producing an unexplained ~4px gap; the reason flex and grid replaced `inline-block` layouts
- `height: 100%` needs a parent with a resolved height — a percentage height resolves against the parent's computed height, so it collapses to nothing when the ancestor chain up to `html`/`body` is `auto`; the most common "why won't this fill the screen?" failure
- `float` and `position: absolute` are mutually exclusive — absolute or fixed positioning forces `float` to compute to `none`; a snippet with both is a deliberate trap

## Flexbox
- Container properties: `flex-direction`, `justify-content`, `align-items`, `gap` — the four set on almost every flex container; not knowing these will fail the "build a navbar" question in any screening
- `flex-wrap: wrap` — controls whether items wrap to the next line when space runs out; `nowrap` (default) shrinks items to fit; `wrap` moves them to a new row; asked when discussing responsive card layouts
- Item properties: `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self` — `flex: 1` makes an item fill remaining space; `flex-shrink: 0` prevents an icon or button from shrinking next to a growing input
- The `flex` shorthand expansion — `flex: 1` means `1 1 0%`, `flex: auto` means `1 1 auto`, `flex: none` means `0 0 auto`; interviewers ask why an item with `flex: 1` appears to ignore its own `width`
- The main axis and cross axis — `justify-content` works on the main axis, `align-items` on the cross axis; the axis flips with `flex-direction: column`; interviewers ask "how do you center something vertically inside a flex container?"
- `min-width: auto` on flex items — a flex item refuses to shrink below its content's intrinsic size, so a long name or a table inside `flex: 1` overflows instead of truncating; the fix is `min-width: 0`; the single most-asked flex gotcha and the reason `text-overflow: ellipsis` "does not work" inside flex
- `flex-shrink: 1` is the default — items shrink below the `width` you set them when space is tight; interviewers ask why a fixed width on a flex item is not respected
- `align-items: stretch` is the default — flex children fill the cross axis unless told otherwise, which is why a card looks unexpectedly full-height and an image looks distorted inside a flex row
- `gap` vs margins for spacing children — `gap` applies only *between* items, so it needs no `:last-child` margin reset or negative-margin wrapper; interviewers use it to date a candidate's CSS
- `margin: auto` on flex items — absorbs all available space on that side; used to push an action button to the right of a navbar without adding a wrapper element; interviewers show navbar code and ask how it works
- Properties that do nothing on a flex item — `float`, `clear` and `vertical-align` are ignored once the parent is a flex container; interviewers show old float code inside a flex parent and ask why it has no effect

## CSS Grid
- `grid-template-columns` and `gap` — the two properties set most often on a grid container; understanding `fr` units is required to explain any Grid answer
- `repeat()` function — `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`; `repeat(auto-fill, minmax(250px, 1fr))` is the responsive card grid pattern that needs no media queries
- `fr` unit — distributes free space after fixed columns are placed; does not include the gap in the calculation, which is why it is cleaner than percentages for equal columns
- `minmax(0, 1fr)` vs `1fr` — a bare `1fr` track has an automatic minimum of its content size, so long content overflows the track; `minmax(0, 1fr)` lets it actually shrink; the Grid twin of the flex `min-width: 0` fix
- `auto-fill` vs `auto-fit` — both create as many columns as fit; `auto-fill` keeps empty column tracks (items stay at their minimum size); `auto-fit` collapses empty tracks (items stretch to fill the space); a confusable pair tested in interviews
- `grid-column` and `grid-row` — placing an item across multiple tracks using grid line numbers; `grid-column: 1 / -1` spans all columns; `span 2` spans two tracks from wherever the item is placed

## Position
- `static`, `relative`, `absolute`, `fixed`, `sticky` — `static` is the default and is not a positioning context; `relative` creates the context for absolute children; `fixed` is always relative to the viewport; `sticky` sticks at a scroll threshold
- How `absolute` finds its reference point — positions relative to the nearest ancestor with a non-static position; if no ancestor qualifies, it uses the page itself; not adding `position: relative` to the parent is the most common positioning bug
- Why `position: sticky` silently does nothing — it needs a threshold (`top`, `bottom`…), it only sticks within its direct parent's box, and any ancestor with `overflow: hidden/auto/scroll` becomes the scroll container and kills it; interviewers use it because it fails with no error at all
- `transform`, `filter` and `will-change` create a containing block — an ancestor with any of them becomes the reference for `fixed` and `absolute` descendants even while it is `position: static`, which is why a fixed header suddenly scrolls with the page or a modal misplaces itself inside an animated card
- `z-index` and stacking context — only works on non-static elements; properties like `transform` and `opacity < 1` create a new stacking context that resets z-index within it; interviewers ask why a modal appears behind the navbar even with `z-index: 9999`
- `z-index` competes only among siblings in the same stacking context — a child with `z-index: 9999` can never escape a parent whose context sits lower; the mechanism behind the modal-behind-header bug, distinct from merely knowing that `transform` creates a context
- `z-index` works on flex and grid items without positioning — the documented exception to "z-index only applies to positioned elements"
- Painting order without `z-index` — backgrounds first, then non-positioned blocks, then floats, then inline content, then positioned elements in source order; interviewers ask which of two overlapping untouched divs is on top and why
- `inset: 0` — shorthand for `top: 0; right: 0; bottom: 0; left: 0`; used in modal overlays to cover the full viewport; interviewers who review your code expect you to know this shorthand

## Responsive design
- Mobile-first with `@media (min-width: ...)` — base styles for mobile, then `min-width` queries add complexity for wider screens; `max-width` (desktop-first) is less common because it starts with the complex case; interviewers ask why mobile-first is the recommended approach
- Breakpoints: `768px` (tablet), `1024px` (desktop) — the most common values in real Angular projects; a junior must justify these numbers and explain that `auto-fill` grid can eliminate breakpoints entirely for card grids
- Content-driven vs device-driven breakpoints — a breakpoint pinned to a memorised phone width leaves the layout broken at every other width, while one placed where the design actually fails holds across devices; the reasoning behind why `768px` is a convention rather than a rule
- Media queries vs intrinsic responsive CSS — `minmax()`, `clamp()`, `auto-fit` and `min()` remove whole breakpoint blocks; interviewers ask when a media query is still unavoidable, and the answer is layout *rearrangement* (sidebar becomes top nav), not mere resizing
- The viewport meta tag — without `width=device-width, initial-scale=1` in `index.html` a mobile browser renders at a fake ~980px width and every media query behaves as if it were desktop; the first thing to check when "the responsive CSS does nothing on the phone"
- Browser zoom and CSS pixels — zooming changes the viewport measured in CSS pixels, so `min-width` media queries do fire at 200% zoom; interviewers ask whether zoom is handled by media queries or by `rem`, and what breaks in a fixed-`px` layout
- Overlapping media queries — a `max-width` and a `min-width` query that both match at the boundary are resolved by source order; interviewers show two queries and ask which one wins at exactly 768px
- Fluid images — `max-width: 100%; height: auto` on `img` prevents images from overflowing their container and keeps the aspect ratio; standard in every CSS reset; not knowing this is a recognisable beginner mistake
- `@media (prefers-color-scheme: dark)` — applies styles when the user's system uses dark mode; with CSS variables on `:root`, switching only requires updating the variable values inside the media query; asked increasingly in 2026 since dark mode support is now expected
- `color-scheme` property — tells the browser the page supports light and dark so it renders form controls, scrollbars and default backgrounds accordingly; interviewers ask why inputs still look light after you wrote a dark theme with `prefers-color-scheme`

## Units
- `px` — absolute and predictable; used for borders, border-radius, and box-shadow blur; avoid for font sizes because `px` ignores the user's browser accessibility font size setting
- `%` — relative to the parent's value on the same axis; for vertical `padding` and `margin`, `%` is relative to the parent's **width**, not height — a common surprise in interviews
- `em` — relative to the current element's font size; compounds through nesting, which makes it hard to predict in deeply nested components; prefer `rem` by default
- `em` resolves against the element's own font size, except on `font-size` itself — so `font-size: 1.5em; padding: 1em` in one rule gives a padding based on the *new* size; a classic prediction trap
- `rem` — relative to the root font size (`16px` by default); does not compound; the safe choice for font sizes and spacing; `rem` vs `em` is a classic confusable pair
- When `em` is actually the right choice — component-internal padding on a button so it scales with that button's own `font-size`, giving one rule for a small and a large variant; interviewers ask for a case where `em` beats `rem` instead of the usual "always use rem"
- Never override the root font size in `px` — `html { font-size: 16px }` (or a careless `62.5%` trick) discards the user's browser font-size preference and silently defeats every `rem` in the codebase; the gotcha behind the `rem` rule
- Choosing a unit per property — `rem` for font size and spacing, `px` for borders, shadows and radii, `%`/`fr` for layout widths; interviewers hand you a design and ask which unit each value should use, because mixing them arbitrarily is a maintainability problem
- Which properties accept a unitless number — `line-height`, `z-index`, `opacity` and `flex-grow` take one by design, and `0` is valid for any length, but everywhere else a bare number is not a length; interviewers mix valid and invalid unitless values in one block and ask which lines survive
- `vw` and `vh` — relative to the viewport width and height; `min-height: 100vh` is safer than `height: 100vh` because it grows with content instead of clipping it

## Angular-specific CSS
- View encapsulation — Angular scopes component styles by adding a unique attribute to every element in the template; styles in `component.scss` only apply to that component's own elements, not to child components; interviewers ask "why does your style not apply inside the child component?"
- `ViewEncapsulation.Emulated` vs `None` vs `ShadowDom` — `Emulated` (the default) rewrites selectors with an attribute, `None` makes the component's styles global for the rest of the session, `ShadowDom` uses real browser isolation and also blocks global styles from entering; interviewers ask what breaks when someone "fixes" a scoping problem by switching to `None`
- Why an Angular component style beats an equally specific global rule — encapsulation appends an attribute selector, which raises the component rule's specificity; interviewers ask why the rule they added in `styles.css` "does nothing"
- `:host` selector — targets the component's root element from within its own styles; used to set `display: block` or add margin to the component itself; not knowing this is a red flag for an Angular role
- `:host-context()` — styles a component according to a class on an ancestor outside its own encapsulation, such as `.dark-theme` on `<body>`; interviewers ask how a component reacts to a theme class it does not own
- When to use `styles.css` vs component styles — `styles.css` for global rules (body, html, Angular Material overrides); component styles for everything specific to one component; interviewers ask why Angular Material overrides go in `styles.css` and not in a component file
- Order in the global `styles` array is cascade order — the listed stylesheets are concatenated in that order, so a reset placed after a theme silently overrides it; explains the override that works until someone reorders the list
- `::ng-deep` — deprecated but still widely used in consultancy codebases; pierces view encapsulation to style child component internals that cannot otherwise be reached; interviewers ask why it is deprecated and what the modern alternative is
- `::ng-deep` without `:host` — leaks the rule globally because the compiled selector carries no scoping attribute; the correct form is `:host ::ng-deep .child`; the single most common Angular CSS review defect
- Encapsulation does not reach markup Angular did not render for that component — content projected through `<ng-content>` keeps the parent's scoping attribute, and CDK overlays (dialogs, menus) are attached at `<body>`; the reason a dialog's styles must live in `styles.css`

## SCSS in an Angular project
- SCSS vs CSS — SCSS is a preprocessor compiled to plain CSS before the browser ever sees it; the browser never understands `.scss`, which is why the build step exists; interviewers ask "what does the browser actually receive?" and a junior who thinks the browser reads SCSS is exposed immediately
- What the build does to stylesheets — global styles are compiled and bundled into one hashed file while component styles are inlined per component; a junior must be able to say why the shipped CSS looks nothing like the source
- Nesting and the `&` parent selector — `&:hover`, `&--featured` and `&__title` reference the enclosing selector so BEM names can be composed; interviewers ask what `&` compiles to and why deep nesting is discouraged
- SCSS variables (`$var`) vs CSS custom properties (`--var`) — `$` values are resolved at compile time and vanish from the output, `--` values are live in the browser and readable by JavaScript; a confusable pair, and the direct reason a `$` variable cannot power a runtime theme switcher
- `@use` vs `@import` — `@import` is deprecated in Sass and duplicates code when a partial is loaded twice; `@use` loads a file once and namespaces its members; interviewers ask because legacy Angular codebases are mid-migration
- Partials and the `_` prefix — a file named `_variables.scss` is never compiled to its own CSS output and exists only to be loaded by another file; the most common "why is my SCSS file producing nothing?" confusion
- `@mixin` / `@include` — a reusable, optionally parameterised block of declarations for repeated patterns such as a media query or a button base; interviewers ask when a mixin is the right tool rather than a shared class
- `@extend` vs a mixin — `@extend` merges selectors into one rule (smaller output, but it couples unrelated selectors and can cause surprising selector explosions) while a mixin duplicates declarations but stays predictable; the standard tradeoff question

## Accessibility — colour and focus
- Contrast ratio and the AA thresholds — `4.5:1` for body text and `3:1` for large text; interviewers hand you a designer's grey-on-white (`#999`, roughly `2.8:1`) and ask whether you ship it, because public-sector delivery makes AA a contractual requirement rather than a preference
- Contrast applies to non-text UI too — icons, form-field borders and focus indicators need `3:1` against their surroundings; juniors assume contrast is a text-only rule and ship an invisible focus ring on a coloured background
- Never convey information by colour alone — a red border on an invalid field or a green/red status chip is unreadable to colour-blind users; the fix is a redundant cue (text, icon, shape) beside the colour; a standard code-review rejection at consultancies
- `outline: none` as a defect — removing the browser's focus indicator makes the app unusable by keyboard with no visible replacement; interviewers ask you to justify to a designer why this is a bug and not a style choice
- `outline-offset` — pushes the focus ring away from the element's edge so it stays visible on rounded or tightly packed controls; the practical piece juniors miss when replacing a removed outline

## Accessibility — reading order, motion and zoom
- Focus order follows DOM order, not visual order — `flex-direction: row-reverse`, `order`, and out-of-source grid placement move an element visually without moving it in the tab sequence, so Tab appears to jump around the screen; the classic CSS-owned accessibility trap
- Hidden from sight vs hidden from assistive technology — `display: none` and `visibility: hidden` remove the element from the accessibility tree and from tab order, while `opacity: 0` and `width/height: 0` leave it focusable and announced; interviewers ask why a keyboard user can tab into an invisible button
- The visually-hidden (`sr-only`) pattern — the `position: absolute` + `1px` + `clip-path` + `overflow: hidden` utility that keeps content in the accessibility tree while removing it from view; used for skip links and icon-button labels; interviewers ask why `text-indent: -9999px` or `font-size: 0` are not equivalent
- `@media (prefers-reduced-motion: reduce)` — respects the OS setting used by people with vestibular disorders, for whom large motion causes nausea; you shorten or remove transforms inside it rather than deleting all feedback; expected in 2026 alongside `prefers-color-scheme`
- Text must survive zoom and resize — content has to reflow at 320px and scale to 200% without loss, so a fixed `height`, `overflow: hidden`, or `white-space: nowrap` on a text container turns a zoom into hidden content; interviewers ask what breaks in your layout at 200%
- Minimum target size — interactive controls need roughly `24×24` CSS pixels, reached with padding or an enlarged pseudo-element hit area rather than by scaling a 16px icon; asked about icon-only buttons in dense toolbars
- `content` in `::before` / `::after` is announced by most screen readers — an icon-font glyph is read out as a garbage character, so decorative pseudo-elements use `content: ""` and anything meaningful needs real markup or a visually-hidden label
- `cursor: pointer` on a non-interactive element — makes a `<div>` look clickable while it stays unfocusable and unannounced; the CSS symptom of a missing native `<button>`

## Debugging CSS in DevTools
- Styles pane vs Computed pane — Styles lists every rule the browser matched, in winning order; Computed shows the single resolved value actually in use after cascade, inheritance and unit resolution; interviewers ask "the rule is right there in Styles, so why is the element still 16px?" and expect you to open Computed
- Struck-through declarations — a crossed-out property lost, and the three reasons are different: overridden by a higher-specificity or later rule, invalid syntax, or not applicable to that element's display type; only one of them is a specificity problem
- The box model panel — the nested content/padding/border/margin diagram with live numbers; answers "where is that extra 8px coming from?" without reading any CSS
- The user-agent stylesheet — the browser's own default rules, shown greyed out; explains margins on `<h1>` and `<ul>` you never wrote and the `<button>` font that ignores your body font; the reason a CSS reset exists at all
- Force-pinning `:hover` / `:focus` / `:active` — holds an element in a state so its rules stay inspectable, since moving the mouse to DevTools would otherwise drop the hover
- A parent's formatting context overrides a child's own declarations — `display: flex` on the parent nullifies the child's `float` and `vertical-align`, while the parent's `overflow` or `transform` decides the child's clipping and containing block; interviewers ask why a correct-looking rule on the element itself has no effect
- Editing a rule with no visible effect — the usual causes are editing a rule that is already overridden, targeting the wrong element, or a later shorthand resetting your longhand; a classic "your fix does nothing" pressure question
- Stylesheet sourcemaps — map a rule in DevTools back to the `.scss` line that generated it; without them you are debugging compiled output; the practical answer to "how do you find which SCSS file produced this rule?"

## Overflow, scrollbars and the viewport
- `overflow: visible`, `hidden`, `scroll`, `auto` — `hidden` clips content; used to prevent images from breaking out of a `border-radius` card container; `scroll` always shows scrollbars; `auto` only shows them when content overflows
- `overflow-x` and `overflow-y` — control each axis independently; `overflow-x: hidden` prevents a horizontal scrollbar on mobile when an element slightly overflows the viewport
- Scrollable container pattern — `overflow-y: auto` with a fixed `max-height` creates a scroll area without triggering a page scroll; `auto` vs `scroll` is a confusable pair: `auto` is invisible when not needed, `scroll` is always visible
- `overflow: hidden` has side effects beyond clipping — it establishes a block formatting context, so it also contains floats, stops margin collapsing through the element, and becomes the scroll ancestor that breaks any `sticky` descendant
- What makes a page scroll sideways — a single child wider than its containing block (a fixed width, an unbreakable string, a negative margin) propagates overflow up to the document; `overflow-x: hidden` on `body` only hides it and turns `body` into the scroll container, killing every `sticky` descendant
- `100vw` vs `100%` — `100vw` ignores the vertical scrollbar's width and is therefore wider than the visible area on desktop, which is the usual cause of a phantom horizontal scrollbar; a confusable pair
- `svh`, `lvh` and `dvh` — mobile browsers grow and shrink their toolbar while scrolling, so `100vh` is the *large* viewport and clips content behind the bar; `dvh` follows the current one; interviewers ask why a full-screen mobile layout is cut off at the bottom on iOS Safari
- Scrollbar width changes layout — a classic desktop scrollbar occupies real horizontal space, so a centred page shifts sideways the moment a dialog sets `overflow: hidden` on `body`; `scrollbar-gutter: stable` reserves the space; interviewers ask why the page "jumps" when a modal opens
- `overflow-wrap: break-word` and `word-break` — force a long unbroken string (a URL, an email, a German compound noun) to wrap instead of blowing out of its container; interviewers show a broken card and ask why `overflow: hidden` is the wrong fix

## `auto` and intrinsic sizing
- `margin: 0 auto` only centres an element with a definite width — with `width: auto` the auto margins resolve to zero and nothing moves; the single most reused CSS screening puzzle
- Absolute centring with `inset: 0; margin: auto` — auto margins on an absolutely positioned box with opposite offsets and a fixed size split the leftover space on both axes; interviewers ask for a way to centre without flexbox
- `width: auto` resolves differently by formatting context — a block fills its containing block, while a float, an inline-block, or an absolutely positioned box shrinks to fit its content; a candidate who says "auto means full width" is caught here
- `min-content`, `max-content` and `fit-content` — size a box from its content rather than its container; the vocabulary that explains *why* the flex and grid overflow bugs happen rather than just how to patch them
- Block formatting context — a container whose height collapses around floated children, or whose child's margin escapes it, is fixed by establishing a BFC with `overflow: hidden` or `display: flow-root`; the follow-up to the margin-collapsing question

## Shorthand properties
- A shorthand resets every longhand it omits to its initial value — `background: red` written after `background-image` silently deletes the image; interviewers show the two lines in that order and ask what renders
- `font` shorthand — sets style, variant, weight, size, line-height and family at once and resets any of them not listed, which is why `font: 16px Arial` silently kills a previously declared `font-weight: bold`
- Margin and padding value order — one, two, three and four values map to all sides / vertical-horizontal / top-horizontal-bottom / clockwise from top; interviewers read out `margin: 10px 20px 30px` and ask for the left margin
- `border` shorthand and `currentColor` — omitting the colour makes the border take the element's `color`, which is how a border changes on `:hover` without being restated
- A later shorthand replaces the whole set rather than merging — adding `transition: color .3s` cancels an earlier `transition: all .2s` instead of adding to it

## Transitions and animations
- `transition` — smooth change for a specific property on state change; always place it on the base element, not on `:hover`, so it runs in both directions; putting it on `:hover` makes the exit instant — a classic interview trap
- `transition: all` — animates every property including layout ones, causing jank and unintended animations; reviewers expect an explicit property list
- Not every property is interpolatable — `height: auto` and `display` cannot be transitioned, so the rule silently does nothing; the reason `max-height`, `opacity` + `visibility`, or `grid-template-rows: 0fr → 1fr` are used instead
- `transform` — `translateX/Y`, `scale`, `rotate` change visual appearance without affecting layout; other elements do not shift; fast because the browser handles it on the GPU without recalculating the page
- `transform` vs `top/left` for movement — animating `top` or `left` triggers a full layout recalculation every frame; `transform: translate()` does not; interviewers ask which is more performant and why — a confusable pair
- `@keyframes` and `animation` — multi-step animations; `animation-iteration-count: infinite` for loading spinners; `animation-fill-mode: forwards` keeps the final state after the animation ends instead of snapping back
- Animations sit above normal author declarations in the cascade — a running animation overrides a matching rule regardless of its specificity, which is why the element snaps back the instant the animation ends without `animation-fill-mode: forwards`
- `!important` is ignored inside `@keyframes` — the declaration is dropped rather than winning; a pressure question for candidates who claim `!important` always wins

## Typography
- `font-size` with `rem` — `px` ignores the user's browser font size preference and breaks accessibility; `rem` scales with the root setting; interviewers ask why a font size set in `px` is bad practice for accessibility
- `font-weight` numeric values — `400` (normal), `600` (semibold), `700` (bold); interviewers ask why numeric values are used instead of the keyword `bold`, and whether every font supports every weight
- Synthetic bold and italic — when the loaded font file lacks the requested weight or style the browser fakes it by smearing or slanting the glyphs, which is why declaring `600` does not mean a real `600` exists
- `line-height` unitless value — `1.5` means 1.5× the current font size; a unitless value scales correctly when font size changes; `line-height: 24px` breaks as soon as the font size changes
- `line-height: 1.5` vs `line-height: 150%` — the unitless value is inherited as a ratio and recomputed per child, while the percentage is computed once on the parent and inherited as a fixed length; the difference between inheriting a value and inheriting a computed value
- Text truncation — `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` must all be present; interviewers ask why removing any one of them breaks the effect and what each one does individually
- `-webkit-line-clamp` for multi-line truncation — truncates at N lines instead of one; the counterpart to the single-line ellipsis trio, and interviewers use the pair to check you know one-line truncation is not the general case
- `text-transform` — `capitalize` displays stored lowercase values (`'active'`) as `'Active'` without changing the data; `uppercase` for labels and badges; tested in code review questions about status display
- `font-family` fallback stack — listing several fonts (`'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`) so the browser falls back if the first font is not installed; the last value should always be a generic family (`sans-serif`, `serif`, `monospace`); interviewers ask why you never list just one font name

## CSS variables and design tokens
- `--variable-name` and `var()` — define a value once and reuse it everywhere; Angular Material uses CSS variables for its theme colours; change one variable and the whole UI updates
- `:root` vs component scope — declaring on `:root` makes the variable globally available; scoping to a specific selector limits it to that element's subtree; interviewers ask why Angular Material theming variables are declared on `:root`
- CSS variables inherit — redeclaring a variable on a container overrides it for that whole subtree, which is how `.card--danger { --color-primary: red }` themes one section without duplicating a single rule; the mechanism behind per-page theming
- CSS variables are live at runtime — a CSS variable can be changed by JavaScript with `element.style.setProperty('--name', value)`, enabling runtime theming without recompiling; hardcoded values cannot be changed this way; interviewers ask how you would implement a simple theme switcher
- `var()` with a fallback — `var(--primary, #e8572a)` uses the second argument when the variable is not defined; provides a safety net when customising Angular Material where some variables may not be set
- An undefined variable invalidates the whole declaration — `var()` is substituted at computed-value time, so a typo in the name does not fall back to the previous rule; the property resolves to its inherited or initial value instead, which is why one typo wipes a colour entirely
- Primitive tokens vs semantic tokens — a raw layer (`--blue-500`) referenced by a meaning layer (`--color-primary`) so a rebrand touches one declaration; interviewers at consultancies ask how you would structure variables for a design system rather than declaring colours ad hoc

## Colors and transparency
- Color formats: `hex`, `rgb()`, `hsl()` — `hex` is most common for fixed colors; `rgba()` adds transparency and is preferred for overlays and shadows; `hsl` makes color variations easy (just change the lightness value); interviewers ask which format to choose and why
- `opacity` vs `rgba` transparency — `opacity` affects the element AND all its children; `rgba` only affects the specific property it is applied to; classic interview question: "why does `opacity: 0.5` on a card fade the text too, but `background: rgba(0,0,0,0.5)` does not?"
- `rgba` for overlays and shadows — `rgba(0, 0, 0, 0.5)` for modal backgrounds, `rgba(0, 0, 0, 0.08)` for card shadows; `rgba` allows the shadow to blend with whatever background colour is beneath it, unlike a hex value
- `currentColor` — a keyword that resolves to the element's current `color` value; used to keep borders, icons, and SVG fills in sync with the text color without repeating the value

## Borders, shadows, and backgrounds
- `box-shadow` syntax: `offset-x offset-y blur spread color` — interviewers show a value like `0 4px 12px rgba(0,0,0,0.12)` and ask what each part controls; `spread` is optional and often omitted; color should always use `rgba`
- `border-radius: 50%` vs `border-radius: 9999px` — `50%` makes a circle but only when the element is square; `9999px` creates a pill shape at any aspect ratio; interviewers ask which one to use for an avatar vs a badge — a confusable pair
- `background-size: cover` vs `background-size: contain` — `cover` fills the element completely and may crop the image; `contain` fits the whole image and may leave empty space; `cover` is standard for hero sections and card backgrounds
- `object-fit: cover` — same fill-and-crop behaviour as `background-size: cover`, but applies to `<img>` elements in a fixed-size container; `background-size` is for background images, `object-fit` is for `<img>` tags — a confusable pair
- A background image reserves no space — an element carrying only a `background-image` has zero intrinsic size and collapses until content or an explicit height gives it one; the reason `background-image` is the wrong choice for a meaningful content image
- `outline` vs `border` — `outline` is drawn outside the border and occupies no layout space, so adding one on focus never shifts the surrounding elements the way a `border` does; interviewers ask which of the two belongs on a focus ring and why — a confusable pair
- `aspect-ratio` — locks an element's width-to-height ratio (`aspect-ratio: 16 / 9`) so it scales without distortion when only one dimension is known; replaces the older padding-percentage hack for responsive video and image containers; interviewers ask how you reserve space for an image before it loads to avoid layout shift

## Font and image loading
- FOUT vs FOIT — a flash of *unstyled* text versus a flash of *invisible* text while a web font downloads; a confusable pair, and interviewers ask which one the browser does by default and which one you should prefer
- `font-display: swap` — renders the fallback immediately and swaps when the web font arrives, trading a layout shift for text that is never invisible; interviewers ask what that tradeoff costs the user
- Font metric mismatch — the fallback and the web font have different character widths and line heights, so the whole page reflows on swap; the reason the fallback stack is chosen for metric similarity rather than merely "a font that exists"
- The layout shift caused by the font swap — when the fallback is replaced by the web font the whole page reflows, which is what `font-display: swap` trades against text being invisible; interviewers ask why "just use `swap`" is not automatically the right answer
- `width` and `height` attributes on `<img>` — modern browsers derive an aspect ratio from them and reserve the space before the image arrives, even when CSS controls the final size; the reason "just size it in CSS" is the wrong answer for images

## CSS functions
- `calc()` — mixes different units in one expression; `calc(100% - 64px)` subtracts a fixed header height from the full viewport; spaces around `+` and `-` are required; interviewers ask when `calc()` is necessary and why neither pure percentage nor pure `px` can solve the same problem
- `clamp(min, preferred, max)` — creates a value that scales fluidly between limits; `font-size: clamp(1rem, 2.5vw, 2rem)` replaces multiple breakpoint overrides for font size; tested because it signals modern CSS knowledge
- `min()` and `max()` — `min(100%, 600px)` is equivalent to `max-width: 600px; width: 100%`; `max(1rem, 5%)` ensures a minimum even when using a relative unit; useful for containers that should be fluid on mobile and capped on desktop

## Naming and stylesheet organisation
- Block, element (`__`), modifier (`--`) — `.card`, `.card__title`, `.card--featured`; a naming convention that makes class names predictable in global stylesheets; interviewers at consultancies ask about CSS organisation because shared CSS becomes unmaintainable without a convention
- Why BEM keeps specificity low — each rule is a single class selector (`0-1-0`); nested selectors like `.card .card__title` raise specificity and become hard to override; BEM avoids nesting in the CSS file
- The flat element rule — BEM elements never nest in the class name; even if `.card__body` contains a title, the class is `.card__title`, not `.card__body__title`; depth lives in the HTML, not in the class name — a common mistake when first learning BEM
- When BEM applies in Angular — Angular view encapsulation handles component isolation; BEM is still needed for global styles in `styles.css` and shared components in `shared/` where encapsulation does not help
- Utility classes vs component classes — utilities (`.mt-4`, `.flex`) are single-purpose and composed in the template while component classes (`.user-card__title`) name a thing and live in the stylesheet; interviewers hand you a file mixing both and ask you to name the two conventions and when each fits
- Where a shared style belongs — the decision chain runs component styles → shared component → global stylesheet → design token; interviewers ask where you would put a button style used by three features and expect a component, not a global class
- The vendor override file — a dedicated global file holding overrides of a third-party library's internals, isolated so an upgrade breaks in one known place rather than across every component
- Why overriding a library's internal classes is fragile — internal class names are not a public API and can change on any release; interviewers ask what breaks when you upgrade Angular Material after deep-styling its internals

## Changing shared CSS safely
- Blast radius of a shared class — a class in a global stylesheet is an unbounded public API, so `.card` has as many callers as there are templates referencing it and CSS offers no way to enumerate them; interviewers ask why editing a shared class is riskier than editing a component style
- Additive change over modification — adding a modifier class leaves existing usages untouched, whereas editing the base class changes all of them; interviewers ask how you introduce a variant without regressions
- The cost of a copy-pasted variant — duplicating `.btn` into `.btn-red` decouples it from every future fix to the base and doubles the maintenance; the trade-off against a modifier is a standard code-review question
- Dead CSS cannot be proven dead — CSS has no compiler or static reference check and class names can be composed at runtime, so nobody can be sure a rule is unused; interviewers ask why old rules accumulate and never get deleted
- Global stylesheet rot — global rules have unbounded scope, so every addition raises the chance of an unrelated regression; interviewers ask why a team forbids new global CSS and where the style should go instead
- Why a legacy codebase accumulates `!important` — it is the symptom of unreachable specificity (library styles, over-nested selectors, unclear source order), not laziness; interviewers ask you to diagnose the cause rather than condemn the keyword
- The specificity arms race — each override raises specificity, so the file becomes progressively harder to change; the way out is lowering the offending rule's specificity rather than raising yours
- The ordered ways to beat a rule without `!important` — later source order at equal specificity, an added class, a scoping ancestor, or fixing the offending rule itself; a decision question about which is least damaging
- Build-time purging removes classes it cannot see — a class name composed at runtime is stripped from the production bundle while working perfectly in development; a classic "works locally, breaks in prod" pressure question

## Browser defaults and cross-browser support
- Why a CSS reset exists — browsers ship different default margins, list styles, form-control appearance and font sizes, so identical markup renders differently across Chrome, Firefox and Safari; the point is predictability, not tidiness
- Reset vs normalize — a reset zeroes browser defaults outright while normalize keeps the sensible ones and only smooths the differences; interviewers ask which you chose for your project and why
- Form controls are the least stylable surface — `<select>`, checkboxes, date inputs and scrollbars are drawn by the OS or browser and largely resist CSS; interviewers ask why a designer's select box cannot be reproduced with CSS alone and what `appearance: none` buys you
- `@supports` feature queries — apply a rule only when the browser understands the property, so a modern feature degrades instead of breaking
- Declaration order as a fallback mechanism — writing the widely supported value first and the modern one immediately after means an old browser keeps the first and a new one takes the second, with no feature detection required; interviewers ask how you ship a new property safely without `@supports`
- Vendor prefixes are generated by the build — the Angular CLI's PostCSS step adds them from the project's `browserslist` target rather than you writing them by hand; interviewers check whether you know where the browser support target is actually configured
