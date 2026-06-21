# Seguridad — Preguntas de entrevista

## Autenticación y autorización

**¿Cuál es la diferencia entre autenticación y autorización?** ⭐⭐⭐

La autenticación confirma *quién eres* — iniciar sesión con email y contraseña para probar tu identidad. La autorización confirma *qué tienes permiso para hacer* — comprobar tu rol para decidir si puedes acceder a un recurso. En el HR portal, `authGuard` gestiona la autenticación (¿hay un token válido?) y `adminGuard` gestiona la autorización (¿el rol es `admin`?). Siempre se ejecutan en ese orden: primero te autenticas, luego el sistema autoriza la acción.

> **Consejo de entrevista:** La frase clave: "autenticación = quién eres, autorización = qué puedes hacer." Luego da el ejemplo de los guards — lo concreto gana a lo abstracto.
> **Junior tip:** "authentication = who are you, authorisation = what can you do." Then give the guard example.

**¿Cuál es la diferencia entre 401 Unauthorized y 403 Forbidden?** ⭐⭐⭐

401 significa que *no estás autenticado* — no hay token, el token caducó o la firma es inválida; el servidor no sabe quién eres. 403 significa que *estás autenticado pero no autorizado* — tu token es válido pero tu rol no tiene permiso para acceder a ese recurso. En el proyecto 07, una petición sin JWT a un endpoint protegido devuelve 401; un `USER` que accede a un endpoint anotado con `@PreAuthorize("hasRole('ADMIN')")` devuelve 403.

> **Consejo de entrevista:** "401 = ¿quién eres? 403 = sé quién eres, pero no." Los nombres HTTP confunden (401 dice "Unauthorized" pero significa *no autenticado*) — decirlo con claridad te separa de los juniors que los mezclan.
> **Junior tip:** "401 = who are you? 403 = I know you, but no." The HTTP names are misleading.

**¿Dónde impones el control de acceso por roles — en el frontend, el backend, o ambos?** ⭐⭐⭐

En ambos, pero el backend es el único que cuenta. Los route guards de Angular y el `@if` según rol ocultan las funciones de admin para que un usuario normal no las vea — eso es UX, no seguridad, porque cualquiera puede saltarse el frontend con Postman o DevTools. La imposición real está en el backend con `@PreAuthorize("hasRole('MANAGER')")`, que rechaza la petición independientemente de lo que envíe el cliente. El frontend limpia la interfaz; el backend protege los datos.

Respuesta mala: "Compruebo el rol en el guard de Angular." — Un guard solo oculta el botón; no detiene una petición HTTP fabricada. Confiar en el frontend para la autorización es uno de los errores de seguridad junior más comunes.

**¿Por qué un login fallido siempre devuelve un mensaje genérico "credenciales inválidas" en lugar de decir "contraseña incorrecta" o "email no encontrado"?** ⭐⭐

Porque un mensaje específico permite a un atacante *enumerar* cuentas: "email no encontrado" confirma qué direcciones no están registradas, así que "contraseña incorrecta" confirma implícitamente cuáles sí. Al devolver el mismo mensaje genérico en ambos casos, la API no filtra nada sobre qué emails existen. En Spring Boot esto significa gestionar `BadCredentialsException` (y un usuario inexistente) con una respuesta idéntica.

Respuesta mala: "Le digo al usuario exactamente qué falló, así es más amigable." — Útil para el usuario, pero le entrega al atacante una lista de cuentas válidas. En el endpoint de login, la seguridad gana a la comodidad.

---

## JWT

**¿Cuáles son las tres partes de un JWT y qué contiene cada una?** ⭐⭐⭐

Un JWT es `header.payload.signature`. El header indica el algoritmo de firma (p. ej. `HS256`). El payload lleva los claims — `sub` (el sujeto, normalmente el email), `iat` (emitido en), `exp` (expiración) y a menudo el rol. La firma es un HMAC del header y el payload calculado con el secreto del servidor. Las dos primeras partes son JSON en Base64; la firma es lo que prueba que no se manipularon.

