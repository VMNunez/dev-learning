# Angular — Preguntas de entrevista

## Conceptos básicos de Angular

**¿Qué es Angular?**
Un framework frontend basado en TypeScript creado por Google para construir aplicaciones web. Incluye todo integrado: routing, formularios, cliente HTTP y un sistema de componentes — a diferencia de React, que es solo una librería de UI.

**¿Cuál es la diferencia entre Angular y React?**
Angular es un framework completo con opiniones sobre cómo estructurar todo. React es una librería de UI que te deja elegir tus propias herramientas para el routing, el estado y el HTTP. En las empresas españolas, Angular es más común en proyectos enterprise grandes — por eso elegí centrarme en él.

**¿Qué es un componente en Angular?**
El bloque de construcción básico de la UI. Cada componente es una clase TypeScript con una plantilla (HTML), estilos (CSS) y un selector. En Angular 17+ los componentes son standalone por defecto — declaran sus propias importaciones en lugar de pertenecer a un módulo. Los componentes se comunican entre sí mediante `input()` y `output()`.

**¿Cuál es la diferencia entre los decoradores `@Input()`/`@Output()` y las funciones `input()`/`output()`?**
`@Input()` y `@Output()` son la API clásica basada en decoradores — declaras propiedades y Angular mapea los datos a ellas. `input()` y `output()` son la API basada en signals de Angular 17+ — `input()` devuelve un signal que puedes usar directamente en `computed()` y `effect()`. En todos mis proyectos uso `input()` y `output()` porque se integran de forma natural con el sistema de signals y el código es más limpio. Ambas formas funcionan — verás la sintaxis de decoradores en bases de código más antiguas.

**¿Qué es la inyección de dependencias en Angular?**
Un patrón de diseño donde una clase recibe sus dependencias desde fuera en lugar de crearlas ella misma. En Angular, usas `inject(ServiceClass)` para obtener una instancia singleton — Angular la crea una vez y la comparte en toda la app.

> **Consejo de entrevista:** No la definas de forma abstracta. Di: "En vez de que mi componente cree un `new EmployeeService()` él mismo, llamo a `inject(EmployeeService)` y Angular me da la misma instancia que usan todos los demás componentes. Así todos comparten los mismos datos sin pasarlos manualmente."

**¿Qué es un servicio en Angular?**
Una clase decorada con `@Injectable` que contiene lógica compartida o estado. Uso servicios en todos mis proyectos para separar la lógica de negocio del componente — por ejemplo, el `EmployeeService` en el HR portal gestiona todas las llamadas a la API y la lista de empleados.

**¿Qué le dirías a un desarrollador senior que argumenta que "Angular es demasiado complejo — deberíamos cambiar a React"?**
Lo que realmente quieren saber: ¿Puedes defender una decisión técnica con argumentos, no con preferencias?
R: Reconocería que Angular tiene más overhead de configuración — estructura más estricta, más código repetitivo, TypeScript en todas partes. Pero en una consultora que gestiona varios proyectos enterprise, esa estructura es la ventaja. React deja demasiadas decisiones abiertas: qué router, qué librería de estado, qué herramienta HTTP — cada equipo acaba con un stack diferente. Las opiniones de Angular significan que cualquier desarrollador Angular puede incorporarse a cualquier proyecto Angular con poco tiempo de adaptación. Si el proyecto fuera una pequeña web de marketing, podría estar de acuerdo. Para una app de negocio con guards, interceptores y servicios compartidos, la estructura de Angular amortiza su coste.
Respuesta mala: "Angular es simplemente mejor que React." — Es una preferencia, no un argumento. Demuestra que puedes razonar sobre los trade-offs.

---

## Signals y reactividad

**¿Qué es un signal en Angular?**
Un valor reactivo que actualiza automáticamente la plantilla cuando cambia. En todos mis proyectos uso signals para el estado local — son más simples y predecibles que los subjects de RxJS para el estado de la UI.

> **Consejo de entrevista:** No digas "es como una variable reactiva." Di: "Cuando su valor cambia, Angular actualiza la plantilla automáticamente — no necesito disparar nada manualmente." Luego da un ejemplo de proyecto, como la lista filtrada de empleados.

**¿Por qué usaste `computed()` para las listas filtradas en vez de llamar a un método en la plantilla?**
Lo que realmente quieren saber: ¿Entiendes el coste de rendimiento de llamar a métodos en la plantilla?
R: Un método en la plantilla se vuelve a ejecutar en cada ciclo de detección de cambios — incluso para eventos completamente ajenos a esos datos. `computed()` solo se recalcula cuando cambia uno de sus signals dependientes. En el HR portal, la lista filtrada de empleados depende de tres signals: texto de búsqueda, filtro de estado y filtro de departamento. `computed()` ejecuta la lógica de filtrado solo cuando esos signals cambian, no en cada clic de la app.
Respuesta mala: "computed() es más limpio." — El entrevistador quiere el motivo de rendimiento, no una preferencia de estilo.

**¿Cuál es la diferencia entre `signal()` y `computed()`?**
`signal()` almacena un valor que puedes modificar manualmente. `computed()` deriva un valor de uno o más signals y se recalcula automáticamente cuando cambian. En el HR portal uso `computed()` para la lista filtrada de empleados — se actualiza sola cada vez que cambian los signals de filtro.

**¿Qué es `effect()` y cuándo lo usas?**
Una función que se ejecuta automáticamente cuando cambia cualquier signal que lee. La diferencia clave con `computed()` es que `effect()` realiza una acción — no devuelve un valor. En el meal finder uso `effect()` para guardar los favoritos en `localStorage` cada vez que cambia la lista — eso es un efecto secundario, no un valor derivado.

**¿Qué es el patrón `localStorage + effect()`?**
Inicializar un signal desde `localStorage` para que los datos persistan al refrescar la página, y luego usar `effect()` para guardarlo de nuevo cada vez que el signal cambia. Así `localStorage` se mantiene sincronizado automáticamente sin llamadas manuales de guardado.

**¿Por qué usar signals en vez de subjects de RxJS para el estado local de un componente?**
Los signals son más simples de leer, escribir y depurar — no necesitas suscribirte, desuscribirte ni gestionar memoria. En el HR portal, todo el estado de los filtros (estado, departamento, texto de búsqueda) usa signals — nunca escribí ni una sola llamada a `unsubscribe()`. RxJS sigue siendo la opción correcta para llamadas HTTP y streams asíncronos.

---

## Sintaxis de plantillas

**¿Qué hace `@if` en las plantillas de Angular?**
Renderiza condicionalmente un bloque de HTML. Reemplaza a la antigua directiva `*ngIf` y es más limpio porque no requiere una directiva estructural en el elemento — envuelve el bloque como una sintaxis de control de flujo estándar.

**¿Qué hace `@for` y para qué sirve `track`?**
Recorre un array y renderiza un bloque por cada elemento. `track` le dice a Angular cómo identificar cada elemento — normalmente `track item.id` — para que solo actualice los elementos que cambiaron en lugar de rerenderizar toda la lista.

