# CSS — Interview Questions

## Box model

**What is `box-sizing: border-box` and why do you always add it at the top?**

By default, `width` in CSS does not include padding or border — so a `width: 200px` element with `padding: 20px` ends up 240px wide, which is confusing. `border-box` changes the calculation so padding and border are included inside the width. I always add it in the reset at the top of `styles.css` so every element behaves predictably.

> **Junior tip:** Mention that you add it to `*` in every project reset — it shows you have a consistent starting setup, not just theoretical knowledge.
> **Consejo de entrevista:** Menciona que lo añades en `*` en cada reset — demuestra que tienes una configuración de inicio consistente.

**What is a CSS reset and what does it fix?**

Browsers apply their own default styles — margins on headings, padding on lists, different font sizes. A reset removes them so the app looks the same in every browser. I always use `margin: 0; padding: 0; box-sizing: border-box` on `*` at the top of `styles.css`.

> **Junior tip:** If the interviewer asks what the default styles are, name two: `<h1>` has a large top and bottom margin, `<ul>` has left padding. That shows you know where the problem comes from.
> **Consejo de entrevista:** Si preguntan qué estilos por defecto existen, nombra dos: `<h1>` tiene margin, `<ul>` tiene padding izquierdo.

**Why do you apply the reset to `*, *::before, *::after` instead of just `*`?**

Because `*` only selects real DOM elements — pseudo-elements like `::before` and `::after` are not matched by `*` alone. Without the extra selectors, generated content from pseudo-elements inherits the browser's default `box-sizing: content-box` and can behave differently. Adding `*::before, *::after` makes the reset consistent for everything on the page.

Red flag answer: "I just use `*` — same thing." — It is not. If you use `::before` for decorative lines or the CSS spinner, those pseudo-elements would have a different box model than the rest of the page.

---

## CSS variables

**What are CSS custom properties and why do you use them?**

Variables you define once and reuse anywhere — `--primary: #e8572a` in `:root`, then `color: var(--primary)` everywhere. If the design changes, you update one line. I use them in every project for colors, spacing, and shadows so I never have magic numbers scattered across the file.

> **Junior tip:** Say "CSS custom properties" in the interview — that is the formal name. "CSS variables" is fine informally, but knowing the formal name signals deeper understanding.
> **Consejo de entrevista:** Di "CSS custom properties" en la entrevista — ese es el nombre formal.

**What is `:root` and why do you declare variables there?**

`:root` is the highest-level element in the page — equivalent to `html` but with higher specificity. Variables declared there are global and available to every element. If you declare them inside a component or class, they only work inside that scope.

> **Junior tip:** Point out the scoping behaviour — you can override a variable by re-declaring it inside a class. This is how you create context-specific themes.
> **Consejo de entrevista:** Menciona que puedes sobrescribir una variable redeclarándola dentro de una clase para crear temas específicos.

**Why did you use CSS variables for colors instead of writing hex values directly?**

Because in every project I have 10–15 places using the same color. If the design changes from `#e8572a` to a slightly different orange, without variables you chase every rule manually and miss some. With `--primary: #e8572a` in `:root`, you change one line and every element updates. I also use them for shadows and borders — `var(--shadow)` is more readable than `rgba(0,0,0,0.08)` written in 20 places.

Red flag answer: "It is best practice." — That says nothing. You need to explain what breaks without variables and why that is a real problem in a project.

---

## Flexbox

**What is the difference between `justify-content` and `align-items`?**

`justify-content` controls alignment on the main axis — horizontal by default. `align-items` controls the cross axis — vertical by default. The axes flip when you use `flex-direction: column`. I use `justify-content: space-between` in navbars to push items to each side, and `align-items: center` almost everywhere to vertically center content.

> **Junior tip:** The axis flip with `flex-direction: column` is the number one flexbox trap in interviews. State it proactively: "When direction is column, justify becomes vertical and align becomes horizontal."
> **Consejo de entrevista:** El intercambio de ejes con `flex-direction: column` es la trampa más común en entrevistas. Menciónalo de forma proactiva.

**What does `flex: 1` do?**

It tells the element to grow and fill all available space in the flex container. In a search bar with an input and a button side by side, `flex: 1` on the input makes it fill the remaining space after the button takes its natural width.

