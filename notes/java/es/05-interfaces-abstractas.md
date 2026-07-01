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

> **Sobre los métodos implícitamente abstractos:** todos los métodos que declaras en una interfaz sin cuerpo son implícitamente `abstract` — Java añade esa palabra en segundo plano. Por eso cada clase que implementa la interfaz tiene que definir todos sus métodos. No ves la palabra `abstract` escrita, pero está ahí. La única excepción son los métodos `default`, que ya tienen cuerpo y son opcionales.

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

Usa una clase abstracta cuando varias clases comparten la misma _implementación_ — no solo el mismo contrato. Una interfaz dice "debes tener este método"; una clase abstracta dice "aquí tienes parte de la implementación, rellena el resto". No puedes crear una instancia de una clase abstracta directamente — solo existe para ser extendida.

Tu razonamiento es correcto: una clase abstracta es esencialmente una clase padre que agrupa campos y métodos compartidos por todas sus subclases — eso es herencia. La clave está en la palabra `abstract` delante de un método: significa que ese método **no tiene cuerpo en la clase padre**. La clase abstracta solo declara que el método existe, sin implementarlo. Cada subclase tiene que escribir su propia versión. Piénsalo como un contrato interno: "yo te doy `breathe()` ya implementado, pero tú debes implementar `makeSound()` porque solo cada animal sabe cuál es su propio sonido."

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // Método concreto — ya implementado, todas las subclases lo heredan
    public void breathe() {
        System.out.println(name + " is breathing");
    }

    // Método abstracto — sin cuerpo; las subclases DEBEN implementarlo
    public abstract void makeSound();
}
```

Una subclase que extiende una clase abstracta debe implementar todos los métodos abstractos. Los métodos concretos — los que ya tienen cuerpo en la clase abstracta — los heredas automáticamente sin tocar nada. La diferencia de palabras clave: `extends` para extender una clase (abstracta o no), `implements` para implementar una interfaz.

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

> **`super(name)`** llama al constructor de la clase padre. Cuando creas un objeto `Dog`, Java necesita inicializar primero la parte `Animal` — sus campos y su constructor. `super(...)` hace exactamente eso: ejecuta el constructor del padre con los argumentos que le pases. Siempre debe ser la primera línea del constructor de la subclase.

> **Sobre los tipos en Java:** cuando escribes `Dog dog = new Dog("Rex")`, `Dog` es el tipo porque tú definiste la clase `Dog`. En Java, cualquier clase que defines se convierte en un tipo válido — no hay inferencia ni magia del compilador. Es exactamente igual que `String name = "Rex"` o `int count = 5`, solo que usando tu propia clase como tipo.

Una clase solo puede extender **una** clase abstracta. Esta es la diferencia clave con las interfaces.

---

## Interface vs Clase abstracta

La decisión se reduce a una pregunta: ¿estás definiendo una _capacidad_ que una clase puede tener, o un _tipo base_ del que derivan otras clases? Usa una interfaz cuando clases sin relación entre sí necesitan compartir un contrato (`Printable` puede implementarlo `Employee`, `Invoice` o `Report` — no tienen nada más en común). Usa una clase abstracta cuando un grupo de clases relacionadas comparten código de implementación real que de otro modo se duplicaría.

Sí: una clase puede extender una clase abstracta e implementar varias interfaces al mismo tiempo. El orden en el código es fijo — primero `extends`, luego `implements`:

```java
public class Dog extends Animal implements Printable, Auditable {
    // heredas breathe() de Animal
    // debes implementar makeSound() (método abstracto de Animal)
    // debes implementar los métodos de Printable y Auditable
}
```

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

## ¿Puede una subclase añadir su propio constructor?

Sí, y es lo más habitual. Cuando una subclase define su propio constructor, puede añadir sus propios campos además de los del padre. La única condición es que `super(...)` debe ser la primera línea, para que el padre quede inicializado antes de añadir lo propio:

```java
public class Dog extends Animal {
    private String breed;   // campo propio de Dog, no existe en Animal

