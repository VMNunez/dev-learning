# JavaScript — Preguntas de entrevista

## Variables y scope

**¿Cuál es la diferencia entre `var`, `let` y `const`?**

`var` tiene scope de función y se eleva (hoisting) — se puede acceder antes de su declaración (como `undefined`) y se escapa de los bloques. `let` y `const` tienen scope de bloque y permanecen en la Zona Muerta Temporal hasta su línea de declaración. `const` no se puede reasignar. Siempre uso `const` por defecto y `let` solo cuando necesito reasignar. Nunca uso `var` — su comportamiento de scope es impredecible.

> **Consejo de entrevista:** Empieza con la regla práctica — "Siempre uso `const`, `let` solo cuando necesito reasignar, nunca `var`." Luego explica por qué `var` es problemático. El entrevistador quiere saber que tienes un hábito, no solo que conoces la definición.

**¿Qué es el hoisting?**

JavaScript mueve las declaraciones de variables y funciones al principio de su scope antes de ejecutar el código. Las declaraciones con `var` se elevan e inicializan como `undefined`. `let` y `const` se elevan pero no se inicializan — acceder a ellas antes de su declaración lanza un `ReferenceError` (Zona Muerta Temporal). Las declaraciones de función se elevan completamente — puedes llamarlas antes de que aparezcan en el código.

> **Consejo de entrevista:** La distinción clave es entre elevar la *declaración* (siempre ocurre) y elevar la *inicialización* (solo `var`). Menciona la Zona Muerta Temporal por su nombre — demuestra que entiendes el mecanismo, no solo el síntoma.

**¿Qué es un closure?**

Un closure es una función que retiene el acceso a las variables de su scope externo, incluso después de que la función exterior ha terminado de ejecutarse. En el HR portal, cada señal `computed()` es un closure — `computed(() => this.employees().filter(e => e.department === this.selectedDept()))` cierra sobre ambas señales. Cuando cualquiera de las dos cambia, el computed se vuelve a ejecutar con los valores correctos porque mantiene una referencia al scope exterior, no una copia de los valores en el momento de creación.

Respuesta mala: "Es cuando una función está dentro de otra función." — Falta la idea clave: la función interior *retiene el acceso* a las variables exteriores incluso después de que la función exterior ha terminado. La palabra "retener" es lo que hace que sea un closure.

**¿Cuál es la diferencia entre scope de función y scope de bloque?**

`var` crea variables con scope de función — existen en toda la función aunque se declaren dentro de un bloque `if`. `let` y `const` crean variables con scope de bloque — solo existen dentro del `{}` donde se declararon. El scope de bloque evita el acceso accidental a variables fuera de su área prevista.

> **Consejo de entrevista:** Da el ejemplo concreto — "Si declaro `var x = 10` dentro de un bloque `if`, `x` sigue siendo accesible después del bloque. Con `let`, lanza un ReferenceError." Los ejemplos concretos son mejores que las reglas abstractas en entrevistas.

---

## Tipos

**¿Cuál es la diferencia entre `==` y `===`?**

`===` es igualdad estricta — compara valor Y tipo, sin conversión. `==` es igualdad laxa — convierte los tipos antes de comparar, lo que produce resultados sorprendentes como `0 == '0'` siendo `true`. Siempre uso `===` para evitar bugs ocultos por la coerción de tipos.

> **Consejo de entrevista:** Da un ejemplo sorprendente — `null == undefined` es `true` con `==` pero `false` con `===`. Luego di tu regla: siempre usar `===`. Breve y claro.

**¿Cuál es la diferencia entre `null` y `undefined`?**

`undefined` significa que una variable fue declarada pero nunca asignada — JavaScript lo establece automáticamente. `null` significa que un valor fue intencionalmente establecido como "sin valor" por el desarrollador. En Angular uso `signal<Employee | null>(null)` para representar "nada seleccionado aún" — eso es un null intencional.

> **Consejo de entrevista:** Enfatiza la *intención*: `undefined` es JavaScript diciendo "olvidaste asignar esto", `null` eres tú diciendo "esto intencionalmente no tiene valor". Esa distinción es lo que buscan los entrevistadores.

**¿Qué son los valores truthy y falsy?**

En un contexto booleano, cada valor es truthy o falsy. Los valores falsy son exactamente seis: `false`, `0`, `''`, `null`, `undefined` y `NaN`. Todo lo demás es truthy — incluyendo los arrays vacíos `[]` y los objetos vacíos `{}`. Esto importa al escribir condiciones — `if (employees.length)` es truthy solo cuando hay elementos.

> **Consejo de entrevista:** La trampa común son `[]` y `{}` — los candidatos asumen que son falsy porque están "vacíos". Son truthy. Dilo explícitamente — "los arrays y objetos vacíos son truthy, lo que sorprende a la gente."

