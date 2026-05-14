# JavaScript — Preguntas de entrevista

## Variables y scope

**¿Cuál es la diferencia entre `var`, `let` y `const`?**
`var` tiene scope de función y se eleva (hoisting) — se puede acceder antes de su declaración (como `undefined`) y se escapa de los bloques. `let` y `const` tienen scope de bloque y permanecen en la Zona Muerta Temporal hasta su línea de declaración. `const` no se puede reasignar. Siempre uso `const` por defecto y `let` solo cuando necesito reasignar. Nunca uso `var` — su comportamiento de scope es impredecible.

**¿Qué es el hoisting?**
JavaScript mueve las declaraciones de variables y funciones al principio de su scope antes de ejecutar el código. Las declaraciones con `var` se elevan e inicializan como `undefined`. `let` y `const` se elevan pero no se inicializan — acceder a ellas antes de su declaración lanza un `ReferenceError` (Zona Muerta Temporal). Las declaraciones de función se elevan completamente — puedes llamarlas antes de que aparezcan en el código.

**¿Qué es un closure?**
Un closure es una función que retiene el acceso a las variables de su scope externo, incluso después de que la función exterior ha terminado de ejecutarse. En el HR portal, cada señal `computed()` es un closure — `computed(() => this.employees().filter(e => e.department === this.selectedDept()))` cierra sobre ambas señales. Cuando cualquiera de las dos cambia, el computed se vuelve a ejecutar con los valores correctos porque mantiene una referencia al scope exterior, no una copia de los valores en el momento de creación.

**¿Cuál es la diferencia entre scope de función y scope de bloque?**
`var` crea variables con scope de función — existen en toda la función aunque se declaren dentro de un bloque `if`. `let` y `const` crean variables con scope de bloque — solo existen dentro del `{}` donde se declararon. El scope de bloque evita el acceso accidental a variables fuera de su área prevista.

---

## Tipos

**¿Cuál es la diferencia entre `==` y `===`?**
`===` es igualdad estricta — compara valor Y tipo, sin conversión. `==` es igualdad laxa — convierte los tipos antes de comparar, lo que produce resultados sorprendentes como `0 == '0'` siendo `true`. Siempre uso `===` para evitar bugs ocultos por la coerción de tipos.

**¿Cuál es la diferencia entre `null` y `undefined`?**
`undefined` significa que una variable fue declarada pero nunca asignada — JavaScript lo establece automáticamente. `null` significa que un valor fue intencionalmente establecido como "sin valor" por el desarrollador. En Angular uso `signal<Employee | null>(null)` para representar "nada seleccionado aún" — eso es un null intencional.

**¿Qué son los valores truthy y falsy?**
En un contexto booleano, cada valor es truthy o falsy. Los valores falsy son exactamente seis: `false`, `0`, `''`, `null`, `undefined` y `NaN`. Todo lo demás es truthy — incluyendo los arrays vacíos `[]` y los objetos vacíos `{}`. Esto importa al escribir condiciones — `if (employees.length)` es truthy solo cuando hay elementos.

**¿Cuál es la diferencia entre `??` y `||`?**
`||` devuelve el lado derecho cuando el izquierdo es cualquier valor falsy — incluyendo `0`, `false` y `''`, lo que puede causar bugs cuando esos son valores válidos. `??` (nullish coalescing) solo se activa con `null` o `undefined`. Uso `??` en Angular cuando leo de localStorage: `JSON.parse(localStorage.getItem('user') ?? 'null')` — `??` maneja correctamente el caso en que la clave no existe.

---

## Funciones

**¿Cuál es la diferencia entre una función normal y una arrow function?**
Las arrow functions son más cortas y no tienen su propio `this` — heredan el `this` del scope circundante. Las funciones normales tienen su propio `this` que depende de cómo se llama la función. En Angular uso arrow functions para callbacks de arrays (`employees.filter(e => e.active)`) y para callbacks de señales (`computed(() => ...)`) donde necesito el `this` del componente.

