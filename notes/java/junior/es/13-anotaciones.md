# Anotaciones

> 📖 [Baeldung — Java Annotations](https://www.baeldung.com/java-annotations)
> 📖 [Oracle Docs — Annotations](https://docs.oracle.com/javase/tutorial/java/annotations/index.html)

Con los enums, las fechas y las horas ya puedes modelar los datos de tu dominio. Lo siguiente que hay que entender no es un tipo de dato en absoluto — es el mecanismo de metadata que gobierna cada clase de Spring que estás a punto de escribir. Ya te lo cruzaste de pasada: las etiquetas `@Entity`, `@Column` y `@PrePersist` de la nota de fechas hacían que una clase Java normal se comportara de formas especiales. Este fichero explica cómo funciona eso.

Antes de Spring Boot, configurabas el framework en ficheros XML — cientos de líneas solo para registrar servicios y conectar dependencias. Las anotaciones reemplazaron todo eso. En lugar de un fichero de configuración separado, pones una etiqueta directamente en la clase o el método y el framework la lee. Eso es exactamente lo que es una anotación: metadata pegada al código que un compilador o un framework lee y procesa. Las anotaciones no se ejecutan por sí solas — son señales que algo más interpreta.

---

## Qué hacen las anotaciones

Una anotación es inerte por sí sola; algo tiene que leerla. Hay tres lectores posibles, y *cuál* de ellos lee una anotación concreta decide cuándo surte efecto:

| Consumidor | Cuándo la lee | Ejemplos |
|------------|---------------|---------|
| Compilador | Tiempo de compilación | `@Override`, `@SuppressWarnings` |
| Herramientas de build | Tiempo de build | `@Generated` |
| Framework / JVM | Tiempo de ejecución | `@Service`, `@Autowired`, `@Transactional` |

Lee cada fila así: *este lector* mira la anotación *en este momento* — así que `@Override` se comprueba mientras compilas y ya no existe cuando el programa se ejecuta, mientras que `@Service` no hace nada en tiempo de compilación y solo importa una vez que la app está corriendo.

Spring Boot es un lector de tiempo de ejecución: lee sus anotaciones mientras la aplicación arranca, usando **reflection** — recorre el classpath, encuentra clases que llevan `@Component` / `@Service` / `@Repository`, y las registra como beans automáticamente.

> **¿Qué es reflection?** Reflection es la capacidad de la JVM de inspeccionar su propio código *en tiempo de ejecución* — de preguntarle a una clase cargada "¿cómo te llamas? ¿qué métodos tienes? ¿qué anotaciones llevas?" y luego actuar según la respuesta. Normalmente tu código llama a métodos que fue escrito para conocer; con reflection, un framework puede mirar una clase que nunca ha visto antes, descubrir una etiqueta `@Service` en ella y decidir gestionarla — todo mientras el programa se está ejecutando. Así es exactamente como Spring lee tus anotaciones: no las "ejecuta", las *mira* y reacciona. Quédate con esta palabra — es el mecanismo que sostiene toda la parte de Spring de este fichero.

El flujo, de principio a fin, es siempre el mismo:

```
@Service en una clase   ← escribes la anotación en el código fuente
        │
        ▼
@Retention(RUNTIME)     ← la política de retención la mantiene viva hasta el programa en ejecución
        │
        ▼
reflection la lee       ← al arrancar, el framework inspecciona la clase y ve la etiqueta
        │
        ▼
el framework actúa      ← Spring registra la clase como bean e inyecta sus dependencias
```

---

## Anotaciones built-in de Java

Antes de conocer las anotaciones de Spring, ayuda ver el puñado que viene con el propio lenguaje. Estas las lee el **compilador**, no un framework, así que surten efecto mientras compilas — atrapan errores o silencian avisos en lugar de conectar comportamiento en tiempo de ejecución.

```java
// @Override — el compilador verifica que realmente estás sobrescribiendo un método padre
// si cometes un typo, es un error de compilación en lugar de un bug silencioso
@Override
public String toString() {
    return "Employee{name=" + name + "}";
}

// @Deprecated — marca algo como obsoleto; el compilador muestra un aviso cuando se usa
@Deprecated
public void oldMethod() { ... }

// @SuppressWarnings — le dice al compilador que deje de mostrar un aviso específico
@SuppressWarnings("unchecked")
public List getData() { ... }

// @FunctionalInterface — el compilador verifica que hay exactamente un método abstracto
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}
```

---

## Meta-anotaciones — anotaciones para anotaciones

La mayoría de los días *usas* anotaciones que definió otra persona. De vez en cuando defines las tuyas propias — y ahí es donde entran las meta-anotaciones: anotaciones que colocas en *la definición de tu anotación* para controlar su comportamiento. Aquí tienes una anotación personalizada completa:

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)         // dónde se puede usar la anotación
@Retention(RetentionPolicy.RUNTIME) // cuándo está disponible la anotación
public @interface Log {
    String message() default "called";
}
```

> **`@interface` declara un tipo de anotación totalmente nuevo.** No es un typo de `interface`. La `@` de delante le dice al compilador "estoy definiendo una anotación nueva, no una interface corriente". Después de esto, `@Log` se convierte en una anotación real que puedes colocar en cualquier método — la has inventado tú.

> **Los "métodos" de una anotación son en realidad sus atributos.** Dentro de `@interface Log`, la línea `String message() default "called";` parece un método pero declara un *elemento* — un dato que la anotación puede llevar. `String` es su tipo, `message` su nombre, y `default "called"` lo hace opcional: escribe `@Log` y `message` vale `"called"`; escribe `@Log(message = "saving employee")` y lo sobrescribes. Los elementos son la forma en que anotaciones como `@Column(name = "first_name", nullable = false)` llevan su configuración — cada uno de esos es un elemento declarado exactamente de esta manera.

### `@Retention` — cuánto tiempo vive la anotación

| Valor | Significado | Uso común |
|-------|-------------|-----------|
| `SOURCE` | Eliminada antes de la compilación | Solo herramientas de desarrollo |
| `CLASS` | Guardada en bytecode, no en runtime | Por defecto |
| `RUNTIME` | Disponible en runtime via reflection | **Spring Boot necesita esto** |

Lee cada fila así: esta política mantiene la anotación viva *hasta este punto* y luego desaparece — `SOURCE` muere antes de la compilación, `CLASS` sobrevive dentro del fichero `.class` pero no llega al programa en ejecución, `RUNTIME` sobrevive todo el camino hasta la aplicación viva.

> **Por esto `@Retention(RUNTIME)` es obligatorio para Spring.** Recuerda que Spring lee sus anotaciones con reflection *mientras la app se ejecuta*. Reflection solo puede ver lo que sigue presente en tiempo de ejecución — y solo la retención `RUNTIME` mantiene una anotación ahí. Si `@Service` tuviera retención `CLASS`, se eliminaría antes de que tu programa arranque, reflection no encontraría nada, y Spring nunca registraría el bean. La política de retención y la lectura por reflection son dos mitades del mismo mecanismo: la retención pone la etiqueta donde reflection puede alcanzarla.

### `@Target` — dónde se puede colocar la anotación

| Valor | Dónde |
|-------|-------|
| `TYPE` | Clase, interface, enum |
| `METHOD` | Método |
| `FIELD` | Campo |
| `PARAMETER` | Parámetro de método |
| `CONSTRUCTOR` | Constructor |

Lee cada fila así: nombrar este valor en `@Target` permite la anotación sobre ese tipo de elemento de código — enumera varios para permitir varios, y usar la anotación en cualquier otro sitio se convierte en un error de compilación.

---

## El patrón que se repite: las anotaciones reemplazan la configuración

Antes de Spring Boot, configurabas los beans en ficheros XML. Las anotaciones reemplazaron eso:

```xml
<!-- Configuración XML antigua de Spring -->
<bean id="employeeService" class="com.example.EmployeeService">
    <property name="repository" ref="employeeRepository"/>
</bean>
```

```java
// Spring Boot moderno — la anotación hace lo mismo
@Service
public class EmployeeService {
    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }
}
```

La anotación le dice a Spring que gestione esta clase como un bean. El constructor le dice a Spring qué inyectar. Sin XML.

---

## Anotaciones de Spring Boot que usarás cada día

> **Vista previa — Spring Boot:** Todo lo que viene a partir de aquí es territorio de Spring Boot. Aún no has estudiado Spring Boot — lee esto como un mapa de lo que está por venir. Cada anotación tiene su propia sección dedicada en las notas de Spring Boot, donde la implementarás en código real.

### Anotaciones de bean — registrar una clase como objeto gestionado por Spring

Cuando Spring arranca tu aplicación, recorre todos tus paquetes, y para cada clase usa reflection para inspeccionar las etiquetas que lleva. Como estas anotaciones son `@Retention(RUNTIME)`, la etiqueta sigue presente en el programa en ejecución para que reflection la encuentre — es el mecanismo de la sección anterior en acción, no uno nuevo. Cuando ve `@Component` (o una de sus variantes), Spring crea una instancia de la clase (un bean) y la gestiona a partir de entonces — conectando dependencias, gestionando transacciones, etc. Los cuatro estereotipos siguientes son variaciones de `@Component`; solo se diferencian en qué capa marcan, lo que ayuda tanto a Spring como a ti a entender de un vistazo el rol de cada clase.

```java
@Component   // bean genérico de Spring
@Service     // marca la capa de servicio (igual que @Component, mejor intención)
@Repository  // marca la capa de datos (igual que @Component + envuelve excepciones JPA)
@Controller  // marca un controlador web (devuelve vistas)
@RestController // @Controller + @ResponseBody — para APIs REST (devuelve JSON)
```

### Inyección de dependencias

```java
// Inyección por campo — funciona pero evítala en código nuevo
@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository repository;
}