**¿Cuál es la diferencia entre `??` y `||`?**

`||` devuelve el lado derecho cuando el izquierdo es cualquier valor falsy — incluyendo `0`, `false` y `''`, lo que puede causar bugs cuando esos son valores válidos. `??` (nullish coalescing) solo se activa con `null` o `undefined`. Uso `??` en Angular cuando leo de localStorage: `JSON.parse(localStorage.getItem('user') ?? 'null')` — `??` maneja correctamente el caso en que la clave no existe.

Respuesta mala: "Son básicamente lo mismo." — Solo son iguales cuando el lado izquierdo siempre es `null` o `undefined`. La diferencia importa cuando `0` o `''` son valores válidos.

**¿Cuál es la diferencia entre `typeof` y `instanceof`?**

`typeof` devuelve un string describiendo el tipo de un primitivo — `typeof 'hello'` da `'string'`, `typeof 42` da `'number'`. `instanceof` comprueba si un objeto fue creado por una clase específica — `error instanceof ValidationError` devuelve `true`. El caso especial importante: `typeof null` devuelve `'object'`, que es un bug conocido de JavaScript desde su implementación original. Para comprobar si un valor es null, usa `value === null`. Uso `instanceof` en bloques `catch` para distinguir diferentes tipos de errores.

> **Consejo de entrevista:** Menciona el caso de `typeof null === 'object'` — siempre sale y demuestra que conoces el lenguaje real, no solo la teoría. Todo desarrollador de JavaScript debería saber este caso.

---

## Funciones

**¿Cuál es la diferencia entre una función normal y una arrow function?**

Las arrow functions son más cortas y no tienen su propio `this` — heredan el `this` del scope circundante. Las funciones normales tienen su propio `this` que depende de cómo se llama la función. En Angular uso arrow functions para callbacks de arrays (`employees.filter(e => e.active)`) y para callbacks de señales (`computed(() => ...)`) donde necesito el `this` del componente.

> **Consejo de entrevista:** La diferencia con `this` es lo que más importa en la práctica. Di: "Las arrow functions son las que uso para callbacks y signals computed en Angular — porque heredan el `this` del componente, así puedo acceder a las propiedades del componente dentro de ellas."

**¿Qué es `this` y por qué es complicado en JavaScript?**

`this` hace referencia al objeto que llamó a la función — su valor cambia según cómo se llama la función, no dónde está definida. Un método llamado directamente tiene el objeto como `this`. Una función llamada de forma independiente tiene `undefined` (modo estricto) o `window`. Las arrow functions evitan esto al no tener su propio `this` — usan el `this` del scope externo. En Angular por eso los callbacks de arrays y de signals siempre usan arrow functions — `computed(() => this.tasks().filter(...))` funciona correctamente porque la arrow function hereda el `this` del componente. Con `function` normal, el contexto se perdería.

Respuesta mala: "this es el objeto actual." — Demasiado vago. El punto es que `this` cambia según *cómo* se llama la función, no dónde está definida. Una función normal pasada como callback pierde su `this`.

**¿Cuándo definirías una función con `function` en lugar de una arrow function?**

Cuando necesito una función que tenga su propio `this` — por ejemplo, un método en una clase o una función generadora. Las arrow functions no se pueden usar como constructores (`new arrowFn()` lanza un error) y no tienen objeto `arguments`. En Angular, todos los métodos de clase de los componentes usan la sintaxis de método normal y TypeScript gestiona `this` correctamente dentro de la clase. Las arrow functions son para callbacks y funciones de una sola línea.

Respuesta mala: "Siempre uso arrow functions." — Demuestra que no sabes cuándo las funciones normales son la herramienta correcta. Las arrow functions no se pueden usar como constructores y el objeto `arguments` no está disponible en ellas.

---

## Bucles

**¿Cuál es la diferencia entre `for...of` y `for...in`?**

`for...of` itera sobre los **valores** de un iterable — arrays, strings, Sets, Maps. `for...in` itera sobre las **claves** (nombres de propiedades) de un objeto. Usar `for...in` en un array te da strings de índice (`'0'`, `'1'`, `'2'`), no los valores — eso casi nunca es lo que quieres. Uso `for...of` cuando necesito recorrer con `break` o `continue` y los métodos de array no son suficientes. Para las claves de un objeto prefiero `Object.keys()` porque es más explícito.

> **Consejo de entrevista:** "Uso `for...of`, no `for...in`, en arrays." Esa frase demuestra que conoces la trampa. Luego explica: `for...in` da strings de índice, no los valores reales, y puede recoger propiedades heredadas.

Respuesta mala: "Siempre uso métodos de array como map y filter." — Buen instinto, pero demuestra que no sabes cuándo `for...of` es la herramienta correcta — por ejemplo, cuando necesitas salir antes con `break`.