**¿Qué es `this` y por qué es complicado en JavaScript?**
`this` hace referencia al objeto que llamó a la función — su valor cambia según cómo se llama la función, no dónde está definida. Un método llamado directamente tiene el objeto como `this`. Una función llamada de forma independiente tiene `undefined` (modo estricto) o `window`. Las arrow functions evitan esto al no tener su propio `this` — usan el `this` del scope externo. En Angular por eso los callbacks de arrays y de signals siempre usan arrow functions — `computed(() => this.tasks().filter(...))` funciona correctamente porque la arrow function hereda el `this` del componente. Con `function` normal, el contexto se perdería.

---

## Métodos de array

**¿Cuál es la diferencia entre `map`, `filter` y `reduce`?**
`map` transforma cada elemento y devuelve un nuevo array del mismo tamaño. `filter` mantiene solo los elementos que pasan un test y devuelve un array más corto. `reduce` acumula todos los elementos en un único valor — un número, un objeto u otro array. Los uso constantemente en las señales `computed()` de Angular para derivar listas filtradas y transformadas a partir de datos crudos.

**¿Cuál es la diferencia entre `find` y `filter`?**
`find` devuelve el primer elemento que coincide o `undefined` — se usa cuando necesitas un elemento específico. `filter` siempre devuelve un array — se usa cuando necesitas todos los elementos que coinciden. Uso `find` para buscar un empleado por ID antes de editarlo, y `filter` para construir listas filtradas en la tabla.

**¿Qué hace `some` y cuándo lo usas?**
`some` devuelve `true` si al menos un elemento pasa el test. Su complemento es `every`, que devuelve `true` solo si TODOS los elementos pasan el test. Uso `some` para la comprobación de duplicados antes de guardar — `employees.some(e => e.email === newEmail)` — y `every` para comprobar si todas las tareas están completas — `tasks.every(t => t.done)`.

**¿Cuál es la diferencia entre `forEach` y `map`?**
`forEach` itera el array y ejecuta una función por cada elemento — siempre devuelve `undefined`. `map` hace lo mismo pero recoge el valor de retorno de cada llamada en un nuevo array. Usa `map` cuando necesitas una versión transformada del array. Usa `forEach` solo para efectos secundarios donde no necesitas un array nuevo — logging, actualizar el DOM o llamar a una función externa. En Angular casi siempre uso `map` porque necesito el resultado, no solo el efecto secundario.

---

## Objetos y desestructuración

**¿Qué es la desestructuración y cuándo la usas?**
La desestructuración extrae valores de arrays o propiedades de objetos en variables con nombre en una sola línea. `const { name, role } = employee` es más limpio que `const name = employee.name; const role = employee.role`. La uso constantemente en Angular — desestructurando parámetros de funciones, extrayendo valores de señales y desempaquetando resultados de `Promise.all`: `const [employees, departments] = await Promise.all([...])`.

**¿Qué hace el operador spread con los objetos?**
Crea una copia superficial del objeto. `{ ...employee, role: 'manager' }` crea un nuevo objeto con todas las propiedades de employee, con `role` sobreescrito. Lo uso para actualizar una señal de forma inmutable: `employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e))` — sin mutación, solo un nuevo objeto con los valores actualizados.

**¿Qué es el optional chaining y por qué es útil?**
`?.` accede de forma segura a una propiedad anidada sin lanzar un error si un valor intermedio es `null` o `undefined`. En lugar de `user && user.address && user.address.city` escribes `user?.address?.city`. En Angular lo uso cuando los datos pueden no haberse cargado aún — `selectedEmployee()?.name` devuelve `undefined` en lugar de crashear si no hay nada seleccionado.

---

## Async

