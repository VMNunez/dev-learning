# Preguntas de entrevista — 07-timetrack

**Último banco — backend:** 2026-09-26
**Último banco — frontend:** 2026-09-26
**Último banco — transversal:** 2026-09-26

Preguntas específicas de las decisiones de implementación tomadas en este proyecto.
Úsalas junto a los archivos por tema en `interview-prep/{LEVEL}/es/`.

## Arquitectura y patrones

### Backend

**[07-timetrack-001] ¿Por qué usaste Spring Boot para servir una API JSON en vez de generar las páginas HTML desde el servidor con MVC?** ⭐⭐⭐

Elegí que Spring Boot sirviera JSON sin generar las páginas HTML. Así, el backend se ocupa de las peticiones HTTP y de la lógica de negocio, pero no de construir las vistas.

**[07-timetrack-002] Al crear un proyecto, ¿por qué `ProjectController` construye la respuesta `Location`, mientras `ProjectService.create` se encarga de normalizar, detectar duplicados y guardar?** ⭐⭐

Elegí dejar la construcción de la respuesta HTTP en `ProjectController`: llama al servicio, construye la URI del recurso y devuelve `201 Created`. Decidí que recortar espacios, detectar duplicados sin distinguir mayúsculas y guardar pertenecen a `ProjectService`, para que una decisión de negocio no dependa de un controlador HTTP.

**[07-timetrack-003] ¿Por qué los métodos de escritura de `TimeEntryService` llevan `@Transactional` y las lecturas como `findByFilter` usan `readOnly = true`?** ⭐⭐

Situé el límite de la transacción en el método del servicio porque el cambio de estado y la construcción de la respuesta forman una unidad de trabajo. Marqué como solo lectura métodos como `findByFilter` y `ProjectService.getAll`; las operaciones de escritura sí pueden modificar entidades y persistir los cambios.

**[07-timetrack-004] ¿Por qué los controladores devuelven `201 Created` con una cabecera `Location` al crear, y `204 No Content` al eliminar?** ⭐⭐

Elegí `201` al crear porque `ProjectController`, `UserController` y `TimeEntryController` construyen la URI del recurso nuevo a partir del ID de la respuesta. Después de que el servicio elimina el recurso, los endpoints devuelven `204` porque no hay cuerpo que enviar.

**[07-timetrack-005] ¿Cómo impide `TimeEntryService.findByFilter` que un empleado consulte entradas ajenas sin quitar al manager la posibilidad de filtrar por usuario?** ⭐⭐⭐

Decidí que el servicio compruebe el rol del solicitante y sustituya el `userId` recibido por el ID del usuario autenticado cuando no sea manager. Los managers conservan el filtro solicitado; después, el servicio pasa esos criterios a `TimeEntrySpecifications` y transforma la página en respuestas.

**[07-timetrack-006] ¿Por qué los servicios obtienen al usuario actual mediante `AuthenticatedUserProvider` en vez de recibir un ID de usuario desde cada petición al controlador?** ⭐⭐

Elegí `AuthenticatedUserProvider` para leer el email autenticado del `SecurityContext` de Spring Security y cargar el `User` desde `UserRepository`. Así, servicios como `TimeEntryService` derivan la identidad de la autenticación establecida en lugar de confiar en un ID proporcionado por el cliente.

**[07-timetrack-007] ¿Por qué los servicios devuelven DTOs de respuesta en lugar de exponer entidades JPA desde los controladores?** ⭐⭐⭐

Elegí tipos de respuesta explícitos como `TimeEntryResponse` en `TimeEntryService.toResponse` y `ProjectResponse` en `ProjectService.toResponse`. Esto me permite decidir qué campos expone la API sin convertir las entidades de persistencia en el contrato JSON.

**[07-timetrack-008] En `TimeEntryController`, ¿por qué traduces la clave de ordenación mediante `SORT_KEYS` y añades `id` para desempatar antes de pasar el `Pageable` al servicio?** ⭐

Elegí claves conocidas como `employee` y `project` y las traduzco a rutas de entidad permitidas; una clave desconocida provoca `BusinessRuleViolationException` en vez de convertirse en una ruta arbitraria. Si la petición no ordena por ID, añado `id` descendente para que los valores iguales tengan un orden estable entre páginas.

**[07-timetrack-009] ¿Por qué `submit`, `reopen`, `approve` y `reject` tienen operaciones de servicio y rutas propias en lugar de permitir cualquier estado en una actualización genérica?** ⭐⭐⭐

Elegí métodos explícitos en `TimeEntryService`; cada uno comprueba el estado actual antes de cambiarlo: por ejemplo, `submit` solo acepta `DRAFT` y `approve` solo `SUBMITTED`. El controlador también expone rutas `PATCH` distintas con anotaciones de rol, de modo que la edición ordinaria no permite asignar un estado arbitrario.

**[07-timetrack-010] ¿Por qué `ProjectService.getAll` muestra solo proyectos activos a los empleados y todos los proyectos a los managers?** ⭐⭐

Elegí poner esa selección según el rol en el servicio: los managers usan `findAll` y los demás usuarios autenticados usan `findByActiveTrue`. El controlador se ocupa del endpoint HTTP y devuelve la lista de `ProjectResponse` preparada por el servicio.

**[07-timetrack-012] ¿Cuándo convierte `TimeEntryService` las relaciones lazy de usuario y proyecto en un `TimeEntryResponse`, y por qué haces ese mapeo ahí?** ⭐⭐

Elegí construir la respuesta en `toResponse`, leyendo los IDs y nombres de usuario y proyecto mientras la transacción del servicio sigue activa. Uso el mismo mapper después de las escrituras y al devolver la página filtrada; así, la API ofrece un DTO estable sin que los controladores dependan de las relaciones JPA.

**[07-timetrack-013] ¿Por qué separaste `CreateProjectRequest` y `UpdateProjectRequest`, y qué permite expresar el campo nullable `active` en `ProjectService.update`?** ⭐⭐

Separé `CreateProjectRequest` y `UpdateProjectRequest` porque crear y actualizar expresan intenciones distintas en la API. `ProjectService.update` solo cambia `active` cuando el campo del DTO no es null; si se omite, conserva su valor actual. La petición de creación no incluye ese campo de actualización.

**[07-timetrack-014] En `TimeEntryService.delete`, ¿por qué pasas a `delete` la entrada ya cargada en vez de llamar a `deleteById`?** ⭐

Elegí cargar la entrada mediante `findOwnedEntry`, que comprueba la propiedad y produce la respuesta de no encontrado, y después pasar esa misma entidad a `timeEntryRepository.delete`. Con `deleteById` habría otra búsqueda y podría aparecer un comportamiento distinto si falta la fila.

**[07-timetrack-015] ¿Por qué los controladores y servicios del backend reciben sus colaboradores por constructor y los guardan en campos `final`?** ⭐⭐

Usé inyección por constructor en todo el backend: `ProjectService` recibe sus repositorios y `TimeEntryController`, su servicio. Asigné las dependencias obligatorias a campos `final`, de modo que el bean se crea con todas ellas establecidas.

**[07-timetrack-016] ¿Por qué `ProjectService` y `UserService` usan `saveAndFlush` y convierten un fallo de unicidad de la base de datos en `DuplicateResourceException` si antes ya comprueban los duplicados?** ⭐⭐

