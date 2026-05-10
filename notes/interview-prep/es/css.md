# CSS — Preguntas de entrevista

## Box model

**¿Qué es `box-sizing: border-box` y por qué siempre lo añades al principio?**
Por defecto, `width` en CSS no incluye el padding ni el borde — así que un elemento con `width: 200px` y `padding: 20px` acaba midiendo 240px, lo que es confuso. `border-box` cambia el cálculo para que el padding y el borde estén incluidos dentro del ancho. Siempre lo añado en el reset al principio de `styles.css` para que todos los elementos se comporten de forma predecible.

**¿Qué es un CSS reset y qué problema soluciona?**
Los navegadores aplican sus propios estilos por defecto — márgenes en los títulos, padding en las listas, tamaños de fuente diferentes. Un reset los elimina para que la aplicación se vea igual en todos los navegadores. Siempre uso `margin: 0; padding: 0; box-sizing: border-box` en `*` al principio de `styles.css`.

---

## CSS variables

**¿Qué son las custom properties de CSS y por qué las usas?**
Variables que defines una vez y reutilizas en cualquier parte — `--primary: #e8572a` en `:root`, luego `color: var(--primary)` en cualquier sitio. Si el diseño cambia, actualizas una sola línea. Las uso en todos los proyectos para colores, espaciado y sombras para no tener números mágicos dispersos por el archivo.

**¿Qué es `:root` y por qué declaras las variables allí?**
`:root` es el elemento de mayor nivel de la página — equivalente a `html` pero con mayor especificidad. Las variables declaradas allí son globales y están disponibles en cualquier elemento. Si las declaras dentro de un componente o clase, solo funcionan dentro de ese ámbito.

---

## Flexbox

**¿Cuál es la diferencia entre `justify-content` y `align-items`?**
`justify-content` controla la alineación en el eje principal — horizontal por defecto. `align-items` controla el eje secundario — vertical por defecto. Los ejes se invierten cuando usas `flex-direction: column`. Uso `justify-content: space-between` en las navbars para separar los elementos a cada lado, y `align-items: center` casi en todas partes para centrar el contenido verticalmente.

**¿Qué hace `flex: 1`?**
Le dice al elemento que crezca para ocupar todo el espacio disponible en el contenedor flex. En una barra de búsqueda con un input y un botón en fila, `flex: 1` en el input hace que ocupe el espacio restante después de que el botón tome su ancho natural.

**¿Cuándo eliges flexbox en lugar de grid?**
Flexbox es para layouts unidimensionales — una fila de botones, una navbar, una barra de búsqueda, el layout interno de una tarjeta. Grid es para layouts bidimensionales — una cuadrícula de tarjetas, una página con sidebar y contenido, un formulario con dos columnas. Si todo está en una sola fila o columna, flexbox es más simple.

---

## CSS Grid

**¿Qué hace `grid-template-columns: 1fr 1fr`?**
Crea dos columnas que cada una ocupa una parte igual del espacio disponible. `1fr` significa "una fracción del espacio libre". Lo uso para layouts de formularios de dos columnas dentro de diálogos — dos campos uno al lado del otro.

**¿Qué hace `grid-column: 1 / -1`?**
Hace que un elemento ocupe desde la primera columna hasta la última, independientemente de cuántas columnas haya. Lo uso en el campo de descripción de un formulario de dos columnas para que ocupe todo el ancho, y en la fila de botones de acción.

**¿Qué es `repeat(auto-fill, minmax(250px, 1fr))` y por qué es útil?**
Crea tantas columnas como quepan en el contenedor, cada una con un mínimo de 250px de ancho. En una pantalla grande obtienes 4 columnas; en una tablet 2 o 3; en móvil solo 1 — sin necesitar media queries. Es la forma más simple de construir una cuadrícula de tarjetas responsive.

**¿Cuándo eliges grid en lugar de flexbox?**
Cuando necesitas controlar filas y columnas al mismo tiempo. Una cuadrícula de tarjetas, un dashboard con paneles, o un formulario donde los campos se alinean tanto horizontal como verticalmente — grid maneja todo eso limpiamente. Flexbox requeriría anidación y trucos.

---

## Posicionamiento

**¿Cuál es la diferencia entre `position: relative` y `position: absolute`?**
`relative` mantiene el elemento en el flujo normal pero te permite desplazarlo con `top`, `left`, etc. `absolute` elimina el elemento del flujo y lo posiciona relativo a su ancestro más cercano con `position: relative`. Uso este patrón para badges — la tarjeta tiene `position: relative`, el badge tiene `position: absolute; top: 0.75rem; right: 0.75rem`.

