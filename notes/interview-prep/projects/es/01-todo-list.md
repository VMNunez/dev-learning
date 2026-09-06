# Preguntas de entrevista — 01-todo-list

**Último banco:** 2026-09-05

Preguntas específicas de las decisiones de implementación tomadas en este proyecto.
Úsalas junto a los archivos por tema en `interview-prep/{LEVEL}/es/`.

## Arquitectura y patrones

**[01-todo-list-012] Tu app tiene tres componentes y un servicio. Explícame quién es dueño de la lista de tareas y quién puede modificarla.** ⭐⭐⭐

El dueño es `TaskService`: guarda la lista de tareas en un `signal<Task[]>` y además es el único sitio de la aplicación que debe modificar ese estado, porque los métodos que hacen esos cambios — `addTask`, `toggleTask` y `deleteTask` — están en el propio servicio, por lo que el estado y los métodos que lo modifican viven en un solo lugar. Decidí hacerlo así porque un servicio con el decorador `@Injectable({ providedIn: 'root' })` tiene una única instancia en toda la aplicación (un singleton), es decir, la lista de tareas no muere cuando muere el componente que la renderiza y cualquier componente que necesite acceder al estado o los métodos para modificarlo puede hacerlo inyectando el servicio.

Elegí este flujo de datos porque así no viven distintos estados entre componentes que puedan llegar a desincronizarse, además, si se detecta un error en un estado, solamente hay un sitio donde mirar porque toda modificación del estado se encuentra en el servicio, y un componente que recibe por un input todo lo que pinta y comunica por un output todo lo que el usuario hace no depende de dónde esté, así que se puede reutilizar en cualquier pantalla. Por ejemplo, `TaskForm` solo llama a `addTask` para añadir tareas, `TaskList` lee el estado y calcula a partir de él la lista de tareas filtradas, y `TaskItem` recibe una tarea de su componente padre, `TaskList`, para mostrarla, y emite el id de la tarea a `TaskList`, que llama a `toggleTask` para marcarla como hecha o a `deleteTask` para borrarla, sin tocar él mismo el estado.

**[01-todo-list-013] ¿Por qué pusiste el estado en un servicio en vez de en `TodoPage`, el componente de página?** ⭐⭐⭐

Decidí que el estado debía sobrevivir al árbol de componentes que lo muestra: un signal en `TodoPage` muere con la página, mientras que el servicio es `providedIn: 'root'` y sobrevive a la navegación. Con tres componentes cualquiera de las dos opciones funcionaría hoy, pero mantenerlo en la página es el hábito que se rompe en cuanto una segunda página necesita la misma lista — tendría que subirlo igualmente.

**[01-todo-list-014] `TaskForm` y `TaskList` inyectan `TaskService` directamente en vez de recibir los datos desde `TodoPage`. ¿No va eso en contra de "data down, events up"?** ⭐⭐

No al nivel al que aplica. Si `TodoPage` pasara la lista hacia abajo, el shell tendría que declarar un input y reemitir tres eventos para datos que no le interesan, y cambiar cada vez que cambia la forma de `Task`. Elegí inyectar en el punto de uso para que `TodoPage` se quede como una preocupación puramente de layout y ambos componentes de feature puedan colocarse en cualquier página futura sin cambios; el contrato data-down/events-up se mantiene donde realmente aporta algo — entre `TaskList` y su hoja repetida.

**[01-todo-list-015] Entonces, ¿por qué `TaskItem` es el único componente que _no_ inyecta el servicio?** ⭐⭐

Porque es la hoja repetida, se renderiza una vez por tarea, así que hay que decirle qué tarea es — `input.required<Task>()`. Hacerlo presentacional significa que se puede razonar sobre él y testearlo solo a partir de sus inputs, sin saber de dónde vinieron los datos, y `TaskList`, que ya es dueño de la lectura, es el lugar natural donde deben caer las escrituras.

**[01-todo-list-016] `TaskItem` emite `output<number>()` — el id — en vez de la `Task` completa o una tarea mutada. ¿Por qué el id?** ⭐⭐

Elegí el id porque es lo único que el padre realmente necesita para localizar la tarea en el array del servicio, y evita que el hijo dé a entender que produjo un nuevo estado. Emitir una `Task` mutada metería lógica de actualización en un componente que deliberadamente dejé sin lógica, y `toggleTask(id)` / `deleteTask(id)` del servicio ya reciben un id.

**[01-todo-list-017] `TaskList` tiene métodos `toggleTask(id)` y `deleteTask(id)` que no hacen nada más que llamar al servicio. ¿Por qué no enlazar el método del servicio directamente desde el template?** ⭐

Existen para que el template se enlace a la API propia del componente en vez de acceder a través de `taskService.` en el markup, lo que mantiene el template legible y me da un único lugar donde añadir lógica — un diálogo de confirmación antes de borrar, por ejemplo — sin tocar ni el hijo ni el servicio. Es delegación fina a propósito, no una capa accidental.

**[01-todo-list-018] Describe tu estructura de carpetas y por qué el servicio y el modelo viven bajo `pages/todo-page/` en vez de en un `core/` global.** ⭐⭐

La estructura es feature-first: `pages/todo-page/` contiene la página, más sus propios `models/`, `services/` y `components/`. Decidí colocarlos juntos porque `Task` y `TaskService` los usa exactamente una feature, así que promocionarlos a un `core/` compartido anunciaría una reutilización que no existe. En cuanto una segunda página consuma la lista, subir el servicio es un cambio de un solo import.

**[01-todo-list-019] Tienes exactamente una ruta, `'' → TodoPage`. ¿Por qué arrancar a través del router en vez de renderizar la página directamente?** ⭐⭐

Elegí arrancar a través del router desde el primer día para que la app ya tenga la forma que necesitan todos los proyectos posteriores: `App` renderiza solo `<router-outlet />` y no guarda ningún estado. Arrancar `TodoPage` directamente funcionaría ahora, pero añadir navegación más tarde significaría reformar el componente raíz y la config en vez de simplemente añadir objetos de ruta.

**[01-todo-list-020] Explícame qué pasa entre `main.ts` y que la primera tarea aparezca en pantalla.** ⭐⭐

`main.ts` llama a `bootstrapApplication(App, appConfig)` — bootstrap standalone, sin `NgModule`. `appConfig` registra `provideRouter(routes)`, el router hace match con `''` y renderiza `TodoPage` dentro del `<router-outlet />` de `App`, `TodoPage` compone `<app-task-form />` y `<app-task-list />`, y `TaskList` inyecta `TaskService` — creado de forma perezosa como singleton de root en esa primera inyección — para que su template pueda leer `filteredTasks()`, que a su vez lee el signal `tasks`.

**[01-todo-list-021] Todos los componentes aquí son standalone con un array `imports`. ¿Qué reemplazó eso, y qué controla realmente ese array?** ⭐⭐⭐

Los componentes standalone reemplazaron las declaraciones de `NgModule`: cada componente declara sus propias dependencias de template en vez de heredarlas de un módulo. En `TaskList` el array contiene `TaskItem` porque el template usa `<app-task-item>`; `TaskForm` y `TaskItem` tienen arrays vacíos porque sus templates solo usan control de flujo y bindings incorporados, que no necesitan import.

**[01-todo-list-022] Tu servicio es `providedIn: 'root'`. ¿Qué cambiaría si lo proveyeras en `TodoPage` en vez de en root?** ⭐⭐

Se convertiría en un provider por instancia: cada `TodoPage` que se creara tendría su propio `TaskService` y su propia lista, destruida con la página. Elegí root porque todo el sentido de sacar el estado del componente era que sobreviviera al componente — y como `TaskForm` y `TaskList` lo inyectan por su cuenta, tienen que resolver a la misma instancia.

**[01-todo-list-023] ¿Por qué `inject()` en vez de inyección por constructor?** ⭐⭐

Elegí la API basada en funciones porque es lo que Angular prefiere ahora y compone mejor — funciona en inicializadores de campo, así que `private taskService = inject(TaskService)` se lee como una sola línea sin necesidad de constructor. Es el mismo injector y la misma resolución de tokens; la diferencia es de ergonomía, no de semántica.

**[01-todo-list-024] ¿Cómo sabe `TaskList` que debe volver a renderizarse cuando `TaskForm` añade una tarea? No hay relación padre-hijo entre ellos.** ⭐⭐⭐

Comparten la instancia del servicio, y `tasks` es un signal. `addTask` llama a `tasks.update(...)`, que produce una nueva referencia de array, así que el signal notifica a sus consumidores — `filteredTasks`, `pendingCount` y `totalCount` son `computed()` sobre él, y el template lee esos. Nada se suscribe y nada hay que desuscribir; la dependencia existe porque el template leyó el signal.

**[01-todo-list-025] ¿Por qué signals aquí en vez de un `BehaviorSubject` de RxJS y el pipe `async`?** ⭐⭐⭐

Decidí usar signals porque el presupuesto de este proyecto pertenecía a los componentes, no al ciclo de vida de streams: sin suscripción que gestionar, sin `takeUntilDestroyed`, sin pipe `async`, y los valores derivados son un `computed()` en vez de una cadena de `map`. `BehaviorSubject` daría la misma semántica de "valor actual más actualizaciones", pero con una limpieza que no podía justificar en un primer proyecto.

**[01-todo-list-026] `pendingCount`, `totalCount` y `filteredTasks` son `computed()` en vez de métodos llamados desde el template. ¿Por qué importa eso?** ⭐⭐⭐

Un método se vuelve a ejecutar en cada pasada de detección de cambios, mientras que un `computed()` cachea su valor y solo recalcula cuando un signal que leyó realmente cambia. Elegí `computed` para los tres porque son derivaciones puras de `tasks()` y `currentFilter()` — declarar la derivación en vez de recalcularla a mano es el sentido del modelo reactivo.

**[01-todo-list-027] El filtro de vista es un `signal<Filter>` dentro de `TaskList`, no en el servicio. ¿Por qué esa separación?** ⭐⭐

Porque es estado de UI, no datos de tareas. Qué pestaña está seleccionada concierne a un componente y debería reiniciarse cuando ese componente desaparece; la lista de tareas no debe hacerlo. Elegí la frontera a propósito: el servicio guarda lo que la app es, el componente guarda cómo se está mirando en este momento.