Mantuve la comprobación previa para dar un mensaje claro sobre un duplicado normalizado o independiente de mayúsculas, pero la restricción única de la base de datos sigue siendo la garantía atómica si dos peticiones compiten. Elegí `saveAndFlush` dentro del bloque `try` para que `DataIntegrityViolationException` aparezca mientras el servicio aún puede traducirla a la misma excepción de dominio.

**[07-timetrack-017] ¿Por qué los servicios usan excepciones de la aplicación, como `ResourceNotFoundException` e `InvalidStateTransitionException`, cuando falla una regla de negocio?** ⭐⭐

Elegí excepciones propias para las decisiones del servicio: `findOwnedEntry` lanza `ResourceNotFoundException` y una transición inválida lanza `InvalidStateTransitionException`. Cuando hace falta, traduzco un fallo de base de datos en el límite de persistencia, sin presentar un rechazo de negocio como un error de acceso a datos de Spring.

**[07-timetrack-018] ¿Por qué `ReportController` recibe un `YearMonth` y `ReportService` lo convierte en límites inclusivos de `LocalDate`?** ⭐

Mantuve el parámetro HTTP como un mes fácil de leer y calculé el rango de consulta en `ReportService.MonthRange.of`. El servicio pasa al repositorio el primer y el último día del mes; así, el controlador no tiene que calcular ese rango.

### Frontend

**[07-timetrack-059] ¿Por qué el shell autenticado es padre de las rutas hijas y las páginas se cargan con `loadComponent`?** ⭐⭐⭐

Elegí el shell como ruta padre para que su navegación y su layout envuelvan una sola vez las páginas autenticadas, mientras el `RouterOutlet` hijo cambia el contenido. Cada página usa `loadComponent`, así que su interfaz se carga al visitar la ruta en vez de formar parte del bundle inicial de la aplicación.

**[07-timetrack-060] ¿Por qué separaste la infraestructura global, los coordinadores de página y la interfaz reutilizable en `core`, `pages` y `shared`?** ⭐⭐

Elegí `core` para los servicios, el estado y la infraestructura de rutas de toda la aplicación; `pages` para los coordinadores de cada pantalla; y `shared` para la interfaz y los modelos reutilizables. Así, el comportamiento propio de una pantalla no acaba en componentes compartidos, y el shell y las páginas tienen un lugar común para la infraestructura que comparten.

**[07-timetrack-061] ¿Por qué `Entries` es responsable del estado de servidor de la lista mientras `EntryList` recibe datos y emite las acciones del usuario?** ⭐⭐⭐

Elegí `Entries` como coordinador de la carga, los filtros, la paginación, los diálogos y las escrituras. `EntryList` recibe las entradas actuales y las opciones de presentación mediante inputs, y comunica las acciones mediante outputs. Así, otra pantalla puede reutilizar la tabla sin que esta haga llamadas a la API ni duplique las transiciones de estado de la página.

**[07-timetrack-062] ¿Por qué el contador de aprobaciones pendientes vive en `core/state/PendingApprovals` y no en el servicio HTTP o en el shell?** ⭐⭐⭐

Elegí un servicio de estado proporcionado en la raíz porque tanto el badge del shell como las pantallas de manager necesitan el mismo contador actualizado, mientras que `EntryService` debe limitarse a las peticiones HTTP. El servicio de estado expone una signal de solo lectura y se ocupa de actualizar y limpiar el valor; así, ambos consumidores lo comparten sin convertir el shell en su propietario.

**[07-timetrack-063] ¿Por qué el shell actualiza el contador de pendientes del manager después de navegar y lo limpia al destruirse?** ⭐⭐

Elegí `NavigationEnd` como momento de actualización para reflejar las acciones realizadas en una pantalla cuando el manager navega a otra; además, omito la petición para los empleados. Al destruirse el shell, borro el contador de la sesión anterior al salir del área autenticada.

**[07-timetrack-064] ¿Por qué los streams que recargan una página usan `switchMap` cuando un filtro, un cambio de orden o una escritura inicia otra petición?** ⭐⭐

Elegí un `Subject` como disparador de recarga y `switchMap` para ejecutar la petición de página más reciente. Si llega un filtro nuevo o se pide otra recarga antes de recibir la respuesta anterior, se cancela esa suscripción para que un resultado antiguo no sobrescriba el estado de la selección actual.

**[07-timetrack-065] ¿Por qué las páginas usan `forkJoin` para cargar datos relacionados, como proyectos y entradas, antes de actualizar la vista?** ⭐⭐

Elegí `forkJoin` para estas peticiones HTTP finitas porque la página necesita recibir los resultados relacionados antes de mostrar una vista completa. Por ejemplo, `Entries` espera tanto las opciones de proyecto como la página de entradas y luego actualiza las dos signals juntas, sin mostrar datos que no correspondan entre sí.

**[07-timetrack-066] ¿Por qué los diálogos de entrada se ocupan del formulario y de guardar, mientras `Entries` decide qué volver a cargar al cerrarse el diálogo?** ⭐⭐

Elegí que el diálogo se encargue del formulario, la validación y la petición de creación o actualización, y devuelva un resultado como `saved` o `submitted`. La página sigue siendo responsable de la lista y la recarga al cerrarse el diálogo; así, el flujo del formulario queda separado de los filtros y la paginación del coordinador.

**[07-timetrack-067] ¿Por qué la confirmación de cambios sin guardar se comparte mediante `ConfirmDialog` y `confirmDiscard` en vez de repetirse en cada diálogo de formulario?** ⭐⭐

Elegí un `ConfirmDialog` basado en datos y la función auxiliar `confirmDiscard` para que los diálogos de entrada, rechazo y contraseña compartan el mismo flujo de descarte. La función también restaura los controles que no estaban marcados como tocados si la interacción de confirmación los marca, y así conserva el estado de validación anterior cuando el usuario decide seguir editando.

**[07-timetrack-068] ¿Por qué `Entries` y `Approvals` ajustan el índice de página si una acción deja vacía la página actual?** ⭐

Elegí usar el total devuelto para pedir la última página que aún puede contener filas después de eliminar o revisar una entrada. El índice solo retrocede y se detiene en la página cero, lo que evita que un total y un fragmento de página obsoletos provoquen intentos repetidos e interminables de cargar esa misma página vacía.

**[07-timetrack-069] ¿Por qué la aplicación usa `AppTitleStrategy` para combinar el título de cada ruta con `TimeTrack`?** ⭐

Elegí la `TitleStrategy` de Angular para que el título de la ruta determine el nombre de la página actual y una estrategia compartida le añada el nombre de la aplicación. Así, los títulos de las pestañas del navegador son coherentes sin repetir código para actualizarlos en cada componente.

**[07-timetrack-070] ¿Por qué `appConfig` establece un ancho predeterminado para los diálogos y permite que cada diálogo elija otro?** ⭐

Elegí `MAT_DIALOG_DEFAULT_OPTIONS` para dar a los diálogos un ancho predeterminado coherente de `30rem`; si alguno necesita otra medida, puede sobrescribirla en su propia configuración de apertura. Así, los diálogos habituales mantienen el mismo aspecto sin que el valor global se convierta en una restricción rígida.

**[07-timetrack-071] ¿Por qué las clases de `core/services` se limitan a las llamadas HTTP y al mapeo de modelos, y dejan el estado de página y los efectos de interfaz a sus consumidores?** ⭐⭐

Elegí que `EntryService` se centre en peticiones y respuestas tipadas, mientras `Entries` mantiene sus filtros, el estado de carga, los diálogos y las notificaciones. Así, otra página puede usar el mismo servicio sin heredar comportamiento de navegación o presentación. `AuthService` es la excepción prevista porque la sesión dura más que una ruta.

