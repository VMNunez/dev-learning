# CSS — Preguntas de entrevista

## Box model

**¿Qué es `box-sizing: border-box` y por qué siempre lo añades al principio?**

Por defecto, `width` en CSS no incluye el padding ni el borde — así que un elemento con `width: 200px` y `padding: 20px` acaba midiendo 240px, lo que es confuso. `border-box` cambia el cálculo para que el padding y el borde estén incluidos dentro del ancho. Siempre lo añado en el reset al principio de `styles.css` para que todos los elementos se comporten de forma predecible.

> **Junior tip:** Mention that you add it to `*` in every project reset — it shows you have a consistent starting setup, not just theoretical knowledge.
> **Consejo de entrevista:** Menciona que lo añades en `*` en cada reset — demuestra que tienes una configuración de inicio consistente.

**¿Qué es un CSS reset y qué problema soluciona?**

Los navegadores aplican sus propios estilos por defecto — márgenes en los títulos, padding en las listas, tamaños de fuente diferentes. Un reset los elimina para que la aplicación se vea igual en todos los navegadores. Siempre uso `margin: 0; padding: 0; box-sizing: border-box` en `*` al principio de `styles.css`.

> **Junior tip:** If the interviewer asks what the default styles are, name two: `<h1>` has a large top and bottom margin, `<ul>` has left padding. That shows you know where the problem comes from.
> **Consejo de entrevista:** Si preguntan qué estilos por defecto existen, nombra dos: `<h1>` tiene margin, `<ul>` tiene padding izquierdo.

**¿Por qué aplicas el reset a `*, *::before, *::after` en lugar de solo a `*`?**

Porque `*` solo selecciona elementos reales del DOM — los pseudo-elementos como `::before` y `::after` no los selecciona `*` por sí solo. Sin los selectores adicionales, el contenido generado por pseudo-elementos hereda el `box-sizing: content-box` del navegador y puede comportarse de forma distinta. Añadir `*::before, *::after` hace que el reset sea consistente para todo en la página.

Respuesta mala: "Solo uso `*` — es lo mismo." — No lo es. Si usas `::before` para líneas decorativas o el spinner CSS, esos pseudo-elementos tendrían un box model diferente al resto de la página.

---

## CSS variables

**¿Qué son las custom properties de CSS y por qué las usas?**

Variables que defines una vez y reutilizas en cualquier parte — `--primary: #e8572a` en `:root`, luego `color: var(--primary)` en cualquier sitio. Si el diseño cambia, actualizas una sola línea. Las uso en todos los proyectos para colores, espaciado y sombras para no tener números mágicos dispersos por el archivo.

> **Junior tip:** Say "CSS custom properties" in the interview — that is the formal name. "CSS variables" is fine informally, but knowing the formal name signals deeper understanding.
> **Consejo de entrevista:** Di "CSS custom properties" en la entrevista — ese es el nombre formal.

**¿Qué es `:root` y por qué declaras las variables allí?**

`:root` es el elemento de mayor nivel de la página — equivalente a `html` pero con mayor especificidad. Las variables declaradas allí son globales y están disponibles en cualquier elemento. Si las declaras dentro de un componente o clase, solo funcionan dentro de ese ámbito.

> **Junior tip:** Point out the scoping behaviour — you can override a variable by re-declaring it inside a class. This is how you create context-specific themes.
> **Consejo de entrevista:** Menciona que puedes sobrescribir una variable redeclarándola dentro de una clase para crear temas específicos.

**¿Por qué usaste CSS variables para los colores en lugar de escribir los valores hex directamente?**

Porque en cada proyecto tengo 10–15 sitios usando el mismo color. Si el diseño cambia de `#e8572a` a un naranja ligeramente diferente, sin variables tienes que buscar cada regla manualmente y es fácil perderte alguna. Con `--primary: #e8572a` en `:root`, cambias una línea y todos los elementos se actualizan. También los uso para sombras y bordes — `var(--shadow)` es más legible que `rgba(0,0,0,0.08)` escrito en 20 sitios.

Respuesta mala: "Es una buena práctica." — Eso no dice nada. Necesitas explicar qué se rompe sin variables y por qué eso es un problema real en un proyecto.

---

## Flexbox

**¿Cuál es la diferencia entre `justify-content` y `align-items`?**

`justify-content` controla la alineación en el eje principal — horizontal por defecto. `align-items` controla el eje secundario — vertical por defecto. Los ejes se invierten cuando usas `flex-direction: column`. Uso `justify-content: space-between` en las navbars para separar los elementos a cada lado, y `align-items: center` casi en todas partes para centrar el contenido verticalmente.

> **Junior tip:** The axis flip with `flex-direction: column` is the number one flexbox trap in interviews. State it proactively: "When direction is column, justify becomes vertical and align becomes horizontal."
> **Consejo de entrevista:** El intercambio de ejes con `flex-direction: column` es la trampa más común en entrevistas. Menciónalo de forma proactiva.

**¿Qué hace `flex: 1`?**

Le dice al elemento que crezca para ocupar todo el espacio disponible en el contenedor flex. En una barra de búsqueda con un input y un botón en fila, `flex: 1` en el input hace que ocupe el espacio restante después de que el botón tome su ancho natural.