**[01-todo-list-028] Los métodos de tu servicio nunca usan push ni splice. ¿Qué se rompería si `addTask` hiciera `tasks().push(newTask)`?** ⭐⭐⭐

Los datos cambiarían y la UI no. Un signal notifica a sus lectores cuando recibe una nueva referencia, así que mutar el array existente en el sitio deja al signal con la misma referencia y ningún consumidor se invalida. Por eso `addTask` hace spread hacia un array nuevo, `toggleTask` usa `map` con un objeto de tarea copiado, y `deleteTask` usa `filter` — los tres reemplazan en vez de mutar.

**[01-todo-list-029] En `@for (task of filteredTasks(); track task.id)`, ¿por qué `track task.id` y no el índice?** ⭐⭐

`track` le dice a Angular qué nodo del DOM corresponde a qué elemento. Trackear por id significa que borrar una tarea del medio elimina exactamente ese `app-task-item` y deja el resto intacto; trackear por índice haría que todos los elementos posteriores parezcan cambiados y obligaría a Angular a volver a enlazarlos. El id es estable y único porque el servicio lo genera a partir de un contador privado.

**[01-todo-list-030] ¿Por qué los bloques incorporados `@if` / `@for` / `@empty` en vez de `*ngIf` y `*ngFor`?** ⭐⭐

Son la sintaxis de control de flujo actual y no necesitan imports — `CommonModule` no aparece en ninguno de mis arrays `imports`. `@empty` es la ganancia concreta aquí: el mensaje "No tasks yet" es una rama de primera clase del bucle en vez de un `*ngIf` separado sobre `tasks.length === 0` que tendría que mantener sincronizado con la propia condición del bucle.

**[01-todo-list-031] `Task` es una `interface`, no una `class`. Defiende esa decisión.** ⭐⭐

La tarea es datos, no comportamiento. Una interface se borra en tiempo de compilación, así que no hay coste en runtime ni un sitio donde colgar lógica que pertenece al servicio — las reglas de mutación se quedan en un solo archivo. Una class solo se justificaría si el modelo tuviera métodos o necesitara comprobaciones `instanceof`, y ninguna de las dos aplica.

**[01-todo-list-032] `completed` es un boolean, pero el filtro es un union type. ¿Por qué modelar los dos de forma distinta?** ⭐⭐

Elegí un boolean para `completed` porque la tarea tiene exactamente dos estados y ninguna regla de transición entre ellos, así que `'active' | 'completed'` añadiría un tipo sin añadir ninguna garantía. El union se gana su sitio en `type Filter = 'all' | 'active' | 'completed'`, donde hay tres valores sin equivalente booleano y un string inválido sí sería un bug de verdad — ahí el union lo convierte en un error de compilación.

**[01-todo-list-033] `TaskForm` lee el input a través de una template reference variable pasada a `submit(input)` en vez de `ngModel` o un reactive form. ¿Por qué, y dónde deja de funcionar eso?** ⭐⭐

Para un único campo de texto no controlado elegí la template reference porque no necesita `FormsModule`, ni estado de formulario ni un signal extra — `submit()` recorta el valor, ignora un input de solo espacios, llama a `addTask` y limpia la caja. Deja de funcionar en el momento en que necesito mensajes de validación, un botón de envío deshabilitado o varios campos, que es donde entra un reactive form — el patrón que introduce el proyecto 03.

**[01-todo-list-034] ¿Por qué el `id` se genera con un contador privado `nextId++` en el servicio en vez de con `Date.now()`?** ⭐⭐

Porque `Date.now()` no es único: dos tareas creadas en el mismo milisegundo compartirían valor, y tanto `track task.id` como `toggleTask(id)` dependen de la unicidad. El contador es privado para que ningún componente pueda fabricar un id — generar el id es asunto del servicio, y es exactamente el campo que un backend real dejaría en manos de una secuencia de base de datos.

**[01-todo-list-035] El componente presentacional sigue decidiendo su propia apariencia con `[class.completed]="task().completed"`. ¿Por qué enlazar una clase en vez de alternarla en código?** ⭐⭐

Porque el tachado es una función pura del estado, y el binding declara esa relación una sola vez. Elegí `[class.x]` en vez de añadir y quitar una clase de forma imperativa para que no haya un segundo sitio que pueda desincronizarse de `completed` — el CSS es dueño del aspecto, el signal es dueño de la verdad, y el template es el único punto de unión entre ambos.

**[01-todo-list-036] `TaskList` hace `tasks = this.taskService.tasks`. ¿Qué riesgo tiene esa línea?** ⭐⭐⭐

Vuelve a exponer el `WritableSignal` del servicio bajo un campo público, así que cualquiera que tenga un `TaskList` — incluido su propio template — podría llamar a `tasks.set([])` y saltarse `addTask` / `toggleTask` / `deleteTask` por completo, lo que rompería la regla de "el servicio es el único que escribe" sobre la que descansa toda la arquitectura. Elegí el alias simple por legibilidad en un primer proyecto, pero la frontera correcta es exponer `tasks.asReadonly()` desde el servicio y mantener el handle modificable privado — ese es el primer cambio que haría si revisaran este código.

**[01-todo-list-037] Tu template llama a `currentFilter.set('all')` directamente en el botón, pero toggle y delete pasan por métodos `toggleTask()` / `deleteTask()` en el componente. ¿Por qué esa inconsistencia?** ⭐

Son dos tipos de escritura distintos: el filtro es un signal local propio del componente, así que fijarlo inline evita que un grupo de tres botones necesite tres métodos de una línea, mientras que toggle y delete cruzan hacia el servicio y quería que ese cruce quedara nombrado en la API del componente en vez de accedido desde el markup. Defendería la separación, pero sin mucha convicción — la alternativa consistente es un único método `setFilter(f: Filter)`, y si apareciera un cuarto filtro o cualquier lógica sobre la selección, lo escribiría.

**[01-todo-list-038] ¿Por qué `input.required<Task>()` y `output<number>()` en vez de los decoradores `@Input()` / `@Output() EventEmitter`?** ⭐⭐⭐

Elegí la API basada en signals porque `input()` me da un signal que leo como `task()` — participa en el mismo grafo reactivo que el resto de la app, así que el template y cualquier `computed` futuro lo trackean automáticamente en vez de depender de la detección de cambios. `input.required` también convierte un `[task]` ausente en un error de compilación en vez de un `undefined` en runtime, y `output()` se deshace del import de `EventEmitter` y de su carga de RxJS a cambio de un emisor simple.

**[01-todo-list-039] Tu ruta es `{ path: '', component: TodoPage }`. ¿Cuándo la cambiarías a `loadComponent`?** ⭐

Elegí la forma eager `component` porque hay exactamente una ruta: cargar de forma perezosa la única página añadiría un segundo chunk que de todas formas se pide de inmediato, así que costaría una petición y no compraría nada. `loadComponent` empieza a rentar en cuanto hay rutas que un usuario dado puede no visitar nunca — un área de administración, una página de detalle poco usada — que es por lo que proyectos posteriores del roadmap lo usan y este no.

**[01-todo-list-040] ¿Qué hace `provideBrowserGlobalErrorListeners()` en `appConfig`, y qué representa el array de providers?** ⭐⭐

`appConfig` es el reemplazo standalone del `NgModule` raíz: en vez de `imports`/`providers` en `AppModule`, el injector de la aplicación se configura con un array de funciones provider pasado a `bootstrapApplication`. Mantuve `provideBrowserGlobalErrorListeners()` — engancha los eventos globales `error` y `unhandledrejection` del navegador al `ErrorHandler` de Angular, así que un fallo fuera del propio código de un componente sigue reportándose a través de Angular en vez de llegar solo a la consola.

**[01-todo-list-041] El servicio se entrega con tres tareas hardcodeadas y `nextId = 4`. ¿Qué tiene de malo ese par, y de dónde vendrían los datos de verdad?** ⭐⭐

Están acopladas a mano: el seed termina en el id 3, así que el contador tiene que arrancar en 4, y si editara el seed sin editar el contador, el siguiente `addTask` produciría un id duplicado y rompería `track task.id`. Elegí datos semilla para que la página no esté vacía en la primera carga en un proyecto de demo, pero el arreglo honesto es derivar el contador del propio seed (`max(id) + 1`) — y en cualquier versión real la lista llegaría de una llamada HTTP y los ids de la base de datos, que es exactamente lo que el proyecto 04 pone en su lugar.

**[01-todo-list-042] `filteredTasks` es un `switch` sobre el union del filtro sin rama `default`. ¿Por qué compila eso, y qué te aporta?** ⭐

Porque `Filter` es un union cerrado de tres literales y cada uno tiene un `case` que devuelve, el análisis de exhaustividad de TypeScript no ve ningún camino que caiga sin retorno, así que el tipo de retorno inferido se queda en `Task[]` y no en `Task[] | undefined`. Dejé el `default` fuera a propósito: si más adelante añado un cuarto valor al union del filtro, la rama que falta se convierte en un error de compilación justo aquí en vez de devolver `undefined` en silencio en runtime.

**[01-todo-list-043] Todos los componentes usan `templateUrl` y `styleUrl` en vez de `template` inline. ¿Qué significa eso para el CSS?** ⭐⭐

Elegí archivos separados porque incluso a este tamaño los templates y las hojas de estilo son lo bastante largos como para que ponerlos inline enterraría la clase en literales de string. Lo que importa más que la separación es el CSS: la encapsulación de vistas por defecto de Angular reescribe los estilos de cada componente con un selector de atributo generado, así que `.task-item` en `task-item.css` no puede filtrarse a otro componente — eso es lo que me permitió nombrar las clases sin complicaciones, y por qué el aspecto compartido vive en custom properties de CSS en vez de en una hoja de estilos global de la que dependería cada componente.

**[01-todo-list-001] Tienes dos shells — `App` y `TodoPage` — y ninguno de los dos guarda estado. ¿No es uno de los dos redundante?** ⭐⭐

