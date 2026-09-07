# Preguntas de entrevista — 02-weather-app

**Último banco:** 2026-09-07

Preguntas específicas de las decisiones de implementación tomadas en este proyecto.
Úsalas junto a los archivos por tema en `interview-prep/{LEVEL}/en/` y `es/`.

## Arquitectura y patrones

**[02-weather-app-001] Tu `app.routes.ts` declara exactamente una ruta, `'' → WeatherPage`. ¿Por qué arrancar a través del router en vez de poner la página directamente en `App`?** ⭐⭐

Decidí mantener el router porque hoy cuesta una línea, `provideRouter(routes)`, y es la diferencia entre añadir una segunda pantalla y reestructurar el shell. `App` es un `<router-outlet />` y nada más, así que una futura página de "ciudades guardadas" o de ajustes es una entrada nueva en el array, no una reescritura del componente raíz. Elegí la forma que la aplicación va a necesitar antes que la que necesita hoy, porque el precio de equivocarme aquí es una línea de configuración.

**[02-weather-app-002] `App` no contiene más que `<router-outlet />` — sin cabecera, sin layout, sin estado. ¿No es un componente que no hace nada?** ⭐

Hace una cosa a propósito: es el punto de montaje sobre el que escribe el router, y mantenerlo vacío significa que toda decisión visual pertenece a la página enrutada. Decidí no poner ahí una cabecera porque con una sola ruta sería indistinguible de ponerla en `WeatherPage`, y en cuanto exista una segunda ruta quiero que la elección — el marco compartido por todas las páginas en `App`, o el marco que pertenece a una pantalla dentro de esa pantalla — siga abierta.

**[02-weather-app-003] En `app.config.ts` escribiste `provideHttpClient(withFetch())` en vez de `provideHttpClient()` a secas. ¿Qué cambia ese flag?** ⭐⭐

Cambia el transporte que hay debajo de `HttpClient`, de `XMLHttpRequest` a la API `fetch` del navegador. Lo elegí porque es el backend que Angular recomienda de aquí en adelante y el que se comporta correctamente bajo server-side rendering, así que si algún día añado SSR no hay que revisar la capa HTTP. En el código de mi servicio no cambia nada — `getWeather` y `getForecast` siguen devolviendo el mismo `Observable` —, que es justo la gracia de configurar el transporte a nivel de provider y no en cada llamada.

**[02-weather-app-004] Dejaste `provideBrowserGlobalErrorListeners()` en la configuración. ¿Para qué sirve y por qué mantenerlo en un proyecto tan pequeño?** ⭐

Registra listeners globales para errores no capturados y promesas rechazadas sin manejar, de modo que se reporten a través del error handler de Angular en vez de morir en silencio en la consola. Lo dejé porque el camino de error propio de la aplicación solo cubre lo que `forkJoin` emite hacia mi callback `error` — un fallo en cualquier otro sitio, dentro de un pipe o en el código de la plantilla, no tiene otra vía de reporte. Quitar andamiaje que no he entendido es la forma en que un proyecto pierde su único diagnóstico para la clase de fallo que menos capaz soy de predecir.

**[02-weather-app-005] Aquí todos los componentes son standalone — no hay ningún `AppModule`. ¿Cómo llegan entonces `WeatherCard` y `DecimalPipe` a estar disponibles en una plantilla?** ⭐⭐

Cada componente declara su propio array `imports`: `WeatherPage` importa `WeatherForm`, `WeatherCard` y `WeatherForecast`, y `WeatherCard` importa `DecimalPipe` para sí mismo. Elegí standalone porque así las dependencias de una plantilla se leen en lo alto del archivo que es dueño de esa plantilla, en vez de desde un módulo tres carpetas más allá que además declara otras nueve cosas sin relación. Es también la razón de que `main.ts` llame a `bootstrapApplication(App, appConfig)` y no haya ningún `AppModule` que declarar, importar o exportar: los providers se movieron a `app.config.ts` y las declaraciones se movieron a cada componente.

**[02-weather-app-006] La API key se añade en `WeatherService.buildParams()`. ¿Por qué no un `HttpInterceptor` registrado en `app.config.ts`, como se suele hacer con un token de auth?** ⭐⭐

Decidí que un interceptor se gana su sitio cuando una preocupación transversal afecta a peticiones que hacen varios servicios, y aquí un solo servicio hace todas las peticiones que necesitan la key. Además, el interceptor tendría que comprobar la URL antes de adjuntarla, así que no sería comportamiento transversal a ciegas — sería una regla de `WeatherService` escrita en un sitio donde `WeatherService` no puede verla. Si entrara una segunda API en la aplicación lo movería, porque ahí la comprobación pasa a ser enrutado de verdad y no un `if` disfrazado.

**[02-weather-app-007] Explícame el reparto de componentes de esta pantalla: ¿cuál es smart y qué hace dumb a los otros tres?** ⭐⭐⭐

`WeatherPage` es el único componente smart: inyecta `WeatherService`, es dueño de los cuatro signals y dispara la petición. `WeatherForm`, `WeatherCard` y `WeatherForecast` son presentacionales — el formulario emite un string con `output<string>()` y no sabe nada de HTTP, y los dos componentes de visualización reciben sus datos con `input()` y los pintan. Elegí ese reparto para que toda la historia asíncrona de la pantalla viva en un archivo que puedo leer de arriba abajo, mientras que sobre los tres hijos se puede razonar enteramente a partir de sus inputs y sus outputs.

**[02-weather-app-008] En el proyecto 01 el estado vive en un servicio `providedIn: 'root'`; aquí vive en signals dentro de `WeatherPage`. ¿Por qué la decisión contraria?** ⭐⭐⭐

Porque el estado tiene otro tiempo de vida. Una lista de tareas es el dato de la aplicación y tiene que sobrevivir a la página que lo muestra; el tiempo de la ciudad que acabas de escribir es una vista de un recurso remoto, y si la página se destruye no hay nada que merezca la pena conservar — lo correcto al volver es una petición nueva, no una lectura vieja. Decidí que `WeatherService` se quedara sin estado, como una pasarela pura hacia la API, para que los signals vivan en el componente cuyo tiempo de vida coincide con el del dato.

**[02-weather-app-009] `models/`, `services/`, `utils/` y `components/` están todos dentro de `pages/weather-page/`. ¿Por qué no un `core/` global?** ⭐⭐

La estructura es feature-first: todo lo que necesita la feature del tiempo está dentro de la carpeta que lleva su nombre, y puedo borrar la feature borrando un solo directorio. Decidí no usar `core/` porque una carpeta compartida anuncia reutilización, y `WeatherService`, las interfaces de respuesta y `getIconUrl` tienen exactamente un consumidor. Promoverlos el día en que una segunda feature los necesite es un cambio de un import; degradar algo que se promovió mal es una conversación sobre propiedad.

**[02-weather-app-010] `WeatherForm` usa una variable de referencia de plantilla, `#city`, con `(keyup.enter)` y un handler de click. ¿Por qué no `ngModel` o un `FormControl`?** ⭐⭐