**¿Cuál es la diferencia entre `[class.active]` y `[ngClass]`?**
`[class.active]="condición"` añade o quita una clase específica. `[ngClass]="valor"` añade el valor dinámicamente como nombre de clase, útil cuando el nombre de la clase viene de un signal o variable — como las insignias de estado en el task manager.

**¿Para qué sirve el binding `[disabled]`?**
Deshabilita un botón o input de forma reactiva según un signal o condición. Por ejemplo, lo uso para deshabilitar el botón de Submit mientras se carga el formulario para que el usuario no pueda enviar dos veces.

**¿Qué es una variable de referencia de plantilla y cuándo la usas?**
Una variable de referencia de plantilla (`#ref`) es un alias local que te da acceso directo a un elemento del DOM o a una directiva desde dentro de la plantilla. Por ejemplo, `<input #nameInput>` te permite pasar `nameInput.value` a un método. En el HR portal uso `#stepper` para referenciar el `MatStepper` y llamar a `stepper.next()` desde los botones del diálogo — porque los botones están fuera de `<mat-stepper>`, la directiva `matStepperNext` no puede encontrarlo automáticamente. El mismo elemento también se puede acceder en TypeScript con `@ViewChild`.

**¿Cuándo usarías una variable de referencia de plantilla en vez de `@ViewChild`?**
Las variables de referencia son para acceso solo en la plantilla — pasar un valor a un método, llamar a una directiva inline en el HTML. `@ViewChild` es para acceso en TypeScript — ejecutar lógica en un lifecycle hook, conectar una directiva a una fuente de datos. En el HR portal, `#stepper` me permite llamar a `stepper.next()` directamente en el handler del clic del botón en la plantilla. Si necesitara avanzar el stepper desde dentro de `ngAfterViewInit` o desde un método TypeScript, usaría `@ViewChild(MatStepper)`.

> **Consejo de entrevista:** Demuestra que conoces ambas herramientas y sabes elegir. La diferencia clave: ¿necesitas la referencia solo en el HTML? Usa `#ref`. ¿La necesitas también en TypeScript? Usa `@ViewChild`.

**¿Qué es `[(ngModel)]` y cuándo lo usas?**
Binding bidireccional — lee el valor del input en una variable Y lo escribe de vuelta cuando el usuario teclea. La sintaxis se llama "banana in a box" por la forma de `[()]`. Conozco el concepto, pero en mis proyectos uso signals para los campos de búsqueda — `(input)` enlazado a un signal hace lo mismo sin necesitar `FormsModule`. Para formularios con validación uso siempre formularios reactivos.

**¿Qué es `[ngStyle]` y cuándo lo usas?**
Aplica estilos inline de forma dinámica: `[ngStyle]="{ 'color': isAdmin ? 'red' : 'black' }"`. Para una sola propiedad prefiero la forma más corta `[style.color]="condición ? 'red' : 'black'"`. `[ngStyle]` es útil cuando necesitas aplicar varios estilos dinámicos a la vez desde un objeto.

**¿Qué es una directiva personalizada y cuándo es útil?**
Una clase decorada con `@Directive` que añade comportamiento a un elemento host sin crear un nuevo componente. Es útil cuando el mismo comportamiento DOM debe aplicarse a muchos elementos — por ejemplo, enfocar automáticamente un input o resaltar al pasar el ratón. La directiva usa `ElementRef` para acceder al elemento y `@HostListener` para reaccionar a eventos.

**¿Qué es la proyección de contenido (`ng-content`) y cuándo la usas?**
`ng-content` permite que un componente padre inyecte HTML en la plantilla de un componente hijo. El hijo define dónde va el contenido con `<ng-content />`, y el padre decide qué va ahí. Se usa para componentes contenedor reutilizables — tarjetas, paneles, contenedores de layout — donde el interior cambia según quién usa el componente. Por ejemplo, un wrapper `<app-card>` que siempre aplica el mismo borde y sombra, pero deja que el padre controle lo que se muestra dentro.

> **Consejo de entrevista:** La idea clave que debes transmitir: el hijo controla el CONTENEDOR, el padre controla el CONTENIDO. Contrástalo con `@Input()`: con `@Input()` pasas datos, con `ng-content` pasas bloques HTML enteros. Si el entrevistador pregunta "¿lo has usado?", sé honesto — menciona que es un patrón que conoces de bases de código enterprise y que los encabezados de las tarjetas del dashboard del HR portal usan un patrón de layout similar.

---

## HTTP y Observables

**¿Qué es `HttpClient` en Angular?**
El servicio integrado para hacer peticiones HTTP. Devuelve Observables a los que te suscribes para obtener la respuesta. Lo uso en todos los proyectos que obtienen datos de una API externa.

**¿Qué es un Observable y en qué se diferencia de una Promise?**
Ambos gestionan operaciones asíncronas, pero los Observables son más potentes — pueden emitir múltiples valores a lo largo del tiempo, cancelarse y componerse con operadores. Las Promises se resuelven una sola vez y no se pueden cancelar. En la weather app uso `forkJoin` para obtener el tiempo actual y la previsión de 5 días en paralelo — con Promises necesitarías `Promise.all` y perderías la capacidad de cancelar si el componente se destruye.

**¿Qué es `subscribe()` y cuándo hay que desuscribirse?**
`subscribe()` inicia el Observable y recibe valores a través de los callbacks `next` y `error`. Hay que desuscribirse cuando el componente se destruye, de lo contrario la suscripción permanece activa y causa fugas de memoria. Uso `takeUntilDestroyed()` para gestionarlo automáticamente.

**¿Qué es `takeUntilDestroyed()`?**
Un operador de RxJS que cancela automáticamente una suscripción cuando el componente se destruye. Lo uso en la weather app y el meal finder donde las llamadas HTTP ocurren dentro de suscripciones — evita el patrón de desuscripción manual.

> **Consejo de entrevista:** Si dices "evita fugas de memoria", prepárate para explicar qué se filtra realmente. Di: "El componente se destruye pero la suscripción sigue viva. Cuando llega la respuesta HTTP, intenta actualizar un signal en un componente que ya no existe — Angular lanza un error o desperdicia recursos." Eso demuestra comprensión real, no solo una frase memorizada.

**¿Qué es `forkJoin()` y cuándo lo usas?**
Un operador de RxJS que ejecuta múltiples Observables en paralelo y espera a que todos completen antes de emitir los resultados combinados. Lo uso en la weather app para obtener el tiempo actual y la previsión de 5 días de una sola vez.

**¿Qué es `switchMap` y cuándo lo usas?**
Un operador que cancela el Observable interno anterior y lanza uno nuevo cada vez que el source emite. El caso clásico es la búsqueda mientras el usuario escribe — si teclea rápido, solo quieres el resultado de la última pulsación, no de todas las intermedias. Sin `switchMap`, varias peticiones HTTP podrían llegar en un orden incorrecto y la UI podría mostrar un resultado antiguo al final.