Están vacíos por razones distintas. `App` es el anfitrión del router: su template es `<router-outlet />` y nada más, así que lo que pusiera ahí — una barra de navegación, un footer — persistiría en cada ruta que la app llegara a tener. `TodoPage` es el shell de _una_ ruta: es dueño del layout `.container` y del `<h1>My To-Do List</h1>`, que pertenecen a esta página y no a la aplicación. Elegí mantener los dos porque colapsarlos movería el título propio de la página al componente raíz, y esa es la línea que tendría que deshacer el día que exista una segunda ruta.

**[01-todo-list-002] Tu array `routes` tiene una única entrada `''` y ningún wildcard. ¿Qué ve un usuario en `/anything-else`?** ⭐⭐

No se renderiza nada: el router no hace match con ninguna ruta, lo reporta como error, y el outlet se queda vacío — una página en blanco en vez de una pantalla de "no encontrado". Decidí que una app de una sola ruta podía vivir sin una ruta `**` mientras solo se abriera desde la raíz, pero es una carencia real en cuanto la app se despliega y alguien escribe o guarda en marcadores una ruta. El arreglo es un objeto — `{ path: '**', redirectTo: '' }`, o un componente `NotFound` dedicado cuando haya algo que decir — y deja de ser opcional en cuanto la app tiene navegación.

**[01-todo-list-003] Tus clases de componente son `TaskList` y `TodoPage`, y los archivos son `task-list.ts`, no `task-list.component.ts`. ¿Adónde fue el sufijo `Component`?** ⭐⭐

Ese es el default actual del Angular CLI y elegí seguir al generador en vez de renombrar todos los archivos de vuelta: el decorador `@Component` ya declara qué es la clase, así que el sufijo repetía información que ya llevan el sistema de tipos y la propia carpeta. La convención se aplica de forma consistente — `task.service.ts` y `task.model.ts` mantienen sus sufijos porque son los nombres que el CLI todavía genera. Un entrevistador que espere `.component.ts` debería leer esto como una señal de versión, no como una elección personal de estilo.

**[01-todo-list-004] Los tres botones de filtro son markup dentro de `task-list.html`, con el signal del filtro en el propio `TaskList`. ¿Cuándo los sacarías a su propio componente?** ⭐⭐

Cuando el grupo se reutilice en otra lista, o cuando seleccionar un filtro crezca con alguna lógica más allá de `currentFilter.set(...)`. Hoy los botones son tres literales hardcodeados enlazados a un signal local en el mismo componente que lo consume, así que extraerlos significaría un `input()` para el valor actual y un `output()` para devolver el nuevo — un viaje de ida y vuelta que no aporta nada a este tamaño. Elegí dejarlos inline y los extraería en el momento en que el conjunto de filtros pase a ser datos en vez de tres valores fijos en el template.

**[01-todo-list-005] `TaskForm` y `TaskList` inyectan los dos la clase concreta `TaskService`. ¿Te habría aportado algo una interface o un `InjectionToken`?** ⭐⭐

En este proyecto no: hay una sola implementación y ninguna segunda fuente de datos que intercambiar, así que una clase abstracta o un token añadirían indirección sin nada al otro lado. Tampoco me cuesta testabilidad — el punto de sustitución ya está a nivel de DI, así que un test puede sobrescribir la clase concreta con `{ provide: TaskService, useValue: fake }` y los componentes nunca se enteran. Decidí que la abstracción se gana su sitio cuando de verdad hay dos implementaciones, un servicio respaldado por HTTP y uno en memoria, que es problema de un proyecto posterior y no de este.

**[01-todo-list-006] Nada en este árbol tiene un estado de carga o de error. ¿Qué cambia estructuralmente cuando la lista llega de una llamada HTTP en vez del array del servicio?** ⭐⭐

El servicio deja de ser la fuente de los datos y pasa a ser su caché: `tasks` puede seguir siendo un signal, pero ahora se rellena de forma asíncrona, así que la vista necesita estados que la app hoy no puede expresar — en curso, y fallido. Elegí mantenerlo todo síncrono porque con el array en memoria no hay ningún momento en el que la lista no exista, que es exactamente la suposición que `@empty` codifica hoy: "todavía no hay tareas" y "todavía no ha cargado" muestran el mismo mensaje. El cambio queda contenido al servicio más una rama en `task-list.html`, y mantener el estado detrás de un servicio en vez de dentro de la página es parte de por qué se queda tan pequeño.

**[01-todo-list-007] `type Filter = 'all' | 'active' | 'completed'` está declarado al principio de `task-list.ts`, mientras que `Task` vive en `models/`. ¿Por qué el trato distinto?** ⭐

Porque tienen audiencias distintas. `Task` es la forma de los datos de la app y la importan el servicio, la lista y el componente hoja, así que se merece su propio archivo. `Filter` describe cómo está mirando un componente esos datos en este momento, no se exporta, y solo lo leen `currentFilter` y `filteredTasks` — mantenerlo tres líneas por encima de ellos hace que todo el concepto de filtro quepa en una sola pantalla. Elegí colocarlo junto hasta que un segundo archivo necesite el tipo, que es la misma regla que mantiene `TaskService` bajo `pages/todo-page/` en vez de en una carpeta compartida.

**[01-todo-list-008] La misma interface `Task` viaja desde el servicio, pasando por `TaskList`, hasta el `input.required<Task>()` de `TaskItem`. ¿Cuándo le darías a la vista su propio modelo?** ⭐

Cuando la forma que necesita la pantalla deja de coincidir con la forma que tienen los datos — una fecha formateada, una etiqueta derivada, un flag que solo existe mientras se renderiza. Aquí `Task` tiene tres campos y la hoja renderiza dos de ellos, así que un modelo de vista separado sería una copia de la misma interface con otro nombre. Decidí que un único tipo a través de las capas es la opción honesta a este tamaño, y sé dónde aparece la separación: el día que esto se respalde con una API, el payload del servidor y el input del componente se convierten en dos cosas distintas y el mapeo pertenece al servicio.

**[01-todo-list-009] Tu objeto de ruta es `{ path: '', component: TodoPage }` — no hay `title`. ¿Qué falta, y quién lo nota?** ⭐

La propiedad `title` del Router es lo que fija el título del documento por ruta a través de la `TitleStrategy`; sin ella, la pestaña muestra lo que `index.html` tenga hardcodeado, que aquí es el `01TodoList` generado por el CLI. Elegí dejar el título estático mientras haya exactamente una ruta, pero el nombre generado no es lo que enviaría a producción, y la pestaña del navegador y la entrada del historial también son lo que oye un usuario de lector de pantalla al cambiar de ventana. `title: 'My To-Do List'` en el objeto de ruta lo arregla, y deja de ser cosmético en cuanto exista una segunda ruta, porque si no el título nunca cambiaría.

**[01-todo-list-010] `main.ts` termina con `.catch((err) => console.error(err))`. ¿Qué ve realmente un usuario si se dispara ese catch?** ⭐

Una página en blanco. `bootstrapApplication` devuelve una promise, así que un fallo al construir el injector raíz o el componente raíz la rechaza, el error va a la consola, y el elemento `<app-root>` de `index.html` simplemente nunca se rellena. Mantuve la línea del CLI porque nada en esta app puede fallar realistamente en el bootstrap — sin HTTP, sin inicializador, sin auth — pero en una app cuyo bootstrap pueda fallar pondría markup estático de respaldo dentro de `<app-root>`, que el navegador renderiza hasta que Angular lo reemplaza, así que el fallo es visible en vez de silencioso.

**[01-todo-list-011] El template de `TodoPage` hardcodea `<app-task-form />` y `<app-task-list />`. ¿Por qué no es un shell de proyección con `<ng-content>`?** ⭐

Porque la página tiene exactamente una composición y quien la llama es el router, no un componente padre que pudiera pasarle hijos — `ng-content` es para un componente cuyo _usuario_ decide el contenido, una card o un modal, y aquí no hay usuario. Elegí hardcodear el par para que `TodoPage` declare la estructura de esta página en un template legible. Si el aspecto del contenedor se reutilizara entre páginas, extraería eso en su lugar: un componente de layout con un slot de proyección, dejando que la página componga sus propias features.

**[01-todo-list-044] Tu PLANNING.md dice que esto "no es MVC clásico — no hay controller". Si el servicio es el modelo y el template es la vista, ¿qué hace aquí de controller?** ⭐⭐

Nada, y decidí que esa era la descripción honesta en vez de forzar la app a encajar en MVC. El signal _es_ el modelo, el template se vuelve a renderizar porque leyó ese signal, y el único trabajo de "controller" que queda son los tres métodos del servicio que lo escriben — no hay ningún objeto sentado entre vista y modelo traduciendo uno al otro. Lo que lo reemplaza es el grafo reactivo: `TaskList` declara `filteredTasks` como un `computed()` de `tasks()` y `currentFilter()` en vez de un controller recalculando un modelo de vista y empujándolo al template.

**[01-todo-list-045] `TaskService` escribe con `tasks.update(...)` mientras que los botones de filtro de `TaskList` escriben con `currentFilter.set(...)`. ¿Cuándo usas cada uno?** ⭐⭐

`set` reemplaza el valor directamente y `update` deriva el siguiente valor a partir del actual, así que la regla que seguí es si el nuevo valor depende del anterior. Un botón de filtro ya conoce toda la respuesta — `'active'` — así que `set` es suficiente; `addTask`, `toggleTask` y `deleteTask` necesitan todos el array existente para hacer spread, map o filter, así que usan `update` y nunca leen `tasks()` por separado antes de escribir. Leer el signal y luego llamar a `set` funcionaría hoy, pero reabre la brecha de leer-y-luego-escribir que `update` cierra en una sola llamada.

**[01-todo-list-046] Ni un solo componente de esta app implementa `ngOnInit` ni ningún otro lifecycle hook. ¿Es eso una carencia?** ⭐⭐

No — elegí una arquitectura que no tiene nada que hacer en esos momentos. No hay datos que pedir al iniciar porque la lista ya está en memoria en un servicio de root, no hay ninguna suscripción que abrir y por tanto ninguna que cerrar en `ngOnDestroy`, y `input.required<Task>()` es un signal que el template lee en vez de un valor al que tenga que reaccionar en `ngOnChanges`. Los hooks vuelven en cuanto el servicio hable con HTTP, e incluso entonces la respuesta moderna es un `resource()` o un `effect()` en vez de `ngOnInit` — por eso no añadí uno vacío por costumbre.