**[07-timetrack-072] ¿Por qué cada página consulta por su cuenta un endpoint compartido en vez de usar una caché común entre páginas?** ⭐⭐

Elegí hacer lecturas independientes porque las páginas suelen necesitar partes distintas del mismo recurso: el dashboard del empleado pide contadores y entradas recientes, mientras que `Entries` solicita la página y los filtros actuales. Así, cada pantalla vuelve a cargar sus propios datos después de una escritura sin tener que mantener sincronizada una caché entre rutas.

**[07-timetrack-073] ¿Por qué los providers y valores predeterminados de toda la aplicación se registran en `appConfig` en vez de configurarse en cada página?** ⭐

Elegí `appConfig` como único lugar para configurar el router, `HttpClient` con el auth interceptor, la estrategia de títulos y los valores comunes de Material. Así, todas las rutas comparten la misma infraestructura, y un diálogo aún puede sobrescribir el ancho general si su contenido lo requiere.

### Transversal

**[07-timetrack-105] ¿Cómo cruza la petición de `ProjectService.createProject` el límite JSON, desde `CreateProjectRequest` de Angular hasta el DTO de Spring, y qué garantiza realmente `http.post<Project>(...)` sobre la respuesta?** ⭐⭐⭐

Elegí mantener alineados los tipos de petición y respuesta de Angular y los DTO de Spring. `ProjectService.createProject` envía `CreateProjectRequest` a `POST /api/projects`; `ProjectController.create` recibe el JSON, lo valida con `@Valid`, delega en `ProjectService` y devuelve `ProjectResponse`. Como las dos aplicaciones se compilan por separado, sus tipos no garantizan por sí solos que las estructuras JSON sigan coincidiendo; por eso, decidí confiar en la validación de la petición del backend y tratar `http.post<Project>(...)` como una aserción de TypeScript. En este flujo, `ProjectResponse.createdAt` llega a Angular como `Project.createdAt: string`, y `description` admite null en ambos lados.

## Seguridad y autenticación

### Backend

**[07-timetrack-019] ¿Por qué hiciste la API stateless con JWT bearer y desactivaste CSRF en lugar de usar sesiones en el servidor?** ⭐⭐⭐

Elegí autenticación stateless porque Angular envía el JWT en la cabecera `Authorization` y la API no mantiene sesiones en el servidor. Como el navegador no adjunta automáticamente una cookie con las credenciales, consideré innecesaria la protección CSRF. El trade-off es que cerrar sesión no revoca un token ya emitido: sigue siendo válido hasta que expire a los 60 minutos.

**[07-timetrack-020] ¿Por qué el JWT identifica al usuario mediante el ID de la base de datos en vez del email, que puede cambiar?** ⭐⭐⭐

Elegí el ID estable como claim `sub` porque un manager puede cambiar el email mientras el token de acceso sigue vigente. `JwtFilter` interpreta ese claim como un `Long` y vuelve a cargar la cuenta por ID; así, cambiar un email no transfiere un token existente a otra cuenta y los tokens cuyo subject tenía el antiguo formato de email se rechazan.

**[07-timetrack-021] ¿Qué ocurre desde que `JwtFilter` lee un bearer token hasta que Spring Security autoriza una petición protegida?** ⭐⭐⭐

Valido la firma del token, extraigo el ID, cargo el `UserDetails` actual desde la base de datos y guardo la autenticación con sus autoridades en `SecurityContextHolder`. Si falta el bearer token o no es válido, no se establece la autenticación y la filter chain responde con `401` a la petición protegida mediante el authentication entry point.

**[07-timetrack-022] ¿Por qué `JwtFilter` vuelve a cargar al usuario y comprueba el estado de la cuenta en cada petición en lugar de confiar en los claims hasta que expire el token?** ⭐⭐⭐

Elegí resolver la cuenta por el ID del token en cada petición y ejecutar `AccountStatusUserDetailsChecker` antes de establecer el security context. Desactivar a un usuario le corta el acceso en la siguiente petición aunque su token firmado siga dentro de sus 60 minutos de validez; `UserDetailsServiceImpl` también lee el rol actual de esa fila, así que un cambio de rol surte efecto en la siguiente petición en vez de confiar en un claim obsoleto.

**[07-timetrack-023] ¿Por qué las reglas de la filter chain solo permiten públicamente la URL de login y dejan los roles de cada endpoint a method security?** ⭐⭐⭐

Elegí un perímetro limitado en `SecurityConfig`: solo `POST /api/auth/login` es público y toda otra petición debe estar autenticada. Con `@EnableMethodSecurity`, cada método protegido declara su propia regla `@PreAuthorize`, incluido `isAuthenticated()` cuando puede actuar cualquier usuario autenticado; ampliar un matcher de URL no abre por accidente un método cuya regla de autorización sigue intacta.

**[07-timetrack-024] ¿Por qué normalizas el email antes de autenticar en el login, y cómo convierte `UserDetailsServiceImpl` la cuenta cargada en autoridades de Spring Security?** ⭐⭐

Elegí normalizar el email enviado antes de pasarlo a `AuthenticationManager`, y el servicio de detalles de usuario aplica la misma normalización al buscar el login. Construye `UserDetails` con el hash de la contraseña, el rol de la cuenta como autoridad `ROLE_` y su estado activo, de modo que la autenticación usa una representación coherente de identidad y rol.

**[07-timetrack-025] ¿Por qué `SecurityConfig` expone un `BCryptPasswordEncoder` como bean `PasswordEncoder`?** ⭐⭐⭐

Elegí el encoder BCrypt de Spring Security como estrategia de contraseñas de la aplicación, para que la autenticación compare la contraseña recibida con un hash unidireccional almacenado y no necesite texto plano. El mismo encoder se puede inyectar donde se crean o verifican contraseñas de cuenta.

**[07-timetrack-026] ¿Por qué limitas los intentos fallidos de login tanto por email normalizado como por la dirección que devuelve `HttpServletRequest.getRemoteAddr()`, y por qué el bloqueo es temporal?** ⭐⭐

Uso contadores separados para el email normalizado y la dirección que devuelve `HttpServletRequest.getRemoteAddr()`. Los compruebo antes de autenticar: cinco fallos bloquean cualquiera de las dos claves hasta un minuto después del último intento fallido, y un login correcto limpia ambas. Así cubro tanto los intentos repartidos entre cuentas como los intentos repetidos contra una sola. El bloqueo temporal impide que un atacante deje al usuario real sin acceso de forma permanente. `LoginAttemptService` guarda los contadores en un mapa concurrente dentro del proceso, un trade-off que acepté para un despliegue de una sola instancia.

**[07-timetrack-027] ¿Por qué la filter chain de seguridad devuelve un JSON `401` con el formato del proyecto mediante `JwtAuthenticationEntryPoint`?** ⭐⭐

Elegí un entry point específico que escribe el formato común `ErrorResponse`, con estado `401` y mensaje `Authentication required`. Así, una petición no autenticada recibe el mismo contrato JSON que maneja el cliente Angular, en lugar de una respuesta generada por el contenedor.

**[07-timetrack-028] ¿Por qué `SecurityConfig` define orígenes, métodos y cabeceras CORS explícitos, con las credenciales desactivadas?** ⭐

Elegí inyectar `app.cors.allowed-origins` como `List<String>` y permitir solo los métodos de la API y las cabeceras `Authorization` y `Content-Type` que necesita el cliente. Desactivé las credenciales porque el bearer token viaja en una cabecera explícita, no en una cookie gestionada por el navegador. Incluí `OPTIONS` para las peticiones preflight, que responde el filtro CORS antes de la regla que exige autenticación.

