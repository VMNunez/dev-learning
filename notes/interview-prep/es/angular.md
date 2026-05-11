# Angular — Preguntas de entrevista

## Conceptos básicos de Angular

**¿Qué es Angular?**
Un framework frontend basado en TypeScript creado por Google para construir aplicaciones web. Incluye todo integrado: routing, formularios, cliente HTTP y un sistema de componentes — a diferencia de React, que es solo una librería de UI.

**¿Cuál es la diferencia entre Angular y React?**
Angular es un framework completo con opiniones sobre cómo estructurar todo. React es una librería de UI que te deja elegir tus propias herramientas para el routing, el estado y el HTTP. En las empresas españolas, Angular es más común en proyectos enterprise grandes — por eso elegí centrarme en él.

**¿Qué es un componente en Angular?**
El bloque de construcción básico de la UI. Cada componente es una clase TypeScript con una plantilla (HTML), estilos (CSS) y un selector. Los componentes se comunican entre sí mediante `input()` y `output()`.

**¿Qué es la inyección de dependencias en Angular?**
Un patrón de diseño donde una clase recibe sus dependencias desde fuera en lugar de crearlas ella misma. En Angular, usas `inject(ServiceClass)` para obtener una instancia singleton — Angular la crea una vez y la comparte en toda la app.

**¿Qué es un servicio en Angular?**
Una clase decorada con `@Injectable` que contiene lógica compartida o estado. Uso servicios en todos mis proyectos para separar la lógica de negocio del componente — por ejemplo, el `EmployeeService` en el HR portal gestiona todas las llamadas a la API y la lista de empleados.

---

## Signals y reactividad

**¿Qué es un signal en Angular?**
Un valor reactivo que actualiza automáticamente la plantilla cuando cambia. En todos mis proyectos uso signals para el estado local — son más simples y predecibles que los subjects de RxJS para el estado de la UI.

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

**¿Qué es `[(ngModel)]` y cuándo lo usas?**
Binding bidireccional — lee el valor del input en una variable Y lo escribe de vuelta cuando el usuario teclea. La sintaxis se llama "banana in a box" por la forma de `[()]`. Lo uso para inputs simples fuera de un formulario reactivo, como un campo de búsqueda que no necesita validación. Para formularios con validación uso siempre formularios reactivos.

**¿Qué es `[ngStyle]` y cuándo lo usas?**
Aplica estilos inline de forma dinámica: `[ngStyle]="{ 'color': isAdmin ? 'red' : 'black' }"`. Para una sola propiedad prefiero la forma más corta `[style.color]="condición ? 'red' : 'black'"`. `[ngStyle]` es útil cuando necesitas aplicar varios estilos dinámicos a la vez desde un objeto.

**¿Qué es una directiva personalizada y cuándo es útil?**
Una clase decorada con `@Directive` que añade comportamiento a un elemento host sin crear un nuevo componente. Es útil cuando el mismo comportamiento DOM debe aplicarse a muchos elementos — por ejemplo, enfocar automáticamente un input o resaltar al pasar el ratón. La directiva usa `ElementRef` para acceder al elemento y `@HostListener` para reaccionar a eventos.

---

## HTTP y Observables

**¿Qué es `HttpClient` en Angular?**
El servicio integrado para hacer peticiones HTTP. Devuelve Observables a los que te suscribes para obtener la respuesta. Lo uso en todos los proyectos que obtienen datos de una API o de `json-server`.

**¿Qué es un Observable y en qué se diferencia de una Promise?**
Ambos gestionan operaciones asíncronas, pero los Observables son más potentes — pueden emitir múltiples valores a lo largo del tiempo, cancelarse y componerse con operadores. Las Promises se resuelven una sola vez y no se pueden cancelar. En la weather app uso `forkJoin` para obtener el tiempo actual y la previsión de 5 días en paralelo — con Promises necesitarías `Promise.all` y perderías la capacidad de cancelar si el componente se destruye.

**¿Qué es `subscribe()` y cuándo hay que desuscribirse?**
`subscribe()` inicia el Observable y recibe valores a través de los callbacks `next` y `error`. Hay que desuscribirse cuando el componente se destruye, de lo contrario la suscripción permanece activa y causa fugas de memoria. Uso `takeUntilDestroyed()` para gestionarlo automáticamente.

**¿Qué es `takeUntilDestroyed()`?**
Un operador de RxJS que cancela automáticamente una suscripción cuando el componente se destruye. Lo uso en la weather app y el meal finder donde las llamadas HTTP ocurren dentro de suscripciones — evita el patrón de desuscripción manual.