**¿Cuándo usarías un bucle `for` tradicional en lugar de `map` o `filter`?**

Cuando necesito salir del bucle antes con `break` — `map` y `filter` siempre iteran el array completo. Un bucle `for` o `for...of` me permite detenerme en cuanto encuentro lo que necesito. También usaría un bucle `for` para generar un número fijo de elementos, como rellenar un array con filas de relleno. En Angular casi siempre uso métodos de array porque encadenan bien con las señales `computed()`, pero saber cuándo un bucle es más eficiente es importante.

Respuesta mala: "Nunca uso bucles `for`." — Demuestra falta de flexibilidad. Salir antes con `break` es una razón real y legítima para usar un bucle.

---

## Métodos de array

**¿Cuál es la diferencia entre `map`, `filter` y `reduce`?**

`map` transforma cada elemento y devuelve un nuevo array del mismo tamaño. `filter` mantiene solo los elementos que pasan un test y devuelve un array más corto. `reduce` acumula todos los elementos en un único valor — un número, un objeto u otro array. Los uso constantemente en las señales `computed()` de Angular para derivar listas filtradas y transformadas a partir de datos crudos.

> **Consejo de entrevista:** Da el modelo mental en una palabra: `map` = transformar, `filter` = conservar, `reduce` = combinar. Luego da un ejemplo de cada uno. Los entrevistadores quieren ver que puedes aplicarlos, no solo nombrarlos.

**¿Cuál es la diferencia entre `find` y `filter`?**

`find` devuelve el primer elemento que coincide o `undefined` — se usa cuando necesitas un elemento específico. `filter` siempre devuelve un array — se usa cuando necesitas todos los elementos que coinciden. Uso `find` para buscar un empleado por ID antes de editarlo, y `filter` para construir listas filtradas en la tabla.

> **Consejo de entrevista:** Menciona los tipos de retorno: `find` devuelve un elemento o `undefined`, `filter` siempre devuelve un array (aunque esté vacío). Esa es la diferencia práctica que comprueban los entrevistadores.

**¿Qué hace `some` y cuándo lo usas?**

`some` devuelve `true` si al menos un elemento pasa el test. Su complemento es `every`, que devuelve `true` solo si TODOS los elementos pasan el test. Uso `some` para la comprobación de duplicados antes de guardar — `employees.some(e => e.email === newEmail)` — y `every` para comprobar si todas las tareas están completas — `tasks.every(t => t.done)`.

> **Consejo de entrevista:** Da un caso de uso concreto de inmediato: "Uso `some` para comprobar si un email ya existe antes de añadir un nuevo empleado." Es más convincente que solo la definición.

**¿Cuál es la diferencia entre `forEach` y `map`?**

`forEach` itera el array y ejecuta una función por cada elemento — siempre devuelve `undefined`. `map` hace lo mismo pero recoge el valor de retorno de cada llamada en un nuevo array. Usa `map` cuando necesitas una versión transformada del array. Usa `forEach` solo para efectos secundarios donde no necesitas un array nuevo — logging, actualizar el DOM o llamar a una función externa. En Angular casi siempre uso `map` porque necesito el resultado, no solo el efecto secundario.

> **Consejo de entrevista:** La regla clave: si necesitas un array nuevo, usa `map`. Si solo estás haciendo algo con cada elemento y no necesitas el resultado, usa `forEach`. En Angular casi siempre necesitarás `map`.

**¿Qué es `findIndex` y cuándo lo usarías en lugar de `find`?**

`findIndex` devuelve el índice del primer elemento que coincide — o `-1` si no hay ninguno — en lugar del elemento en sí. Lo uso cuando necesito la posición para actualizar o eliminar un elemento del array. Por ejemplo, para reemplazar un empleado en una lista sin reconstruir todo el array: `const index = list.findIndex(e => e.id === id); list[index] = updated`. Con `find` obtengo el objeto pero no puedo localizarlo en el array.

> **Consejo de entrevista:** El caso de uso más claro: quieres actualizar un elemento en un array. `find` te da el elemento pero no su posición. `findIndex` te da la posición para que puedas reemplazarlo.

**¿Por qué es peligroso llamar a `.sort()` directamente en un array que quieres mantener sin cambios?**

`sort` muta el array original — ordena en su lugar. Si lo llamas directamente sobre el valor de una señal en Angular, modificas el estado subyacente inesperadamente y causas bugs difíciles de encontrar. El patrón seguro es hacer spread primero: `[...employees()].sort((a, b) => a.name.localeCompare(b.name))`. La segunda trampa: el sort por defecto convierte los elementos a strings, así que `[10, 9, 2].sort()` da `[10, 2, 9]` porque `'10' < '2'` alfabéticamente. Siempre pasa un comparador cuando ordenes números.

