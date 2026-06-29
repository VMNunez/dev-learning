# Spring Security y JWT — Orden de estudio

> Abre este archivo cuando estés **estudiando o repasando**. Abre `06-security-jwt.md` cuando estés **implementando**.
>
> El orden aquí es: entender el concepto → ver el código. El archivo de referencia está ordenado para construir (cada clase depende de las que están encima).

---

## 1. El problema — por qué existe la seguridad

Sin seguridad, tu API está completamente abierta. Cualquiera que conozca la URL puede llamar a `GET /api/entries/1` y leer los datos de otra persona, o `DELETE /api/users/5` y destruirlos. La seguridad no es una feature — es la base.

Hay dos conceptos separados que a menudo se confunden:

**Autenticación** — ¿quién eres? El servidor verifica tu identidad. Ejemplo: envías tu email y contraseña, el servidor confirma que existes.

**Autorización** — ¿qué puedes hacer? El servidor verifica tus permisos. Ejemplo: estás autenticado, pero eres un empleado — no puedes acceder a los endpoints solo para managers.

---

## 2. Otros enfoques de autenticación — por qué JWT

**Autenticación basada en sesión** (el enfoque clásico)

```
El cliente envía email + contraseña
    ↓
El servidor verifica las credenciales
    ↓
El servidor crea una sesión en memoria (session ID: "abc123")
    ↓
El servidor envía una cookie con el session ID
    ↓
El cliente envía la cookie en cada request futuro
    ↓
El servidor lee el session ID de la cookie → lo busca en el session store → encuentra al usuario
```

La sesión vive **en el servidor**. Problema: si tienes múltiples servidores, cada uno tiene su propio session store. Necesitas almacenamiento compartido (Redis) — infraestructura extra.

**JWT** (lo que usamos)

```
El cliente envía email + contraseña
    ↓
El servidor verifica las credenciales
    ↓
El servidor genera un token firmado con el email + rol del usuario
    ↓
El cliente almacena el token y lo envía en cada cabecera de request futuro
    ↓
El servidor valida la firma del token — sin consulta a BD necesaria
```

El token vive **en el cliente**. El servidor es stateless — cualquier servidor puede validar un JWT porque la firma usa un secret compartido.

**Por qué JWT para este proyecto:**

| Criterio | Basado en sesión | JWT |
|---|---|---|
| Stateless | No — el servidor almacena sesiones | Sí — sin memoria en servidor |
| Escala horizontalmente | Necesita session store compartido | Funciona de inmediato |
| Invalidar instantáneamente | Sí | No (esperar a que expire) |
| Estándar en REST APIs | Menos común | Estándar |

Las REST APIs están diseñadas para ser stateless — cada request lleva todo lo que el servidor necesita. JWT encaja naturalmente. Las consultoras españolas construyen REST APIs stateless como estándar.

---

## 3. JWT — qué es el token

JWT (JSON Web Token) es un token firmado y autocontenido. Tres partes separadas por puntos:

```
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0 . abc123
─────────────────────   ──────────────────────────────────────   ──────
      HEADER                         PAYLOAD                    SIGNATURE
  { alg: "HS256" }        { sub: "user@example.com",           HMAC de
                             role: "USER",                     header +
                             exp: 1234567890 }                 payload +
                                                               clave secreta
```

- **Header** — qué algoritmo de firma se usó (HS256)
- **Payload** — los claims: datos del usuario como pares clave-valor (`sub` = email, `iat` = issued at, `exp` = expiración)
- **Signature** — HMAC de header + payload usando la clave secreta — demuestra que el token no fue manipulado

Cualquier servidor con la misma clave secreta puede verificar el token sin llamar a la base de datos. Este es el punto — sin sesión, sin estado compartido.

Una limitación importante: no puedes invalidar un JWT antes de que expire. Una vez emitido, el token es válido hasta que pase su claim `exp` — no hay estado en el lado del servidor que eliminar. La solución práctica es un tiempo de expiración corto (15-60 minutos). La alternativa es una blacklist de tokens en Redis, pero eso introduce estado en el servidor y derrota parcialmente el propósito de la autenticación stateless.