**¿Qué es `debounceTime` y cuándo lo usas?**
Un operador que retrasa la emisión de un valor hasta que haya pasado un tiempo determinado sin nuevos valores. Combinado con `switchMap`, evita una nueva petición HTTP en cada pulsación — `debounceTime(300)` significa que la petición solo se lanza 300ms después de que el usuario deje de escribir.

**¿Qué es `catchError` y cómo lo usas?**
Un operador que intercepta un error en el stream y te permite devolver un valor de reserva seguro en lugar de romper el Observable. Lo uso con `of([])` para devolver un array vacío cuando falla una llamada HTTP — la plantilla muestra entonces un estado vacío en lugar de nada.

**¿Por qué usaste subscribe() con takeUntilDestroyed() en lugar del pipe async en la weather app?**
Lo que realmente quieren saber: ¿Entiendes cuándo subscribe() es la elección correcta frente al pipe async?
R: El pipe async funciona bien cuando quieres mostrar un único Observable directamente en la plantilla. En la weather app uso forkJoin para obtener el tiempo y la previsión en paralelo y los almaceno en signals separados que uso en valores computed(). El pipe async no puede actualizar dos signals desde una sola suscripción, y devuelve null hasta que llegan los datos — lo que requiere comprobaciones extra en la plantilla. subscribe() con takeUntilDestroyed() me da control total sobre los signals de estado de carga y error.
Respuesta mala: "El pipe async es siempre mejor porque cancela la suscripción automáticamente." — Eso es una característica, no una razón. El pipe async y subscribe() resuelven problemas distintos. Decir "siempre" demuestra que no has pensado en el trade-off.

**¿Cuándo usarías catchError en el pipe en lugar del callback de error en subscribe()?**
Lo que realmente quieren saber: ¿Entiendes la diferencia entre recuperar un stream y reaccionar a un error?
R: Uso catchError dentro de pipe() cuando quiero que el Observable complete con normalidad tras un error — devolviendo of([]) para que la plantilla renderice un estado vacío en lugar de romperse. Uso el callback de error en subscribe() cuando solo necesito reaccionar al error y no hay stream que recuperar. En la weather app uso catchError para que un fallo en la previsión no rompa toda la página — el componente muestra un mensaje de error pero sigue funcionando. En la página de login uso el callback de error porque la operación tiene éxito o falla — no hay valor de fallback, simplemente pongo hasError a true.
Respuesta mala: "Siempre gestiono los errores en subscribe()." — Demuestra que nunca usaste catchError para recuperar un stream. Un senior preguntará inmediatamente qué le ocurre al Observable después de un error si no lo gestionas en el pipe.

---

## Routing

**¿Cómo funciona el routing en Angular?**
Defines las rutas en `app.routes.ts` como un array de pares ruta-componente. `RouterOutlet` en la plantilla es donde Angular renderiza el componente activo. La navegación puede ser declarativa con `routerLink` o programática con `router.navigate()`.

**¿Qué es un route guard?**
Una función que se ejecuta antes de activar una ruta y puede bloquear o redirigir la navegación. En el HR portal uso `authGuard` para redirigir a los usuarios no autenticados al login, y `adminGuard` para bloquear a los empleados de las rutas de administración.

**¿Cuál es la diferencia entre `CanActivate` y `CanDeactivate`?**
`CanActivate` se ejecuta antes de entrar a una ruta — se usa para comprobar autenticación o rol. `CanDeactivate` se ejecuta antes de salir — lo uso en el formulario de departamentos del HR portal para avisar al usuario si tiene cambios sin guardar antes de navegar.

**¿Cómo rediriges desde un guard?**
Devolviendo `router.createUrlTree(['/login'])` en lugar de `false`. Es más limpio porque le dice a Angular exactamente adónde ir, en lugar de simplemente bloquear la navegación.

**¿Cómo apilan varios guards en una ruta?**
Añadiéndolos al array `canActivate`: `canActivate: [authGuard, adminGuard]`. Angular los ejecuta en orden y se detiene en el primero que devuelve false o una redirección.

**¿Qué es `noAuthGuard` y por qué lo necesitas?**
Un guard que redirige a los usuarios ya autenticados fuera de la página de login. Sin él, un usuario con sesión activa puede pulsar el botón atrás del navegador y acabar en el login — una experiencia confusa. Es el opuesto de `authGuard`: `authGuard` bloquea usuarios no autenticados en rutas protegidas; `noAuthGuard` bloquea a usuarios autenticados en la ruta de login. En el HR portal lo aplico a la ruta de login para que los usuarios con sesión activa vayan directamente al dashboard.

**¿Cuál es la diferencia entre route params y query params?**
Los route params forman parte del path de la URL (`/employees/123`) e identifican un recurso específico. Los query params son extras opcionales (`/employees?status=active`) que se usan para filtros o estado temporal. En el HR portal, al hacer clic en una tarjeta de estadísticas del dashboard se pasa un query param de estado que la página de empleados lee al cargar para pre-aplicar un filtro.

**¿Qué es `pathMatch: 'full'` y por qué es necesario en una ruta de redirección?**
Le dice a Angular que solo coincida con la ruta si la URL completa coincide con el path, no solo el principio. Sin él, el path vacío `''` coincidiría con cualquier URL, por lo que todas las rutas redirigirían.

**¿Por qué leíste el parámetro de ruta con snapshot en lugar de suscribirte a paramMap en el meal finder?**
Lo que realmente quieren saber: ¿Sabes cuándo basta con leer una vez y cuándo necesitas reaccionar a cambios en los parámetros?
R: En el meal finder, navegar a una comida diferente siempre crea una nueva instancia de MealDetailPage — el id nunca cambia mientras el componente está vivo. snapshot lee la URL una sola vez y es la opción correcta. Usaría subscribe() en paramMap solo si el mismo componente pudiera mostrar diferentes elementos sin ser destruido — por ejemplo, un botón de "siguiente/anterior" que cambia el id en la URL manteniendo el componente activo. Usar subscribe() donde basta con snapshot añade complejidad innecesaria y una suscripción que gestionar.
Respuesta mala: "snapshot es más sencillo, así que lo uso siempre." — El entrevistador quiere escuchar que sabes cuándo la suscripción es necesaria, no que elegiste la opción más fácil.

**Un compañero añadió una ruta de administración nueva pero se olvidó el route guard. ¿Cómo lo encuentras y qué haces?**
Lo que realmente quieren saber: ¿Puedes auditar una base de código en busca de brechas de seguridad y pensar más allá de la solución inmediata?
R: Reviso app.routes.ts para ver si hay rutas de admin que no tengan canActivate: [authGuard, adminGuard] — es un análisis rápido. En el HR portal reviso el archivo de rutas cada vez que se añade una página nueva porque es fácil olvidar el guard cuando estás centrado en la funcionalidad. La solución es añadir los guards a la ruta. La pregunta más difícil es qué pasó antes — si la ruta estuvo activa sin guard, comprobaría si alguien la visitó y decidiría si informar al equipo. Los guards del frontend son una capa de UX, no la capa de seguridad real — el backend debe validar los permisos en cada petición de todos modos.
Respuesta mala: "Añadiría el guard." — Demuestra que solo piensas en la solución, no en el impacto. El entrevistador quiere ver que consideras lo que ya ocurrió.