**¿Qué es `forkJoin()` y cuándo lo usas?**
Un operador de RxJS que ejecuta múltiples Observables en paralelo y espera a que todos completen antes de emitir los resultados combinados. Lo uso en la weather app para obtener el tiempo actual y la previsión de 5 días de una sola vez.

**¿Qué es `switchMap` y cuándo lo usas?**
Un operador que cancela el Observable interno anterior y lanza uno nuevo cada vez que el source emite. El caso clásico es la búsqueda mientras el usuario escribe — si teclea rápido, solo quieres el resultado de la última pulsación, no de todas las intermedias. Sin `switchMap`, varias peticiones HTTP podrían llegar en un orden incorrecto y la UI podría mostrar un resultado antiguo al final.

**¿Qué es `debounceTime` y cuándo lo usas?**
Un operador que retrasa la emisión de un valor hasta que haya pasado un tiempo determinado sin nuevos valores. Combinado con `switchMap`, evita una nueva petición HTTP en cada pulsación — `debounceTime(300)` significa que la petición solo se lanza 300ms después de que el usuario deje de escribir.

**¿Qué es `catchError` y cómo lo usas?**
Un operador que intercepta un error en el stream y te permite devolver un valor de reserva seguro en lugar de romper el Observable. Lo uso con `of([])` para devolver un array vacío cuando falla una llamada HTTP — la plantilla muestra entonces un estado vacío en lugar de nada.

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

**¿Cuál es la diferencia entre route params y query params?**
Los route params forman parte del path de la URL (`/employees/123`) e identifican un recurso específico. Los query params son extras opcionales (`/employees?status=active`) que se usan para filtros o estado temporal. En el HR portal, al hacer clic en una tarjeta de estadísticas del dashboard se pasa un query param de estado que la página de empleados lee al cargar para pre-aplicar un filtro.

**¿Qué es `pathMatch: 'full'` y por qué es necesario en una ruta de redirección?**
Le dice a Angular que solo coincida con la ruta si la URL completa coincide con el path, no solo el principio. Sin él, el path vacío `''` coincidiría con cualquier URL, por lo que todas las rutas redirigirían.

---

## Lazy loading

**¿Qué es el lazy loading en Angular?**
Cargar un componente solo cuando el usuario navega a esa ruta, en lugar de incluirlo todo en el bundle inicial. En el HR portal, las rutas de administración y empleados tienen lazy loading porque la mayoría de usuarios son empleados que nunca visitan las páginas de admin — el bundle inicial es más pequeño.

**¿Cómo configuras el lazy loading en Angular 17+?**
Usando `loadComponent` en la definición de la ruta con un import dinámico: `loadComponent: () => import('./path').then(m => m.Component)`. Angular solo descarga ese código cuando el usuario navega a esa ruta por primera vez.

**¿Cómo afecta el lazy loading a la experiencia de usuario?**
La primera visita a una ruta lazy tiene un pequeño retraso mientras se descarga el código. Después queda en caché. Para la mayoría de apps de negocio el retraso es imperceptible, y la carga inicial más rápida vale la pena.

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

---

## Lifecycle hooks

**¿Qué es `ngOnInit` y cuándo lo usas?**
Un lifecycle hook que se ejecuta una vez cuando el componente carga. Lo uso para obtener datos iniciales, leer route params o aplicar filtros de query params — cualquier cosa que deba ocurrir una sola vez al inicio.

**¿Qué es `ngAfterViewInit` y cuándo lo usas?**
Un lifecycle hook que se ejecuta después de que la plantilla esté completamente construida. Es el primer momento seguro para usar referencias de `@ViewChild`. En el task manager conecto `MatSort` a `MatTableDataSource` aquí, porque antes de este punto la directiva sort todavía no existe.

**¿Qué es `@ViewChild` y cómo lo usas?**
Un decorador que obtiene una referencia a un componente hijo o directiva desde la plantilla. Uso `@ViewChild(MatSort)` para acceder a la directiva sort y conectarla a `MatTableDataSource` en `ngAfterViewInit`.

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

---

## Detección de cambios

**¿Qué es la detección de cambios en Angular?**
El proceso que usa Angular para decidir cuándo actualizar el DOM. Después de cada evento del navegador, Angular comprueba si los datos de algún componente cambiaron y re-renderiza las partes afectadas. Por defecto comprueba todos los componentes del árbol, incluso los que no cambiaron.