**[07-timetrack-029] ¿Por qué proporcionas el secreto de firma JWT mediante `JWT_SECRET` en vez de guardarlo en la configuración de la aplicación?** ⭐⭐⭐

Elegí resolver `app.jwt.secret` desde la variable de entorno `JWT_SECRET` para mantener la clave de firma fuera de las properties versionadas. `JwtUtil` decodifica el valor Base64 y construye la clave HMAC usada tanto para emitir como para verificar tokens; el despliegue debe proporcionar un secreto codificado correctamente.

**[07-timetrack-030] ¿Cuándo detecta `JwtUtil` que `JWT_SECRET` tiene un formato incorrecto o es demasiado corto, y por qué importa ese momento en un despliegue?** ⭐

Guardo el secreto configurado como string en el constructor y construyo la clave HMAC cuando se llama por primera vez a `getSigningKey()`, al emitir o analizar un token. Por eso, un valor presente pero mal formado o demasiado corto permite crear el bean y falla en la primera petición de login o con bearer token. El backlog del backend recoge mover esa validación al arranque para que un despliegue incorrecto falle antes de aceptar tráfico.

### Frontend

**[07-timetrack-074] ¿Por qué `AuthService` trata como `unknown` la respuesta del login y la sesión guardada en el navegador hasta que `isAuthResponse` las valida?** ⭐⭐

Elegí `http.post<unknown>` porque el tipo genérico de una petición HTTP solo afirma cuál debería ser la forma de los datos; no valida el JSON que devolvió el servidor. El mismo guard de ejecución comprueba la respuesta antes de guardarla y revisa los datos de `localStorage` al iniciar; si la sesión no se puede leer, la elimina en vez de tratar los datos mal formados como una autenticación válida.

**[07-timetrack-075] ¿Por qué `AuthService` guarda la sesión en `localStorage` y qué trade-off de seguridad implica?** ⭐⭐⭐

Elegí `localStorage` para que, al recargar la página, se pueda recuperar la sesión sin pedirle al usuario que vuelva a iniciar sesión. Un script que se ejecute en la página puede leer el token, así que esta decisión no protege frente a XSS; el proyecto limita los tokens emitidos a 60 minutos y no tiene un flujo de refresh token.

**[07-timetrack-076] ¿Por qué `authGuard` y `noAuthGuard` son distintos, y a qué destino envía cada uno cuando la sesión no está en el estado esperado?** ⭐⭐

Elegí `authGuard` para la navegación protegida: devuelve un `UrlTree` hacia `/login` cuando no hay una sesión validada. `noAuthGuard` hace lo contrario en `/login` y devuelve un `UrlTree` hacia `/dashboard` si ya hay sesión. Así, los dos dejan que el router gestione la redirección en vez de iniciar una navegación como efecto secundario.

**[07-timetrack-077] ¿Por qué `managerGuard` comprueba el rol por separado del `authGuard` padre, y dónde está el verdadero límite de seguridad de la API?** ⭐⭐

Elegí `managerGuard` para impedir que un empleado entre en pantallas exclusivas de managers y devolverlo a `/dashboard`, mientras que `authGuard` padre se ocupa de las sesiones ausentes. Cada guard tiene una tarea distinta, pero ninguno protege la API: una persona puede saltarse la interfaz Angular, por lo que la autorización del backend debe rechazar las peticiones exclusivas de managers.

**[07-timetrack-078] ¿Por qué `authInterceptor` clona la petición y añade el bearer token de la sesión actual, pero la deja intacta si no hay token?** ⭐⭐⭐

Elegí añadir la cabecera `Authorization: Bearer` en un interceptor para no repetir esa lógica en cada llamada. Solo clona la petición si hay un token de sesión; si no, reenvía la original sin cambios, lo que permite que la petición pública de login se procese sin credenciales.

**[07-timetrack-079] ¿Por qué el interceptor caduca la sesión solo si una respuesta `401` corresponde a una petición que llevaba token?** ⭐⭐⭐

Elegí guardar el token antes de enviar la petición y condicionar a ese valor el tratamiento del `401`: si la petición llevaba token, se borra la sesión y se navega a `/login`. El `401` del login no lleva token, así que sigue siendo un error de credenciales para ese flujo y no se confunde con una sesión caducada.

**[07-timetrack-080] ¿Por qué `AuthService` distingue entre cerrar sesión explícitamente y una sesión caducada o ilegible mediante un flag de caducidad de un solo uso?** ⭐⭐

Elegí que `logout()` borre el almacenamiento del navegador, el estado de sesión y cualquier aviso de caducidad anterior; `expireSession()` limpia esos mismos datos y registra que la sesión terminó inesperadamente. `consumeSessionExpired()` lee y reinicia el flag para que la página de login muestre el aviso una sola vez. Al iniciar, también se activa si la sesión guardada no se puede analizar o validar.

**[07-timetrack-081] ¿Por qué `/team` usa `oneTimeSecretGuard` como guard `CanDeactivate`, y por qué permite navegar cuando la sesión ha terminado?** ⭐⭐

Elegí el contrato de componente `HoldsOneTimeSecret` para que el guard impida salir mientras haya una contraseña generada en un diálogo o una petición de creación/reset en curso, protegiendo la única respuesta que contiene ese secreto. Permite navegar cuando `AuthService.session()` pasa a ser null, para que una redirección por sesión caducada nunca quede bloqueada por la regla que conserva el secreto.

**[07-timetrack-083] ¿Cómo elige `roleMatch` el componente de dashboard de `/dashboard` según el rol del usuario autenticado?** ⭐⭐

Elegí guards `CanMatchFn` en dos rutas con la misma dirección para que Angular cargue el dashboard de empleado o de manager sin incluir nombres de rol en la URL. Si una ruta no coincide con el rol de `AuthService`, el router prueba la otra. Las pantallas exclusivas de managers usan `managerGuard` por separado.

### Transversal

**[07-timetrack-106] Desde `POST /api/auth/login` hasta una petición posterior a la API, ¿por qué la sesión del navegador guarda un rol mientras que el JWT solo contiene el ID del usuario, y cómo termina la sesión al caducar el token?** ⭐⭐⭐

Elegí devolver el token, el ID, el nombre y el rol en `AuthResponse`. Angular valida la respuesta y guarda la sesión en `localStorage`; después usa el rol en el shell y los guards de rutas, mientras el interceptor envía el token como bearer. `JwtUtil` firma el ID de la base de datos como `sub` y fija una caducidad de 60 minutos. El rol guardado orienta la interfaz, pero no concede permisos en la API: en cada petición bearer, `JwtFilter` vuelve a cargar la cuenta, comprueba si sigue activa y obtiene las autoridades del rol actual en la base de datos. Así, cambiar solo el rol guardado no concede acceso de manager y los cambios de la cuenta surten efecto en la siguiente petición; cuando caduca el token, la API responde con `401` y el interceptor borra la sesión y redirige a `/login`.

## Reglas de negocio

### Backend

**[07-timetrack-031] ¿Por qué un empleado recibe el mismo `404` al consultar una entrada ajena que al pedir un ID inexistente?** ⭐⭐⭐

Elegí que `TimeEntryService.findOwnedEntry` cargue la entrada por ID y luego la filtre por el ID del usuario autenticado antes de devolverla. Tanto una fila inexistente como una entrada de otro empleado provocan `ResourceNotFoundException`, de modo que el estado y el mensaje no revelan qué IDs existen.