---

## Lazy loading

**¿Qué es el lazy loading en Angular?**
Cargar un componente solo cuando el usuario navega a esa ruta, en lugar de incluirlo todo en el bundle inicial. En el HR portal, las rutas de administración y empleados tienen lazy loading porque la mayoría de usuarios son empleados que nunca visitan las páginas de admin — el bundle inicial es más pequeño.

**¿Cómo configuras el lazy loading en Angular 17+?**
Usando `loadComponent` en la definición de la ruta con un import dinámico: `loadComponent: () => import('./path').then(m => m.Component)`. Angular solo descarga ese código cuando el usuario navega a esa ruta por primera vez.

**¿Cómo afecta el lazy loading a la experiencia de usuario?**
La primera visita a una ruta lazy tiene un pequeño retraso mientras se descarga el código. Después queda en caché. Para la mayoría de apps de negocio el retraso es imperceptible, y la carga inicial más rápida vale la pena.

**¿Por qué pusiste lazy loading en las rutas de administración específicamente, y no en todas las rutas?**
Lo que realmente quieren saber: ¿Tomaste una decisión deliberada, o aplicaste el patrón mecánicamente?
R: La mayoría de usuarios del HR portal son empleados — nunca visitan el área de administración. Poner lazy loading en las rutas de admin significa que su bundle inicial no incluye ese código en absoluto. La página de login y el dashboard NO tienen lazy loading porque todos los usuarios llegan ahí en cada sesión — hacerles esperar un import dinámico añadiría un retraso sin ningún beneficio. La regla es: lazy loading en páginas que la mayoría de usuarios nunca visita. Carga eager en las páginas que todos ven primero.
Respuesta mala: "Puse lazy loading en todo." — Demuestra que el patrón se aplicó sin pensar. Poner lazy loading en la primera ruta que el usuario siempre visita añade un retraso innecesario.

---

## HTTP interceptors

**¿Qué es un HTTP interceptor?**
Una función que se ejecuta antes de cada petición HTTP, permitiendo añadir cabeceras, gestionar errores o registrar peticiones de forma global. En el HR portal, el interceptor de autenticación añade el token Bearer a cada petición para que ningún servicio tenga que hacerlo manualmente.

**¿Por qué usar un interceptor en lugar de añadir el token en cada servicio?**
Un solo interceptor gestiona todas las peticiones en un único lugar. Si el formato del token cambia, solo actualizas un archivo. En el HR portal, hacerlo en cada servicio significaría tocar seis archivos separados.

**¿Qué hace `req.clone()` en un interceptor?**
Las peticiones HTTP son inmutables, así que no puedes modificarlas directamente. `req.clone({ setHeaders: { Authorization: '...' } })` crea una copia con las nuevas cabeceras, que luego pasas a `next()`.

---

## Formularios reactivos

**¿Cuál es la diferencia entre formularios reactivos y formularios template-driven?**
Los formularios reactivos se definen en TypeScript — más predecibles, más fáciles de testear, mejores para validación compleja. Los template-driven viven principalmente en el HTML — más simples para casos básicos. Uso formularios reactivos en todos mis proyectos porque escalan mejor con Angular Material.

**¿Qué hace `markAllAsTouched()` y por qué lo llamas al enviar?**
Marca todos los campos como tocados para que aparezcan los mensajes de error de validación aunque el usuario no haya hecho clic en ningún campo. Sin él, un usuario que hace clic en Submit inmediatamente no vería ningún error — el formulario fallaría en silencio.

**¿Qué es `patchValue()` y cuándo lo usas?**
Actualiza solo los campos que proporcionas, dejando el resto sin cambios. Lo uso en modo edición para rellenar el formulario con datos existentes — a diferencia de `setValue()`, no requiere que proporciones todos los campos.

**¿Qué es `form.dirty` y cómo lo usas?**
Es `true` cuando el usuario ha cambiado al menos un campo. En el HR portal, compruebo `form.dirty` en `onCancel()` — si el formulario está sucio, abro un diálogo de confirmación antes de cerrar. Si no, cierro directamente.

**¿Cómo estableces un error de validación personalizado desde un servicio?**
Con `control.setErrors({ customKey: true })`. En el HR portal, después de comprobar si hay un nombre de departamento duplicado, llamo a `setErrors({ duplicate: true })` en el campo nombre — `mat-error` muestra el mensaje de error automáticamente.

**¿Qué es `markAsPristine()` y cuándo lo usas?**
Resetea `form.dirty` a false de forma programática. Lo llamo después de guardar con éxito para que el guard `CanDeactivate` no se active cuando Angular navega tras el guardado.

**¿Qué es `FormArray` y cuándo lo usas?**
Un `FormGroup` tiene un conjunto fijo de campos con nombre. Un `FormArray` tiene una lista dinámica de controles — puedes añadir y eliminar en tiempo de ejecución. El caso más común es un formulario donde el usuario puede añadir varios elementos: números de teléfono, direcciones, habilidades. Accedes a los elementos por índice, no por nombre. En mis proyectos uso `FormGroup` para los formularios de empleados y departamentos donde los campos son fijos. `FormArray` es la opción correcta cuando el número de campos no se conoce de antemano.

---

## Lifecycle hooks

**¿Qué es `ngOnInit` y cuándo lo usas?**
Un lifecycle hook que se ejecuta una vez cuando el componente carga. Lo uso para obtener datos iniciales, leer route params o aplicar filtros de query params — cualquier cosa que deba ocurrir una sola vez al inicio.

**¿Qué es `ngAfterViewInit` y cuándo lo usas?**
Un lifecycle hook que se ejecuta después de que la plantilla esté completamente construida. Es el primer momento seguro para usar referencias de `@ViewChild`. En el task manager conecto `MatSort` a `MatTableDataSource` aquí, porque antes de este punto la directiva sort todavía no existe.

**¿Qué es `@ViewChild` y cómo lo usas?**
Un decorador que obtiene una referencia a un componente hijo o directiva desde la plantilla. Uso `@ViewChild(MatSort)` para acceder a la directiva sort y conectarla a `MatTableDataSource` en `ngAfterViewInit`.

**¿Qué es `ngOnChanges` y cuándo se ejecuta?**
Un lifecycle hook que se ejecuta cada vez que un padre actualiza una propiedad decorada con `@Input()`. Recibe un objeto `SimpleChanges` con los valores anterior y actual para que puedas reaccionar a cambios específicos de propiedad. En Angular moderno (17+) con la API de signals `input()`, usas `effect()` para el mismo propósito — se ejecuta cuando cambia el signal. `ngOnChanges` sigue siendo importante porque lo verás en cualquier base de código enterprise construida antes de la API de signals.