El componente tiene un campo, ninguna validación que mostrar y ningún estado que conservar entre envíos — lee el valor en el momento del submit y lo emite. Los reactive forms añadirían `ReactiveFormsModule`, un `FormGroup` y una suscripción para modelar un único string que solo necesito una vez, y `ngModel` añadiría two-way binding a un valor que nadie más lee. Elegí la referencia de plantilla porque es lo más pequeño que expresa "lee este input cuando el usuario envíe", y pasaría a reactive forms en cuanto el formulario ganara un segundo campo o un mensaje de validación.

**[02-weather-app-011] El `trim` y la guarda del string vacío están dentro de `WeatherForm`, no en `WeatherPage.onCitySearch()`. ¿Por qué decide el hijo?** ⭐

Decidí que el formulario es dueño de qué cuenta como envío: una caja vacía no es una búsqueda, así que no debería emitirse nada y el padre no debería enterarse siquiera. Eso deja `onCitySearch` libre de una higiene de entrada que él no provocó y le da a la guarda un único sitio donde crecer — una longitud mínima, un filtro de caracteres — sin meter mano en la página. El tradeoff que acepto es que la página se fía de su entrada, lo cual está bien mientras los únicos que la llaman sean este formulario y su propio `ngOnInit`.

**[02-weather-app-012] `forkJoin` se llama en `WeatherPage`, no dentro de `WeatherService`. ¿Por qué la petición en paralelo no forma parte de la API del servicio?** ⭐⭐⭐

`WeatherService` es un espejo de la API de OpenWeatherMap: dos endpoints, dos métodos, cada uno devolviendo su propio `Observable` tipado. `forkJoin` es una decisión sobre *esta pantalla* — que muestra las condiciones actuales y una previsión juntas y no tiene nada útil que pintar hasta que llegan las dos. Elegí dejar la combinación en el componente para que una futura pantalla que solo quiera la previsión pueda llamar a `getForecast` sin heredar una petición que no necesita, y para que el servicio siga siendo una descripción de la API remota y no del layout de una página.

**[02-weather-app-013] Te suscribes a mano y empujas los datos a signals. ¿Por qué no el pipe `async`, o `toSignal`?** ⭐⭐⭐

Porque la respuesta no es lo único que la plantilla necesita: esa misma emisión tiene que limpiar `isLoading`, y un fallo tiene que poner `errorMessage` a la vez que baja el flag de carga. Con el pipe `async` la suscripción es de la plantilla, así que las transiciones de carga y de error habría que reconstruirlas a su alrededor con operadores extra. Decidí que un único `subscribe` explícito con callbacks `next` y `error` deja toda la máquina de estados de la pantalla en un solo sitio, y lo pagué encargándome yo mismo de la desuscripción con `takeUntilDestroyed`.

**[02-weather-app-014] `takeUntilDestroyed(this.destroyRef)` en la página que nunca se destruye — la única ruta de la aplicación. ¿No es código muerto?** ⭐⭐

Hoy nunca se dispara, y lo mantuve a propósito. No es el arreglo de una fuga que yo haya observado, es el invariante que hace seguro el `subscribe` manual bajo cualquier enrutado futuro, y en cuanto exista una segunda ruta el comportamiento que protege se vuelve real sin que nadie tenga que acordarse de añadirlo. Pasé el `DestroyRef` inyectado de forma explícita porque `onCitySearch` se ejecuta en un evento de usuario, fuera del contexto de inyección donde `takeUntilDestroyed()` puede encontrar uno por sí mismo.

**[02-weather-app-015] `ngOnInit` llama a `onCitySearch('Madrid')` con una ciudad fija en el código. Defiéndelo.** ⭐⭐

Decidí que una pantalla vacía con una caja de búsqueda es una peor primera impresión que una pantalla que ya muestra algo real: el visitante ve la tarjeta, la previsión y los iconos sin escribir nada. Reutilizar `onCitySearch` en vez de un camino de arranque aparte hace que la carga inicial ejercite exactamente las mismas transiciones de carga, éxito y error que una búsqueda del usuario, así que no hay un segundo camino de código que mantener correcto. La limitación honesta es que el valor por defecto es un literal dentro del componente — la geolocalización o la última ciudad buscada leída de almacenamiento es el paso natural siguiente.

**[02-weather-app-016] `dailyForecast` es un `computed()` en la página que filtra la lista cruda para quedarse con las entradas de las `12:00:00`. ¿Por qué ahí y no en el servicio o en el hijo?** ⭐⭐⭐

La API devuelve cuarenta entradas cada tres horas y la pantalla muestra cinco días, así que algo tiene que elegir una lectura por día; elegí el mediodía como la representativa. Es un `computed` en la página porque es estado derivado — se recalcula cada vez que cambia `forecastResponse` y nunca hay que mantenerlo sincronizado a mano. Lo mantuve fuera del servicio para que el servicio devuelva lo que devolvió la API, y fuera de `WeatherForecast` para que ese componente siga siendo un pintor de la lista que le den y no un componente que sabe cómo trocea OpenWeatherMap su previsión.

**[02-weather-app-017] `WeatherCard` recibe `input<WeatherResponse | null>()` y luego la plantilla usa `weather()!`. ¿Por qué permitir null si acto seguido lo afirmas a la fuerza?** ⭐⭐

El null modela el estado real de la pantalla antes de la primera respuesta y entre búsquedas, cuando la página pasa `weatherResponse()` tal cual. La plantilla abre con `@if (weather())`, así que dentro de ese bloque el valor no puede ser null de verdad — el `!` le está diciendo al compilador lo que la guarda ya estableció, no se está saltando una comprobación. Lo que mejoraría es la ergonomía: `@if (weather(); as w)` enlaza el valor ya estrechado y elimina todos los `!` del bloque.

**[02-weather-app-018] `WeatherForecast` pone `[]` como valor por defecto de su input mientras que `WeatherCard` pone null. ¿Por qué los dos estados de ausencia tienen forma distinta?** ⭐

Porque los dos inputs llevan cosas distintas. La tarjeta recibe un único objeto de respuesta, y la representación honesta de "todavía no hay respuesta" es null. La previsión recibe una lista que la página ya ha derivado, y `dailyForecast` devuelve `[]` cuando no hay datos, así que un array vacío no es un valor ausente — es una lista sin nada dentro, que es justo lo que lee la guarda `@if (forecast().length > 0)`. Poner una colección a vacío en vez de a null también significa que ningún consumidor tiene que comprobar null antes de iterar.

**[02-weather-app-019] `getIconUrl` es una función exportada normal en `utils/`, asignada a un campo `protected` en los dos componentes. ¿Por qué no un pipe, o un método del servicio?** ⭐⭐

Es una transformación pura de strings, sin dependencias y sin estado, así que inyectarla crearía una dependencia para algo que en realidad es una constante con un hueco. Un pipe funcionaría y sería lo correcto si creciera con opciones de formato, pero para una interpolación en cada una de dos plantillas es más maquinaria de la que merece la transformación. La asigné a un campo `protected` porque una plantilla solo puede alcanzar miembros de su propia clase de componente, y `protected` la expone a la plantilla sin ensanchar la API pública del componente.

