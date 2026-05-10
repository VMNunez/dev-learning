# General — Preguntas de entrevista

## TypeScript

**¿Qué es TypeScript y por qué lo usas?**
Un superconjunto de JavaScript que añade tipos estáticos. Detecta errores en tiempo de compilación en lugar de en tiempo de ejecución, hace el refactoring más seguro y mejora el autocompletado del IDE. Angular usa TypeScript por defecto — en bases de código grandes se vuelve esencial.

**¿Cuál es la diferencia entre `interface` y `type` en TypeScript?**
Ambos definen la forma de un objeto. `interface` se puede extender y combinar — es bueno para modelos. `type` es más flexible y puede definir union types como `type Status = 'active' | 'inactive'`. Uso `interface` para modelos de datos y `type` para uniones y combinaciones.

**¿Qué es `Omit<T, 'field'>` y cuándo lo usas?**
Un utility type que crea un nuevo tipo a partir de uno existente, eliminando campos específicos. Lo uso en el HR portal para tipar el payload de "crear empleado" — `Omit<Employee, 'id'>` me da todos los campos excepto el ID, que genera el servidor.

**¿Qué es el optional chaining (`?.`) y cuándo es útil?**
Permite acceder de forma segura a una propiedad que podría ser `null` o `undefined` sin lanzar un error — `user?.address?.city` devuelve `undefined` si alguna parte es null. Lo uso cuando trabajo con datos de API que pueden tener campos vacíos.

**¿Qué es el operador nullish coalescing (`??`)?**
Devuelve el lado derecho solo si el lado izquierdo es `null` o `undefined`. Es diferente de `||`, que también se activa con `0` o `''`. Lo uso en el servicio de autenticación del HR portal: `JSON.parse(localStorage.getItem('user') ?? 'null')` — si no hay nada guardado, parsea el string `'null'` para obtener `null`.

**¿Qué es un union type?**
Un tipo que puede ser uno de varios valores: `type Status = 'pending' | 'active' | 'inactive'`. En Angular los uso en todas partes para campos de estado, estados de filtro y tipos de rol — hacen imposible asignar un valor inválido.

**¿Qué es una type assertion y cuándo es seguro usarla?**
`value as Type` le dice a TypeScript que trate un valor como un tipo específico, anulando su inferencia. Es seguro usarla cuando sabes más que el compilador — por ejemplo, haciendo cast de `event.target as HTMLInputElement` tras un evento de click. Evítala para silenciar errores que no entiendes — desactiva la seguridad de tipos por completo.

**¿Qué es un generic y por qué es útil?**
Un generic es un parámetro de tipo que permite escribir código reutilizable que funciona con diferentes tipos y sigue siendo type-safe. `function getFirst<T>(items: T[]): T` funciona con cualquier array y siempre devuelve el tipo correcto — no hace falta escribir una versión separada para strings, números y objetos. En Angular, `HttpClient.get<Employee[]>()` es un generic — el parámetro de tipo le dice a TypeScript cuál será la forma de la respuesta.

**¿Cuál es la diferencia entre `any`, `unknown` y `never`?**
`any` desactiva la comprobación de tipos por completo — el valor puede usarse como cualquier tipo sin errores. `unknown` es la alternativa segura — debes reducir el tipo antes de usarlo. `never` representa un valor que nunca puede existir — una función que siempre lanza un error tiene tipo de retorno `never`. Evito `any` en código real porque elimina todos los beneficios de TypeScript. Uso `unknown` para datos externos como resultados de `JSON.parse` y los reduzco antes de usarlos.

**¿Qué es un enum y cuándo lo usas en lugar de un union type?**
Un enum es un conjunto de constantes con nombre — `enum Role { Admin = 'admin', Employee = 'employee' }`. Lo uso cuando los valores se comparten entre muchos archivos y necesitan iterarse — `Object.values(Role)` da todas las opciones para un `<mat-select>`. Para casos locales simples uso un union type — `type Status = 'active' | 'inactive'` — es más corto y no genera JavaScript extra. La regla: union type para casos locales simples, enum para constantes compartidas y reutilizadas.

