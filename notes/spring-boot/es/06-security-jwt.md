# Spring Security y JWT — Referencia de implementación

> Abre este archivo cuando estés **implementando**. Abre `06-security-jwt-learning.md` cuando estés **estudiando**.
>
> Este archivo está ordenado para construir — cada clase depende de las que están encima (orden de creación). El archivo de aprendizaje está ordenado para entender — concepto antes que código, la pieza más simple primero.

---

## Sintaxis Java en este archivo — empieza aquí

Si nunca has escrito Java, algunos patrones de sintaxis de este archivo parecerán magia antes de llegar siquiera a la lógica de seguridad. Ninguno de ellos es Spring — son Java de todos los días, y cada uno tiene una explicación completa en tus propias notas de Java. Echa un vistazo a esta tabla una vez y vuelve a ella cuando algo te confunda. Si una línea de este archivo parece extraña, casi siempre es uno de estos siete casos.

| Sintaxis que verás                                                      | Qué es realmente                                                                                                                                                                                                                                                               | Dónde se explica en tus notas                                                                             |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `auth -> auth.anyRequest()...` · `() -> new Something()`                | Un **lambda** — una función corta y sin nombre pasada como argumento. La parte antes de `->` es la entrada que el método te da; la parte después es lo que haces con ella. Los métodos de config de Spring Security toman lambdas para que puedas describir cada regla inline. | [java/09-streams-lambdas.md — Lambda expressions](../../java/es/09-streams-lambdas.md#sintaxis-de-lambdas) |
| `findByEmail(email).orElseThrow(...)`                                   | El método devuelve un **`Optional<User>`** — una caja que o contiene un usuario o está vacía. `.orElseThrow()` abre la caja, o lanza si está vacía. Así es como Spring Data evita devolver `null`.                                                                             | [java/10-generics.md — `Optional<T>`](../../java/es/10-generics.md#optionalt)                             |
| `ResponseEntity<AuthResponse>` · `Map<String, String>` · `List.of(...)` | **Generics** — el `<...>` dice qué tipo vive dentro de un contenedor. `List<String>` es una lista de strings; `ResponseEntity<AuthResponse>` es una respuesta HTTP que lleva un `AuthResponse`.                                                                                | [java/10-generics.md — Generics](../../java/es/10-generics.md#generics)                                   |
| `.stream().map(...).findFirst()`                                        | El **Stream API** — un pipeline que transforma una colección paso a paso. Aparece una vez aquí, dentro de `GlobalExceptionHandler`.                                                                                                                                            | [java/09-streams-lambdas.md — Stream API](../../java/es/09-streams-lambdas.md#qué-es-un-stream)                 |
| `Jwts.builder().subject(...).signWith(...).compact()`                   | El **patrón builder** — encadena métodos para configurar un objeto, y luego una llamada final (`.build()` / `.compact()`) lo produce. jjwt y Spring lo usan en todas partes.                                                                                                   | explicado línea por línea en la sección `JwtUtil` abajo                                                   |
| `@Component` · `@Service` · `@Bean` · `@Override`                       | **Anotaciones** — metadatos que pones en una clase o método para decirle a Spring (o al compilador) cómo tratarlo.                                                                                                                                                             | [java/13-annotations.md](../../java/es/13-annotations.md)                                                 |
| `private final JwtUtil jwtUtil;` + constructor                          | **Inyección por constructor** — Spring pasa las dependencias a través del constructor. `final` significa que el campo se establece una vez y nunca se reasigna.                                                                                                                | [spring-boot/03-dependency-injection.md](./03-dependency-injection.md)                                    |

> Dos reglas Java más con las que te toparás: `throws Exception` / `throws UsernameNotFoundException` en la firma de un método es la regla de **excepciones comprobadas** de Java — debes declarar una excepción que un método puede lanzar ([java/08-exceptions.md](../../java/es/08-exceptions.md)). Y `enum Role { EMPLOYEE, MANAGER }` (Paso 4) es un tipo con un conjunto fijo de valores con nombre ([java/11-enums.md](../../java/es/11-enums.md)).

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

`AuthenticationManager` recorre todos los proveedores registrados cuando llega un intento de login. Elige el que puede gestionar el tipo de token pasado. Si ninguno puede gestionarlo, lanza una excepción.

**Por qué `DaoAuthenticationProvider` para este proyecto:** nuestros usuarios están almacenados en PostgreSQL y se loguean con email + contraseña. `DaoAuthenticationProvider` está construido exactamente para este caso. Le das un `UserDetailsService` (cómo cargar el usuario de la base de datos) y un `PasswordEncoder` (cómo comparar contraseñas), y gestiona la verificación completa. Escribes menos de 10 líneas de configuración y todo el mecanismo de login funciona.

---

### Este es un patrón reutilizable

La capa de seguridad JWT es un **patrón boilerplate** — la estructura no cambia entre proyectos. Una vez que lo entiendes y lo implementas una vez, lo copias a cada futura app Spring Boot que necesite autenticación JWT.

**Archivos que siempre son idénticos:** `JwtUtil.java`, `JwtFilter.java`, `GlobalExceptionHandler.java`, `AuthService.java`, `AuthController.java`, `LoginRequest.java` + `AuthResponse.java`

**Archivos donde solo cambian pequeños detalles:**

| Archivo                       | Qué cambia                                                             |
| ----------------------------- | ---------------------------------------------------------------------- |
| `SecurityConfig.java`         | Las reglas de ruta — qué paths son públicos, cuáles protegidos         |
| `UserDetailsServiceImpl.java` | El campo usado para encontrar al usuario (email, username) y los roles |
| `JwtUtil.java` (opcional)     | Claims extra añadidos al token — p.ej. rol, userId                     |

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
│   sin usuario en contexto → HTTP 403 Forbidden          │
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
→ HTTP 403 Forbidden
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
| `GlobalExceptionHandler` | Ambos        | Convierte excepciones en respuestas JSON limpias                     |

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

Cualquier servidor con la misma clave secreta puede verificar el token sin llamar a la base de datos. Este es el punto — sin sesión, sin estado compartido, solo un token firmado que el cliente lleva en cada request.

---

## JwtUtil — generar y validar tokens

Archivo: `src/main/java/com/victor/timetrack/security/JwtUtil.java`

### application.properties — config JWT

```properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
```

`86400000` es 24 horas en milisegundos. El JWT_SECRET debe ser siempre un string codificado en Base64. Genéralo con `openssl rand -base64 32` en cualquier terminal.

**Después de generar el string — establece la variable de entorno en IntelliJ:** Run → Edit Configurations → Modify options → Environment variables → añade `JWT_SECRET=<el string que copiaste>`.

### getSigningKey() — la base

Convierte el string `JWT_SECRET` en un objeto `SecretKey` que jjwt puede usar:

```java
private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
}
```

### generateToken() — construir el token firmado

Llamado por `AuthService` cuando un usuario se loguea exitosamente:

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

### parseClaims() — leer el payload del token

Helper privado — verifica la firma del token, comprueba la expiración y devuelve el payload como un mapa `Claims`:

```java
private Claims parseClaims(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
}
```

### extractUsername() — leer el claim subject

Llamado por `JwtFilter` como primer paso cuando llega un request:

```java
public String extractUsername(String token) {
    return parseClaims(token).getSubject();
}
```

### isValid() — comprobación de validación completa

Llamado por `JwtFilter` después de cargar el usuario de la base de datos:

```java
public boolean isValid(String token, String email) {
    try {
        return extractUsername(token).equals(email);
    } catch (JwtException e) {
        return false;
    }
}
```

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

Docs: [Baeldung — Database-backed UserDetailsService](https://www.baeldung.com/spring-security-authentication-with-a-database)

Archivo: `src/main/java/com/victor/timetrack/service/UserDetailsServiceImpl.java`

`UserDetailsService` tiene un trabajo: recibe un email, va a la base de datos, devuelve un objeto `UserDetails`. `DaoAuthenticationProvider` gestiona la comprobación de contraseña él mismo — tú no lo haces aquí.

Nunca llamas a `loadUserByUsername()` tú mismo. Spring Security lo llama automáticamente durante el login.

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

> **Conflicto de import a evitar:** Spring Security tiene su propia clase llamada `User`. Tu entidad también se llama `User`. Importa tu entidad (`com.victor.timetrack.model.User`) y usa la ruta completamente cualificada para el builder de Spring Security (`org.springframework.security.core.userdetails.User.withUsername(...)`).

---

## BCryptPasswordEncoder — nunca almacenes contraseñas en texto plano

Archivo: `src/main/java/com/victor/timetrack/security/SecurityConfig.java` (definido como `@Bean`)

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

No llamas a `.matches()` tú mismo. `DaoAuthenticationProvider` lo llama internamente cuando llamas a `authenticationManager.authenticate(...)` en `AuthService`.

Cuando creas una nueva cuenta de usuario (p.ej. en `UserService.create()`), llamas a `.encode()` tú mismo para hashear la contraseña antes de guardarla:

```java
user.setPassword(passwordEncoder.encode(request.getPassword()));
userRepository.save(user);
```

---

## Bean AuthenticationManager — exponer el coordinador de login

Archivo: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Spring Boot auto-configura un `AuthenticationManager` internamente pero no lo expone como bean de Spring por defecto. `AuthService` necesita inyectarlo para llamar a `.authenticate()` durante el login:

```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

---

## DTOs — LoginRequest y AuthResponse

### LoginRequest

Archivo: `src/main/java/com/victor/timetrack/dto/request/LoginRequest.java`

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

### AuthResponse

Archivo: `src/main/java/com/victor/timetrack/dto/response/AuthResponse.java`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
```

---

## AuthService — orquestar el login

Archivo: `src/main/java/com/victor/timetrack/service/AuthService.java`

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

**`authenticationManager.authenticate(...)`** — dispara el flujo de login completo de Spring Security internamente. Si algún check falla, lanza `BadCredentialsException` — no la capturas aquí. `GlobalExceptionHandler` la gestionará.

> `AuthService` nunca toca la base de datos directamente. Delega todas las comprobaciones de credenciales a `AuthenticationManager` y toda la lógica de tokens a `JwtUtil`.

---

## AuthController — el endpoint de login

Archivo: `src/main/java/com/victor/timetrack/controller/AuthController.java`

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

> `AuthController` no tiene lógica — solo recibe el request, delega a `AuthService` y envuelve el resultado en un `ResponseEntity`. Toda la lógica de negocio vive en la capa de service.

---

## GlobalExceptionHandler — respuestas de error limpias

Archivo: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

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

> `GlobalExceptionHandler` no captura `UsernameNotFoundException` directamente. Spring Security lo convierte a `BadCredentialsException` internamente — es intencional. Si el API dijera "usuario no encontrado", un atacante podría enumerar direcciones de email válidas.

---

## ✅ Flujo 1 completo — pruébalo en Postman

1. Ejecuta la app y busca `HikariPool-1 - Start completed.` en la consola
2. Ve a [bcrypt.online](https://bcrypt.online), escribe `password123`, cost factor 12, haz clic en Hash
3. En pgAdmin: `INSERT INTO users (name, email, password) VALUES ('Test User', 'test@test.com', '$2a$12$TU_HASH');`
4. Postman: `POST http://localhost:8080/api/auth/login` body `{"email":"test@test.com","password":"password123"}` → 200 `{"token":"eyJ..."}`
5. Contraseña incorrecta → 401 `{"error":"Invalid email or password"}`
6. Email vacío → 400 `{"error":"email: must not be blank"}`

---

## 🔒 El Flujo 2 empieza aquí — requests protegidos

---

## OncePerRequestFilter — el filtro JWT

Archivo: `src/main/java/com/victor/timetrack/security/JwtFilter.java`

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

        filterChain.doFilter(request, response);
    }
}
```

**`filterChain.doFilter(request, response)`** — "he terminado — pasa este request al siguiente filtro de la cadena". `JwtFilter` siempre lo llama — su trabajo no es bloquear requests, solo establecer (o no) al usuario en `SecurityContextHolder`. Bloquear es el trabajo de `SecurityFilterChain`.

**¿Por qué cargar el usuario de la BD si el token ya tiene el email?** El estado del usuario en la BD puede haber cambiado después de emitir el token — la cuenta podría haberse desactivado o tener un rol diferente.

---

## SecurityFilterChain — un lugar para todas las reglas de seguridad

Archivo: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

### Durante el desarrollo — abre todo mientras construyes JWT

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

**`.csrf(csrf -> csrf.disable())`** — JWT usa cabeceras, no cookies — los ataques CSRF no aplican. Deshabilitarlo elimina confusos errores 403.

**`.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)`** — inserta tu `JwtFilter` justo antes del filtro de autenticación por defecto de Spring.

---

## CORS — permitir que Angular llame al API

Docs: [Baeldung — CORS with Spring](https://www.baeldung.com/spring-cors)

CORS (Cross-Origin Resource Sharing) es una política de seguridad del navegador que bloquea JavaScript de llamar a un servidor en un origin diferente. Cuando Angular (localhost:4200) llama a Spring Boot (localhost:8080), el navegador lo bloquea — puertos diferentes = origins diferentes.

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

> **El error CORS solo aparece en el navegador** — Postman nunca envía un preflight, así que los errores CORS son invisibles en Postman. Si tu app Angular tiene un error CORS pero Postman funciona, el fix siempre está en el servidor.

> **¿Por qué no permitir cualquier origin con `"*"`?** Porque `setAllowCredentials(true)` y `setAllowedOrigins(List.of("*"))` no pueden usarse juntos — Spring lanza un error al arrancar. El comodín `"*"` más credenciales es un agujero de seguridad que la especificación CORS prohíbe.

---

## @PreAuthorize — autorización a nivel de método

Requiere `@EnableMethodSecurity` en `SecurityConfig` — sin ello, `@PreAuthorize` se ignora silenciosamente.

```java
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
}
```

**`hasRole('MANAGER')`** — comprueba que el usuario autenticado tiene la autoridad `ROLE_MANAGER`. Spring Security añade el prefijo `ROLE_` automáticamente, así que escribes `'MANAGER'` aquí y `.roles("MANAGER")` en `UserDetailsServiceImpl`.

---

## Errores comunes

**Olvidar `SessionCreationPolicy.STATELESS`** — Spring crea sesiones HTTP por defecto. Sin esto, obtienes sesiones Y JWT al mismo tiempo, que conflictúan y desperdician memoria.

**Orden de filtros incorrecto** — `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` es obligatorio. Si el filtro JWT se ejecuta después del filtro por defecto de Spring, el request se rechaza antes de que tu filtro tenga oportunidad de autenticarlo.

**`@PreAuthorize` ignorado silenciosamente** — si olvidas `@EnableMethodSecurity` en `SecurityConfig`, la anotación no hace nada. Sin error — la protección simplemente no existe.

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

### Entidad User — añadir role y active

```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private Role role;

@Column(nullable = false)
private Boolean active = true;
```

`active` por defecto `true` — una cuenta nueva está activa a menos que se desactive explícitamente. El _soft delete_ lo establece a `false`.

### UserDetailsServiceImpl — usar el rol real

```java
return org.springframework.security.core.userdetails.User
    .withUsername(user.getEmail())
    .password(user.getPassword())
    .roles(user.getRole().name())  // "EMPLOYEE" o "MANAGER" → Spring añade el prefijo ROLE_
    .build();
```

También bloquea usuarios inactivos de loguearse:

```java
if (!user.getActive()) {
    throw new UsernameNotFoundException("Account is disabled: " + username);
}
```

### data.sql — la primera cuenta de manager

Archivo: `src/main/resources/data.sql`

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

También necesitas esta línea en `application.properties` para que `data.sql` se ejecute siempre:

```properties
spring.sql.init.mode=always
```

### @PreAuthorize en endpoints de escritura

```java
@PostMapping
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

### SecurityContextHolder — leer el usuario actual dentro de un service

Docs: [Spring Security — SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder)

**El problema que resuelve:** HTTP es stateless — cada request es una conexión nueva, sin memoria de nada anterior. Entonces, cuando `TimeEntryService.create()` se ejecuta, ¿cómo sabe *quién* está llamando, ahora mismo, en este request concreto? No puede preguntárselo al cliente (mira la sección de IDOR en [security/05-security-vulnerabilities.md](../../security/es/05-security-vulnerabilities.md) para entender por qué no). Necesita un sitio donde consultar "el usuario autenticado de *este* request" — y ese sitio es `SecurityContextHolder`.

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