**¿Qué es `position: fixed` y cuándo lo usas?**
Fija el elemento al viewport — no se desplaza con la página. Lo uso para overlays de modales: `position: fixed; inset: 0` cubre toda la pantalla y permanece allí mientras el usuario hace scroll.

**¿Qué es `position: sticky` y cuándo es útil?**
El elemento se desplaza normalmente hasta que alcanza una posición definida, luego se queda fijo. Lo uso para cabeceras — `position: sticky; top: 0` para que la cabecera permanezca visible mientras el usuario baja por la página.

**¿Qué es `z-index` y cuándo lo necesitas?**
Controla qué elemento aparece encima cuando los elementos se solapan. Mayor valor = más arriba. Solo funciona en elementos con un `position` distinto de `static`. Uso una escala: 100 para navbars, 200 para menús desplegables, 1000 para modales, 9999 para tooltips.

---

## Diseño responsive

**¿Qué es mobile-first y por qué es el enfoque recomendado?**
Escribes los estilos base para móvil primero, luego añades media queries con `@media (min-width)` para ajustar el layout en pantallas más grandes. Es el enfoque recomendado porque te obliga a empezar con el layout esencial y añadir complejidad solo cuando hay espacio para ella — el resultado es más limpio y carga más rápido en móvil.

**¿Qué es una media query?**
Un bloque de CSS que solo se aplica cuando una condición es verdadera — normalmente el ancho de pantalla. `@media (min-width: 768px)` se aplica a tablets y pantallas más grandes. Uso dos breakpoints principales: `768px` para tablet, `1024px` para escritorio.

---

## Animaciones y transiciones

**¿Cuál es la diferencia entre `transition` y una animación con `@keyframes`?**
`transition` es para cambios de estado simples — efectos hover, mostrar/ocultar un elemento. Defines el inicio y el final, CSS maneja el movimiento. `@keyframes` es para animaciones más complejas que se repiten o tienen múltiples pasos — como un spinner de carga. Uso `transition` para efectos hover en tarjetas y `@keyframes` para el spinner CSS.

**¿Por qué pones `transition` en el elemento base y no en `:hover`?**
Si lo pones en `:hover`, la animación solo se reproduce al entrar en el estado hover — la vuelta (al salir) es instantánea. Si lo pones en el elemento base, la transición se reproduce suavemente en ambas direcciones.

---

## Tipografía

**¿Cuál es la diferencia entre `rem` y `px`?**
`px` es un tamaño fijo. `rem` es relativo al tamaño de fuente raíz — por defecto `1rem = 16px`. Usar `rem` para los tamaños de fuente respeta la preferencia de tamaño de fuente del navegador del usuario, lo que importa para la accesibilidad. Uso `rem` para todo: `1rem` para el texto del cuerpo, `1.5rem` para los títulos, `0.875rem` para las etiquetas pequeñas.

**¿Cómo cortas texto largo con `...` en CSS?**
Tres propiedades juntas: `white-space: nowrap` para mantener el texto en una sola línea, `overflow: hidden` para ocultar lo que sale fuera del contenedor, y `text-overflow: ellipsis` para añadir los `...`. El contenedor también necesita un ancho fijo o máximo — de lo contrario no hay nada que desborde.

---

## Unidades

**¿Cuál es la diferencia entre `rem` y `em`?**
`rem` siempre es relativo al tamaño de fuente raíz (`1rem = 16px` por defecto) — es consistente y predecible. `em` es relativo al tamaño de fuente del elemento padre, que se acumula con el anidamiento y se vuelve difícil de controlar. Uso `rem` para todo: tamaños de fuente, padding, gap. `em` casi nunca es necesario.

**¿Cuándo usas `vh` y `vw`?**
Cuando necesitas un tamaño relativo al viewport, no al elemento padre. `100vh` ocupa toda la altura de la pantalla — lo uso en layouts de página completa como la página de login y el contenedor del sidenav. `vw` es menos común pero útil con `clamp()` para tamaños de fuente fluidos.

**¿Qué es `fr` y dónde funciona?**
`fr` significa "fracción del espacio libre disponible" y solo funciona dentro de CSS Grid. `1fr 1fr` crea dos columnas iguales; `250px 1fr` crea un sidebar fijo con un área de contenido fluida. Fuera de `grid-template-columns` o `grid-template-rows`, `fr` no hace nada.

---

## Colores y opacidad