    public Dog(String name, String breed) {
        super(name);        // primero inicializas al padre
        this.breed = breed; // luego tus propios campos
    }
}
```

---

## Interfaces funcionales (Java 8+)

Antes de Java 8, pasar comportamiento a un método implicaba crear una clase entera para contener una sola línea de lógica. Las interfaces funcionales hacen posible eso sin tanto código: cualquier interfaz con exactamente **un** método abstracto puede implementarse con una lambda en lugar de con una clase. El método único es el que Java usa como destino cuando escribes la lambda — sabe a qué método llamar porque solo hay uno.

> Las lambdas aún no las hemos visto en detalle — se explican en [09-streams-lambdas.md](09-streams-lambdas.md). Por ahora, piensa en ellas como funciones anónimas compactas: una forma de escribir la implementación de un único método sin necesidad de crear una clase entera.

> La anotación `@FunctionalInterface` es opcional, pero úsala: el compilador te dará un error si añades accidentalmente un segundo método abstracto y rompes el contrato.

```java
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}
```

Una lambda es una función anónima en línea. La sintaxis básica es `parámetro -> expresión`: lo que está a la izquierda de la flecha es el parámetro de entrada, y lo que está a la derecha es lo que devuelve. Así, `value -> value.contains("@")` es equivalente a escribir una clase que implementa `Validator` con un cuerpo que hace `return value.contains("@");`. Java sabe a qué método apunta porque la interfaz solo tiene uno:

```java
// Se usa con una lambda
Validator emailValidator = value -> value.contains("@");
emailValidator.validate("test@email.com");   // true
```

Las interfaces funcionales más comunes ya vienen en Java — no las defines tú, simplemente las usas. Son contratos genéricos para los cuatro patrones que se repiten siempre con streams y lambdas:

| Interface        | Método              | Usada para                                          |
| ---------------- | ------------------- | --------------------------------------------------- |
| `Predicate<T>`   | `boolean test(T t)` | filtrar — `list.stream().filter(e -> e.isActive())` |
| `Function<T, R>` | `R apply(T t)`      | transformar — `list.stream().map(e -> e.getName())` |
| `Consumer<T>`    | `void accept(T t)`  | consumir — `list.forEach(e -> save(e))`             |
| `Supplier<T>`    | `T get()`           | producir — `() -> new Employee()`                   |

La `T` y la `R` son genéricos — significan "cualquier tipo". `Predicate<Employee>` es un predicado que recibe un `Employee`; `Function<Employee, String>` es una función que recibe un `Employee` y devuelve un `String`. Los genéricos se explican en detalle en [08-generics.md](08-generics.md).

Ejemplos concretos de uso sin streams, para ver cómo funciona cada una por sí sola:

```java
// Predicate — devuelve true o false
Predicate<String> isLong = s -> s.length() > 10;
isLong.test("Hola");          // false
isLong.test("Hello, World!"); // true

// Function — transforma un valor en otro
Function<String, Integer> toLength = s -> s.length();
toLength.apply("Hola");  // 4

// Consumer — recibe un valor y hace algo con él (sin devolver nada)
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hola");  // imprime "Hola"

// Supplier — no recibe nada y produce un valor
Supplier<String> greeting = () -> "Hola";
greeting.get();  // "Hola"
```

Las usarás cada vez que trabajes con streams y lambdas.

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa clases de Spring Boot y Spring Security (`JpaRepository`, `UserDetailsService`, `UserDetails`, `@Service`) que aún no has estudiado. Léela para ver cómo funcionan las interfaces en un proyecto real. Lo implementarás todo en las notas de Spring Boot — vuelve entonces para entenderlo en profundidad.

Spring Boot usa interfaces extensivamente. Hay dos patrones principales: interfaces que tú defines (y Spring genera la implementación), e interfaces de Spring que tú implementas (y Spring llama a tu código).

```java
// JpaRepository es una interfaz de Spring Data — Spring genera la implementación automáticamente
// Te da save(), findById(), findAll(), delete() y más sin escribir SQL
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartment(String department);
}

// UserDetailsService es una interfaz de Spring Security — tú la implementas
// para decirle a Spring cómo encontrar un usuario en TU base de datos
public class UserDetailsServiceImpl implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) { ... }
}
```

> **¿Por qué `EmployeeRepository` usa `extends` y no `implements`?** Porque en Java, las interfaces no implementan otras interfaces — las *extienden*. `extends` entre interfaces significa herencia de interfaz: `EmployeeRepository` hereda todas las firmas de método de `JpaRepository`. Solo las clases usan `implements`.

Cuando escribes `extends JpaRepository` o `implements UserDetailsService`, estás siguiendo el contrato de interfaz que Spring Boot espera. `JpaRepository` te da operaciones de base de datos sin escribir SQL. `UserDetailsService` le da a Spring Security la forma de encontrar un usuario por su identificador de login — sin esto, Spring Security no sabría cómo llegar a tu base de datos.

### Por qué existe `UserDetailsService` — el enchufe y el tomacorriente

Spring Security necesita cargar un usuario cuando llega una petición. Pero Spring Security no sabe nada de tu base de datos — no sabe que tienes una entidad `User` o un `UserRepository`.

Así que Spring Security define una interfaz con un método. Esta interfaz forma parte de la dependencia `spring-security-core` que añadiste en el `pom.xml` — no la escribes tú:

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

Este es el **tomacorriente**: Spring Security sabe llamar a este método cuando llega una petición de login, pero no proporciona la implementación porque no conoce tu base de datos. El tomacorriente define la forma del enchufe; tú construyes el enchufe.

Tu trabajo es construir el **enchufe** — una clase que implemente esta interfaz y conecte Spring Security a tu base de datos:

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

`UserRepository` es tu propio repositorio JPA (el que extiende `JpaRepository`). Cuando llamas a `userRepository.findByEmail(username)`, Spring Data genera automáticamente el SQL `SELECT * FROM users WHERE email = ?` a partir del nombre del método. Spring Security no sabe nada de esto — solo llama a `loadUserByUsername()` en tu clase y recibe el resultado.

Cuando Spring Security necesita un usuario, llama a `loadUserByUsername` en tu implementación — y tu código va a la base de datos a buscarlo.

> `username` en Spring Security significa el identificador de login. En TimeTrack ese es el email — no un campo username separado. El nombre del parámetro está fijado por la interfaz; lo que contiene realmente depende de tu aplicación.