**¿Cuál es la diferencia entre la detección de cambios Default y OnPush?**
Default comprueba el componente en cada evento del navegador, independientemente de si sus datos cambiaron. OnPush solo comprueba cuando cambia la referencia de un `input()`, cuando se dispara un evento dentro del componente, o cuando cambia un signal que lee. OnPush es más eficiente pero requiere datos inmutables — si mutas un array directamente en lugar de reemplazarlo, la plantilla no se actualizará porque la referencia no cambió.

**¿Cómo funcionan los signals con OnPush?**
Los signals y OnPush están diseñados para funcionar juntos. Cuando un signal dentro de un componente OnPush cambia, Angular marca ese componente para revisión automáticamente — no necesitas llamar a `ChangeDetectorRef` manualmente. Esto significa que obtienes el rendimiento de OnPush sin trabajo extra cuando usas signals para todo el estado.

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

---

## Preguntas sobre proyectos

**Cuéntame el HR portal.**
Es una app de gestión de RRHH con roles de administrador y empleado que simula una herramienta enterprise real — el tipo de aplicación interna que encontrarías en una consultora. El problema principal que resuelve es que no todos deben ver o hacer lo mismo: los administradores gestionan empleados y departamentos, los empleados solo ven sus datos y solicitan bajas. La decisión técnica más interesante fue el sistema de guards — apilar `authGuard` y `adminGuard` en la misma ruta, y luego gestionar `CanDeactivate` sin que bloqueara la navegación tras un guardado exitoso. Ahí es donde `markAsPristine()` fue clave. Si lo mejorara, lo primero sería reemplazar `json-server` con un backend real en Spring Boot con autenticación JWT real.

**¿Cuál es la parte más compleja del HR portal?**
El sistema de guards — apilar `authGuard` y `adminGuard` juntos, asegurarse de que los guards se ejecuten en el orden correcto, y gestionar el guard `CanDeactivate` en los formularios sin que interfiera con la navegación programática tras un guardado. La llamada a `markAsPristine()` después de un guardado exitoso fue la clave para que funcionara correctamente.

**¿Qué cambiarías en el HR portal si tuvieras más tiempo?**
Añadiría tests unitarios a los servicios — la lógica de comprobación de duplicados y las funciones de guard son buenos candidatos iniciales. También conectaría el proyecto a un backend real en Spring Boot en lugar de `json-server`, y añadiría autenticación JWT real en lugar del enfoque simulado con localStorage.

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

**¿Por qué elegiste `json-server` en lugar de un backend real para el HR portal?**
Lo que realmente quieren saber: ¿Entiendes el trade-off, o simplemente seguiste un tutorial?
R: `json-server` fue la elección correcta para un proyecto de aprendizaje frontend — me permitió centrarme en los patrones de Angular sin construir un backend al mismo tiempo. El coste es que la autenticación está simulada con `localStorage` y no sería segura en producción. La próxima versión usa Spring Boot con JWT real.
Respuesta mala: "Porque es fácil." — El entrevistador ya lo sabe. Quiere escuchar que entiendes lo que sacrificaste.

**Construiste seis proyectos Angular en solitario. ¿Cómo cambiaría tu forma de trabajar en un equipo de cinco desarrolladores?**
Lo que realmente quieren saber: ¿Estás listo para la colaboración profesional, o solo sabes trabajar solo?
R: El mayor cambio sería la disciplina con git — revisiones de PR, nunca mergear tu propio código, mantener commits atómicos para que los compañeros puedan seguir el historial. Ya uso Conventional Commits y ramas de features en mis proyectos personales. La parte más difícil es acordar la arquitectura de antemano para que el código base sea consistente — eso es exactamente lo que soluciona Core/Feature/Shared.
Respuesta mala: "Comunicaría más." — Demasiado vago. El entrevistador quiere escuchar prácticas concretas.

**¿Qué es un JWT y cómo funciona en una app Angular + Spring Boot?**
Lo que realmente quieren saber: ¿Entiendes el flujo de autenticación de extremo a extremo, o solo el lado Angular?
R: JWT es un token que el servidor envía tras el login — contiene datos del usuario codificados y una firma. El cliente Angular lo almacena y lo envía en cada petición como Bearer token en la cabecera `Authorization` mediante un interceptor. El backend de Spring Boot valida la firma en cada petición sin necesidad de consultar una sesión en base de datos. En el HR portal lo simulo — el interceptor añade el token, pero `json-server` no lo valida realmente.
Respuesta mala: "Es un token para autenticación." — Todos los juniors dicen esto. El entrevistador quiere el flujo, no la definición.
