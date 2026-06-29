# Anotaciones

> 📖 [Oracle Docs — Annotations](https://docs.oracle.com/javase/tutorial/java/annotations/index.html)

Una anotación es metadata añadida al código — una etiqueta que da información extra al compilador o a un framework. Las anotaciones no se ejecutan por sí solas. Son señales que algo más lee y sobre las que actúa.

---

## Qué hacen las anotaciones

Hay tres consumidores de anotaciones:

| Consumidor | Cuándo las lee | Ejemplos |
|------------|----------------|---------|
| Compilador | Tiempo de compilación | `@Override`, `@SuppressWarnings` |
| Herramientas de build | Tiempo de build | `@Generated` |
| Framework / JVM | Tiempo de ejecución | `@Service`, `@Autowired`, `@Transactional` |

Spring Boot lee sus anotaciones en tiempo de ejecución usando **reflection** — escanea el classpath, encuentra clases con `@Component` / `@Service` / `@Repository`, y las registra como beans automáticamente.

---

## Anotaciones built-in de Java

```java
// @Override — el compilador verifica que realmente estás sobreescribiendo un método padre
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

Estas van en tu propia definición de anotación para controlar su comportamiento:

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)         // dónde se puede usar la anotación
@Retention(RetentionPolicy.RUNTIME) // cuándo está disponible la anotación
public @interface Log {
    String message() default "called";
}
```

### `@Retention` — cuánto tiempo vive la anotación

| Valor | Significado | Uso común |
|-------|-------------|-----------|
| `SOURCE` | Eliminada antes de la compilación | Solo herramientas de desarrollo |
| `CLASS` | Guardada en bytecode, no en runtime | Por defecto |
| `RUNTIME` | Disponible en runtime via reflection | **Spring Boot necesita esto** |

Las anotaciones de Spring Boot usan `@Retention(RUNTIME)` para que el framework pueda leerlas cuando arranca la aplicación.

### `@Target` — dónde se puede colocar la anotación

| Valor | Dónde |
|-------|-------|
| `TYPE` | Clase, interface, enum |
| `METHOD` | Método |
| `FIELD` | Campo |
| `PARAMETER` | Parámetro de método |
| `CONSTRUCTOR` | Constructor |

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

### Anotaciones de bean — registrar una clase como objeto gestionado por Spring

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
    // No se necesita @Autowired desde Spring Boot 4.3+
    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }
}
```

**Por qué se prefiere la inyección por constructor:**
- `final` funciona — el campo no puede reasignarse accidentalmente
- Fácil de testear — pasa un mock en el constructor sin Spring
- Hace visibles las dependencias — ves lo que necesita la clase solo leyendo el constructor

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

### Anotaciones de entidad (JPA)

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

### Gestión de transacciones

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