**[07-timetrack-032] ¿Por qué `TimeEntryService.resolveProject` oculta un proyecto inactivo al crear o en la mayoría de las ediciones, pero devuelve `400` cuando un empleado conserva ese mismo proyecto en su propia entrada?** ⭐⭐⭐

Elegí devolver el mismo `404` que ante un ID desconocido cuando el solicitante todavía no tiene derecho a saber que existe el proyecto archivado. Al actualizar, el servicio compara el ID solicitado con el proyecto que ya tiene la entrada; para ese proyecto conocido devuelve `400` con “Project is not active”, explicando por qué no puede continuar la edición sin exponer otros IDs archivados.

**[07-timetrack-033] ¿Por qué `UserService.update` impide ascender a alguien con entradas `DRAFT` o `REJECTED`, pero permite el ascenso si sus entradas están `SUBMITTED`?** ⭐⭐

Elegí bloquear el ascenso solo si `existsByUserIdAndStatusIn` encuentra trabajo `DRAFT` o `REJECTED`, porque tras el ascenso dejarían de estar disponibles las rutas de actualización, eliminación y reapertura reservadas al empleado. Otra persona con rol manager puede revisar una entrada `SUBMITTED`, así que ese trabajo no queda inaccesible cuando cambia el rol.

**[07-timetrack-034] ¿Por qué `UserService` impide que un manager se quite a sí mismo el rol, se desactive o se elimine?** ⭐⭐⭐

Comparo la cuenta de destino con `AuthenticatedUserProvider.currentUser()` antes de esos cambios y rechazo que el manager bloquee su propia cuenta mediante `InvalidStateTransitionException`. Como quien llama ya debe ser un manager activo, impedir que pierda su propio acceso garantiza que siga habiendo al menos uno sin consultar cuántos quedan.

**[07-timetrack-035] ¿Por qué `TimeEntryService.reopen` borra la nota de rechazo al devolver una entrada rechazada a `DRAFT`?** ⭐⭐

Elegí borrar `rejectionNote` a la vez que cambio `REJECTED` por `DRAFT`. La explicación del manager pertenece a la entrega rechazada; dejarla en el borrador corregido o en un reenvío posterior presentaría feedback antiguo como si describiera la nueva revisión.

**[07-timetrack-036] ¿Qué validas en la petición y qué compruebas en `TimeEntryService.validateEntryData` para las entradas de tiempo?** ⭐⭐

Elegí `@NotNull`, `@DecimalMin("0.5")`, `@DecimalMax("24")` y `@Digits` en los campos de petición para rechazar valores ausentes o fuera de rango en el límite de la API; el servicio rechaza fechas posteriores a `LocalDate.now()` y repite la comprobación del rango de horas en `validateEntryData`. La regla de fecha depende del día actual y por eso está en la lógica del servicio; las restricciones de petición también exigen un ID de proyecto y una descripción no vacía de hasta 255 caracteres.

**[07-timetrack-037] ¿Por qué `UserService.changePassword` verifica la contraseña actual antes de comprobar que la nueva sea distinta?** ⭐⭐

Verifico primero la contraseña actual y después comparo la nueva con el hash almacenado; si alguna comprobación falla, lanzo `InvalidPasswordException` asociada al campo correspondiente. Así, quien no conoce la contraseña actual no puede aprovechar la respuesta de «contraseña sin cambios» para probar posibles valores. Además, la API puede señalar qué campo falló.

**[07-timetrack-038] ¿Por qué el backend genera las contraseñas de creación y reset, y por qué un manager puede resetear la de otra cuenta pero no la suya?** ⭐⭐⭐

Elegí `SecureRandom` para generar una contraseña nueva de 12 caracteres y guardar solo su valor codificado; el texto plano se devuelve únicamente en la respuesta de creación o reset. El reset por un manager recupera el acceso de otra persona, mientras que `UserService.resetPassword` rechaza el propio ID del manager porque esa cuenta puede usar el flujo de cambio que verifica la contraseña actual.

**[07-timetrack-039] ¿Cómo expresa la petición de rechazo la regla de que toda entrada rechazada necesita una explicación útil?** ⭐⭐

Elegí `@NotBlank` y `@Size(max = 255)` en `RejectRequest.rejectionNote`, por lo que fallan la validación las explicaciones compuestas solo por espacios y las notas que superan el límite del campo en la base de datos. `TimeEntryService.reject` guarda la nota aceptada al pasar a `REJECTED`; después, `reopen` la borra antes de que el borrador corregido pueda reenviarse.

**[07-timetrack-040] ¿Por qué `TimeEntryService` solo permite editar o eliminar una entrada mientras está en `DRAFT`?** ⭐⭐

Compruebo el estado actual tanto en `TimeEntryService.update` como en `delete` y exijo `DRAFT` antes de cambiar campos o borrar la fila. Una vez enviada, la entrada queda pendiente de revisión; si se pudiera editar o eliminar entonces, cambiarían los datos sobre los que el manager debe decidir. En otro estado, lanzo `InvalidStateTransitionException`.

**[07-timetrack-041] ¿Por qué una entrada debe estar `SUBMITTED` antes de que un manager pueda aprobarla o rechazarla, y por qué no puede revisar sus propias entradas?** ⭐⭐⭐

Elegí aplicar ambas reglas en `TimeEntryService.approve` y `reject`: los dos métodos rechazan cualquier estado distinto de `SUBMITTED` y comparan al propietario con el manager autenticado antes del cambio. Así, la revisión se limita a la cola de entradas enviadas y un manager no decide sobre sus propias horas.

**[07-timetrack-042] ¿Por qué `TimeEntryService.submit` vuelve a comprobar que el proyecto del borrador sigue activo?** ⭐⭐

Elegí comprobar la actividad del proyecto también al enviar, además de hacerlo al crear o editar la entrada, porque un proyecto puede archivarse mientras el borrador del empleado sigue abierto. Si está inactivo, el servicio rechaza la transición mediante `BusinessRuleViolationException`, de modo que no entra en la cola de revisión bajo un proyecto que ya no acepta trabajo.

**[07-timetrack-043] ¿Por qué todos los totales de los informes cuentan solo entradas `APPROVED` y `pendingHours` se mantiene aparte?** ⭐⭐

Elegí usar `APPROVED` como base común de `getSummary`, `getHoursByProject` y `getHoursByUser`, incluido `totalEntries`, para que el resumen y sus desgloses representen el mismo trabajo aceptado. `pendingHours` cuenta por separado el trabajo `SUBMITTED` como señal de carga pendiente para los managers; `DRAFT` y `REJECTED` no entran en ninguna de las dos medidas.

**[07-timetrack-044] ¿Por qué `ReportService.getSummary` limita los totales de un empleado a su propio usuario, mientras los managers reciben el resumen del equipo?** ⭐⭐

Elegí fijar `userId` a partir de `AuthenticatedUserProvider.currentUser()` cuando el solicitante no es manager, en vez de confiar en un ID de la petición. Para los managers dejo ese filtro en null, y el controlador reserva los desgloses por proyecto y usuario a ese rol; así, cada informe expone solo los agregados permitidos para quien lo pide.

**[07-timetrack-045] ¿Por qué `ChangePasswordRequest` exige entre 8 y 72 caracteres para la contraseña nueva y limita también la actual a 72?** ⭐⭐