**¿Qué es el event loop?**
JavaScript es single-threaded — ejecuta una cosa a la vez. El event loop gestiona las operaciones asíncronas: primero se ejecuta el código síncrono, luego todas las microtareas (callbacks de Promise) y después una tarea de la cola de tareas (setTimeout, etc.). Por eso una Promise se resuelve antes que un `setTimeout` con 0ms de retraso — las Promises van a la cola de microtareas que tiene mayor prioridad. En Angular esto importa cuando usas `setTimeout(() => {}, 0)` para diferir algo hasta después del ciclo de renderizado actual — el event loop es la razón por la que ese truco funciona.

**¿Cuál es la diferencia entre Promise y async/await?**
`async/await` es sintaxis sobre las Promises — hace que el código asíncrono parezca síncrono. Una función marcada con `async` siempre devuelve una Promise. `await` pausa la ejecución dentro de la función async hasta que la Promise se resuelve. El resultado es el mismo que las cadenas `.then()` pero mucho más legible, y los errores se capturan con `try/catch` normal. Uso async/await en Angular cuando convierto un Observable a Promise con `firstValueFrom()`.

**¿Cuál es la diferencia entre llamadas async secuenciales y paralelas?**
Secuencial: `const a = await fetchA(); const b = await fetchB()` — B espera a que A termine. Paralela: `const [a, b] = await Promise.all([fetchA(), fetchB()])` — ambas empiezan al mismo tiempo y esperas por las dos. En Angular uso `forkJoin` para llamadas HTTP paralelas — el equivalente RxJS de `Promise.all`. Prefiero siempre la ejecución paralela cuando las llamadas son independientes.

---

## Strings, números y métodos built-in

**¿Qué métodos de string usas más a menudo y por qué?**
`includes()` para búsquedas, `split()` para convertir un string a array (y `join()` para volver atrás), `trim()` para limpiar la entrada del usuario antes de guardar, y los template literals para construir cualquier string con valores embebidos. En Angular también uso `.slice()` para truncar texto largo en la vista y `.toUpperCase()` / `.toLowerCase()` para normalizar antes de comparar.

**¿Cuál es la diferencia entre `parseInt` y `Number()`?**
`parseInt` se detiene en el primer carácter no numérico — `parseInt('42px')` da `42`. `Number()` convierte el string completo y devuelve `NaN` si algo no es válido — `Number('42px')` da `NaN`. Uso `Number()` cuando la entrada debe ser un número limpio, y `parseInt` cuando parseo valores como tamaños CSS o respuestas de API que mezclan números con unidades.

**¿Por qué `0.1 + 0.2` no es igual a `0.3` en JavaScript?**
Porque JavaScript usa coma flotante de 64 bits (IEEE 754), y algunos decimales no pueden representarse exactamente en binario — la misma limitación existe en Java, Python y la mayoría de lenguajes. Para mostrar datos uso `.toFixed(2)` para redondear. Para cálculos financieros trabajo en enteros (céntimos en vez de euros) para evitar el problema por completo.

---

## Objetos y módulos

**¿Qué hace `Object.entries()` y cuándo es útil?**
Devuelve un array de pares `[clave, valor]` de un objeto — básicamente permite usar métodos de array sobre un objeto. Lo uso cuando necesito iterar un objeto y transformar o filtrar sus entradas, por ejemplo para convertir un objeto de configuración en un `Map` o construir una query string a partir de un objeto de parámetros.

**¿Cuál es la diferencia entre named exports y default exports? ¿Cuál usa Angular?**
Los named exports permiten múltiples exports por archivo y el nombre del import debe coincidir exactamente — `export class EmployeeService` → `import { EmployeeService }`. Los default exports solo permiten uno por archivo y el nombre del import es arbitrario. Angular siempre usa named exports — son más seguros para refactorizar (los editores los renombran automáticamente), habilitan el tree-shaking y son la convención en todo el ecosistema.