**[02-weather-app-020] `weather-page.html` pinta `<app-weather-card />` sin condición; la tarjeta se esconde a sí misma con su propio `@if`. ¿Por qué no dejar que el padre decida si aparece?** ⭐⭐

Cada componente es dueño de la respuesta a "¿tengo algo que mostrar?", lo que mantiene la plantilla de la página como una descripción plana de la pantalla en vez de una cadena de condicionales sobre los datos de sus hijos. El coste es que el padre no puede saber desde su propia plantilla si hay algo en pantalla, y quien lo lea tiene que abrir el hijo para saberlo. Con dos hijos preferí el padre más simple; con varios subiría la decisión, porque a esas alturas el layout de la página depende de ella.

**[02-weather-app-021] El spinner de carga y el mensaje de error los pinta la página, no los componentes a los que se refieren. ¿Por qué viven esos dos arriba?** ⭐⭐

Porque ninguno pertenece a un hijo: `isLoading` y `errorMessage` describen la única petición que trae datos para los dos hijos a la vez, así que no hay ningún componente de abajo que pudiera ser su dueño sin mentir sobre su alcance. `onCitySearch` además limpia los dos signals de respuesta antes de empezar, así que los hijos no pintan nada mientras el spinner está arriba y nunca hay una tarjeta vieja al lado de un spinner o de un error. Esa limpieza es la parte que hace que los tres estados sean mutuamente excluyentes y no simplemente consecutivos.

**[02-weather-app-022] `DecimalPipe` se importa en `WeatherCard` y otra vez en `WeatherForecast`. ¿No es duplicación que evitarías con un módulo compartido?** ⭐

Es repetición, no duplicación de lógica — cada componente declara lo que usa su propia plantilla, que es la propiedad que hace que un componente standalone sea legible y testeable de forma independiente. Un módulo "common" compartido quitaría dos líneas y reintroduciría justo aquello que los componentes standalone existen para matar: una plantilla cuyas dependencias se declaran en otro sitio, y una lista de imports que crece para componentes que no necesitan nada de ella. Elegí la repetición explícita.

**[02-weather-app-023] Tu `@for` hace track de `item.dt_txt`. ¿Por qué ese campo, y qué se rompe si haces track de `$index`?** ⭐

`dt_txt` es la marca de tiempo del hueco de previsión, así que es único en la lista y estable entre respuestas — el mismo día conserva su identidad cuando llega una búsqueda nueva, y Angular puede reutilizar el nodo del DOM en vez de destruirlo. Hacer track de `$index` convertiría la posición en la identidad, así que todos los elementos se considerarían cambiados en cuanto la lista se desplazara, y cualquier estado del DOM dentro de una fila seguiría al elemento equivocado. La lista es lo bastante pequeña como para que la diferencia de rendimiento sea invisible; elegí la clave correcta porque la corrección de la identidad es para lo que sirve `track`.

**[02-weather-app-024] La única ruta carga `WeatherPage` de forma eager con `component:`. ¿Cuándo pasarías a `loadComponent`?** ⭐

El lazy loading compensa cuando el código de una ruta no hace falta para el primer pintado, y aquí la única ruta *es* el primer pintado — diferirla añadiría una petición de chunk antes de que se pueda pintar nada. Decidí que eager era lo correcto para una aplicación de una ruta y que el disparador para cambiar es una segunda ruta más pesada: una pantalla de ajustes o de historial que la mayoría de visitantes no abre nunca es una línea de `loadComponent`, y la página del tiempo se queda eager porque es la pantalla de aterrizaje.

**[02-weather-app-025] Tus hijos usan `input()` y `output()`, no los decoradores `@Input()` y `@Output()`. ¿Qué ganaste eligiendo la API basada en signals?** ⭐⭐

El `weather = input<WeatherResponse | null>()` de `WeatherCard` es un signal, así que la plantilla lo lee como `weather()` y cualquier `computed` sobre él se recalcula sin ningún hook de ciclo de vida — `dailyForecast` en la página es el mismo mecanismo un nivel más arriba. Con `@Input()` estaría reaccionando a los cambios de input a través de `ngOnChanges` o de un setter en cuanto hubiera que derivar algo de ellos. Elegí la API de signals por coherencia: en este proyecto todo valor reactivo, estado e input por igual, se lee de la misma manera, así que no hay un segundo modelo de reactividad que mantener en la cabeza.

**[02-weather-app-026] `WeatherPage` inyecta con `inject(WeatherService)` e `inject(DestroyRef)` en vez de con parámetros del constructor. ¿Por qué, y dónde muerde de verdad esa elección?** ⭐⭐

Elegí `inject()` porque las dependencias se convierten en inicializadores de campo normales, así que la clase no tiene constructor y añadir una inyección más es una línea en vez de un cambio de firma. Donde muerde es en `DestroyRef`: `takeUntilDestroyed()` solo puede encontrar el contexto de inyección por sí mismo cuando se le llama durante la construcción, y `onCitySearch` se ejecuta más tarde, en un evento de usuario. Decidí inyectar el `DestroyRef` en un campo y pasarlo de forma explícita, que es exactamente el caso que la forma sin parámetros no puede cubrir.

**[02-weather-app-027] `WeatherService` es `providedIn: 'root'` aunque no tiene estado y tiene exactamente un consumidor. ¿Por qué no proveerlo en `WeatherPage`?** ⭐

Proveerlo en el componente ataría el tiempo de vida de la instancia al de la página, lo cual solo importa para un servicio que guarda estado — y yo dejé a propósito todos los signals en el componente, así que este no guarda ninguno. Elegí `providedIn: 'root'` porque es tree-shakeable cuando no se usa y porque significa que una segunda pantalla que necesite la API obtiene la misma instancia sin cablear ningún provider. Si algún día el servicio cacheara respuestas por pantalla, ese es el día en que el provider baja al componente.

**[02-weather-app-028] `weather-forecast.html` formatea la fecha con `{{ item.dt_txt | slice: 0 : 10 }}`. ¿Por qué un pipe de strings sobre una fecha, y qué cuesta?** ⭐

`dt_txt` llega de OpenWeatherMap como el string `"2025-03-14 12:00:00"`, así que cortar los diez primeros caracteres da la fecha sin parsear nada. El coste que acepto es que se pinta en orden ISO en vez de en un formato de locale, y que depende de la forma exacta del string de la API — un cambio de formato allí se convierte en un bug de visualización en lugar de en un error de tipos. `DatePipe` sobre `item.dt` (el timestamp Unix que la API también envía) es la mejora correcta, y es lo que escribiría en cuanto la pantalla tuviera que ser legible en más de un locale.

**[02-weather-app-029] PLANNING.md nombra `search-bar`, `current-weather` y `forecast-card` bajo un `services/` global. El código tiene `weather-form`, `weather-card` y `weather-forecast` dentro de la feature. ¿Qué cambió mientras lo construías?** ⭐⭐