**[01-todo-list-047] `TaskForm.submit()` termina con `input.value = ''` — la clase del componente escribiendo directamente en un nodo del DOM. ¿No es eso justo lo que Angular existe para evitar?** ⭐⭐

Lo es, y es el precio del input no controlado que elegí para este formulario. Nada en Angular es dueño de ese valor — no hay `ngModel` ni `FormControl` — así que limpiar la caja significa limpiar el elemento, y la template reference variable me da acceso al `HTMLInputElement` real para hacerlo. Decidí que era seguro aquí porque la escritura es una sola propiedad en un elemento que creó el mismo template, pero no sobrevive a server-side rendering ni a un segundo campo, y en cualquiera de esos dos casos un reactive form llevaría el valor a un estado que puedo resetear en su lugar.

**[01-todo-list-048] `TaskItem` declara dos outputs separados, `taskToggled` y `taskDeleted`. ¿Por qué no un solo evento que lleve una acción, o un `model()` bidireccional?** ⭐

Elegí dos outputs porque son dos intenciones, y nombrarlas por separado hace que el template de `TaskList` diga cuál está manejando en vez de hacer switch sobre un payload — un único output `(action)` empujaría una sentencia `case` al padre sin ganar nada con solo dos casos. Un `model<Task>()` sería la alternativa específica para el toggle, pero significaría que la hoja escribe una nueva `Task` de vuelta, que es exactamente la escritura que mantuve fuera de ella: el servicio es el único que escribe, así que el hijo emite un id y deja que el dueño decida.

**[01-todo-list-049] `TaskList` escribe `private taskService: TaskService = inject(TaskService)` mientras que `TaskForm` escribe `private taskService = inject(TaskService)`. ¿Cuál es correcto?** ⭐

El de `TaskForm` — la anotación en `TaskList` es redundante, porque `inject(TaskService)` ya devuelve `TaskService` y TypeScript lo infiere. Escribí los dos componentes en días distintos y la deriva sobrevivió porque nada en el build objeta una anotación correcta pero redundante. No cambia nada en runtime ni en cómo el injector resuelve el token; usaría la forma corta en todas partes.

**[01-todo-list-050] `TodoPage` declara `selector: 'app-todo-page'`, pero nada en la app escribe nunca `<app-todo-page>`. ¿Por qué tiene selector un componente enrutado?** ⭐

Porque el CLI genera uno y a un componente se le permite ser alcanzable de las dos formas — el router instancia `TodoPage` dentro de `<router-outlet />` a partir de la referencia de clase en el objeto de ruta, nunca a través del selector. Lo mantuve porque no cuesta nada y deja la página embebible si alguna ruta futura llega a componerla, pero la lectura honesta es que es metadata muerta en un componente enrutado. `App` es el caso espejo: su selector `app-root` es el que realmente se usa, por el elemento `<app-root>` hardcodeado en `index.html`.

**[01-todo-list-051] `TaskService`, `TaskList` y `TaskItem` escriben todos `import type { Task }` en vez de un `import` plano. ¿Qué cambia la palabra clave `type`?** ⭐

Marca el import como eliminable: el compilador sabe que `Task` es solo un tipo, así que la sentencia desaparece del JavaScript emitido en vez de dejar una referencia de módulo a un archivo que no exporta nada en runtime. Lo elegí porque `Task` es una `interface` y por construcción no hay nada que importar en runtime — la misma razón por la que existe la interface en vez de una class. `TaskService` y `TaskItem` siguen usando imports planos para `@angular/core` y para el propio `TaskItem`, porque esos sí son valores reales que necesitan la metadata del decorador y el array `imports`.

## Reglas de negocio

**[01-todo-list-061] ¿Dónde vive realmente la regla de "una tarea debe tener un título no vacío", y es ese el sitio correcto?** ⭐⭐⭐

Vive en `TaskForm.submit()`: recorta el valor del input y se detiene ahí si el resultado está vacío, así que el servicio nunca llega a llamarse. Elegí validar en el punto de entrada porque hoy es la única llamada del único que escribe, pero la debilidad honesta es que el propio `addTask(title: string)` acepta cualquier cosa — un segundo formulario, o una futura llamada sembrada por HTTP, podría meter una tarea vacía. Si esto creciera, la guarda se movería al servicio para que la regla se mantenga sin importar quién llame.

**[01-todo-list-062] Tu validación es `input.value.trim()`. ¿Qué inputs deja pasar que quizá no quieras?** ⭐⭐

Solo rechaza títulos de puros espacios. `"   comprar   leche   "` se convierte en `"comprar   leche"` — los espacios internos sobreviven — y no hay longitud máxima, ni restricción de caracteres, ni comprobación de duplicados. Decidí que esas no son reglas que tenga esta app: es una lista personal donde el usuario escribió el string a propósito, así que normalizar más sería inventar una restricción que el producto no necesita.

**[01-todo-list-063] ¿Pueden dos tareas tener el mismo título? ¿Fue una decisión o un descuido?** ⭐

Fue una decisión: `addTask` no hace ninguna búsqueda antes de añadir, así que se permiten duplicados. La identidad aquí es el id, no el título — un usuario puede tener de verdad "llamar al banco" dos veces el mismo día, y toda operación (`toggleTask`, `deleteTask`, `track task.id`) se basa en el id, así que los duplicados nunca confunden a la app. Una regla de unicidad solo tendría sentido si el título significara algo para el sistema.

**[01-todo-list-064] `toggleTask` invierte `!task.completed` en vez de recibir el valor objetivo. ¿Cuál es el tradeoff?** ⭐⭐

Invertir significa que quien llama no necesita saber el estado actual — `TaskItem` solo emite un id — pero también hace que la operación no sea idempotente: llamarla dos veces vuelve al estado original, así que un doble clic o una petición reintentada se deshace a sí misma. Elegí invertir porque aquí no hay red y el clic _es_ la intención de invertir. Con un backend enviaría el valor deseado, porque un reintento por cable no debe invertir dos veces.

**[01-todo-list-065] ¿Qué pasa si se llama a `toggleTask(99)` o `deleteTask(99)` con un id que no existe?** ⭐⭐

Nada — en silencio. `map` no encuentra coincidencia y devuelve una lista equivalente, `filter` no elimina nada. Elegí eso porque en esta app el id solo puede venir de una tarea que el template acaba de renderizar, así que un fallo es imposible por construcción. En un servicio que hable con un backend ese mismo silencio sería un bug: un 404 tiene que distinguirse de un borrado exitoso, por lo que la versión de este método contra la API devuelve un resultado en vez de `void`.

**[01-todo-list-066] Delete elimina la tarea al instante — sin confirmación, sin deshacer, sin soft delete. Defiende esa decisión.** ⭐⭐

El coste del error es una línea de texto que el usuario puede volver a escribir en dos segundos, así que decidí que un diálogo de confirmación sería fricción cobrada en cada borrado para protegerse de un error barato. El soft delete se gana su sitio cuando el registro tiene historial, auditoría o referencias apuntándole — un ítem de to-do en memoria no tiene ninguna. `TaskList.deleteTask()` es el punto donde añadiría una confirmación si la regla cambiara, que es exactamente por qué existe ese método fino.

**[01-todo-list-067] El contador dice "3 pendientes de 5 en total" mientras el filtro Active está activo. ¿No debería contar solo lo que se muestra?** ⭐⭐⭐

No, y es deliberado. `pendingCount` y `totalCount` son `computed()` sobre `tasks()`, no sobre `filteredTasks()`, porque responden a "cuánto trabajo me queda", que no debe cambiar solo porque estreché la vista. El filtro es una lente sobre los datos; el contador es un hecho sobre los datos. Derivarlos de fuentes distintas es la consecuencia visible de esa separación.

**[01-todo-list-068] El contador está envuelto en `@if (totalCount() > 0)` mientras que el mensaje de vacío viene de `@empty` en el bucle. Son dos comprobaciones de vacío distintas — ¿por qué?** ⭐⭐

Porque preguntan sobre listas distintas: el contador no tiene sentido cuando no hay datos en absoluto, así que comprueba `totalCount()`, la lista real; el mensaje de vacío es una rama del bucle, así que se dispara sobre `filteredTasks()`, la lista renderizada. Elegí esa separación a propósito, y la consecuencia visible es que un filtro que no coincide con nada muestra "3 pendientes de 3 en total" encima de "No hay tareas que coincidan con este filtro" — el contador sigue siendo un hecho verdadero sobre los datos mientras el bucle reporta la vista. El bloque de vacío entonces reutiliza `totalCount()` en su propio `@if`, que es cómo nombra cuál de los dos vacíos está mirando.

**[01-todo-list-069] Selecciona el filtro Active con dos tareas completadas y la pantalla dice "No hay tareas que coincidan con este filtro", no "Todavía no hay tareas". ¿Cómo distingue el template las dos?** ⭐⭐⭐

`@empty` solo sabe que `filteredTasks()` volvió vacío, y bajo un filtro eso significa "nada coincide", no "nada existe" — así que anidé una segunda comprobación dentro: `@if (totalCount() === 0)` imprime "Todavía no hay tareas" y `@else` imprime "No hay tareas que coincidan con este filtro". Decidí que el estado de vacío tenía que leer el signal sin filtrar porque son dos preguntas distintas sobre los mismos datos, y la primera versión de este template respondía a la equivocada, diciéndole a un usuario con dos tareas que no tenía ninguna. Es la misma separación que hace el contador — `@empty` habla de la lista renderizada, `totalCount()` habla de la lista en sí.

**[01-todo-list-070] Marcar una tarea como completada la mantiene en la lista. ¿Por qué "completada" no es simplemente "borrada"?** ⭐⭐

Porque significan cosas distintas y la app soporta ambas: completar registra que el trabajo está hecho, borrar dice que nunca debió estar ahí. Mantener las tareas completadas es lo que hace que el filtro Completed y el contador de "pendientes de total" tengan sentido — si completar quitara la fila, ambos serían conceptos vacíos. `toggleTask` es por tanto reversible y `deleteTask` no lo es, que es toda la diferencia entre ambos.