> **Junior tip:** `flex: 1` is shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 0`. Knowing the longhand makes you look like you understand the mechanism, not just the shortcut.
> **Consejo de entrevista:** `flex: 1` es abreviatura de `flex-grow: 1; flex-shrink: 1; flex-basis: 0`. Conocer la forma larga demuestra comprensión real.

**¿Cuándo eliges flexbox en lugar de grid?**

Flexbox es para layouts unidimensionales — una fila de botones, una navbar, una barra de búsqueda, el layout interno de una tarjeta. Grid es para layouts bidimensionales — una cuadrícula de tarjetas, una página con sidebar y contenido, un formulario con dos columnas. Si todo está en una sola fila o columna, flexbox es más simple.

Respuesta mala: "Uso flexbox para todo." — Funciona hasta que necesitas filas y columnas alineadas a la vez. Saber cuándo encaja cada herramienta demuestra que entiendes los layouts, no solo la sintaxis.

**¿Qué es `flex-shrink` y cuándo lo pones a `0`?**

`flex-shrink` controla cuánto se encoge un elemento flex cuando no hay suficiente espacio. El valor por defecto es `1` — todos los elementos se encogen proporcionalmente. Ponlo a `0` cuando quieres que un elemento mantenga su tamaño fijo: por ejemplo, un icono o botón al lado de un input con `flex: 1` — el input se encoge y crece, pero el botón nunca cambia de tamaño.

> **Junior tip:** A button that shrinks and becomes too small to click is a classic flexbox bug in production. `flex-shrink: 0` on the button is the fix.
> **Consejo de entrevista:** Un botón que se encoge y queda demasiado pequeño para hacer clic es un bug clásico de flexbox. `flex-shrink: 0` es la solución.

**¿Qué es el truco `margin: auto` en flexbox?**

En un contenedor flex, `margin-left: auto` en un elemento absorbe todo el espacio restante en ese lado, empujando el elemento hacia la derecha. Es la forma más limpia de empujar un botón de logout al final de una navbar sin usar `justify-content: space-between`, que afectaría a todos los elementos. En el proyecto 06 usé esto para separar los enlaces de navegación de las acciones de la barra de herramientas.

> **Junior tip:** Interviewers sometimes ask "how do you push one item to the end in flexbox without affecting others?" — `margin-left: auto` is the clean CSS-only answer.
> **Consejo de entrevista:** "¿Cómo empujas un elemento al final en flexbox sin afectar a los demás?" — `margin-left: auto` es la respuesta limpia solo con CSS.

**¿Por qué usaste `flex-shrink: 0` en el botón al lado del input de búsqueda?**

Sin él, cuando el contenedor es estrecho, tanto el input como el botón se encogen proporcionalmente y el botón queda demasiado pequeño para leer o hacer clic. Con `flex-shrink: 0` en el botón y `flex: 1` en el input, el botón siempre mantiene su ancho natural y el input ocupa el espacio restante. Uso este patrón en la barra de búsqueda de los proyectos 02 y 04.

Respuesta mala: "Le di al botón un `width` fijo." — Un ancho en píxeles se rompe con diferentes tamaños de fuente y etiquetas de botón. El enfoque `flex-shrink: 0` es correcto y se adapta de forma natural.

---

## CSS Grid

**¿Qué hace `grid-template-columns: 1fr 1fr`?**

Crea dos columnas que cada una ocupa una parte igual del espacio disponible. `1fr` significa "una fracción del espacio libre". Lo uso para layouts de formularios de dos columnas dentro de diálogos — dos campos uno al lado del otro.

> **Junior tip:** `1fr` is only available inside grid — it does nothing outside of `grid-template-columns` or `grid-template-rows`. That distinction often comes up when people try to use `fr` in padding or margin.
> **Consejo de entrevista:** `1fr` solo funciona dentro de grid — no hace nada fuera de `grid-template-columns` o `grid-template-rows`.

**¿Qué hace `grid-column: 1 / -1`?**

Hace que un elemento ocupe desde la primera columna hasta la última, independientemente de cuántas columnas haya. Lo uso en el campo de descripción de un formulario de dos columnas para que ocupe todo el ancho, y en la fila de botones de acción.

> **Junior tip:** The `-1` is a negative line number — it always means "the last grid line". This is more robust than writing `1 / 3` because it works even if you change the number of columns later.
> **Consejo de entrevista:** El `-1` es un número de línea negativo — siempre significa "la última línea del grid". Es más robusto que escribir `1 / 3`.

**¿Qué es `repeat(auto-fill, minmax(250px, 1fr))` y por qué es útil?**

Crea tantas columnas como quepan en el contenedor, cada una con un mínimo de 250px de ancho. En una pantalla grande obtienes 4 columnas; en una tablet 2 o 3; en móvil solo 1 — sin necesitar media queries. Es la forma más simple de construir una cuadrícula de tarjetas responsive.

> **Junior tip:** Know the difference with `auto-fit`: `auto-fill` keeps empty columns at the minimum size, `auto-fit` collapses them so existing items stretch to fill. For card grids with consistent card sizes, `auto-fill` is usually correct.
> **Consejo de entrevista:** Conoce la diferencia con `auto-fit`: `auto-fill` mantiene columnas vacías, `auto-fit` las colapsa y estira los elementos existentes.

**¿Cuándo eliges grid en lugar de flexbox?**

Cuando necesitas controlar filas y columnas al mismo tiempo. Una cuadrícula de tarjetas, un dashboard con paneles, o un formulario donde los campos se alinean tanto horizontal como verticalmente — grid maneja todo eso limpiamente. Flexbox requeriría anidación y trucos.

Respuesta mala: "Uso grid para todo porque es más potente." — Grid es más complejo. Flexbox es más simple para trabajo unidimensional y la herramienta correcta cuando solo tienes una fila o columna.

**¿Cuál es la diferencia entre `auto-fill` y `auto-fit`?**

Ambos crean tantas columnas como quepan en el contenedor. La diferencia se ve cuando hay menos elementos que columnas: `auto-fill` mantiene las columnas vacías — los elementos se quedan en su tamaño mínimo. `auto-fit` colapsa las columnas vacías — los elementos existentes se estiran para ocupar todo el ancho. Para cuadrículas de tarjetas donde quieres tamaños de tarjeta consistentes, `auto-fill` suele ser mejor.

> **Junior tip:** This is a detail that tests whether you have built real responsive grids or just copied code. Prepare a visual mental model: `auto-fit` stretches items, `auto-fill` leaves gaps.
> **Consejo de entrevista:** Este detalle prueba si realmente has construido grids responsivos. Prepara un modelo visual: `auto-fit` estira, `auto-fill` deja huecos.

**Necesitas una cuadrícula de tarjetas responsive sin media queries. ¿Qué CSS escribes?**

`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` con un `gap`. Esto crea tantas columnas como quepan en el contenedor, cada una con al menos 280px de ancho. En una pantalla grande obtienes 4 columnas, en tablet 2–3, en móvil solo 1 — sin media queries. Lo uso en el meal finder y el task manager.

Respuesta mala: "Uso media queries para establecer el número de columnas en cada breakpoint." — Funciona pero es el enfoque antiguo y se rompe cuando el ancho del contenedor cambia (como dentro de un layout con sidebar). El patrón auto-fill se adapta a cualquier contenedor.

**¿Por qué usas `grid-template-columns: 1fr auto 1fr` para un título centrado con un botón a la derecha?**

Porque `text-align: center` en el título solo lo centra dentro de su propia columna — en cuanto añades un botón a la derecha, el título se desplaza a la izquierda. Con `1fr auto 1fr`, las columnas izquierda y derecha son iguales, así que la columna del medio con el título siempre está verdaderamente centrada sin importar qué haya a la derecha. Uso este patrón en la cabecera del dashboard del HR portal donde necesitaba un título centrado y un enlace "Ver todo" alineado a la derecha.

Respuesta mala: "Uso `text-align: center` en el título." — Solo funciona cuando el título está solo. Añade algo a la derecha y se rompe.

---

## Posicionamiento

**¿Cuál es la diferencia entre `position: relative` y `position: absolute`?**

`relative` mantiene el elemento en el flujo normal pero te permite desplazarlo con `top`, `left`, etc. Más importante, crea un contexto de posicionamiento para los hijos `absolute`. `absolute` elimina el elemento del flujo y lo posiciona relativo a su ancestro más cercano con `position: relative`. Uso este patrón para badges — la tarjeta tiene `position: relative`, el badge tiene `position: absolute; top: 0.75rem; right: 0.75rem`.

> **Junior tip:** In practice, you almost never visually offset a `relative` element. Its real job is to be the anchor for `absolute` children. Say this — it shows you understand the purpose, not just the property.
> **Consejo de entrevista:** En la práctica, casi nunca desplazas visualmente un elemento `relative`. Su función real es ser el ancla para hijos `absolute`.

**¿Qué es `position: fixed` y cuándo lo usas?**

Fija el elemento al viewport — no se desplaza con la página. Lo uso para overlays de modales: `position: fixed; inset: 0` cubre toda la pantalla y permanece allí mientras el usuario hace scroll.

> **Junior tip:** Know that `inset: 0` is shorthand for `top: 0; right: 0; bottom: 0; left: 0`. Using `inset` shows you know modern CSS.
> **Consejo de entrevista:** `inset: 0` es la abreviatura de `top: 0; right: 0; bottom: 0; left: 0`. Usarlo demuestra conocimiento de CSS moderno.

**¿Qué es `position: sticky` y cuándo es útil?**

El elemento se desplaza normalmente hasta que alcanza una posición definida, luego se queda fijo. Lo uso para cabeceras de tabla — `position: sticky; top: 0` para que la cabecera permanezca visible mientras el usuario baja por una lista larga.

> **Junior tip:** One gotcha: `sticky` only sticks within its parent container. If the parent is smaller than the viewport, the element stops sticking when the parent scrolls out of view. Also, always add a `background-color` — otherwise the page content scrolls visibly behind the stuck element.
> **Consejo de entrevista:** Gotcha: `sticky` solo funciona dentro de su contenedor padre. Además, siempre añade `background-color` — si no, el contenido de la página se ve a través del elemento fijo.

**¿Qué es `z-index` y cuándo lo necesitas?**

Controla qué elemento aparece encima cuando los elementos se solapan. Mayor valor = más arriba. Solo funciona en elementos con un `position` distinto de `static`. Uso una escala definida: 100 para navbars, 200 para menús desplegables, 1000 para modales, 9999 para tooltips — nunca números grandes aleatorios.

> **Junior tip:** Random large numbers like `z-index: 99999` are a smell. A stacking context can neutralise any z-index value. Knowing this — that z-index only works within the same stacking context — separates you from juniors who debug by trial and error.
> **Consejo de entrevista:** Los números grandes aleatorios como `z-index: 99999` son una señal de alerta. Saber que z-index solo funciona dentro del mismo stacking context te diferencia.

**¿Por qué usaste `position: absolute` para el badge en lugar de margin o padding?**

Porque el margin y el padding cambian el flujo del documento — empujan otros elementos y cambian la altura de la tarjeta. Para un elemento superpuesto que debería aparecer encima del contenido sin afectar al layout de la tarjeta, `position: absolute` es lo correcto — elimina el elemento del flujo por completo. La tarjeta tiene `position: relative` como ancla y el badge se posiciona con precisión dentro de ella. Lo uso en el proyecto 04 para la estrella de favorito que se superpone a la imagen del plato.

Respuesta mala: "Usé margin negativo." — El margin negativo es un truco que hace el layout frágil. `position: absolute` es la herramienta correcta para este patrón.

**El HR portal tiene una barra de herramientas fija y solo el área de contenido hace scroll. ¿Cómo lo implementaste?**

La clave fue `overflow: hidden` en el contenedor flex `app-root`. Sin él, el navegador deja que los elementos flex crezcan más allá de su altura asignada y toda la página hace scroll. Con él, solo `mat-sidenav-content` hace scroll internamente. También necesité `html, body { height: 100% }` para dar al shell una altura de referencia fija, y `min-height: 0` en el contenedor del sidenav para evitar que el comportamiento de estiramiento por defecto de flex rompiera el layout.

Respuesta mala: "Usé `position: fixed` en la barra de herramientas." — Eso funciona solo para la barra, pero luego necesitas hacks de padding en todos lados para compensar su altura. El patrón de height y overflow en el shell es la solución limpia.

---

## Diseño responsive

**¿Qué es mobile-first y por qué es el enfoque recomendado?**

Escribes los estilos base para móvil primero, luego añades media queries con `@media (min-width)` para ajustar el layout en pantallas más grandes. Es el enfoque recomendado porque te obliga a empezar con el layout esencial y añadir complejidad solo cuando hay espacio para ella — el resultado es más limpio y carga más rápido en móvil.

> **Junior tip:** The key word in "mobile-first" is that the base styles have no media query. Explain it as: "Mobile is the default. Desktop is an override." That is a clean mental model.
> **Consejo de entrevista:** La clave es que los estilos base no tienen media query. Explícalo como: "Móvil es el valor por defecto. Escritorio es una sobreescritura."

**¿Qué es una media query?**

Un bloque de CSS que solo se aplica cuando una condición es verdadera — normalmente el ancho de pantalla. `@media (min-width: 768px)` se aplica a tablets y pantallas más grandes. Uso dos breakpoints principales: `768px` para tablet, `1024px` para escritorio.

> **Junior tip:** You can also combine conditions: `@media (min-width: 768px) and (max-width: 1023px)` targets only tablet. Useful for debugging specific screen sizes.
> **Consejo de entrevista:** También puedes combinar condiciones: `@media (min-width: 768px) and (max-width: 1023px)` se aplica solo en tablet.

**¿Cuándo usarías `clamp()` en lugar de una media query para tamaños de fuente?**

Cuando el tamaño debe escalar suavemente con el viewport en lugar de saltar en un breakpoint. Con una media query, el título salta de `1.5rem` a `2.5rem` exactamente en 768px. Con `clamp(1.5rem, 4vw, 2.5rem)`, crece proporcionalmente de `1.5rem` a `2.5rem` a medida que la pantalla se ensancha — sin salto brusco. Uso media queries para cambios de layout (una columna a dos) y `clamp()` para tamaños de fuente y padding donde una transición suave queda mejor.

Respuesta mala: "Siempre uso media queries." — No es incorrecto, pero demuestra que no sabes cuándo la herramienta más simple funciona mejor.

---

## Animaciones y transiciones

**¿Qué hace `transform` y por qué se prefiere para las animaciones?**

`transform` mueve, escala o rota un elemento sin afectar al flujo del documento — `translate(-50%, -50%)` para centrar, `scale(1.05)` para el crecimiento en hover, `rotate(45deg)` para iconos. La razón clave para preferirlo frente a cambiar `top`/`left` o `margin` es el rendimiento — `transform` está acelerado por GPU y no provoca recálculo del layout, por lo que las animaciones se mantienen fluidas incluso en dispositivos más lentos.

> **Junior tip:** "GPU-accelerated" es la respuesta a "¿por qué transform es más rápido?" El navegador puede procesarlo en la tarjeta gráfica sin recalcular el layout.
> **Consejo de entrevista:** "Acelerado por GPU" es la respuesta a por qué `transform` es más rápido — el navegador lo procesa en la tarjeta gráfica sin recalcular el layout.

**¿Cuál es la diferencia entre `transition` y una animación con `@keyframes`?**

`transition` es para cambios de estado simples — efectos hover, mostrar/ocultar un elemento. Defines el inicio y el final, CSS maneja el movimiento. `@keyframes` es para animaciones más complejas que se repiten o tienen múltiples pasos — como un spinner de carga. Uso `transition` para efectos hover en tarjetas y `@keyframes` para el spinner CSS.

> **Junior tip:** Regla rápida: si la animación necesita repetirse indefinidamente (`infinite`), usa `@keyframes`. Si se reproduce una vez en respuesta a un cambio de estado, usa `transition`.
> **Consejo de entrevista:** Si necesita `infinite`, usa `@keyframes`. Si responde a un cambio de estado una vez, usa `transition`.

**¿Por qué pones `transition` en el elemento base y no en `:hover`?**

Si lo pones en `:hover`, la animación solo se reproduce al entrar en el estado hover — la vuelta es instantánea. Si lo pones en el elemento base, la transición se reproduce suavemente en ambas direcciones. Descubrí esto en el proyecto 01 y he seguido esta regla en todos los proyectos desde entonces.

Respuesta mala: "Lo pongo en `:hover` — no noté la diferencia." — Este es un clásico de las entrevistas de CSS. No saberlo significa que probablemente no probaste la dirección inversa.

---

## Tipografía

**¿Cuál es la diferencia entre `rem` y `px`?**

`px` es un tamaño fijo. `rem` es relativo al tamaño de fuente raíz — por defecto `1rem = 16px`. Usar `rem` para los tamaños de fuente respeta la preferencia de tamaño de fuente del navegador del usuario, lo que importa para la accesibilidad. Uso `rem` para todo: `1rem` para el texto del cuerpo, `1.5rem` para los títulos, `0.875rem` para las etiquetas pequeñas.

> **Junior tip:** Si preguntan sobre accesibilidad en CSS, `rem` para tamaños de fuente es tu primera respuesta. Los usuarios que configuran una fuente más grande en el navegador lo hacen por una razón.
> **Consejo de entrevista:** Si preguntan sobre accesibilidad en CSS, `rem` para tamaños de fuente es tu primera respuesta.

**¿Cómo cortas texto largo con `...` en CSS?**

Tres propiedades juntas: `white-space: nowrap` para mantener el texto en una sola línea, `overflow: hidden` para ocultar lo que sale fuera del contenedor, y `text-overflow: ellipsis` para añadir los `...`. El contenedor también necesita un ancho fijo o máximo — de lo contrario no hay nada que desborde.

> **Junior tip:** Las tres son necesarias. `text-overflow: ellipsis` solo dibuja los `...` — no hace el recorte. `overflow: hidden` hace el recorte real. Si solo añades `ellipsis` y olvidas `overflow: hidden`, nada cambia.
> **Consejo de entrevista:** Las tres propiedades son obligatorias. Sin `overflow: hidden`, `ellipsis` no hace nada visible.

---

## Unidades

**¿Cuál es la diferencia entre `rem` y `em`?**

`rem` siempre es relativo al tamaño de fuente raíz (`1rem = 16px` por defecto) — es consistente y predecible. `em` es relativo al tamaño de fuente del elemento padre, que se acumula con el anidamiento y se vuelve difícil de controlar. Uso `rem` para todo: tamaños de fuente, padding, gap. `em` casi nunca es necesario.

> **Junior tip:** El apilamiento de `em` es una trampa. Un componente con `font-size: 1.5em` dentro de un padre que ya tiene `font-size: 1.5em` acaba a 2.25x el tamaño raíz. `rem` siempre resetea al valor raíz.
> **Consejo de entrevista:** Usa `rem` por defecto y solo `em` cuando explícitamente quieres escalar con el font-size del padre.

**¿Cuándo usas `vh` y `vw`?**

Cuando necesitas un tamaño relativo al viewport, no al elemento padre. `100vh` ocupa toda la altura de la pantalla — lo uso en layouts de página completa como la página de login y el contenedor del sidenav. `vw` es menos común pero útil con `clamp()` para tamaños de fuente fluidos.

> **Junior tip:** `min-height: 100vh` es más seguro que `height: 100vh` para páginas con contenido variable. `height` recorta el desbordamiento; `min-height` crece con el contenido.
> **Consejo de entrevista:** `min-height: 100vh` es más seguro que `height: 100vh` — `height` recorta, `min-height` crece.

**¿Qué es `fr` y dónde funciona?**

`fr` significa "fracción del espacio libre disponible" y solo funciona dentro de CSS Grid. `1fr 1fr` crea dos columnas iguales; `250px 1fr` crea un sidebar fijo con un área de contenido fluida. Fuera de `grid-template-columns` o `grid-template-rows`, `fr` no hace nada.

> **Junior tip:** La gente a veces intenta usar `fr` en `width` o `padding` — no funciona ahí. `fr` solo existe dentro de grid.
> **Consejo de entrevista:** `fr` solo funciona dentro de grid. Fuera de `grid-template-columns` o `grid-template-rows`, no hace nada.

**¿Cómo decides entre `rem` y `px` para el espaciado como padding o gap?**

`rem` para todo el espaciado que debería escalar con la preferencia de tamaño de fuente del usuario — padding, margin, gap. `px` solo para cosas que siempre deberían tener el mismo peso visual independientemente del tamaño de fuente — bordes (`1px`), border-radius (`8px`), blur de box-shadow. La regla mental: si cambiar la fuente base del navegador de 16px a 20px debería escalar este valor, usa `rem`. Si no, usa `px`.

Respuesta mala: "Uso `px` porque es más fácil de calcular." — Eso ignora a los usuarios con configuraciones de accesibilidad de tamaño de fuente.

---

## Colores y opacidad

**¿Cuál es la diferencia entre `opacity` y `rgba`?**

`opacity` hace que todo el elemento sea transparente — el elemento, su texto, sus bordes y todos sus hijos se desvanecen juntos. `rgba` solo hace transparente el color de fondo — el texto dentro permanece completamente opaco. Uso `rgba` para overlays y sombras, y `opacity` para estados desactivados donde quiero que todo se desvanezca.

> **Junior tip:** El error común es usar `opacity` en un overlay. Eso hace que el contenido del modal también sea transparente, lo que no es lo que quieres. `background-color: rgba(0,0,0,0.5)` es lo correcto para overlays.
> **Consejo de entrevista:** El error típico es usar `opacity` en un overlay. Eso hace transparente también el contenido del modal.

**¿Qué es `currentColor`?**

Una palabra clave CSS que hace referencia al propio valor `color` del elemento. Útil cuando quieres que un borde o icono coincida automáticamente con el color del texto — `border: 1px solid currentColor` se actualiza solo cada vez que cambia `color`.

> **Junior tip:** Es útil para iconos que deben coincidir con el texto circundante. Establece `color` en el padre y el icono lo hereda automáticamente.
> **Consejo de entrevista:** Útil para iconos que deben coincidir con el texto. Establece `color` en el padre y el icono lo hereda mediante `currentColor`.

**¿Cuándo usarías `opacity` vs `rgba` para hacer algo transparente?**

`rgba` cuando solo quieres que el fondo sea transparente — para overlays, sombras, o un panel con efecto frosted glass donde el texto debe seguir siendo completamente visible. `opacity` cuando quieres que todo el elemento y sus hijos se desvanezcan juntos — para un botón desactivado donde el texto, el fondo y el borde se desvanecen a la vez. Usar `opacity` en un overlay también haría transparente el contenido del modal, lo cual es un error común.

Respuesta mala: "Son intercambiables." — No lo son. Uno afecta solo al color; el otro afecta a todo el elemento incluidos los hijos.

---

## Selectores

**¿Cuál es la diferencia entre `.parent .child` y `.parent > .child`?**

`.parent .child` (descendiente) coincide con cualquier `.child` a cualquier profundidad dentro de `.parent`. `.parent > .child` (hijo directo) solo coincide con los elementos `.child` que están inmediatamente dentro de `.parent`, no con los nietos. Uso el selector de hijo directo cuando quiero evitar aplicar estilos accidentalmente a componentes anidados.

> **Junior tip:** El selector de hijo directo es útil en Angular cuando un estilo global podría filtrarse a un componente anidado profundamente. Usar `>` mantiene el ámbito intencional.
> **Consejo de entrevista:** En Angular, el selector `>` evita que estilos globales se filtren a componentes anidados profundamente.

**¿Cuál es la diferencia entre una pseudo-clase y un pseudo-elemento?**

Las pseudo-clases (dos puntos simples: `:hover`, `:focus`, `:nth-child`) seleccionan un elemento según su estado o posición. Los pseudo-elementos (dobles dos puntos: `::before`, `::after`, `::placeholder`) seleccionan una parte específica de un elemento o insertan contenido generado. Los dobles dos puntos son la convención moderna — distinguen claramente los dos.

> **Junior tip:** El doble dos puntos `::` es la sintaxis moderna para pseudo-elementos. El código antiguo usa `:before` con un solo colon — sigue funcionando, pero `::before` es lo correcto.
> **Consejo de entrevista:** `::` doble es la sintaxis moderna. El código antiguo con `:before` sigue funcionando por compatibilidad, pero usa `::before`.

---

## Especificidad

**¿Cómo decide CSS qué regla gana cuando dos reglas se aplican al mismo elemento?**

Por puntuación de especificidad: los selectores ID puntúan 100, los selectores de clase/atributo/pseudo-clase puntúan 10, y los selectores de elemento puntúan 1. Gana la regla con la puntuación más alta. Si las puntuaciones son iguales, gana la que aparece más tarde en el archivo. En la práctica: una clase supera a un elemento, un ID supera a una clase.

> **Junior tip:** Evita selectores ID en tu propio CSS — son muy difíciles de sobrescribir (necesitas otro ID o `!important`). Solo clases es el enfoque estándar.
> **Consejo de entrevista:** Evita ID en tu CSS — solo clases. Son muy difíciles de sobrescribir.

**¿Por qué deberías evitar `!important`?**

Anula todas las reglas de especificidad, lo que hace que el CSS sea imposible de razonar — no puedes predecir qué regla gana leyendo el código. Una vez que lo usas, la única forma de anularlo es otro `!important`. Solo lo uso para combatir los estilos de librerías de terceros a los que no puedo acceder de otra manera.

> **Junior tip:** Si ves `!important` en un codebase, casi siempre es señal de que alguien no entendió la especificidad y lo añadió como fix rápido. El fix real es reestructurar los selectores.
> **Consejo de entrevista:** `!important` es un síntoma de un problema de especificidad no resuelto. El fix real es reestructurar los selectores.

---

## BEM

**¿Qué es BEM y qué problema soluciona?**

Una convención de nomenclatura — Bloque, Elemento, Modificador. Los bloques son componentes independientes (`.card`), los elementos son partes de un bloque (`.card__title`), y los modificadores son variaciones (`.card--featured`). Soluciona la especificidad y la inconsistencia en los nombres — cada regla es una sola clase, por lo que la especificidad se mantiene en `0-1-0` en todas partes y los nombres de clase son predecibles.

> **Junior tip:** BEM aparece en muchas bases de código enterprise en España. Saber leerlo importa, aunque no lo uses a diario en Angular.
> **Consejo de entrevista:** BEM aparece en muchos proyectos enterprise en España. Saber leerlo importa aunque no lo escribas en Angular.

**¿Por qué BEM es menos necesario en Angular?**

La encapsulación de estilos de los componentes Angular ya limita el CSS automáticamente — `.card` en un componente no puede afectar a `.card` en otro. BEM fue inventado para solucionar el problema del ámbito global que Angular ya gestiona. Sigo usando las convenciones BEM en `styles.css` global y en los componentes compartidos donde no hay encapsulación.

Respuesta mala: "No uso BEM porque Angular lo gestiona." — Parcialmente correcto, pero incompleto. Angular encapsula los estilos de componentes, no los globales. BEM sigue siendo útil en `styles.css` y utilidades compartidas.

---

## Bordes y sombras

**¿Cuál es la diferencia entre `border` y `outline`?**

`border` es parte del box model — ocupa espacio y afecta al layout. `outline` se sitúa fuera del borde y no ocupa espacio. Los navegadores añaden un `outline` por defecto en los elementos enfocados para la accesibilidad — si lo eliminas con `outline: none`, debes añadir un estilo de foco visible personalizado, de lo contrario los usuarios de teclado no pueden ver dónde están.

> **Junior tip:** Nunca elimines `outline` sin reemplazarlo. Añade un estilo `:focus-visible` personalizado. Es un requisito de accesibilidad, no solo una preferencia.
> **Consejo de entrevista:** Nunca uses `outline: none` sin añadir un `:focus-visible` personalizado. Es accesibilidad, no solo estética.

**¿Qué aspecto tiene `box-shadow` y cuáles son los valores clave?**

`box-shadow: offset-x offset-y blur spread color`. Por ejemplo: `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` — sin desplazamiento horizontal, 4px abajo, 12px de desenfoque suave, negro semitransparente. Siempre uso `rgba` para el color para que la sombra sea transparente. Añadir `inset` hace que la sombra aparezca dentro del elemento.

> **Junior tip:** El valor más olvidado es `spread`. La mayoría de las sombras reales quedan mejor con `spread: 0` (u omitido) — añadir spread positivo hace que parezca pintada en lugar de natural.
> **Consejo de entrevista:** `spread` es el valor más olvidado. Las sombras naturales se hacen sin spread o con spread negativo.

**¿Cuándo usas `border-radius: 9999px` en lugar de `50%`?**

Usa `50%` para un círculo perfecto, pero solo cuando el elemento es cuadrado — si no lo es, `50%` da un óvalo. Para formas pill (botones, badges con padding), usa `9999px` — siempre da un pill limpio sin importar la proporción ancho/alto, porque el navegador limita el radio real a lo que cabe.

Respuesta mala: "Uso `50%` para todo lo redondeado." — Solo funciona para círculos. Para badges y botones, `9999px` es el truco correcto.

---

## Fondos

**¿Cuál es la diferencia entre `background-size: cover` y `contain`?**

`cover` rellena el contenedor completamente — la imagen puede recortarse pero no hay espacios vacíos. `contain` encaja toda la imagen dentro del contenedor — sin recorte pero puede dejar espacio vacío en los lados. Uso `cover` para las imágenes de tarjetas y las secciones hero donde una imagen recortada es mejor que el espacio vacío.

> **Junior tip:** Siempre combina `background-size: cover` con `background-position: center` para que el recorte sea centrado en la imagen en lugar de empezar desde la esquina superior izquierda.
> **Consejo de entrevista:** Siempre combina `background-size: cover` con `background-position: center`.

**¿Qué es `object-fit` y cuándo lo usas?**

Controla cómo un `<img>` rellena su contenedor cuando la imagen y el contenedor tienen diferentes proporciones. `object-fit: cover` rellena el contenedor y recorta si es necesario — el mismo comportamiento que `background-size: cover` pero para elementos `<img>`. Lo uso en imágenes de tarjetas con una altura fija: la imagen siempre rellena el espacio sin estirarse.

> **Junior tip:** Siempre da una `height` fija al `<img>` al usar `object-fit: cover` — sin restricción de altura, la imagen se expande a su tamaño natural y `object-fit` no tiene nada que recortar.
> **Consejo de entrevista:** `object-fit: cover` requiere una `height` definida en el `<img>` para funcionar.

**¿Cuándo elegirías `object-fit: cover` sobre `background-size: cover`?**

Usa `object-fit: cover` cuando la imagen es contenido semántico — miniaturas de tarjetas, avatares de usuario, fotos de productos. Usa `background-size: cover` cuando la imagen es puramente decorativa — fondos de secciones hero, separadores. La diferencia importa para la accesibilidad: los elementos `<img>` tienen `alt` para los lectores de pantalla; `background-image` no.

Respuesta mala: "Se ven igual, uso lo que sea." — Logran un resultado visual similar, pero uno es para contenido (HTML, accesible), el otro para decoración (CSS, no accesible). Elegir mal es un error semántico.

---

## Funciones CSS

**¿Qué hace `calc()` y por qué es útil?**

Calcula un valor CSS usando matemáticas — y, fundamentalmente, puedes mezclar unidades diferentes. `width: calc(100% - 250px)` significa "ancho completo menos el sidebar". Sin `calc()`, no puedes restar píxeles a un porcentaje en CSS.

> **Junior tip:** Siempre pon espacios alrededor de `+` y `-` en `calc()`. `calc(100% - 20px)` funciona; `calc(100%-20px)` no. Es un requisito de la especificación, no una preferencia de estilo.
> **Consejo de entrevista:** Los espacios alrededor de `+` y `-` son obligatorios en `calc()`. Sin ellos, la expresión no se evalúa.

**¿Qué hace `clamp()`?**

Bloquea un valor entre un mínimo y un máximo, con un valor preferido fluido en el medio — `clamp(1rem, 2.5vw, 2rem)`. El valor crece con el viewport pero nunca baja de `1rem` ni sube de `2rem`. Lo uso para tipografía fluida y espaciado sin necesitar media queries.

> **Junior tip:** Piensa en `clamp(min, preferred, max)` como un valor con límites. El `preferred` es lo que quieres — normalmente una unidad relativa al viewport. Los `min` y `max` son los límites de seguridad.
> **Consejo de entrevista:** `clamp(min, preferred, max)` — el `preferred` suele ser una unidad `vw`, los límites son `rem` para garantizar legibilidad.

---

## Display y layout

**¿Cuál es la diferencia entre `inline`, `block` e `inline-block`?**

`block` ocupa todo el ancho del contenedor y siempre empieza en una línea nueva — `<div>`, `<p>`, `<h1>`. `inline` se sitúa en línea con el texto y solo ocupa el ancho de su contenido — `<span>`, `<a>`. Los elementos inline ignoran `width`, `height` y `margin` vertical. `inline-block` es un híbrido — se sitúa en el flujo del texto pero respeta el ancho, la altura y el margen vertical. Lo uso en `<a>` o `<span>` cuando necesito padding vertical en un elemento inline.

> **Junior tip:** El gotcha clásico: añadir `padding-top` a un `<a>` y que no funcione. El fix es `display: inline-block` — eso activa el margen y padding vertical en elementos inline.
> **Consejo de entrevista:** `padding-top` no funciona en elementos `inline`. El fix es `display: inline-block`.

**¿Cuál es la diferencia entre `display: none` y `visibility: hidden`?**

Ambos ocultan el elemento visualmente, pero `display: none` lo elimina del layout por completo — el espacio que ocupaba desaparece y los demás elementos se mueven para ocuparlo. `visibility: hidden` mantiene el espacio reservado — el elemento es invisible pero los demás elementos se quedan en su sitio. Uso `visibility: hidden` cuando quiero ocultar un botón de acción al pasar el ratón sin que cambie la altura de la fila.

> **Junior tip:** Una tercera opción es `opacity: 0` — el elemento es invisible, mantiene el espacio y sigue siendo clicable. Útil para animaciones de fade-in donde quieres el espacio reservado antes de que aparezca el elemento.
> **Consejo de entrevista:** `opacity: 0` es una tercera opción — invisible, mantiene espacio, sigue siendo clicable. Útil para animaciones de entrada.

**¿Cómo centras un elemento vertical y horizontalmente?**

Dos enfoques comunes. Con flexbox: `display: flex; align-items: center; justify-content: center` en el padre — la opción más sencilla para la mayoría de layouts. Con posicionamiento absoluto: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`. El `top: 50%` mueve el borde superior del elemento al centro del padre, y luego `translate(-50%, -50%)` lo desplaza hacia atrás la mitad de su propio tamaño para que el centro del elemento coincida con el centro del padre.