> **Junior tip:** `flex: 1` is shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 0`. Knowing the longhand makes you look like you understand the mechanism, not just the shortcut.
> **Consejo de entrevista:** `flex: 1` es abreviatura de `flex-grow: 1; flex-shrink: 1; flex-basis: 0`. Conocer la forma larga demuestra comprensión real.

**When do you choose flexbox instead of grid?**

Flexbox is for one-dimensional layouts — a row of buttons, a navbar, a search bar, a card's internal layout. Grid is for two-dimensional layouts — a grid of cards, a page with sidebar and content, a form with two columns. If everything sits in a single row or column, flexbox is simpler.

Red flag answer: "I use flexbox for everything." — That works until you need rows and columns aligned together. Knowing when each tool fits shows you understand layouts, not just syntax.

**What is `flex-shrink` and when do you set it to `0`?**

`flex-shrink` controls how much a flex item shrinks when there is not enough space. The default is `1` — all items shrink proportionally. Set it to `0` when you want an item to keep its fixed size: for example, an icon or button next to a `flex: 1` input — the input shrinks and grows, but the button never changes size.

> **Junior tip:** A button that shrinks and becomes too small to click is a classic flexbox bug in production. `flex-shrink: 0` on the button is the fix.
> **Consejo de entrevista:** Un botón que se encoge y queda demasiado pequeño para hacer clic es un bug clásico de flexbox. `flex-shrink: 0` es la solución.

**What is the `margin: auto` trick in flexbox?**

In a flex container, `margin-left: auto` on an item absorbs all remaining space on that side, pushing the item to the far right. It is the cleanest way to push a logout button to the end of a navbar without using `justify-content: space-between`, which would affect all items. In project 06, I used this to separate the navigation links from the toolbar actions.

> **Junior tip:** Interviewers sometimes ask "how do you push one item to the end in flexbox without affecting others?" — `margin-left: auto` is the clean CSS-only answer.
> **Consejo de entrevista:** "¿Cómo empujas un elemento al final en flexbox sin afectar a los demás?" — `margin-left: auto` es la respuesta limpia.

**Why did you use `flex-shrink: 0` on the button next to the search input?**

Without it, when the container is narrow, both the input and the button shrink proportionally and the button becomes too small to read or click. With `flex-shrink: 0` on the button and `flex: 1` on the input, the button always keeps its natural width and the input fills the rest of the space. I use this pattern in the search bar in projects 02 and 04.

Red flag answer: "I gave the button a fixed `width`." — A fixed pixel width breaks at different font sizes and different button labels. The `flex-shrink: 0` approach is correct and adapts naturally.

---

## CSS Grid

**What does `grid-template-columns: 1fr 1fr` do?**

It creates two columns that each take an equal share of the available space. `1fr` means "one fraction of the free space". I use it for two-column form layouts inside dialogs — two fields side by side.

> **Junior tip:** `1fr` is only available inside grid — it does nothing outside of `grid-template-columns` or `grid-template-rows`. That distinction often comes up when people try to use `fr` in padding or margin.
> **Consejo de entrevista:** `1fr` solo funciona dentro de grid — no hace nada fuera de `grid-template-columns` o `grid-template-rows`.

**What does `grid-column: 1 / -1` do?**

It makes an element span from the first column to the last, regardless of how many columns there are. I use it on the description field in a two-column form so it takes the full width, and on the action buttons row.

> **Junior tip:** The `-1` is a negative line number — it always means "the last grid line". This is more robust than writing `1 / 3` because it works even if you change the number of columns later.
> **Consejo de entrevista:** El `-1` es un número de línea negativo — siempre significa "la última línea del grid". Es más robusto que escribir `1 / 3`.

**What is `repeat(auto-fill, minmax(250px, 1fr))` and why is it useful?**

It creates as many columns as fit in the container, each at least 250px wide. On a wide screen you get 4 columns; on a tablet 2 or 3; on mobile just 1 — with no media queries needed. It is the simplest way to build a responsive card grid.

> **Junior tip:** Know the difference with `auto-fit`: `auto-fill` keeps empty columns at the minimum size, `auto-fit` collapses them so existing items stretch to fill. For card grids with consistent card sizes, `auto-fill` is usually correct.
> **Consejo de entrevista:** Conoce la diferencia con `auto-fit`: `auto-fill` mantiene columnas vacías, `auto-fit` las colapsa y estira los elementos existentes.

**When do you choose grid instead of flexbox?**

When you need control over both rows and columns at the same time. A card grid, a dashboard with panels, or a form where fields align both horizontally and vertically — grid handles all of those cleanly. Flexbox would require nesting and workarounds.

Red flag answer: "I use grid for everything because it's more powerful." — Grid is more complex. Flexbox is simpler for one-dimensional work and the right tool when you only have a row or column.

**What is the difference between `auto-fill` and `auto-fit`?**

Both create as many columns as fit the container. The difference shows when there are fewer items than columns: `auto-fill` keeps the empty columns — items stay at their minimum size. `auto-fit` collapses the empty columns — existing items stretch to fill the full width. For card grids where you want consistent card sizes, `auto-fill` is usually better.

> **Junior tip:** This is a detail that tests whether you have built real responsive grids or just copied code. Prepare a visual mental model: `auto-fit` stretches items, `auto-fill` leaves gaps.
> **Consejo de entrevista:** Este detalle prueba si realmente has construido grids responsivos. Prepara un modelo visual: `auto-fit` estira, `auto-fill` deja huecos.

**You need a responsive card grid without media queries. What CSS do you write?**

`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` with a `gap`. This creates as many columns as fit the container, each at least 280px wide. On a wide screen you get 4 columns, on tablet 2–3, on mobile just 1 — no media queries needed. I use this in the meal finder and task manager.

Red flag answer: "I use media queries to set the column count at each breakpoint." — That works but it is the old approach and breaks when the container width changes (like inside a sidebar layout). The auto-fill pattern adapts to any container.

**Why do you use `grid-template-columns: 1fr auto 1fr` for a centered title with a button on the right?**

Because `text-align: center` on the title only centers it within its own column — as soon as you add a button on the right side, the title shifts left. With `1fr auto 1fr`, the left and right columns are equal, so the middle column with the title is always truly centered regardless of what is on the right. I use this pattern in the HR portal dashboard header where I needed a centered title and a "View all" link aligned to the right.

Red flag answer: "I use `text-align: center` on the heading." — That only works when the heading is alone. Add anything to the right and it breaks.

---

## Positioning

**What is the difference between `position: relative` and `position: absolute`?**

`relative` keeps the element in the normal flow but lets you offset it with `top`, `left`, etc. More importantly, it creates a positioning context for `absolute` children. `absolute` removes the element from the flow and positions it relative to its nearest ancestor with `position: relative`. I use this pattern for badges — the card gets `position: relative`, the badge gets `position: absolute; top: 0.75rem; right: 0.75rem`.

> **Junior tip:** In practice, you almost never visually offset a `relative` element. Its real job is to be the anchor for `absolute` children. Say this — it shows you understand the purpose, not just the property.
> **Consejo de entrevista:** En la práctica, casi nunca desplazas visualmente un elemento `relative`. Su función real es ser el ancla para hijos `absolute`.

**What is `position: fixed` and when do you use it?**

It fixes the element to the viewport — it does not scroll with the page. I use it for modal overlays: `position: fixed; inset: 0` covers the entire screen and stays there while the user scrolls.

> **Junior tip:** Know that `inset: 0` is shorthand for `top: 0; right: 0; bottom: 0; left: 0`. Using `inset` shows you know modern CSS.
> **Consejo de entrevista:** `inset: 0` es la abreviatura de `top: 0; right: 0; bottom: 0; left: 0`. Usarlo demuestra conocimiento de CSS moderno.

**What is `position: sticky` and when is it useful?**

The element scrolls normally until it reaches a set position, then sticks there. I use it for table headers — `position: sticky; top: 0` so the header stays visible as the user scrolls through a long list.

> **Junior tip:** One gotcha: `sticky` only sticks within its parent container. If the parent is smaller than the viewport, the element stops sticking when the parent scrolls out of view. Also, always add a `background-color` — otherwise the page content scrolls visibly behind the stuck element.
> **Consejo de entrevista:** Gotcha: `sticky` solo funciona dentro de su contenedor padre. Además, siempre añade `background-color` — si no, el contenido de la página se ve a través del elemento fijo.

**What is `z-index` and when do you need it?**

It controls which element appears on top when elements overlap. Higher value = on top. It only works on elements with a `position` other than `static`. I use a defined scale: 100 for navbars, 200 for dropdowns, 1000 for modals, 9999 for tooltips — never random large numbers.

> **Junior tip:** Random large numbers like `z-index: 99999` are a smell. A stacking context can neutralise any z-index value. Knowing this — that z-index only works within the same stacking context — separates you from juniors who debug by trial and error.
> **Consejo de entrevista:** Los números grandes aleatorios como `z-index: 99999` son una señal de alerta. Saber que z-index solo funciona dentro del mismo stacking context te diferencia.

**Why did you use `position: absolute` for the badge overlay instead of margin or padding?**

Because margin and padding change the document flow — they push other elements around and change the card height. For an overlay that should appear on top of content without affecting the card layout, `position: absolute` is correct — it removes the element from the flow entirely. The card gets `position: relative` as the anchor and the badge positions itself precisely inside it. I use this in project 04 for the favourite star that overlaps the meal image.

Red flag answer: "I used negative margin." — Negative margin is a hack that makes the layout fragile. `position: absolute` is the correct tool for this pattern.

**The HR portal has a fixed toolbar and sidebar with only the content area scrolling. How did you implement that?**

The key was `overflow: hidden` on the `app-root` flex container. Without it, the browser lets flex items grow beyond their allocated height and the whole page scrolls. With it, only `mat-sidenav-content` scrolls internally. I also needed `html, body { height: 100% }` to give the shell a fixed reference height, and `min-height: 0` on the sidenav container to stop the default flex stretch behaviour from breaking the layout.

Red flag answer: "I used `position: fixed` on the toolbar." — That works for the toolbar alone but then you need padding hacks everywhere to compensate for the toolbar height. The height and overflow pattern on the shell is the clean solution.

---

## Responsive design

**What is mobile-first and why is it the recommended approach?**

You write the base styles for mobile first, then add media queries with `@media (min-width)` to adjust the layout for larger screens. It is recommended because it forces you to start with the essential layout and add complexity only when there is space for it — the result is cleaner and loads faster on mobile.

> **Junior tip:** The key word in "mobile-first" is that the base styles have no media query. Explain it as: "Mobile is the default. Desktop is an override." That is a clean mental model.
> **Consejo de entrevista:** La clave es que los estilos base no tienen media query. Explícalo como: "Móvil es el valor por defecto. Escritorio es una sobreescritura."

**What is a media query?**

A block of CSS that only applies when a condition is true — usually the screen width. `@media (min-width: 768px)` targets tablets and above. I use two main breakpoints: `768px` for tablet, `1024px` for desktop.

> **Junior tip:** You can also combine conditions: `@media (min-width: 768px) and (max-width: 1023px)` targets only tablet. Useful for debugging specific screen sizes.
> **Consejo de entrevista:** También puedes combinar condiciones: `@media (min-width: 768px) and (max-width: 1023px)` se aplica solo en tablet.

**When would you use `clamp()` instead of a media query for font sizes?**

When the size should scale smoothly with the viewport rather than jumping at a breakpoint. With a media query, the heading jumps from `1.5rem` to `2.5rem` at exactly 768px. With `clamp(1.5rem, 4vw, 2.5rem)`, it grows proportionally from `1.5rem` to `2.5rem` as the screen widens — no sudden jump. I use media queries for layout changes (one column to two) and `clamp()` for font sizes and padding where a smooth transition looks better.

Red flag answer: "I always use media queries." — That is not wrong, but it shows you do not know when the simpler tool works better.

---

## Animations and transitions

**What does `transform` do and why is it preferred for animations?**

`transform` moves, scales, or rotates an element without affecting the document flow — `translate(-50%, -50%)` for centering, `scale(1.05)` for hover growth, `rotate(45deg)` for icons. The key reason to prefer it over changing `top`/`left` or `margin` is performance — `transform` is GPU-accelerated and does not trigger layout recalculation, so animations stay smooth even on lower-end devices.

> **Junior tip:** "GPU-accelerated" is the answer to "why is transform faster?" The browser can offload it to the graphics card instead of recalculating the whole page layout.
> **Consejo de entrevista:** "GPU-accelerated" es la respuesta a "¿por qué transform es más rápido?" El navegador puede procesarlo en la tarjeta gráfica sin recalcular el layout.

**What is the difference between `transition` and `@keyframes animation`?**

`transition` is for simple state changes — hover effects, showing/hiding an element. You define start and end, CSS handles the movement. `@keyframes` is for more complex animations that loop or have multiple steps — like a loading spinner. I use `transition` for card hover effects and `@keyframes` for the CSS spinner.

> **Junior tip:** A quick rule: if the animation needs to loop forever (`infinite`), use `@keyframes`. If it plays once in response to a state change, use `transition`.
> **Consejo de entrevista:** Regla rápida: si la animación necesita repetirse indefinidamente, usa `@keyframes`. Si se reproduce una vez en respuesta a un cambio de estado, usa `transition`.

**Why do you put `transition` on the base element and not on `:hover`?**

If you put it on `:hover`, the animation only plays when entering the hover state — leaving hover is instant. If you put it on the base element, the transition plays in both directions smoothly. I discovered this in project 01 and have followed this rule in every project since.

Red flag answer: "I put it on `:hover` — I did not notice the difference." — This is a CSS interview classic. Not knowing it means you probably did not test the reverse direction.

---

## Typography

**What is the difference between `rem` and `px`?**

`px` is a fixed size. `rem` is relative to the root font size — by default `1rem = 16px`. Using `rem` for font sizes respects the user's browser font size preference, which matters for accessibility. I use `rem` for everything: `1rem` for body text, `1.5rem` for headings, `0.875rem` for small labels.

> **Junior tip:** If an interviewer asks about accessibility in CSS, `rem` for font sizes is your first answer. Users who set a larger browser font do so for a reason — ignoring it by using `px` breaks their experience.
> **Consejo de entrevista:** Si preguntan sobre accesibilidad en CSS, `rem` para tamaños de fuente es tu primera respuesta.

**How do you cut long text with `...` in CSS?**

Three properties together: `white-space: nowrap` to keep text on one line, `overflow: hidden` to hide what goes outside the container, and `text-overflow: ellipsis` to add the `...`. The container also needs a fixed or maximum width — otherwise there is nothing to overflow.

> **Junior tip:** All three are required. `text-overflow: ellipsis` only draws the `...` — it does not do the clipping. `overflow: hidden` does the actual clipping. If you only add `ellipsis` and forget `overflow: hidden`, nothing changes.
> **Consejo de entrevista:** Las tres propiedades son necesarias. `text-overflow: ellipsis` solo dibuja los `...` — no hace el recorte. `overflow: hidden` hace el recorte real.

---

## Units

**What is the difference between `rem` and `em`?**

`rem` is always relative to the root font size (`1rem = 16px` by default) — it is consistent and predictable. `em` is relative to the parent's font size, which compounds through nesting and becomes hard to track. I use `rem` for everything: font sizes, padding, gap. `em` is rarely needed.

> **Junior tip:** The compounding of `em` is a trap. A component with `font-size: 1.5em` inside a parent that already has `font-size: 1.5em` ends up at 2.25x the root size. `rem` always resets to the root.
> **Consejo de entrevista:** El apilamiento de `em` es una trampa. Usa `rem` por defecto y solo `em` cuando explícitamente quieres escalar con el font-size del padre.

**When do you use `vh` and `vw`?**

When you need a size relative to the viewport, not the parent. `100vh` fills the full screen height — I use it on full-page layouts like the login page and the sidenav container. `vw` is less common but useful with `clamp()` for fluid font sizes.

> **Junior tip:** `min-height: 100vh` is safer than `height: 100vh` for pages with variable content. `height: 100vh` clips overflow; `min-height: 100vh` grows with the content.
> **Consejo de entrevista:** `min-height: 100vh` es más seguro que `height: 100vh` para páginas con contenido variable. `height` recorta el desbordamiento; `min-height` crece con el contenido.

**What is `fr` and where does it only work?**

`fr` means "fraction of the available free space" and only works inside CSS Grid. `1fr 1fr` creates two equal columns; `250px 1fr` creates a fixed sidebar with a fluid content area. Outside of `grid-template-columns` or `grid-template-rows`, `fr` does nothing.

> **Junior tip:** People sometimes try to use `fr` in `width` or `padding` — it does not work there. If you get asked "what units can you use in `width`?", the answer is `fr` only inside grid.
> **Consejo de entrevista:** La gente a veces intenta usar `fr` en `width` o `padding` — no funciona ahí. `fr` solo existe dentro de grid.

**How do you decide between `rem` and `px` for spacing like padding or gap?**

`rem` for all spacing that should scale with the user's font size preference — padding, margin, gap. `px` only for things that should always be the same visual weight regardless of font size — borders (`1px`), border-radius (`8px`), box-shadow blur. The mental rule: if changing the browser base font from 16px to 20px should scale this value, use `rem`. If not, use `px`.

Red flag answer: "I use `px` because it is easier to calculate." — That ignores users with accessibility font size settings.

---

## Colors and opacity

**What is the difference between `opacity` and `rgba`?**

`opacity` makes the entire element transparent — the element, its text, its borders, and all its children fade together. `rgba` only makes the background color transparent — the text inside stays fully opaque. I use `rgba` for overlays and shadows, and `opacity` for disabled states where I want everything to fade.

> **Junior tip:** The common mistake is using `opacity` on an overlay. That makes the modal content transparent too, which is not what you want. `background-color: rgba(0,0,0,0.5)` is correct for overlays.
> **Consejo de entrevista:** El error común es usar `opacity` en un overlay. Eso hace que el contenido del modal también sea transparente. `rgba` en el background es lo correcto.

**What is `currentColor`?**

A CSS keyword that refers to the element's own `color` value. Useful when you want a border or icon to automatically match the text color — `border: 1px solid currentColor` updates itself whenever `color` changes.

> **Junior tip:** This is useful for icons that should match their surrounding text. Set `color` on the parent, and the icon inherits it automatically via `currentColor`.
> **Consejo de entrevista:** Es útil para iconos que deben coincidir con el texto circundante. Establece `color` en el padre y el icono lo hereda automáticamente.

**When would you use `opacity` vs `rgba` to make something transparent?**

`rgba` when you only want the background to be transparent — for overlays, shadows, or a frosted panel where the text should stay fully visible. `opacity` when you want the entire element and all its children to fade — for a disabled button where the text, background, and border all fade together. Using `opacity` on an overlay would also make the modal content transparent, which is a common mistake.

Red flag answer: "They're interchangeable." — They are not. One affects only the color; the other affects the whole element including children.

---

## Selectors

**What is the difference between `.parent .child` and `.parent > .child`?**

`.parent .child` (descendant) matches any `.child` at any depth inside `.parent`. `.parent > .child` (direct child) only matches `.child` elements that are immediately inside `.parent`, not grandchildren. I use the direct child selector when I want to avoid accidentally styling nested components.

> **Junior tip:** The direct child selector is useful in Angular when a global style could leak into a deeply nested component. Using `>` keeps the scope intentional.
> **Consejo de entrevista:** El selector de hijo directo es útil en Angular para evitar que un estilo global se filtre a componentes anidados profundamente.

**What is the difference between a pseudo-class and a pseudo-element?**

Pseudo-classes (single colon: `:hover`, `:focus`, `:nth-child`) target an element based on its state or position. Pseudo-elements (double colon: `::before`, `::after`, `::placeholder`) target a specific part of an element or insert generated content. The double colon is the modern convention — it distinguishes the two clearly.

> **Junior tip:** The double colon `::` is the modern syntax for pseudo-elements. Some older code uses `:before` with a single colon — that still works for backwards compatibility, but `::before` is correct.
> **Consejo de entrevista:** El doble dos puntos `::` es la sintaxis moderna para pseudo-elementos. El código antiguo usa `:before` con un colon — sigue funcionando, pero `::before` es lo correcto.

---

## Specificity

**How does CSS decide which rule wins when two rules target the same element?**

By specificity score: ID selectors score 100, class/attribute/pseudo-class selectors score 10, and element selectors score 1. The rule with the highest total wins. If scores are equal, the one that appears later in the file wins. In practice: a class beats an element, an ID beats a class.

> **Junior tip:** Avoid ID selectors in your own CSS — they are very hard to override (you need another ID or `!important`). Classes only is the standard approach.
> **Consejo de entrevista:** Evita selectores ID en tu propio CSS — son muy difíciles de sobrescribir. Solo clases es el enfoque estándar.

**Why should you avoid `!important`?**

It overrides all specificity rules, which makes the CSS impossible to reason about — you cannot predict which rule wins by reading the code. Once you use it, the only way to override it is another `!important`. I only use it to fight third-party library styles that I cannot reach any other way.

> **Junior tip:** If you see `!important` in a codebase, it is almost always a sign that someone did not understand specificity and added it as a quick fix. The real fix is restructuring the selectors.
> **Consejo de entrevista:** Si ves `!important` en un codebase, casi siempre es señal de que alguien no entendió la especificidad. El fix real es reestructurar los selectores.

---

## BEM

**What is BEM and what problem does it solve?**

A naming convention — Block, Element, Modifier. Blocks are standalone components (`.card`), elements are parts of a block (`.card__title`), and modifiers are variations (`.card--featured`). It solves specificity and naming inconsistency — every rule is a single class, so specificity stays at `0-1-0` everywhere and class names are predictable.

> **Junior tip:** BEM appears in many legacy enterprise codebases in Spain. Knowing it and being able to read it matters, even if you do not write it every day in Angular.
> **Consejo de entrevista:** BEM aparece en muchas bases de código enterprise en España. Saber leerlo importa, aunque no lo uses a diario en Angular.

**Why is BEM less necessary in Angular?**

Angular's component encapsulation scopes CSS automatically — `.card` in one component cannot affect `.card` in another. BEM was invented to solve the global-scope problem that Angular already handles. I still use BEM conventions in global `styles.css` and shared components where there is no encapsulation.

Red flag answer: "I do not use BEM because Angular handles it." — Partially right, but incomplete. Angular encapsulates component styles, not global styles. BEM is still useful in `styles.css` and shared utilities.

---

## Borders and shadows

**What is the difference between `border` and `outline`?**

`border` is part of the box model — it takes up space and affects layout. `outline` sits outside the border and takes no space. Browsers add a default `outline` on focused elements for accessibility — if you remove it with `outline: none`, you must add a visible custom focus style, otherwise keyboard users cannot see where they are.

> **Junior tip:** Never remove `outline` without replacing it. Use `outline: none` only on elements where you add a custom `:focus-visible` style. This is an accessibility requirement, not just a preference.
> **Consejo de entrevista:** Nunca elimines `outline` sin reemplazarlo. Añade un estilo `:focus-visible` personalizado. Es un requisito de accesibilidad.

**What does `box-shadow` look like and what are the key values?**

`box-shadow: offset-x offset-y blur spread color`. For example: `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` — no horizontal offset, 4px down, 12px soft blur, semi-transparent black. I always use `rgba` for the color so the shadow is transparent. Adding `inset` makes the shadow appear inside the element.

> **Junior tip:** The most commonly forgotten value is `spread`. Most real shadows look better with `spread: 0` (or omitted) — adding positive spread makes the shadow look painted rather than natural.
> **Consejo de entrevista:** El valor más olvidado es `spread`. La mayoría de las sombras reales quedan mejor sin `spread` — añadir spread positivo hace que parezca pintada.

**When do you use `border-radius: 9999px` instead of `50%`?**

Use `50%` for a perfect circle, but only when the element is square — if the element is not square, `50%` gives an oval. For pill shapes (buttons, badges with padding), use `9999px` — it always gives a clean pill regardless of the element's width-to-height ratio, because the browser clamps the actual radius to what fits.

Red flag answer: "I use `50%` for everything rounded." — That only works for circles. For badges and buttons, `9999px` is the correct trick.

---

## Backgrounds

**What is the difference between `background-size: cover` and `contain`?**

`cover` fills the container completely — the image may be cropped but there are no empty spaces. `contain` fits the whole image inside the container — no cropping but may leave empty space on the sides. I use `cover` for card images and hero sections where a cropped image is better than empty space.

> **Junior tip:** Always pair `background-size: cover` with `background-position: center` so the crop is centered on the image rather than starting from the top-left corner.
> **Consejo de entrevista:** Siempre combina `background-size: cover` con `background-position: center` para que el recorte sea centrado.

**What is `object-fit` and when do you use it?**

It controls how an `<img>` fills its container when the image and container have different aspect ratios. `object-fit: cover` fills the container and crops if needed — the same behaviour as `background-size: cover` but for `<img>` elements. I use it on card images with a fixed height: the image always fills the space without stretching.

> **Junior tip:** Always give the `<img>` a fixed `height` when using `object-fit: cover` — without a height constraint, the image expands to its natural height and `object-fit` has nothing to crop.
> **Consejo de entrevista:** Siempre da una `height` fija al `<img>` al usar `object-fit: cover` — sin restricción de altura, la imagen se expande a su tamaño natural.

**When would you choose `object-fit: cover` over `background-size: cover`?**

Use `object-fit: cover` when the image is semantic content — card thumbnails, user avatars, product photos. Use `background-size: cover` when the image is purely decorative — hero section backgrounds, section dividers. The reason matters for accessibility: `<img>` elements support `alt` text for screen readers; `background-image` does not.

Red flag answer: "They look the same, I use whichever." — They achieve a similar visual result, but one is for content (HTML, accessible), one is for decoration (CSS, not accessible). Picking wrong is a semantic mistake.

---

## CSS functions

**What does `calc()` do and why is it useful?**

It calculates a CSS value using math — and crucially, you can mix different units. `width: calc(100% - 250px)` means "full width minus the sidebar". Without `calc()`, you cannot subtract pixels from a percentage in CSS.

> **Junior tip:** Always put spaces around `+` and `-` in `calc()`. `calc(100% - 20px)` works; `calc(100%-20px)` does not. This is a spec requirement, not a style preference.
> **Consejo de entrevista:** Siempre pon espacios alrededor de `+` y `-` en `calc()`. Es un requisito de la especificación, no una preferencia de estilo.

**What does `clamp()` do?**

It locks a value between a minimum and maximum, with a fluid preferred value in the middle — `clamp(1rem, 2.5vw, 2rem)`. The value grows with the viewport but never goes below `1rem` or above `2rem`. I use it for fluid typography and spacing without needing media queries.

> **Junior tip:** Think of `clamp(min, preferred, max)` as a value with guard rails. The `preferred` is what you want — usually a viewport-relative unit like `vw`. The `min` and `max` are the limits.
> **Consejo de entrevista:** Piensa en `clamp(min, preferred, max)` como un valor con límites. El `preferred` es lo que quieres — normalmente una unidad relativa al viewport.

---

## Display and layout

**What is the difference between `inline`, `block`, and `inline-block`?**

`block` takes the full width of the container and always starts on a new line — `<div>`, `<p>`, `<h1>`. `inline` sits in line with text and only takes as much width as its content — `<span>`, `<a>`. Inline elements ignore `width`, `height`, and vertical `margin`. `inline-block` is a hybrid — it sits in the text flow but respects width, height, and vertical margin. I use it on `<a>` or `<span>` when I need vertical padding on an inline element.

> **Junior tip:** The classic gotcha: adding `padding-top` to an `<a>` tag and it not working. The fix is `display: inline-block` — that unlocks vertical margin and padding on inline elements.
> **Consejo de entrevista:** El gotcha clásico: añadir `padding-top` a un `<a>` y que no funcione. El fix es `display: inline-block`.

**What is the difference between `display: none` and `visibility: hidden`?**

Both hide the element visually, but `display: none` removes it from layout entirely — the space it occupied collapses and other elements move to fill it. `visibility: hidden` keeps the space reserved — the element is invisible but other elements stay in place. I use `visibility: hidden` when I want to hide an action button on hover without shifting the row height.

> **Junior tip:** A third option is `opacity: 0` — the element is invisible but still takes space and is still clickable (unlike `visibility: hidden`). Useful for fade-in animations where you want the space preserved before the element appears.
> **Consejo de entrevista:** Una tercera opción es `opacity: 0` — el elemento es invisible, mantiene el espacio y sigue siendo clicable. Útil para animaciones de fade-in.

**How do you center an element both vertically and horizontally?**

Two common approaches. With flexbox: `display: flex; align-items: center; justify-content: center` on the parent — the simplest option for most layouts. With absolute positioning: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`. The `top: 50%` moves the element's top edge to the middle of the parent, then `translate(-50%, -50%)` moves it back by half its own size so the center aligns with the parent's center.