**[01-todo-list-071] Las tareas nuevas siempre caen al final de la lista, sin orden y sin fecha de creación. ¿Qué regla es esa?** ⭐

El orden de inserción es la regla de ordenación: `addTask` hace spread del array existente y añade al final, así que la lista se lee de más antigua a más nueva y nunca se reordena bajo el usuario. Elegí eso porque no hay nada por lo que ordenar — el modelo no tiene `createdAt` ni prioridad, y el id es solo un contador monótono, no un valor de dominio. Cualquier ordenación real (fecha límite, prioridad) necesitaría antes un campo en `Task`.

**[01-todo-list-072] `addTask` hardcodea `completed: false`. ¿Podría llegar a crearse una tarea ya completada?** ⭐

No, y esa es la regla buscada: crear siempre significa "trabajo nuevo por hacer", así que el flag lo fija el servicio en vez de aceptarlo como argumento. También mantiene el contrato del formulario en un único `string` — el componente no puede expresar un estado que el dominio no permite. Cualquier cosa que necesite existir ya completada pasa por `addTask` y luego `toggleTask`, que es un único camino de código en vez de dos.

**[01-todo-list-073] Si borro la tarea 3 y luego añado una tarea, ¿la nueva recibe el id 3?** ⭐⭐

No — `nextId` solo incrementa, así que los ids nunca se reutilizan. Eso importa porque `track task.id` asocia nodos del DOM con ids: reciclar un id dejaría que Angular asociara una tarea completamente nueva con el nodo de la borrada. Refleja cómo se comporta una secuencia de base de datos, y por eso `nextId` es un campo privado del servicio en vez de derivarse de `tasks().length`, que _sí_ colisionaría después de un borrado.

**[01-todo-list-074] El título de una tarea nunca se puede cambiar una vez creada. ¿Renombrar se dejó fuera o se descartó?** ⭐⭐

Se descartó para este proyecto: `Task` solo la escriben los tres métodos del servicio, y ninguno toca `title` — `toggleTask` copia la tarea y reemplaza solo `completed`. Decidí que la superficie de actualización debía ser lo mínimo que hiciera usable la app, y corregir una errata es "borrar y reescribir" a este tamaño. Añadir renombrar significaría un `updateTask(id, title)` en el servicio más un modo de edición en `TaskItem`, que es estado que la hoja presentacional deliberadamente no tiene.

**[01-todo-list-075] Las apps de to-do clásicas tienen "marcar todas como completadas" y "limpiar completadas". La tuya no tiene ninguna. ¿Por qué?** ⭐

Porque toda operación en `TaskService` es de una sola tarea por diseño: `toggleTask` y `deleteTask` reciben ambos un id, y no hay ningún punto de entrada masivo. Elegí eso porque las acciones masivas son destructivas a escala — "limpiar completadas" elimina varias filas de golpe sin deshacer, que es un riesgo muy distinto al de borrar una línea — y ninguna de las dos hace falta para demostrar el patrón del que trata este proyecto. Ambas serían añadidos pequeños sobre el mismo signal (`update` con un `map` o un `filter`), que es la cuestión: el modelo de escritura ya las soporta, el producto no las pide.

**[01-todo-list-076] Enviar la caja vacía no hace absolutamente nada — sin mensaje, y los espacios que escribiste se quedan ahí. ¿Es ese el comportamiento que querías?** ⭐⭐

Solo la mitad. `submit()` se detiene antes de llegar a `addTask`, y como ese retorno anticipado ocurre antes de `input.value = ''`, tres espacios se quedan en la caja pareciendo un input sin enviar. Elegí el silencio antes que un mensaje de error — negarse a crear una tarea vacía es evidente por sí mismo, y un mensaje de validación para un campo que el usuario en realidad no ha rellenado es ruido — pero no limpiar el campo es un descuido y no una regla; el arreglo honesto es limpiar el input también en el camino de rechazo.

**[01-todo-list-077] Si el filtro Completed está seleccionado y añado una tarea, ¿adónde va?** ⭐⭐

A la lista, y fuera de la pantalla: `addTask` añade a `tasks`, `filteredTasks` recalcula y la nueva tarea no pasa el predicado `completed`, así que el usuario no ve que pase nada. La regla es que añadir es independiente de la vista — el filtro es una lente, no un modo — pero la interacción es genuinamente confusa. El arreglo es resetear el filtro a `'all'` tras un añadido exitoso, y `TaskForm` no puede hacerlo hoy: `currentFilter` es un signal privado dentro de `TaskList`, así que el filtro primero tendría que subir al servicio o a la página, donde ambos componentes puedan alcanzarlo.

**[01-todo-list-078] Un usuario escribe `<script>alert(1)</script>` como título. ¿Qué hace tu app con eso?** ⭐⭐

Lo renderiza como texto literal, porque `TaskItem` imprime el título a través de `{{ task().title }}` y Angular escapa por defecto los valores interpolados — el markup nunca se convierte en DOM. Decidí que eso significaba que no hacía falta ninguna capa de saneamiento propia en `addTask`: la única forma de reintroducir el agujero sería enlazar el título a través de `[innerHTML]`, que nada aquí hace. Por eso tampoco el título necesita ninguna restricción de caracteres más allá de la comprobación de no vacío.

**[01-todo-list-052] `task-form.html` es un `<div>` que contiene un input y un botón — no hay ningún elemento `<form>`. ¿Qué perdiste?** ⭐⭐

Los dos puntos de entrada están conectados a mano: `(keyup.enter)="submit(taskInput)"` en el input y `(click)="submit(taskInput)"` en el botón. Elegí eso porque el componente lee el valor directamente del nodo del DOM y tiene una única regla que hacer cumplir, así que un `<form>` solo habría añadido `ngSubmit` y el módulo de forms sin añadir ninguna restricción. Lo que pierde es el envío implícito nativo y la propia superficie de validación del navegador — `required`, `maxlength`, `:invalid` — que es exactamente lo que querría en el momento en que este formulario crezca a un segundo campo.

**[01-todo-list-053] El botón "Add task" está habilitado incluso con la caja vacía. ¿Por qué no deshabilitarlo hasta que haya un título?** ⭐⭐

Decidí validar en el envío en vez de bloquear el control: `submit()` recorta y se detiene ahí, así que un clic vacío es un no-op, y la misma guarda cubre la tecla Enter — que un botón deshabilitado no habría cubierto de todas formas. Deshabilitarlo también necesitaría un estado que este componente no guarda: el valor se lee del DOM en el momento del envío, no se guarda en un signal, así que no hay nada a lo que enlazar `[disabled]` sin introducir un signal de valor o un form control. El coste real es que el clic rechazado no da ningún feedback, que es la misma carencia que el campo no limpiarse en el camino de rechazo.

**[01-todo-list-054] La única etiqueta del input es `placeholder="New task..."`. ¿Qué cuesta eso?** ⭐

El placeholder desaparece en cuanto el usuario escribe, así que no hay ninguna etiqueta persistente, y la tecnología de asistencia solo nombra el campo porque un placeholder es el último recurso para un nombre accesible — no porque yo lo haya etiquetado. Lo elegí por la compacidad de un formulario de un solo campo, pero la versión correcta es un `<label for>` real, oculto visualmente si el diseño lo necesita, o como mínimo un `aria-label`. Es el arreglo más barato del proyecto y no volvería a enviar el formulario a producción sin él.

**[01-todo-list-055] Completar se alterna haciendo clic en el texto del título — un `<span>` con `(click)="taskToggled.emit(task().id)"`. ¿Por qué no un checkbox?** ⭐⭐

Elegí el título porque es el objetivo más grande de la fila y el tachado cae sobre el mismo elemento en el que hizo clic el usuario, así que la acción y su feedback están en un solo sitio. Un checkbox habría sido la mejor decisión: es un control nativo, es alcanzable por teclado, y anuncia su estado marcado, mientras que un `<span>` con un manejador de clic es invisible para ambas cosas. Nada del contrato cambiaría — `TaskItem` seguiría emitiendo el id y `TaskList` seguiría siendo dueño de la escritura — así que es una decisión de markup que me equivoqué, no una arquitectónica.

**[01-todo-list-056] Con el filtro Active seleccionado, hacer clic en una tarea la completa y la fila desaparece. ¿Es eso lo que querías?** ⭐⭐

Se deriva directamente de que `filteredTasks` recalcula: la tarea deja de satisfacer el predicado `active`, así que `@for` elimina su fila en el mismo tick. Decidí que esa es la regla correcta — el filtro es una lente viva sobre `tasks()`, no una foto tomada cuando se pulsó el botón, y una fila que ya no coincide no debería quedarse en pantalla. Es brusco, no incorrecto, y la mitigación es presentacional (una animación de salida) en vez de un cambio en cómo el filtro lee el signal.

**[01-todo-list-057] `currentFilter` es un signal del componente, así que recargar deja al usuario de vuelta en All y la vista no se puede compartir como enlace. ¿Qué regla es esa?** ⭐⭐

La regla es que el filtro es estado de vista efímero: pertenece al componente que renderiza los botones y muere con él, que es la misma razón por la que lo dejé fuera de `TaskService`. Elegí eso de forma consistente con el resto de la app — la propia lista tampoco sobrevive a una recarga, así que persistir una lente sobre datos que desaparecen sería la decisión rara. En cuanto las tareas vengan de un backend, el filtro pertenece a la URL como query parameter, así que el router lo restaura y el usuario puede guardar en marcadores la vista filtrada.

**[01-todo-list-058] Sin tareas completadas, el botón Completed sigue siendo clicable y lleva a una pantalla vacía. ¿Debería la pantalla impedir eso?** ⭐

No — decidí que un resultado de filtro vacío es información y no un estado de error: "No hay tareas que coincidan con este filtro" responde a la pregunta del usuario, mientras que un botón deshabilitado esconde esa respuesta detrás de un control que no puede pulsar. Los filtros deshabilitados también parpadearían a medida que cambian los datos, ya que completar una tarea habilitaría un botón bajo el cursor a mitad de sesión. Así que la regla que mantuve es que los tres filtros siempre están disponibles y la rama `@else` de `@empty` explica el resultado.