**¿Cuál es la diferencia entre `opacity` y `rgba`?**
`opacity` hace que todo el elemento sea transparente — el elemento, su texto, sus bordes y todos sus hijos se desvanecen juntos. `rgba` solo hace transparente el color de fondo — el texto dentro permanece completamente opaco. Uso `rgba` para overlays y sombras, y `opacity` para estados desactivados donde quiero que todo se desvanezca.

**¿Qué es `currentColor`?**
Una palabra clave CSS que hace referencia al propio valor `color` del elemento. Útil cuando quieres que un borde o icono coincida automáticamente con el color del texto — `border: 1px solid currentColor` se actualiza solo cada vez que cambia `color`.

---

## Selectores

**¿Cuál es la diferencia entre `.parent .child` y `.parent > .child`?**
`.parent .child` (descendiente) coincide con cualquier `.child` a cualquier profundidad dentro de `.parent`. `.parent > .child` (hijo directo) solo coincide con los elementos `.child` que están inmediatamente dentro de `.parent`, no con los nietos. Uso el selector de hijo directo cuando quiero evitar aplicar estilos accidentalmente a componentes anidados.

**¿Cuál es la diferencia entre una pseudo-clase y un pseudo-elemento?**
Las pseudo-clases (dos puntos simples: `:hover`, `:focus`, `:nth-child`) seleccionan un elemento según su estado o posición. Los pseudo-elementos (dobles dos puntos: `::before`, `::after`, `::placeholder`) seleccionan una parte específica de un elemento o insertan contenido generado. Los dobles dos puntos son la convención moderna — distinguen claramente los dos.

---

## Especificidad

**¿Cómo decide CSS qué regla gana cuando dos reglas se aplican al mismo elemento?**
Por puntuación de especificidad: los selectores ID puntúan 100, los selectores de clase/atributo/pseudo-clase puntúan 10, y los selectores de elemento puntúan 1. Gana la regla con la puntuación más alta. Si las puntuaciones son iguales, gana la que aparece más tarde en el archivo. En la práctica: una clase supera a un elemento, un ID supera a una clase.

**¿Por qué deberías evitar `!important`?**
Anula todas las reglas de especificidad, lo que hace que el CSS sea imposible de razonar — no puedes predecir qué regla gana leyendo el código. Una vez que lo usas, la única forma de anularlo es otro `!important`. Solo lo uso para combatir los estilos de librerías de terceros a los que no puedo acceder de otra manera.

---

## BEM

**¿Qué es BEM y qué problema soluciona?**
Una convención de nomenclatura — Bloque, Elemento, Modificador. Los bloques son componentes independientes (`.card`), los elementos son partes de un bloque (`.card__title`), y los modificadores son variaciones (`.card--featured`). Soluciona la especificidad y la inconsistencia en los nombres — cada regla es una sola clase, por lo que la especificidad se mantiene en `0-1-0` en todas partes y los nombres de clase son predecibles.

**¿Por qué BEM es menos necesario en Angular?**
La encapsulación de estilos de los componentes Angular ya limita el CSS automáticamente — `.card` en un componente no puede afectar a `.card` en otro. BEM fue inventado para solucionar el problema del ámbito global que Angular ya gestiona. Sigo usando las convenciones BEM en `styles.css` global y en los componentes compartidos donde no hay encapsulación.

---

## Bordes y sombras

**¿Cuál es la diferencia entre `border` y `outline`?**
`border` es parte del box model — ocupa espacio y afecta al layout. `outline` se sitúa fuera del borde y no ocupa espacio. Los navegadores añaden un `outline` por defecto en los elementos enfocados para la accesibilidad — si lo eliminas con `outline: none`, debes añadir un estilo de foco visible personalizado, de lo contrario los usuarios de teclado no pueden ver dónde están.

**¿Qué aspecto tiene `box-shadow` y cuáles son los valores clave?**
`box-shadow: offset-x offset-y blur spread color`. Por ejemplo: `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` — sin desplazamiento horizontal, 4px abajo, 12px de desenfoque suave, negro semitransparente. Siempre uso `rgba` para el color para que la sombra sea transparente. Añadir `inset` hace que la sombra aparezca dentro del elemento.

---

## Fondos

**¿Cuál es la diferencia entre `background-size: cover` y `contain`?**
`cover` rellena el contenedor completamente — la imagen puede recortarse pero no hay espacios vacíos. `contain` encaja toda la imagen dentro del contenedor — sin recorte pero puede dejar espacio vacío en los lados. Uso `cover` para las imágenes de tarjetas y las secciones hero donde una imagen recortada es mejor que el espacio vacío.