> **Junior tip:** El enfoque con flexbox es el que debes usar primero — es más simple y no requiere un padre `position: relative`. El posicionamiento absoluto es para centrar dentro de un contenedor posicionado.
> **Consejo de entrevista:** Flexbox primero, posicionamiento absoluto cuando el contenedor ya está posicionado (como un spinner de carga dentro de una tarjeta).

**¿Qué es `overflow` y cuáles son los valores más comunes?**

`overflow` controla qué pasa cuando el contenido es más grande que su contenedor. Los cuatro valores: `visible` (por defecto, el contenido se muestra fuera), `hidden` (recorta el contenido), `auto` (añade scrollbar solo cuando es necesario), `scroll` (siempre muestra scrollbar). Uso `overflow: hidden` en tarjetas para que las imágenes respeten el `border-radius`, y `overflow: auto` en paneles de texto con una altura máxima fija.

> **Junior tip:** `overflow: hidden` tiene un efecto secundario: también oculta hijos `position: absolute` que salen del contenedor. Si un dropdown dentro de una tarjeta se recorta, comprueba si hay `overflow: hidden` en el padre.
> **Consejo de entrevista:** `overflow: hidden` recorta todo lo que sale, incluidos los hijos con `position: absolute`. Si un dropdown se recorta, busca el `overflow: hidden` en algún ancestro.