> **Consejo de entrevista:** Nombra las tres partes y los claims estándar (`sub`, `iat`, `exp`). La mayoría de juniors dice "guarda los datos del usuario" — nombrar los claims demuestra que conoces el estándar.
> **Junior tip:** Name the three parts and the standard claims (`sub`, `iat`, `exp`).

**¿Está cifrado un JWT? ¿Es seguro poner datos en él?** ⭐⭐⭐

El payload *no* está cifrado — solo está codificado en Base64, así que cualquiera que intercepte el token puede decodificarlo y leerlo. Lo que protege un JWT es la *firma*, no el secreto: el servidor recalcula el HMAC con su propio secreto y compara, de modo que cualquier cambio en el payload rompe la firma y el token se rechaza. Esto significa que puedes confiar en que un JWT no ha sido manipulado, pero nunca debes poner contraseñas ni datos sensibles dentro.

Respuesta mala: "Sí, los JWT están cifrados, así que los datos están seguros." — Base64 es codificación, no cifrado. Cualquiera puede pegar el token en jwt.io y leer el payload. La garantía es integridad (no manipulado), no confidencialidad.

**¿Cuál es la diferencia entre un access token y un refresh token?** ⭐⭐

El access token es de vida corta (15 minutos a una hora) y se envía con cada petición. El refresh token es de vida larga y se usa solo para obtener un nuevo access token cuando el anterior caduca, sin obligar al usuario a volver a iniciar sesión. Mantener el access token corto limita el daño si lo roban — el atacante solo tiene una ventana pequeña — mientras que el refresh token permite al usuario seguir conectado con comodidad.

> **Consejo de entrevista:** "Token de acceso corto por seguridad, token de refresco largo por comodidad." No hace falta haberlos implementado — basta con saber por qué existe el patrón.
> **Junior tip:** "Short access token for security, long refresh token for convenience."

**¿Dónde guardas el JWT en el navegador y cuáles son los trade-offs?** ⭐⭐

`localStorage` es la opción más simple y la que uso en el HR portal — sobrevive a refrescos y pestañas, pero JavaScript puede leerlo, así que un ataque XSS podría robar el token. Una cookie `HttpOnly` no puede leerla JavaScript, lo que elimina el riesgo de robo por XSS, pero las cookies se envían automáticamente, así que reintroducen un riesgo de CSRF y necesitan protección CSRF. Para SPAs que ya previenen XSS, `localStorage` es la opción común en las consultoras españolas — siempre que sepas nombrar el trade-off.

Respuesta mala: "Simplemente uso localStorage." — Aceptable *solo* si reconoces de inmediato el riesgo de XSS. Decirlo sin mencionar el trade-off señala que no eres consciente de la implicación de seguridad.

---

## Fundamentos de criptografía

**¿Cuál es la diferencia entre hashing y cifrado, y por qué se hashean las contraseñas?** ⭐⭐⭐

El hashing es de una sola vía — no puedes revertir un hash al valor original. El cifrado es de dos vías — lo que cifras con una clave lo puedes descifrar con esa clave. Las contraseñas se hashean, no se cifran, porque el sistema nunca necesita recuperar la contraseña original: en el login hashea la entrada y compara hashes. Así que si roban la base de datos, el atacante no puede leer las contraseñas — tendría que probar por fuerza bruta cada entrada posible contra cada hash.

> **Consejo de entrevista:** "El hashing es de una vía, el cifrado de dos vías." Luego el punto clave: "hasheas contraseñas porque nunca necesitas leerlas, solo comparar."
> **Junior tip:** "Hashing is one-way, encryption is two-way. You hash passwords because you never need to read them back — you only compare."

**¿Qué es BCrypt y por qué ser lento es una virtud y no un defecto?** ⭐⭐