**¿Qué es el type narrowing y por qué TypeScript lo necesita?**
Cuando una variable tiene un union type, TypeScript no sabe en tiempo de ejecución cuál es el tipo específico. El narrowing es usar una comprobación para reducir el tipo — `if (typeof value === 'string')` le dice a TypeScript que dentro de ese bloque, `value` es definitivamente un string. Uso `typeof` para primitivos, `instanceof` para instancias de clase e `in` para distinguir entre formas de objetos. El patrón de discriminated union — un campo `status` compartido con valores literales — es el enfoque más limpio para gestionar estados de carga/éxito/error en Angular.

**¿Qué es el operador de non-null assertion (`!`) y cuándo deberías evitarlo?**
`value!` le dice a TypeScript que el valor definitivamente no es `null` ni `undefined`. Lo uso con `@ViewChild` — `@ViewChild(MatSort) sort!: MatSort` — porque Angular lo establece antes de que lo use pero TypeScript no puede verificarlo. Lo evito en cualquier otro lugar y prefiero el optional chaining `?.` o una comprobación de null adecuada — si la suposición es incorrecta, `!` da un error en runtime sin ninguna advertencia de TypeScript.

**¿Qué es el constructor shorthand en TypeScript y cómo se relaciona con Angular?**
Declarar un parámetro con un modificador de acceso (`private`, `public`, `readonly`) en el constructor crea y asigna automáticamente una propiedad de clase. `constructor(private http: HttpClient)` es equivalente a declarar `private http: HttpClient` y escribir `this.http = http` en el cuerpo. En Angular este es el patrón estándar para la inyección de dependencias. El Angular moderno también admite `inject()` como alternativa, que elimina completamente el constructor.

---

## Fundamentos de JavaScript

**¿Cuál es la diferencia entre `let`, `const` y `var`?**
`const` es para valores que no cambian — úsalo por defecto. `let` es para valores que necesitan cambiar. `var` es la forma antigua — tiene scope de función y es hoisted, lo que provoca bugs. Solo uso `const` y `let`.

**¿Qué es `Array.map()` y cuándo lo usas?**
Transforma cada elemento de un array y devuelve uno nuevo. Lo uso para convertir los objetos de la respuesta de la API al formato que necesita el componente, sin mutar los datos originales.

**¿Qué es `Array.filter()` y cuándo lo usas?**
Devuelve un nuevo array con solo los elementos que cumplen una condición. En el HR portal lo encadeno con `computed()` — `employees().filter(e => e.status === filterStatus())` da una lista filtrada en tiempo real.

**¿Qué es `Array.some()` y cuándo lo usas?**
Devuelve `true` si al menos un elemento cumple la condición. Lo uso para comprobar duplicados en el HR portal — `employees.some(e => e.email === newEmail)` me dice si el email ya existe.

**¿Qué es el spread operator (`...`) y para qué se usa?**
Copia los elementos de un array u objeto en otro. Lo uso para crear nuevos objetos sin mutar el original — `{ ...employee, status: 'inactive' }` da un nuevo objeto con solo `status` cambiado.

**¿Qué es `async/await` y en qué se diferencia de `.then()`?**
Ambos manejan Promesas, pero `async/await` se lee como código síncrono — más fácil de seguir, especialmente con varias operaciones asíncronas en secuencia. Las cadenas de `.then()` están bien para casos simples. En Angular uso principalmente Observables con `subscribe()`, pero `async/await` es útil en servicios que llaman a `fetch` u otras APIs basadas en Promesas.

**¿Qué son `JSON.stringify()` y `JSON.parse()`?**
`stringify()` convierte un objeto JavaScript a un string JSON para almacenarlo o enviarlo a una API. `parse()` hace lo contrario. Uso ambos en todos los proyectos que persisten datos en `localStorage`.