**¿Cuándo usarías `overflow: hidden` en un elemento tarjeta?**

Cuando la tarjeta tiene una imagen arriba y un `border-radius`. Sin `overflow: hidden`, las esquinas de la imagen sobresalen más allá de las esquinas redondeadas de la tarjeta. Con él, la imagen se recorta siguiendo la forma de la tarjeta. La tarjeta recibe `border-radius: 8px; overflow: hidden` y la imagen rellena la parte superior de forma natural. Descubrí este patrón en el proyecto 04 cuando las imágenes de los platos tenían esquinas rectas en una tarjeta redondeada.

Respuesta mala: "Le doy a la imagen un `border-radius` igual." — Funciona para las esquinas de arriba, pero tienes que recordar actualizar ambos valores cada vez que cambias el radio de la tarjeta. Una sola regla en el contenedor es más limpio y robusto.

---

## Preguntas de presión

**El cliente dice que la app se ve rota en móvil. Abres DevTools. ¿Qué compruebas primero?**

Abro el modo responsive en DevTools y establezco el viewport a 375px — el ancho de teléfono pequeño más común. Luego compruebo en orden: si el layout desborda horizontalmente (lo que normalmente significa un ancho fijo en `px` en algún sitio), si el texto es demasiado pequeño para leer (falta de uso de `rem` o meta tag del viewport), y si los elementos táctiles como los botones tienen al menos 44px de altura. La mayoría de los problemas de layout en móvil se reducen a una de estas tres cosas.