Respuesta mala: "Uso sort directamente en el array." — `sort` muta. En Angular con señales, llamar a `sort` sobre el valor de la señal muta el estado silenciosamente — la señal nunca sabe que cambió.

---

## Objetos y desestructuración

**¿Qué es la desestructuración y cuándo la usas?**

La desestructuración extrae valores de arrays o propiedades de objetos en variables con nombre en una sola línea. `const { name, role } = employee` es más limpio que `const name = employee.name; const role = employee.role`. La uso constantemente en Angular — desestructurando parámetros de funciones, extrayendo valores de señales y desempaquetando resultados de `Promise.all`: `const [employees, departments] = await Promise.all([...])`.

> **Consejo de entrevista:** Menciona tanto la desestructuración de objetos como de arrays — los candidatos a menudo solo conocen una. El ejemplo `const [a, b] = await Promise.all([...])` es memorable y muestra uso real.

**¿Qué hace el operador spread con los objetos?**

Crea una copia superficial del objeto. `{ ...employee, role: 'manager' }` crea un nuevo objeto con todas las propiedades de employee, con `role` sobreescrito. Lo uso para actualizar una señal de forma inmutable: `employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e))` — sin mutación, solo un nuevo objeto con los valores actualizados.

Respuesta mala: "Copia el objeto." — Verdad pero incompleto. El entrevistador quiere escuchar "copia superficial", e idealmente que sabes que los objetos anidados siguen siendo referencias. "Superficial" es la palabra clave.

**¿Qué es el optional chaining y por qué es útil?**

`?.` accede de forma segura a una propiedad anidada sin lanzar un error si un valor intermedio es `null` o `undefined`. En lugar de `user && user.address && user.address.city` escribes `user?.address?.city`. En Angular lo uso cuando los datos pueden no haberse cargado aún — `selectedEmployee()?.name` devuelve `undefined` en lugar de crashear si no hay nada seleccionado.

> **Consejo de entrevista:** La comparación antes/después es tu herramienta más fuerte: "Antes tenía que escribir `user && user.address && user.address.city`. Ahora escribo `user?.address?.city`." Eso demuestra que entiendes el problema que resuelve.

**¿Qué es `Object.freeze` y cuándo lo usarías?**

`Object.freeze` hace un objeto inmutable — sus propiedades no se pueden añadir, eliminar ni cambiar después de congelarlo. Lo uso para constantes de configuración que nunca deben cambiar — URLs de API, definiciones de roles, listas de estados. La diferencia clave con `const`: `const` evita reasignar la variable, pero todavía puedes mutar el objeto al que apunta. `Object.freeze` evita las mutaciones en las propiedades del objeto en sí.

Respuesta mala: "Es lo mismo que const." — No. `const` evita reasignar la variable. `Object.freeze` evita la mutación de las propiedades del objeto. `const config = {}; config.url = 'x'` es válido — `const` no protege las propiedades.

---

## Async

**¿Qué es el event loop?**

JavaScript es single-threaded — ejecuta una cosa a la vez. El event loop gestiona las operaciones asíncronas: primero se ejecuta el código síncrono, luego todas las microtareas (callbacks de Promise) y después una tarea de la cola de tareas (setTimeout, etc.). Por eso una Promise se resuelve antes que un `setTimeout` con 0ms de retraso — las Promises van a la cola de microtareas que tiene mayor prioridad. En Angular esto importa cuando usas `setTimeout(() => {}, 0)` para diferir algo hasta después del ciclo de renderizado actual — el event loop es la razón por la que ese truco funciona.

> **Consejo de entrevista:** La pregunta de orden — "¿Qué se imprime primero: `Promise.resolve().then(...)` o `setTimeout(..., 0)`?" — es un clásico. La respuesta es el callback de la Promise, porque las microtareas se ejecutan antes que las tareas. Saber esto demuestra que entiendes el event loop, no solo que existe.

**¿Cuál es la diferencia entre Promise y async/await?**

`async/await` es sintaxis sobre las Promises — hace que el código asíncrono parezca síncrono. Una función marcada con `async` siempre devuelve una Promise. `await` pausa la ejecución dentro de la función async hasta que la Promise se resuelve. El resultado es el mismo que las cadenas `.then()` pero mucho más legible, y los errores se capturan con `try/catch` normal. Uso async/await en Angular cuando convierto un Observable a Promise con `firstValueFrom()`.

> **Consejo de entrevista:** Enfatiza que no son cosas diferentes — `async/await` SON Promises, solo con sintaxis más limpia. La diferencia práctica es la legibilidad y el manejo de errores con `try/catch` en lugar de cadenas `.catch()`.

**¿Cuál es la diferencia entre llamadas async secuenciales y paralelas?**