BCrypt es un algoritmo de hashing de contraseñas con un salt aleatorio incorporado y un factor de trabajo configurable (`BCryptPasswordEncoder` de Spring usa 10 rondas por defecto). Es *intencionadamente* lento: un hash rápido permite a un atacante probar miles de millones de intentos por segundo, mientras que uno lento hace inviable la fuerza bruta a gran escala. El salt hace que dos usuarios con la misma contraseña obtengan hashes distintos, así que un atacante no puede precalcular una tabla de búsqueda (rainbow table). BCrypt gestiona el salting automáticamente.

> **Consejo de entrevista:** El punto contraintuitivo que gusta: "lento es la gracia — frena los ataques de fuerza bruta." Menciona también el salt automático; juntos demuestran comprensión real.
> **Junior tip:** "Slow is the point — it throttles brute-force attacks." Mention the automatic salt too.

---

## CORS

**¿Qué es CORS y qué cuenta como un "origen"?** ⭐⭐⭐

Un origen es la combinación de protocolo + dominio + puerto, así que `http://localhost:4200` y `http://localhost:8080` son orígenes distintos aunque estén en la misma máquina. Por defecto el navegador impone la Same-Origin Policy y bloquea que JavaScript lea una respuesta de un origen diferente. CORS es el mecanismo que permite a un servidor decir explícitamente "permito peticiones de este origen." Por eso un servidor de desarrollo de Angular en el 4200 no puede llamar a una API Spring Boot en el 8080 hasta que el backend lo permita.

> **Consejo de entrevista:** Define origen con precisión — protocolo + dominio + puerto — porque el caso "mismo dominio, distinto puerto" es justo lo que rompe el setup Angular/Spring Boot.
> **Junior tip:** Define origin precisely — protocol + domain + port — the "same domain, different port" case is what trips up the Angular/Spring Boot setup.

**Una petición funciona en Postman pero falla con un error CORS en el navegador. ¿Por qué?** ⭐⭐

Porque CORS lo impone el *navegador*, no el servidor. El servidor recibe y procesa la petición con normalidad y envía una respuesta — pero el navegador bloquea que JavaScript lea esa respuesta cuando el origen no está permitido. Postman no es un navegador, así que no tiene Same-Origin Policy que imponer y la llamada funciona. La solución siempre está en el servidor: configurar un `CorsConfigurationSource` dentro del `SecurityFilterChain` para permitir el origen de Angular.

Respuesta mala: "Hay un bug en el código del backend." — El backend funcionó bien; el navegador bloqueó la respuesta. Buscar la solución en el frontend o asumir un bug del servidor demuestra que no entiendes dónde se impone CORS.

**¿Qué es una petición preflight de CORS?** ⭐

Antes de ciertas peticiones — cualquier POST con cuerpo JSON, o cualquier petición con cabecera `Authorization` — el navegador envía automáticamente una petición `OPTIONS` primero para preguntar al servidor qué orígenes, métodos y cabeceras permite. Si el servidor no responde con las cabeceras CORS correctas a ese preflight, el navegador nunca envía la petición real. Por eso una configuración de CORS ausente suele aparecer como una llamada `OPTIONS` fallida que tú no escribiste.

> **Consejo de entrevista:** Saber que existe el preflight explica la misteriosa petición `OPTIONS` que aparece en la pestaña de red. Mencionar que la cabecera `Authorization` lo dispara demuestra que has depurado un problema de CORS de verdad.
> **Junior tip:** Knowing the preflight exists explains the mysterious `OPTIONS` request; mentioning the `Authorization` header trigger shows real debugging experience.

---

## Vulnerabilidades comunes

**¿Qué es la inyección SQL y cómo protege JPA contra ella?** ⭐⭐⭐

La inyección SQL es cuando un atacante mete SQL en un campo de entrada — como un formulario de login — para cambiar la consulta, por ejemplo para saltarse la autenticación o volcar una tabla. JPA y Spring Data protegen contra ella automáticamente usando *consultas parametrizadas*: el valor se envía a la base de datos separado del texto SQL, así que siempre se trata como dato, nunca como SQL ejecutable. La única forma de reabrir el agujero es construir una consulta concatenando la entrada del usuario en una cadena.