Dos cosas. Los nombres pasaron a llevar el prefijo `weather-` para que los selectores se lean como el vocabulario de una feature en vez de como tres widgets genéricos, y `services/` se movió dentro de `pages/weather-page/` en cuanto quedó claro que `WeatherService` tenía un único consumidor. El cambio de verdad es `forecast-card`: el plan tenía un componente por día y el código tiene un solo `WeatherForecast` que pinta la lista entera, porque el `@for` y la guarda `@if (forecast().length > 0)` pertenecen a la lista, y sacar una tarjeta aparte habría dejado al hijo con un elemento y todas las decisiones de nivel de lista igualmente en el padre.

## Reglas de negocio

**[02-weather-app-030] `forkJoin` significa que la pantalla no muestra nada salvo que *ambas* peticiones tengan éxito. ¿Por qué se tira una lectura del tiempo actual que funciona porque falló la previsión?** ⭐⭐⭐

Decidí que esta pantalla es una unidad: la tarjeta y la lista de cinco días son dos vistas de la misma pregunta, y una respuesta a medio pintar junto a un mensaje de error es un estado peor que un fallo limpio que el usuario puede reintentar. `forkJoin` me da esa regla gratis — solo emite cuando ambos observables internos completan, y un único fallo va directo a mi callback `error`, donde los dos signals de respuesta ya se limpiaron al principio de `onCitySearch`. El tradeoff es real: si OpenWeatherMap degradara uno de los endpoints perdería datos que sí tengo, y el arreglo sería un `forkJoin` sobre dos streams, cada uno con su propio `catchError` de reserva, para que un pintado parcial sea posible a propósito y no por accidente.

**[02-weather-app-031] Tu callback `error` ignora por completo el objeto de error y siempre pone `'City not found. Please try again'`. ¿Qué tiene de malo esa regla?** ⭐⭐⭐

Es la descripción honesta del fallo *esperado* — un 404 por un nombre de ciudad que no existe — y es equivocada para todos los demás. Un 401 por una API key mala, un 429 del rate limit y una conexión caída llegan todos al mismo callback y todos le dicen al usuario que la ciudad está mal, así que el único mensaje que tiene la aplicación desorienta activamente a quien no pudo causar el fallo. Elegí el mensaje único para mantener la máquina de estados de la primera versión en tres estados, y la mejora correcta es ramificar según `HttpErrorResponse.status`: el 404 conserva este texto, y todo lo demás recibe un "el servicio no está disponible, inténtalo en un momento" que no culpa a la entrada.

**[02-weather-app-032] `WeatherForm.submit()` hace `trim` y rechaza un string vacío, y esa es toda la validación. ¿Por qué ninguna longitud mínima, ningún filtro de caracteres, ninguna comprobación de que la ciudad existe?** ⭐⭐

Porque solo una de esas es una regla que el cliente pueda conocer de verdad. "¿Esto es una ciudad?" lo responde OpenWeatherMap y nada de mi lado, así que cualquier comprobación local o duplicaría la respuesta de la API de forma imperfecta o rechazaría un nombre que la API habría aceptado — una ciudad con acento o de dos letras, por ejemplo. Decidí que el cliente solo impone lo que es decidible localmente: un envío sin contenido no es una búsqueda, así que la guarda lo para antes de gastar una petición en él, y todo lo demás se delega a la respuesta. La guarda de búsqueda en blanco se gana su sitio precisamente porque es el único caso en que la petición está garantizado que se desperdicia.

**[02-weather-app-033] Nada en esta pantalla impide que el usuario pulse Enter cinco veces seguidas. ¿Qué pasa, y de qué no te protege `forkJoin`?** ⭐⭐

Arrancan cinco suscripciones a `forkJoin` independientes, y nada cancela las anteriores — `takeUntilDestroyed` solo desuscribe cuando se destruye la página, que no es lo que ocurre aquí. Así que los signals los escribe el par de respuestas que llegue el último en *tiempo*, no la última búsqueda que hizo el usuario, y una primera petición lenta puede sobrescribir a una segunda rápida y dejar la ciudad equivocada en pantalla. Decidí no resolverlo en la primera versión porque el fallo necesita un orden de latencias concreto, pero el arreglo correcto es convertir la búsqueda en un `Subject` pasado por `switchMap`, que cancela la petición en vuelo con cada término nuevo; deshabilitar el botón mientras `isLoading()` sea true es el parche barato que cierra el caso común.

**[02-weather-app-034] La plantilla de la página tiene tres bloques `@if` independientes — spinner, error, tarjeta — y ningún `@else`. ¿Qué garantiza en realidad que nunca veas dos a la vez?** ⭐⭐

El orden dentro de `onCitySearch`, no la plantilla. Sus primeras cuatro líneas ponen `isLoading` a true y limpian `weatherResponse`, `forecastResponse` y `errorMessage`, así que en el momento en que arranca una búsqueda hay exactamente una cosa en pantalla; `next` rellena las dos respuestas y baja el flag en el mismo callback, y `error` pone el mensaje y baja el flag. Elegí que el invariante fuera una propiedad del único método que es dueño de todas las transiciones y no del marcado, porque una cadena `@if/@else` expresa exclusión entre dos y esta pantalla tiene tres estados repartidos en cuatro signals. El coste es que quien lea solo la plantilla no puede ver la regla — se impone arriba.

**[02-weather-app-035] `dailyForecast` filtra con `dt_txt.includes('12:00:00')`. ¿Cuál es la regla, y cuándo no te da cinco días?** ⭐⭐

La regla es una lectura representativa por día, y elegí el mediodía porque es la entrada que una persona quiere decir de verdad con "qué tiempo hará el martes". La API devuelve cuarenta huecos de tres horas que cubren cinco días desde *ahora*, así que el día actual solo tiene hueco de las 12:00 si la búsqueda ocurre antes del mediodía — busca por la tarde y el filtro da cuatro filas mientras el encabezado sigue diciendo "previsión a 5 días". Lo acepté porque la lista pinta lo que le den y una lista corta no es una pantalla rota, pero la versión robusta agrupa las entradas por fecha y elige la lectura más cercana al mediodía dentro de cada grupo, lo que devuelve una fila por día sea cual sea la hora de la búsqueda.

**[02-weather-app-036] `units=metric` está fijo en `WeatherService.buildParams()`. ¿Qué decide eso para toda la pantalla?** ⭐⭐

Decide que la temperatura es Celsius en todas partes, y que el sufijo `ºC` escrito a mano en las dos plantillas es siempre cierto — la unidad no es una decisión de visualización que se tome por componente, es una propiedad de la petición. Elegí ponerlo en `buildParams` porque los dos endpoints lo necesitan idéntico, y la alternativa, convertir Kelvin en los componentes, metería la misma aritmética en dos plantillas y convertiría el sufijo en una afirmación que nada garantiza. El día en que un selector de unidades sea una feature, el parámetro pasa a ser un argumento de `getWeather`/`getForecast` y el sufijo se deriva del mismo signal — que es exactamente por lo que la conversión no debía haberse esparcido por las vistas.

**[02-weather-app-037] Las dos temperaturas se pintan con `| number: '1.0-1'`. ¿Por qué ese string de formato y no el valor crudo?** ⭐

