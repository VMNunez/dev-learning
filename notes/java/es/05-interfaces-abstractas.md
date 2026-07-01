# Interfaces y Clases Abstractas

> 📖 [Oracle Docs — Interfaces and inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/index.html)
> 📖 [Spring Security — DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html) — cómo encaja `UserDetailsService` en el flujo de login completo

## Interface

Imagina que quieres escribir un método que pueda imprimir cualquier cosa — un empleado, un pedido, un informe. No sabes qué tipo de objeto le llegará, pero sí sabes que necesita tener un método `print()`. Las interfaces resuelven exactamente este problema.

Una interfaz define un **contrato**: una lista de métodos que cualquier clase que la implemente está obligada a tener. La interfaz no dice cómo se implementan esos métodos — solo exige que existan. Piénsalo como una promesa escrita: "cualquier clase que firme este contrato garantiza que tiene estos métodos."

```java
public interface Printable {
    void print();        // sin cuerpo — solo la firma del método
    String getSummary(); // cualquier clase que implemente Printable DEBE tener estos dos
}
```

Cuando una clase implementa una interfaz con `implements`, **debe** proporcionar todos los métodos declarados en ella — sin excepción. No puedes implementar la interfaz y dejar algún método sin escribir: el compilador te da error. La única excepción son los métodos `default` (ver más abajo), que ya tienen implementación propia y son opcionales de sobreescribir.

Una clase que implementa la interfaz debe proporcionar todos los métodos:

```java
public class Employee implements Printable {
    private String name;

    @Override
    public void print() {
        System.out.println("Employee: " + name);
    }

    @Override
    public String getSummary() {
        return "Name: " + name;
    }
}
```

### Una clase puede implementar múltiples interfaces

```java
public class Employee implements Printable, Exportable, Auditable {
    // debe implementar TODOS los métodos de las tres interfaces — sin excepción
    // (salvo los que tengan implementación default, que son opcionales)
}
```

### Métodos default (Java 8+)

Antes de Java 8, las interfaces solo podían tener métodos sin implementación. Java 8 introdujo los métodos `default`: métodos con implementación dentro de la interfaz que las clases que la implementan **no están obligadas a sobreescribir**. Si la clase no lo sobreescribe, usa la implementación de la interfaz tal cual. Si lo sobreescribe, usa la suya propia.

Esto permite añadir nuevos métodos a una interfaz sin romper todas las clases que ya la implementan — si añades un método `default`, las clases existentes lo heredan sin tener que cambiar nada:

```java
public interface Printable {
    void print();

    default String getLabel() {
        return "Printable item";   // implementación por defecto
    }
}
```

---

## Clase abstracta

Una clase abstracta es una **implementación parcial** — puede tener métodos concretos (con cuerpo) y métodos abstractos (sin cuerpo). No se puede instanciar directamente.

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // Método concreto — ya implementado
    public void breathe() {
        System.out.println(name + " is breathing");
    }

    // Método abstracto — las subclases DEBEN implementarlo
    public abstract void makeSound();
}
```

Una subclase que extiende una clase abstracta debe implementar todos los métodos abstractos:

```java
public class Dog extends Animal {
    public Dog(String name) {
        super(name);   // llama al constructor del padre
    }

    @Override
    public void makeSound() {
        System.out.println(name + " says: Woof!");
    }
}

Dog dog = new Dog("Rex");
dog.breathe();      // "Rex is breathing"  — de Animal
dog.makeSound();    // "Rex says: Woof!"   — de Dog
```

Una clase solo puede extender **una** clase abstracta. Esta es la diferencia clave con las interfaces.

---

## Interface vs Clase abstracta

|             | Interface                                       | Clase abstracta                            |
| ----------- | ----------------------------------------------- | ------------------------------------------ |
| Métodos     | Abstractos por defecto; pueden tener `default`  | Puede tener abstractos y concretos         |
| Campos      | Solo constantes `public static final`           | Puede tener cualquier campo                |
| ¿Múltiples? | Una clase puede implementar muchas              | Una clase solo puede extender una          |
| Constructor | No                                              | Sí                                         |
| Cuándo usar | Definir una capacidad que una clase puede tener | Definir un tipo base con lógica compartida |

**Interface:** "Esta clase puede hacer X" — `Printable`, `Exportable`, `Comparable`
**Clase abstracta:** "Esta clase ES un tipo de X" — `Animal`, `Shape`, `BaseService`

---

## Interfaces funcionales (Java 8+)

Una interfaz con exactamente **un** método abstracto. Se usa con lambdas:

```java
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}

// Se usa con una lambda
Validator emailValidator = value -> value.contains("@");
emailValidator.validate("test@email.com");   // true
```

Las interfaces funcionales más comunes ya disponibles:

| Interface        | Método              | Usada para                                          |
| ---------------- | ------------------- | --------------------------------------------------- |
| `Predicate<T>`   | `boolean test(T t)` | filtrar — `list.stream().filter(e -> e.isActive())` |
| `Function<T, R>` | `R apply(T t)`      | transformar — `list.stream().map(e -> e.getName())` |
| `Consumer<T>`    | `void accept(T t)`  | consumir — `list.forEach(e -> save(e))`             |
| `Supplier<T>`    | `T get()`           | producir — `() -> new Employee()`                   |

Las usarás cada vez que trabajes con streams y lambdas.

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa clases de Spring Boot y Spring Security (`JpaRepository`, `UserDetailsService`, `UserDetails`, `@Service`) que aún no has estudiado. Léela para ver cómo funcionan las interfaces en un proyecto real. Lo implementarás todo en las notas de Spring Boot — vuelve entonces para entenderlo en profundidad.

Spring Boot usa interfaces extensivamente:

```java
// JpaRepository es una interfaz — Spring genera la implementación
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartment(String department);
}

// UserDetailsService es una interfaz — tú la implementas para la autenticación
public class UserDetailsServiceImpl implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) { ... }
}
```

Cuando escribes `implements JpaRepository` o `implements UserDetailsService`, estás siguiendo el contrato de interfaz que Spring Boot espera.

### Por qué existe `UserDetailsService` — el enchufe y el tomacorriente

Spring Security necesita cargar un usuario cuando llega una petición. Pero Spring Security no sabe nada de tu base de datos — no sabe que tienes una entidad `User` o un `UserRepository`.

Así que Spring Security define una interfaz con un método:

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

Este es el **tomacorriente**. Spring Security sabe cómo llamarlo, pero no proporciona la implementación.

Tu trabajo es construir el **enchufe** — una clase que implemente esta interfaz y la conecte a tu base de datos:

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
```

Cuando Spring Security necesita un usuario, llama a `loadUserByUsername` en tu implementación — y tu código va a la base de datos a buscarlo.

> `username` en Spring Security significa el identificador de login. En TimeTrack ese es el email — no un campo username separado. El nombre del parámetro está fijado por la interfaz; lo que contiene realmente depende de tu aplicación.