Secuencial: `const a = await fetchA(); const b = await fetchB()` — B espera a que A termine. Paralela: `const [a, b] = await Promise.all([fetchA(), fetchB()])` — ambas empiezan al mismo tiempo y esperas por las dos. En Angular uso `forkJoin` para llamadas HTTP paralelas — el equivalente RxJS de `Promise.all`. Prefiero siempre la ejecución paralela cuando las llamadas son independientes.

Respuesta mala: "Siempre uso await uno por uno." — Demuestra que no sabes que la ejecución secuencial es más lenta cuando las llamadas no dependen entre sí. `Promise.all` es la herramienta correcta para llamadas paralelas independientes.

**¿Qué es el callback hell y cómo lo resolvieron las Promises?**

El callback hell ocurre cuando los callbacks asíncronos se anidan unos dentro de otros — tres o cuatro niveles de profundidad, el código parece una pirámide y el manejo de errores se vuelve casi imposible porque cada callback tiene que reenviar los errores manualmente. Las Promises lo resolvieron permitiéndote devolver la siguiente Promise dentro de `.then()` en lugar de anidar — la cadena se mantiene plana. `async/await` lo hizo aún más limpio — parece código síncrono con un `try/catch` normal.

> **Consejo de entrevista:** Si el entrevistador pregunta esto, quiere ver que entiendes POR QUÉ existen los patrones async modernos, no solo cómo usarlos. Nombra el problema (callbacks anidados, sin manejo de errores compartido), luego la solución (cadenas de Promises + async/await).

**¿Cuál es la diferencia entre `Promise.all` y `Promise.allSettled`?**

`Promise.all` rechaza inmediatamente si ALGUNA de las promesas falla — un error lo detiene todo. `Promise.allSettled` espera a que TODAS las promesas se completen independientemente del resultado y te da un array de resultados con un campo `status` (`'fulfilled'` o `'rejected'`). Uso `Promise.all` cuando todas las operaciones deben tener éxito — si una falla, todo debe fallar. Uso `Promise.allSettled` cuando necesito resultados parciales — por ejemplo, cargar varias secciones independientes donde un fallo no debería impedir que las demás se muestren.

Respuesta mala: "Siempre uso Promise.all." — Demuestra que no sabes que un rechazo lo aborta todo. `Promise.allSettled` es la herramienta correcta cuando el éxito parcial es aceptable.

---

## Strings, números y métodos built-in

**¿Qué métodos de string usas más a menudo y por qué?**

`includes()` para búsquedas, `split()` para convertir un string a array (y `join()` para volver atrás), `trim()` para limpiar la entrada del usuario antes de guardar, y los template literals para construir cualquier string con valores embebidos. En Angular también uso `.slice()` para truncar texto largo en la vista y `.toUpperCase()` / `.toLowerCase()` para normalizar antes de comparar.

> **Consejo de entrevista:** No solo los enumeres — di *por qué* usas cada uno. "Uso `trim()` antes de guardar cualquier entrada del usuario porque los espacios al inicio/final causan bugs en la comprobación de duplicados." Eso demuestra que piensas en la calidad de los datos, no solo en la sintaxis.

**¿Cuál es la diferencia entre `parseInt` y `Number()`?**

`parseInt` se detiene en el primer carácter no numérico — `parseInt('42px')` da `42`. `Number()` convierte el string completo y devuelve `NaN` si algo no es válido — `Number('42px')` da `NaN`. Uso `Number()` cuando la entrada debe ser un número limpio, y `parseInt` cuando parseo valores como tamaños CSS o respuestas de API que mezclan números con unidades.

> **Consejo de entrevista:** La regla práctica: usa `Number()` por defecto porque es estricto. Solo usa `parseInt` cuando sepas que el string tiene un número válido seguido de caracteres no numéricos que quieres ignorar.

**¿Por qué `0.1 + 0.2` no es igual a `0.3` en JavaScript?**

Porque JavaScript usa coma flotante de 64 bits (IEEE 754), y algunos decimales no pueden representarse exactamente en binario — la misma limitación existe en Java, Python y la mayoría de lenguajes. Para mostrar datos uso `.toFixed(2)` para redondear. Para cálculos financieros trabajo en enteros (céntimos en vez de euros) para evitar el problema por completo.

> **Consejo de entrevista:** El movimiento clave es decir que no es un bug de JavaScript — afecta a Java, Python y la mayoría de lenguajes. Luego da la solución práctica: `.toFixed(2)` para mostrar, aritmética con enteros para cálculos. Eso demuestra que piensas en soluciones, no solo en problemas.

---

## Objetos y módulos

**¿Qué hace `Object.entries()` y cuándo es útil?**

Devuelve un array de pares `[clave, valor]` de un objeto — básicamente permite usar métodos de array sobre un objeto. Lo uso cuando necesito iterar un objeto y transformar o filtrar sus entradas, por ejemplo para convertir un objeto de configuración en un `Map` o construir una query string a partir de un objeto de parámetros.