// Inyección por constructor — preferida
@Service
public class EmployeeService {
    private final EmployeeRepository repository;

    // Spring detecta el único constructor e inyecta automáticamente
    // No se necesita @Autowired desde Spring Framework 4.3+ (incluido en todo Spring Boot actual)
    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }
}
```

**Por qué se prefiere la inyección por constructor:**
- `final` funciona — el campo no puede reasignarse accidentalmente
- Fácil de testear — pasa un mock en el constructor sin Spring
- Hace visibles las dependencias — ves lo que necesita la clase solo leyendo el constructor

> **La inyección por campo esconde una trampa al testear.** Con `@Autowired` sobre un campo privado no hay forma de asignar ese campo desde un test plano — no tiene setter ni parámetro de constructor, así que fuera de Spring no puedes pasar un repository de mentira (mock), y el campo se queda en `null`. La inyección por constructor elimina la trampa: la dependencia es simplemente un argumento del constructor, así que un test entrega un mock en una línea sin ningún contexto de Spring. Por esto los equipos estandarizan la inyección por constructor y tratan la inyección por campo como legacy.

### Anotaciones de REST controller

```java
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) { ... }

    @PostMapping
    public ResponseEntity<Employee> create(@RequestBody EmployeeDTO dto) { ... }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable Long id, @RequestBody EmployeeDTO dto) { ... }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { ... }
}
```

| Anotación | Propósito |
|-----------|-----------|
| `@RestController` | Marca esta clase como REST controller — devuelve JSON |
| `@RequestMapping` | URL base para todos los métodos de esta clase |
| `@GetMapping` | Maneja HTTP GET |
| `@PostMapping` | Maneja HTTP POST |
| `@PutMapping` | Maneja HTTP PUT |
| `@DeleteMapping` | Maneja HTTP DELETE |
| `@PathVariable` | Extrae un valor del path de la URL (`/employees/{id}`) |
| `@RequestBody` | Lee el cuerpo de la petición como objeto Java (JSON → objeto) |
| `@RequestParam` | Lee un parámetro de query de la URL (`?status=ACTIVE`) |

Lee cada fila así: pon esta anotación *ahí* y Spring conecta *esa* parte de la petición HTTP con tu método — las de mapeo (`@GetMapping` y compañía) enrutan una URL y un verbo hacia el método, las de parámetro (`@PathVariable`, `@RequestBody`, `@RequestParam`) extraen un trozo de la petición entrante hacia un argumento.

### Anotaciones de entidad (JPA)

JPA es el estándar que mapea una clase Java a una tabla de base de datos, y hace el mapeo enteramente mediante anotaciones — cada etiqueta le dice a JPA cómo una parte de la clase se corresponde con la tabla. Las conocerás a fondo en las notas de Spring Boot; por ahora, léelas como la contraparte JPA de las anotaciones REST de arriba.

```java
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
```

| Anotación | Propósito |
|-----------|-----------|
| `@Entity` | Marca esta clase como una entidad mapeada a tabla que JPA gestionará |
| `@Table` | Fija el nombre de la tabla (por defecto el nombre de la clase si se omite) |
| `@Id` | Marca el campo que mapea a la clave primaria |
| `@GeneratedValue` | Deja que la base de datos genere el id (`IDENTITY` = columna auto-incremental) |
| `@Column` | Configura la columna mapeada — nombre, `nullable`, `length`, `updatable` |
| `@Enumerated(EnumType.STRING)` | Guarda un enum como su nombre de texto en lugar de su número ordinal |
| `@PrePersist` | Ejecuta este método automáticamente justo antes de insertar la fila por primera vez |

Lee cada fila así: esta anotación mapea *esta parte de la clase* a *esa parte de la tabla* — `@Entity`/`@Table` mapean la clase en sí, `@Id`/`@GeneratedValue`/`@Column`/`@Enumerated` mapean campos individuales a columnas, y `@PrePersist` engancha un método al ciclo de vida del guardado.

### Gestión de transacciones

Una **transacción** es un grupo de operaciones de base de datos que deben tener éxito todas juntas o deshacerse todas juntas — nunca aplicarse a medias. El caso clásico es un método que cambia dos filas: si el primer `save()` funciona y el segundo lanza una excepción, no debes dejar la base de datos en un estado a medio cambiar. `@Transactional` te da esa garantía: Spring abre una transacción cuando el método arranca, la confirma (commit) si el método termina con normalidad, y **revierte** (rollback) todos los cambios (como si ninguno hubiera ocurrido) si el método lanza una excepción. La pones en el método del servicio, y Spring envuelve todo el cuerpo del método por ti.

> **¿Cómo puede una sola anotación envolver un método entero?** Spring no modifica tu código — al arrancar construye un **proxy**: un objeto envoltorio generado que se coloca delante de tu bean. Quien llama sostiene en realidad el proxy, no tu clase. Cuando llega una llamada, el proxy abre la transacción, luego delega en tu método real, y luego hace commit o rollback según si lanzó o no. Es la misma maquinaria de reflection-más-runtime del principio del fichero: como `@Transactional` tiene retención `RUNTIME`, Spring puede verla al arrancar y decidir construir el proxy. Estudiarás los proxies a fondo en las notas de Spring Boot.

```java
@Service
public class EmployeeService {

