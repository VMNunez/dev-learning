# General — Preguntas de entrevista

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
