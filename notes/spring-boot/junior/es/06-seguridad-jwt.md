# Spring Security y JWT

Docs: [jjwt — README](https://github.com/jwtk/jjwt) (la librería JWT usada aquí — crear, firmar y parsear tokens) · [Baeldung — Spring Security: authentication with a database](https://www.baeldung.com/spring-security-authentication-with-a-database) (el companion práctico para la parte de Spring Security) · [Spring Security Reference](https://docs.spring.io/spring-security/reference/) (autoritativo, estilo referencia)

---

## Retomando el hilo — los handlers que no tenían quién los lanzara

[05-manejo-excepciones.md](./05-manejo-excepciones.md) te dejó con un `GlobalExceptionHandler` que ya contiene dos handlers que nunca tuviste forma de disparar: `BadCredentialsException` → `401`, y `AccessDeniedException` → `403`. Nada en el proyecto los lanza, porque nada en el proyecto comprueba *quién* está llamando. Ese mismo archivo también te llevó por la trampa de `/error` — un bug donde un query param que falta aparece como un `401` — y esa trampa existe solo *porque* una filter chain de seguridad se sitúa delante de cada request, decidiendo quién entra antes de que corra ningún controller. Depuraste el síntoma sin llegar a construir nunca la máquina que lo causa.

Este archivo construye esa máquina. Es donde esas dos excepciones finalmente son lanzadas por algo real: `BadCredentialsException` cuando una contraseña no coincide con un hash BCrypt almacenado, `AccessDeniedException` cuando un empleado autenticado intenta llegar a un endpoint solo para managers. Y es donde la filter chain de aquel diagrama de `/error` deja de ser una caja negra — tú mismo escribes uno de sus filtros.

El orden de abajo es el **orden de construcción**: cada clase depende de las de arriba, así que puedes compilar y probar sobre la marcha en vez de escribir diez clases y esperar que funcionen.

---

## Sintaxis Java en este archivo — empieza aquí

Si nunca has escrito Java, algunos patrones de sintaxis de este archivo parecerán magia antes de llegar siquiera a la lógica de seguridad. Ninguno de ellos es Spring — son Java de todos los días, y cada uno tiene una explicación completa en tus propias notas de Java. Echa un vistazo a esta tabla una vez y vuelve a ella cuando algo te confunda. Si una línea de este archivo parece extraña, casi siempre es uno de estos siete casos.

| Sintaxis que verás                                                      | Qué es realmente                                                                                                                                                                                                                                                               | Dónde se explica en tus notas                                                                             |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `auth -> auth.anyRequest()...` · `() -> new Something()`                | Un **lambda** — una función corta y sin nombre pasada como argumento. La parte antes de `->` es la entrada que el método te da; la parte después es lo que haces con ella. Los métodos de config de Spring Security toman lambdas para que puedas describir cada regla inline. | [java/09-streams-lambdas.md — Lambda expressions](../../../java/junior/es/09-streams-lambdas.md#sintaxis-de-lambdas) |
| `findByEmail(email).orElseThrow(...)`                                   | El método devuelve un **`Optional<User>`** — una caja que o contiene un usuario o está vacía. `.orElseThrow()` abre la caja, o lanza si está vacía. Así es como Spring Data evita devolver `null`.                                                                             | [java/10-genericos.md — `Optional<T>`](../../../java/junior/es/10-genericos.md#optionalt)                             |
| `ResponseEntity<AuthResponse>` · `Map<String, String>` · `List.of(...)` | **Generics** — el `<...>` dice qué tipo vive dentro de un contenedor. `List<String>` es una lista de strings; `ResponseEntity<AuthResponse>` es una respuesta HTTP que lleva un `AuthResponse`.                                                                                | [java/10-genericos.md — Generics](../../../java/junior/es/10-genericos.md#generics)                                   |
| `.stream().map(...).findFirst()`                                        | El **Stream API** — un pipeline que transforma una colección paso a paso. Aparece una vez aquí, dentro de `GlobalExceptionHandler`.                                                                                                                                            | [java/09-streams-lambdas.md — Stream API](../../../java/junior/es/09-streams-lambdas.md#qué-es-un-stream)                 |
| `Jwts.builder().subject(...).signWith(...).compact()`                   | El **patrón builder** — encadena métodos para configurar un objeto, y luego una llamada final (`.build()` / `.compact()`) lo produce. jjwt y Spring lo usan en todas partes.                                                                                                   | explicado línea por línea en la sección `JwtUtil` abajo                                                   |
| `@Component` · `@Service` · `@Bean` · `@Override`                       | **Anotaciones** — metadatos que pones en una clase o método para decirle a Spring (o al compilador) cómo tratarlo.                                                                                                                                                             | [java/13-anotaciones.md](../../../java/junior/es/13-anotaciones.md)                                                 |
| `private final JwtUtil jwtUtil;` + constructor                          | **Inyección por constructor** — Spring pasa las dependencias a través del constructor. `final` significa que el campo se establece una vez y nunca se reasigna.                                                                                                                | [spring-boot/03-inyeccion-dependencias.md](./03-inyeccion-dependencias.md)                                    |

> Dos reglas Java más con las que te toparás: `throws Exception` / `throws UsernameNotFoundException` en la firma de un método es la regla de **excepciones comprobadas** de Java — debes declarar una excepción que un método puede lanzar ([java/08-excepciones.md](../../../java/junior/es/08-excepciones.md)). Y `enum Role { EMPLOYEE, MANAGER }` (Paso 4) es un tipo con un conjunto fijo de valores con nombre ([java/11-enums.md](../../../java/junior/es/11-enums.md)).

---

## Qué estamos construyendo — y por qué

### El problema

Sin seguridad, tu API está completamente abierta. Cualquiera que conozca la URL puede llamar a `GET /api/entries/1` y leer los datos de otra persona, o `DELETE /api/users/5` y destruirlos. La seguridad no es una feature — es la base.

Hay dos conceptos separados que a menudo se confunden:

**Autenticación** — ¿quién eres? El servidor verifica tu identidad. Ejemplo: envías tu email y contraseña, el servidor confirma que existes.

**Autorización** — ¿qué puedes hacer? El servidor verifica tus permisos. Ejemplo: estás autenticado, pero eres un empleado — no puedes acceder a los endpoints solo para managers.

Este archivo cubre ambos. El Flujo 1 es autenticación (login). El Flujo 2 + `@PreAuthorize` es autorización (roles).

---

### Otras formas de implementar la autenticación

Antes de elegir JWT, vale la pena entender las alternativas. Cada enfoque tiene trade-offs.

**1. Autenticación basada en sesión** (el enfoque clásico)

```
El cliente envía email + contraseña
    ↓
El servidor verifica las credenciales
    ↓
El servidor crea una sesión en memoria (p.ej. session ID: "abc123")
    ↓
El servidor envía una cookie con el session ID al cliente
    ↓
El cliente envía la cookie en cada request futuro
    ↓
El servidor busca "abc123" en su session store → encuentra al usuario → permite el acceso
```

La sesión se almacena **en el servidor** (en memoria o una base de datos). El cliente solo tiene una referencia (el session ID en la cookie).

**Problema:** si tienes múltiples servidores (escalado horizontal), cada servidor tiene su propio session store. Un request que va al Servidor 2 no encuentra la sesión creada por el Servidor 1. Necesitas almacenamiento de sesiones compartido (Redis, base de datos) — infraestructura extra.

---

**2. JWT — JSON Web Token** (lo que estamos implementando)

```
El cliente envía email + contraseña
    ↓
El servidor verifica las credenciales
    ↓
El servidor genera un token firmado con el email del usuario (y más tarde, el rol)
    ↓
El servidor envía el token al cliente
    ↓
El cliente almacena el token en localStorage y lo envía en la cabecera Authorization en cada request
    ↓
El servidor valida la firma del token — sin consulta a base de datos necesaria
```

El token se almacena **en el cliente**. El servidor es stateless — no guarda memoria de quién está logueado.

**Ventaja:** cualquier servidor puede validar un JWT porque la firma usa un secret compartido. Sin almacenamiento de sesiones compartido necesario. Por eso las APIs que necesitan escalar usan JWT.

**Desventaja:** no puedes invalidar un token antes de que expire (a menos que construyas una blacklist de tokens). La autenticación basada en sesión puede invalidar una sesión al instante eliminándola del store.

---

**3. OAuth2 / OpenID Connect** (login de terceros)

Se usa cuando la aplicación delega la autenticación a un tercero: "Log in with Google", "Log in with GitHub". El tercero confirma la identidad del usuario y envía un token de vuelta. Común en apps de consumidores. Más complejo de implementar — no se usa aquí.

---

**4. API Keys** (para comunicación máquina a máquina)

Un string aleatorio largo (`sk-abc123...`) enviado en una cabecera en cada request. Sin flujo de login — la clave se genera una vez y se almacena. Se usa para servicios internos o APIs de desarrolladores (Stripe, SendGrid). No es adecuado para autenticación de usuarios.

---

**5. Basic Auth** (usuario + contraseña en cada request)

El cliente envía `email:password` codificado en Base64 en cada request. Simple, pero la contraseña viaja en cada request — incluso con HTTPS esto se considera una mala práctica para APIs de usuario. A veces se usa para herramientas de administración internas.

---

### Por qué JWT para este proyecto

| Criterio                   | Basado en sesión                   | JWT                          |
| -------------------------- | ---------------------------------- | ---------------------------- |
| Stateless                  | No — el servidor almacena sesiones | Sí — sin memoria en servidor |
| Escala horizontalmente     | Necesita session store compartido  | Funciona de inmediato        |
| Invalidar instantáneamente | Sí                                 | No (esperar a que expire)    |
| Estándar en REST APIs      | Menos común                        | Estándar                     |
| Complejidad                | Más simple de entender             | Ligeramente más complejo     |

Elegimos JWT porque este es un REST API que Angular consumirá. Las REST APIs están diseñadas para ser stateless — cada request lleva todo lo que el servidor necesita para procesarlo. JWT encaja naturalmente. La autenticación basada en sesión requeriría gestionar estado en el lado del servidor, lo que contradice el principio REST.

Las consultoras españolas construyen REST APIs stateless como estándar. JWT es lo que verás en cada proyecto Spring Boot en una empresa real.

---

### Algoritmos de firma JWT — por qué HS256

Un JWT se firma para prevenir manipulaciones. El algoritmo determina cómo se produce y verifica esa firma. Se usan tres algoritmos habitualmente:

| Algoritmo | Nombre completo | Tipo de clave             | Caso de uso                                                            |
| --------- | --------------- | ------------------------- | ---------------------------------------------------------------------- |
| **HS256** | HMAC-SHA256     | Un secret compartido      | Un solo servidor o backend de confianza — simple, rápido               |
| **RS256** | RSA-SHA256      | Par clave pública/privada | Múltiples servicios — la clave pública puede compartirse con seguridad |
| **ES256** | ECDSA-SHA256    | Par clave pública/privada | Igual que RS256 pero claves más pequeñas, verificación más rápida      |

**Cómo leer esta tabla:** la columna que lo decide todo es **Tipo de clave**. "Un secret compartido" significa que el mismo string firma y verifica, así que cualquier parte que pueda *comprobar* un token también puede *falsificar* uno — está bien cuando hay un único backend, es fatal en el momento en que le das la clave a un segundo servicio. "Par clave pública/privada" separa esos dos poderes: la clave privada firma, la clave pública solo verifica, así que puedes publicar la mitad pública libremente. La columna **Caso de uso** es justo ese trade-off reformulado en función de cuántos servicios tienes.

**HS256** usa una clave secreta para tanto firmar como verificar. Cualquiera que conozca el secret puede crear y validar tokens — lo que significa que el secret nunca debe salir del servidor. Esta es la opción más simple y la elección correcta cuando solo hay un servicio backend.

**RS256 / ES256** usan claves asimétricas. La clave privada firma el token (solo el servidor la tiene). La clave pública lo verifica (puede compartirse con cualquiera). Se usa cuando múltiples servicios necesitan verificar tokens de forma independiente — por ejemplo, una arquitectura de microservicios donde el Servicio A emite tokens y el Servicio B los valida sin compartir un secret.

Usamos **HS256** porque este es un único backend Spring Boot. Un secret, un lugar. RS256 añadiría complejidad sin beneficio aquí.

---

### AuthenticationProvider — por qué DaoAuthenticationProvider

`AuthenticationManager` está diseñado para ser flexible. No verifica credenciales él mismo — delega en un `AuthenticationProvider`. Spring Security incluye varios proveedores, cada uno diseñado para un tipo diferente de autenticación:

| Proveedor                           | Qué hace                                                                                       | Cuándo lo usas                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **`DaoAuthenticationProvider`**     | Carga el usuario de una BD via `UserDetailsService`, compara contraseñas con `PasswordEncoder` | Login estándar con email + contraseña almacenados en tu propia BD — lo que usamos |
| `LdapAuthenticationProvider`        | Autentica contra LDAP / Active Directory                                                       | Grandes corporaciones donde IT gestiona los usuarios centralmente                 |
| `JwtAuthenticationProvider`         | Proveedor JWT incorporado de Spring, parte del módulo OAuth2 Resource Server                   | Cuando consumes tokens emitidos por un tercero (p.ej. Keycloak, Auth0)            |
| `OAuth2LoginAuthenticationProvider` | Gestiona flujos "Login with Google / GitHub"                                                   | Apps de consumidores con social login                                             |
| `RememberMeAuthenticationProvider`  | Gestiona cookies "remember me"                                                                 | Apps basadas en sesión con login persistente                                      |

**Cómo leer esta tabla:** nunca eliges un proveedor por "cuál es mejor" — eliges por **dónde viven realmente tus usuarios**, que es lo que codifica la columna "Cuándo lo usas". Usuarios en tu propia tabla de PostgreSQL → `Dao`. Usuarios en el Active Directory de la empresa → `Ldap`. Usuarios propiedad de un proveedor de identidad externo que ya emitió el token → `Jwt`. Lee las filas como cinco respuestas distintas a una sola pregunta ("¿quién guarda las credenciales?"), no como cinco opciones que compiten por la misma situación. Nota también que la fila `Jwt` *no* es lo que este archivo construye: es para **consumir** tokens que emitió otra persona, mientras que aquí emites los tuyos propios con `JwtUtil` y los validas en tu propio `JwtFilter`.

`AuthenticationManager` recorre todos los proveedores registrados cuando llega un intento de login. Elige el que puede gestionar el tipo de token pasado. Si ninguno puede gestionarlo, lanza una excepción.

**Por qué `DaoAuthenticationProvider` para este proyecto:** nuestros usuarios están almacenados en PostgreSQL y se loguean con email + contraseña. `DaoAuthenticationProvider` está construido exactamente para este caso. Le das un `UserDetailsService` (cómo cargar el usuario de la base de datos) y un `PasswordEncoder` (cómo comparar contraseñas), y gestiona la verificación completa. Escribes menos de 10 líneas de configuración y todo el mecanismo de login funciona.

---

### Este es un patrón reutilizable

La capa de seguridad JWT es un **patrón boilerplate** — la estructura no cambia entre proyectos. Una vez que lo entiendes y lo implementas una vez, lo copias a cada futura app Spring Boot que necesite autenticación JWT.

**Archivos que siempre son idénticos:** `JwtUtil.java`, `JwtFilter.java`, `JwtAuthenticationEntryPoint.java`, `AuthService.java`, `AuthController.java`, `LoginRequest.java` + `AuthResponse.java`

**Archivos donde solo cambian pequeños detalles:**

| Archivo                       | Qué cambia                                                             |
| ----------------------------- | ---------------------------------------------------------------------- |
| `SecurityConfig.java`         | Las reglas de ruta — qué paths son públicos, cuáles protegidos         |
| `UserDetailsServiceImpl.java` | El campo usado para encontrar al usuario (email, username) y los roles |
| `JwtUtil.java` (opcional)     | Claims extra añadidos al token — p.ej. rol, userId                     |
| `GlobalExceptionHandler.java` | Solo sus handlers de **seguridad** son boilerplate (`BadCredentialsException` → 401, `AccessDeniedException` → 403). El resto de la clase es específico de la app y sigue creciendo con el proyecto |

**Cómo leer esta tabla:** la columna de la izquierda *no* significa "archivos que reescribes desde cero" — significa "archivos que pegas y luego tocas en uno o dos sitios". `GlobalExceptionHandler` es el que hay que vigilar: dos de sus handlers pertenecen a este patrón de seguridad y viajan sin cambios con él, pero la clase en su conjunto no es boilerplate. En TimeTrack ya lleva once handlers, un `ErrorResponse` DTO compartido y un helper `buildError()` — todo construido en [05-manejo-excepciones.md](./05-manejo-excepciones.md) y guiado por *tus* excepciones de dominio (`ResourceNotFoundException`, `BusinessRuleViolationException`, …), que son distintas en cada app.

---

### Los dos flujos — resumen

Todo en este archivo sirve a uno de dos flujos. Lee esto antes de escribir cualquier código — es el mapa.

---

### Flujo 1 — Login inicial (completo)

```
─ ─ ─ ─ ─ ─ AL ARRANCAR — se ejecuta una vez al iniciar la app ─ ─ ─
┌─────────────────────────────────────────────────────────┐
│ [SecurityConfig]                                        │
│   crea filtro CORS  (corsConfigurationSource)           │
│   crea SecurityFilterChain con reglas de ruta           │
│     permitAll: /api/auth/**                             │
│     authenticated: todo lo demás                        │
│     sesiones STATELESS — CSRF deshabilitado             │
│   registra JwtFilter antes del filtro por defecto       │
│   expone bean PasswordEncoder  (BCrypt)                 │
│   expone bean AuthenticationManager                     │
└─────────────────────────────────────────────────────────┘
─ ─ ─ ─ ─ ─ POR REQUEST — se ejecuta en cada llamada HTTP ─ ─ ─

POST /api/auth/login
{ "email": "...",
  "password": "..." }
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [Filtro CORS]  (solo navegador — Postman lo salta)      │
│   Origin: http://localhost:4200                         │
│   POST dispara preflight OPTIONS ("¿está permitido?")   │
│   Spring: SÍ, 4200 está en allowedOrigins              │
│   → el navegador envía el real POST request             │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtFilter]                                             │
│   lee la cabecera Authorization                         │
│   → cabecera es null → sin token                       │
│   → filterChain.doFilter() — pasa al siguiente filtro   │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [SecurityFilterChain]                                   │
│   /api/auth/** → permitAll()                            │
│   → /api/auth/login está en la lista permitAll          │
│     sin token requerido → el request llega a AuthController│
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthController]                                        │
│   @Valid → email: @NotBlank — password: @NotBlank       │
│   inválido → GlobalExceptionHandler → HTTP 400          │
│   válido → llama a AuthService.login(request)           │
└─────────────────────────────────────────────────────────┘
         │ válido
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthService]                                           │
│   llama a authenticationManager.authenticate(email, pwd)│
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthenticationManager]                                 │
│   recibe el intento de login                            │
│   enruta al proveedor correcto para este tipo de auth   │
│   → delega a DaoAuthenticationProvider                 │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [DaoAuthenticationProvider]  ← interno de Spring        │
│                                                         │
│   paso 1: para verificar la contraseña necesita el hash │
│           almacenado en la BD — así que llama a         │
│           UserDetailsServiceImpl.loadUserByUsername()   │
│           → consulta BD → devuelve UserDetails {        │
│                getUsername()    = email                 │
│                getPassword()    = hash BCrypt  ← usado  │
│                getAuthorities() = [ROLE_MANAGER]        │
│             }                                           │
│                                                         │
│   paso 2: BCrypt.matches(rawPassword,                   │
│             userDetails.getPassword())                  │
│           sin coincidencia → GlobalExceptionHandler → 401│
│           coincidencia → autenticación exitosa          │
└─────────────────────────────────────────────────────────┘
         │ coincidencia
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthService]                                           │
│   llama a JwtUtil.generateToken(email)                  │
│   → construye header + payload + firma                  │
│   → devuelve AuthResponse(token) a AuthController       │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthController]                                        │
│   recibe AuthResponse de AuthService                    │
│   → ResponseEntity.ok(authResponse)                     │
└─────────────────────────────────────────────────────────┘
         │
         ▼
         { "token": "eyJ..." }  HTTP 200
         │
         ▼
Angular almacena el token en localStorage
```

---

### Flujo 2 — Cada request posterior (completo)

```
─ ─ ─ ─ ─ ─ SecurityConfig ya se ejecutó al arrancar ─ ─ ─
─ ─ ─ ─ ─ ─ POR REQUEST — se ejecuta en cada llamada HTTP ─ ─ ─

GET /api/projects
Authorization: Bearer eyJ...
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [Filtro CORS]  (solo navegador — Postman lo salta)      │
│   Origin: http://localhost:4200                         │
│   ¿está en allowedOrigins? SÍ                           │
│   cabecera Authorization no es simple → preflight enviado│
│   Spring aprueba → el request real continúa             │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtFilter]                                             │
│   lee la cabecera Authorization                         │
│   → "Bearer eyJ..." → elimina prefijo → token raw      │
│   JwtUtil.extractUsername(token) → obtiene email        │
│   UserDetailsService.loadUserByUsername(email)          │
│   JwtUtil.isValid(token, email) → firma OK + no expirado│
│   SecurityContextHolder ← establece autenticación       │
│   filterChain.doFilter()                                │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [SecurityFilterChain]                                   │
│   lee SecurityContextHolder                             │
│   .anyRequest().authenticated()                         │
│   usuario en contexto → request permitido               │
│   sin usuario en contexto → JwtAuthenticationEntryPoint │
│                            → HTTP 401 Unauthorized       │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [@PreAuthorize("hasRole('MANAGER')")]  ← si está presente│
│   lee SecurityContextHolder                             │
│   rol incorrecto → AccessDeniedException → HTTP 403     │
│   rol OK → el método se ejecuta                         │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [método @RestController]                                │
│   todos los checks pasados — la lógica de negocio corre │
└─────────────────────────────────────────────────────────┘
         │
         ▼
         HTTP 200 + datos de respuesta
```

---

### Ambos flujos combinados — la imagen completa

```
─ ─ ─ AL ARRANCAR ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
[SecurityConfig] → crea el filtro CORS, SecurityFilterChain,
                   registra JwtFilter, expone los beans
─ ─ ─ POR REQUEST ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

        POST /api/auth/login              GET /api/cualquier-ruta-protegida
        { email, password }               Authorization: Bearer eyJ...
                │                                      │
                └──────────────────┬───────────────────┘
                                   │
                           [filtro CORS]
                      ¿origen permitido? SÍ → continúa
                                   │
                              [JwtFilter]
                                   │
                  ┌────────────────┴─────────────────┐
             sin token                          token encontrado
                  │                                   │
  filterChain.doFilter()             extractUsername() → email
  "pasa de largo"                    loadUserByUsername(email)
                  │                  isValid(token) → OK
       [SecurityFilterChain]         SecurityContextHolder ← se establece
       /api/auth/** → permitAll()    filterChain.doFilter()
                  │                       [SecurityFilterChain]
          [AuthController]                authenticated() → OK
                  │                                  │
          [AuthService]                      [@PreAuthorize]
                  │                           comprobación de rol → OK
       [AuthenticationManager]                        │
                  │                         [@RestController]
       [DaoAuthenticationProvider]          se procesa el request
           ╱              ╲
[UserDetailsServiceImpl]  [BCrypt]
   carga el usuario de la BD  matches()
           ╲              ╱
       ¿ambos OK?
              │
  [JwtUtil.generateToken()]
              │
      [AuthController]
    ResponseEntity.ok()
              │
    { "token": "eyJ..." }

caminos de error
  [GlobalExceptionHandler]  (excepciones que llegan a la capa MVC)
    falla @Valid       → HTTP 400  { "message": "Validation failed" }
    contraseña incorrecta → HTTP 401  { "message": "Invalid email or password" }
    rol incorrecto     → HTTP 403  (AccessDeniedException)

  [JwtAuthenticationEntryPoint]  (rechazado dentro de la filter chain)
    sin token / token malo / caducado → HTTP 401
                                        { "message": "Authentication required" }
```

---

### Flujos de error — qué pasa cuando las cosas van mal

**Contraseña incorrecta:**

```
POST /api/auth/login { email: ok, password: incorrecta }
→ AuthService → authenticationManager.authenticate()
→ DaoAuthenticationProvider → BCrypt.matches() → SIN COINCIDENCIA
→ lanza BadCredentialsException
→ GlobalExceptionHandler.handleBadCredentials()
→ HTTP 401  { "error": "Invalid email or password" }
```

> Spring Security también convierte `UsernameNotFoundException` a `BadCredentialsException` internamente — así que un email incorrecto y una contraseña incorrecta devuelven el mismo mensaje 401. Intencional: si el API devolviera errores diferentes, un atacante podría enumerar emails válidos.

**Token expirado o manipulado:**

```
GET /api/projects  Authorization: Bearer <token-expirado-o-falso>
→ JwtFilter → JwtUtil.extractUsername(token)
→ parseClaims() → parseSignedClaims() lanza JwtException
→ isValid() captura JwtException → devuelve false
→ SecurityContextHolder NO se establece
→ filterChain.doFilter() continúa
→ SecurityFilterChain: .anyRequest().authenticated() → DENEGADO
→ AuthenticationException → JwtAuthenticationEntryPoint.commence()
→ HTTP 401 Unauthorized
{ "timestamp": ..., "status": 401,
  "error": "Unauthorized", "message": "Authentication required" }
```

**Autenticado pero rol incorrecto:**

```
POST /api/projects  Authorization: Bearer <token-empleado-válido>
→ JwtFilter valida token → establece EMPLOYEE en SecurityContextHolder
→ SecurityFilterChain: authenticated() → OK
→ @PreAuthorize("hasRole('MANAGER')") lee SecurityContextHolder
    rol actual: EMPLOYEE / rol requerido: MANAGER → EMPLOYEE ≠ MANAGER
→ lanza AccessDeniedException
→ HTTP 403 Forbidden
```

> **Nota la diferencia: 401 y 403 no son el mismo rechazo.** Un token ausente o inválido significa que Spring Security nunca llegó a autenticarte — obtienes **401 Unauthorized** con `"message": "Authentication required"`, producido por el `JwtAuthenticationEntryPoint` que conectas en la cadena (ver [AuthenticationEntryPoint — 401 en vez del 403 vacío por defecto](#authenticationentrypoint--401-en-vez-del-403-vacío-por-defecto) más abajo). Un rol incorrecto significa que *sí* estabas autenticado — Spring sabe exactamente quién eres — pero la comprobación de rol falló, así que obtienes **403 Forbidden**. De fábrica, sin ese entry point, Spring Security devolvería un 403 vacío para *ambos* casos, por eso la separación 401/403 es algo que tienes que configurar en vez de algo que obtienes gratis.

---

### Qué es responsable cada clase

| Clase                    | Flujo        | Responsabilidad                                                      |
| ------------------------ | ------------ | -------------------------------------------------------------------- |
| `SecurityConfig`         | Ambos        | Configura todas las reglas: rutas, registro de filtros, CORS         |
| `JwtUtil`                | Ambos        | Crea tokens (Flujo 1) y los valida (Flujo 2)                         |
| `UserDetailsServiceImpl` | Ambos        | Carga un usuario de la base de datos por email                       |
| `BCryptPasswordEncoder`  | Solo Flujo 1 | Compara contraseña raw contra hash almacenado                        |
| `AuthService`            | Solo Flujo 1 | Orquesta el login — llama a authenticate(), luego a generateToken()  |
| `AuthController`         | Solo Flujo 1 | Recibe el request HTTP de login, devuelve el token                   |
| `JwtFilter`              | Solo Flujo 2 | Intercepta cada request, valida JWT, establece SecurityContextHolder |
| `JwtAuthenticationEntryPoint` | Solo Flujo 2 | Escribe el JSON 401 cuando un request no lleva ninguna autenticación válida |
| `GlobalExceptionHandler` | Ambos        | Convierte excepciones en respuestas JSON limpias                     |

**Cómo leer esta tabla:** la columna **Flujo** te dice *cuándo* entra siquiera en juego la clase — las clases "Solo Flujo 1" existen solo para entregar un token, las de "Solo Flujo 2" existen solo para comprobar uno, y las "Ambos" son la fontanería compartida que corre en cualquier caso. Si estás depurando un login que falla, solo las filas de Flujo 1 y Ambos pueden ser la causa; si un token se rechaza en una ruta protegida, mira Flujo 2 y Ambos. La columna **Responsabilidad** es deliberadamente una frase cada una — si no puedes decir el trabajo de una clase en una frase, está haciendo demasiado.

---

### Por qué el orden de creación no es el orden del flujo

El flujo se lee de **arriba a abajo** — un request entra en `AuthController` y va más profundo hacia `JwtUtil`. El orden de creación se lee de **abajo a arriba** — construyes la dependencia más profunda primero, porque cada clase necesita las clases debajo de ella para compilar.

```
Orden del flujo (arriba-abajo)     Orden de creación (abajo-arriba)
AuthController                     1. Esqueleto SecurityConfig  ← abre TODAS las rutas
    ↓                                 (anyRequest().permitAll())   para poder probar cada
AuthService                                                         clase mientras la construyes
    ↓                              2. JwtUtil                   ← sin dependencias — standalone
DaoAuthenticationProvider                                           clase utilitaria; se construye primero
    ↓                              3. UserDetailsServiceImpl    ← depende de UserRepository
UserDetailsServiceImpl                (lee rol de User)
    ↓                              4. Beans SecurityConfig      ← PasswordEncoder + AuthManager
JwtUtil                               (PasswordEncoder,              expuestos aquí para que AuthService
    ↓                                 AuthenticationManager)        pueda inyectar AuthManager
SecurityFilterChain
                                   5. DTOs                      ← LoginRequest + AuthResponse
                                      (LoginRequest,
                                       AuthResponse)
                                   6. AuthService               ← depende de AuthManager (paso 4)
                                                                    y JwtUtil (paso 2)
                                   7. AuthController            ← depende de AuthService (paso 6)
                                   8. GlobalExceptionHandler    ← sin dependencias — standalone
                                   9. JwtFilter                 ← depende de JwtUtil (paso 2)
                                                                    y UserDetailsServiceImpl (paso 3)
                                  10. SecurityConfig final      ← depende de JwtFilter (paso 9)
                                      (registrar JwtFilter,         cierra rutas — /api/auth/**
                                       proteger rutas,              permitAll, todo lo demás
                                       añadir config CORS)          authenticated()
```

`SecurityConfig` es especial: aparece **primero** (como esqueleto que abre todas las rutas) y **último** (como versión final que las cierra). Abres las rutas al principio para poder probar cada clase mientras la construyes. Probar después de cada paso — no esperes hasta el paso 10 para ejecutar la app.

---

## Documentación

| Lo que necesitas hacer                                         | Lee esto                                                                                                                                        |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Generar y parsear tokens JWT en Java                           | [jjwt — Quickstart](https://github.com/jwtk/jjwt#quickstart)                                                                                    |
| Configurar la filter chain (SecurityFilterChain)               | [Java Configuration](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html)                                          |
| Establecer permisos a nivel de ruta (permitAll, authenticated) | [Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)                  |
| Configurar sesiones STATELESS para JWT                         | [Session Management](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html)                           |
| Hashing de contraseñas con BCrypt                              | [Spring Security — Password Storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)            |
| Cómo encaja UserDetailsService en el login                     | [DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html) |
| Comprobaciones de rol a nivel de método (@PreAuthorize)        | [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)                |

> **Companion práctico — Baeldung:** para cada concepto de este archivo, busca `baeldung <concepto>` (p.ej. "baeldung spring security jwt", "baeldung userdetailsservice", "baeldung preauthorize"). Baeldung muestra ejemplos de código reales y explica el por qué detrás de cada paso.

---

## Dependencias — qué añadir a pom.xml

### Spring Security

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**Qué hace al añadirlo:** bloquea inmediatamente cada endpoint con una página de login por defecto y una contraseña aleatoria impresa en la consola. Este es el comportamiento "deny all" por defecto de Spring Security — lo reemplazas con tu propio `SecurityConfig`.

### JJWT

JJWT es una librería Java para crear y validar tokens JWT. Está dividido en tres artifacts a propósito:

| Artifact       | Scope                   | Por qué                                                                             |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------- |
| `jjwt-api`     | (por defecto — compile) | La interfaz pública que importas en tu código                                       |
| `jjwt-impl`    | runtime                 | La lógica interna que crea y parsea tokens — nunca la referencias directamente      |
| `jjwt-jackson` | runtime                 | Gestiona la serialización JSON dentro del token — nunca la referencias directamente |

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

---

## Dónde va cada archivo — la estructura de paquetes

```
src/main/java/com/victor/timetrack/
├── security/
│   ├── JwtUtil.java                ← crea y valida tokens
│   ├── JwtFilter.java              ← se ejecuta en cada request
│   ├── JwtAuthenticationEntryPoint.java ← JSON 401 cuando no hay auth válida
│   └── SecurityConfig.java         ← todas las reglas de seguridad + beans
├── service/
│   ├── UserDetailsServiceImpl.java ← carga el usuario de la BD
│   └── AuthService.java            ← orquesta el login
├── controller/
│   └── AuthController.java         ← POST /api/auth/login
├── dto/
│   ├── request/
│   │   └── LoginRequest.java       ← lo que el cliente envía
│   └── response/
│       └── AuthResponse.java       ← lo que el servidor devuelve
├── exception/
│   └── GlobalExceptionHandler.java ← convierte excepciones en JSON limpio
└── model/
    ├── User.java                   ← entidad (ya existe)
    └── Role.java                   ← enum, añadido en el Paso 4
```

---

## Cómo funciona Spring Security — la filter chain

Spring Security no vive dentro de tus controladores. Funciona como una cadena de filtros que se sitúa delante de ellos. Cada request HTTP pasa por esta cadena antes de poder llegar a cualquier `@RestController`. Si un request falla una comprobación de seguridad, se rechaza ahí — el controlador nunca se ejecuta.

Configuras la cadena con un bean: `SecurityFilterChain`. Tu `JwtFilter` es un eslabón de esa cadena.

```
HTTP request
    ↓
[JwtFilter] ← tu filtro personalizado — lee y valida el JWT
    ↓
[Reglas de SecurityFilterChain] ← comprueba permisos de ruta
    ↓
[@RestController] ← solo se alcanza si todos los checks pasaron
```

---

## El flujo de login completo — cómo se conectan todas las piezas

Docs: [DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html)

Hay dos flujos separados. Entiende ambos — son diferentes.

**¿Cuándo ocurre cada flujo?**

- **Flujo 1** — cuando el usuario se loguea: envía email + contraseña y recibe un token. Esto pasa en el primer login, o cuando un token anterior ha caducado.
- **Flujo 2** — cada request después del login: el usuario ya tiene un token y lo envía en la cabecera para acceder a rutas protegidas.

---

**Flujo 1 — Login inicial (POST /api/auth/login)**

_Resumen rápido:_

```
1. Llega el request → JwtFilter se ejecuta, no ve token → pasa de largo
2. SecurityFilterChain comprueba la ruta → /api/auth/** es permitAll() → la permite
3. AuthController recibe el request → llama a AuthService.login()
4. AuthService llama a AuthenticationManager.authenticate()
5. AuthenticationManager delega en DaoAuthenticationProvider
6. DaoAuthenticationProvider llama a UserDetailsService.loadUserByUsername(email)
7. DaoAuthenticationProvider llama a PasswordEncoder.matches(rawPassword, hashedPassword)
8. Si ambas comprobaciones pasan → la autenticación tiene éxito
9. AuthService llama a JwtUtil.generateToken(email) → devuelve un JWT firmado
10. AuthController devuelve un AuthResponse con el token
```

_Paso a paso:_

**1. Llega el request → JwtFilter se ejecuta, no ve token → pasa de largo**
`security/JwtFilter.java` — Cada request pasa primero por `JwtFilter`. Busca una cabecera `Authorization: Bearer <token>`. En el login, el usuario todavía no tiene token, así que la cabecera no está. `JwtFilter` detecta esto y no hace nada — simplemente pasa el request al siguiente paso.

**2. SecurityFilterChain comprueba la ruta → `/api/auth/**` es `permitAll()` → la permite**
`security/SecurityConfig.java` — `SecurityFilterChain` es el conjunto de reglas de seguridad que configuraste. `permitAll()` significa "no se requiere autenticación para esta URL". Como marcaste `/api/auth/**` como pública, el endpoint de login pasa.

**3. AuthController recibe el request → llama a AuthService.login()**
`controller/AuthController.java` — El request llega a tu controller, que lee el body JSON (email + contraseña) y llama al service.

**4. AuthService llama a AuthenticationManager.authenticate()**
`service/AuthService.java` — Pasa el email y la contraseña en crudo al coordinador de Spring Security. Esto dispara todo el proceso de verificación.

**5. AuthenticationManager delega en DaoAuthenticationProvider**
Interno de Spring Security — `AuthenticationManager` no verifica nada por sí mismo. Delega en `DaoAuthenticationProvider`, la clase interna de Spring Security para logins de usuario/contraseña. Tú no escribes esta clase.

**6. DaoAuthenticationProvider llama a UserDetailsService.loadUserByUsername(email)**
`service/UserDetailsServiceImpl.java` — Va a la base de datos, busca al usuario por email, y devuelve un objeto `UserDetails` con el hash guardado y los roles.

**7. DaoAuthenticationProvider llama a PasswordEncoder.matches(rawPassword, hashedPassword)**
`security/SecurityConfig.java` (el bean `passwordEncoder()`) — Compara la contraseña en texto plano que envió el usuario con el hash BCrypt guardado en la base de datos. Si no coincide, se lanza `BadCredentialsException`.

**8. Si ambas comprobaciones pasan → la autenticación tiene éxito**
`authenticate()` retorna sin lanzar excepción. Esto significa: el usuario existe en la base de datos Y la contraseña es correcta.

**9. AuthService llama a JwtUtil.generateToken(email) → devuelve un JWT firmado**
`service/AuthService.java` + `security/JwtUtil.java` — Ahora que las credenciales están verificadas, se genera el token. El email va al claim `sub` y se firma con la clave secreta.

**10. AuthController devuelve un AuthResponse con el token**
`controller/AuthController.java` — La respuesta es un objeto JSON `{ "token": "eyJ..." }`. El cliente (Angular) lo guarda en `localStorage` y lo envía en cada request futuro.

---

**Flujo 2 — Cada request posterior (cualquier ruta protegida)**

_Resumen rápido:_

```
1. Llega el request con la cabecera: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
2. JwtFilter se ejecuta → extrae el token de la cabecera
3. JwtFilter llama a JwtUtil.extractUsername(token) → obtiene el email
4. JwtFilter llama a UserDetailsService.loadUserByUsername(email) → carga el usuario de la BD
5. JwtFilter llama a JwtUtil.isValid(token, email) → comprueba firma + expiración
6. Si es válido → JwtFilter pone al usuario en SecurityContextHolder
7. SecurityFilterChain comprueba la ruta → requiere authenticated() → el usuario está en el contexto → permitido
8. El request llega al controller
```

_Paso a paso:_

**1. Llega el request con la cabecera: `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...`**
Interceptor de Angular (frontend) — El cliente envía el token que guardó tras el login. Va en una cabecera — no en el body, no en una cookie.

**2. JwtFilter se ejecuta → extrae el token de la cabecera**
`security/JwtFilter.java` — Detecta la cabecera `Authorization`, quita el prefijo `Bearer ` (7 caracteres), y obtiene el string del token en crudo.

**3. JwtFilter llama a JwtUtil.extractUsername(token) → obtiene el email**
`security/JwtFilter.java` + `security/JwtUtil.java` — Lee el claim `sub` del payload del token. Es el email del usuario que se logueó.

**4. JwtFilter llama a UserDetailsService.loadUserByUsername(email) → carga el usuario de la BD**
`security/JwtFilter.java` + `service/UserDetailsServiceImpl.java` — Aunque el token ya contiene el email, Spring Security requiere cargar el `UserDetails` completo para obtener los roles actuales y confirmar que la cuenta sigue activa.

**5. JwtFilter llama a JwtUtil.isValid(token, email) → comprueba firma + expiración**
`security/JwtFilter.java` + `security/JwtUtil.java` — Verifica que el token se firmó con la clave secreta correcta (no manipulado) y que no ha caducado.

**6. Si es válido → JwtFilter pone al usuario en SecurityContextHolder**
`security/JwtFilter.java` — `SecurityContextHolder` es un almacenamiento thread-local que Spring Security lee durante todo el ciclo de vida del request. Poner al usuario ahí le dice a Spring: "este request está autenticado como este usuario".

**7. SecurityFilterChain comprueba la ruta → requiere authenticated() → el usuario está en el contexto → permitido**
`security/SecurityConfig.java` — Como `SecurityContextHolder` tiene un usuario válido, la regla de ruta `authenticated()` se cumple. El request se permite.

**8. El request llega al controller**
Cualquier controller — El controller ahora puede llamar a `SecurityContextHolder.getContext().getAuthentication()` para saber quién hace el request, sin volver a comprobar la base de datos.

Spring Security sabe quién hace el request gracias a `SecurityContextHolder` — no hace falta comprobar la contraseña, solo el token.

**Por qué existe cada clase:**

| Clase                    | Rol en el flujo                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JwtUtil`                | Crea y valida tokens JWT                                                                                                                                     |
| `UserDetailsServiceImpl` | Carga un usuario de la base de datos por email                                                                                                               |
| `AuthService`            | Orquesta el login: llama a `AuthenticationManager`, genera el token                                                                                          |
| `AuthController`         | Recibe el request HTTP, devuelve el token                                                                                                                    |
| `JwtFilter`              | Intercepta cada request posterior y valida el token                                                                                                          |
| `SecurityConfig`         | Configura qué rutas son públicas, cuáles protegidas, y registra todos los beans de arriba                                                                    |
| `AuthenticationManager`  | Coordinador interno de Spring Security — recibe el intento de login y delega en `DaoAuthenticationProvider`. Registrado como `@Bean` en `SecurityConfig`     |

---

## JWT — qué es y por qué funciona para autenticación stateless

Docs: [jwt.io/introduction](https://jwt.io/introduction)

JWT (JSON Web Token) es un token firmado y autocontenido. Tiene tres partes separadas por puntos:

```
header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0.abc123
```

- **Header** — qué algoritmo de firma se usó (p.ej. HS256)
- **Payload** — los claims: datos del usuario almacenados como pares clave-valor (`sub` = email, `iat` = issued at, `exp` = expiración)
- **Signature** — HMAC de header + payload usando la clave secreta — demuestra que el token no fue manipulado

> **¿Qué es HMAC?** Hash-based Message Authentication Code. En palabras simples: pasa el header + payload por un hash de una sola dirección **mezclado con tu clave secreta** para producir una huella corta — la firma. Cualquiera puede recalcularla, pero solo quien conoce el secreto puede producir la huella *correcta*. Así que si un solo carácter del payload cambia, la firma recalculada ya no coincide y el token se rechaza. Eso es exactamente lo que hacen `.signWith()` (al crear) y `.verifyWith()` (al leer) en `JwtUtil` más abajo.

Cualquier servidor con la misma clave secreta puede verificar el token sin llamar a la base de datos. Este es el punto — sin sesión, sin estado compartido, solo un token firmado que el cliente lleva en cada request.

Una limitación importante: no puedes invalidar un JWT antes de que caduque. Una vez emitido, el token es válido hasta que pasa su claim `exp` — no hay estado del lado del servidor que borrar. Si un usuario cierra sesión o su cuenta se banea, el token sigue funcionando hasta que caduca. La solución práctica es un tiempo de expiración corto (15–60 minutos). El workaround es una lista negra de tokens guardada en Redis, pero eso introduce estado del lado del servidor y derrota parcialmente el propósito de la autenticación stateless.

**Un claim es un par clave-valor guardado en el payload.** Claims estándar: `sub` (subject = a quién pertenece el token), `iat` (issued at, cuándo se emitió), `exp` (expiration, cuándo caduca). Los lees de vuelta al validar el token.

---

## Orden de construcción — crea primero el esqueleto de SecurityConfig

Las secciones de abajo explican cada clase en **orden de concepto** — lo más simple y autocontenido primero, empezando por `JwtUtil`. Pero no las *construyes* en ese orden. Las construyes en el **orden de creación** de 10 pasos de la sección "Por qué el orden de creación no es el orden del flujo" de arriba — y el paso 1 ahí **no** es `JwtUtil`, es el esqueleto de `SecurityConfig`.

¿Por qué primero? En el momento en que añadiste `spring-boot-starter-security`, Spring bloqueó cada endpoint detrás de una página de login por defecto. Hasta que un `SecurityConfig` abra las rutas, no puedes probar nada en Postman. Así que antes de escribir `JwtUtil`, crea el esqueleto de desarrollo mostrado en la sección "SecurityFilterChain → Durante el desarrollo" (la versión con `anyRequest().permitAll()`). Abre todas las rutas para que cada clase que construyas a continuación sea testeable de inmediato. En el último paso la reemplazas por la versión final bloqueada.

> **En resumen:** lee las secciones de arriba a abajo para *entender* cada clase, pero *ensámblalas* en el orden de creación numerado. El esqueleto de `SecurityConfig` es el paso 1 aunque su código viva cerca del final de este archivo — no esperes a llegar a esa sección para crearlo.

---

## JwtUtil — generar y validar tokens

Archivo: `src/main/java/com/victor/timetrack/security/JwtUtil.java`

Docs a leer antes de escribir esta clase:

- [Quickstart](https://github.com/jwtk/jjwt#quickstart) — lee los dos fragmentos de código: `parseSignedClaims` y el `try/catch`. Para ahí.
- [Reading a JWT](https://github.com/jwtk/jjwt#reading-a-jwt) — lee solo la lista de 5 pasos de arriba. Para antes de "Constant Parsing Key".

`JwtUtil` es un `@Component` (un bean de Spring sin rol específico). Tiene dos campos `@Value` que leen de `application.properties`, y cinco métodos — tres públicos y dos privados.

Las secciones de abajo explican cada parte en el orden en que aparece en la clase:

### application.properties — config JWT

```properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
```

`app.jwt` es solo una convención de nombrado — tú inventas los nombres de las propiedades. El patrón `${JWT_SECRET}` lee de una variable de entorno al arrancar, igual que funciona `${DB_PASSWORD}`. `86400000` son 24 horas en milisegundos.

**El JWT_SECRET siempre debe ser un string codificado en Base64.** ¿Por qué? Porque las variables de entorno son solo texto — no puedes guardar bytes binarios en crudo ahí dentro. Una clave criptográfica es datos binarios (simplemente una secuencia de bytes). Base64 convierte esos bytes en un string de texto seguro que puedes guardar en cualquier sitio. Cuando la app arranca, `getSigningKey()` lo decodifica de vuelta a los bytes en crudo para construir la clave criptográfica real.

Necesitas generar ese string Base64 una vez, y hay dos formas de hacerlo — `openssl` o un pequeño fragmento de jjwt, ambos mostrados justo abajo. Producen el mismo tipo de resultado: un string Base64 que copias y guardas como la variable de entorno `JWT_SECRET` en IntelliJ. Elige el que te resulte más cómodo — las dos opciones son solo herramientas distintas para exactamente el mismo trabajo.

**Opción 1 — openssl** (la más simple):

Ejecuta esto en cualquier terminal:

```
openssl rand -base64 32
```

Imprime un string Base64. Cópialo. Listo.

**Opción 2 — código jjwt** (si no tienes openssl):

Esto **no** es código de la aplicación. Es un fragmento de usar una vez y tirar. Aquí es dónde ponerlo:

1. En IntelliJ, clic derecho en cualquier parte de `src/main/java` → New → Java Class → ponle el nombre que quieras, p.ej. `GenerateSecret`
2. Añade un método `main` y pega esto dentro:

```java
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;
import javax.crypto.SecretKey;

public class GenerateSecret {
    public static void main(String[] args) {
        SecretKey key = Jwts.SIG.HS256.key().build();
        String secretString = Encoders.BASE64.encode(key.getEncoded());
        System.out.println(secretString);
    }
}
```

3. Ejecútalo — imprime un string Base64 en la consola. Cópialo.
4. **Borra la clase** — solo hacía falta para generar el valor una vez. Nunca la commitees.

Esta opción es mejor que openssl porque jjwt valida automáticamente la longitud de la clave para HS256.

**Después de generar el string — establece la variable de entorno en IntelliJ:**

1. Run → Edit Configurations → selecciona tu configuración de ejecución de Spring Boot
2. Modify options → Environment variables
3. Añade: `JWT_SECRET=<el string que copiaste>`
4. Haz clic en OK

La app lo lee al arrancar vía `${JWT_SECRET}` en `application.properties`. El mismo patrón que `DB_PASSWORD`.

### Leer valores de config con @Value

Docs: [Spring @Value annotation](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/value-annotations.html)

`@Value` es una anotación de Spring que lee un valor de `application.properties` y lo asigna al campo de la línea siguiente. El `${...}` de dentro es el nombre de la propiedad — Spring lo busca al arrancar e inyecta el valor.

```java
@Value("${app.jwt.secret}")
private String secret;        // Spring lee app.jwt.secret y lo asigna aquí

@Value("${app.jwt.expiration}")
private long expiration;      // Spring lee app.jwt.expiration y lo asigna aquí
                              // primitivo long (no Long) — este valor siempre está presente, nunca null
```

> **¿`long` vs `Long`?** `long` (minúscula) es un *primitivo* — un número simple que siempre tiene un valor y nunca puede ser `null`. `Long` (mayúscula) es el wrapper objeto que lo envuelve, que *sí* puede ser `null`. Aquí quieres `long` porque el `expiration` siempre viene de `application.properties`, así que está garantizado que esté presente — usar el primitivo documenta esa intención y evita un `null` accidental. Explicación completa de primitivos vs wrappers en [java/01-variables-tipos.md](../../../java/junior/es/01-variables-tipos.md).

### getSigningKey() — la base

Docs: [jjwt — Creating Safe Keys](https://github.com/jwtk/jjwt#creating-safe-keys) · [jjwt — Base64 Support](https://github.com/jwtk/jjwt#base64-support)

**Propósito:** privado — nunca se llama desde fuera de `JwtUtil`. Convierte el string `JWT_SECRET` en crudo en un objeto `SecretKey` que jjwt puede usar. Cualquier otro método que crea o lee un token llama a este primero — sin la clave, nada más funciona.

La variable de entorno `JWT_SECRET` se guarda como un **string Base64**. Base64 es una forma de representar datos binarios (bytes en crudo) como texto plano — así puedes guardarlo de forma segura en un fichero de config o variable de entorno sin que caracteres especiales causen problemas.

jjwt no puede usar el texto Base64 directamente como clave. Necesita los bytes en crudo que ese string Base64 representa. `getSigningKey()` hace esa conversión en dos pasos:

```java
private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
}
```

**`Decoders.BASE64.decode(secret)`** — `Decoders` es una clase de utilidad de jjwt, de `jjwt-api`. Coge el string Base64 (p.ej. `"K7fqJk2m..."`) y lo convierte de vuelta a los bytes originales en crudo — un `byte[]`. Esto es lo inverso de lo que hace la codificación Base64.

**`Keys.hmacShaKeyFor(keyBytes)`** — `Keys` es otra clase de utilidad de jjwt. El `byte[]` en crudo es solo una lista de números — el sistema de criptografía de Java no lo acepta directamente para firmar. Requiere un tipo de objeto específico llamado `SecretKey`. Este método coge los bytes en crudo y crea un objeto `SecretKey` — los mismos bytes dentro, solo envueltos en el tipo que aceptan tanto `.signWith()` como `.verifyWith()`. También comprueba que la clave sea lo bastante larga para HMAC-SHA256 (al menos 256 bits = 32 bytes). Si es demasiado corta, lanza una excepción al arrancar en lugar de producir firmas débiles en silencio.

### generateToken() — construir el token firmado

Docs: [jjwt — Creating a JWT](https://github.com/jwtk/jjwt#creating-a-jwt)

**Propósito:** lo llama `AuthService` cuando un usuario se loguea exitosamente. Coge el email del usuario, construye un JWT firmado con un tiempo de expiración, y devuelve el string del token que el servidor envía de vuelta al cliente. El cliente guarda este token y lo envía en cada request futuro.

```java
public String generateToken(String username) {
    return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
}
```

**`.subject(username)`** — guarda el email del usuario en el claim `sub` (subject). Esta es la forma estándar de JWT para identificar a quién pertenece el token. Al validar más tarde, llamas a `parseClaims(token).getSubject()` para leerlo de vuelta.

**`.issuedAt(new Date())`** — guarda el timestamp actual en el claim `iat` (issued at). No es obligatorio, pero es buena práctica — le dice al receptor exactamente cuándo se creó el token.

**`.expiration(new Date(System.currentTimeMillis() + expiration))`** — guarda el timestamp de expiración en el claim `exp`. `new Date(long)` toma un timestamp en milisegundos desde el 1 de enero de 1970. `currentTimeMillis()` te da el ahora. Sumar `expiration` (86400000 = 24 horas en ms) te da el momento exacto dentro de 24 horas. jjwt comprueba esto automáticamente durante `parseSignedClaims` — si el token ha pasado ese momento, lanza `ExpiredJwtException` y nunca obtienes un objeto `Claims` de vuelta.

**`.signWith(getSigningKey())`** — firma el header + payload con la clave secreta. La firma es la tercera parte de `header.payload.signature`. Sin esto, cualquiera podría cambiar el payload y el servidor no tendría forma de detectarlo.

**`.compact()`** — ensambla todo: codifica en Base64URL el header y el payload, calcula la firma, une las tres partes con puntos, y devuelve el string final compacto del JWT.

### parseClaims() — leer el payload del token

Docs: [jjwt — Reading a JWT](https://github.com/jwtk/jjwt#reading-a-jwt)

**Propósito:** helper privado — nunca se llama desde fuera de `JwtUtil`. Tanto `extractUsername` como `isValid` dependen de él. Verifica la firma del token, comprueba la expiración, y devuelve el payload como un mapa `Claims`. Si algo está mal (caducado, manipulado, malformado), lanza `JwtException` — quien lo llama nunca recibe un `Claims` de vuelta.

```java
private Claims parseClaims(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
}
```

**`Jwts.parser()`** — el punto de partida para leer un token, igual que `Jwts.builder()` es el punto de partida para crear uno. Devuelve un builder que configuras antes de parsear.

**`.verifyWith(getSigningKey())`** — establece la clave secreta que el parser usará para comprobar la firma. Debe ser la misma clave usada en `generateToken()` — si es diferente, la firma no coincide y `.parseSignedClaims()` lanza una excepción.

**`.build()`** — bloquea la configuración del parser y devuelve un `JwtParser` listo para usar. El patrón builder separa la configuración del uso: estableces las opciones (como la clave de firma) antes de `.build()`, y después de `.build()` solo llamas a métodos de parseo. El parser devuelto es inmutable — seguro para reutilizar en múltiples requests sin reconfigurarlo cada vez. Es el mismo patrón `.build()` que usa `Jwts.builder()` en el lado de generación: configura primero, usa después.

**`.parseSignedClaims(token)`** — hace todo el trabajo en una sola llamada: comprueba la firma, comprueba que el token no haya caducado, y parsea el payload. Si algo está mal — firma incorrecta, caducado, string malformado — lanza `JwtException` inmediatamente. Solo obtienes un resultado si todo es válido.

**`.getPayload()`** — extrae el mapa de claims del resultado. El mapa contiene los valores guardados cuando se creó el token: `sub` (email), `iat` (issued at), `exp` (expiration).

### extractUsername() — leer el claim subject

**Propósito:** lo llama `JwtFilter` como primer paso cuando llega un request. El filtro necesita saber qué usuario envió el request antes de poder buscarlo en la base de datos. Este método extrae ese email del payload del token.

```java
public String extractUsername(String token) {
    return parseClaims(token).getSubject();
}
```

**`parseClaims(token)`** — verifica el token y devuelve el mapa `Claims`. Lanza `JwtException` si el token es inválido o ha caducado — esa excepción intencionadamente no se captura aquí. Quien lo llama (`isValid()`) la gestiona.

**`.getSubject()`** — lee la clave `sub` del mapa `Claims`. Devuelve el email que guardamos cuando se creó el token.

### isValid() — comprobación de validación completa

**Propósito:** lo llama `JwtFilter` después de cargar el usuario de la base de datos. Responde a una pregunta: ¿puedo confiar en este token? Comprueba que el token sea estructuralmente válido (no caducado, no manipulado) y que el email de dentro coincida con el usuario que acabamos de cargar. Si es así, el filtro deja pasar el request.

```java
public boolean isValid(String token, String email) {
    try {
        return extractUsername(token).equals(email);
    } catch (JwtException e) {
        return false;
    }
}
```

**`extractUsername(token).equals(email)`** — `extractUsername` llama a `parseClaims` internamente, que lanza `JwtException` si el token está caducado, manipulado, o malformado. Si no lanza, el token es estructuralmente válido — entonces también compruebas que el email de dentro coincida con el que esperas. Ambas comprobaciones pasan en una línea.

**`catch (JwtException e) { return false }`** — cualquier problema con el JWT (caducado, firma incorrecta, malformado) cae aquí. Devolver `false` es más limpio que dejar que la excepción se propague — `JwtFilter` simplemente recibe un booleano y rechaza el request en silencio, sin stack trace.

### Clase JwtUtil completa

```java
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token, String email) {
        try {
            return extractUsername(token).equals(email);
        } catch (JwtException e) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
```

---

## UserDetailsService — enseñarle a Spring dónde están tus usuarios

Docs: [Baeldung — Database-backed UserDetailsService](https://www.baeldung.com/spring-security-authentication-with-a-database) (empieza aquí — ejemplo completo funcionando) · [Spring Security — UserDetailsService](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html) · [DaoAuthenticationProvider — flujo completo](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider)

> **Los docs oficiales son de estilo referencia — explican qué es cada pieza, no cómo conectarlas.** Para un recorrido práctico con ejemplos de código, busca **"baeldung spring security userdetailsservice"** — Baeldung (baeldung.com) es el compañero práctico de referencia para desarrolladores Spring. Cada concepto de este archivo tiene un artículo de Baeldung junto a los docs oficiales. Usa ambos: docs oficiales para la definición autorizada, Baeldung para el ejemplo de "cómo escribo esto de verdad".

Archivo: `src/main/java/com/victor/timetrack/service/UserDetailsServiceImpl.java`

Del flujo de `DaoAuthenticationProvider` (ver la sección "El flujo de login completo" de arriba):

- **Paso 3** — `DaoAuthenticationProvider` llama a `UserDetailsService.loadUserByUsername(email)` para cargar el usuario de tu base de datos
- **Paso 4** — `DaoAuthenticationProvider` coge el objeto `UserDetails` devuelto por el paso 3 y usa `PasswordEncoder` para comparar el hash guardado con lo que envió el usuario

Esto significa que `UserDetailsService` tiene un trabajo: recibe un email, va a la base de datos, devuelve un objeto `UserDetails`. `DaoAuthenticationProvider` gestiona la comprobación de contraseña él mismo — tú no lo haces aquí.

Nunca llamas a `loadUserByUsername()` tú mismo. Spring Security lo llama automáticamente durante el login. Tu único trabajo es implementarlo correctamente y registrar la clase como `@Service` para que Spring la encuentre.

**¿Qué es `UserDetails`?**

`UserDetails` es una interfaz de Spring Security que representa a un usuario. Tiene cuatro cosas que Spring Security necesita para funcionar:

- `getUsername()` — el identificador de login (el email en tu caso)
- `getPassword()` — la contraseña hasheada guardada en la base de datos
- `getAuthorities()` — los roles/permisos (p.ej. `ROLE_USER`, `ROLE_MANAGER`)
- Cuatro flags booleanos — `isEnabled()`, `isAccountNonExpired()`, `isAccountNonLocked()`, `isCredentialsNonExpired()` — cada uno es una comprobación de estado de la cuenta, y si alguno devuelve `false`, Spring Security bloquea el login (por ejemplo, una cuenta deshabilitada o bloqueada). El `User.builder()` de Spring pone los cuatro en `true` por defecto, así que solo sobreescribes los que realmente necesitas.

Spring Security no sabe nada de tu entidad `User` — solo trabaja con `UserDetails`. Tu trabajo es coger tu entidad y convertirla en un objeto `UserDetails`. Eso es lo que hace el builder `User.withUsername(...).build()` al final de `loadUserByUsername()`.

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword())
            .roles("USER") // placeholder — reemplazado en el Paso 4 cuando se añade el rol a la entidad User
            .build();
    }
}
```

**`implements UserDetailsService`** — esta es una interfaz de Spring Security con un método obligatorio. Implementarla es cómo Spring descubre tu lógica personalizada de búsqueda de usuarios.

**`private final UserRepository userRepository` + constructor** — `private final` significa que el campo no puede cambiar después de crear el objeto. El constructor recibe la dependencia de Spring (inyección por constructor). Este es el patrón recomendado frente a `@Autowired` — hace las dependencias explícitas y la clase más fácil de testear.

**`loadUserByUsername(String username)`** — a pesar del nombre, `username` aquí es el email. Spring Security usa "username" como término genérico para "el identificador usado para loguearse". La firma del método la fija la interfaz — no puedes renombrar el parámetro.

**`throws UsernameNotFoundException`** — esto es parte del contrato de la interfaz. Le dice a Java que este método puede lanzar esa excepción. El lanzamiento real ocurre dentro con `.orElseThrow()` — pero debes declararlo en la firma porque la interfaz lo requiere.

**`.orElseThrow(() -> new UsernameNotFoundException(...))`** — si no se encuentra ningún usuario en la base de datos, lanza `UsernameNotFoundException`. Spring Security la captura y la convierte automáticamente en una respuesta 401.

**`org.springframework.security.core.userdetails.User.withUsername(...).password(...).roles(...).build()`** — este es el builder `User` propio de Spring Security, no tu entidad `User`. Crea un objeto `UserDetails` — el tipo con el que Spring Security trabaja internamente. `.roles()` añade automáticamente el prefijo `ROLE_` que Spring Security espera (así `"MANAGER"` se convierte en `"ROLE_MANAGER"`).

> **Conflicto de import a evitar:** Spring Security tiene su propia clase llamada `User` (`org.springframework.security.core.userdetails.User`). Tu entidad también se llama `User`. Si importas la de Spring Security, la variable del lado izquierdo (`User user = userRepository.findByEmail(...)`) fallará por incompatibilidad de tipos. Solución: importa tu entidad (`com.victor.timetrack.model.User`) y usa la ruta completamente cualificada para el builder de Spring Security (`org.springframework.security.core.userdetails.User.withUsername(...)`).

> **¿Nuevo en Java? Tres cosas en las líneas de arriba.** `findByEmail(username)` devuelve un **`Optional<User>`** — una caja que puede o no contener un usuario — y `.orElseThrow(...)` abre la caja o lanza si está vacía ([java/10-genericos.md — el patrón más común en Spring Boot](../../../java/junior/es/10-genericos.md#el-patrón-más-común-en-spring-boot)). El `() -> new UsernameNotFoundException(...)` de dentro es un **lambda** — una función sin nombre que Spring ejecuta *solo si* la caja está vacía ([java/09-streams-lambdas.md](../../../java/junior/es/09-streams-lambdas.md#sintaxis-de-lambdas)). Y `throws UsernameNotFoundException` en la firma es la regla de **excepción comprobada** — Java te obliga a declararla ([java/08-excepciones.md](../../../java/junior/es/08-excepciones.md)).

---

## BCryptPasswordEncoder — nunca almacenes contraseñas en texto plano

Docs: [Spring Security — Password Storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html) — lee solo la sección de **BCryptPasswordEncoder** (pasa de largo `DelegatingPasswordEncoder`). La página oficial confunde porque empieza con `DelegatingPasswordEncoder`, que es un wrapper más complejo que no usas aquí. Ve directo a BCrypt. Para una explicación más clara con ejemplos, empieza con [Baeldung — BCrypt password encoding](https://www.baeldung.com/spring-security-registration-password-encoding-bcrypt).

Archivo: `src/main/java/com/victor/timetrack/security/SecurityConfig.java` (definido como `@Bean`)

> **Este `@Bean` vive *dentro* de la clase `SecurityConfig`.** Si todavía no has creado esa clase, es normal — es el paso 1 del orden de creación, pero su código completo está cerca del final de este archivo. Usa el esqueleto de desarrollo y añade este método dentro. El bean `AuthenticationManager` de la siguiente sección va en la misma clase — ambos beans comparten el mismo `SecurityConfig`.

Si la base de datos se compromete alguna vez, las contraseñas en texto plano exponen a todos los usuarios inmediatamente. BCrypt es un algoritmo de hashing de una sola dirección — no puedes revertir un hash de vuelta a la contraseña original. Cada hash también incluye una "salt" aleatoria, así que dos usuarios con la misma contraseña producen hashes diferentes.

```java
// SecurityConfig.java — define el bean una vez
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

No llamas a `.matches()` tú mismo. `DaoAuthenticationProvider` lo llama internamente cuando llamas a `authenticationManager.authenticate(...)` en `AuthService`. Solo necesitas el bean — Spring Security hace el resto.

Cuando creas una nueva cuenta de usuario (p.ej. en `UserService.create()`), llamas a `.encode()` tú mismo para hashear la contraseña antes de guardarla:

```java
// UserService.java — hashea la contraseña antes de guardar un usuario nuevo
user.setPassword(passwordEncoder.encode(request.getPassword()));
userRepository.save(user);
```

**`new BCryptPasswordEncoder()`** — crea un encoder usando BCrypt con la fuerza por defecto (10 rondas). Más rondas = hashing más lento = más difícil de fuerza bruta. El valor por defecto es un buen equilibrio para la mayoría de apps.

> **El cost factor vive dentro del hash.** Un hash BCrypt empieza con `$2a$10$...` — ese `10` es el coste con el que se generó. `.matches()` lee el coste directamente del hash guardado, así que el login funciona incluso cuando el hash se creó con un coste *diferente* al del encoder por defecto. Por eso los pasos de prueba más abajo pueden hashear una contraseña con coste 12 (y el fichero seed con coste 10) y ambos siguen verificándose contra un encoder por defecto de 10 — el número que eliges al generar un hash no tiene que coincidir con el del encoder. Así que no te preocupes si los cost factors parecen inconsistentes: cada hash lleva el suyo.

**`.matches(raw, encoded)`** — hashea el string `raw` y comprueba si coincide con el hash `encoded` guardado. Nunca necesitas decodificar el hash — BCrypt está diseñado para ir solo en una dirección.

> Nunca llames a `.encode()` sobre una contraseña que ya está hasheada — hashearías el hash. Pasa siempre solo la contraseña en crudo que vino del usuario.

---

## Bean AuthenticationManager — exponer el coordinador de login

Archivo: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Docs: [Baeldung — AuthenticationProvider in Spring Security](https://www.baeldung.com/spring-security-authentication-provider) (cómo el manager delega en un provider) · [Spring Security — AuthenticationManager](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationmanager) — lee solo la sección de **AuthenticationManager**

Spring Boot auto-configura un `AuthenticationManager` internamente — lo conecta automáticamente con tu `UserDetailsService` y `PasswordEncoder`. Pero no lo expone como bean de Spring por defecto.

`AuthService` necesita inyectarlo para llamar a `.authenticate()` durante el login. Para que esa inyección funcione, debes exponerlo explícitamente con `@Bean`.

```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

**`AuthenticationConfiguration config`** — Spring lo inyecta automáticamente. Es una clase de Spring que contiene el `AuthenticationManager` ya configurado — el que está conectado con tus beans `UserDetailsService` y `PasswordEncoder`.

**`config.getAuthenticationManager()`** — recupera el `AuthenticationManager` preconfigurado. No lo construyes tú mismo — Spring ya lo construyó usando tus beans. Solo lo expones para que otras clases puedan inyectarlo.

**`throws Exception`** — necesario porque `getAuthenticationManager()` está declarado con `throws Exception` en el código fuente de Spring. Debes declararlo también en la firma de tu método.

> Nunca llamas a `authenticationManager()` directamente. Spring lo inyecta en `AuthService` automáticamente. La anotación `@Bean` es lo que hace posible la inyección.

---

## DTOs — LoginRequest y AuthResponse

Los DTOs (Data Transfer Objects) son clases simples que definen la forma de los datos que cruzan la frontera HTTP — lo que el cliente envía en el body del request, y lo que el servidor devuelve en la respuesta. No son entidades y no interactúan con la base de datos.

Ambos usan anotaciones de Lombok para evitar escribir a mano getters, setters y constructores repetitivos.

### LoginRequest

Archivo: `src/main/java/com/victor/timetrack/dto/request/LoginRequest.java`

Lo que el cliente envía en el body de `POST /api/auth/login`:

```json
{ "email": "user@test.com", "password": "password123" }
```

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
```

**`@Data`** (Lombok) — genera `getEmail()`, `getPassword()`, `setEmail()`, `setPassword()`, `equals()`, `hashCode()`, y `toString()` automáticamente. Nunca los escribes a mano.

**`@NoArgsConstructor`** (Lombok) — genera un constructor sin argumentos. Jackson (la librería JSON que usa Spring Boot) lo necesita para deserializar el body JSON en un objeto `LoginRequest`.

**`@AllArgsConstructor`** (Lombok) — genera un constructor que recibe todos los campos. Útil para tests.

**`@NotBlank`** — una anotación de Bean Validation. `@NotBlank` significa: no null, no vacío, y no solo espacios en blanco. Cuando `@Valid` está presente en el parámetro del método del controller, Spring valida todos los campos `@NotBlank` antes de que se ejecute el método. Si la validación falla, se lanza `MethodArgumentNotValidException` y `GlobalExceptionHandler` devuelve un 400.

### AuthResponse

Archivo: `src/main/java/com/victor/timetrack/dto/response/AuthResponse.java`

Lo que el servidor devuelve tras un login exitoso:

```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
```

Este es el DTO más simple posible — un solo campo. Spring lo serializa a JSON automáticamente vía Jackson cuando el controller lo devuelve dentro de un `ResponseEntity`.

> Ninguno de los dos DTOs extiende ninguna clase ni implementa ninguna interfaz. Son solo clases Java simples. Lombok gestiona el boilerplate; las anotaciones de validación gestionan las reglas de entrada.

---

## AuthService — orquestar el login

Archivo: `src/main/java/com/victor/timetrack/service/AuthService.java`

Docs: [Baeldung — Spring Security form login](https://www.baeldung.com/spring-security-login) (el flujo de `authenticate()` de principio a fin) · [DaoAuthenticationProvider — flujo completo](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider) — lee la sección **DaoAuthenticationProvider**

**Propósito:** lo llama `AuthController` cuando llega un request de login. Coordina el login completo: verifica las credenciales vía `AuthenticationManager`, genera un JWT vía `JwtUtil`, y devuelve un `AuthResponse` con el token.

### Por qué estas dos dependencias

`AuthService` necesita exactamente dos cosas inyectadas:

**`AuthenticationManager`** — lo expusiste como `@Bean` en `SecurityConfig` precisamente para que se pueda inyectar aquí. Sin esa definición de `@Bean`, Spring no puede inyectarlo y lanza un error al arrancar. Este es el objeto que coordina todo el login: llama a `UserDetailsService` para cargar el usuario y a `PasswordEncoder` para comparar contraseñas.

**`JwtUtil`** — creado en el Paso 1 con `@Component`. Spring ya lo gestiona. `AuthService` lo usa para generar el token una vez el login tiene éxito. Ambas dependencias llegan vía constructor — el mismo patrón que cualquier otra clase de este proyecto.

```java
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }
}
```

**`authenticationManager.authenticate(...)`** — dispara el flujo de login completo de Spring Security internamente: llama a `UserDetailsService.loadUserByUsername()` para cargar el usuario de la base de datos, y luego a `PasswordEncoder.matches()` para comparar la contraseña en crudo contra el hash guardado. Si cualquiera de las dos comprobaciones falla, lanza `BadCredentialsException` — no la capturas aquí. `GlobalExceptionHandler` la gestionará y devolverá un error JSON limpio.

**`new UsernamePasswordAuthenticationToken(email, password)`** — una clase de Spring Security que actúa como simple portador de datos para un intento de login. Contiene dos valores: el email (principal) y la contraseña en crudo (credenciales). La creas con `new` porque no es un bean de Spring — es solo un objeto que le pasas a `authenticate()`. `AuthenticationManager` lee el email y la contraseña de ahí y se los pasa a `DaoAuthenticationProvider`.

**`request.getEmail()` y `request.getPassword()`** — `LoginRequest` usa la anotación `@Data` de Lombok, que genera getters estándar automáticamente. Por eso llamas a `request.getEmail()` en lugar de acceder al campo directamente. Si `LoginRequest` fuera un `record` de Java en su lugar, llamarías a `request.email()` — pero con clases Lombok, siempre usa el prefijo `get`.

**`jwtUtil.generateToken(request.getEmail())`** — se llama solo después de que `authenticate()` retorne sin lanzar excepción. En ese punto las credenciales están verificadas — es seguro generar el JWT firmado. El email va al claim `sub` del token, exactamente como se documenta en la sección `JwtUtil` de arriba.

**`new AuthResponse(token)`** — envuelve el string del token en el DTO. `AuthController` recibirá este objeto y Spring lo serializará a JSON automáticamente antes de enviarlo al cliente.

> `AuthService` nunca toca la base de datos directamente. Delega todas las comprobaciones de credenciales a `AuthenticationManager` y toda la lógica de tokens a `JwtUtil`. Sin inyección de `UserRepository` aquí — esa separación es intencionada.

---

## AuthController — el endpoint de login

Archivo: `src/main/java/com/victor/timetrack/controller/AuthController.java`

Docs: [Spring — @RequestMapping](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html) — lee solo las secciones de **Explicit Registrations** y **URI patterns**

**Propósito:** recibe `POST /api/auth/login`, pasa el request a `AuthService`, y devuelve el token como JSON. Este es el único endpoint público de la API — todo lo demás requiere un JWT válido.

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
```

**`@RestController`** — marca la clase como un controller que devuelve JSON automáticamente. Por debajo agrupa dos anotaciones más antiguas para que no las escribas a mano: `@Controller` (esta clase gestiona requests web entrantes) y `@ResponseBody` (lo que devuelve un método se convierte en el body de la respuesta como JSON, en lugar de tratarse como el nombre de una página HTML a renderizar).

**`@RequestMapping("/api/auth")`** — establece la URL base para todos los endpoints de esta clase. Cada método de dentro estará bajo `/api/auth`. Combinado con `@PostMapping("/login")`, la URL completa es `POST /api/auth/login`.

**`@PostMapping("/login")`** — mapea este método a `POST /api/auth/login`. `@PostMapping` es un atajo para `@RequestMapping(method = RequestMethod.POST)`.

**`@RequestBody LoginRequest request`** — le dice a Spring que lea el body JSON del request y lo convierta en un objeto `LoginRequest` automáticamente. Spring usa Jackson (incluido con Spring Boot) para hacer la conversión.

**`@Valid`** — dispara las anotaciones de validación de `LoginRequest` (`@NotBlank` en email y password). Si la validación falla, Spring devuelve un error 400 automáticamente antes de que el método se ejecute — `AuthService` nunca se llama.

**`ResponseEntity<AuthResponse>`** — el tipo de retorno que te deja controlar el código de estado HTTP. `ResponseEntity.ok(body)` devuelve el status 200 con el body serializado como JSON. Usar `ResponseEntity` es el estándar en los controllers de Spring Boot — hace el código de estado explícito y visible en el código.

> `AuthController` no tiene lógica — solo recibe el request, delega a `AuthService` y envuelve el resultado en un `ResponseEntity`. Toda la lógica de negocio vive en la capa de service.

---

## GlobalExceptionHandler — respuestas de error limpias

Archivo: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

Docs: [Spring — @ControllerAdvice](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html)

**Propósito:** captura excepciones lanzadas en cualquier parte de la aplicación y las convierte en respuestas JSON limpias con el código de estado HTTP correcto. Sin esto, Spring devuelve una página de error HTML genérica o un 500 confuso — el cliente no tiene ni idea de qué salió mal.

Cuando `AuthService` llama a `authenticationManager.authenticate()` y las credenciales son incorrectas, Spring Security lanza `BadCredentialsException`. Esa excepción viaja hacia arriba por la call stack hasta que algo la captura. `GlobalExceptionHandler` es ese algo.

> **La versión de abajo es la versión de enseñanza con dos handlers, no la clase tal como está hoy en TimeTrack.** Devuelve un body `Map.of("error", ...)` en crudo para que veas el mecanismo sin nada más de por medio. El `exception/GlobalExceptionHandler.java` real del proyecto ha crecido desde entonces a un DTO `ErrorResponse` compartido construido por un helper `buildError(status, message)`, un mapa `fieldErrors` en vez de solo el primer error de validación, y handlers para `AccessDeniedException`, `ResourceNotFoundException`, `BusinessRuleViolationException` y más — esa es la clase que construiste en [05-manejo-excepciones.md](./05-manejo-excepciones.md). Lee este bloque como "los dos handlers que necesita seguridad"; lee `05` para la forma que usa realmente el proyecto.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }
}
```

**`@RestControllerAdvice`** — marca esta clase como el handler global de excepciones para todas las clases `@RestController`. Equivalente a `@ControllerAdvice` + `@ResponseBody`. Spring busca esta anotación al arrancar y registra los handlers automáticamente.

**`@ExceptionHandler(BadCredentialsException.class)`** — le dice a Spring: "cuando se lance esta excepción en cualquier parte de un flujo de controller, ejecuta este método en lugar de la gestión de errores por defecto". El parámetro del método recibe el objeto de la excepción. `BadCredentialsException` la lanza Spring Security cuando el email o la contraseña son incorrectos — no te dice cuál, por razones de seguridad.

**`HttpStatus.UNAUTHORIZED`** — el código de estado correcto para un fallo de autenticación. 401 significa "no estás autenticado". 403 significa "estás autenticado pero no tienes permiso" — es un caso diferente.

**`Map.of("error", "Invalid email or password")`** — un body de respuesta JSON simple. `Map.of()` crea un mapa inmutable (uno al que no puedes añadir ni cambiar nada tras construirlo — perfectamente válido aquí, ya que el body de error nunca cambia). Spring lo serializa a `{ "error": "Invalid email or password" }` automáticamente.

**`@ExceptionHandler(MethodArgumentNotValidException.class)`** — captura fallos de validación de `@Valid` en `LoginRequest`. Extrae el primer error de campo y devuelve un 400 con un mensaje legible. Sin esto, Spring devuelve un body 400 verboso y difícil de leer.

**`.getBindingResult().getFieldErrors().stream().map(...).findFirst()`** — `getBindingResult()` devuelve todos los errores de validación. `.getFieldErrors()` filtra a los errores a nivel de campo (no los globales). `.stream().map(...).findFirst()` coge el primero y lo formatea como `"nombreCampo: mensaje de error"`.

> **¿Nueva la cadena `.stream().map(...).findFirst()`?** Esto es el **Stream API** — un pipeline que procesa una lista paso a paso: `.stream()` abre la lista, `.map(err -> ...)` transforma cada error en un string `"campo: mensaje"` (ese `err -> ...` es otro lambda), `.findFirst()` coge el primer resultado como un `Optional`, y `.orElse("Validation failed")` da un valor por defecto si la lista estaba vacía. Recorrido completo en [java/09-streams-lambdas.md — Stream API](../../../java/junior/es/09-streams-lambdas.md#qué-es-un-stream).

> `GlobalExceptionHandler` no captura `UsernameNotFoundException` directamente. Spring Security lo convierte a `BadCredentialsException` internamente — es intencional. Si el API dijera "usuario no encontrado", un atacante podría enumerar direcciones de email válidas. Devolver el mismo error para ambos casos lo evita.

> **Esta clase solo gestiona las excepciones que registras.** Ahora mismo son exactamente dos: `BadCredentialsException` (→ 401) y `MethodArgumentNotValidException` (→ 400). Cualquier otra excepción para la que no hayas escrito un `@ExceptionHandler` sigue cayendo en el handler por defecto de Spring y se convierte en un 500 genérico. No es un catch-all — a medida que la app crece, añades un método handler por cada tipo de excepción que quieras controlar (esto lo haces para tus propias excepciones personalizadas en pasos posteriores).

---

## ✅ Flujo 1 completo — pruébalo en Postman

El Flujo 1 necesita que existan todas estas clases: `JwtUtil`, `UserDetailsServiceImpl`, `SecurityConfig` (con `PasswordEncoder`, `AuthenticationManager`, `SecurityFilterChain`, `CorsConfigurationSource`), `AuthService`, `AuthController`, `GlobalExceptionHandler`. Si falta alguna, la app no arrancará o el login no funcionará.

> **`SecurityConfig` es la que hay que revisar primero aquí.** La ruta de login solo funciona si un `SecurityFilterChain` permite `/api/auth/**` — o, en el esqueleto, permite todo. Si has leído de arriba a abajo, el código de `SecurityFilterChain` y `CorsConfigurationSource` se enseña en las dos secciones *debajo* de este test, así que asegúrate de haber creado ya el esqueleto de desarrollo (paso 1 del orden de construcción) con tus beans `PasswordEncoder` y `AuthenticationManager` dentro. Sin él, el login devuelve la página de login por defecto de Spring o un 401 — no tu token. Para el test del Flujo 1, el esqueleto (`anyRequest().permitAll()`) es suficiente; no necesitas la versión final bloqueada ni CORS hasta el Flujo 2.

### Paso 1 — arranca la app y comprueba que no haya errores

Ejecuta la app en IntelliJ (botón de play verde o Shift + F10). Observa la consola — debería terminar con:

```
Started TimetrackApplication in X seconds
```

Si en cambio ves un error en rojo, lee la primera línea del stack trace. Esa es siempre la causa real. Arréglalo antes de seguir.

### Paso 2 — genera un hash BCrypt para tu contraseña de prueba

Ve a [bcrypt.online](https://bcrypt.online), escribe `password123` como texto plano, deja el cost factor en 12, y haz clic en "Hash". Copia el resultado — se parece a `$2a$12$...`.

No puedes revertir un hash BCrypt. La app llama a `PasswordEncoder.matches("password123", storedHash)` en cada login para compararlos — nunca lo decodifica.

### Paso 3 — inserta un usuario de prueba en pgAdmin

Abre pgAdmin → tu base de datos → clic derecho en la base de datos → Query Tool. Ejecuta:

```sql
INSERT INTO users (name, email, password)
VALUES ('Test User', 'test@test.com', '$2a$12$PEGA_TU_HASH_AQUI');
```

Reemplaza `$2a$12$PEGA_TU_HASH_AQUI` con el hash completo que copiaste en el paso 2. Luego ejecuta esto para confirmar que el usuario está ahí:

```sql
SELECT * FROM users;
```

### Paso 4 — prueba el happy path en Postman

Abre Postman. Haz clic en **New → HTTP Request**.

- Pon el método en **POST** (dropdown a la izquierda de la barra de URL)
- Introduce la URL: `http://localhost:8080/api/auth/login`
- Haz clic en la pestaña **Body** → selecciona **raw** → cambia el dropdown de formato de "Text" a **JSON**
- Pega esto en el body:

```json
{
  "email": "test@test.com",
  "password": "password123"
}
```

Haz clic en **Send**. Respuesta esperada — status **200 OK**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Copia el valor completo del token** — lo necesitarás para probar el Flujo 2.

### Paso 5 — prueba el camino de error

Envía el mismo request pero con la contraseña incorrecta:

```json
{
  "email": "test@test.com",
  "password": "wrongpassword"
}
```

Respuesta esperada — status **401 Unauthorized**:

```json
{
  "error": "Invalid email or password"
}
```

Si obtienes un 401 con tu mensaje personalizado, `GlobalExceptionHandler` está funcionando correctamente. Si obtienes un JSON largo con un campo `"status": 401` y `"path"`, el handler de error por defecto de Spring todavía se está ejecutando — comprueba que `@RestControllerAdvice` esté en la clase.

### Paso 6 — prueba la validación

Envía un request con el email vacío:

```json
{
  "email": "",
  "password": "password123"
}
```

Respuesta esperada — status **400 Bad Request**:

```json
{
  "error": "email: must not be blank"
}
```

Si los tres casos funcionan — 200, 401, 400 — el Flujo 1 funciona completamente.

---

## 🔒 El Flujo 2 empieza aquí — requests protegidos

---

## OncePerRequestFilter — el filtro JWT

Archivo: `src/main/java/com/victor/timetrack/security/JwtFilter.java`

Docs: [Spring Security — Filter Chain Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-filters-review)

`OncePerRequestFilter` es la clase base correcta para un filtro JWT — Spring garantiza que se ejecuta exactamente **una vez** para un request dado, incluso si ese request se reenvía internamente a otro servlet durante su procesamiento normal (así nunca comprueba el mismo token dos veces para una sola llamada del cliente).

> **"Una vez" tiene una cara menos obvia.** Esa misma garantía tiene un reverso que importa mucho en cuanto llegas al bug de abajo: por defecto, `OncePerRequestFilter` **se salta a sí mismo por completo** cuando el dispatch es un forward interno de tipo `ERROR` (Tomcat redirigiendo internamente un request a `/error` tras una excepción sin capturar) o un dispatch `ASYNC`. No es un bug — existe para que la lógica de negocio de tu filtro (comprobar un token) no se ejecute de nuevo en un re-dispatch interno y sintético de un request que ya vio. Pero tiene un filo afilado: si es el propio `JwtFilter` el que revienta, el forward a `/error` que viene después **no** volverá a pasar por `JwtFilter` — ver "Por qué un filtro no puede depender de `GlobalExceptionHandler`" más abajo.

Cada request HTTP pasa por este filtro antes de llegar a cualquier controller. El filtro lee el JWT de la cabecera `Authorization`, lo valida, y — si es válido — establece la autenticación en `SecurityContextHolder`. Una vez que eso está establecido, Spring Security sabe quién hace el request y aplica las reglas de ruta de `SecurityFilterChain`.

**Flujo de decisión — qué pasa dentro de cada request:**

```
Llega el request
      │
      ▼
¿Tiene cabecera "Authorization"?
  NO ────────────────────────→ filterChain.doFilter() → pasa de largo
      │                        (SecurityFilterChain rechaza si se requiere auth)
  SÍ
      ▼
¿Empieza por "Bearer "?
  NO ────────────────────────→ filterChain.doFilter() → pasa de largo
      │
  SÍ → quita el prefijo "Bearer " (7 caracteres) → token en crudo
      ▼
try { JwtUtil.extractUsername(token) → obtiene el email del claim "sub"
      │
      ▼
      ¿Ya autenticado en este request? (getAuthentication() != null)
        SÍ ───────────────────────→ se salta — ya procesado
            │
        NO
            ▼
      UserDetailsService.loadUserByUsername(email) → carga el usuario de la BD
            │
            ▼
      JwtUtil.isValid(token, email)?
        NO ────────────────────────→ no hace nada → cae en filterChain.doFilter()
            │
        SÍ
            ▼
      SecurityContextHolder.setAuthentication(
        new UsernamePasswordAuthenticationToken(userDetails, null, authorities)
      )
} catch (JwtException | UsernameNotFoundException e) {
      logger.warn(...)   ← se traga la excepción, NO la relanza — ver abajo
}
      │
      ▼
filterChain.doFilter() → continúa hacia SecurityFilterChain → controller
      │                   (sin auth establecida → JwtAuthenticationEntryPoint → 401)
```

**SecurityContextHolder — ciclo de vida por request:**

```
Llega el request
      │
      ▼
JwtFilter establece SecurityContextHolder   ← almacenamiento thread-local
      │                                        (aislado por hilo — cada request
      ▼                                         tiene su propia copia, nunca compartida)
SecurityFilterChain  ──lee──┐
@PreAuthorize        ──lee──┤  todos leen el mismo SecurityContextHolder
@RestController      ──lee──┘
      │
      ▼
El request termina → SecurityContextHolder se limpia automáticamente
```

Es **thread-local** — cada request se ejecuta en su propio hilo. El siguiente request del mismo usuario empieza de cero y pasa por `JwtFilter` de nuevo. Por eso la comprobación `getAuthentication() == null` es segura — nunca lees por accidente la autenticación de otro usuario.

> **¿Qué es un "hilo" (thread) aquí?** Cuando un request llega al servidor, Spring lo ejecuta de principio a fin en un hilo de trabajo (piensa en un hilo como un trabajador que atiende un request a la vez). El almacenamiento *thread-local* significa que cada hilo tiene su propia copia privada de `SecurityContextHolder`. Así que aunque 50 usuarios llamen a la API en el mismo instante — 50 hilos ejecutándose en paralelo — ninguno puede ver los datos de otro, porque cada uno lee solo su propia copia. Cuando el request termina, Spring limpia esa copia automáticamente.

```java
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractUsername(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (jwtUtil.isValid(token, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                        );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (JwtException | UsernameNotFoundException e) {
            logger.warn("Invalid JWT token: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
```

> **Los tres parámetros del método, primero.** `HttpServletRequest request` es el objeto Java en crudo del request entrante — de ahí lees cabeceras, el body y la URL. `HttpServletResponse response` es el objeto en crudo del response saliente — ahí escribes el status y las cabeceras. `FilterChain filterChain` es la lista ordenada de los filtros restantes; llamar a `filterChain.doFilter(...)` le pasa el request al siguiente (explicado al final de esta sección).

**`request.getHeader("Authorization")`** — lee la cabecera `Authorization`. El interceptor de Angular envía `Bearer <token>` ahí en cada request.

**`if (authHeader == null || !authHeader.startsWith("Bearer "))`** — si no hay token (ruta pública, o usuario no logueado), se salta todo y pasa el request de largo. Las reglas de `SecurityFilterChain` lo bloquearán si se requiere autenticación.

**`authHeader.substring(7)`** — quita el prefijo `"Bearer "` (7 caracteres) para quedarte solo con el string del token.

**`SecurityContextHolder.getContext().getAuthentication() == null`** — solo establece la autenticación si aún no se ha establecido. Evita procesar el mismo request dos veces si pasa por el filtro más de una vez.

**¿Por qué cargar el usuario de la base de datos si el token ya tiene el email?** El token se firmó en el login y no se puede modificar — pero el estado del usuario en la base de datos sí puede cambiar después de emitir el token. La cuenta podría haberse eliminado, bloqueado, o cambiado de rol. Cargar `UserDetails` desde la base de datos asegura que trabajas con el estado actual de la cuenta, no con una foto fija de cuando se creó el token.

**`UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())`** — crea el objeto de autenticación que va a `SecurityContextHolder`. Los tres argumentos son: el principal (quién), las credenciales (null — no hace falta contraseña aquí), y las authorities (roles). Una vez que esto está en `SecurityContextHolder`, Spring Security considera al usuario autenticado para este request.

> **2 args vs 3 args — dos significados distintos, la misma clase.** `AuthService` (Flujo 1) construyó una versión de 2 args: `new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())` — email y contraseña *en crudo*, entregados a `authenticationManager.authenticate()` como un **intento** de login sin verificar, todavía pendiente de comprobación. `JwtFilter` (Flujo 2) construye aquí la versión de 3 args — principal, credenciales `null`, authorities — que no es ningún intento: es una autenticación **ya confirmada**, probada por la firma válida del JWT, lista para guardarse directamente en `SecurityContextHolder`. El número de argumentos es la pista: 2 args siempre significa "por favor verifica esto", 3 args siempre significa "esto ya está verificado, aquí tienes los roles". Por eso el Flujo 2 pasa `null` como credenciales — ya no hay contraseña que comprobar, el token ya hizo ese trabajo.

**`filterChain.doFilter(request, response)`** — `filterChain` es la lista ordenada de todos los filtros de la cadena. Llamar a `.doFilter()` significa: "he terminado — pasa este request al siguiente filtro de la cadena". Todo filtro que no quiera bloquear un request debe llamarlo, o el request se descarta en silencio.

`JwtFilter` lo llama en dos sitios:

1. **Return anticipado (sin token):** `JwtFilter` no tiene nada que hacer — llama a `filterChain.doFilter()` inmediatamente y retorna. El request sigue por la cadena y acaba llegando a `SecurityFilterChain`, que comprueba las reglas de ruta.

2. **Al final (tras procesar):** ya sea que el token fuera válido o no, `JwtFilter` siempre llama a `filterChain.doFilter()` al final. Esto es importante: el trabajo de `JwtFilter` no es bloquear requests — solo establece (o no) al usuario en `SecurityContextHolder`. Bloquear es trabajo de `SecurityFilterChain`. Si el token era inválido y no se estableció nada en `SecurityContextHolder`, `SecurityFilterChain` rechazará el request porque `authenticated()` no se cumple.

### Por qué un filtro no puede depender de `GlobalExceptionHandler`

La versión de `JwtFilter` de arriba envuelve `extractUsername` y `loadUserByUsername` en un `try/catch`. Sin él, mandar un request con un token manipulado (cambiar un carácter de la firma) no falla de forma limpia — produce un bug muy concreto y engañoso.

**Qué pasa realmente sin el `try/catch`:**

```
1. jwtUtil.extractUsername(token) lanza SignatureException (sin capturar)
2. No hay ningún catch en JwtFilter → la excepción sube por la pila de llamadas
3. GlobalExceptionHandler (@RestControllerAdvice) nunca la ve —
   solo intercepta excepciones lanzadas DESDE DENTRO de un método @Controller.
   JwtFilter se ejecuta antes en la cadena, antes de que el DispatcherServlet
   siquiera enrute el request hacia un controller:

   Request → [filtros de seguridad, incl. JwtFilter] → DispatcherServlet → @Controller
                        ↑ la excepción pasa aquí          ↑ @RestControllerAdvice solo
                          — fuera del alcance de MVC          vigila desde aquí en adelante

4. La excepción sin capturar llega a Tomcat → el manejo de errores por defecto
   de Spring Boot hace que Tomcat haga un FORWARD INTERNO del mismo request
   a "/error" (no es un nuevo request HTTP — es el mismo, redirigido en el servidor)
5. OncePerRequestFilter se salta a sí mismo por defecto en un dispatch ERROR
   (ver el callout de arriba) → JwtFilter NO se ejecuta en esta segunda pasada
   → SecurityContextHolder queda vacío para el request a /error
6. "/error" no está excluido de .anyRequest().authenticated() en
   SecurityConfig → Spring Security lo rechaza por no estar autenticado
   → salta jwtAuthenticationEntryPoint.commence() → el cliente recibe 401
```

El cliente recibe un `401 Unauthorized` que parece completamente normal, con el mismo body exacto que "no se mandó ningún token":

```json
{
    "error": "Unauthorized",
    "message": "Authentication required",
    "status": 401,
    "timestamp": "2026-07-15T09:22:19.647166500Z"
}
```

> **Por qué esto es peor que un bug obvio.** La respuesta *parece* correcta — un token malo debería acabar en un 401. Pero es el 401 equivocado, producido por el mecanismo equivocado, por pura coincidencia de que `/error` no está excluido de las reglas de seguridad. El evento real — una `RuntimeException` sin manejar dentro de un filtro de servlet — pasó igualmente por debajo y se registra como un error del lado del servidor:
> ```
> ERROR ... o.a.c.c.C.[.[.[/].[dispatcherServlet]  : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception
> io.jsonwebtoken.security.SignatureException: JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.
> 	at io.jsonwebtoken.impl.DefaultJwtParser.verifySignature(...)
> 	at com.victor.timetrack.security.JwtUtil.parseClaims(JwtUtil.java:49)
> 	at com.victor.timetrack.security.JwtUtil.extractUsername(JwtUtil.java:34)
> 	at com.victor.timetrack.security.JwtFilter.doFilterInternal(JwtFilter.java:39)
> ```
> Si algún día `/error` se excluyera de `.anyRequest().authenticated()` por alguna otra razón (por ejemplo, para servir una página de error personalizada), ese mismo token manipulado devolvería de repente un `500` en crudo — porque el mecanismo accidental que produce el 401 dejaría de aplicar. Un arreglo que solo "parece correcto" por casualidad no es un arreglo.

**Cómo darte cuenta de este tipo de bug.** Postman solo te muestra lo que recibió el *cliente* — no puede decirte si ese status code se produjo por el mecanismo que tú pretendías. La pista es el desajuste entre las dos partes: si la consola del backend imprime un stack trace de nivel `ERROR` (`Servlet.service() ... threw exception`) para un request que esperabas que gestionara limpiamente `GlobalExceptionHandler` o `JwtAuthenticationEntryPoint`, eso es la prueba de que algo reventó fuera del flujo que tenías previsto — sin importar lo que acabara viendo el cliente. Un 401 limpio y esperado a través de `JwtAuthenticationEntryPoint` nunca se registra a nivel `ERROR`, porque no es un fallo — es un rechazo de autenticación normal.

**El arreglo — capturar dentro del filtro, sin relanzar:**

```java
try {
    String email = jwtUtil.extractUsername(token);
    // ... resto de la lógica
} catch (JwtException | UsernameNotFoundException e) {
    logger.warn("Invalid JWT token: " + e.getMessage());
}
```

**`catch (JwtException | UsernameNotFoundException e)`** — un *multi-catch*: un solo bloque `catch` que gestiona dos tipos de excepción sin relación entre sí de la misma forma, unidos con `|`. `JwtException` es la superclase común de todo lo que `jjwt` puede lanzar al parsear un token — `SignatureException` (manipulado), `ExpiredJwtException` (pasado el tiempo de expiración de 24h de `application.properties`), `MalformedJwtException` (ni siquiera es un string JWT válido). Capturar la **superclase** en vez de una subclase concreta importa aquí: un `catch (SignatureException e)` dejaría pasar sin capturar un `ExpiredJwtException`, porque son subclases hermanas, no una padre de la otra. `UsernameNotFoundException` cubre el otro camino de fallo: el email dentro de un token *todavía criptográficamente válido* ya no coincide con ninguna fila de `users` — por ejemplo, la cuenta se borró (soft-delete) después de emitirse el token (`UserDetailsServiceImpl.loadUserByUsername`, línea 21: `.orElseThrow(() -> new UsernameNotFoundException(...))`).

> **¿Por qué no `throw new RuntimeException(...)` dentro del `catch`?** Esa era la solución tentadora, y no funciona — por la misma razón exacta por la que existía el bug original. Relanzar *cualquier cosa* desde dentro de un filtro de servlet sigue quedando fuera del alcance de `GlobalExceptionHandler`; solo estarías recreando el mismo problema de "excepción sin capturar dentro de un filtro" con otro tipo de excepción. El patrón correcto en un filtro de seguridad no es "lanzar y que algo lo traduzca" — es "dejar `SecurityContextHolder` vacío y llamar a `filterChain.doFilter()` de todas formas". Un componente más adelante en la cadena que sí entiende "no hay autenticación presente" (el `AuthorizationFilter` que aplica `.anyRequest().authenticated()`) toma el relevo desde ahí, y ya sabe convertir eso en un 401 real e intencionado a través de `jwtAuthenticationEntryPoint`. El trabajo del filtro es únicamente establecer o no el contexto — nunca decidir él mismo la respuesta HTTP.

> **¿Por qué `logger.warn(...)` y no `logger.error(...)`?** `OncePerRequestFilter` ya expone un campo `logger` protegido, así que no hace falta `@Slf4j` ni declararlo a mano. La distinción entre los dos niveles no es cosmética — `ERROR` se reserva para cosas que nunca deberían pasar en funcionamiento normal (un bug, una dependencia caída) y es lo que vigilan las herramientas de monitorización (Sentry, Datadog, alertas de guardia). Un token manipulado o caducado no es un bug — los tokens están *diseñados* para caducar, y los tokens maliciosos o mal formados son ruido de fondo normal en cualquier API pública. Registrarlo como `ERROR` significaría que la sesión de un usuario legítimo caducando — algo que pasa constantemente — despertaría a alguien de guardia como si el servidor estuviera roto. `WARN` deja constancia del evento para depurar más tarde sin disparar esa alarma.

---

## SecurityFilterChain — un lugar para todas las reglas de seguridad

Archivo: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Docs: [Baeldung — adding a custom filter to the chain](https://www.baeldung.com/spring-security-custom-filter) (el patrón `addFilterBefore`, con código) · [Java Configuration](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html) · [Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)

`SecurityFilterChain` es el único bean que configura todas las reglas de seguridad de tu API. Toda app con JWT necesita las mismas tres cosas:

| # | Qué | Por qué |
| --- | --- | --- |
| 1 | Deshabilitar CSRF | JWT usa cabeceras, no cookies — los ataques CSRF son imposibles |
| 2 | Sesiones `STATELESS` | JWT lleva toda la información — no hace falta sesión de servidor |
| 3 | Reglas de ruta | Qué rutas son públicas (`permitAll`) y cuáles requieren un token (`authenticated`) |

### Durante el desarrollo — abre todo mientras construyes JWT

Usa esta versión mientras todavía estás construyendo el flujo JWT. Te deja probar endpoints libremente en Postman sin necesitar un token todavía.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
```

**`@Configuration`** — marca esta clase como un sitio donde se definen beans. Al arrancar, Spring lee la clase y ejecuta cada método `@Bean` de dentro, registrando lo que devuelven.

**`@EnableWebSecurity`** — activa la filter chain de Spring Security y le dice a Spring que use *tu* bean `SecurityFilterChain` en lugar del suyo por defecto. Sin esta anotación, tus reglas de seguridad nunca se aplican.

**`HttpSecurity http`** — no creas este objeto tú; Spring te lo pasa al método. Llamas a sus métodos encadenados (`.csrf()`, `.sessionManagement()`, `.authorizeHttpRequests()`, …) para describir las reglas paso a paso, y `http.build()` convierte todo eso en la filter chain terminada que se devuelve.

> **¿Qué es `csrf -> csrf.disable()`?** Cada uno de estos es un **lambda** — una mini-función que le das a Spring Security para describir una regla. Lee `csrf -> csrf.disable()` como: "Spring te da el objeto de config `csrf`; llama a `.disable()` sobre él." Exactamente la misma forma se repite en `session -> ...`, `auth -> ...` y `cors -> ...` en la versión final de abajo — la palabra antes de `->` es solo un nombre que *tú* eliges para el objeto que Spring pasa, así que `auth` y `csrf` no son palabras clave, solo etiquetas. Explicación completa en [java/09-streams-lambdas.md — Lambda expressions](../../../java/junior/es/09-streams-lambdas.md#sintaxis-de-lambdas).

### Versión final — protege todas las rutas, añade filtro JWT

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

**`@EnableMethodSecurity`** — habilita `@PreAuthorize` en métodos individuales. Sin esta anotación, `@PreAuthorize` se ignora silenciosamente — sin error, sin protección.

**`.requestMatchers("/api/auth/**").permitAll()`** — abre cada URL bajo `/api/auth/` (login, registro) sin token. El `/**` coincide con cualquier ruta bajo ese prefijo.

**`.anyRequest().authenticated()`** — cualquier otra URL requiere un JWT válido. El orden importa: las reglas de `requestMatchers` se comprueban primero, en el orden en que se declaran. `.anyRequest()` siempre va al final — es el catch-all.

**`.csrf(csrf -> csrf.disable())`** — CSRF (Cross-Site Request Forgery) es un ataque donde un sitio web malicioso engaña a tu navegador para que haga un request a tu API. Funciona porque los navegadores incluyen automáticamente las cookies en cada request a un dominio. JWT no usa cookies — el token vive en `localStorage` y Angular lo adjunta manualmente en la cabecera `Authorization`. Los navegadores nunca envían cabeceras personalizadas automáticamente a otros dominios, así que el ataque no aplica. La protección CSRF no hace falta y deshabilitarla elimina una fuente de confusos errores 403.

**`.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)`** — inserta tu `JwtFilter` en la filter chain, justo antes del filtro de autenticación por defecto de Spring. Esto asegura que el JWT se valida antes de que Spring intente su propia lógica de autenticación (basada en formulario).

**`.cors(cors -> cors.configurationSource(corsConfigurationSource()))`** — aplica las reglas CORS definidas en el bean `corsConfigurationSource()`. CORS debe configurarse dentro de Spring Security — no con `@CrossOrigin` — para que la capa de Security lo gestione antes de bloquear el request.

---

## AuthenticationEntryPoint — 401 en vez del 403 vacío por defecto

Propósito: intercepta el momento exacto en que Spring Security detecta que una request **no tiene ninguna autenticación válida** (sin token, o un token tan roto que ni se puede procesar) y controla qué responder — en vez de dejar que Spring aplique su comportamiento por defecto.

Archivo: `src/main/java/com/victor/timetrack/security/JwtAuthenticationEntryPoint.java`

Docs: [Baeldung — Handle Spring Security Exceptions](https://www.baeldung.com/spring-security-exceptions) → leer: la sección de `AuthenticationEntryPoint`, donde `commence()` escribe el JSON de error directamente en la respuesta

Sin configurar nada, cuando una request sin token llega a un endpoint protegido (`.anyRequest().authenticated()`), Spring Security devuelve **403 Forbidden sin ningún cuerpo**. Esto es justo el error que ya tenías anotado en "Errores comunes" más abajo: **403 no es el código correcto aquí**. La distinción HTTP es:

- **401 Unauthorized** — "no sé quién eres". No hay ninguna autenticación, o la que hay es inválida.
- **403 Forbidden** — "sé quién eres, pero no tienes permiso". El usuario está autenticado con un token válido, pero le falta el rol necesario.

> Spring Security internamente lanza dos tipos de excepción distintos para estos dos casos: `AuthenticationException` cuando no hay autenticación en absoluto, y `AccessDeniedException` cuando sí la hay pero falla la autorización (esta última es la que capturas en `GlobalExceptionHandler` con `@ExceptionHandler(AccessDeniedException.class)` — ver la sección de manejo de excepciones). El componente que decide qué hacer con cada una es distinto: `AuthenticationEntryPoint` para la primera, y tu `@RestControllerAdvice` normal para la segunda, porque `AccessDeniedException` sí llega hasta la capa de controller, mientras que `AuthenticationException` se resuelve antes, dentro del propio filtro de seguridad.

**¿Por qué no puedes arreglar esto con un `@ExceptionHandler` normal, como hiciste con `AccessDeniedException`?** Porque el rechazo por falta de autenticación ocurre **antes** de que la request llegue a ningún controller — pasa dentro de la filter chain de Spring Security, una capa que se ejecuta por completo antes de que Spring MVC (y por tanto tu `@RestControllerAdvice`) entre en juego. `@ExceptionHandler` solo puede capturar excepciones lanzadas desde dentro de un método de controller o de ahí para adentro — no desde un filtro que ni siquiera ha dejado pasar la request tan lejos.

```java
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(Instant.now());
        errorResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
        errorResponse.setError(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        errorResponse.setMessage("Authentication required");

        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
```

> **No olvides `@Component`.** Sin esta anotación, la clase compila perfectamente sola — el error solo aparece al arrancar la aplicación, cuando Spring intenta construir `SecurityConfig` y descubre que no tiene ningún bean de tipo `JwtAuthenticationEntryPoint` para inyectar en su constructor. El mensaje exacto es: `Parameter 1 of constructor in com.victor.timetrack.security.SecurityConfig required a bean of type 'com.victor.timetrack.security.JwtAuthenticationEntryPoint' that could not be found.` `@Component` es lo que le dice a Spring "gestiona tú esta clase, créala automáticamente y ponla disponible para inyectar" — sin ella, la clase existe como código Java normal, pero fuera del control de Spring, así que ningún constructor puede pedirla como dependencia.

**`implements AuthenticationEntryPoint`** — esta interfaz de Spring Security exige un único método, `commence(...)`, que Spring llama automáticamente cada vez que una request sin autenticación válida intenta acceder a un recurso protegido. El nombre viene de que este método es literalmente donde "empieza" (*commences*) el proceso de pedirle al cliente que se autentique — en una app web tradicional con login por formulario, aquí es donde redirigirías a la página de login; en una API JWT, aquí es donde devuelves el error JSON.

**`ObjectMapper objectMapper`** — la clase de Jackson (la librería que Spring Boot usa para convertir entre JSON y objetos Java) que convierte un objeto Java a texto JSON. En un `@RestController` normal nunca la ves porque Spring la usa automáticamente por ti detrás de `return ResponseEntity...`. Aquí, como estás fuera del mundo de los controllers (dentro de un componente de seguridad de bajo nivel), tienes que invocarla tú mismo. Se inyecta por constructor porque Spring Boot ya tiene un `ObjectMapper` configurado como bean disponible en el contenedor — es el mismo que usa internamente para todas tus respuestas normales, así que no necesitas crear uno nuevo.

**`response.setStatus(...)` / `response.setContentType(...)`** — a diferencia de un `@ExceptionHandler`, donde simplemente devuelves un `ResponseEntity` y Spring construye la respuesta HTTP por ti, aquí escribes directamente sobre el objeto `HttpServletResponse` — el objeto de bajo nivel que representa la respuesta HTTP cruda, antes de que exista ningún concepto de "controller" o "DTO". Tienes que poner el código de estado y el content-type a mano, uno por uno.

**`objectMapper.writeValue(response.getWriter(), errorResponse)`** — `response.getWriter()` te da el canal de escritura de la respuesta; `writeValue(destino, objeto)` serializa `errorResponse` a JSON y lo escribe ahí directamente, en un solo paso. Es el mismo trabajo que un `@RestControllerAdvice` hace por ti automáticamente — aquí lo escribes a mano porque no hay ningún controller de por medio que lo haga por ti.

Conéctalo en `SecurityConfig` con `.exceptionHandling(...)`:

```java
private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

public SecurityConfig(JwtFilter jwtFilter, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
    this.jwtFilter = jwtFilter;
    this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
}

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint(jwtAuthenticationEntryPoint)
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}
```

**`.exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(jwtAuthenticationEntryPoint))`** — le dice a la filter chain: "cuando detectes que no hay autenticación válida, no uses tu comportamiento por defecto — usa este `AuthenticationEntryPoint` en su lugar". Sin esta línea, la clase `JwtAuthenticationEntryPoint` compila perfectamente pero Spring Security nunca la invoca — sigue aplicando el 403 vacío de siempre.

El JSON resultante al llamar a un endpoint protegido sin ningún token:

```json
{
    "timestamp": "2026-07-09T09:30:00.000Z",
    "status": 401,
    "error": "Unauthorized",
    "message": "Authentication required"
}
```

---

## CORS — permitir que Angular llame al API

Docs: [Baeldung — CORS with Spring](https://www.baeldung.com/spring-cors) (empieza aquí — ejemplo claro y completo) · [Spring Security — CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)

CORS (Cross-Origin Resource Sharing) es una política de seguridad del navegador que bloquea a JavaScript de llamar a un servidor en un origin diferente. Cuando Angular (localhost:4200) llama a Spring Boot (localhost:8080), el navegador lo bloquea — puertos diferentes = origins diferentes.

Configura CORS dentro de `SecurityConfig` — no con `@CrossOrigin` en cada controller. Así la capa de Security lo gestiona de forma consistente para cada endpoint.

**Cómo funciona el preflight:**

```
Angular envía POST /api/auth/login
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Navegador — comprobación de same-origin                 │
│   Angular está en localhost:4200                        │
│   Spring Boot está en localhost:8080                     │
│   puerto diferente = origin diferente → aplica CORS      │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ El navegador envía primero un request OPTIONS preflight  │
│   Origin: http://localhost:4200                          │
│   Access-Control-Request-Method: POST                    │
│   Access-Control-Request-Headers: Authorization          │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Filtro CORS de Spring Boot (corsConfigurationSource)     │
│   ¿está "http://localhost:4200" en allowedOrigins? SÍ    │
│   responde con:                                          │
│     Access-Control-Allow-Origin: http://localhost:4200   │
│     Access-Control-Allow-Methods: GET, POST, PUT, ...     │
│     Access-Control-Allow-Headers: *                      │
└─────────────────────────────────────────────────────────┘
         │
         ▼
El navegador recibe OK → envía el POST real
         │
         ▼
Spring procesa el request normalmente
```

> El error CORS solo aparece en el **navegador** — Postman nunca envía un preflight, así que los errores CORS son invisibles en Postman. Si tu app Angular tiene un error CORS pero Postman funciona, el fix siempre está en el servidor.

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

**`setAllowedOrigins(List.of("http://localhost:4200"))`** — solo se permiten requests desde este origin. En producción cambiarías esto a tu URL de Angular desplegada.

**`setAllowedMethods(...)`** — los métodos HTTP que Angular puede usar. `OPTIONS` debe estar incluido — el navegador envía un request preflight `OPTIONS` antes de cada `POST`, `PUT`, etc. para comprobar si CORS está permitido.

**`setAllowedHeaders(List.of("*"))`** — permite cualquier cabecera de request. Esto hace falta para que la cabecera `Authorization: Bearer <token>` no se bloquee.

**`setAllowCredentials(true)`** — permite que se envíen cookies y cabeceras `Authorization` cross-origin. Necesario para que JWT funcione.

> **¿Por qué no simplemente permitir cualquier origin con `"*"`?** Porque `setAllowCredentials(true)` y `setAllowedOrigins(List.of("*"))` no se pueden usar juntos — Spring lanza un error al arrancar y el navegador rechaza la respuesta. El comodín `"*"` significa "cualquiera", y "cualquiera **más** enviar credenciales" es un agujero de seguridad que la especificación CORS prohíbe. Si alguna vez necesitas de verdad un comodín con credenciales, el reemplazo es `setAllowedOriginPatterns(List.of("*"))`. En este proyecto listas el origin exacto de Angular, así que la trampa nunca muerde — pero es el error de CORS más común entre juniors, así que vale la pena reconocerlo.

**`source.registerCorsConfiguration("/**", config)`** — aplica esta config CORS a cada URL de la API.

> El error CORS solo aparece en el navegador — no es un bug del backend. El navegador bloquea la respuesta, no el request. El fix siempre está en el servidor.

---

## @PreAuthorize — autorización a nivel de método

Docs: [Baeldung — Spring Method Security](https://www.baeldung.com/spring-security-method-security) (`@PreAuthorize` con `hasRole`, ejemplo completo) · [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)

Requiere `@EnableMethodSecurity` en `SecurityConfig` — sin ello, `@PreAuthorize` se ignora silenciosamente.

`SecurityFilterChain` controla qué rutas necesitan un token. `@PreAuthorize` va un paso más allá — controla qué roles pueden usar un método específico, después de que el filtro JWT ya haya confirmado quién es el usuario.

```java
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
}
```

> **¿Por qué hay código dentro de un string?** El texto dentro de `@PreAuthorize("...")` es **SpEL** (Spring Expression Language), no Java. Spring lo evalúa en tiempo de ejecución, justo antes de que el método se ejecute. `hasRole(...)`, `hasAuthority(...)` y `authentication` son helpers integrados que Spring te da para comprobaciones de seguridad — solo puedes usarlos dentro de estos strings de anotaciones de seguridad, no en Java normal.

**`hasRole('MANAGER')`** — comprueba que el usuario autenticado tiene la autoridad `ROLE_MANAGER`. Spring Security añade el prefijo `ROLE_` automáticamente, así que escribes `'MANAGER'` aquí y `.roles("MANAGER")` en `UserDetailsServiceImpl`.

**`hasAuthority('ROLE_MANAGER')`** — la misma comprobación, pero escribes el string completo incluyendo `ROLE_`. Ambos funcionan — `hasRole` es la versión más corta.

> El cuerpo del método devuelve `ResponseEntity.noContent().build()` — HTTP **204 No Content**, la respuesta estándar para un `DELETE` exitoso que no tiene nada que devolver. (Guía completa de códigos de estado en [02-controladores-rest.md](./02-controladores-rest.md).)

---

## Errores comunes

**Olvidar `SessionCreationPolicy.STATELESS`** — Spring crea sesiones HTTP por defecto. Sin esto, obtienes sesiones Y JWT al mismo tiempo, que entran en conflicto y desperdician memoria.

**Orden de filtros incorrecto** — `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` es obligatorio. Si el filtro JWT se ejecuta después del filtro por defecto de Spring, el request se rechaza antes de que tu filtro tenga oportunidad de autenticarlo.

**CSRF habilitado con JWT** — CSRF es para sesiones basadas en cookies. Si lo dejas activado, cada request que no sea GET se rechazará con un 403 por falta de token CSRF.

**Devolver 403 en lugar de 401** — 401 significa "no autenticado" (sin token o inválido). 403 significa "autenticado pero no permitido" (rol incorrecto). Spring Security devuelve 403 para requests no autenticados por defecto — sobreescríbelo con un `AuthenticationEntryPoint` personalizado si necesitas un 401 correcto. Ver la sección "AuthenticationEntryPoint — 401 en vez del 403 vacío por defecto" más arriba para la implementación completa.

**`@PreAuthorize` ignorado silenciosamente** — si olvidas `@EnableMethodSecurity` en `SecurityConfig`, la anotación no hace nada. Sin error — la protección simplemente no existe.

**`AccessDeniedException` sin handler específico → 500 en vez de 403** — cuando `@PreAuthorize("hasRole('MANAGER')")` rechaza a un usuario sin el rol correcto, Spring lanza `org.springframework.security.access.AccessDeniedException`. Esta clase extiende `RuntimeException`, así que si tu `@RestControllerAdvice` solo tiene un catch-all genérico para `RuntimeException` (y no un `@ExceptionHandler(AccessDeniedException.class)` específico), esa excepción cae en el catch-all y devuelve un 500 — aunque el rechazo del rol es un caso perfectamente normal, no un fallo inesperado del servidor.

```java
// Sin handler específico — el catch-all intercepta AccessDeniedException por error
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
}

// Con el handler correcto, delante del catch-all
@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e) {
    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(buildError(HttpStatus.FORBIDDEN, "You don't have permission to perform this action"));
}
```

> El orden de los métodos dentro de la clase no importa para Spring — `@RestControllerAdvice` siempre busca el handler **más específico** que coincida con el tipo exacto de la excepción lanzada, antes de caer al catch-all genérico. Da igual si `handleAccessDenied` está antes o después de `handleRuntime` en el archivo; lo que importa es que exista.

> **No confundir con tu propia `UnauthorizedException`.** Si ya tienes una excepción personalizada tuya (por ejemplo, una que lanzas a mano en el service cuando un empleado intenta actuar sobre datos que no son suyos) que también mapea a 403, no sirve para capturar `AccessDeniedException` — son clases sin relación de herencia entre sí. `AccessDeniedException` la lanza el propio framework dentro del mecanismo de `@PreAuthorize`; tu excepción la lanzas tú en tu código de negocio. Necesitas un `@ExceptionHandler` por cada una, aunque ambas acaben devolviendo el mismo código HTTP.

---

## Paso 4 — Autorización basada en roles

Los Pasos 1-3 construyeron la autenticación: cualquier usuario autenticado podía llamar a cualquier endpoint. El Paso 4 añade la autorización: solo los usuarios con el rol correcto pueden llamar a endpoints específicos.

Tres cosas cambian en el Paso 4:

| Qué cambia                                             | Por qué                                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| La entidad `User` obtiene los campos `role` y `active` | El rol debe almacenarse en la BD                                                    |
| `UserDetailsServiceImpl` usa el rol real               | El filtro JWT establece authorities desde `UserDetails` — debe reflejar el rol real |
| `@PreAuthorize` en endpoints de escritura              | Spring Security aplica la comprobación de rol antes de que el método se ejecute     |
| Archivo seed `data.sql`                                | Sin una cuenta de manager en la BD, nadie puede loguearse como manager para probar  |

### Enum Role

Archivo: `src/main/java/com/victor/timetrack/model/Role.java`

```java
public enum Role {
    EMPLOYEE,
    MANAGER
}
```

Un `enum` de Java es un tipo con un conjunto fijo de constantes con nombre. Usar un enum en lugar de un `String` simple significa que el compilador detecta typos — `Role.MANAGGER` es un error de compilación; `"MANAGGER"` en un campo string no lo es.

### Entidad User — añadir role y active

La entidad `User` necesita dos campos nuevos. `role` se mapea a una columna `VARCHAR` usando `@Enumerated(STRING)`, que le dice a Hibernate que guarde el nombre del enum (`"EMPLOYEE"`, `"MANAGER"`) en lugar de su posición ordinal (0, 1). Guardar el nombre es más seguro — si reordenas los valores del enum más tarde, las posiciones ordinales se desplazan y todos los datos existentes se rompen.

```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private Role role;

@Column(nullable = false)
private Boolean active = true;
```

`active` por defecto es `true` — una cuenta nueva está activa a menos que se desactive explícitamente. El *soft delete* lo pone en `false`: en lugar de eliminar la fila de la base de datos (un *hard delete*), simplemente la marcas como inactiva. El registro se queda para el historial y se puede reactivar más tarde, y la comprobación de login en `UserDetailsServiceImpl` rechaza cualquier cuenta cuyo `active` sea `false`.

### UserDetailsServiceImpl — usar el rol real

El placeholder `.roles("USER")` debe reemplazarse con el rol real de la base de datos. `JwtFilter` carga `UserDetails` en cada request y pone las authorities en `SecurityContextHolder` — si el rol aquí está mal, las comprobaciones de `@PreAuthorize` también estarán mal.

```java
return org.springframework.security.core.userdetails.User
    .withUsername(user.getEmail())
    .password(user.getPassword())
    .roles(user.getRole().name())  // "EMPLOYEE" o "MANAGER" → Spring añade el prefijo ROLE_
    .build();
```

**`user.getRole().name()`** — `.name()` es un método integrado en cada enum de Java que devuelve el nombre de la constante como un `String`. `Role.MANAGER.name()` devuelve `"MANAGER"`. `.roles()` luego lo guarda como `"ROLE_MANAGER"` en las authorities de `UserDetails`.

También deberías bloquear el login de usuarios inactivos. Añade una comprobación antes del return:

```java
if (!user.getActive()) {
    throw new UsernameNotFoundException("Account is disabled: " + username);
}
```

### data.sql — la primera cuenta de manager

Archivo: `src/main/resources/data.sql`

No hay endpoint público de registro — las cuentas las crea un manager desde la página Team. Pero el primer manager no puede loguearse porque todavía no existe ningún manager. `data.sql` es la solución de Spring Boot: ejecuta este fichero SQL automáticamente en cada arranque, antes de que la aplicación esté lista. `ON CONFLICT DO NOTHING` lo hace idempotente — seguro de ejecutar varias veces sin crear duplicados.

```sql
INSERT INTO users (name, email, password, role, active, created_at)
VALUES (
    'Admin',
    'admin@timetrack.com',
    '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH',
    'MANAGER',
    true,
    NOW()
)
ON CONFLICT (email) DO NOTHING;
```

**Cómo generar el hash BCrypt para la contraseña seed:**

Ve a [bcrypt.online](https://bcrypt.online), escribe `Admin2024!` como texto plano, deja el cost factor en 10, y haz clic en Hash. Copia el resultado y reemplaza el placeholder de arriba.

**Un ajuste importante de `application.properties`** — por defecto Spring Boot solo ejecuta `data.sql` cuando crea el esquema (es decir, cuando `spring.jpa.hibernate.ddl-auto=create` o `create-drop`). Para que se ejecute en cada arranque sin importar eso:

```properties
spring.sql.init.mode=always
```

Sin esta línea, `data.sql` se ignora silenciosamente cuando `ddl-auto=update` o `validate`.

### @PreAuthorize en endpoints de escritura

Con `@EnableMethodSecurity` ya en `SecurityConfig`, ahora puedes proteger métodos individuales. Añade la anotación encima de cualquier método que deba ser solo para MANAGER:

```java
@PostMapping
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

Aplícalo a POST, PUT y DELETE tanto en `ProjectController` como en `UserController`. GET queda abierto para ambos roles — los empleados necesitan leer la lista de proyectos para elegir uno al registrar horas.

### SecurityContextHolder — leer el usuario actual dentro de un service

Docs: [Spring Security — SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder)

**El problema que resuelve:** HTTP es stateless — cada request es una conexión nueva, sin memoria de nada anterior. Entonces, cuando `TimeEntryService.create()` se ejecuta, ¿cómo sabe *quién* está llamando, ahora mismo, en este request concreto? No puede preguntárselo al cliente (mira la sección de IDOR en [security/05-security-vulnerabilities.md](../../../security/junior/es/05-security-vulnerabilities.md) para entender por qué no). Necesita un sitio donde consultar "el usuario autenticado de *este* request" — y ese sitio es `SecurityContextHolder`.

**Qué es exactamente, a nivel mecánico:** es un **thread-local** — una especie de casillero que guarda un valor distinto por cada hilo (thread) de ejecución. En Spring Boot, cada petición HTTP que llega la procesa un hilo del pool de hilos del servidor (Tomcat, por defecto). Mientras ese hilo procesa tu request, puede guardar datos en su propio casillero sin chocar con otro hilo que esté atendiendo, al mismo tiempo, la petición de otro usuario distinto. Esa es exactamente la garantía que necesitas: "el usuario autenticado de *este* request", nunca mezclado con el request simultáneo de otra persona.

> Un thread es la unidad de ejecución a la que el servidor le asigna un request. Dos usuarios llamando a tu API en el mismo instante son atendidos por dos hilos distintos — cada uno con su propio casillero thread-local. Por eso `SecurityContextHolder` nunca filtra la identidad del usuario A hacia el request del usuario B, ni siquiera bajo mucho tráfico concurrente.

**Quién lo rellena, y cuándo:** `JwtFilter` — la misma clase que ya construiste — escribe ahí en cada request, antes de que tu controller o tu service lleguen a ejecutarse:

```java
// JwtFilter.java — esto ya existe en tu proyecto
if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
        userDetails, null, userDetails.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(authToken);
}
```

`JwtFilter` decodifica el JWT, extrae el email, carga el `UserDetails`, lo envuelve en un objeto `Authentication`, y **guarda** ese objeto en el casillero del hilo actual con `setAuthentication(...)`.

**Quién lo lee, y por qué le llega el mismo valor:** como el hilo es el mismo durante todo el ciclo de vida de un request — entra por `JwtFilter`, pasa por `SecurityFilterChain`, llega a tu `@RestController`, y baja hasta tu `@Service` — leer `SecurityContextHolder.getContext().getAuthentication()` más adelante, en ese mismo request, te devuelve **el mismo objeto exacto** que `JwtFilter` guardó momentos antes, en ese mismo hilo. Aquí no hay ninguna llamada de red ni consulta a base de datos — es literalmente leer un valor que otra clase, más temprano en el mismo request, ya dejó en un casillero compartido.

```
un request HTTP → un hilo → un casillero thread-local

[JwtFilter]                          [TimeEntryService.create()]
   escribe:                              lee:
   SecurityContextHolder                SecurityContextHolder
     .getContext()                        .getContext()
     .setAuthentication(authToken)        .getAuthentication()
        │                                    │
        └──────────── mismo hilo ────────────┘
             (mismo request, mismo casillero)
```

**Por qué `.getName()` te da el email en concreto:** `Authentication` tiene un método `getName()` que, cuando el "principal" (el sujeto autenticado) es un `UserDetails` — como el tuyo — devuelve `userDetails.getUsername()`. En tu `UserDetailsServiceImpl`, el "username" que configuraste **es el email** — tu app no tiene un concepto de username separado, usa el email como identificador de login. Por eso `getName()` te entrega el email directamente, sin ninguna consulta adicional:

```java
// Dentro de cualquier método @Service — obtiene el email del usuario logueado actualmente
String email = SecurityContextHolder.getContext()
        .getAuthentication()
        .getName();  // resuelve a userDetails.getUsername() — el email
```

> Analogía: piensa en `SecurityContextHolder` como una pizarra que solo tu hilo (este request) puede ver y escribir. `JwtFilter` es el primero en entrar a la sala y escribe "este request es de victor@email.com". Cualquier otra clase que entre después a la misma sala — tu service, tu controller — puede leer esa misma pizarra sin volver a preguntarle nada al cliente.

Usarás esto en el Paso 5, cuando `TimeEntryService` necesite saber qué usuario está creando una entrada, o cuando `GET /api/entries` necesite filtrar resultados por el usuario actual. El punto clave: **nunca confíes en un `userId` enviado por el cliente** — léelo siempre del contexto de seguridad. Un cliente puede enviar cualquier `userId` que quiera; el `SecurityContext` refleja quién realmente se logueó.

```java
// Patrón completo — carga la entidad User desde el contexto de seguridad
String email = SecurityContextHolder.getContext().getAuthentication().getName();
User currentUser = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
```

### Condición de done para el Paso 4

```
Postman: POST /api/projects con token EMPLOYEE → 403 Forbidden
Postman: POST /api/projects con token MANAGER  → 201 Created
```

Para conseguir un token EMPLOYEE: añade un usuario con `role = 'EMPLOYEE'` en pgAdmin e inicia sesión vía Postman. Para conseguir un token MANAGER: inicia sesión con la cuenta `admin@timetrack.com` sembrada por `data.sql`.

---

## Dónde te deja esto — y qué viene después

La API ahora sabe dos cosas que no sabía antes: **quién** está llamando (el filtro JWT pone un `UserDetails` en `SecurityContextHolder` antes de que corra ningún controller) y **si tiene permiso** (`.anyRequest().authenticated()` para la ruta, `@PreAuthorize("hasRole('MANAGER')")` para el método). Los dos handlers huérfanos de `05` finalmente tienen algo que los lance, y las excepciones caen exactamente donde ese archivo predijo: `BadCredentialsException` → `401`, `AccessDeniedException` → `403`.

Pero mira de cerca qué sigue siendo de confianza ciega. `LoginRequest` llega con `@NotBlank` en dos campos y `@Valid` en el parámetro del controller — y esas anotaciones se usaron aquí sin llegar nunca a explicarse. Eso no es un descuido de este archivo: es el siguiente agujero. La autenticación responde "¿es realmente Victor?"; no dice nada sobre si el *body* que envió es coherente. Un manager logueado con un token perfectamente válido todavía puede hacer `POST` de un proyecto con un nombre en blanco, un presupuesto negativo, o una fecha de fin anterior a la de inicio — todas las comprobaciones de seguridad pasan, y la basura entra directa a PostgreSQL.

[07-validacion.md](./07-validacion.md) cierra ese hueco: qué dispara realmente `@Valid`, qué anotaciones existen (`@NotBlank`, `@Email`, `@Positive`, `@Size`), dónde se captura el `MethodArgumentNotValidException` resultante, y por qué validar en el límite del DTO es mejor que esparcir comprobaciones `if (x == null)` por tus services.