> **Consejo de entrevista:** El patrón práctico es `Object.entries(obj).map(([key, value]) => ...)`. Desestructuras cada par dentro del `map`. Esta combinación — entries + métodos de array + desestructuración — es lo que los entrevistadores quieren ver.

**¿Cuál es la diferencia entre named exports y default exports? ¿Cuál usa Angular?**

Los named exports permiten múltiples exports por archivo y el nombre del import debe coincidir exactamente — `export class EmployeeService` → `import { EmployeeService }`. Los default exports solo permiten uno por archivo y el nombre del import es arbitrario. Angular siempre usa named exports — son más seguros para refactorizar (los editores los renombran automáticamente), habilitan el tree-shaking y son la convención en todo el ecosistema.

> **Consejo de entrevista:** Menciona el tree-shaking — los named exports permiten al bundler eliminar código no utilizado. Los default exports son más difíciles de analizar estáticamente. Esa es una razón concreta por la que Angular eligió los named exports como convención.

**¿Qué son `JSON.stringify` y `JSON.parse` y dónde los usas?**

`JSON.stringify` convierte un objeto JavaScript a un string JSON — necesario para guardar objetos en localStorage o enviarlos en el cuerpo de una petición HTTP. `JSON.parse` hace lo contrario — convierte un string JSON de vuelta a un objeto. En el HR portal uso ambos para el patrón de persistencia en localStorage: `effect(() => localStorage.setItem('user', JSON.stringify(this.user())))` para guardar, y `JSON.parse(localStorage.getItem('user') ?? 'null')` para restaurar. `JSON.parse` puede lanzar un error si el string no es JSON válido, por eso siempre lo envuelvo en `try/catch`.

> **Consejo de entrevista:** Menciona el `try/catch` alrededor de `JSON.parse` — demuestra que piensas en el caso de error. También menciona lo que JSON no puede serializar: `undefined`, funciones, objetos `Date`. Las fechas se convierten en strings, `undefined` se descarta silenciosamente.

**¿Qué significa tree-shaking y por qué Angular usa named exports?**

El tree-shaking es cuando el bundler (esbuild en Angular) elimina el código que se exporta pero nunca se importa en ningún sitio. Los named exports lo hacen posible — el bundler puede analizar estáticamente qué exports se usan. Los default exports son más difíciles de analizar porque el nombre del import es arbitrario. Angular usa named exports para cada componente, servicio, pipe y guard, de modo que los builds de producción solo incluyen el código que realmente se usa.

> **Consejo de entrevista:** Relaciónalo con el tamaño del bundle — "el tree-shaking mantiene el bundle de producción pequeño eliminando el código muerto." Luego di que la convención de Angular de named exports es lo que hace que el tree-shaking sea efectivo. Esta es una respuesta de decisión, no solo una definición.

---

## Clases y manejo de errores

**¿Qué hace `extends` y cuándo usas la herencia de clases?**

`extends` hace que una clase herede todas las propiedades y métodos de una clase padre. `super()` llama al constructor del padre. En Angular lo uso al crear clases de error personalizadas que extienden `Error`, y cuando un componente extiende una clase base para compartir lógica común. En Java la herencia es central en el lenguaje — entenderla en JavaScript primero hace que la versión en Java sea más fácil de aprender.

> **Consejo de entrevista:** Prepárate para decir *cuándo no* usar herencia — "La uso para clases de error y componentes base, pero prefiero composición sobre herencia en la mayoría de los casos. La herencia tiene sentido cuando hay una relación clara de 'es-un'."

**¿Cuál es la diferencia entre una clase y una función normal en JavaScript?**

Una clase es una sintaxis más limpia para crear objetos con comportamiento compartido — tiene un `constructor`, métodos y soporta `extends` para la herencia. Por debajo, las clases de JavaScript siguen usando prototipos, pero la sintaxis es mucho más cercana a Java o C#. En Angular cada componente, servicio, pipe y guard es una clase con un decorador — el decorador añade los metadatos que Angular necesita para usarla.

> **Consejo de entrevista:** Menciona que bajo el capó las clases siguen siendo basadas en prototipos — "las clases son azúcar sintáctico sobre prototipos." Los entrevistadores a veces preguntan esto como seguimiento para probar un conocimiento más profundo.

**¿Qué es `try/catch/finally` y cuándo usas `finally`?**

`try` contiene el código que puede fallar, `catch` maneja el error, y `finally` siempre se ejecuta independientemente del resultado. Uso `finally` para resetear el estado de carga — en el HR portal el patrón es `try { this.isLoading.set(true); ... } catch { this.hasError.set(true); } finally { this.isLoading.set(false); }`. Sin `finally`, el spinner se quedaría en pantalla para siempre si la petición falla.