**[01-todo-list-059] El filtro seleccionado se comunica solo con `[class.active]` en el botón. ¿Qué falta?** ⭐

Visualmente es correcto: la clase está enlazada a `currentFilter() === 'all'` y sus equivalentes, así que el resaltado no puede desincronizarse del estado que gobierna la lista. Lo que falta es la mitad semántica — nada le dice a la tecnología de asistencia cuál de los tres está seleccionado, y el arreglo es enlazar la misma expresión a `[attr.aria-pressed]`, o promover la fila a un `role="tablist"`. Enlacé la clase para el estilo y no llevé el estado hasta el atributo de accesibilidad, que es una carencia y no una decisión.

**[01-todo-list-060] Tu contador dice "pending" y tu botón de filtro dice "Active" para el mismo conjunto de tareas. ¿Importa eso?** ⭐

Son un único predicado — `!task.completed` — escrito dos veces bajo dos nombres: `pendingCount` en `TaskList` y `'active'` en el union `Filter`. Decidí que era inofensivo a este tamaño, pero es deriva real del lenguaje de dominio: cualquiera que lea el código tiene que comprobar si "pending" y "active" significan el mismo conjunto, y esa ambigüedad es justo donde aparecen dos definiciones sutilmente distintas en una app más grande. El arreglo cuesta una palabra — elegir el nombre una vez y usarlo en el tipo, el computed y la etiqueta del botón.

**[01-todo-list-079] `TaskService` arranca con tres tareas ya en el signal, así que nadie abre esta app con una lista vacía. ¿Cuál de tus reglas esconde eso?** ⭐⭐

Esconde la rama de "Todavía no hay tareas": llegar a ella cuesta tres borrados, así que el estado que debería ver un usuario primerizo es el más difícil de alcanzar. Elegí el seed para que la página tenga algo que mostrar en una demo y para que los filtros y el contador sean ejercitables desde el primer clic, pero el coste honesto es que la app se abre con las tareas de otra persona y el diseño de vacío real nunca está en el happy path. En cuanto la lista llegue de una llamada HTTP, el seed desaparece y el vacío pasa a ser el primer render por defecto, que es cuando esa rama empieza a ganarse su sitio.

**[01-todo-list-080] Nada impide que un usuario añada mil tareas — sin tope, sin paginación, sin virtual scrolling. ¿Es una regla que decidiste o una que nunca enfrentaste?** ⭐

Una que nunca enfrenté, y aun así no añadiría un tope: un límite en una lista de to-do personal es una regla que el producto no tiene, así que rechazar la tarea número mil sería inventar una. Lo que sí enfrentaría es el renderizado — `@for` construye un nodo del DOM por tarea, así que a ese tamaño la respuesta es virtual scrolling o paginar la vista, no una regla de negocio que prohíba los datos. `track task.id` es lo que lo mantiene sobrevivible mientras tanto, ya que alternar una tarea vuelve a renderizar su fila en vez de la lista entera.

## Decisiones técnicas

**[01-todo-list-091] Tu `tsconfig.json` tiene `strict: true` más `strictTemplates`. ¿Qué añade la mitad de Angular que no añade la mitad de TypeScript?** ⭐⭐

`strict` tipa los archivos `.ts`, pero los templates se compilan por separado — sin `strictTemplates` una expresión como `[task]="task"` se comprueba solo de forma laxa y un desajuste de tipos en el markup llega al navegador. Mantuve los defaults del CLI a propósito porque los contratos de este proyecto viven en los templates: `input.required<Task>()` y los tipos de `$event` en `(taskToggled)` solo se hacen cumplir de punta a punta porque el compilador de templates también es strict.

**[01-todo-list-092] `noImplicitReturns` y `noFallthroughCasesInSwitch` están activados. ¿Qué decisión de este código cambió realmente eso?** ⭐

Son lo que convierte el `switch` de `filteredTasks` en una construcción comprobada en vez de una convención: toda rama tiene que devolver algo, y ningún case puede caer al siguiente. Elegí dejar los flags del compilador en sus defaults estrictos en vez de relajarlos cuando el switch se quejó, porque la alternativa — una rama `default` que devolviera `tasks()` — habría tragado en silencio un futuro cuarto valor de filtro en vez de hacer fallar el build.

**[01-todo-list-093] Tu workspace tiene tres archivos tsconfig. Explícame la separación.** ⭐

`tsconfig.json` guarda las opciones de compilador compartidas y referencia a los otros dos; `tsconfig.app.json` compila `src/**/*.ts` menos los specs, y `tsconfig.spec.json` compila solo los specs y añade `types: ["vitest/globals"]`. Mantuve la separación porque fusionarlos filtraría globales solo-de-test como `describe` al código de la aplicación, donde tiparían bien y luego fallarían en runtime. También fijé `rootDir: "./src"` explícitamente en la config de specs para que los dos árboles de salida se mantengan paralelos en vez de depender de la inferencia según qué archivos se incluyan.

**[01-todo-list-094] `package.json` declara `vitest` y `jsdom`, `angular.json` tiene un target `test`, y tus cinco archivos `.spec.ts` no aseveran casi nada. ¿No es eso configuración muerta?** ⭐⭐

El harness es real y está en verde — `npm test` corre cinco specs — pero son scaffold del CLI: cada uno instancia su sujeto y asevera que existe (`truthy`), sin cubrir ningún comportamiento. Elegí mantenerlos y repararlos en vez de borrarlos: `task-item.spec.ts` estaba fallando porque `input.required<Task>()` no tiene default, así que se lo pasé a través de `fixture.componentRef.setInput('task', task)`, y borré el único spec de scaffold que aseveraba un `<h1>` que el template ya no renderiza. El testing de comportamiento real es un paso del proyecto 07 en mi roadmap, y prefiero entregar una suite smoke que compila y decir claramente qué no cubre, en vez de borrar el cableado y volver a añadirlo después.

**[01-todo-list-095] Más allá de `strict`, tu `tsconfig.json` activa `isolatedModules`, `noPropertyAccessFromIndexSignature`, `importHelpers` y `skipLibCheck`. ¿Cuál de esos notas de verdad?** ⭐

`isolatedModules` es el que da forma al código: obliga a marcar todo import de solo tipo, que es por qué el servicio importa el modelo como `import type { Task }` — el archivo tiene que poder compilarse por sí solo con esbuild, que nunca ve el programa completo. `importHelpers` es por qué `tslib` es una dependencia de runtime: los helpers de downlevelling se importan de un único paquete compartido en vez de reemitirse en cada archivo. `skipLibCheck` y `noPropertyAccessFromIndexSignature` son defaults de velocidad de build y seguridad que dejé tal cual porque nada en esta app tiene un index signature con el que tropezar.

**[01-todo-list-096] Tu `angular.json` tiene `root: ""`, un solo proyecto, y `newProjectRoot: "projects"`. ¿Qué forma de workspace es esa, y por qué importa el `prefix`?** ⭐

Es un workspace de aplicación única: la app se sitúa en la raíz del workspace en vez de bajo `projects/`, que es lo que produce `ng new` cuando no estás construyendo un monorepo de librerías. `prefix: "app"` es lo que hace que los schematics generen `selector: 'app-task-item'`, y la razón de que exista un prefijo es la colisión: un `<task-item>` sin prefijo puede chocar con un elemento personalizado o un componente de librería, y el prefijo es la convención que mantiene mis componentes identificables en el DOM.

**[01-todo-list-097] Tu build de producción fija presupuestos de 500 kB de warning / 1 MB de error sobre el bundle inicial. ¿Sabes qué envía realmente esta app, y qué movería esa aguja?** ⭐⭐

Esta app está muy por debajo — una app standalone de Angular 21 sin librería de UI, sin cliente HTTP y sin librería de estado es esencialmente el framework más unos pocos kilobytes de código propio. Mantuve los presupuestos por defecto porque su valor está en la alarma, no en el número: lo que movería la aguja es una dependencia, así que el presupuesto es lo que me avisa el día que añada Material o una librería de gráficos de que he duplicado la descarga para una sola pantalla.

**[01-todo-list-098] También hay un presupuesto `anyComponentStyle` de 4 kB. ¿Por qué existe siquiera un presupuesto de estilo por componente?** ⭐

Porque los estilos de componente se emiten por componente en vez de compartirse, así que una hoja de estilos grande duplicada entre componentes infla el build de una forma que un presupuesto de bundle inicial por sí solo no le atribuiría a nada. Mi hoja de estilos de componente más grande está muy por debajo de un kilobyte, que es la forma buscada: el tema vive en custom properties globales y cada componente envía solo su propio layout.

**[01-todo-list-099] Tu `defaultConfiguration` es `production` para build y `development` para serve. ¿Qué es distinto en la configuración de development?** ⭐⭐

Development desactiva `optimization`, desactiva `extractLicenses` y activa `sourceMap`, así que `ng serve` reconstruye rápido y el debugger muestra mi TypeScript en vez de output minificado. Production en cambio añade `outputHashing: "all"`, que huelle digitalmente cada archivo emitido para que un despliegue pueda cachearse de forma agresiva y aun así nunca sirva un bundle obsoleto. Elegí dejar ambos defaults porque codifican exactamente el tradeoff que quiere cada modo: velocidad de build mientras trabajo, seguridad de caché cuando entrego.

**[01-todo-list-100] El builder es `@angular/build:application`. ¿Qué reemplazó eso, y qué significa la parte de "application"?** ⭐⭐

Es el builder basado en esbuild/Vite que reemplazó al antiguo builder `browser` de webpack, de donde viene el dev server rápido y los tiempos de reconstrucción. `application` en vez de `browser` significa que el builder también es capaz de emitir un bundle de servidor — SSR, prerenderizado — y yo declaré solo el punto de entrada `browser`, así que esto se queda como una SPA puramente renderizada en cliente. Esa fue la decisión correcta para una lista de to-do estática sin superficie SEO y sin datos que pedir en el servidor.

**[01-todo-list-101] Tu `package.json` no tiene dependencia de `zone.js`. ¿Qué le dice eso a un entrevistador sobre cómo funciona aquí la detección de cambios?** ⭐⭐⭐