Significa al menos un dígito entero y entre cero y un decimal, así que `12` se pinta como `12` y `12.34` como `12.3`. Lo elegí porque la precisión de la API no es significativa para una lectura del tiempo — nadie actúa según una centésima de grado — y un valor sin formatear dejaría que el layout de la tarjeta diera saltos según cambiara la longitud del número. La regla es solo de visualización: el signal conserva el número de la API y solo la plantilla redondea, así que nada de aguas abajo hereda nunca un valor redondeado.

**[02-weather-app-038] Cuando no hay datos, la tarjeta y la previsión no pintan absolutamente nada — ni un mensaje de "busca una ciudad", ni un placeholder. ¿Es una decisión o un olvido?** ⭐⭐

Es la decisión de que un estado ausente sea silencioso en vez de ruidoso: `@if (weather())` y `@if (forecast().length > 0)` hacen que cada componente desaparezca cuando no tiene nada cierto que decir, así que la pantalla nunca muestra un marco lleno de guiones. En la práctica el estado casi no se alcanza, porque `ngOnInit` lanza una búsqueda de inmediato y la única otra vía es una petición fallida, donde el mensaje de error *es* el mensaje. Lo que añadiría si se quitara la búsqueda inicial es un estado vacío de primera visita debajo del formulario, porque una caja de búsqueda pelada sin nada debajo es una pantalla que no se explica a sí misma.

**[02-weather-app-039] Las dos plantillas leen `weather[0]` sin comprobar el array. ¿Qué estás asumiendo, y qué dice tu propio tipo?** ⭐

Asumo que OpenWeatherMap siempre envía al menos una entrada en `weather`, lo cual se cumple en la práctica para los dos endpoints que llamo. Mi interfaz dice otra cosa: `WeatherCondition[]` permite un array vacío, así que basta un caso límite de la API para que el código lea `undefined.icon` dentro de una plantilla, donde el fallo aflora como una imagen rota y una descripción en blanco en vez de como un error que yo pueda capturar. Decidí aceptar la asunción para un proyecto de portfolio contra una API pública estable; los arreglos honestos son un tipo tupla, o leer la condición a través de un `computed` que devuelva un valor de reserva.

**[02-weather-app-040] Si la primerísima petición — la búsqueda de Madrid del `ngOnInit` — falla, al usuario se le muestra "City not found. Please try again" antes de escribir nada. Defiéndelo.** ⭐⭐

No defendería el mensaje, solo la estructura que lo produjo. Reutilizar `onCitySearch` para la carga inicial es lo que mantiene un único conjunto de transiciones de estado en la aplicación, y el precio es que el arranque hereda el texto de error, que se lee como una acusación sobre una entrada que el usuario nunca dio. Un fallo ahí es casi seguro la key, la red o el rate limit antes que la ciudad, así que es el mismo defecto que el callback `error` sin tipar: en cuanto el mensaje ramifique según `HttpErrorResponse.status`, el caso de arranque recibe el texto de servicio no disponible automáticamente y esta pregunta deja de existir.

**[02-weather-app-041] Nada en la aplicación recuerda qué se buscó — ningún signal guarda el término, el input conserva lo que se escribió y la URL nunca cambia. ¿Qué prohíbe eso?** ⭐⭐

Prohíbe compartir o guardar en favoritos una ciudad, restaurar la última búsqueda al recargar y mostrar el nombre buscado en cualquier sitio que no sea dentro de la respuesta, donde `weather()!.name` es la grafía de la API y no la del usuario. Elegí dejarlo fuera porque la pantalla tiene una sola ruta y la respuesta ya lleva la ciudad a la que resolvió, así que un signal `searchTerm` sería estado duplicado del dato que él mismo disparó — PLANNING.md planeó uno y el código no tiene ninguno, que es el plan cambiando al contacto con el código. La versión que se gana su sitio es un parámetro de ruta `:city`, porque eso convierte la URL en el estado y compra los favoritos, la recarga y el botón de atrás de una sola vez.

**[02-weather-app-042] PLANNING.md lista la velocidad del viento entre las features clave y la tarjeta muestra humedad y sensación térmica en su lugar. ¿Qué regla cambió?** ⭐⭐

El plan nombró los cuatro campos que una tarjeta del tiempo suele mostrar, y mientras construía elegí los tres que una persona lee de verdad juntos: la temperatura, lo que se siente y la humedad. `WeatherMain` en `weather.model.ts` lo refleja — declara `temp`, `feels_like` y `humidity` y nada más, así que la omisión está tipada y no es accidental, y el viento llegaría como un campo nuevo en la interfaz más una línea en la plantilla. Prefiero estrechar el plan a propósito antes que enviar un cuarto número que nadie pidió; la deuda honesta es que la lista de features de PLANNING.md nunca se puso al día con lo que muestra la pantalla.

**[02-weather-app-043] Una búsqueda que tiene éxito pero cuya previsión no contiene ninguna entrada `12:00:00` pinta exactamente la misma pantalla que una aplicación que nunca ha buscado. ¿Por qué es aceptable, y qué esconde?** ⭐

Porque `dailyForecast` es un `computed` que devuelve `[]` tanto para una respuesta null como para una respuesta en la que el filtro no encontró nada, y `@if (forecast().length > 0)` no puede distinguirlas — así que "aún no se ha buscado", "la previsión falló" y "la API respondió sin nada al mediodía" se colapsan todas en una región vacía debajo de la tarjeta. Acepté la confusión porque el caso alcanzable es benigno: la búsqueda de media tarde que da cuatro filas en vez de cinco se pinta igual, y una lista genuinamente vacía necesita que la API devuelva una `list` sin ningún hueco de mediodía. Lo que esconde es un estado real de éxito sin resultados, y el arreglo es que el hijo distinga "no se ha preguntado" de "se preguntó y está vacío" — un input que pueda ser `null` además de `[]`, exactamente como ya es el de `WeatherCard`, y que en el caso vacío pinte una línea en vez de nada.

**[02-weather-app-044] `errorMessage` es un `signal<string>('')` y la plantilla comprueba `@if (errorMessage())`. ¿Por qué "sin error" es el string vacío y no `null`, o un booleano más un mensaje?** ⭐

Elegí el string vacío porque hace que el signal sea a la vez el flag y el texto, así que hay una sola cosa que limpiar al principio de `onCitySearch` y una sola cosa que comprobar en la plantilla, y la comprobación de truthiness de Angular sobre un string hace el resto. El coste es que el estado descansa sobre un valor falsy en vez de sobre uno explícito: un error cuyo mensaje fuera legítimamente vacío se pintaría en silencio como "sin error", y nada en el tipo impide que alguien escriba `''` queriendo decir "limpiado" cuando quería decir "falló sin detalle". La versión que escala es un único signal `state` con una unión discriminada de `idle | loading | loaded | error`, que es adonde iría esta pantalla en cuanto apareciera un cuarto estado — ahora mismo tres signals repartidos en cuatro transiciones sigue siendo más barato de leer que la maquinaria.