> **Consejo de entrevista:** El caso de uso de `finally` es la parte clave de la respuesta — "Sin `finally`, tendría que resetear `isLoading` tanto en `try` como en `catch`, y podría olvidar uno. `finally` siempre se ejecuta, por lo que es el lugar seguro para la limpieza."

**¿Cuál es la diferencia entre `throw new Error()` y `throw 'mensaje'`?**

`throw new Error()` crea un objeto Error con `message`, `name` y un stack trace — puedes ver exactamente dónde se lanzó. `throw 'mensaje'` lanza un string plano — sin stack trace, sin información de tipo, más difícil de capturar y depurar. Siempre lanza objetos Error.

> **Consejo de entrevista:** El stack trace es la clave — "Cuando lanzo un string, pierdo el stack trace y no puedo comprobar `error instanceof SomethingError` en el bloque catch." Esas dos cosas juntas son la razón por la que siempre se lanzan objetos Error.

**¿Cuándo crearías una clase de error personalizada en lugar de lanzar `new Error()`?**

Cuando el que llama necesita distinguir entre diferentes tipos de errores. Un `ValidationError` y un `HttpError` ambos extienden `Error`, pero en el bloque `catch` puedo comprobar `error instanceof ValidationError` y manejarlos de forma diferente — mostrar un mensaje de validación del formulario vs. un mensaje de error del servidor genérico. En Spring Boot (que también estoy aprendiendo), el mismo patrón existe — creas excepciones personalizadas que el controller advice mapea a códigos HTTP específicos.

Respuesta mala: "Usaría `new Error()` con un mensaje descriptivo." — Demuestra que no sabes que el bloque `catch` puede necesitar distinguir tipos de errores. Las clases de error personalizadas son la herramienta para eso.

---

## Sets y Maps

**¿Qué es un Set y cuándo lo usas?**

Una colección que solo almacena valores únicos — los duplicados se ignoran automáticamente. El uso más común es eliminar duplicados de un array: `[...new Set(departments)]` da una lista de nombres de departamento únicos. También es más rápido que `Array.includes()` para comprobar si un valor existe — `set.has()` es O(1), mientras que `array.includes()` recorre todo el array. En el HR portal uso este patrón para construir opciones de filtro únicas a partir de la lista de empleados.

> **Consejo de entrevista:** Nombra los dos casos de uso: deduplicación (`[...new Set(array)]`) y comprobaciones rápidas de pertenencia (`set.has()`). Luego di cuál usas más a menudo y por qué.

**¿Cuál es la diferencia entre un Set y un Array?**

Un Array permite duplicados y tiene acceso por índice (`arr[0]`). Un Set solo almacena valores únicos y no tiene índice — lo iteras o lo conviertes a array con `[...set]`. Usa un Array para listas ordenadas y transformaciones. Usa un Set cuando necesites valores únicos o comprobaciones de existencia rápidas.

> **Consejo de entrevista:** La diferencia de rendimiento importa en datasets grandes: `set.has(value)` es O(1) independientemente del tamaño. `array.includes(value)` es O(n) — comprueba cada elemento. Para arrays pequeños la diferencia es mínima, pero saberlo demuestra que piensas en eficiencia.

**¿Qué es un Map y en qué se diferencia de un objeto?**

Un Map es un almacén de pares clave-valor donde las claves pueden ser de cualquier tipo — no solo strings. También tiene un `.size` integrado, iteración garantizada en orden de inserción y `map.has()` para búsquedas de claves rápidas. En la práctica uso objetos planos para los modelos de datos. Un Map tiene sentido cuando las claves no son strings o cuando necesitas añadir y eliminar entradas con frecuencia.

> **Consejo de entrevista:** La regla práctica: "Uso un objeto plano para modelos de datos como `{ name, role, salary }`. Usaría un Map cuando las claves son dinámicas o no son strings — por ejemplo, mapear nodos del DOM a datos, o cachear resultados por referencia de objeto."

**¿Por qué usarías un Set en lugar de filtrar un array para obtener valores únicos?**

`[...new Set(array)]` es más limpio y directo que un filter con `indexOf`. Más importante aún, si necesito comprobar la pertenencia repetidamente — como al construir opciones de filtro en el HR portal — `set.has()` se ejecuta en O(1) mientras que `array.includes()` recorre todo el array cada vez. Para un dataset grande esa diferencia es real. Para una deduplicación puntual sobre un array pequeño, cualquiera de los dos enfoques funciona.

Respuesta mala: "Usaría filter." — No está mal para un caso pequeño, pero demuestra que no sabes por qué existe Set ni cuándo importa su ventaja de rendimiento.

---

## Expresiones regulares

**¿Qué es una expresión regular y cómo la usas en Angular?**

