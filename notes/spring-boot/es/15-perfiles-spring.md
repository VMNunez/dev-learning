# Perfiles de Spring y seeding al arranque

Docs: [Baeldung — Spring Profiles](https://www.baeldung.com/spring-profiles) → read: "Use @Profile on a Bean", "@Profile with Spring XML" (sáltalo) y "Setting the Active Profile"

Todos los archivos hasta ahora han dado por hecho una cosa sin decirla nunca: que tu aplicación se ejecuta *igual en todos lados*. El filtro con `Specification` de [14-especificaciones-criteria-api.md](14-especificaciones-criteria-api.md) se comporta idéntico en tu portátil y en un servidor. Igual que el filtro JWT, el manejador de excepciones y cada servicio. Esa suposición se sostiene para la *lógica* — pero se rompe en cuanto necesitas algo que debe existir **solo en tu máquina y nunca en producción**.

TimeTrack tiene exactamente una cosa así, y empezó siendo un bug real del backlog. Para poder iniciar sesión durante el desarrollo necesitas una cuenta de manager en la base de datos, pero no hay endpoint de registro — así que la primera cuenta había que sembrarla (_seed_) al arranque. La forma original de hacerlo era un archivo `data.sql`:

```sql
-- el ANTIGUO data.sql — borrado en este paso
INSERT INTO users (id, email, password, name, role, active)
VALUES (nextval('users_seq'),
        'manager@timetrack.com',
        '$2a$10$0Q59WhP76BarGkra8uDyfOV/J9meIXU5AXsx5JDMflgqFlorwxvfS',  -- un hash BCrypt real
        'Admin Manager', 'MANAGER', true)
ON CONFLICT (email) DO NOTHING;
```

Hay dos cosas mal en esto, y ambas son la razón de que exista este archivo:

1. **El hash BCrypt está commiteado en git a la vista de todos.** Cualquiera que clone el repo lo tiene. BCrypt está diseñado para ser lento, pero una contraseña débil detrás de un hash público sigue siendo crackeable offline — y peor aún, esa misma cuenta de admin viajaría a *todos* los entornos a los que llegue el código, incluida la imagen Docker del Step 11. Un admin por defecto con una credencial visible en git es un hallazgo de manual en una revisión de seguridad.
2. **`data.sql` se ejecuta en todos lados, sin condición.** No tiene forma de decir "solo en mi portátil". La propiedad `spring.sql.init.mode=always` significa *siempre*: dev, prod, Docker, todos.

El arreglo necesita dos capacidades que SQL sencillamente no tiene: una forma de ejecutar el código de seed **solo en desarrollo**, y una forma de construir el hash de la contraseña **en tiempo de ejecución a partir de un secreto que nunca toca git**. Las dos viven en Java, y las dos son lo que enseña este archivo:

```
   ¿Ejecutar código solo en dev?           ──►  @Profile("dev")  — el bean ni siquiera se crea fuera de dev
   ¿Ejecutar código una vez al arrancar?   ──►  CommandLineRunner — Spring llama a run() tras cargar el contexto
   ¿Leer una propiedad / env var en Java?  ──►  @Value("${app.admin.password}")  ← encadenado a ${ADMIN_PASSWORD}
   ¿Hashear la contraseña al arrancar?     ──►  passwordEncoder.encode(...)  — nunca un hash guardado
```

---

## Qué es un perfil — una etiqueta de entorno

Propósito: entender qué significa "el perfil activo" antes de usarlo, porque tanto `@Profile` como `application-{profile}.properties` no tienen sentido sin él.
Docs: [Baeldung — Spring Profiles](https://www.baeldung.com/spring-profiles) → read: "Setting the Active Profile"

Un **perfil** no es más que una etiqueta con nombre que asignas a una ejecución de tu app: `dev`, `prod`, `test`, `local`. Por sí solo no hace nada — es una cadena de texto. Su poder está en que otros dos mecanismos *reaccionan* a él: los archivos de propiedades nombrados según el perfil, y los beans anotados con el perfil. Piénsalo como accionar un interruptor etiquetado "¿en qué entorno estoy?" una vez, al arrancar, y dejar que el resto de la app lea ese interruptor.

El perfil activo se establece **desde fuera del código**, nunca desde dentro. La forma estándar es una variable de entorno:

```
SPRING_PROFILES_ACTIVE=dev
```

> **¿Por qué desde fuera, y no una línea en el código?** La idea entera es que el *mismo jar compilado* se comporte distinto según el entorno. Si el perfil estuviera metido en el código fuente, tendrías que recompilar para cambiar de entorno — lo que echa por tierra el propósito. Tu portátil pone `dev`; el servidor de producción pone `prod`; el jar es byte por byte idéntico. En IntelliJ lo pones en el campo *Environment variables* de la Run Configuration, así vive en tu máquina y nunca llega a git.

> **¿Dónde lee esto Spring?** `SPRING_PROFILES_ACTIVE` es la forma como variable de entorno de la propiedad `spring.profiles.active`. El "relaxed binding" de Spring Boot trata las env vars en `MAYUSCULAS_CON_GUION_BAJO` y las propiedades en `minusculas.con.puntos` como la misma clave — la misma regla que deja que `${DB_PASSWORD}` rellene `spring.datasource.password`. Si no se establece ningún perfil, Spring arranca solo con el perfil `default`, y nada específico de perfil se activa.

## `application-{profile}.properties` — configuración que carga solo para un perfil

Propósito: mantener los ajustes específicos del entorno (las credenciales del admin) fuera de la configuración compartida y fuera de cualquier otro entorno.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/resources/application-dev.properties`
Docs: [Baeldung — Properties with Spring](https://www.baeldung.com/properties-with-spring-and-spring-boot) → read: "Properties Per Environment / Profile-Specific"

Spring Boot lleva incorporada una convención de nombres: un archivo llamado `application-{profile}.properties` se carga **solo** cuando ese perfil está activo, y se carga **encima** del `application.properties` base, no en su lugar. Esto no se configura en ningún sitio — el nombre del archivo es el cableado.

Así que TimeTrack tiene ahora dos archivos. El base, siempre cargado:

```properties
# application.properties — común a todos los entornos
spring.datasource.url=jdbc:postgresql://localhost:5432/timetrack
spring.datasource.password=${DB_PASSWORD}
app.jwt.secret=${JWT_SECRET}
# ...
```

Y el de solo-dev, cargado únicamente cuando `SPRING_PROFILES_ACTIVE=dev`:

```properties
# application-dev.properties — las tres propiedades del seed del admin, y nada más
app.admin.email=manager@timetrack.com
app.admin.password=${ADMIN_PASSWORD}
app.admin.name=Admin Manager
```

El modelo mental de lo que la app realmente ve es una fusión, primero el base y encima el del perfil:

```
application.properties            →  datasource, jpa, jwt...        ← siempre
        +
application-dev.properties        →  app.admin.*  (solo dev)        ← solo si perfil = dev
        =
la configuración que lee la app en ejecución
```

> **¿Por qué solo tres líneas, y no una copia completa?** Porque es una *fusión*, no un *reemplazo*. Todo lo del archivo base sigue aplicando en `dev` sin repetirlo — solo añades lo que es nuevo o distinto en este entorno. La regla práctica: mismo valor en todos lados → archivo base; solo existe o cambia en un entorno → archivo de ese entorno. (Si la *misma clave* apareciera en ambos, ganaría la del perfil — el archivo más específico pisa al base — pero aquí las tres claves `app.admin.*` son totalmente nuevas, así que no se está pisando nada.)

> **`${ADMIN_PASSWORD}` es una segunda indirección, separada — no la confundas con el perfil.** El perfil decide *qué archivo carga*; `${ADMIN_PASSWORD}` es sintaxis de placeholder que le dice a Spring "lee este valor de una variable de entorno llamada `ADMIN_PASSWORD`" — el mismo mecanismo exacto que `${DB_PASSWORD}` y `${JWT_SECRET}`. Si esa env var falta al arrancar, la app no inicia en vez de caer a un valor por defecto. Eso es deliberado: una contraseña por defecto escondida es justo el bug que estamos eliminando. Así que la contraseña llega a la app por *dos* puertas — el archivo solo carga en `dev`, e incluso entonces su valor viene de un secreto local de la máquina, nunca de git.

## `@Profile` en un bean — creado solo cuando el perfil está activo

Propósito: hacer que todo el componente de seed exista *solo* en desarrollo, para que no haya ningún camino posible por el que se ejecute en producción.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/config/DataInitializer.java`
Docs: [Baeldung — Spring Profiles](https://www.baeldung.com/spring-profiles) → read: "Use @Profile on a Bean"

`@Profile("dev")` sobre una clase anotada con `@Component` (o un método `@Bean`) le dice a Spring: *registra este bean solo cuando el perfil `dev` esté activo.* Este es el más fuerte de los tres mecanismos, y la distinción importa:

```java
@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {
    // ...
}
```

> **Es "no se crea", no "se crea pero se salta".** Cuando el perfil es `prod`, Spring no instancia esta clase en absoluto — nunca aparece en el contexto de la aplicación, su constructor nunca corre, su `run()` nunca se alcanza. Compáralo con un `if (esDev) return;` dentro del método: ahí el objeto sí existe y la comprobación corre cada vez. `@Profile` elimina el bean de la existencia, y por eso es la herramienta correcta para "esto debe ser imposible en producción" en lugar de solo "esto debería estar apagado en producción". No hay camino en tiempo de ejecución hacia el seed en un build `prod` porque no hay objeto de seed al que llegar.

> **¿Por qué ponerlo en un paquete `config/`?** Los beans cuyo trabajo es cableado o comportamiento de arranque — no atender peticiones — viven por convención en `config/`. Es la misma idea que `SecurityConfig` estando ahí: quien lee el proyecto ve "esto es infraestructura, no una funcionalidad". El nombre del paquete es convención, no una regla que Spring imponga.

## `CommandLineRunner` — ejecutar código una vez, justo tras el arranque

Propósito: obtener un gancho que Spring ejecuta exactamente una vez cuando la app termina de arrancar, con todos tus beans (el repositorio, el password encoder) ya disponibles para usar.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/config/DataInitializer.java`
Docs: [Baeldung — Spring Boot CommandLineRunner](https://www.baeldung.com/spring-boot-console-app) → read: "The CommandLineRunner"

`data.sql` nos daba "ejecuta esto al arrancar" gratis. Una vez que movemos el seed a Java, necesitamos el equivalente de Java — y ese es `CommandLineRunner`, una interfaz de `org.springframework.boot`. Su contrato es un único método:

```java
void run(String... args) throws Exception;
```

El trato es simple: **si un bean de Spring implementa `CommandLineRunner`, Spring llama a su método `run(...)` una vez, automáticamente, justo después de que el contexto de la aplicación haya terminado de cargar.** "Después de que el contexto haya cargado" es la frase clave — cuando `run()` se ejecuta, cada bean ya está construido e inyectado, así que dentro puedes usar libremente el `UserRepository` y el `PasswordEncoder`. Eso es exactamente lo que necesita un seed.

Los `String... args` son los argumentos de línea de comandos pasados al programa (los mismos que recibe `main`). TimeTrack no los usa — pero la firma la fija la interfaz, así que mantienes el parámetro aunque esté vacío.

> **Por qué `implements CommandLineRunner` no es opcional — el mecanismo.** Spring encuentra estos ganchos por *tipo*. Al arrancar recorre el contexto buscando cada bean que sea-un `CommandLineRunner` y llama al `run()` de cada uno. Si tu clase no implementa la interfaz, no es un `CommandLineRunner`, el escaneo de arranque de Spring nunca la selecciona, y tu método `run()` es — en lo que al framework respecta — solo un método corriente al que nadie llama. El seed sencillamente nunca ocurriría. Es la misma idea de "Spring reacciona a un tipo/contrato" que un repositorio siendo encontrado porque extiende `JpaRepository`.

> **Qué hace aquí `@Override`.** `@Override` sobre `run()` le dice al compilador "este método está cumpliendo un método de una superclase o interfaz" — y el compilador entonces *verifica* que ese método realmente existe en el contrato (mismo nombre, mismos parámetros). Si no tuvieras `implements CommandLineRunner`, la anotación fallaría al compilar con `method does not override or implement a method from a supertype` — un aviso temprano útil de que falta el contrato, cazado en tiempo de compilación en vez de como un fallo silencioso en tiempo de ejecución.

> **`CommandLineRunner` vs `ApplicationRunner`.** Spring ofrece un hermano casi idéntico, `ApplicationRunner`, cuyo `run(ApplicationArguments args)` recibe los argumentos ya parseados en opciones y valores en lugar de un `String[]` crudo. Para un seed que ignora sus argumentos por completo, cualquiera vale; `CommandLineRunner` es el default más simple. Recurre a `ApplicationRunner` solo cuando de verdad necesitas leer argumentos parseados `--flag=value`.

## `@Value` — traer una sola propiedad a un campo

Propósito: leer las tres propiedades `app.admin.*` en el componente para que el seed use valores configurados, no hardcodeados.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/config/DataInitializer.java`
Docs: [Baeldung — @Value in Spring](https://www.baeldung.com/spring-value-annotation) → read: "Setting @Value from Property Files"

`@Value("${alguna.propiedad}")` sobre un campo le dice a Spring que resuelva esa propiedad en el momento de crear el bean e inyecte el resultado. Aquí recorre toda la cadena que construimos: `app.admin.password` está definida en `application-dev.properties` como `${ADMIN_PASSWORD}`, que a su vez se resuelve a la variable de entorno `ADMIN_PASSWORD` — así que el campo acaba conteniendo la contraseña en texto plano que aportó tu máquina.

```java
@Value("${app.admin.email}")
private String adminEmail;

@Value("${app.admin.password}")
private String adminPassword;

@Value("${app.admin.name}")
private String adminName;
```

> **¿Por qué propiedades en vez de escribir los valores en el Java?** La misma razón por la que no hardcodeamos el hash: los datos que cambian por entorno (o que son secretos) pertenecen a la configuración, no al código. El email y el nombre están aquí sobre todo por consistencia y para mantener la clase libre de magic strings; la contraseña está aquí porque *tiene* que venir de un secreto. Inyectar vía `@Value` mantiene el componente idéntico en todos los entornos — solo cambia la configuración detrás.

> **`@Value` vs inyección por constructor — por qué el repositorio y el encoder usan el constructor.** Fíjate en que la clase mezcla dos estilos de inyección: `userRepository` y `passwordEncoder` entran por el constructor, mientras que las tres cadenas entran por campos `@Value`. Eso es deliberado. La inyección por constructor es el estilo preferido para *beans* (ver [03-inyeccion-dependencias.md](03-inyeccion-dependencias.md) — hace las dependencias explícitas y el objeto testeable), pero `@Value` es la herramienta directa para sacar *escalares de configuración* como una cadena o un número de las propiedades. Distinto tipo de dependencia, distinto mecanismo.

## Juntándolo todo — el seed idempotente

Propósito: ver cómo las cuatro piezas se combinan en el `DataInitializer` real, y por qué importa la comprobación de existencia.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/config/DataInitializer.java`

Aquí está el componente entero. Léelo como los cuatro mecanismos de arriba, ensamblados:

```java
@Component
@Profile("dev")                                  // solo existe en dev
public class DataInitializer implements CommandLineRunner {   // Spring llama a run() al arrancar

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")    private String adminEmail;
    @Value("${app.admin.password}") private String adminPassword;
    @Value("${app.admin.name}")     private String adminName;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            return;                              // ya sembrado — no hacer nada
        }

        User admin = new User();
        admin.setName(adminName);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));  // el hash se construye AQUÍ, en runtime
        admin.setRole(Role.MANAGER);
        admin.setActive(true);

        userRepository.save(admin);
    }
}
```

- **`passwordEncoder.encode(adminPassword)`** es la línea que cierra el agujero de seguridad. La contraseña en texto plano vino de la env var `ADMIN_PASSWORD`; el hash BCrypt se calcula justo aquí, en memoria, en el instante en que la app arranca. Ningún hash se guarda jamás en el código fuente, así que no hay nada en git que crackear. `passwordEncoder` es el mismo bean `BCryptPasswordEncoder` definido en `SecurityConfig` y usado para verificar logins — sembrar y verificar comparten un encoder, así que el ida y vuelta está garantizado consistente.
- **`if (...isPresent()) return;`** hace el runner **idempotente** — seguro de ejecutar repetidamente sin efecto adicional. Esto importa porque `run()` se dispara en *cada* arranque, no solo en el primero. Sin la guarda, el segundo arranque intentaría insertar un segundo `manager@timetrack.com` y chocaría con la restricción `unique` del `email`, lanzando una excepción a mitad del arranque. La guarda es el equivalente en Java del antiguo `ON CONFLICT (email) DO NOTHING` de SQL — misma intención (insertar solo si no existe), expresada en código en vez de en la base de datos.

> **Qué significa "idempotente" y por qué el código de arranque debe serlo.** Una operación es idempotente cuando hacerla una vez y hacerla cinco veces dejan el sistema en el mismo estado. El seeding es un caso clásico: la cuenta debe existir después de que la app haya corrido, sea su primer arranque o el número cincuenta. Cualquier código que corre en cada arranque — seeds, migraciones, calentamientos de caché — tiene que escribirse así, porque no controlas cuántas veces se reinicia la app.

> **Borrar la fila sembrada tiene una trampa — la foreign key.** Si borras el manager para re-testear el seed, PostgreSQL puede negarse con `update or delete on table "users" violates foreign key constraint ... Key (id)=(51) is still referenced from table "time_entries"` (SQL state `23503`). Esa es la foreign key `time_entries.user_id` haciendo su trabajo: por defecto una foreign key es `ON DELETE RESTRICT`, así que no puedes borrar un usuario mientras algún fichaje siga referenciándolo. Borra primero las filas hijas (`DELETE FROM time_entries WHERE user_id = 51;`) y luego el usuario. Esto es la base de datos protegiéndote de filas huérfanas — el default seguro para una app de fichajes, donde cascadear el borrado de un usuario hacia todo su historial sería un desastre.

---

Con los perfiles en su sitio, el mismo jar puede ahora comportarse distinto por entorno sin un solo cambio de código — que es justo la capacidad en la que se apoya la siguiente fase. El Step 11 empaqueta TimeTrack en Docker, y el contenedor correrá un perfil de estilo `prod` donde este seed **no** existe y la configuración real (URL de la base de datos, secretos) viene del entorno, no de un archivo commiteado en el repo.