**Heredas un archivo CSS con 15 declaraciones `!important` por todo el archivo. ¿Qué haces?**

No los toco de inmediato — eliminar `!important` sin entender por qué se añadió puede romper cosas silenciosamente. Leo cada uno y averiguo el conflicto de especificidad subyacente. La mayoría de las veces el fix consiste en reestructurar los selectores para que la regla correcta gane de forma natural — añadir una clase, eliminar anidamiento innecesario, o mover una regla a un lugar más apropiado. Luego los elimino uno a uno con pruebas. La lección es que `!important` nunca es el fix real — es un síntoma de un problema de especificidad que no se resolvió correctamente.

**¿Qué error de CSS has cometido y cómo lo resolviste?**

En el task manager añadí un estilo que apuntaba a un elemento interno de un componente de Material dentro del CSS del componente y no tuvo efecto. Estuve buscando en el sitio equivocado. Entonces recordé la encapsulación de vistas de Angular — el CSS del componente no puede llegar al interior de los componentes de Material porque esos elementos no reciben el atributo de encapsulación. Moví la regla a `styles.css` y funcionó de inmediato. Ahora siempre compruebo si el elemento está en mi propia plantilla o se renderiza internamente antes de decidir dónde poner el CSS.

Respuesta mala: "Siempre pruebo en el navegador hasta que funciona." — Eso no es depurar, es adivinar. El entrevistador quiere ver que entiendes por qué algo falla, no solo que encontraste un fix por casualidad.