## Decisiones técnicas

**[02-weather-app-045] Tienes `environment.ts` y `environment.development.ts`, intercambiados por una entrada `fileReplacements` en `angular.json` — y hoy los dos archivos guardan exactamente la misma key. ¿Por qué mantener dos?** ⭐⭐

Elegí mantener la separación porque es la costura que el CLI ya me da: `ng build` lee `environment.ts` y `ng serve` lo sustituye por `environment.development.ts`, así que el día en que los dos valores diverjan — una key de desarrollo limitada, una base URL distinta, un flag — no hay que cambiar nada del código. Hoy son idénticos porque una key gratuita de OpenWeatherMap es la única credencial que tiene la aplicación, y decidí que duplicar un valor salía más barato que quitar un mecanismo que tendría que reconstruir. El coste que acepto es que los dos archivos pueden desincronizarse en silencio, ya que ninguno está en el repositorio para poder compararlos.

**[02-weather-app-046] `set-env.js` es un script de Node normal que escribe `src/environments/environment.ts` a partir de `process.env.API_KEY`. ¿Por qué generar el archivo en vez de commitearlo?** ⭐⭐

Decidí que el deploy necesitaba el archivo y que el repositorio no debía tenerlo, y un generador es lo único que satisface las dos cosas: Netlify no tiene `src/environments/` tras un checkout limpio, así que el build ejecuta `set-env.js` primero y materializa el archivo a partir de la variable de entorno que guarda la plataforma. Eso mantiene la credencial en exactamente un sitio que gestiona una persona — la UI de Netlify — en vez de en el historial de git, donde una key rotada se sigue pudiendo leer para siempre. En local escribo los mismos dos archivos a mano, y el README lo documenta como paso de instalación.

**[02-weather-app-047] La key acaba en `environment.apiKey`, importada por `WeatherService`, compilada dentro del bundle. Entonces, ¿qué protegió realmente el archivo de entorno?** ⭐⭐⭐

Protegió el repositorio y el historial de git, y nada más — lo digo explícitamente en el README y en PLANNING.md, que dice "mantener la API key fuera del repositorio — no fuera del bundle". Al navegador se le puede sonsacar todo lo que envía a OpenWeatherMap, así que una aplicación solo de frontend no puede esconder una key por construcción; el único arreglo real es un backend o un proxy serverless que guarde la credencial y firme la petición. Elegí la key de tier gratuito más la separación de entornos porque un proxy quedaba fuera del alcance del proyecto 02, y nombraría ese tradeoff antes de que lo haga un entrevistador.

**[02-weather-app-048] `.gitignore` termina con `src/environments/*` — la carpeta entera, no el único archivo generado. ¿Por qué el comodín?** ⭐⭐

Elegí el comodín porque los dos archivos llevan el mismo secreto: `environment.development.ts` es el que escribo a mano en local y guarda la key real igual que el generado, así que ignorar solo `environment.ts` habría commiteado la credencial por la otra mitad del par. Ignorar la carpeta significa que la regla no se puede burlar añadiendo un tercer archivo de entorno más adelante. El precio es que la *forma* de la carpeta queda sin documentar en el repo, y por eso el README detalla los dos nombres de archivo y el contenido exacto que hay que crear.

**[02-weather-app-049] Si `API_KEY` no está definida cuando se ejecuta `set-env.js`, ¿qué contiene el archivo generado?** ⭐

Contiene el string literal `'undefined'`, porque el script interpola `process.env.API_KEY` dentro de un template literal sin ninguna comprobación, y el build entonces tiene éxito — el fallo aflora como un `401` de OpenWeatherMap, que mi callback de error le reporta al usuario como "City not found. Please try again". Decidí no poner una guarda cuando lo escribí, y mirándolo ahora el arreglo honesto son tres líneas: lanzar un error si falta la variable, para que un deploy mal configurado falle en tiempo de build y no como un mensaje de error equivocado en producción.

**[02-weather-app-050] `set-env.js` usa `require` y CommonJS en un proyecto que por lo demás es ESM y TypeScript. ¿Es un error?** ⭐

No — es deliberado, y la razón es cuándo se ejecuta: el script corre bajo Node a secas antes de que empiece el build de Angular, así que nunca se compila, nunca se comprueban sus tipos y nunca forma parte del bundle, y CommonJS es lo que Node ejecuta sin un campo `type` ni un paso de build propio. Elegí lo más pequeño que funciona en ese punto del pipeline antes que arrastrar `ts-node` a un proyecto que necesita un `fs.writeFileSync`.

**[02-weather-app-051] `baseUrl` es un campo `private readonly` de `WeatherService`, fijo a `https://api.openweathermap.org/data/2.5`, mientras que la key vive en el archivo de entorno. ¿Por qué uno es configurable y el otro no?** ⭐⭐

Los separé por lo que varía de verdad: la key cambia por desarrollador y por deploy y tiene que quedarse fuera de git, mientras que el host de la API es el mismo en todos los entornos de esta aplicación y es información pública. Meter la URL en el archivo de entorno habría añadido un segundo valor que mantener sincronizado en dos archivos no versionados, sin ningún beneficio. Si algún día necesitara un host de staging o un proxy delante de la API, ese campo es la única línea que se mueve a `environment`.

**[02-weather-app-052] `buildParams()` devuelve `new HttpParams().set('q', city)...` en vez de interpolar la ciudad dentro del string de la URL. ¿Qué te aporta eso?** ⭐⭐⭐

`HttpParams` codifica los valores por mí, lo cual importa en cuanto un usuario escribe una ciudad con un espacio o con un acento — "Santa Cruz de Tenerife" o "Málaga" producirían una URL mal formada por concatenación de strings y una correcta aquí. Lo elegí porque además mantiene la URL y sus parámetros como conceptos separados: el endpoint es `${baseUrl}/weather` y la query son datos, así que añadir `lang` es un `.set()` y nunca una edición de string. Es la misma razón por la que tampoco construiría nunca una query a mano en el servidor.

**[02-weather-app-053] `HttpParams` es inmutable — cada `.set()` devuelve una instancia nueva. ¿Importa eso en una cadena de tres?** ⭐

Para la corrección aquí no, porque encadeno las llamadas y uso el valor final, que es exactamente el patrón para el que está diseñada la API inmutable. Importaría si alguna vez escribiera `params.set(...)` en una línea suelta y esperara que `params` hubiera cambiado — un bug real y frecuente, porque la llamada parece una mutación y descarta el resultado en silencio. Decidí que la forma encadenada es además la honesta: hace visible en la forma del código el comportamiento de "cada llamada produce un objeto nuevo".

**[02-weather-app-054] Los dos métodos del servicio llaman al mismo `buildParams(city)` privado. ¿Por qué un helper para tres llamadas a `.set()`?** ⭐⭐

Porque los dos endpoints tienen que coincidir: `q`, `appid` y `units=metric` son iguales para `/weather` y para `/forecast`, y el modo de fallo de duplicarlos es el más difícil de ver — Celsius en la tarjeta y Kelvin en la previsión, por una línea que alguien olvidó cambiar en la segunda copia. Elegí `private` porque los parámetros son un detalle de implementación de este servicio y ningún llamante debería poder construir una petición a medio configurar. Además significa que un parámetro de query nuevo se añade una sola vez.

