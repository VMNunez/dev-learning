# Inyección de dependencias y beans de Spring

> 📖 [Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)

## Por qué existe la inyección de dependencias

Sin DI, una clase crea sus propias dependencias. Esto hace que la clase sea difícil de testear y esté fuertemente acoplada:

```java
// Sin DI — difícil de testear, fuertemente acoplado
public class TransactionService {
    // TransactionService crea su propio repositorio — no se puede cambiar por un mock en los tests
    private TransactionRepository repository = new TransactionRepository();
}
```

Con DI, Spring crea y proporciona la dependencia desde fuera:

```java
// Con DI — Spring inyecta el repositorio, puedes pasar un mock en los tests
@Service
public class TransactionService {
    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }
}
```

Esto es **Inversión de Control (IoC)** — en lugar de que la clase controle sus dependencias, Spring las controla. Declaras lo que una clase necesita; Spring lo proporciona. Este es el patrón que se repite en todo Spring Boot.

---

## Beans de Spring — lo que Spring gestiona

Un **bean** es cualquier objeto que Spring crea y gestiona. Spring almacena todos los beans en un contenedor llamado **Application Context**. Cuando anotas una clase con `@Service`, Spring crea una instancia y la guarda. Cuando otra clase la necesita, Spring inyecta esa misma instancia.

**Por defecto, cada bean es un singleton** — una instancia compartida en toda la aplicación. Por eso los campos de los servicios deben ser sin estado (sin variables de instancia que cambien entre requests).

---

## Anotaciones de beans — cuál usar

Las cuatro registran la clase como un bean de Spring. Las diferencias son semánticas y prácticas:

```java
@Component        // bean genérico — úsalo cuando no encaja ninguna anotación más específica
@Service          // capa de lógica de negocio (igual que @Component, mejor intención)
@Repository       // capa de acceso a datos (igual que @Component + traducción de excepciones)
@RestController   // capa web — gestiona requests HTTP y devuelve JSON
```

`@Repository` tiene una característica extra: traduce las excepciones de JPA/Hibernate a la jerarquía `DataAccessException` de Spring. Esto significa que la capa de service no necesita gestionar excepciones específicas de Hibernate — solo ve los tipos de excepción consistentes de Spring.

Usar la anotación correcta hace el código autodocumentado — cualquier desarrollador puede ver a qué capa pertenece una clase leyendo la anotación.

---

## Inyección por constructor — la forma correcta

Hay tres formas de inyectar dependencias. Solo la inyección por constructor es recomendada para código nuevo:

```java
// 1. Inyección de campo — evitar
@Service
public class TransactionService {
    @Autowired
    private TransactionRepository repository;  // Spring lo establece via reflexión
}

// 2. Inyección por setter — raro, mayormente legacy
@Service
public class TransactionService {
    private TransactionRepository repository;

    @Autowired
    public void setRepository(TransactionRepository repository) {
        this.repository = repository;
    }
}

// 3. Inyección por constructor — la elección correcta
@Service
public class TransactionService {
    private final TransactionRepository repository;

    // @Autowired es opcional desde Spring Framework 4.3 — Spring detecta el constructor único
    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }
}
```

**Por qué se prefiere la inyección por constructor:**

1. **`final` funciona** — el campo no puede cambiarse tras la construcción; sin reasignación accidental
2. **Dependencias visibles** — la firma del constructor muestra exactamente lo que necesita la clase; sin estado oculto
3. **Fácil de testear** — pasa un mock en el constructor sin necesitar un contexto de Spring
4. **Detección de dependencias circulares** — Spring falla al arrancar con un error claro en lugar de un crash en tiempo de ejecución

---

## @Bean — beans de clases de librería

`@Component`, `@Service` y `@Repository` funcionan cuando posees la clase. Cuando necesitas un bean de una clase de librería (una que no puedes anotar), usas `@Bean` en un método dentro de una clase `@Configuration`:

```java
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // clase de librería — no se le puede añadir @Component
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

Spring llama a estos métodos al arrancar y almacena los objetos devueltos como beans. Después, cualquier clase que tenga `PasswordEncoder` como parámetro de constructor recibe la instancia de `BCryptPasswordEncoder` automáticamente.

---

## Cómo Spring lo conecta todo al arrancar

```
Spring escanea todas las clases en com.victor.timetrack.*
        ↓
Encuentra @Component en JwtUtil          → crea bean JwtUtil
Encuentra @Component en JwtFilter        → necesita JwtUtil y UserDetailsService
Encuentra @Service en UserDetailsServiceImpl → necesita UserRepository
Encuentra @Service en AuthService        → necesita AuthenticationManager, JwtUtil
Encuentra @Configuration en SecurityConfig → llama a métodos @Bean
   → passwordEncoder()          → crea bean BCryptPasswordEncoder
   → authenticationManager()    → crea bean AuthenticationManager
        ↓
Spring conecta todas las dependencias via inyección por constructor
        ↓
Aplicación lista — todos los beans creados y conectados
```

Si falta algún bean (p.ej. olvidaste `@Service` en `AuthService`), Spring lanza `NoSuchBeanDefinitionException` al arrancar — no en tiempo de ejecución.

---

## @Qualifier y @Primary — múltiples implementaciones

Si dos clases implementan la misma interfaz, Spring no sabe cuál inyectar:

```java
public interface NotificationService { void send(String message); }

@Service
@Primary  // inyecta esta por defecto cuando se solicita la interfaz
public class EmailNotificationService implements NotificationService { ... }

@Service
public class SmsNotificationService implements NotificationService { ... }

// Para inyectar la de SMS explícitamente:
@Service
public class AlertService {
    public AlertService(@Qualifier("smsNotificationService") NotificationService ns) { ... }
}
```

En la práctica, rara vez necesitas `@Qualifier` o `@Primary` en proyectos simples. Aparecen en bases de código más grandes con múltiples implementaciones de la misma interfaz.

---

## @Value — leyendo configuración en beans

Lee valores de `application.properties` directamente en un campo:

```java
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;
}
```

La sintaxis `${}` coincide con la clave en `application.properties`. Si la clave no existe, Spring falla al arrancar — mejor que una `NullPointerException` en tiempo de ejecución.

Así es como evitas hardcodear secretos en el código. El valor viene del archivo de configuración, que no se commitea a git en producción (usa variables de entorno en su lugar).

---

## @ConfigurationProperties — vincular configuración agrupada a una clase

Propósito: cuando tienes varios valores de configuración relacionados (p.ej. `app.jwt.secret` y `app.jwt.expiration`), vincúlalos todos a la vez a una clase dedicada en lugar de escribir un `@Value` separado para cada campo.

Docs: https://www.baeldung.com/configuration-properties-in-spring-boot → leer: "Simple Properties" y "Nested Properties"

Archivo: `src/main/java/com/victor/timetrack/config/JwtProperties.java`

```properties
# application.properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
app.jwt.issuer=timetrack-api
```

```java
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String secret;
    private long expiration;
    private String issuer;
    // Lombok @Data genera getters/setters — requerido para el binding
}
```

```java
// En tu clase @Configuration o en la clase principal de la aplicación:
@EnableConfigurationProperties(JwtProperties.class)

// Luego inyéctalo como un bean normal:
@Service
public class JwtUtil {
    private final JwtProperties jwtProperties;
    public JwtUtil(JwtProperties jwtProperties) { this.jwtProperties = jwtProperties; }
}
```

**`@Value` vs `@ConfigurationProperties`:**

| | `@Value` | `@ConfigurationProperties` |
|---|---|---|
| Cuándo usar | Uno o dos valores aislados | Un grupo de valores relacionados |
| Seguridad de tipos | No — solo inyección de String | Sí — los campos tienen tipo |
| Testabilidad | Difícil de sobreescribir en tests | Fácil — solo construye la clase |

> **Por qué lo preguntan los entrevistadores:** en cuanto tienes más de tres inyecciones `@Value` para el mismo prefijo, el código empieza a oler. `@ConfigurationProperties` es el patrón de producción. "¿Cómo gestionas la configuración agrupada?" — esta es la respuesta esperada para candidatos junior senior.