Una expresión regular es un patrón para validar, buscar o reemplazar texto. En Angular las uso con `Validators.pattern()` — por ejemplo `Validators.pattern(/^\d{9}$/)` valida que un campo de teléfono contenga exactamente 9 dígitos. Uso `.test()` cuando solo necesito una respuesta sí/no, y `.match()` cuando necesito extraer las partes que coinciden de un string.

> **Consejo de entrevista:** Conoce los dos métodos más comunes: `.test()` devuelve un booleano (úsalo para validación), `.match()` devuelve un array de coincidencias o null (úsalo para extracción). Y conoce `Validators.pattern()` para formularios de Angular.

---

## Eventos

**¿Qué es el event bubbling y cuándo necesitas `stopPropagation()`?**

Cuando un evento se dispara en un elemento, viaja hacia arriba a través de todos los elementos padre — eso es el bubbling. Si un botón está dentro de una card, hacer clic en el botón también dispara el manejador de clic de la card. `stopPropagation()` evita que el evento siga subiendo. Lo usé en el meal finder — hacer clic en el botón de favoritos de una card no debería abrir la página de detalle. La solución fue `event.stopPropagation()` en el manejador del botón y pasar `$event` en el template.

> **Consejo de entrevista:** El ejemplo del proyecto es tu activo más fuerte aquí — "Me encontré con esto en el proyecto 04." Eso demuestra que has visto este problema en código real, no solo que lo has leído.

**¿Cuál es la diferencia entre `stopPropagation` y `preventDefault`?**

`stopPropagation` evita que el evento suba por los elementos padre. `preventDefault` cancela la acción por defecto del navegador para ese elemento — por ejemplo, evitar que un formulario recargue la página al hacer submit, o que un `<a>` navegue. Son independientes — puedes llamar a uno, a ambos o a ninguno según lo que necesites.

> **Consejo de entrevista:** Da un ejemplo de cuándo necesitas ambos: hacer clic en un anchor dentro de una card — puede que quieras `preventDefault` (evitar navegación) Y `stopPropagation` (evitar el manejador de clic de la card). Eso demuestra que sabes que son herramientas independientes.

---

## Preguntas de presión

**La app falla al cargar. La consola dice `Cannot read properties of undefined (reading 'map')`. ¿Qué compruebas primero?**

El dato sobre el que se llama a `.map()` es `undefined` — llegó como `undefined` en lugar de como un array. Compruebo tres cosas en orden: primero, si la respuesta de la API tiene la forma esperada (quizás devolvió un objeto en lugar de un array); segundo, si el dato se carga de forma asíncrona y el componente intentó renderizar antes de que llegara; tercero, si una señal o variable no se inicializó con un valor por defecto. El fix suele ser inicializar la señal como array vacío — `signal<Employee[]>([])` — para que el template tenga algo válido que renderizar antes de que carguen los datos.

**Llega una PR que usa `var` en todas partes y cadenas `.then()` en lugar de `async/await`. Funciona correctamente. ¿La apruebas?**

No — dejaría un comentario de revisión explicando el motivo. `var` tiene un scoping impredecible que causa bugs reales en bucles y callbacks asíncronos — `let` y `const` son el estándar desde ES6. Las cadenas `.then()` son más difíciles de leer y de gestionar errores que `async/await`. "Funciona" no es lo mismo que "es mantenible". Pediría al autor que lo actualizara y le ofrecería explicar el razonamiento — no como bloqueante, sino como conversación sobre el estándar del equipo.

**Encuentras un `console.log` con un token de usuario sensible en una build de producción. ¿Qué haces?**

Lo elimino inmediatamente y despliego un fix — el token está expuesto en las DevTools del navegador para cualquiera que las abra. Luego roto el token en el backend para que el antiguo deje de funcionar. En una empresa también comprobaría si alguien accedió a la app durante ese periodo y lo reportaría siguiendo el proceso de incidencias. La lección es que los `console.log` en código de producción son peligrosos — deben detectarse en la revisión de código y eliminarse antes de hacer el merge.

**Necesitas ordenar una lista de empleados por salario, pero los resultados son incorrectos — algunos empleados aparecen en la posición equivocada. ¿Qué es lo más probable que esté pasando?**

La causa más probable es llamar a `.sort()` sin un comparador — el sort por defecto convierte los valores a strings y los ordena lexicográficamente, así que `30000` aparece después de `200000` porque `'3' > '2'` como string. El fix es pasar un comparador numérico: `employees.sort((a, b) => a.salary - b.salary)`. Una segunda posibilidad es llamar a `sort` directamente sobre el valor de una señal y mutar el estado inesperadamente — el patrón seguro es `[...employees()].sort(...)`.

Respuesta mala: "No lo sé, sort normalmente funciona." — Demuestra que no conoces la trampa de la comparación de strings ni el problema de mutación con las señales.