> **Junior tip:** The flexbox approach is what you should reach for first — it is simpler and does not require a `position: relative` parent. The absolute positioning approach is for centering inside a positioned container (like a loading spinner inside a card).
> **Consejo de entrevista:** El enfoque con flexbox es el que debes usar primero — es más simple. El posicionamiento absoluto es para centrar dentro de un contenedor posicionado.

**What is `overflow` and what are the most common values?**

`overflow` controls what happens when content is larger than its container. The four values: `visible` (default, content shows outside), `hidden` (clips the content), `auto` (adds a scrollbar only when needed), `scroll` (always shows scrollbar). I use `overflow: hidden` on cards so images respect the `border-radius`, and `overflow: auto` on scrollable panels with a fixed max-height.

> **Junior tip:** `overflow: hidden` has a side effect: it also hides `position: absolute` children that go outside the container. If a dropdown inside a card is getting clipped, remove `overflow: hidden` from the card.
> **Consejo de entrevista:** `overflow: hidden` tiene un efecto secundario: también oculta hijos `position: absolute` que salen del contenedor. Si un dropdown se recorta, comprueba si hay `overflow: hidden` en el padre.

**When would you use `overflow: hidden` on a card element?**

When the card has an image at the top and a `border-radius`. Without `overflow: hidden`, the image corners stick out beyond the rounded card corners. With it, the image is clipped to the card shape. The card gets `border-radius: 8px; overflow: hidden` and the image fills the top naturally. I discovered this pattern in project 04 when meal images had sharp corners on an otherwise rounded card.