**HS256 vs RS256:** HS256 usa un secret compartido para firmar y verificar — correcto para un único backend. RS256 usa un par clave privada/pública — solo necesario cuando múltiples servicios verifican tokens de forma independiente (microservicios). Usamos HS256.

---

## 4. El panorama general — ambos flujos antes de cualquier código

Todo en este archivo sirve a uno de dos flujos. Entiende esto antes de leer cualquier clase.

**Ubicaciones de archivos** — todas en `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/`

| Clase | Archivo |
|---|---|
| `SecurityConfig` | `security/SecurityConfig.java` |
| `JwtUtil` | `security/JwtUtil.java` |
| `JwtFilter` | `security/JwtFilter.java` |
| `UserDetailsServiceImpl` | `service/UserDetailsServiceImpl.java` |
| `AuthService` | `service/AuthService.java` |
| `AuthController` | `controller/AuthController.java` |
| `GlobalExceptionHandler` | `exception/GlobalExceptionHandler.java` |
| `LoginRequest` | `dto/request/LoginRequest.java` |
| `AuthResponse` | `dto/response/AuthResponse.java` |

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

POST /api/auth/login { "email": "...", "password": "..." }
         │
         ▼
[Filtro CORS]  (solo navegador — Postman lo salta)
   ¿origin permitido? SÍ → continúa
         │
         ▼
[JwtFilter]
   lee cabecera Authorization → null → sin token
   → filterChain.doFilter() — pasa al siguiente filtro
         │
         ▼