**El equipo de diseño reporta que la animación hover de un botón solo se reproduce al entrar, pero vuelve instantáneamente al salir. ¿Qué pasó?**

La propiedad `transition` está en `:hover` en lugar de en el elemento base. Cuando la transición está en `:hover`, la animación se reproduce al entrar en el estado hover, pero al salir el ratón no hay ninguna transición que reproducir — el elemento vuelve instantáneamente al estado inicial. Mover `transition: transform 0.2s ease` al elemento base lo arregla — el navegador reproduce la animación en ambas direcciones. Descubrí esto en el proyecto 01 y nunca he vuelto a poner una transición en `:hover`.

Respuesta mala: "Añadiría un event listener de JavaScript para mouseleave." — Es enormemente sobre-ingenierizado para un fix de una línea en CSS.

**Estás revisando una PR de un junior y su CSS tiene `z-index: 99999` en un tooltip. ¿Qué le dices?**

Le explicaría que el problema no es el número — es la falta de un sistema. Los valores de `z-index` solo funcionan relativos entre sí dentro del mismo stacking context. Un stacking context es creado por cualquier elemento posicionado con un `z-index` distinto de `auto`, así que `z-index: 99999` dentro de un context puede perder frente a `z-index: 1` en otro. El fix es una escala definida: 100 para navbars, 200 para dropdowns, 1000 para modales, 9999 para tooltips — y verificar que el tooltip no esté atrapado dentro de un stacking context con bajo z-index.