**[02-weather-app-055] `this.http.get<WeatherResponse>(...)` — ¿qué garantiza en realidad ese genérico sobre el JSON que recibes?** ⭐⭐⭐

Nada en tiempo de ejecución. Es una afirmación de tiempo de compilación: TypeScript se fía de mí en que la respuesta tiene esa forma, la plantilla obtiene autocompletado y errores de tipos, y el JavaScript emitido no contiene ninguna comprobación — si OpenWeatherMap renombrara `feels_like` mañana, el build seguiría pasando y la tarjeta pintaría `undefined`. Lo elegí porque es lo idiomático en Angular y el coste/beneficio correcto para un proyecto que consume una API pública estable; donde el payload importara de verdad validaría en la frontera con algo como Zod y derivaría el tipo del esquema en vez de escribirlo dos veces.

**[02-weather-app-056] `getWeather` devuelve el observable de `HttpClient` intacto — sin `map`, sin `catchError`, sin `retry`. ¿No es el manejo de errores trabajo del servicio?** ⭐⭐

Decidí que aquí el trabajo del servicio es describir los dos endpoints y nada más, y dejar que el llamante elija la política de fallo — lo cual importa porque `WeatherPage` combina las dos llamadas con `forkJoin` y necesita una decisión para el par, no dos independientes que un `catchError` dentro del servicio ya se habría tragado. La consecuencia es que todo consumidor tiene que manejar errores, y hoy hay exactamente uno. Si apareciera una segunda pantalla, lo primero que añadiría es un `catchError` que mapee el estado HTTP a un error de dominio tipado, para que la página deje de inferir "ciudad no encontrada" de cualquier fallo.

**[02-weather-app-057] Ninguno de los dos métodos del servicio declara tipo de retorno — los dos se infieren. ¿Por qué no anotar `Observable<WeatherResponse>`?** ⭐

La inferencia es exacta aquí, porque el genérico de `get<T>` la determina por completo, así que la anotación repetiría lo que ya dice la línea de arriba. Elegí la inferencia por brevedad, y cambiaría de opinión en una frontera que quisiera congelar: un tipo de retorno explícito convierte el contrato público de un servicio en un error de compilación al romperlo, en vez de en algo que se ensancha en silencio cuando cambia el cuerpo. En una librería compartida ese es el valor por defecto correcto; en un servicio de un solo consumidor dentro de un proyecto de portfolio es ceremonia.

**[02-weather-app-058] `WeatherResponse` tiene tres campos. El payload real de OpenWeatherMap tiene alrededor de veinte, con `coord`, `wind`, `sys`, `visibility`. ¿Por qué modelar tan poco?** ⭐⭐⭐

Elegí modelar solo lo que la pantalla consume, porque la interfaz es un contrato para *mi* código, no una transcripción de la respuesta del proveedor — los campos extra siguen llegando en el JSON y simplemente no están tipados, así que no se pierde nada en tiempo de ejecución. Mantiene el archivo de modelos legible y hace explícito el acoplamiento: lo que hay dentro es de lo que depende la aplicación, así que un cambio incompatible de la API se ve como un error de compilación en un archivo de veinte líneas. El coste es que añadir la velocidad del viento — que PLANNING.md listaba y yo descarté — obliga a editar la interfaz primero, lo cual me parece la fricción correcta.

**[02-weather-app-059] `WeatherMain` y `WeatherCondition` están extraídas y las reutilizan tanto `WeatherResponse` como `ForecastItem`. ¿Mereció la pena por dos interfaces más?** ⭐⭐

Sí, y por una razón que va más allá de evitar duplicación: los dos endpoints devuelven de verdad los mismos subobjetos, así que extraerlos registra un hecho sobre la API en vez de una coincidencia de mi código. La ganancia es concreta en los componentes — `getIconUrl(item.weather[0].icon)` funciona igual sobre una lectura actual y sobre un elemento de la previsión porque ambos son `WeatherCondition[]`, y el mismo `| number: '1.0-1'` formatea las dos temperaturas. Decidí compartir solo donde la API comparte de verdad; `dt_txt` se queda en `ForecastItem` porque solo la previsión lo tiene.

**[02-weather-app-060] `ForecastResponse` es `{ list: ForecastItem[] }` — descartaste `city`, `cnt` y `cod`. ¿Qué te costó?** ⭐

Me costó el nombre de la ciudad del endpoint de previsión, que no necesito porque `WeatherResponse.name` ya se lo da a la tarjeta, y `cnt`, que no necesito porque filtro la lista yo mismo. Decidí mantener el envoltorio en vez de tipar el método en línea para que la forma tenga un nombre que la página pueda importar. Si más adelante quisiera el desfase horario de la previsión para pintar horas locales en vez del `dt_txt` crudo, ahí es donde volvería a entrar el campo.

**[02-weather-app-061] Tus interfaces llevan `feels_like` y `dt_txt` — el snake_case de la API — directamente hasta las plantillas. ¿Por qué ninguna capa de mapeo a un modelo de dominio en camelCase?** ⭐⭐⭐

Decidí no poner capa de mapeo porque habría sido un segundo juego de interfaces y un operador `map` por endpoint solo para renombrar campos, en un proyecto donde la forma de la API *es* el dominio — aquí no hay ningún modelo de negocio al que el payload del proveedor le quede mal. El coste es real y lo nombraría: la nomenclatura del proveedor se filtra hasta `weather-card.html`, así que un renombrado aguas arriba toca plantillas, y mi código se lee de forma incoherente frente al camelCase de todo lo demás. En una aplicación con reglas de dominio reales mapearía en la frontera del servicio precisamente para que el resto del código nunca se entere de quién es el proveedor.

**[02-weather-app-062] La página y el servicio importan los modelos con `import type`, pero `WeatherForecast` importa `ForecastItem` sin él. ¿Deliberado?** ⭐

`import type` declara que el import existe solo para la comprobación de tipos, así que el compilador lo borra y nunca puede emitir un import en tiempo de ejecución de un archivo que no contiene más que interfaces — bajo transpilación aislada, archivo por archivo, esa distinción es lo que impide que un import fantasma sobreviva hasta el bundle. La incoherencia en `weather-forecast.ts` es un descuido y no una decisión; las interfaces se borran igual aquí, así que no se rompe nada, pero lo dejaría uniforme porque el marcador es documentación tanto como pista para el compilador.

**[02-weather-app-063] Todos los componentes de esta aplicación están dirigidos por signals y ninguno pone `ChangeDetectionStrategy.OnPush`. Explícalo.** ⭐⭐⭐