**¿Qué son `JSON.stringify` y `JSON.parse` y dónde los usas?**
`JSON.stringify` convierte un objeto JavaScript a un string JSON — necesario para guardar objetos en localStorage o enviarlos en el cuerpo de una petición HTTP. `JSON.parse` hace lo contrario — convierte un string JSON de vuelta a un objeto. En el HR portal uso ambos para el patrón de persistencia en localStorage: `effect(() => localStorage.setItem('user', JSON.stringify(this.user())))` para guardar, y `JSON.parse(localStorage.getItem('user') ?? 'null')` para restaurar. `JSON.parse` puede lanzar un error si el string no es JSON válido, por eso siempre lo envuelvo en `try/catch`.

---

## Clases y manejo de errores

**¿Qué hace `extends` y cuándo usas la herencia de clases?**
`extends` hace que una clase herede todas las propiedades y métodos de una clase padre. `super()` llama al constructor del padre. En Angular lo uso al crear clases de error personalizadas que extienden `Error`, y cuando un componente extiende una clase base para compartir lógica común. En Java la herencia es central en el lenguaje — entenderla en JavaScript primero hace que la versión en Java sea más fácil de aprender.

**¿Cuál es la diferencia entre una clase y una función normal en JavaScript?**
Una clase es una sintaxis más limpia para crear objetos con comportamiento compartido — tiene un `constructor`, métodos y soporta `extends` para la herencia. Por debajo, las clases de JavaScript siguen usando prototipos, pero la sintaxis es mucho más cercana a Java o C#. En Angular cada componente, servicio, pipe y guard es una clase con un decorador — el decorador añade los metadatos que Angular necesita para usarla.

**¿Qué es `try/catch/finally` y cuándo usas `finally`?**
`try` contiene el código que puede fallar, `catch` maneja el error, y `finally` siempre se ejecuta independientemente del resultado. Uso `finally` para resetear el estado de carga — en el HR portal el patrón es `try { this.isLoading.set(true); ... } catch { this.hasError.set(true); } finally { this.isLoading.set(false); }`. Sin `finally`, el spinner se quedaría en pantalla para siempre si la petición falla.

**¿Cuál es la diferencia entre `throw new Error()` y `throw 'mensaje'`?**
`throw new Error()` crea un objeto Error con `message`, `name` y un stack trace — puedes ver exactamente dónde se lanzó. `throw 'mensaje'` lanza un string plano — sin stack trace, sin información de tipo, más difícil de capturar y depurar. Siempre lanza objetos Error.

---

## Sets y Maps

**¿Qué es un Set y cuándo lo usas?**
Una colección que solo almacena valores únicos — los duplicados se ignoran automáticamente. El uso más común es eliminar duplicados de un array: `[...new Set(departments)]` da una lista de nombres de departamento únicos. También es más rápido que `Array.includes()` para comprobar si un valor existe — `set.has()` es O(1), mientras que `array.includes()` recorre todo el array. En el HR portal uso este patrón para construir opciones de filtro únicas a partir de la lista de empleados.

**¿Cuál es la diferencia entre un Set y un Array?**
Un Array permite duplicados y tiene acceso por índice (`arr[0]`). Un Set solo almacena valores únicos y no tiene índice — lo iteras o lo conviertes a array con `[...set]`. Usa un Array para listas ordenadas y transformaciones. Usa un Set cuando necesites valores únicos o comprobaciones de existencia rápidas.

**¿Qué es un Map y en qué se diferencia de un objeto?**
Un Map es un almacén de pares clave-valor donde las claves pueden ser de cualquier tipo — no solo strings. También tiene un `.size` integrado, iteración garantizada en orden de inserción y `map.has()` para búsquedas de claves rápidas. En la práctica uso objetos planos para los modelos de datos. Un Map tiene sentido cuando las claves no son strings o cuando necesitas añadir y eliminar entradas con frecuencia.

---