Elegí un mínimo de ocho caracteres para la nueva contraseña y un máximo de 72 para ambas entradas, siguiendo el límite de entrada previsto para BCrypt antes de que `UserService.changePassword` verifique o codifique cualquiera de ellas. `@Size` cuenta caracteres, mientras que el límite efectivo de BCrypt se mide en bytes codificados; por eso, la validación actual no es exacta en bytes para contraseñas no ASCII y no afirmo que elimine esa limitación.

### Frontend

**[07-timetrack-084] ¿Cómo limita la pantalla `Entries` las acciones según el rol y el estado del flujo, y qué ocurre si el proyecto de un borrador está inactivo?** ⭐⭐⭐

Elegí una sola página `/entries`: muestra las acciones del empleado solo a empleados y añade la columna de empleados para managers; la API proporciona la lista permitida para cada rol. `EntryList` ofrece editar, eliminar y enviar cuando la entrada está en `DRAFT`, permite reabrirla si está en `REJECTED` y oculta la opción de enviarla si el proyecto está inactivo. Los managers revisan las entradas en la pantalla `Approvals`, aparte.

**[07-timetrack-085] ¿Por qué un manager solo puede aprobar o rechazar una entrada enviada si no es su propietario?** ⭐⭐⭐

Elegí que `canReview` exija tanto el estado `SUBMITTED` como un ID de propietario distinto del del manager autenticado. Si la entrada es suya, se muestra «Awaiting another manager» en vez de los botones de acción. La interfaz hace visible esta separación, pero `TimeEntryService` también la aplica en el límite de la API.

**[07-timetrack-086] ¿Qué reglas comprueba `EntryDialog` antes de enviar una petición y cómo muestra los errores de validación de la API?** ⭐⭐

Elegí validadores del cliente y restricciones de los campos para exigir proyecto y fecha, impedir fechas posteriores a hoy, limitar las horas de 0.5 a 24 y exigir una descripción con texto de hasta 255 caracteres. `placeFieldErrors` muestra los errores de servidor reconocidos junto a sus controles; los errores generales de la API aparecen en la alerta del formulario. El servidor sigue siendo quien decide las reglas que dependen de datos actuales.

**[07-timetrack-087] ¿Por qué un diálogo de edición mantiene visible el proyecto inactivo actual, pero no permite seleccionarlo como valor válido?** ⭐⭐

Elegí añadir el proyecto actual de la entrada como opción marcada como inactiva, para que el formulario represente lo que está guardado sin sustituirlo silenciosamente. El validator `activeProject` marca ese valor como inválido, por lo que el empleado debe elegir un proyecto activo antes de guardar o enviar el borrador.

**[07-timetrack-088] ¿Cómo diferencia `ProjectDialog` el nombre obligatorio del proyecto de una descripción opcional?** ⭐⭐

Elegí exigir un nombre con contenido de hasta 255 caracteres y permitir una descripción de hasta el mismo límite. Antes de enviar una creación o actualización, el diálogo elimina los espacios sobrantes de ambos valores y convierte una descripción vacía en `null`, de acuerdo con las reglas de campos del proyecto en la API.

**[07-timetrack-089] ¿Cómo valida `UserDialog` los campos de la cuenta y qué valores normaliza antes de guardarlos?** ⭐⭐

Elegí exigir nombres con contenido, direcciones de email válidas y un rol, y limitar los nombres y el email a 255 caracteres. Antes de llamar a `UserService`, el diálogo elimina los espacios sobrantes del nombre y del email; los errores de campo del servidor se muestran en los controles correspondientes.

**[07-timetrack-090] ¿Por qué el diálogo de rechazo valida y recorta el motivo del manager antes de rechazar una entrada?** ⭐⭐

Elegí exigir un motivo con contenido de hasta 255 caracteres y recortarlo antes de llamar a `rejectEntry`. Así se evitan notas compuestas solo por espacios o demasiado largas, y queda una explicación útil asociada a la entrada rechazada para su propietario.

**[07-timetrack-091] ¿Qué acciones de autogestión bloquea la pantalla Team y qué puede cambiar todavía el manager en su propia cuenta?** ⭐⭐⭐

Elegí desactivar la edición del rol en `UserDialog` y el reset de contraseña o la desactivación de la fila del usuario autenticado, porque esas acciones podrían quitarle al manager su propio acceso o saltarse el cambio de contraseña de autoservicio. Puede seguir cambiando su nombre y email, y cambiar su contraseña desde el diálogo de autoservicio del menú de cuenta.

**[07-timetrack-092] ¿Cómo evita el formulario de cambio de contraseña que una solicitud incompleta o con valores distintos llegue a la API?** ⭐⭐

Elegí exigir las contraseñas actual y de confirmación, requerir que la nueva tenga entre 8 y 72 caracteres y no esté vacía, y añadir un validador de grupo para comprobar que coincida con la confirmación. El diálogo asocia a esos campos los errores del servidor sobre la contraseña actual y la nueva; comprobar la credencial actual y rechazar una contraseña sin cambios son reglas que corresponden al servidor.

**[07-timetrack-093] ¿Por qué el formulario Team permite intentar ascender a otro usuario sin comprobar antes si tiene entradas pendientes?** ⭐⭐

Elegí no cargar las entradas de cada usuario en la página Team solo para comprobar por adelantado un cambio de rol. El backend es responsable de bloquear el ascenso mientras queden entradas `DRAFT` o `REJECTED`. Si la API devuelve ese conflicto de estado, `UserDialog` muestra su mensaje en la alerta general del formulario, en vez de hacer una comprobación del cliente que podría quedar obsoleta.

**[07-timetrack-094] ¿Cómo deja clara la interfaz de Projects y Team una desactivación, a la vez que conserva los registros existentes?** ⭐⭐

Elegí pedir confirmación antes de desactivar un proyecto o a un miembro y explicar en el mensaje que las horas o las entradas existentes se conservan, aunque se impida registrar trabajo nuevo o iniciar sesión. La reactivación es inmediata; eliminar una entrada tiene su propia confirmación, que avisa explícitamente que el borrador se borrará de forma permanente.

**[07-timetrack-095] ¿Cómo impide el frontend que se envíe otra mutación mientras sigue en curso un guardado o una acción sobre una fila?** ⭐

Elegí marcar cada diálogo como `saving` y desactivar sus controles hasta que la petición termine, con éxito o error. En las tablas, `busyIds` desactiva solo la fila que se está modificando y los handlers terminan de inmediato si esa fila ya está ocupada, para que otro clic no envíe una mutación duplicada.

**[07-timetrack-096] ¿Por qué el filtro de proyectos de Entries solo muestra proyectos activos a los empleados, aunque algunas de sus entradas correspondan a proyectos inactivos?** ⭐⭐

Elegí usar en el filtro la lista de proyectos que el endpoint permite ver a los empleados: un proyecto archivado desaparece de ahí, pero el empleado puede seguir consultando sus entradas por mes y estado. La lista de entradas está paginada, así que el navegador no puede deducir de las entradas del empleado los IDs de todos los proyectos inactivos; incluirlos requeriría otra consulta limitada al usuario actual.
### Transversal

**[07-timetrack-107] ¿Por qué la pantalla compartida `Entries` oculta las acciones que no corresponden al rol, mientras que la API sigue exigiendo el rol adecuado para cada operación?** ⭐⭐

Elegí mostrar las acciones de empleado solo a los empleados y los controles de revisión solo a los managers, según el rol de la persona autenticada en la página. Es una regla de usabilidad, no de autorización: `TimeEntryController` protege por separado las operaciones de escritura de empleados y las rutas de revisión de managers con `@PreAuthorize`, así que una petición directa con el rol equivocado sigue recibiendo `403`.

