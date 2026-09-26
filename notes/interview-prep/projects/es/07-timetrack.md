# Preguntas de entrevista — 07-timetrack

**Último banco — backend:** 2026-09-26
**Último banco — frontend:** nunca
**Último banco — transversal:** nunca

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

### Transversal

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

### Transversal

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

### Transversal

## Testing

### Backend

**[07-timetrack-056] ¿Por qué `ValidationMessagesTest` construye directamente un `Validator` de Bean Validation en vez de arrancar el contexto de Spring?** ⭐⭐

Compruebo las restricciones de la petición y los mensajes que generan mediante `Validation.buildDefaultValidatorFactory()`. Así, este test no necesita Spring Boot, PostgreSQL ni secretos de despliegue. También detecta si falta el archivo de mensajes de validación o está mal configurado, porque comprueba los mensajes de un `CreateTimeEntryRequest` inválido.

**[07-timetrack-057] ¿Por qué el mensaje `Size` de `ValidationMessages.properties` distingue entre un límite solo máximo y un rango?** ⭐⭐

Distinguí los dos casos en el mensaje para que una restricción con `min = 0` diga “Must be at most 255 characters” sin mencionar un límite inferior que no aporta nada. `ValidationMessagesTest.sizeWithOnlyAMaximumNamesTheMaximum` comprueba ese texto exacto para una descripción de 256 caracteres; el otro test verifica los mensajes de campo de `NotNull`, `NotBlank`, `DecimalMax` y `Digits`.

### Frontend