> **Consejo de entrevista:** Los entrevistadores hacen esta pregunta para ver si conoces solo la API moderna o también entiendes la historia. Menciona ambas: "Patrón antiguo: `@Input()` + `ngOnChanges`. Patrón moderno: signal `input()` + `effect()`." Esto demuestra que puedes leer código legacy y escribir código moderno.

**¿Por qué llamas a los métodos de API en ngOnInit en lugar del constructor?**
Lo que realmente quieren saber: ¿Entiendes qué ha configurado Angular y qué no cuando se ejecuta el constructor?
R: El constructor se ejecuta cuando Angular crea la clase — en ese momento el sistema de routing aún no ha adjuntado los datos de la URL, los inputs no están establecidos y la plantilla no existe. ngOnInit se ejecuta después de que Angular termina de configurar el componente: los route params son legibles, los inputs están disponibles y el componente está listo para mostrar datos. En el meal finder, leo el id de la comida desde ActivatedRoute en ngOnInit — en el constructor estaría undefined y la llamada a la API fallaría en silencio sin ningún error visible para el usuario.

> **Consejo de entrevista:** Conecta el momento con una consecuencia concreta: "Si llamo a la API en el constructor, el route param es undefined — envío una petición incorrecta y no se renderiza nada." Eso es más convincente que decir "ngOnInit es lo estándar."

---

## Pipes

**¿Qué es un pipe en Angular?**
Una función de plantilla que transforma un valor antes de mostrarlo. `{{ fecha | date }}` formatea una fecha, `{{ precio | number:'1.2-2' }}` formatea un número. Mantienen la lógica de transformación fuera del componente.

**¿Qué pipes has usado?**
`date` para formatear fechas ISO, `number` con formato `'1.0-1'` para mostrar un decimal, y `SlicePipe` para recortar cadenas en la plantilla. En el HR portal uso `date` en las fechas de solicitudes de baja y fechas de contratación de empleados.

**¿Cómo creas un pipe personalizado?**
Creas una clase decorada con `@Pipe({ name: 'miPipe' })` que implementa `PipeTransform`. El método `transform()` recibe el valor y los argumentos opcionales, y devuelve el resultado transformado. Por ejemplo, un pipe `truncate` que recorta texto largo a una longitud máxima y añade `...`. Lo generas con `ng generate pipe` y lo importas en el array `imports` del componente como cualquier otro pipe standalone.

**¿Qué es el pipe `async` y cuándo lo usas?**
Se suscribe a un Observable directamente en la plantilla y cancela la suscripción automáticamente cuando el componente se destruye — sin `subscribe()`, sin `takeUntilDestroyed()`. `{{ employees$ | async }}` muestra el valor en cuanto llega. Uso signals para mi propio estado, pero uso el pipe `async` cuando trabajo con Observables que no he creado yo — por ejemplo, datos de ruta o streams de un servicio compartido. Lo verás en todas partes en bases de código enterprise existentes.

**¿Cómo gestionas las API keys en Angular?**
Nunca las escribo directamente en el componente o servicio — acabarían commiteadas en git. Uso los archivos de entorno de Angular: `ng generate environments` crea `environment.ts` que se añade a `.gitignore`. El servicio importa desde ahí: `import { environment } from '../../environments/environment'`. Matiz importante: cualquier valor en el bundle del frontend es visible en el DevTools del navegador. Para claves verdaderamente sensibles, la solución correcta es hacer proxy de la llamada a través de un backend — la clave vive en el servidor, nunca en el navegador.

**¿Cuándo crearías un pipe personalizado en lugar de un signal computed() o un método en la plantilla?**
Lo que realmente quieren saber: ¿Entiendes cuándo la reutilización y el rendimiento justifican crear un pipe frente a alternativas más simples?
R: Un pipe personalizado es la opción correcta cuando la misma transformación se necesita en varios componentes — se importa una vez por componente y se reutiliza en cualquier plantilla. computed() es mejor cuando la transformación es específica de un componente y depende de signals. Un método en la plantilla se vuelve a ejecutar en cada ciclo de detección de cambios — un pipe puro, como computed(), solo se recalcula cuando cambia la entrada. En un proyecto con tres componentes diferentes que muestran descripciones truncadas, un TruncatePipe es la opción correcta. En el HR portal usé el DatePipe integrado para las fechas de solicitudes de baja en la tabla y el diálogo — ya estaba disponible, así que no necesité un pipe personalizado.

> **Consejo de entrevista:** La distinción clave que debes mencionar: "Un pipe puro cachea su resultado — solo se recalcula cuando cambia la entrada, igual que computed()." Eso demuestra que entiendes el rendimiento, no solo cómo usar el pipe.

---

## Angular Material

**¿Qué es Angular Material?**
La librería oficial de componentes de Google para Angular basada en Material Design. Proporciona componentes accesibles y listos para usar — tablas, diálogos, formularios, botones — que siguen un sistema de diseño consistente. Es el estándar en proyectos Angular enterprise españoles.

**¿Qué variantes de botón tiene Angular Material y cuándo usas cada una?**
Seis variantes: `mat-button` (texto plano, sin fondo — acciones de baja importancia como Cancelar), `mat-raised-button` (relleno con sombra — acciones primarias), `mat-flat-button` (relleno sin sombra — acciones primarias en diseños planos), `mat-stroked-button` (contorno — acciones secundarias que necesitan más presencia que el texto plano), `mat-icon-button` (solo icono, sin texto — acciones en toolbar como borrar o cerrar), `mat-fab` (botón de acción flotante — la acción principal de una página). El atributo `color` (`primary`, `accent`, `warn`) aplica el color del tema. En el HR portal uso `mat-flat-button` para confirmar y `mat-stroked-button` para cancelar.

**¿Cómo construyes un app shell con `MatToolbar`?**
`mat-toolbar` es una barra de cabecera de altura fija. La coloco dentro de `mat-sidenav-content` para que se quede en la parte superior del área de contenido mientras el sidenav permanece a la izquierda. Material no separa los elementos del toolbar automáticamente — añado `display: flex; justify-content: space-between` para empujar el título a la izquierda y el botón de logout a la derecha. Todo el shell está envuelto en `@if (isLoggedIn())` para que solo se renderice cuando el usuario está autenticado.

**¿Cómo funciona `MatSelect` dentro de un formulario reactivo?**
Usas `<mat-select>` dentro de un `mat-form-field` y lo vinculas a un `FormControl` con `formControlName`. Las opciones van dentro de elementos `<mat-option>` — las recorres con `@for`. Cuando las opciones vienen de un servicio, las cargas en `ngOnInit` y las guardas en un signal. `mat-error` funciona igual que con cualquier otro input de Material.

**¿Qué es `MatSidenav` y cuándo lo usas?**
Un panel de navegación lateral que puede ser permanente, con toggle o superpuesto. En apps enterprise reemplaza la navegación por pestañas de nivel superior — el sidenav contiene los enlaces de navegación principales y permanece visible mientras `<mat-sidenav-content>` contiene la página activa. El patrón estándar es `mat-sidenav-container` envolviendo tanto el sidenav como el contenido, con una toolbar dentro del área de contenido. Envuelves toda la estructura en `@if (isLoggedIn())` para que solo se muestre cuando el usuario está autenticado.