Respuesta mala: "Está bien mientras funcione." — El código que funciona por accidente no es código de producción. La revisión existe para detectar patrones que causarán problemas cuando el proyecto crezca.

---

## Específico de Angular

**¿Cuál es la diferencia entre el `@if` de Angular y `display: none`?**

`@if` elimina el elemento del DOM por completo — sin HTML, sin event listeners, sin memoria. `display: none` mantiene el elemento en el DOM pero lo hace invisible. Usa `@if` cuando el elemento no se necesita en absoluto — un diálogo que no se ha abierto, una sección a la que el usuario no tiene acceso. Usa `display: none` cuando necesitas que el elemento esté listo para aparecer al instante sin ser reconstruido.

> **Junior tip:** `@if` es la elección por defecto en Angular. Solo usa `display: none` cuando tienes una razón específica — preservar estado del componente, mantener la posición de scroll de un panel, o mostrar algo sin tiempo de re-renderizado.
> **Consejo de entrevista:** `@if` es el valor por defecto. `display: none` solo cuando necesitas preservar estado o evitar re-renderizado.

**¿Cómo funciona la encapsulación de estilos de los componentes Angular?**

Por defecto, Angular añade un atributo único a cada elemento de un componente y limita el CSS del componente para que solo coincida con esos atributos. Los estilos en `task-list.component.css` solo se aplican dentro de ese componente — no pueden filtrarse a otros componentes. Esto evita conflictos de estilos en aplicaciones grandes.