## Decisiones técnicas

### Backend

**[07-timetrack-046] ¿Por qué `PUT /api/entries/{id}` exige todos los campos editables en `UpdateTimeEntryRequest` en vez de aceptar un patch parcial?** ⭐⭐

Elegí `PUT` porque la edición reemplaza los campos editables de la entrada: `projectId`, `date`, `hours` y `description` son obligatorios, y el servicio vuelve a aplicar las reglas de creación. Para las transiciones de estado uso rutas `PATCH` separadas, donde solo cambia el estado.

**[07-timetrack-047] ¿Por qué `TimeEntryResponse` devuelve tanto el ID como el nombre del usuario y del proyecto relacionados?** ⭐⭐

Elegí incluir `userId` y `projectId` junto a `userName` y `projectName` porque el cliente necesita el ID del proyecto para enviar una edición, mientras que los nombres hacen legible la entrada. No existe un endpoint `GET /{id}` para entradas; la respuesta es la representación que conserva el cliente y no debería obligarle a reconstruir un ID buscando por etiqueta.

**[07-timetrack-048] ¿Por qué los campos de credenciales de los DTOs de petición y respuesta usan `@ToString.Exclude` de Lombok?** ⭐⭐

Elegí excluir campos como `LoginRequest.password`, `AuthResponse.token` y `PasswordResetResponse.generatedPassword` del `toString()` generado. De otro modo, `@Data` de Lombok incluiría todos los campos, y escribir el objeto en un log o una excepción podría exponer una contraseña en texto plano o un bearer token aunque la serialización JSON no cambie.

**[07-timetrack-049] ¿Por qué las consultas de informes devuelven proyecciones de interfaz como `ProjectHoursReportResponse` en lugar de mapear filas a entidades?** ⭐

Elegí proyecciones de interfaz para las filas agrupadas porque Spring Data asigna cada alias seleccionado directamente a su getter correspondiente, por ejemplo `projectName` a `getProjectName()`. El informe devuelve solo los campos agregados necesarios sin cargar entidades ni mantener un mapper manual de filas.

**[07-timetrack-050] ¿Por qué el reset de contraseña es un `POST` que devuelve `200 OK` con `PasswordResetResponse`, en vez de una actualización idempotente o una respuesta vacía?** ⭐⭐

Elegí `POST /api/users/{id}/password-reset` porque cada llamada genera una contraseña diferente: repetir la petición produce otro efecto en lugar de repetir la misma actualización. La respuesta `200` contiene la única copia en texto plano para que el manager la comunique; la base de datos guarda su hash.

**[07-timetrack-051] ¿Cómo permiten los placeholders del datasource en `application.properties` usar bases de datos locales o alojadas sin versionar credenciales?** ⭐⭐

Elegí placeholders de variables de entorno para `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`: la URL y el usuario tienen valores locales por defecto, mientras que la contraseña debe proporcionarse. La misma configuración de la aplicación sirve así para PostgreSQL local o para una base de datos configurada externamente, sin incrustar la contraseña en el repositorio.

**[07-timetrack-052] ¿Por qué `application.properties` usa `ddl-auto=update` de Hibernate en vez de migraciones versionadas con Flyway?** ⭐⭐

Elegí `update` mientras soy la única persona que cambia el esquema y la base de datos desplegada contiene datos de demostración que no necesitan sobrevivir a esos cambios. Acepto no tener un historial de migraciones que pueda revisar y tener que aplicar manualmente cambios como borrados o renombrados. Cuando haya compañeros o datos duraderos, necesitaré migraciones versionadas.

**[07-timetrack-053] ¿Por qué desactivaste Open Session in View en `application.properties` en vez de dejar que la serialización JSON cargue relaciones lazy?** ⭐⭐

Elegí `spring.jpa.open-in-view=false` para que una respuesta no lance consultas de persistencia después de que termine la operación del servicio. `TimeEntryService.toResponse` mapea los campos de usuario y proyecto mientras la transacción del servicio está activa, haciendo explícito el acceso a la base de datos en vez de ocultarlo durante la serialización JSON.

**[07-timetrack-054] ¿Por qué `GlobalExceptionHandler` usa `409 Conflict` para recursos duplicados y transiciones de estado inválidas, pero `400 Bad Request` para datos de petición inválidos?** ⭐⭐

Elegí `409` cuando una operación bien formada entra en conflicto con datos existentes o con el estado actual del recurso, como ocurre con `DuplicateResourceException` e `InvalidStateTransitionException`. Los fallos de validación y `BusinessRuleViolationException` se convierten en `400`, distinguiendo una entrada inválida o inaceptable de una petición que choca con el estado actual.

**[07-timetrack-055] ¿Por qué la creación de una cuenta devuelve un `CreateUserResponse` con la contraseña generada, mientras que `UserResponse` nunca contiene credenciales?** ⭐⭐

Separé `CreateUserResponse` para que `UserService.create` devuelva la contraseña en texto plano una sola vez al manager que crea la cuenta. Los listados y actualizaciones usan `UserResponse`, que no tiene campos de contraseña. La contraseña se guarda codificada, y `@ToString.Exclude` evita que ese valor de un solo uso aparezca al registrar el objeto en un log.

### Frontend

**[07-timetrack-097] ¿Por qué NgRx no hacía falta para el estado de las páginas de TimeTrack, aunque el shell comparta el contador de aprobaciones pendientes?** ⭐⭐

Elegí signals para el estado propio de cada ruta porque cada página consulta y actualiza los datos de su endpoint; un store global con actions, reducers y effects añadiría complejidad a un estado que no se comparte entre rutas. La sesión autenticada y el contador de aprobaciones pendientes son las excepciones: `AuthService` y `PendingApprovals` guardan cada uno una signal en la raíz porque varias partes de la aplicación necesitan ese valor.

**[07-timetrack-098] ¿Por qué todos los componentes usan `ChangeDetectionStrategy.OnPush` y cómo actualiza la aplicación esas vistas?** ⭐⭐

Elegí `OnPush` como estrategia de detección de cambios para los componentes. Los componentes leen signals para el estado local y derivado; los hijos reutilizables reciben valores mediante `input()` y comunican acciones mediante `output()`. Así, Angular recibe cambios de estado explícitos que puede renderizar sin depender de la comprobación predeterminada de cada componente.

**[07-timetrack-099] ¿Por qué `appConfig` establece `canceledNavigationResolution: 'computed'` para la navegación con el historial del navegador?** ⭐

Elegí la estrategia `computed` porque `oneTimeSecretGuard` puede cancelar una acción de volver atrás del navegador mientras la contraseña generada siga en riesgo. Angular restaura la posición del historial a la ruta que permanece en pantalla, en vez de dejar desincronizados la URL y el contenido mostrado.

### Transversal

**[07-timetrack-108] ¿Cómo mantiene TimeTrack un único contrato de errores entre las respuestas de Spring y los formularios de Angular sin vincular los mensajes de campo a un código de estado concreto?** ⭐⭐

Elegí usar un formato común, `ErrorResponse`, en `GlobalExceptionHandler` y añadir `fieldErrors` solo cuando el error corresponde a uno o más campos. Cada campo contiene una lista para conservar varios errores de validación. Los helpers `ApiError` de Angular aceptan un `HttpErrorResponse` solo si el cuerpo tiene un `status` numérico y un `message` de tipo string; después colocan el primer mensaje únicamente en los controles permitidos por el formulario, tanto si la respuesta es `400` como `409`.