**¿Qué es `MatTableDataSource` y por qué usarlo en lugar de un array?**
Un wrapper que gestiona automáticamente la ordenación, el filtrado y la paginación de una tabla Material. En el task manager lo uso porque la tabla necesitaba ordenación desde el primer día — elimina la necesidad de escribir esa lógica manualmente.

**¿Cómo funciona `MatSort`?**
Añades `mat-sort-header` a cada `<th>`, conectas `@ViewChild(MatSort)` a `dataSource.sort` en `ngAfterViewInit`, y la tabla gestiona la ordenación automáticamente. La directiva va en `<th>`, no en `ng-container`.

**¿Qué es `MAT_DIALOG_DATA` y cómo funciona?**
Un token que permite pasar datos desde el padre a un diálogo en el momento de abrirlo. Dentro del diálogo lo inyectas con `inject(MAT_DIALOG_DATA)`. En el HR portal, el diálogo de empleados recibe los datos del empleado existente de esta forma cuando se abre en modo edición.

**¿Cómo recuperas datos de un diálogo?**
El diálogo llama a `dialogRef.close(valor)` y el padre lo lee en `afterClosed().subscribe(result => { if (result) { ... } })`. En el HR portal, el diálogo de confirmación devuelve `true` al confirmar y `undefined` al cancelar — el padre siempre comprueba `if (result)` antes de continuar.

**¿Qué es el patrón de diálogo dual?**
Usar un único componente de diálogo tanto para añadir como para editar. El diálogo comprueba si `MAT_DIALOG_DATA` está presente para decidir el modo — si hay datos, rellena el formulario con `patchValue()`. Evita mantener dos plantillas casi idénticas. Lo uso en el task manager y el HR portal.

**¿Cómo proteges un diálogo para que no se cierre accidentalmente cuando el formulario está sucio?**
Dos pasos. Primero, poner `disableClose: true` al abrir el diálogo — esto evita que Material lo cierre automáticamente al hacer clic en el backdrop o pulsar Escape. Segundo, suscribirse a `dialogRef.backdropClick()` en el constructor del diálogo y redirigirlo a `onCancel()` — el mismo método que llama el botón Cancelar. Así los tres caminos de cierre (botón Cancelar, clic en backdrop, Escape) pasan por la comprobación de sucio. En el HR portal, el diálogo de empleados usa este patrón porque el formulario tiene dos pasos en el stepper y perder datos a mitad sería frustrante.

**¿Para qué sirve `MatSnackBar`?**
Notificaciones toast cortas tras acciones del usuario — guardados, eliminaciones, errores. Lo inyecto en el coordinador de página y llamo a `snackBar.open(mensaje, 'Cerrar', { duration: 3000 })` después de cada operación del servicio. Solo se muestra un snackbar a la vez.

**¿Qué es `MatStepper` y cuándo es útil?**
Un componente que divide un formulario en pasos secuenciales, cada uno con su propia validación. Lo uso en el diálogo de empleados del HR portal — el formulario tenía demasiados campos para una sola pantalla, así que lo dividí en "Información personal" y "Datos del puesto".

**¿Por qué `stepper.next()` necesita validación manual?**
`stepper.next()` avanza al siguiente paso de forma incondicional — no comprueba `[stepControl]`. Cuando los botones están fuera del elemento `<mat-stepper>` (como en `mat-dialog-actions`), la directiva `matStepperNext` tampoco puede encontrar el stepper. Por eso valido manualmente en `onNext()` antes de llamar a `stepper.next()`.

**¿Qué es `MatDatepicker` y qué necesita para funcionar?**
Un selector de fecha con calendario emergente. Necesita `MatDatepickerModule` en los imports del componente y `provideNativeDateAdapter()` en `app.config.ts` — esto le dice a Angular Material que use el objeto `Date` nativo de JavaScript. El valor del formulario sale como `Date`, así que lo convierto y llamo a `.toISOString().split('T')[0]` para almacenarlo como cadena `YYYY-MM-DD`.

**¿Cómo añades paginación a una tabla Material?**
Añades `<mat-paginator>` debajo de la tabla, obtienes una referencia con `@ViewChild(MatPaginator)`, y la conectas a `dataSource.paginator` en `ngAfterViewInit` — el mismo patrón que `MatSort`. `MatTableDataSource` gestiona el corte de datos automáticamente. Un detalle: cuando el usuario aplica un filtro, llama a `paginator.firstPage()` para que siempre aterrice en la página 1 en lugar de ver una página 3 vacía.

**¿Qué es `mat-error` y cuándo se muestra?**
Un componente Material que muestra mensajes de error de validación dentro de un `mat-form-field`. Por defecto se muestra cuando el control es inválido Y ha sido tocado. Para más control sobre cuándo aparece, usas `ErrorStateMatcher`.

**¿Por qué usaste `mat.theme()` en SCSS en vez de sobreescribir clases CSS para personalizar el tema de Material?**
Lo que realmente quieren saber: ¿Entiendes el sistema de theming de Material, o encontraste un hack que funcionó?
R: `mat.theme()` es la API oficial — establece color, tipografía y densidad a través del sistema de design tokens de Material. Todos los componentes de la app recogen el tema automáticamente mediante las variables CSS `--mat-sys-*`. Sobreescribir clases CSS es frágil: se rompe cuando Angular Material actualiza los nombres de clase internos entre versiones, y bypasea el sistema de tokens para que los componentes que generan sus propios estilos internos no reciban el cambio. En el task manager y el HR portal defino el tema una vez en `material-theme.scss` usando `mat.$violet-palette` — todos los componentes Material usan la misma paleta sin necesidad de sobrescrituras por componente.
Respuesta mala: "Sobreescribí las clases CSS." — El entrevistador sabe que funciona. Quiere escuchar que usaste la API oficial y entiendes por qué existe.

> **Consejo de entrevista:** Esta pregunta separa a los desarrolladores que leyeron la documentación de Material de los que buscaron un arreglo rápido en Google. Menciona `mat.theme()`, `mat.$violet-palette` y las variables `--mat-sys-*` — estas señales demuestran familiaridad real con Material.

---

## Estilos de componente

**¿Qué es la encapsulación de vistas en Angular?**
Angular añade un atributo único a cada elemento de la plantilla de un componente y transforma los selectores CSS para que solo coincidan con elementos que tienen ese atributo. Esto significa que el CSS del componente está encapsulado — solo afecta a los elementos que escribiste en tu propia plantilla, no a otros componentes. La consecuencia práctica: si un componente Material renderiza HTML interno, tu CSS de componente no puede alcanzarlo — tienes que poner esa regla en el `styles.css` global.