Que la app corre zoneless: Angular 21 ya no incluye zone.js por defecto, así que nada hace monkey-patch de `setTimeout` ni `addEventListener` para disparar una comprobación global. La detección de cambios la conducen los propios signals — `tasks`, `currentFilter` y los tres valores `computed()` marcan como sucias exactamente las vistas que los leen. También es por eso que guardar la lista en un signal no fue una elección de estilo aquí: sin zona, un array mutado simplemente nunca se volvería a pintar.

**[01-todo-list-102] `rxjs` y `@angular/forms` están en tus dependencias, pero ninguna aparece en tu código de aplicación. Defiende eso.** ⭐

`rxjs` es un peer requirement de los paquetes del framework, así que se queda tanto si importo de él como si no. `@angular/forms` está genuinamente sin usar — leo el input a través de una template reference variable en vez de `ngModel`, así que nada importa `FormsModule` — y es un resto de `ng new`. No cuesta nada en el bundle porque el tree-shaking sigue los imports y no el `package.json`, pero lo quitaría en un repositorio real para que la lista de dependencias no exagere lo que usa la app.

**[01-todo-list-103] Angular está fijado con `^21.2.0` y TypeScript con `~5.9.2`. ¿Por qué operadores de rango distintos?** ⭐

`^` acepta actualizaciones menores y de parche, `~` solo de parche. El compilador de Angular soporta un rango específico de TypeScript, así que una subida menor de TypeScript puede romper el build — el CLI lo fija con `~` exactamente por esa razón y lo dejé así. Es el mismo razonamiento detrás de `packageManager: "npm@10.8.2"`: la cadena de herramientas es un input del build, y un build que solo funciona en mi portátil no es un build.

**[01-todo-list-104] Tu `styles.css` global guarda toda la paleta como custom properties en `:root`, mientras que cada componente tiene su propia hoja de estilos. ¿Por qué poner el tema en el único sitio al que la encapsulación no llega?** ⭐⭐

Porque las custom properties se heredan a través del DOM, cruzan la frontera de encapsulación emulada que los selectores ordinarios no pueden cruzar, así que `var(--accent)` se resuelve dentro de cada componente sin que ninguno importe nada. Elegí esa separación a propósito: el tema es lo único que debe compartirse, así que es global y con nombre; el layout es lo único que no debe filtrarse, así que se queda en el archivo del componente donde el selector de atributo generado lo delimita.

**[01-todo-list-105] Elegiste CSS plano con custom properties en vez de Sass, Tailwind o Angular Material. ¿Qué perdiste?** ⭐⭐⭐

Perdí el nesting, los mixins y una librería de componentes que de otra forma habría tenido gratis. El tradeoff fue deliberado para un primer proyecto: la idea era aprender flexbox y el box model a mano, y un framework habría escondido ambas cosas detrás de nombres de clase que no podría explicar en una entrevista. Las custom properties también cubren lo único para lo que normalmente se quieren las variables de Sass — una paleta tematizable — y a diferencia de las variables de Sass, están vivas en runtime, así que un cambio de tema sería un cambio de atributo en vez de una reconstrucción.

**[01-todo-list-106] Tu hoja de estilos global empieza con `* { margin: 0; padding: 0; box-sizing: border-box; }`. ¿Es buena idea un reset con el selector universal?** ⭐

Es un instrumento contundente y solo lo defendería a este tamaño. `box-sizing: border-box` en todo es la parte que realmente se gana su sitio — hace predecible el padding de las filas de tarea y del input. Poner a cero todos los márgenes significa que tengo que volver a añadir el espaciado a mano en vez de tener defaults razonables para encabezados y párrafos, que es por lo que la alternativa moderna es un reset delimitado que fija `box-sizing` de forma heredable y deja la tipografía en paz.

**[01-todo-list-107] Tu regla de `body` fija `min-height: 100vh` y una pila de fuentes de sistema `'Segoe UI'` sin ninguna webfont. Defiende las dos.** ⭐

La pila de fuentes es una no-decisión deliberada: no usar webfont significa ninguna petición extra, ningún layout shift mientras carga y ningún host de terceros en el camino crítico, y la tipografía de una lista de to-do no lleva marca. `min-height: 100vh` está ahí para que el fondo oscuro pinte todo el viewport incluso cuando tres tareas no lo llenan — sin él, `body` solo tiene la altura de su contenido y la página termina en una banda blanca. Revisaría la unidad más que la regla: `100vh` se pasa en navegadores móviles cuyas barras de herramientas colapsan, y `100dvh` es el arreglo.

**[01-todo-list-108] La paleta es un tema oscuro escrito como literales hexadecimales sin ninguna alternativa de modo claro. ¿Fue una elección de diseño o una limitación?** ⭐⭐

Una elección, e incompleta. Nombrar los seis colores como `--bg-primary`, `--accent`, `--text-muted` y así sucesivamente significa que un tema claro es un segundo bloque redefiniendo esos tokens — bajo `prefers-color-scheme: light` o un atributo `[data-theme]` — sin que cambie ni una hoja de estilos de componente. Me quedé en un solo tema porque el paso de estilos trataba de flexbox y no de tematización, pero la capa de tokens es exactamente lo que hace barato añadir el segundo.

**[01-todo-list-109] En `task-list.css` los botones de filtro usan `background-color: var(--text-muted)`. ¿Qué tiene de malo esa línea?** ⭐

El token tiene el nombre de un rol que no está cumpliendo: `--text-muted` significa "texto desenfatizado", y lo usé como color de superficie porque el gris resultó verse bien. La consecuencia es que ajustar el texto muted más adelante repinta en silencio los botones de filtro. El arreglo es un token con el nombre del rol — `--surface-muted` — aunque hoy contenga el mismo hex, porque el sentido de una paleta con nombre es que el nombre, no el valor, es el contrato.

**[01-todo-list-110] `task-form.css` fija `outline: none` en el input y reestiliza `:focus` como un borde de acento de un píxel. ¿Es un intercambio equilibrado?** ⭐⭐

No, y es la línea que cambiaría primero en ese archivo. El outline por defecto es la affordance de foco de teclado del navegador, y reemplazarlo por un cambio de color de borde da un indicador de un píxel sobre un campo oscuro — visible si lo estás buscando, no si estás navegando con tab. Lo elegí porque el outline por defecto rompía las esquinas redondeadas, pero el arreglo correcto mantiene la affordance y la reestiliza: `outline: 2px solid var(--accent); outline-offset: 2px` sobre `:focus-visible`, que además evita que el anillo aparezca con clics de ratón.

**[01-todo-list-111] Tu botón de borrar y tu botón de envío usan `color: white`, mientras que todo lo demás en la app lee de una custom property. ¿Por qué la excepción?** ⭐

No hay razón, y ese es el hallazgo: `white` es el único color de la app sin ningún token detrás, así que un cambio de tema repintaría cada superficie y dejaría esas dos etiquetas hardcodeadas. La paleta ya tiene `--text-primary` en `#eaeaea`, que es lo que deberían leer esas etiquetas; si de verdad se quiere blanco puro sobre fondos de acento, se gana su propio token — `--text-on-accent` — en vez de un literal. Es el mismo fallo que reutilizar `--text-muted` como color de superficie: la capa de tokens solo funciona si nada la esquiva.

**[01-todo-list-112] Las mismas reglas de botón — padding, radius, `cursor: pointer`, `:hover { opacity: 0.85 }` — están copiadas en tres hojas de estilo de componente. ¿Por qué no extraerlas?** ⭐⭐

Como la encapsulación es por componente, un aspecto de botón compartido tiene que vivir en la hoja de estilos global o en un pequeño componente compartido, y con tres botones juzgué que la duplicación era más barata que cualquiera de las dos. Esa es la respuesta honesta, y también el punto en el que cambiaría de opinión: en cuanto aparezca un cuarto botón o cambie el hover, estoy editando tres archivos para mantener un aspecto consistente, que es exactamente la deriva que evitaría una clase global `.btn` o un `<app-button>`.

**[01-todo-list-113] En `todo-page.css` estilas el elemento `h1` a secas en vez de una clase. ¿Es seguro eso?** ⭐⭐

Es seguro solo por la encapsulación de vistas: Angular reescribe el selector con el atributo generado del componente, así que coincide con el `h1` de este componente y con ningún otro de la app. Lo mantendría aquí — hay exactamente un encabezado y una clase añadiría un nombre sin información — pero la misma regla en la hoja de estilos global sí sería una fuga real, y esa es la distinción que querría que un revisor me viera hacer, en vez de un genérico "nunca estilices elementos".

**[01-todo-list-115] El layout es un contenedor de `max-width: 600px` fijo sin media queries. ¿Es responsive?** ⭐

Es fluido en vez de responsive, y para este contenido eso basta: `max-width` con `margin: 0 auto` hace que el contenedor se encoja al viewport por debajo de 600 px y se centre por encima, y las filas son contenedores flex que se reacomodan solos. Decidí no usar breakpoints porque nada en el layout necesita cambiar de disposición a ningún ancho — una sola columna se queda como una sola columna. Un breakpoint se ganaría su sitio por algo como que la barra de filtros necesitara envolver, no por que la página simplemente sea estrecha.

**[01-todo-list-116] Tu `Task.id` es un `number` que viene de un contador en memoria. ¿Seguirías eligiendo `number` si esto hablara con un backend?** ⭐⭐

Sí, con un generador distinto. Una clave primaria numérica proveniente de una secuencia de base de datos es la forma normal en el stack Spring Data + PostgreSQL al que apunto, así que `number` mapea limpiamente a un id `Long` y deja `track task.id` y las búsquedas del servicio sin cambios. Un string UUID se gana su sitio cuando el cliente tiene que crear el id antes de que el servidor lo vea — offline-first o creación optimista — que es un problema que esta app no tiene.

**[01-todo-list-117] Los assets vienen de un glob de `public/` e `index.html` fija `<base href="/">`. ¿Qué se rompe si la app se despliega bajo una subruta?** ⭐⭐

Las URLs generadas por el router y toda ruta de asset relativa a la raíz se resuelven contra el base href, así que servir la app desde `/todo/` con `<base href="/">` da 404 en los bundles y enlaces rotos al navegar. El arreglo es `ng build --base-href /todo/`, que reescribe la etiqueta en tiempo de build en vez de hardcodear la ruta de despliegue en el código fuente. Dejé `/` porque la app se sirve desde la raíz de un dominio, pero la distinción que importa es que esto es un flag de build, no una edición de código fuente.