---

## Programación general

**¿Cuál es la diferencia entre `==` y `===` en JavaScript?**
`===` es igualdad estricta — comprueba el valor Y el tipo. `==` hace coerción de tipos, lo que produce resultados inesperados (`0 == false` es `true`). Usa siempre `===`.

**¿Qué es la inmutabilidad y por qué importa en Angular?**
La inmutabilidad significa no modificar objetos existentes — en su lugar, creas nuevos con los cambios. La detección de cambios de Angular funciona mejor con datos inmutables porque puede detectar cambios por referencia. Las peticiones HTTP también son inmutables en Angular — por eso usas `req.clone()` en los interceptores.

**¿Qué es el principio DRY?**
"Don't Repeat Yourself" — si la misma lógica aparece en más de un sitio, extráela a una función, servicio o componente. En el HR portal, el patrón del confirm dialog es reutilizable en tres páginas diferentes — eso es DRY en la práctica.

**¿Qué es la separación de responsabilidades?**
Cada parte del código debe hacer una cosa y ser responsable de un área. En Angular: los componentes gestionan el template, los servicios gestionan datos y lógica, los guards gestionan el acceso a las rutas. Mezclarlos hace el código más difícil de probar y mantener.

**¿Cuál es la diferencia entre código síncrono y asíncrono?**
El código síncrono se ejecuta línea a línea y bloquea la ejecución hasta que cada línea termina. El código asíncrono (llamadas HTTP, timers, eventos de usuario) inicia una operación y continúa sin esperar a que termine. En Angular, casi todo lo que toca un servidor es asíncrono — por eso usamos Observables y signals.

**¿Qué significa "single source of truth"?**
Un único lugar en la app contiene la versión autorizada de un dato. En el HR portal, `EmployeeService` es la fuente única de verdad para la lista de empleados — cualquier componente que la necesite lee desde allí, así todos se mantienen sincronizados automáticamente.

---

## Agile y trabajo en equipo

**¿Has trabajado en un entorno ágil?**
No de forma profesional, pero sigo prácticas ágiles en mis propios proyectos — commits atómicos, ramas de feature, descripciones de PR y cambios cortos y enfocados. Entiendo la ceremonia: daily standup para compartir bloqueos, sprint para acotar el trabajo en el tiempo, retrospectiva para mejorar el proceso. Lo que más rápido adoptaría en una consultora es el ciclo de revisión de PR — ya lo practico en mi flujo de trabajo personal.

**¿Cuál es la diferencia entre un sprint y un backlog?**
El backlog es la lista completa de funcionalidades y tareas del proyecto, ordenadas por prioridad. Un sprint es un período de tiempo fijo — normalmente dos semanas — en el que el equipo elige un subconjunto del backlog y se compromete a terminarlo. Al final del sprint tienes software funcionando, no features a medias.

**¿Qué es un daily standup y qué dices en él?**
Una reunión diaria corta — normalmente 15 minutos — en la que cada persona responde tres preguntas: qué hice ayer, qué haré hoy y hay algo que me bloquea. El objetivo es sacar los bloqueos a la superficie pronto, no reportar el progreso a un manager.

**¿Qué cambiarías de tu forma de trabajar en solitario al unirte a un equipo?**
Lo que realmente quieren saber: ¿Estás listo para la colaboración profesional, o serás disruptivo en un equipo?
R: El mayor cambio sería la disciplina con git — nunca mergear tus propios PRs, mantener los commits atómicos para que los compañeros puedan seguir el historial, y escribir descripciones de PR que expliquen el por qué, no solo el qué. Ya hago esto en mis proyectos personales. Lo más difícil es acordar la arquitectura de antemano — por eso existen patrones como Core/Feature/Shared, para que cinco desarrolladores puedan trabajar de forma independiente sin romper el código del otro.
Respuesta mala: "Comunicaría más." — Demasiado vago. El entrevistador quiere prácticas concretas, no intenciones.