**¿Cuándo usas el CSS de componente versus el `styles.css` global?**
CSS de componente para los elementos que escribiste en tu propia plantilla — `form`, `mat-form-field`, `mat-card`. `styles.css` global para los elementos internos renderizados por directivas de Material — como `.mat-sort-header-container` o `.mat-mdc-form-field-infix`. Si un estilo no funciona en el CSS del componente, lo primero que hay que comprobar es si el elemento lo renderiza Angular o un componente de Material internamente.

---

## Tests unitarios

**¿Has escrito tests unitarios en Angular?**
Sí — testeo servicios con Jasmine y TestBed. El patrón es: configurar un módulo de test en `beforeEach`, obtener el servicio con `TestBed.inject()`, y escribir cada aserción en su propio bloque `it`. Para servicios que hacen llamadas HTTP uso `HttpClientTestingModule` para que no se hagan peticiones reales a la red.

**¿Qué es TestBed?**
El módulo de testing de Angular — crea un entorno Angular en miniatura para el test. Lo configuras con los mismos providers e imports que usarías en la app real. Sin TestBed, la inyección de dependencias de Angular no funciona en los tests.

**¿Qué es `HttpClientTestingModule` y por qué lo usas?**
Un reemplazo de `HttpClientModule` para tests que intercepta las llamadas HTTP en lugar de hacer peticiones reales a la red. En un test, llamas al método del servicio, usas `HttpTestingController.expectOne(url)` para verificar que se hizo la petición, y `req.flush(mockData)` para enviar una respuesta falsa. Esto hace los tests rápidos, predecibles e independientes de la red.

**¿Qué es `spyOn` y cuándo lo usas?**
Una función de Jasmine que reemplaza un método con uno falso que puedes controlar e inspeccionar. Lo uso para comprobar que un método fue llamado con el argumento correcto, o para evitar que la lógica real se ejecute en una dependencia. `expect(spy).toHaveBeenCalledWith(id)` se lee con claridad y hace obvio el objetivo del test.

**¿Para qué sirve `afterEach(() => httpMock.verify())`?**
Comprueba que no se hicieron peticiones HTTP inesperadas durante el test. Si un método lanza una petición que no contemplaste en tu test, `verify()` falla el test — esto evita bugs silenciosos donde peticiones extra pasan desapercibidas.

**¿Por qué usar HttpClientTestingModule en lugar de espiar directamente los métodos de HttpClient?**
Lo que realmente quieren saber: ¿Entiendes qué estás testeando realmente y qué estás evitando?
R: Espiar los métodos de HttpClient directamente simula toda la capa HTTP antes de que llegue al servicio — estarías testeando que el método llama al spy, no que construye la URL correcta, usa el método HTTP correcto o mapea la respuesta correctamente. HttpClientTestingModule deja que el código real del servicio se ejecute pero intercepta a nivel de red. En un test del servicio de empleados, expectOne('/api/employees') verifica la URL exacta, req.request.method verifica que sea un GET, y flush(mockData) testea cómo el servicio gestiona la respuesta. Toda la lógica real se ejecuta — solo la red es falsa.
Respuesta mala: "HttpClientTestingModule es la forma que propone Angular." — Eso es una convención, no una razón. Demuestra que sabes exactamente qué estás testeando.

---

## Detección de cambios

**¿Qué es la detección de cambios en Angular?**
El proceso que usa Angular para decidir cuándo actualizar el DOM. Después de cada evento del navegador, Angular comprueba si los datos de algún componente cambiaron y re-renderiza las partes afectadas. Por defecto comprueba todos los componentes del árbol, incluso los que no cambiaron.

**¿Cuál es la diferencia entre la detección de cambios Default y OnPush?**
Default comprueba el componente en cada evento del navegador, independientemente de si sus datos cambiaron. OnPush solo comprueba cuando cambia la referencia de un `input()`, cuando se dispara un evento dentro del componente, o cuando cambia un signal que lee. OnPush es más eficiente pero requiere datos inmutables — si mutas un array directamente en lugar de reemplazarlo, la plantilla no se actualizará porque la referencia no cambió.

**¿Cómo funcionan los signals con OnPush?**
Los signals y OnPush están diseñados para funcionar juntos. Cuando un signal dentro de un componente OnPush cambia, Angular marca ese componente para revisión automáticamente — no necesitas llamar a `ChangeDetectorRef` manualmente. Esto significa que obtienes el rendimiento de OnPush sin trabajo extra cuando usas signals para todo el estado.

**¿Cómo decidiste qué componentes deben usar `OnPush` y cuáles `Default`?**
Lo que realmente quieren saber: ¿Aplicaste OnPush de forma meditada, o lo pusiste en todas partes esperando ganar rendimiento?
R: Aplico `OnPush` a los componentes presentacionales puros — los que solo reciben signals `input()` y emiten eventos. En el HR portal, la tabla, los filtros y el diálogo hijo son buenos candidatos porque sus renders dependen exclusivamente de cambios en `input()`. El componente coordinador de página usa `Default` — gestiona el estado del servicio, abre diálogos y tiene muchas partes en movimiento donde la simplicidad importa más que la reducción de comprobaciones. Con signals, `OnPush` es seguro porque los cambios de signal siempre disparan una recomprobación automáticamente.
Respuesta mala: "Uso OnPush en todos los componentes para más rendimiento." — Aplicarlo sin entender el contrato signal/datos inmutables puede hacer que los componentes se pierdan actualizaciones cuando mutamos objetos directamente en lugar de reemplazarlos.

---

## Arquitectura y patrones

**¿Qué es la arquitectura Core/Feature/Shared?**
Una estructura de carpetas donde `core/` contiene los singletons usados en toda la app (guards, interceptors, servicios), `pages/` contiene las áreas funcionales, y `shared/` contiene los componentes reutilizables. Es el estándar en proyectos Angular enterprise en empresas como NTT Data y Capgemini.

**¿Qué es el patrón coordinator y por qué lo usas?**
El componente de página es propietario de todo el estado y gestiona todos los eventos. Los componentes hijo solo reciben datos mediante `input()` y emiten eventos mediante `output()` — nunca tocan el servicio directamente. En el HR portal, la página de empleados coordina la tabla, los filtros y el diálogo. Esto mantiene los hijos reutilizables y evita tener múltiples copias del mismo dato desincronizadas.

**¿Cuál es la diferencia entre el patrón smart/dumb y el coordinator?**
Smart/dumb funciona bien con uno o dos componentes hijo. El coordinator es la misma idea pero formalizada para páginas que gestionan muchos hijos que comparten el mismo estado. Usé smart/dumb en el expense tracker y pasé al coordinator en los proyectos 05 y 06 cuando creció la complejidad.

**¿Por qué usar un servicio para el estado en lugar de guardarlo en el componente?**
Los servicios son singletons — si dos páginas necesitan los mismos datos, el servicio mantiene una sola copia y ambas se sincronizan automáticamente. En el HR portal, la página de solicitudes de baja y el dashboard dependen de la lista de empleados — sin un servicio, cada uno necesitaría su propia copia y una forma de mantenerse sincronizado.