**[07-timetrack-109] ¿Por qué la desactivación de usuarios y proyectos conserva sus filas en la base de datos en vez de borrarlas, y qué permite hacer eso al resto de TimeTrack?** ⭐⭐

Elegí asignar `false` a `active` en `UserService.delete` y `ProjectService.delete`, porque las entradas de tiempo mantienen claves foráneas no nulas a ambos registros y su historial debe seguir disponible para auditoría. La confirmación de Angular explica que las entradas anteriores se conservan, aunque se detenga el trabajo nuevo o el inicio de sesión. Así, la interfaz y la API preservan el mismo historial en vez de provocar un borrado en cascada.

**[07-timetrack-110] ¿Por qué elegiste Docker Compose para el stack local en vez de pedir a cada persona que revise el proyecto que instale PostgreSQL, un JDK y Maven?** ⭐⭐⭐

Elegí un stack de Compose con PostgreSQL y una imagen de la API construida desde `backend/timetrack`, para que Docker sea el único requisito local de quien revisa el proyecto y se use esa misma imagen en el paso de despliegue. Un volumen con nombre, `db-data`, conserva la base de datos entre reinicios de los contenedores. En el primer arranque sobre el volumen, el script de inicialización de solo lectura crea el rol de aplicación con los mínimos privilegios y su base de datos. Para el desarrollo diario aún puedo usar IntelliJ con la base local y mantener un ciclo de edición y ejecución más rápido.

**[07-timetrack-111] ¿Por qué `GET /api/entries` usa `Pageable` mientras que los demás endpoints de colección devuelven todas sus filas, y cómo sigue Angular ese contrato?** ⭐⭐

Elegí paginar las entradas porque es la única colección que puede crecer sin límite; filtrar por mes reduce los resultados, pero no garantiza un máximo fijo. `TimeEntryController` devuelve un `Page<TimeEntryResponse>` de Spring con un tamaño predeterminado de 20. `EntryService` de Angular envía la página, el tamaño, los filtros y la ordenación, y su modelo `Page<TimeEntry>` lee los metadatos de la respuesta.

**[07-timetrack-112] ¿Por qué publicaste una URL accesible antes de terminar los pasos 8 y 9, a pesar de los arranques lentos del plan gratuito y de que la base de datos de demostración permite escrituras?** ⭐⭐⭐

Decidí publicar la aplicación mientras buscaba trabajo para que una persona de selección pudiera probarla antes de clonar el proyecto y ejecutarlo. Acepté como costes la espera al despertar el servicio y el uso compartido de los datos de demostración. Aun así, publicar la aplicación no significa que el proyecto esté terminado: los pasos 8 y 9 siguen siendo necesarios para completar TimeTrack.

**[07-timetrack-113] ¿Por qué la API espera a que PostgreSQL supere su health check en Compose, en vez de arrancar en cuanto existe el contenedor de la base de datos?** ⭐

Elegí `depends_on: condition: service_healthy` y una comprobación con `pg_isready`, porque un contenedor de PostgreSQL puede estar en ejecución mientras todavía inicializa la base de datos y el rol. Compose arranca la API cuando la base de datos ya acepta conexiones, lo que evita una carrera de arranque en un stack local nuevo o reiniciado.

**[07-timetrack-114] ¿Por qué la compilación de Docker ejecuta `mvnw package -DskipTests` en vez de usar la creación de la imagen como prueba del backend?** ⭐⭐

Elegí construir el JAR ejecutable en la etapa JDK del Dockerfile y dejar la verificación para el paso 8, donde los tests del backend están previstos y se ejecutan como una comprobación propia. Así, la imagen de despliegue puede existir aunque el proyecto aún esté sin terminar, pero crearla correctamente no demuestra por sí solo que pasen los tests del backend.

## Testing

### Backend

**[07-timetrack-056] ¿Por qué `ValidationMessagesTest` construye directamente un `Validator` de Bean Validation en vez de arrancar el contexto de Spring?** ⭐⭐

Compruebo las restricciones de la petición y los mensajes que generan mediante `Validation.buildDefaultValidatorFactory()`. Así, este test no necesita Spring Boot, PostgreSQL ni secretos de despliegue. También detecta si falta el archivo de mensajes de validación o está mal configurado, porque comprueba los mensajes de un `CreateTimeEntryRequest` inválido.

**[07-timetrack-057] ¿Por qué el mensaje `Size` de `ValidationMessages.properties` distingue entre un límite solo máximo y un rango?** ⭐⭐

Distinguí los dos casos en el mensaje para que una restricción con `min = 0` diga “Must be at most 255 characters” sin mencionar un límite inferior que no aporta nada. `ValidationMessagesTest.sizeWithOnlyAMaximumNamesTheMaximum` comprueba ese texto exacto para una descripción de 256 caracteres; el otro test verifica los mensajes de campo de `NotNull`, `NotBlank`, `DecimalMax` y `Digits`.

### Frontend

**[07-timetrack-100] ¿Por qué los tests de fechas serializan una hora local tardía y vuelven a analizar el resultado como un día del calendario local?** ⭐⭐

Elegí tratar la fecha de una entrada como un día del calendario, no como un instante UTC: `toIsoDate` lee el año, mes y día locales, y `fromIsoDate` reconstruye la medianoche local. El spec usa las 23:30 y comprueba que al analizar el valor se obtiene el mismo día, porque una conversión por UTC podría desplazar una fecha local tardía al día anterior.

**[07-timetrack-101] ¿Por qué `recentMonths` empieza por el mes actual y prueba una lista que cruza al año anterior?** ⭐

Elegí construir cada mes desde su primer día local y retroceder el número de meses correspondiente; después genero por separado la clave del mes y su etiqueta legible. El test comprueba el orden de más reciente a más antiguo entre enero y diciembre, para que el selector no se detenga ni etiquete mal los meses al cambiar de año.

**[07-timetrack-102] ¿Por qué `apiErrorMessage` usa un mensaje del servidor solo si reconoce el cuerpo de `HttpErrorResponse` y, en los demás casos, devuelve el fallback de la pantalla?** ⭐⭐

Elegí validar el error desconocido con `isApiError` antes de leer `message`; ante fallos de red o cuerpos que no respetan la forma de error de la API, se usa el fallback de la pantalla. Los tests comprueban tanto un mensaje de autenticación tipado como un error de navegador sin conexión, para que la interfaz explique el fallo sin asumir que todo valor lanzado cumple el contrato del backend.

**[07-timetrack-103] ¿Por qué el spec de `placeFieldErrors` recibe una lista explícita de campos y comprueba que ignora un campo de servidor que no está en ella?** ⭐⭐

Elegí que cada formulario indique qué controles pueden recibir errores del servidor, en vez de confiar en claves arbitrarias de una respuesta de la API. El spec comprueba que un error de `hours` se asocia a su campo; un error no incluido para `userId` no cambia ningún control y la función informa que no pudo asociar ningún error.

**[07-timetrack-104] ¿Qué protege el spec de `roleMatch` al comprobar tanto un rol distinto como la ausencia de sesión?** ⭐⭐

Elegí que el `CanMatchFn` compare el rol solicitado con `AuthService.session()?.role`; si no hay sesión, devuelve `false`, igual que cuando el rol no coincide. El spec prueba una sesión `EMPLOYEE` frente a las dos variantes de rol, elimina después la signal y confirma que ninguna ruta por rol coincide.