    // Envuelve el método en una transacción de base de datos
    // Si el método lanza una excepción, Spring revierte todos los cambios
    @Transactional
    public void transferDepartment(Long employeeId, Long newDeptId) {
        Employee emp = repository.findById(employeeId).orElseThrow(...);
        Department dept = deptRepository.findById(newDeptId).orElseThrow(...);
        emp.setDepartment(dept);
        repository.save(emp);
        // si save() lanza, se revierte todo el método
    }
}
```

---

## Referencia rápida — familias de anotaciones

| Familia | Anotaciones |
|---------|-------------|
| Registro de beans | `@Component`, `@Service`, `@Repository`, `@RestController` |
| Inyección | `@Autowired`, `@Qualifier`, `@Value` |
| REST | `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PathVariable`, `@RequestBody` |
| JPA | `@Entity`, `@Table`, `@Id`, `@Column`, `@GeneratedValue`, `@Enumerated` |
| Ciclo de vida | `@PrePersist`, `@PostLoad` |
| Transacciones | `@Transactional` |
| Validación | `@NotNull`, `@NotBlank`, `@Min`, `@Max`, `@Email` |
| Manejo de excepciones | `@ControllerAdvice`, `@ExceptionHandler` |
| Configuración | `@Configuration`, `@Bean`, `@Value` |

Lee cada fila así: un *trabajo* a la izquierda, y las anotaciones a las que echas mano para hacer ese trabajo a la derecha — úsala como consulta cuando sepas *qué* quieres lograr pero no *cuál* anotación lo hace.

---

Cada una de estas anotaciones de Spring y JPA llega a tu proyecto como una librería — `spring-boot-starter-web` trae las de REST, `spring-boot-starter-data-jpa` trae `@Entity` y compañía. Algo tiene que descargar esas librerías y ponerlas en el classpath para que las anotaciones siquiera existan y puedan leerse. Ese es el trabajo de la herramienta de build, y es el siguiente fichero: `notes/java/junior/es/14-maven.md`.