**¿Por qué usarías un Set en lugar de filtrar un array para obtener valores únicos?**
Lo que realmente quieren saber: ¿Eliges la estructura de datos correcta, o simplemente usas un array para todo?
R: `[...new Set(array)]` es más limpio y directo que un filter con `indexOf`. Más importante aún, si necesito comprobar la pertenencia repetidamente — como al construir opciones de filtro en el HR portal — `set.has()` se ejecuta en O(1) mientras que `array.includes()` recorre todo el array cada vez. Para un dataset grande esa diferencia es real. Para una deduplicación puntual sobre un array pequeño, el enfoque con array está bien.
Respuesta mala: "Usaría filter." — No está mal para un caso pequeño, pero demuestra que no sabes por qué existe Set ni cuándo importa.

---

## Expresiones regulares

**¿Qué es una expresión regular y cómo la usas en Angular?**
Una expresión regular es un patrón para validar, buscar o reemplazar texto. En Angular las uso con `Validators.pattern()` — por ejemplo `Validators.pattern(/^\d{9}$/)` valida que un campo de teléfono contenga exactamente 9 dígitos. Uso `.test()` cuando solo necesito una respuesta sí/no, y `.match()` cuando necesito extraer las partes que coinciden de un string.

---

## Eventos

**¿Qué es el event bubbling y cuándo necesitas `stopPropagation()`?**
Cuando un evento se dispara en un elemento, viaja hacia arriba a través de todos los elementos padre — eso es el bubbling. Si un botón está dentro de una card, hacer clic en el botón también dispara el manejador de clic de la card. `stopPropagation()` evita que el evento siga subiendo. Lo usé en el meal finder — hacer clic en el botón de favoritos de una card no debería abrir la página de detalle. La solución fue `event.stopPropagation()` en el manejador del botón y pasar `$event` en el template.

**¿Cuál es la diferencia entre `stopPropagation` y `preventDefault`?**
`stopPropagation` evita que el evento suba por los elementos padre. `preventDefault` cancela la acción por defecto del navegador para ese elemento — por ejemplo, evitar que un formulario recargue la página al hacer submit, o que un `<a>` navegue. Son independientes — puedes llamar a uno, a ambos o a ninguno según lo que necesites.

---

## Preguntas de presión

**La app falla al cargar. La consola dice `Cannot read properties of undefined (reading 'map')`. ¿Qué compruebas primero?**
El dato sobre el que se llama a `.map()` es `undefined` — llegó como `undefined` en lugar de como un array. Compruebo tres cosas en orden: primero, si la respuesta de la API tiene la forma esperada (quizás devolvió un objeto en lugar de un array); segundo, si el dato se carga de forma asíncrona y el componente intentó renderizar antes de que llegara; tercero, si una señal o variable no se inicializó con un valor por defecto. El fix suele ser inicializar la señal como array vacío — `signal<Employee[]>([])` — para que el template tenga algo válido que renderizar antes de que carguen los datos.

**Llega una PR que usa `var` en todas partes y cadenas `.then()` en lugar de `async/await`. Funciona correctamente. ¿La apruebas?**
No — dejaría un comentario de revisión explicando el motivo. `var` tiene un scoping impredecible que causa bugs reales en bucles y callbacks asíncronos — `let` y `const` son el estándar desde ES6. Las cadenas `.then()` son más difíciles de leer y de gestionar errores que `async/await`. "Funciona" no es lo mismo que "es mantenible". Pediría al autor que lo actualizara y le ofrecería explicar el razonamiento — no como bloqueante, sino como conversación sobre el estándar del equipo.

**Encuentras un `console.log` con un token de usuario sensible en una build de producción. ¿Qué haces?**
Lo elimino inmediatamente y despliego un fix — el token está expuesto en las DevTools del navegador para cualquiera que las abra. Luego roto el token en el backend para que el antiguo deje de funcionar. En una empresa también comprobaría si alguien accedió a la app durante ese periodo y lo reportaría siguiendo el proceso de incidencias. La lección es que los `console.log` en código de producción son peligrosos — deben detectarse en la revisión de código y eliminarse antes de hacer el merge.