> **Junior tip:** Por eso el CSS de componente no puede llegar al interior de los componentes de Angular Material — sus elementos internos no tienen el atributo de encapsulación de tu componente. Por eso las sobreescrituras de Material van en `styles.css`.
> **Consejo de entrevista:** Los elementos internos de Angular Material no tienen el atributo de encapsulación, por eso el CSS de componente no los alcanza.

**¿Cuándo usas `styles.css` en lugar del CSS del componente?**

Para estilos que deben aplicarse globalmente — el reset, las variables CSS en `:root`, las importaciones de fuentes, las sobreescrituras del tema de Material. También para los internos de las directivas de Angular Material — la encapsulación de Angular impide que el CSS del componente llegue al interior de los componentes de Material, así que esas sobreescrituras deben ir en `styles.css`.

Respuesta mala: "Pongo todo en `styles.css` para estar seguro." — Eso anula el propósito de la encapsulación. El CSS de componente mantiene los estilos aislados y predecibles. `styles.css` es solo para lo que genuinamente necesita ser global.

**¿Cuándo elegirías `display: none` sobre `@if` en Angular para ocultar un elemento?**

Cuando el elemento necesita aparecer instantáneamente sin ser reconstruido — por ejemplo, un tooltip que debe mostrarse al pasar el ratón sin demora de re-renderizado, o un panel de pestañas que debe conservar su posición de scroll al cambiar de pestaña. `@if` destruye y recrea el elemento, lo que resetea todo el estado. En el task manager uso `@if` para el mensaje de estado vacío (nunca se necesita a la vez que la tabla) pero usaría `display: none` para un panel que necesita mantener sus datos cargados.

Respuesta mala: "Siempre uso `@if` porque es más Angular." — Resuelven problemas diferentes. Elegir mal puede causar parpadeo visible al re-renderizar o pérdida de estado de la UI.

**Aplicas CSS a un componente de Angular Material y no tiene efecto. ¿Qué investigas primero?**

Compruebo si el elemento que estoy apuntando está dentro de mi propia plantilla o se renderiza internamente por Angular Material. La encapsulación de vistas de Angular añade un atributo de encapsulación a los elementos de mi componente — pero el DOM interno de Material no recibe ese atributo, así que mi CSS de componente no puede coincidir con él. El fix es mover la regla a `styles.css`. También compruebo en DevTools qué regla está ganando y si mi regla aparece tachada o simplemente ausente. Aprendí esto en el proyecto 05 cuando estilizaba los internos de `mat-table`.

Respuesta mala: "Añado `!important` hasta que funciona." — Eso sobreescribe todo pero no explica por qué la regla no se aplica, y crea un problema en cascada para la siguiente persona.