**[01-todo-list-118] Persistir la lista en `localStorage` son unas quince líneas. ¿Por qué elegiste no escribirlas?** ⭐⭐⭐

Porque habría comprado una feature al precio del concepto que este proyecto existe para enseñar. La persistencia significa que el signal deja de ser la única fuente de verdad — cada escritura tiene que reflejarse en el storage, el valor inicial hay que leerlo y parsearlo con un fallback para JSON corrupto, y `Task[]` deja de ser un tipo del que pueda fiarme porque `JSON.parse` devuelve `any`. Decidí mantener aquí el servicio como un escritor puro en memoria y dejar que el proyecto 04 introduzca la persistencia como tema propio, para que cuando las lecturas y escrituras se compliquen, la reactividad debajo de ellas ya sea algo que entienda.

**[01-todo-list-119] Tienes Prettier y un `.editorconfig` pero no ESLint. ¿Por qué uno sí y el otro no?** ⭐

Prettier y EditorConfig resuelven el formato — ancho de 100 columnas, comillas simples, y el parser HTML de Angular para que los templates con bloques de control de flujo no se destrocen — que es mecánico y merece automatizarse desde el primer día. ESLint hace cumplir reglas, y a este tamaño las únicas reglas que se dispararían son las que el compilador strict ya atrapa. Añadiría `angular-eslint` en cuanto el proyecto tenga un segundo colaborador o un paso de CI, ya que su valor real es arbitrar desacuerdos que no puedo tener conmigo mismo.

**[01-todo-list-081] Ni un solo componente de esta app fija `ChangeDetectionStrategy.OnPush`. Sin `zone.js` en `package.json`, ¿te está costando algo esa omisión?** ⭐⭐⭐

Mucho menos de lo que costaría en una app basada en zona, por eso dejé el default. Sin zona no hay ninguna comprobación global disparada por cada clic y temporizador: una vista se refresca porque se escribió un signal que su template leyó — `tasks`, `currentFilter` y los tres valores `computed()` aquí, y `task()` dentro de `TaskItem`, ya que `input.required<Task>()` es en sí mismo un signal. `OnPush` seguiría estrechando lo que reevalúa un recorrido, y es lo que hace que un estado no-signal obsoleto falle de forma ruidosa, así que decidí que se gana su sitio el día que un template aquí lea algo que no sea un signal; con tres componentes que no leen nada más, añadirlo ahora sería una decoración a la que no podría atribuirle ningún coste.

**[01-todo-list-082] Las consultoras a las que apuntas usan NgRx en sus proyectos Angular. ¿Por qué no hay ningún store aquí — ni siquiera un SignalStore?** ⭐⭐⭐

Porque no hay nada que un store tenga que arbitrar. NgRx renta cuando varias features no relacionadas escriben el mismo estado, cuando las acciones tienen que ser trazables o reproducibles, o cuando los effects coordinan trabajo asíncrono — esta app tiene un único escritor, tres componentes y ningún async en absoluto, así que un store envolvería `signal<Task[]>` y tres métodos en actions, reducers y selectors y me compraría solo indirección. Elegí la forma que el framework ya me da, un servicio de root guardando el signal con `computed()` donde NgRx pondría selectors, y la continuación honesta es que a escala recurriría primero al SignalStore de `@ngrx/signals`, precisamente porque mantiene este modelo mental en vez de reemplazarlo.

**[01-todo-list-083] Alternar una tarea reemplaza todo el array del signal e invalida los tres `computed()`. ¿Cuánto de la pantalla se vuelve a renderizar realmente, y dónde deja eso de escalar?** ⭐⭐

Muy poco: las tres derivaciones recalculan, pero `@for` reconcilia por clave, así que el único DOM tocado es la fila cuyo objeto de tarea cambió — su binding `[class.completed]` — mientras que cada otro `app-task-item` conserva el nodo que tenía. Lo que no escala es el coste por escritura y el número de nodos: cada uno de `addTask`, `toggleTask` y `deleteTask` recorre el array entero, y el DOM guarda una instancia de componente por tarea filtrada, así que a unos pocos miles de filas la respuesta es dejar de renderizarlas todas — virtual scrolling de CDK o una vista paginada — en vez de cambiar cómo se escribe el signal. Decidí que eso no era problema de este proyecto, porque con una lista que una persona escribe a mano, la reconciliación es la parte que vale la pena hacer bien.

**[01-todo-list-084] Todo tu grafo reactivo es `signal` más `computed` — no hay un solo `effect()`. ¿Fue una regla o un accidente?** ⭐⭐

Una regla: `computed()` para cualquier cosa que sea un valor derivado del estado, `effect()` solo para trabajo que tiene que salir del grafo — escribir a storage, logging, manejar una API imperativa. Nada en esta app sale del grafo, así que un effect solo habría podido reimplementar `filteredTasks` o `pendingCount` de forma imperativa y perder la memoización que los hace baratos. Decidí que la persistencia es lo que me habría forzado a escribir mi primero — un effect reflejando `tasks()` en `localStorage` — y deliberadamente dejé eso para el proyecto 04 en vez de introducir, en un primer proyecto, la única API de la familia de signals que puede escribir signals y retroalimentarse a sí misma.

**[01-todo-list-085] `app.config.ts` llama a `provideRouter(routes)` a secas, sin ninguna de las funciones de feature del router. ¿Cuál habría adoptado primero esta app?** ⭐⭐

`withComponentInputBinding()`, porque es lo que permitiría que el filtro viviera en la URL sin cableado manual: el router enlaza los parámetros de ruta y query directamente a inputs de componente, así que `currentFilter` se convertiría en un input signal en vez de algo que leo de `ActivatedRoute`. El resto no tiene superficie aquí — `withPreloading()` necesita rutas lazy y no hay ninguna, `withInMemoryScrolling()` necesita una página lo bastante alta como para hacer scroll, `withViewTransitions()` necesita una navegación que animar. Elegí la llamada a secas porque una función de feature es configuración para un comportamiento, y activar una para un comportamiento que la app no tiene es código que un revisor tiene que leer de más.

**[01-todo-list-086] Mantuviste las URLs HTML5 por defecto del router y la app se entrega como archivos estáticos. ¿Qué tiene que hacer el host que este repositorio nunca declara?** ⭐⭐

Reescribir cada ruta sin match hacia `index.html`. `PathLocationStrategy` es el default y produce rutas reales sin `#`, así que un refresco o un marcador en cualquier URL es una petición que el host estático responde con un archivo que no existe — y en este proyecto no hay ningún `_redirects` ni `netlify.toml`, así que ese fallback existe solo en el panel del hosting y no en el repo. Elegí las URLs push-state de todas formas, porque `HashLocationStrategy` es el workaround para hosts que no pueden reescribir y cuesta enlaces limpios y cualquier renderizado en servidor futuro; la carencia real es que la reescritura es un hecho de despliegue que este repositorio no registra.

**[01-todo-list-087] Dos piezas de estado aquí nunca pasan por un signal — el contador `nextId` del servicio y el valor del input que `TaskForm` limpia con `input.value = ''`. Bajo zoneless, ¿por qué la pantalla se mantiene correcta?** ⭐⭐

Porque ningún template lee ninguna de las dos. `nextId` es un contador privado que solo se toca dentro de `addTask`, y el texto de la caja pertenece al DOM — lo leo a través de una template reference variable y limpio el elemento directamente — así que ningún binding depende de ninguna de las dos y no hay nada que a la detección de cambios se le pueda escapar. Decidí que esa es exactamente la línea a sostener sin zona: cualquier cosa que un template renderice tiene que ser un signal, porque nada más va a notar que un campo plano cambia, y en el momento en que enlazara `[value]` a una propiedad de clase, esa propiedad tendría que convertirse en uno.

**[01-todo-list-088] `toggleTask` mapea el array entero para invertir un booleano y `deleteTask` lo filtra. ¿Habría sido un `Map<number, Task>` indexado por id la mejor forma de estado?** ⭐

No a este tamaño, aunque no diría que el array es óptimo. Cada escritura es un recorrido completo y cada búsqueda es un escaneo lineal, que un `Map` convierte en acceso por clave — pero el template necesita una lista ordenada sobre la que hacer `@for`, así que un `Map` me compra la búsqueda y luego me debe un orden más una conversión en cada render. Elegí el array porque es la forma que realmente consume la vista; la forma normalizada se gana su sitio cuando varias features leen la misma entidad y las búsquedas por identidad superan a los renders, que es el caso para el que existe el entity adapter de NgRx.

**[01-todo-list-089] Angular te da `@defer`, y esta página lo renderiza todo de forma eager. ¿Hay algo aquí que merezca la pena diferir?** ⭐

No, y defendería eso en vez de añadir uno solo para parecer actualizado. `@defer` renta cuando un bloque es pesado y no hace falta de inmediato — un gráfico, un editor enriquecido, un panel bajo el pliegue — mientras que esta página es un formulario, una barra de filtros y una lista, todos por encima del pliegue y todos necesarios en el primer pintado, así que diferir cualquiera de ellos compraría un placeholder de carga y un segundo chunk para markup medido en bytes. Lo decidí de la misma forma que decidí que la ruta se quede en `component` en vez de `loadComponent`: la pereza que se resuelve de inmediato igualmente es una petición pagada por nada.

**[01-todo-list-090] Cuando esta lista empiece a venir de un backend, ¿la pides con un `resolve` de ruta o desde el componente?** ⭐

Desde el componente, a través del servicio — no con un resolver. Un resolver retiene la navegación hasta que llegan los datos, así que el usuario se queda en la pantalla anterior sin ningún feedback, y convierte al objeto de ruta en dueño de una petición que ya es dueño `TaskService`. Decidí que los resolvers se ganan su sitio cuando la ruta no puede renderizar de forma significativa sin los datos — una página de detalle indexada por un id que podría no existir, donde resolver es también cómo rediriges antes de navegar en vez de después — y una página de lista de una sola ruta no tiene esa forma.