> **Consejo de entrevista:** La respuesta que buscan es "consultas parametrizadas — la entrada va como parámetro, nunca concatenada en el SQL." Añade que concatenar la entrada en la query es lo que reabre el riesgo.
> **Junior tip:** "Parameterised queries — the input is passed as a parameter, never concatenated into the SQL."

**¿Qué es XSS, cómo lo previene Angular y puede Angular seguir siendo vulnerable?** ⭐⭐⭐

XSS (Cross-Site Scripting) es cuando un atacante inyecta JavaScript malicioso que se ejecuta en el navegador de otros usuarios — puede robar un token de `localStorage`, por ejemplo. Angular previene la mayoría del XSS automáticamente escapando todo valor enlazado en una plantilla, así que la entrada del usuario se renderiza como texto, no se ejecuta. La excepción es `[innerHTML]`: Angular deliberadamente no lo escapa, así que renderizar contenido del usuario con `[innerHTML]` reabre el agujero de XSS a menos que lo sanees antes.

Respuesta mala: "Angular es seguro contra XSS, así que no me preocupo." — El binding por defecto de Angular es seguro, pero `[innerHTML]` (y `bypassSecurityTrust...`) saltan deliberadamente esa protección. Conocer la excepción es justo lo que el entrevistador está comprobando.

**¿Qué es CSRF y por qué usar un JWT en la cabecera Authorization lo previene?** ⭐⭐

CSRF (Cross-Site Request Forgery) engaña al navegador de un usuario con sesión iniciada para que envíe una petición no deseada a un sitio donde está autenticado. Funciona porque el navegador adjunta *cookies* automáticamente a cada petición a ese dominio. Un JWT enviado en la cabecera `Authorization: Bearer` no se adjunta automáticamente — tu JavaScript tiene que añadirlo a propósito — así que una petición falsificada entre sitios no lleva token y se rechaza. Por eso una API JWT sin estado puede desactivar la protección CSRF con seguridad.

> **Consejo de entrevista:** La conexión a hacer: "CSRF depende de que las cookies se envíen solas; un JWT en una cabecera se añade a mano, así que el ataque no tiene de qué aprovecharse."
> **Junior tip:** "CSRF relies on cookies being sent automatically; a JWT in a header is added manually, so the attack has nothing to ride on."

**¿Por qué validas la entrada en el servidor aunque ya la valides en el cliente?** ⭐⭐

Porque la validación del lado del cliente se puede saltar — cualquiera puede enviar una petición directamente con Postman o editar el DOM en DevTools, saltándose el formulario de Angular por completo. La validación del cliente es para la experiencia de usuario (feedback rápido); el servidor es la única frontera que realmente controlas y en la que puedes confiar. En Spring Boot lo impongo con `@Valid` y `@NotBlank` en el DTO de petición, así que los datos inválidos se rechazan aunque nunca pasaran por el formulario.

Respuesta mala: "El formulario de Angular ya lo valida, así que el backend no necesita hacerlo." — El formulario se salta trivialmente. Confiar en la validación del cliente como control de seguridad es un error clásico; el servidor debe re-validar todo.

**¿Qué podría salir mal si un controlador enlaza el cuerpo de la petición directamente a la entidad JPA en lugar de a un DTO de petición?** ⭐⭐

Mass assignment (asignación masiva). Si el JSON se enlaza directamente a la entidad, un cliente malicioso puede establecer campos que nunca debería controlar solo con añadirlos al cuerpo — `"role": "MANAGER"` o `"active": true` — y escalar sus propios privilegios en silencio. Un DTO de petición cierra este agujero porque solo declara los campos que un cliente tiene permitido enviar; cualquier cosa extra en el JSON se ignora. Esta es una razón más por la que los DTOs son una frontera de seguridad, no solo una comodidad de mapeo.

Respuesta mala: "Enlazar a la entidad está bien, es menos código." — Permite al cliente escribir cualquier columna de la tabla, incluidas `role` y `active`. El DTO de petición es lo que limita la superficie de ataque a los campos que pretendías.