Red flag answer: "I give the image a matching `border-radius`." — That works for the top corners but you have to remember to update both values every time you change the card radius. One rule on the container is cleaner and more robust.

---

## Pressure

**The client says the app looks broken on mobile. You open DevTools. What do you check first?**

I open the responsive mode in DevTools and set the viewport to 375px — the most common small phone width. Then I check in order: whether the layout overflows horizontally (which usually means a fixed `px` width somewhere), whether text is too small to read (missing `rem` usage or viewport meta tag), and whether touch targets like buttons are at least 44px tall. Most mobile layout issues trace back to one of these three things.

**You inherit a CSS file with 15 `!important` declarations. What do you do?**

I do not touch them immediately — removing `!important` without understanding why it was added can break things silently. I read each one and figure out the underlying specificity conflict. Most of the time the fix is restructuring the selectors so the right rule wins naturally — adding a class, removing unnecessary nesting, or moving a rule to a more appropriate location. Then I remove them one by one with tests. The lesson is that `!important` is never the real fix — it is a symptom of a specificity problem that was not resolved properly.

**What CSS mistake have you made and how did you fix it?**

In the task manager I added a style targeting a Material component's internal element inside the component CSS and it had no effect. I spent time looking in the wrong place. Then I remembered Angular's view encapsulation — component CSS cannot reach inside Material components because those elements do not get the scoping attribute. I moved the rule to `styles.css` and it worked immediately. Now I always check whether the element is in my own template or rendered internally before deciding where to put the CSS.