**¿Qué es `object-fit` y cuándo lo usas?**
Controla cómo un `<img>` rellena su contenedor cuando la imagen y el contenedor tienen diferentes proporciones. `object-fit: cover` rellena el contenedor y recorta si es necesario — el mismo comportamiento que `background-size: cover` pero para elementos `<img>`. Lo uso en imágenes de tarjetas con una altura fija: la imagen siempre rellena el espacio sin estirarse.

---

## Funciones CSS

**¿Qué hace `calc()` y por qué es útil?**
Calcula un valor CSS usando matemáticas — y, fundamentalmente, puedes mezclar unidades diferentes. `width: calc(100% - 250px)` significa "ancho completo menos el sidebar". Sin `calc()`, no puedes restar píxeles a un porcentaje en CSS.

**¿Qué hace `clamp()`?**
Bloquea un valor entre un mínimo y un máximo, con un valor preferido fluido en el medio — `clamp(1rem, 2.5vw, 2rem)`. El valor crece con el viewport pero nunca baja de `1rem` ni sube de `2rem`. Lo uso para tipografía fluida y espaciado sin necesitar media queries.

---

## Display y layout

**¿Cuál es la diferencia entre `inline`, `block` e `inline-block`?**
`block` ocupa todo el ancho del contenedor y siempre empieza en una línea nueva — `<div>`, `<p>`, `<h1>`. `inline` se sitúa en línea con el texto y solo ocupa el ancho de su contenido — `<span>`, `<a>`. Los elementos inline ignoran `width`, `height` y `margin` vertical. `inline-block` es un híbrido — se sitúa en el flujo del texto pero respeta el ancho, la altura y el margen vertical. Lo uso en `<a>` o `<span>` cuando necesito padding vertical en un elemento inline.

**¿Cuál es la diferencia entre `display: none` y `visibility: hidden`?**
Ambos ocultan el elemento visualmente, pero `display: none` lo elimina del layout por completo — el espacio que ocupaba desaparece y los demás elementos se mueven para ocuparlo. `visibility: hidden` mantiene el espacio reservado — el elemento es invisible pero los demás elementos se quedan en su sitio. Uso `visibility: hidden` cuando quiero ocultar un botón de acción al pasar el ratón sin que cambie la altura de la fila.

**¿Cómo centras un elemento vertical y horizontalmente?**
Dos enfoques comunes. Con flexbox: `display: flex; align-items: center; justify-content: center` en el padre — la opción más sencilla para la mayoría de layouts. Con posicionamiento absoluto: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`. El `top: 50%` mueve el borde superior del elemento al centro del padre, y luego `translate(-50%, -50%)` lo desplaza hacia atrás la mitad de su propio tamaño para que el centro del elemento coincida con el centro del padre.

---

## Preguntas de presión

**¿Qué error de CSS has cometido y cómo lo resolviste?**
Lo que realmente quieren saber: ¿Puedes depurar CSS y aprender de ello, o pruebas cosas al azar hasta que algo funciona?
R: En el task manager añadí un estilo que apuntaba a un elemento interno de un componente de Material dentro del CSS del componente y no tuvo efecto. Estuve buscando en el sitio equivocado. Entonces recordé la encapsulación de vistas de Angular — el CSS del componente no puede llegar al interior de los componentes de Material porque esos elementos no reciben el atributo de encapsulación. Moví la regla a `styles.css` y funcionó de inmediato. Ahora siempre compruebo si el elemento está en mi propia plantilla o se renderiza internamente antes de decidir dónde poner el CSS.
Respuesta mala: "Siempre pruebo en el navegador hasta que funciona." — Eso no es depurar, es adivinar. El entrevistador quiere ver que entiendes por qué algo falla, no solo que encontraste un fix por casualidad.

---

## Específico de Angular

**¿Cómo funciona la encapsulación de estilos de los componentes Angular?**
Por defecto, Angular añade un atributo único a cada elemento de un componente y limita el CSS del componente para que solo coincida con esos atributos. Los estilos en `task-list.component.css` solo se aplican dentro de ese componente — no pueden filtrarse a otros componentes. Esto evita conflictos de estilos en aplicaciones grandes.

**¿Cuándo usas `styles.css` en lugar del CSS del componente?**
Para estilos que deben aplicarse globalmente — el reset, las variables CSS en `:root`, las importaciones de fuentes, las sobreescrituras del tema de Material. También para los internos de las directivas de Angular Material — la encapsulación de Angular impide que el CSS del componente llegue al interior de los componentes de Material, así que esas sobreescrituras deben ir en `styles.css`.