Es el valor por defecto del CLI que dejé tal cual, y en esta aplicación no cuesta nada medible: el árbol tiene cuatro componentes de profundidad, todos los inputs son signals, y los signals notifican a sus propios consumidores, así que lo que revisa un componente hecho solo de signals está acotado con independencia de la estrategia. Dicho eso, pondría `OnPush` en los tres componentes dumb como cuestión de disciplina — es una línea, es la forma que usa cualquier código Angular al que me incorporaría, y convierte "este componente solo se repinta cuando cambian los signals" de un accidente de cómo lo escribí en algo que la clase declara. La respuesta honesta no es que lo sopesara y lo descartara, es que no lo pensé.

**[02-weather-app-064] No hay `zone.js` por ninguna parte en `package.json` ni un `provideZonelessChangeDetection()` en `app.config.ts`. ¿Qué dirige entonces la detección de cambios?** ⭐⭐

La aplicación es zoneless — Angular 21 genera el proyecto sin `zone.js`, así que la detección de cambios la dirigen los propios signals y las notificaciones del framework, no un `setTimeout` parcheado. Esa es también la razón de que el patrón de `subscribe` hacia signals de `WeatherPage` sea seguro: las llamadas a `.set()` son las que programan la actualización, y si esto hubiera sido una aplicación con zone el mismo código habría funcionado por una razón completamente distinta. Decidí quedarme en el valor por defecto porque toda la capa de estado ya son signals, que es exactamente el caso para el que existe zoneless.

**[02-weather-app-065] PLANNING.md lista `SlicePipe` bajo "limitar la lista de previsión en la plantilla", y en el código recorta diez caracteres de un string de fecha. ¿Cuál de las dos es la decisión?** ⭐⭐

El código. Planeé pintar solo algunas de las entradas de la previsión con `slice` en la plantilla y acabé filtrando en un `computed()`, porque la regla que necesitaba de verdad — una entrada por día, la de las `12:00:00` — es un predicado y no un rango, y `SlicePipe` no puede expresarlo. El pipe sobrevivió con otra función, cortando `"2026-09-07 12:00:00"` hasta su mitad de fecha, así que la línea del plan está desfasada sobre *por qué* está el pipe ahí, más que equivocada sobre que se use.

**[02-weather-app-066] `routes` tiene una entrada, `path: ''`, y ningún comodín `**`. ¿Qué hace la aplicación si alguien abre `/settings`?** ⭐

No se pinta nada — el router no encuentra ninguna ruta, el outlet se queda vacío y el usuario recibe una página en blanco sin ningún error sobre el que pueda actuar. Decidí que una ruta 404 no merecía la pena en una aplicación de una sola pantalla, y diría que es la decisión equivocada en cualquier cosa con navegación real: un `{ path: '**', redirectTo: '' }` es una línea y convierte una página que parece rota en una redirección. Es además la entrada que deja de ser opcional en cuanto existen deep links, ya que Netlify sirve `index.html` para cualquier ruta y le devuelve la decisión de enrutado directamente a Angular.

**[02-weather-app-067] `angular.json` sigue llevando los presupuestos por defecto del CLI de 500 kB / 1 MB y `outputHashing: "all"`. ¿Los ajustaste?** ⭐

No, y comprobé que no hacía falta: la aplicación son cuatro componentes, un servicio y ninguna librería de UI, así que no se acerca ni de lejos al umbral de aviso, y un presupuesto que nunca salta es un presupuesto haciendo su trabajo. Decidí dejar `outputHashing` en paz por la misma razón — Netlify sirve los nombres de archivo con hash con cabeceras de caché largas y un rebuild los invalida por nombre, que es exactamente lo que quiero en un deploy estático. Ajustar cualquiera de las dos cosas antes de tener un problema de tamaño de bundle sería configurar para un proyecto que no tengo.

**[02-weather-app-068] OpenWeatherMap tiene un endpoint One Call que devuelve las condiciones actuales y la previsión en una sola respuesta. Tú llamas a `/weather` y a `/forecast` por separado y los unes en la página. ¿Por qué dos peticiones?** ⭐⭐

Elegí los dos endpoints de `/data/2.5` porque son los que me da el tier gratuito: One Call 3.0 es una suscripción aparte que quiere una tarjeta registrada, y esto es un proyecto de portfolio desplegado en un sitio gratuito de Netlify. El coste es el que la página tiene que pagar después — dos viajes de ida y vuelta, un `forkJoin` para esperar a los dos, y una regla de fallo de todo o nada que no habría necesitado con una sola llamada. Si algún día se mejorara la key, sustituir los dos métodos del servicio por un `getOneCall()` borraría el `forkJoin` y casi todo `onCitySearch`, lo cual es buena señal de que la separación es la forma de la API y no la mía.

**[02-weather-app-069] `getWeather` y `getForecast` devuelven un observable frío de `HttpClient` cada vez, así que buscar "Madrid" dos veces lanza cuatro peticiones. ¿Por qué ninguna caché?** ⭐⭐

Decidí que los datos del tiempo son lo menos indicado para cachear sin una política de expiración: la lectura solo es útil porque es actual, así que un `shareReplay(1)` sobre una caché por ciudad serviría una temperatura vieja y parecería un bug. La versión honesta es un pequeño `Map<string, {data, timestamp}>` en el servicio con un time-to-live de unos minutos, que es lo que añadiría en cuanto hubiera un rate limit que respetar — el tier gratuito permite sesenta llamadas por minuto y un usuario tecleando nombres de ciudad nunca se acerca. Elegí en su lugar dejar el servicio sin estado, que es también por lo que puede seguir siendo `providedIn: 'root'` sin nada que invalidar.

**[02-weather-app-070] `tsconfig.json` corre con `strict: true`, `strictTemplates` y `noPropertyAccessFromIndexSignature`. ¿Qué te aportan de verdad en una aplicación de este tamaño?** ⭐

`strictTemplates` es el que se gana su sitio aquí: comprueba los tipos de los bindings, así que pasar un `WeatherResponse | null` a un input declarado como no nulable es un error de compilación en la plantilla en vez de un `undefined` en el navegador — es la razón de que `weather-card.html` tenga que decir `weather()!` en lugar de pintar nada en silencio. `strict` en sí es lo que hace que el null de `signal<WeatherResponse | null>(null)` signifique algo en vez de ser decoración. Elegí dejar los valores por defecto del CLI activados porque el coste de encender la estrictez más tarde, una vez que un código ha crecido alrededor de su ausencia, es la refactorización que nadie presupuesta.

**[02-weather-app-071] La aplicación usa la `PathLocationStrategy` por defecto del router — URLs reales, sin `#`. En un host estático como Netlify, ¿a qué te obliga esa decisión a configurar?** ⭐⭐

Obliga a una regla de reescritura en el host: con URLs basadas en ruta el navegador le pide a Netlify `/loquesea` al recargar o al abrir un deep link, y un servidor estático no tiene ese archivo, así que necesita una redirección `/* /index.html 200` que le devuelva la ruta a Angular. Elegí el valor por defecto en vez de `withHashLocation()` porque las URLs limpias son lo que envía una aplicación real y el coste de hosting es una línea de configuración, no un tradeoff. Hoy la aplicación tiene una sola ruta así que nada lo ejercita, pero es exactamente el montaje que falla en silencio en producción y solo en producción, y por eso prefiero nombrarlo antes que descubrirlo.