Red flag answer: "I always check the browser until it works." — That is not debugging, that is guessing. The interviewer wants to see that you understand why something fails, not just that you found a fix by accident.

**The design team reports that a hover animation only plays when you mouse over the element, but snaps back instantly when you leave. What went wrong?**

The `transition` is on `:hover` instead of on the base element. When the transition is on `:hover`, the animation plays while entering the hover state, but when the mouse leaves, there is no transition to play — the element resets instantly. Moving `transition: transform 0.2s ease` to the base element fixes it — the browser plays the animation in both directions. I hit this in project 01 and have never put a transition on `:hover` since.

Red flag answer: "I would add a JavaScript event listener for mouseleave." — That is massively over-engineered for a one-line CSS fix.

**You are reviewing a junior's PR and their CSS has `z-index: 99999` on a tooltip. What do you say?**

I would explain that the problem is not the number — it is the lack of a system. `z-index` values only work relative to each other within the same stacking context. A stacking context is created by any positioned element with a `z-index` other than `auto`, so `z-index: 99999` inside one context can lose to `z-index: 1` in another. The fix is a defined scale: 100 for navbars, 200 for dropdowns, 1000 for modals, 9999 for tooltips — and to check that the tooltip is not trapped inside a low stacking context.

Red flag answer: "That is fine as long as it works." — Code that works by accident is not production code. The review exists to catch patterns that will cause problems when the project grows.