**¿Qué es `Omit<T, 'campo'>` y cuándo lo usas?**
Un tipo utilitario de TypeScript que crea un nuevo tipo a partir de uno existente, eliminando campos específicos. Lo uso al crear una entidad nueva que todavía no tiene ID — `Omit<Employee, 'id'>` me da todos los campos excepto el ID, que genera el servidor.

**Nunca has usado NgModules. ¿Es un problema?**
Lo que realmente quieren saber: ¿Sabes que existen los NgModules y puedes trabajar con código legacy?
R: Los NgModules eran el estándar antes de Angular 14. Cada módulo declaraba componentes, importaba otros módulos y proporcionaba servicios. Los componentes standalone, que pasaron a ser los predeterminados en Angular 17+, eliminan casi todo ese código repetitivo — cada componente declara sus propias importaciones. Los proyectos nuevos usan standalone. Pero las bases de código enterprise existentes siguen usando módulos, y entiendo el patrón. Necesitaría tiempo para ser productivo en una base de código grande basada en módulos, pero los conceptos no son nuevos para mí — sé lo que hace un módulo y por qué existía.
Respuesta mala: "No sé qué son los NgModules." — Un junior que solo ha leído documentación moderna puede decir esto. Hay que demostrar que conoces la historia y puedes leer código antiguo.

---

## Preguntas sobre proyectos

**Cuéntame el HR portal.**
Es una app de gestión de RRHH con roles de administrador y empleado que simula una herramienta enterprise real — el tipo de aplicación interna que encontrarías en una consultora. El problema principal que resuelve es que no todos deben ver o hacer lo mismo: los administradores gestionan empleados y departamentos, los empleados solo ven sus datos y solicitan bajas. La decisión técnica más interesante fue el sistema de guards — apilar `authGuard` y `adminGuard` en la misma ruta, y luego gestionar `CanDeactivate` sin que bloqueara la navegación tras un guardado exitoso. Ahí es donde `markAsPristine()` fue clave. Si lo mejorara, lo primero sería conectarlo a un backend real en Spring Boot con autenticación JWT real en lugar del enfoque simulado con localStorage.

**¿Cuál es la parte más compleja del HR portal?**
El sistema de guards — apilar `authGuard` y `adminGuard` juntos, asegurarse de que los guards se ejecuten en el orden correcto, y gestionar el guard `CanDeactivate` en los formularios sin que interfiera con la navegación programática tras un guardado. La llamada a `markAsPristine()` después de un guardado exitoso fue la clave para que funcionara correctamente.

**¿Qué cambiarías en el HR portal si tuvieras más tiempo?**
Añadiría tests unitarios a los servicios — la lógica de comprobación de duplicados y las funciones de guard son buenos candidatos iniciales. También conectaría el proyecto a un backend real en Spring Boot con autenticación JWT real en lugar del enfoque simulado con localStorage.

**¿Cuál fue el bug más difícil que resolviste en tus proyectos?**
En el stepper del HR portal, puse `[linear]="false"` por error y no entendía por qué no funcionaba la validación. Entonces me di cuenta de que `stepper.next()` tampoco comprueba `[stepControl]` — avanza de forma incondicional. Tuve que mover la lógica de validación a `onNext()` y llamar a `markAllAsTouched()` manualmente antes de decidir si avanzar. Fue una buena lección: siempre lee lo que realmente hace un método, no lo que esperas que haga.

**¿Cómo gestionas los errores HTTP en Angular?**
Lo que realmente quieren saber: ¿Piensas en los casos de error, no solo en el camino feliz?
R: En la weather app gestiono los errores en el callback de error de `subscribe()` — pongo un signal `hasError` a true y muestro un mensaje en la plantilla. Para errores globales como el 401, un interceptor es el lugar adecuado — puede redirigir al login sin tocar cada servicio individualmente.
Respuesta mala: "Uso try/catch." — Eso es para código síncrono. Decir esto sobre Observables significa que nunca has gestionado un error HTTP real en Angular.

**¿Cómo le explicarías el patrón coordinator a un compañero que nunca lo ha visto?**
Lo que realmente quieren saber: ¿Entiendes el patrón lo suficiente para enseñarlo, o simplemente lo copiaste?
R: La página es el coordinador — es propietaria de los datos y decide qué ocurre. Los componentes hijo son como pantallas — muestran lo que les das y te avisan cuando el usuario hace algo, pero nunca toman decisiones ellos solos. En el HR portal, la página de empleados es el coordinador: la tabla, los filtros y el diálogo le reportan a ella.
Respuesta mala: "Es como smart/dumb components." — No está mal, pero demuestra que aprendiste la etiqueta sin entender el motivo.

**¿Por qué usaste localStorage en lugar de un backend real para el HR portal?**
Lo que realmente quieren saber: ¿Entiendes el trade-off, o simplemente seguiste un tutorial?
R: El objetivo de este proyecto eran los patrones de Angular — guards, lazy loading, interceptores, acceso basado en roles. Construir un backend en Spring Boot al mismo tiempo habría dividido el foco y ralentizado todo. Cada servicio usa `signal()` + `effect()` para persistir en localStorage automáticamente. El interceptor HTTP está diseñado para funcionar de forma idéntica con una API real — reemplazar localStorage por Spring Boot en el proyecto 07 no requiere ningún cambio en la capa Angular.
Respuesta mala: "Porque es fácil." — El entrevistador ya lo sabe. Quiere escuchar que entiendes lo que sacrificaste y que la arquitectura está lista para el backend real.

**Construiste seis proyectos Angular en solitario. ¿Cómo cambiaría tu forma de trabajar en un equipo de cinco desarrolladores?**
Lo que realmente quieren saber: ¿Estás listo para la colaboración profesional, o solo sabes trabajar solo?
R: El mayor cambio sería la disciplina con git — revisiones de PR, nunca mergear tu propio código, mantener commits atómicos para que los compañeros puedan seguir el historial. Ya uso Conventional Commits y ramas de features en mis proyectos personales. La parte más difícil es acordar la arquitectura de antemano para que el código base sea consistente — eso es exactamente lo que soluciona Core/Feature/Shared.
Respuesta mala: "Comunicaría más." — Demasiado vago. El entrevistador quiere escuchar prácticas concretas.

**¿Qué es un JWT y cómo funciona en una app Angular + Spring Boot?**
Lo que realmente quieren saber: ¿Entiendes el flujo de autenticación de extremo a extremo, o solo el lado Angular?
R: JWT es un token que el servidor envía tras el login — contiene datos del usuario codificados y una firma. El cliente Angular lo almacena y lo envía en cada petición como Bearer token en la cabecera `Authorization` mediante un interceptor. El backend de Spring Boot valida la firma en cada petición sin necesidad de consultar una sesión en base de datos. En el HR portal lo simulo — el interceptor añade el token, pero el backend está reemplazado por localStorage así que no hay servidor que lo valide.
Respuesta mala: "Es un token para autenticación." — Todos los juniors dicen esto. El entrevistador quiere el flujo, no la definición.