[SecurityFilterChain]
   /api/auth/** → permitAll()
   → /api/auth/login está en la lista permitAll
     sin token requerido → el request llega a AuthController
         │
         ▼
[AuthController]
   @Valid → email: @NotBlank — password: @NotBlank
   inválido → GlobalExceptionHandler → HTTP 400
   válido → llama a AuthService.login(request)
         │ válido
         ▼
[AuthService]
   llama a authenticationManager.authenticate(email, pwd)
         │
         ▼
[AuthenticationManager]
   → delega a DaoAuthenticationProvider
         │
         ▼
[DaoAuthenticationProvider]  ← interno de Spring
   paso 1: llama a UserDetailsServiceImpl.loadUserByUsername(email)
           → consulta BD → devuelve UserDetails { email, hash BCrypt, [ROLE_USER] }
   paso 2: BCrypt.matches(rawPassword, userDetails.getPassword())
           sin coincidencia → GlobalExceptionHandler → HTTP 401
           coincidencia → autenticación exitosa
         │ coincidencia
         ▼
[AuthService]
   llama a JwtUtil.generateToken(email)
   → devuelve AuthResponse(token) a AuthController
         │
         ▼
[AuthController]
   → ResponseEntity.ok(authResponse)
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

GET /api/timesheets   Authorization: Bearer eyJ...
         │
         ▼
[Filtro CORS]  ¿origin permitido? SÍ → continúa
         │
         ▼
[JwtFilter]
   lee cabecera Authorization → "Bearer eyJ..." → elimina prefijo → token raw
         │
         ▼
[JwtUtil.extractUsername(token)]
   parseClaims() → lee claim "sub" → devuelve email
         │
         ▼
[UserDetailsServiceImpl.loadUserByUsername(email)]
   consulta BD → devuelve UserDetails { email, hash BCrypt, [ROLE_MANAGER] }
         │
         ▼
[JwtUtil.isValid(token, userDetails.getUsername())]
   ¿firma OK + no expirado?
   false → setAuthentication() nunca se llama
           JwtFilter llama a filterChain.doFilter()
           SecurityFilterChain: sin auth → HTTP 403
   true → continúa
         │ true
         ▼
[SecurityContextHolder]
   almacenamiento thread-local — guarda el usuario autenticado
   solo para la duración de este request
   setAuthentication(
     new UsernamePasswordAuthenticationToken(
       userDetails,              ← quién es el usuario
       null,                     ← JWT ya probó la identidad
       userDetails.getAuthorities() ← roles
     )
   )
         │
         ▼
[JwtFilter] → filterChain.doFilter()
   único trabajo de JwtFilter: establecer (o no) el contexto de auth
   nunca bloquea — siempre pasa el request hacia adelante
   SecurityFilterChain decide: permitir o denegar
         │
         ▼
[SecurityFilterChain]
   lee SecurityContextHolder
   .anyRequest().authenticated()
   usuario en contexto → request permitido
   sin usuario en contexto → HTTP 403 Forbidden
         │
         ▼
[@PreAuthorize("hasRole('MANAGER')")]  ← si está presente
   lee SecurityContextHolder
   rol incorrecto → AccessDeniedException → HTTP 403
   rol OK → el método se ejecuta
         │
         ▼
[método @RestController]
   todos los checks pasados — la lógica de negocio corre aquí
         │
         ▼
HTTP 200 + datos de respuesta
```

---

### Global — ambos flujos en contexto

```
─ ─ ─ AL ARRANCAR ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
[SecurityConfig] → crea filtro CORS, SecurityFilterChain,
                   registra JwtFilter, expone beans
─ ─ ─ POR REQUEST ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

    POST /api/auth/login              GET /api/cualquier-ruta-protegida
    { email, password }               Authorization: Bearer eyJ...
            │                                      │
            └──────────────────┬───────────────────┘
                               │
                       [Filtro CORS]
                  ¿origin permitido? SÍ → continúa
                               │
                          [JwtFilter]
                               │
              ┌────────────────┴─────────────────┐
         sin token                            token encontrado
              │                                   │
filterChain.doFilter()             extractUsername() → email
"pass through"                     loadUserByUsername(email)
              │                    isValid(token) → OK
   [SecurityFilterChain]           SecurityContextHolder ← establecido
   /api/auth/** → permitAll()      filterChain.doFilter()
              │                         [SecurityFilterChain]
      [AuthController]                  authenticated() → OK
              │                                    │
      [AuthService]                        [@PreAuthorize]
              │                             role check → OK
   [AuthenticationManager]                          │
              │                           [@RestController]
   [DaoAuthenticationProvider]            request procesado
       ╱              ╲
[UserDetailsServiceImpl]  [BCrypt]
   carga usuario de BD    matches()
       ╲              ╱
     ¿ambos OK?
          │
[JwtUtil.generateToken()]
          │
  [AuthController]
  ResponseEntity.ok()
          │
{ "token": "eyJ..." }

ruta de error → [GlobalExceptionHandler]
  @Valid falla       → HTTP 400  { "error": "field: ..." }
  contraseña errónea → HTTP 401  { "error": "Invalid email or password" }
  token malo/expirado→ HTTP 403  (sin auth establecida, Spring rechaza)
  rol incorrecto     → HTTP 403  (AccessDeniedException)
```

**Qué es responsable cada clase:**

| Clase | Flujo | Responsabilidad |
|---|---|---|
| `SecurityConfig` | Ambos | Configura todas las reglas: rutas, registro de filtros, CORS |
| `JwtUtil` | Ambos | Crea tokens (Flujo 1) y los valida (Flujo 2) |
| `UserDetailsServiceImpl` | Ambos | Carga un usuario de la BD por email |
| `BCryptPasswordEncoder` | Solo Flujo 1 | Compara contraseña raw contra hash almacenado |
| `AuthService` | Solo Flujo 1 | Orquesta el login — llama a authenticate(), luego a generateToken() |
| `AuthController` | Solo Flujo 1 | Recibe el request HTTP de login, devuelve el token |
| `JwtFilter` | Solo Flujo 2 | Intercepta cada request, valida JWT, establece SecurityContextHolder |
| `GlobalExceptionHandler` | Ambos | Convierte excepciones en respuestas JSON limpias |

---

## 5. BCryptPasswordEncoder — cómo se almacenan las contraseñas

File: `security/SecurityConfig.java` — definido como `@Bean` dentro de SecurityConfig

Este es el primer concepto que entender porque todas las demás clases asumen que las contraseñas se almacenan como hashes BCrypt.

Si la base de datos se compromete, las contraseñas en texto plano exponen a cada usuario inmediatamente. BCrypt es un algoritmo de hash unidireccional — no puedes revertir un hash a la contraseña original.

```java
// SecurityConfig — define el bean una vez
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// NUNCA llamas a .matches() directamente — DaoAuthenticationProvider lo llama internamente
// cuando AuthService llama a authenticationManager.authenticate(email, password).
// La única vez que llamas a .encode() tú mismo es cuando creas un nuevo usuario:
// UserService.create() → passwordEncoder.encode(request.getPassword()) → guarda hash en BD
```

**`new BCryptPasswordEncoder()`** — crea un encoder con la fuerza por defecto (10 rondas). Más rondas = hash más lento = más difícil de fuerza bruta.

**`.matches(raw, encoded)`** — hashea el string raw y comprueba si coincide con el hash almacenado. Nunca decodificas — BCrypt solo va en una dirección.

> Nunca llames a `.encode()` en una contraseña que ya está hasheada — estarías hasheando el hash. Siempre pasa solo la contraseña raw que vino del usuario.

---

## 6. UserDetailsService — enseñarle a Spring dónde están tus usuarios

File: `service/UserDetailsServiceImpl.java`

Spring Security no sabe cómo encontrar usuarios en tu base de datos. Implementas `UserDetailsService` para enseñarle. Este es el puente entre Spring Security y tu entidad `User`.

Tiene un trabajo: recibe un email, va a la base de datos, devuelve un objeto `UserDetails`. `DaoAuthenticationProvider` gestiona la comprobación de contraseña él mismo — tú no lo haces aquí.

```
[DaoAuthenticationProvider]
       ↓
loadUserByUsername(email)   ← tú implementas esto
       ↓
[UserRepository.findByEmail(email)]
       ↓
devuelve UserDetails (email + hash de contraseña + roles)
       ↓
[DaoAuthenticationProvider llama a BCrypt.matches()]
```

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
            .roles("USER")
            .build();
    }
}
```

**`@Service`** — le dice a Spring "crea una instancia de esta clase y gestíonala como bean". Nunca llamas a `new UserDetailsServiceImpl()` tú mismo — Spring lo inyecta donde sea necesario.

**`@Override`** — le dice a Java que estás implementando un método declarado en una interfaz (`UserDetailsService`). IntelliJ te advierte si la firma del método no coincide con la interfaz.

**`loadUserByUsername(String username)`** — a pesar del nombre, `username` es el email. Spring Security usa "username" como término genérico para "el identificador de login". Nunca lo llamas tú mismo — Spring lo llama automáticamente durante el login.

**`org.springframework.security.core.userdetails.User.withUsername(...).build()`** — el propio builder `User` de Spring Security. Convierte tu entidad en el formato `UserDetails` con el que Spring trabaja internamente.

> Conflicto de import: Spring Security tiene su propia clase llamada `User`. Tu entidad también se llama `User`. Importa tu entidad y usa la ruta completa para el builder de Spring Security.

---

## 7. JwtUtil — crear y validar tokens

File: `security/JwtUtil.java` · config: `src/main/resources/application.properties`

Ahora entiendes qué es un JWT (sección 3) y cómo se almacenan los usuarios (secciones 5-6). `JwtUtil` es lo que crea y valida los tokens reales.

Tiene cinco métodos: tres públicos, dos privados. Los privados son llamados por los públicos.

```
generateToken(email)           ← llamado por AuthService después del login
extractUsername(token)         ← llamado por JwtFilter para obtener email del token
isValid(token, email)          ← llamado por JwtFilter para confirmar que el token está OK
─────────────────────────────────────────────────────────
parseClaims(token)             ← privado, usado por extractUsername + isValid
getSigningKey()                ← privado, usado por generateToken + parseClaims
```

### Declaración de clase

```java
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;
}
```

**`@Component`** — le dice a Spring "crea una instancia de esta clase y gestíonala". Se usa para clases de utilidad (no lógica de service, no controladores). Spring la inyecta en `JwtFilter` y `AuthService` automáticamente.

**`@Value("${app.jwt.secret}")`** — lee un valor de `application.properties` al arrancar y lo inyecta en el campo. Si la clave falta, la app falla al arrancar. Así evitas hardcodear secrets en el código.

### application.properties — config JWT

```properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
```

`${JWT_SECRET}` lee de una variable de entorno al arrancar — mismo patrón que `${DB_PASSWORD}`. `86400000` es 24 horas en milisegundos. El secret debe estar codificado en Base64.

### getSigningKey() — convierte el string secret en una clave criptográfica

```java
private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
}
```

**`Decoders.BASE64.decode(secret)`** — convierte el string Base64 de vuelta a bytes raw.

**`Keys.hmacShaKeyFor(keyBytes)`** — envuelve los bytes raw en el tipo `SecretKey` que jjwt requiere. También valida que la clave sea suficientemente larga para HS256.

### generateToken() — construir el token firmado

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

**`.subject(username)`** — almacena el email en el claim `sub`. Así identificas a quién pertenece el token al validar después.

**`.expiration(...)`** — `System.currentTimeMillis()` es ahora. Añadir `expiration` (86400000 ms) te da 24 horas desde ahora. jjwt lo comprueba automáticamente al parsear.

**`.compact()`** — ensambla las tres partes, las firma y devuelve `header.payload.signature`.

### parseClaims() — leer y verificar el token

```java
private Claims parseClaims(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
}
```

**`.parseSignedClaims(token)`** — comprueba la firma, comprueba la expiración, parsea el payload. Si algo está mal, lanza `JwtException`. Solo obtienes `Claims` de vuelta si todo es válido.

### extractUsername() e isValid()

```java
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
```

**`isValid()`** — llama a `extractUsername()` que llama a `parseClaims()`. Si el token está expirado o manipulado, `parseClaims()` lanza `JwtException` — capturado aquí y devuelve `false`. El llamador nunca necesita gestionar excepciones.

---

## 8. JwtFilter — validar cada request

File: `security/JwtFilter.java`

Ahora sabes qué es un JWT, cómo se almacenan los usuarios y cómo validar un token. `JwtFilter` es lo que lo une todo en cada request entrante.

`OncePerRequestFilter` garantiza que el filtro se ejecute exactamente una vez por request, nunca dos.

**Flujo de decisión — qué pasa dentro de cada request:**

```
Request llega
      │
      ▼
¿Tiene cabecera "Authorization"?
  NO ────────────────────────→ pass through
      │                        (Spring rechaza si el endpoint necesita auth)
  SÍ
      ▼
¿Empieza con "Bearer "?
  NO ────────────────────────→ pass through
      │
  SÍ → elimina prefijo "Bearer " (7 chars)
      ▼
JwtUtil.extractUsername(token) → obtiene email
      │
      ▼
UserDetailsService.loadUserByUsername(email)
      │
      ▼
¿JwtUtil.isValid(token, email)?
  NO ────────────────────────→ pass through (Spring rechaza)
      │
  SÍ
      ▼
SecurityContextHolder.setAuthentication(...)
      │
      ▼
filterChain.doFilter() → continúa al controlador
```

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

**`@Component`** — le dice a Spring "crea una instancia de esta clase y gestíonala". Spring entonces la inyecta en `SecurityConfig`, que la registra en la filter chain. Sin `@Component`, Spring no sabe que el filtro existe.

**`SecurityContextHolder.getContext().getAuthentication() == null`** — solo procesa si aún no está autenticado. Evita hacer el trabajo dos veces.

**¿Por qué cargar el usuario de la BD si el token ya tiene el email?** El estado del usuario en la BD puede cambiar después de emitir el token. La cuenta podría haberse eliminado, bloqueado o tener un rol diferente.

**`UsernamePasswordAuthenticationToken(userDetails, null, authorities)`** — el objeto que Spring Security usa para representar a un usuario autenticado. `null` para credenciales — el JWT ya probó la identidad. Las authorities son los roles.

**`filterChain.doFilter()`** — siempre se llama al final, tanto si el token era válido como si no. El trabajo de `JwtFilter` es establecer (o no establecer) al usuario en `SecurityContextHolder`. Bloquear es el trabajo de `SecurityFilterChain` — si no se estableció nada, lo rechaza allí.

**SecurityContextHolder — ciclo de vida por request:**

```
Request llega
      │
      ▼
JwtFilter establece SecurityContextHolder   ← almacenamiento thread-local
      │                                        (solo existe para este request)
      ▼
SecurityFilterChain  ──lee──┐
@PreAuthorize        ──lee──┤  todos leen el mismo SecurityContextHolder
@RestController      ──lee──┘
      │
      ▼
Request termina → SecurityContextHolder se limpia automáticamente
```

Es **thread-local** — cada request se ejecuta en su propio hilo y tiene su propio `SecurityContextHolder` aislado. El siguiente request del mismo usuario empieza desde cero y pasa por `JwtFilter` de nuevo.

---

## 9. SecurityFilterChain — conectar todo

File: `security/SecurityConfig.java`

Ahora que sabes lo que hacen `JwtFilter` y `UserDetailsService`, la configuración tiene sentido. Aquí es donde registras cada pieza y estableces las reglas de ruta.

```
HTTP request
    ↓
[Comprobación CORS]        → ¿origin permitido?
    ↓
[JwtFilter]                → lee y valida JWT, establece SecurityContextHolder
    ↓
[SecurityFilterChain]      → comprueba reglas de ruta: ¿permitAll o authenticated?
    ↓
[@PreAuthorize]            → comprueba rol (si la anotación está presente)
    ↓
[@RestController]          → solo se alcanza si todos los checks pasaron
```

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

**`@Configuration`** — le dice a Spring "esta clase contiene definiciones de beans". Spring la lee al arrancar y llama a cada método `@Bean` para crear los beans. Sin esto, la clase se ignora.

**`@EnableWebSecurity`** — activa Spring Security. Sin esto, Spring Security no hace nada — cada ruta está abierta independientemente de tus reglas.

**`@EnableMethodSecurity`** — habilita `@PreAuthorize` en métodos individuales. Sin esto, la anotación se ignora silenciosamente — aparece en el código pero no tiene efecto.

| Configuración | Por qué |
|---|---|
| `csrf().disable()` | JWT usa cabeceras, no cookies — los ataques CSRF no aplican |
| `SessionCreationPolicy.STATELESS` | Sin sesiones HTTP. Cada request lleva su propio JWT |
| `addFilterBefore(jwtFilter, ...)` | Tu filtro JWT se ejecuta antes del filtro de autenticación por defecto de Spring |
| `@EnableMethodSecurity` | Habilita `@PreAuthorize` — sin esto se ignora silenciosamente |

**Por qué se deshabilita CSRF:** CSRF (Cross-Site Request Forgery) es un ataque donde un sitio web malicioso engaña a tu navegador para que haga un request a tu API. JWT no usa cookies. El token vive en `localStorage` y Angular lo adjunta manualmente en la cabecera `Authorization`. Los navegadores nunca envían cabeceras personalizadas automáticamente a otros dominios, así que el ataque no funciona.

**Bean `authenticationManager()`** — Spring auto-configura un `AuthenticationManager` internamente pero no lo expone. `AuthService` necesita inyectarlo para llamar a `.authenticate()` — así que lo expones aquí con `@Bean`.

---

## 10. CORS — permitir que Angular llame al API

File: `security/SecurityConfig.java` — método `corsConfigurationSource()`

CORS es una política de seguridad del navegador. Cuando Angular (localhost:4200) llama a Spring Boot (localhost:8080), el navegador lo bloquea — puertos diferentes = origins diferentes.

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

**`OPTIONS` en los métodos permitidos** — el navegador envía un request preflight `OPTIONS` antes de cada `POST`, `PUT`, etc. para comprobar si CORS está permitido. Debe incluirse.

**`setAllowedHeaders(List.of("*"))`** — permite cualquier cabecera, incluida `Authorization: Bearer <token>`.

> El error CORS solo aparece en el navegador — no es un bug del backend. El fix siempre está en el servidor.

---

## 11. AuthService — orquestar el login

File: `service/AuthService.java`

Con BCrypt (5), UserDetailsService (6), JwtUtil (7) y SecurityFilterChain (9) en su lugar, `AuthService` puede coordinar el login completo en tres líneas:

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

**`authenticationManager.authenticate(...)`** — dispara el flujo de login completo de Spring Security: llama a `UserDetailsService.loadUserByUsername()` para cargar al usuario, luego a `BCrypt.matches()` para comparar contraseñas. Si alguno falla, lanza `BadCredentialsException` — `GlobalExceptionHandler` lo gestiona.

**`new UsernamePasswordAuthenticationToken(email, password)`** — un simple portador de datos. No es un bean de Spring — solo un objeto que lleva el email y la contraseña raw para que `AuthenticationManager` lo use.

**`jwtUtil.generateToken(email)`** — solo se llama después de que `authenticate()` devuelve sin lanzar. En ese punto las credenciales están verificadas.

> `AuthService` nunca toca la base de datos directamente. Delega las comprobaciones de credenciales a `AuthenticationManager` y la lógica de tokens a `JwtUtil`.

---

## 12. AuthController — el endpoint de login

File: `controller/AuthController.java` · DTOs: `dto/request/LoginRequest.java` · `dto/response/AuthResponse.java`

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

**`@RestController`** — combina dos anotaciones: `@Controller` (esta clase gestiona requests HTTP) y `@ResponseBody` (cada valor de retorno se serializa automáticamente a JSON). Sin `@ResponseBody`, Spring intentaría renderizar una vista HTML en lugar de devolver JSON.

**`@RequestMapping("/api/auth")`** — prefijo de URL base para todos los endpoints de este controlador. Cada método hereda este prefijo. `@PostMapping("/login")` se convierte en `POST /api/auth/login`.

**`@Valid`** — dispara la validación en `LoginRequest`. Si algún campo falla, Spring lanza `MethodArgumentNotValidException` y `GlobalExceptionHandler` devuelve 400 — `AuthService` nunca se llama.

**`@NotBlank`** (en los campos de `LoginRequest`) — constraint de validación: el campo no debe ser null y debe contener al menos un carácter que no sea espacio en blanco.

> `AuthController` no tiene lógica. Recibe el request, delega a `AuthService` y envuelve el resultado. Toda la lógica de negocio vive en la capa de service.

---

## 13. GlobalExceptionHandler — respuestas de error limpias

File: `exception/GlobalExceptionHandler.java`

Sin esto, Spring devuelve una página HTML de error genérica o un confuso 500. Esta clase captura excepciones y las convierte en JSON limpio.

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

**`@RestControllerAdvice`** — marca esta clase como handler global de errores para todas las clases `@RestController`. Combina `@ControllerAdvice` (interceptar excepciones) y `@ResponseBody` (devolver JSON, no una página HTML de error). Sin esto, Spring devuelve una página HTML 500 genérica.

**`@ExceptionHandler(BadCredentialsException.class)`** — Spring llama a este método cuando se lanza `BadCredentialsException` en cualquier flujo de controlador.

**`HttpStatus.UNAUTHORIZED`** — 401 = no autenticado. 403 = autenticado pero no permitido. Son diferentes — usa el correcto.

> `GlobalExceptionHandler` no captura `UsernameNotFoundException` directamente. Spring Security lo convierte a `BadCredentialsException` internamente — intencional, para que el API no revele si el email existe.

---

## 14. @PreAuthorize — restringir el acceso por rol

File: anotación usada en cualquier método `@RestController` — sin archivo dedicado

Después de que el filtro JWT establece el `SecurityContext`, puedes restringir el acceso a nivel de método:

```java
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
}
```

**`hasRole('MANAGER')`** — Spring Security añade el prefijo `ROLE_` automáticamente. Así `'MANAGER'` aquí coincide con `ROLE_MANAGER` en `UserDetailsService`.

Requiere `@EnableMethodSecurity` en `SecurityConfig` — sin esto, la anotación se ignora silenciosamente.

---

## 15. Flujos de error — qué pasa cuando las cosas van mal

Estos tres caminos están completamente ausentes de los flujos del happy path anteriores. Los entrevistadores preguntan sobre ellos con frecuencia.

---

**Contraseña incorrecta:**

```
POST /api/auth/login { email: ok, password: incorrecta }
→ AuthService → authenticationManager.authenticate()
→ DaoAuthenticationProvider → BCrypt.matches() → SIN COINCIDENCIA
→ lanza BadCredentialsException
→ GlobalExceptionHandler.handleBadCredentials()
→ HTTP 401  { "error": "Invalid email or password" }
```

> Spring Security también convierte `UsernameNotFoundException` en `BadCredentialsException` internamente — así que un email incorrecto y una contraseña incorrecta devuelven el mismo mensaje 401. Intencional: si el API devolviera errores diferentes, un atacante podría enumerar emails válidos.

---

**Token expirado o manipulado:**

```
GET /api/timesheets  Authorization: Bearer <token-expirado-o-falso>
→ JwtFilter → JwtUtil.extractUsername(token)
→ parseClaims() → parseSignedClaims() lanza JwtException
→ isValid() captura JwtException → devuelve false
→ SecurityContextHolder NO se establece
→ filterChain.doFilter() continúa
→ SecurityFilterChain: .anyRequest().authenticated() → DENEGADO
→ HTTP 403 Forbidden
```

---

**Autenticado pero rol incorrecto:**

```
DELETE /api/users/1  Authorization: Bearer <token-empleado-válido>
→ JwtFilter valida token → establece EMPLOYEE en SecurityContextHolder
→ SecurityFilterChain: authenticated() → OK
→ @PreAuthorize("hasRole('MANAGER')") lee SecurityContextHolder
    rol actual: EMPLOYEE / rol requerido: MANAGER → EMPLOYEE ≠ MANAGER
→ lanza AccessDeniedException
→ HTTP 403 Forbidden
```

> Nota la diferencia: un token ausente/inválido devuelve 403 por el comportamiento por defecto de Spring Security. Un rol incorrecto también devuelve 403. Ambos son 403 pero por razones diferentes — fallo de autenticación vs fallo de autorización.

---

## 16. Errores comunes

**Olvidar `SessionCreationPolicy.STATELESS`** — Spring crea sesiones HTTP por defecto. Sin esto, obtienes sesiones Y JWT, que conflictúan y desperdician memoria.

**Orden de filtros incorrecto** — `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` es obligatorio. Si el filtro JWT se ejecuta después del filtro por defecto de Spring, el request se rechaza antes de que tu filtro tenga oportunidad de autenticarlo.

**CSRF habilitado con JWT** — CSRF es para sesiones basadas en cookies. Si lo dejas activado, cada request que no sea GET se rechazará por falta de un token CSRF.

**Devolviendo 403 en lugar de 401** — 401 = no autenticado (sin token). 403 = autenticado pero no permitido (rol incorrecto). Spring Security a veces devuelve 403 para requests no autenticados por defecto.

**`@PreAuthorize` ignorado silenciosamente** — si olvidas `@EnableMethodSecurity` en `SecurityConfig`, la anotación no hace nada y cualquier rol puede acceder al endpoint protegido.

---

## 17. Este es un patrón reutilizable

La capa de seguridad JWT es boilerplate — la estructura no cambia entre proyectos. Una vez que lo entiendes y lo implementas una vez, lo copias a cada futura app Spring Boot.

**Archivos que siempre son idénticos:**

- `JwtUtil.java`
- `JwtFilter.java`
- `GlobalExceptionHandler.java`
- `AuthService.java`
- `AuthController.java`
- `LoginRequest.java` + `AuthResponse.java`

**Archivos donde solo cambian pequeños detalles:**

| Archivo | Qué cambia |
|---|---|
| `SecurityConfig.java` | Reglas de ruta — qué paths son públicos, cuáles protegidos |
| `UserDetailsServiceImpl.java` | El campo usado para encontrar al usuario (email, username) y los roles |