---

## Angular-specific

**What is the difference between Angular's `@if` and `display: none`?**

`@if` removes the element from the DOM entirely — no HTML, no event listeners, no memory. `display: none` keeps the element in the DOM but makes it invisible. Use `@if` when the element is not needed at all — a dialog that has not been opened, a section the user does not have access to. Use `display: none` (or `visibility: hidden`) when you need to keep the element ready to appear instantly without being rebuilt.

> **Junior tip:** `@if` is the default choice in Angular. Only switch to `display: none` when you have a specific reason — preserving component state, keeping a tab panel's scroll position, or showing something that must appear without any re-render time.
> **Consejo de entrevista:** `@if` es la elección por defecto en Angular. Solo usa `display: none` cuando tienes una razón específica — preservar estado o mostrar algo sin tiempo de re-renderizado.

**How does Angular component style encapsulation work?**

By default, Angular adds a unique attribute to every element in a component and scopes the component CSS to only match those attributes. Styles in `task-list.component.css` only apply inside that component — they cannot leak into other components. This prevents style conflicts in large apps.

> **Junior tip:** This is also why component CSS cannot reach inside Angular Material components — Material's internal elements do not get your component's scoping attribute. That is why you need `styles.css` for Material overrides.
> **Consejo de entrevista:** Por eso el CSS de componente no puede llegar al interior de los componentes de Angular Material — sus elementos internos no tienen el atributo de encapsulación de tu componente.

**When do you use `styles.css` instead of the component CSS?**

For styles that must apply globally — the reset, CSS variables in `:root`, font imports, Material theme overrides. Also for Angular Material directive internals — Angular's encapsulation stops component CSS from reaching inside Material components, so those overrides must go in `styles.css`.

Red flag answer: "I put everything in `styles.css` to be safe." — That defeats the purpose of encapsulation. Component CSS keeps styles isolated and predictable. `styles.css` is only for things that genuinely need to be global.

**When would you pick `display: none` over `@if` in Angular for hiding an element?**

When the element needs to appear instantly without being rebuilt — for example, a tooltip that must show on hover without re-render delay, or a tab panel that should preserve its scroll position after switching tabs. `@if` destroys and recreates the element, which resets all state. In the task manager I use `@if` for the empty state message (it is never needed simultaneously with the table) but would use `display: none` for a panel that needs to keep its loaded data.

Red flag answer: "I always use `@if` because it is more Angular." — They solve different problems. Picking the wrong one can cause visible re-render flicker or lost UI state.

**You applied CSS to an Angular Material component and it has no effect. What do you investigate first?**

I check whether the element I am targeting is inside my own template or rendered internally by Angular Material. Angular's view encapsulation adds a scoping attribute to elements in my component — but Material's internal DOM does not get that attribute, so my component CSS cannot match it. The fix is to move the rule to `styles.css`. I also check DevTools to see which rule is winning and whether my rule appears as crossed out or simply absent. I hit this in project 05 when styling `mat-table` internals.

Red flag answer: "I add `!important` until it works." — That overrides everything but does not explain why the rule did not apply, and it creates a cascade problem for the next person.
